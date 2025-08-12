import type { Pokemon } from "@/types/pokemon";
import { format, isValid, parse, startOfDay } from "date-fns";
import { FILTER_CONFIGS, comparePokemon } from "./configs";
import {
	DEFAULT_SORT_OPTION,
	type FilterOption,
	type Option,
	sortOptionSchema,
} from "./schemas";

function isFilterActive(key: keyof FilterOption, value: unknown): boolean {
	if (Array.isArray(value)) return value.length > 0;
	if (key === "implementationDateRange" && value && typeof value === "object") {
		const range = value as { from?: Date; to?: Date };
		return !!(range.from || range.to);
	}
	return false;
}

function getActiveFilters(filter: FilterOption) {
	return Object.entries(FILTER_CONFIGS).filter(([key]) => {
		const k = key as keyof FilterOption;
		return isFilterActive(k, filter[k]);
	});
}

export function hasActiveFilters(options: Option): boolean {
	return (
		getActiveFilters(options.filter).length > 0 ||
		options.sort !== DEFAULT_SORT_OPTION
	);
}

export function processPokemons(
	pokemons: Pokemon[],
	option: Option,
): Pokemon[] {
	const filters = getActiveFilters(option.filter);

	let result =
		filters.length === 0
			? pokemons
			: pokemons.filter((pokemon) =>
					filters.every(([key, config]) =>
						config.match(
							option.filter[key as keyof FilterOption] as never,
							pokemon,
						),
					),
				);

	if (option.sort !== DEFAULT_SORT_OPTION) {
		result = [...result].sort((a, b) => comparePokemon(a, b, option.sort));
	}

	return result;
}

function parseParam<T>(
	value: string | null,
	parser: (item: string) => T | null,
): T[] {
	if (!value) return [];
	const items = value
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);
	const parsed = items.map(parser).filter((item): item is T => item !== null);
	return parsed.filter(
		(item, index) =>
			parsed.findIndex(
				(existing) =>
					String(existing).toLowerCase() === String(item).toLowerCase(),
			) === index,
	);
}

function parseDate(value: string): Date | null {
	const date = parse(value, "yyyy-MM-dd", new Date());
	return isValid(date) ? startOfDay(date) : null;
}

export function parseSearchParams(params: URLSearchParams): Option {
	const filterResult = {} as Record<string, unknown>;

	for (const [key, config] of Object.entries(FILTER_CONFIGS)) {
		const filterKey = key as keyof FilterOption;

		if (config.type === "array") {
			filterResult[filterKey] = parseParam(params.get(filterKey), (item) => {
				const res = config.schema.safeParse(item);
				return res.success ? res.data : null;
			});
		} else if (config.type === "boolean") {
			filterResult[filterKey] = parseParam(params.get(filterKey), (item) =>
				item === "true" ? true : item === "false" ? false : null,
			);
		} else if (config.type === "dateRange") {
			const from = params.get("from");
			const to = params.get("to");
			if (from || to) {
				const range: { from?: Date; to?: Date } = {};
				if (from) {
					const date = parseDate(from);
					if (date) range.from = date;
				}
				if (to) {
					const date = parseDate(to);
					if (date) range.to = date;
				}
				filterResult[filterKey] =
					Object.keys(range).length > 0 ? range : undefined;
			}
		}
	}

	const sortValue = params.get("sort");
	const parsedSort = sortValue ? sortOptionSchema.safeParse(sortValue) : null;
	const sort = parsedSort?.success ? parsedSort.data : DEFAULT_SORT_OPTION;

	return { filter: filterResult as FilterOption, sort };
}

export function updateURLParams(
	params: URLSearchParams,
	options: Option,
): URLSearchParams {
	const result = new URLSearchParams(params);

	for (const [key, config] of Object.entries(FILTER_CONFIGS)) {
		const filterKey = key as keyof FilterOption;
		const value = options.filter[filterKey];

		if (config.type === "array") {
			const arr = value as string[];
			arr.length === 0
				? result.delete(filterKey)
				: result.set(filterKey, arr.join(","));
		} else if (config.type === "boolean") {
			const arr = value as boolean[];
			config.isEmpty(arr)
				? result.delete(filterKey)
				: result.set(filterKey, config.format(arr));
		} else if (config.type === "dateRange") {
			const range = value as { from?: Date; to?: Date } | undefined;
			if (!range || (!range.from && !range.to)) {
				result.delete("from");
				result.delete("to");
			} else {
				range.from
					? result.set("from", format(range.from, "yyyy-MM-dd"))
					: result.delete("from");
				range.to
					? result.set("to", format(range.to, "yyyy-MM-dd"))
					: result.delete("to");
			}
		}
	}

	options.sort !== DEFAULT_SORT_OPTION
		? result.set("sort", options.sort)
		: result.delete("sort");
	return result;
}

export function normalizeSearchParams(params: URLSearchParams): {
	options: Option;
	cleanedParams: URLSearchParams | null;
} {
	const options = parseSearchParams(params);
	const clean = updateURLParams(new URLSearchParams(), options);

	const value = params.get("page");
	if (value) clean.set("page", value);

	return {
		options,
		cleanedParams: params.toString() !== clean.toString() ? clean : null,
	};
}
