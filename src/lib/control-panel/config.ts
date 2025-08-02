import {
	pokemonClassSchema,
	pokemonFormSchema,
	pokemonTypeSchema,
	regionSchema,
} from "@/types/pokemon";
import type { Pokemon } from "@/types/pokemon";
import { z } from "zod";

// ===== SCHEMAS =====
export const implementedStatusSchema = z.boolean();
export const shinyImplementedStatusSchema = z.boolean();
export const pokemonTypeFilterOptionSchema = pokemonTypeSchema;

export const sortOptionSchema = z.enum([
	"pokedex-number-asc",
	"pokedex-number-desc",
	"name-asc",
	"name-desc",
]);

export const optionSchema = z.object({
	class: z.array(pokemonClassSchema),
	form: z.array(pokemonFormSchema),
	isImplemented: z.array(implementedStatusSchema),
	isShinyImplemented: z.array(shinyImplementedStatusSchema),
	pokemonType: z.array(pokemonTypeFilterOptionSchema),
	region: z.array(regionSchema),
	sort: sortOptionSchema,
});

export type Option = z.infer<typeof optionSchema>;
export type SortOption = z.infer<typeof sortOptionSchema>;

// ===== VALIDATION FUNCTIONS =====
const DEFAULT_SORT_OPTION = "pokedex-number-asc" as const;

function validateSingleParam<T>(
	value: string | null,
	schema: z.ZodSchema<T>,
	defaultValue: T,
): T {
	if (value === null) return defaultValue;
	const result = schema.safeParse(value);
	return result.success ? result.data : defaultValue;
}

export function validateSortOption(value: string | null) {
	return validateSingleParam(value, sortOptionSchema, DEFAULT_SORT_OPTION);
}

export function validateMultiParams<T>(
	searchParams: URLSearchParams,
	paramName: string,
	schema: z.ZodSchema<T>,
): { validItems: T[]; hasInvalidValues: boolean } {
	const paramValue = searchParams.get(paramName);
	if (!paramValue) {
		return { validItems: [], hasInvalidValues: false };
	}

	const items = paramValue
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

	const validItems: T[] = [];
	const seenValues = new Set<string>();
	let hasInvalidValues = false;

	for (const item of items) {
		const result = schema.safeParse(item);
		if (result.success) {
			const checkValue = String(result.data).toLowerCase();
			if (seenValues.has(checkValue)) {
				continue;
			}
			seenValues.add(checkValue);
			validItems.push(result.data);
		} else {
			hasInvalidValues = true;
		}
	}

	return { validItems, hasInvalidValues };
}

export function parseBooleanStatus(param: string | null): { validItems: boolean[]; hasInvalidValues: boolean } {
	if (!param) return { validItems: [], hasInvalidValues: false };
	
	const items = param.split(",");
	const validItems: boolean[] = [];
	let hasInvalidValues = false;
	
	for (const item of items) {
		if (item === "true" || item === "false") {
			validItems.push(item === "true");
		} else {
			hasInvalidValues = true;
		}
	}
	
	return { validItems, hasInvalidValues };
}

// ===== URL PARAMETER HELPERS =====
// パラメータ解析関数の定義
const PARAM_PARSERS = {
	class: (searchParams: URLSearchParams) => validateMultiParams(searchParams, "class", pokemonClassSchema),
	form: (searchParams: URLSearchParams) => validateMultiParams(searchParams, "form", pokemonFormSchema),
	isImplemented: (searchParams: URLSearchParams) => parseBooleanStatus(searchParams.get("isImplemented")),
	isShinyImplemented: (searchParams: URLSearchParams) => parseBooleanStatus(searchParams.get("isShinyImplemented")),
	pokemonType: (searchParams: URLSearchParams) => validateMultiParams(searchParams, "pokemonType", pokemonTypeSchema),
	region: (searchParams: URLSearchParams) => validateMultiParams(searchParams, "region", regionSchema),
	sort: (searchParams: URLSearchParams) => ({ validValue: validateSortOption(searchParams.get("sort")), hasInvalidValues: false }),
} as const;

// URL更新関数の定義
const URL_UPDATERS = {
	class: (params: URLSearchParams, value: string[]) => {
		if (value.length === 0) params.delete("class");
		else params.set("class", value.join(","));
	},
	form: (params: URLSearchParams, value: string[]) => {
		if (value.length === 0) params.delete("form");
		else params.set("form", value.join(","));
	},
	isImplemented: (params: URLSearchParams, value: boolean[]) => {
		if (value.length === 0 || value.length === 2) params.delete("isImplemented");
		else params.set("isImplemented", value.map(String).join(","));
	},
	isShinyImplemented: (params: URLSearchParams, value: boolean[]) => {
		if (value.length === 0 || value.length === 2) params.delete("isShinyImplemented");
		else params.set("isShinyImplemented", value.map(String).join(","));
	},
	pokemonType: (params: URLSearchParams, value: string[]) => {
		if (value.length === 0) params.delete("pokemonType");
		else params.set("pokemonType", value.join(","));
	},
	region: (params: URLSearchParams, value: string[]) => {
		if (value.length === 0) params.delete("region");
		else params.set("region", value.join(","));
	},
	sort: (params: URLSearchParams, value: string) => {
		if (value && value !== "pokedex-number-asc") params.set("sort", value);
		else params.delete("sort");
	},
} as const;

export const BOOLEAN_FILTER_KEYS = ["isImplemented", "isShinyImplemented"] as const;
export const ARRAY_FILTER_KEYS = ["class", "form", "pokemonType", "region"] as const;

export function parseSearchParams(searchParams: URLSearchParams): Option {
	return {
		class: PARAM_PARSERS.class(searchParams).validItems,
		form: PARAM_PARSERS.form(searchParams).validItems,
		isImplemented: PARAM_PARSERS.isImplemented(searchParams).validItems,
		isShinyImplemented: PARAM_PARSERS.isShinyImplemented(searchParams).validItems,
		pokemonType: PARAM_PARSERS.pokemonType(searchParams).validItems,
		region: PARAM_PARSERS.region(searchParams).validItems,
		sort: PARAM_PARSERS.sort(searchParams).validValue,
	};
}

/**
 * 無効なパラメータを検出してクリーンアップされたURLを返す
 */
export function parseAndCleanSearchParams(searchParams: URLSearchParams): {
	options: Option;
	cleanedParams: URLSearchParams | null;
} {
	const cleanedParams = new URLSearchParams(searchParams);
	let hasInvalidValues = false;
	
	const options: Partial<Option> = {};
	
	// 各パラメータを検証し、無効な値があれば削除
	const classResult = PARAM_PARSERS.class(searchParams);
	options.class = classResult.validItems;
	if (classResult.hasInvalidValues) {
		hasInvalidValues = true;
		if (classResult.validItems.length === 0) {
			cleanedParams.delete("class");
		} else {
			cleanedParams.set("class", classResult.validItems.join(","));
		}
	}
	
	const formResult = PARAM_PARSERS.form(searchParams);
	options.form = formResult.validItems;
	if (formResult.hasInvalidValues) {
		hasInvalidValues = true;
		if (formResult.validItems.length === 0) {
			cleanedParams.delete("form");
		} else {
			cleanedParams.set("form", formResult.validItems.join(","));
		}
	}
	
	const isImplementedResult = PARAM_PARSERS.isImplemented(searchParams);
	options.isImplemented = isImplementedResult.validItems;
	if (isImplementedResult.hasInvalidValues) {
		hasInvalidValues = true;
		if (isImplementedResult.validItems.length === 0) {
			cleanedParams.delete("isImplemented");
		} else {
			cleanedParams.set("isImplemented", isImplementedResult.validItems.map(String).join(","));
		}
	}
	
	const isShinyImplementedResult = PARAM_PARSERS.isShinyImplemented(searchParams);
	options.isShinyImplemented = isShinyImplementedResult.validItems;
	if (isShinyImplementedResult.hasInvalidValues) {
		hasInvalidValues = true;
		if (isShinyImplementedResult.validItems.length === 0) {
			cleanedParams.delete("isShinyImplemented");
		} else {
			cleanedParams.set("isShinyImplemented", isShinyImplementedResult.validItems.map(String).join(","));
		}
	}
	
	const pokemonTypeResult = PARAM_PARSERS.pokemonType(searchParams);
	options.pokemonType = pokemonTypeResult.validItems;
	if (pokemonTypeResult.hasInvalidValues) {
		hasInvalidValues = true;
		if (pokemonTypeResult.validItems.length === 0) {
			cleanedParams.delete("pokemonType");
		} else {
			cleanedParams.set("pokemonType", pokemonTypeResult.validItems.join(","));
		}
	}
	
	const regionResult = PARAM_PARSERS.region(searchParams);
	options.region = regionResult.validItems;
	if (regionResult.hasInvalidValues) {
		hasInvalidValues = true;
		if (regionResult.validItems.length === 0) {
			cleanedParams.delete("region");
		} else {
			cleanedParams.set("region", regionResult.validItems.join(","));
		}
	}
	
	const sortResult = PARAM_PARSERS.sort(searchParams);
	options.sort = sortResult.validValue;
	// ソートは常に有効な値が返されるので無効値チェック不要
	
	return {
		options: options as Option,
		cleanedParams: hasInvalidValues ? cleanedParams : null,
	};
}

export function updateURLParams(
	searchParams: URLSearchParams,
	options: Option,
): URLSearchParams {
	const params = new URLSearchParams(searchParams);

	URL_UPDATERS.class(params, options.class);
	URL_UPDATERS.form(params, options.form);
	URL_UPDATERS.isImplemented(params, options.isImplemented);
	URL_UPDATERS.isShinyImplemented(params, options.isShinyImplemented);
	URL_UPDATERS.pokemonType(params, options.pokemonType);
	URL_UPDATERS.region(params, options.region);
	URL_UPDATERS.sort(params, options.sort);

	return params;
}

// ===== POKEMON PROCESSING DEFINITIONS =====

/**
 * 配列フィルターの共通バリデーション
 * 空配列または未定義の場合はすべて通す（フィルタリングなし）
 */
const isEmptyFilter = (values: unknown): boolean => {
	return !Array.isArray(values) || values.length === 0;
};

/**
 * 配列フィルターのヘルパー関数
 */
const createArrayFilter = <T>(
	checkFn: (values: T[], pokemon: Pokemon) => boolean,
) => {
	return (values: unknown, pokemon: Pokemon): boolean => {
		if (isEmptyFilter(values)) return true;
		return checkFn(values as T[], pokemon);
	};
};

/**
 * Boolean配列フィルターのヘルパー関数
 */
const createBooleanFilter = (extractValue: (pokemon: Pokemon) => boolean) => {
	return (values: unknown, pokemon: Pokemon): boolean => {
		if (isEmptyFilter(values)) return true;
		const booleanValues = values as boolean[];
		const pokemonValue = extractValue(pokemon);
		return booleanValues.includes(pokemonValue);
	};
};

// フィルター定義リスト
const FILTER: Array<{
	key: keyof Option;
	match: (optionValue: unknown, pokemon: Pokemon) => boolean;
}> = [
	{
		key: "class",
		match: createArrayFilter((values, p) => values.includes(p.pokemon_class)),
	},
	{
		key: "form",
		match: createArrayFilter((values, p) => values.includes(p.pokemon_form)),
	},
	{
		key: "isImplemented",
		match: createBooleanFilter((p) => !!p.implemented_date),
	},
	{
		key: "isShinyImplemented",
		match: createBooleanFilter((p) => !!p.shiny_implemented_date),
	},
	{
		key: "pokemonType",
		match: createArrayFilter((values, p) =>
			p.pokemon_types.some((type) => values.includes(type)),
		),
	},
	{
		key: "region",
		match: createArrayFilter((values, p) => values.includes(p.region)),
	},
];

// ソート定義リスト
const SORT: Array<{
	key: keyof Option;
	compare: (a: Pokemon, b: Pokemon, value: unknown) => number;
}> = [
	{
		key: "sort",
		compare: (a, b, value) => {
			switch (value) {
				case "pokedex-number-asc":
					return a.pokedex_number - b.pokedex_number;
				case "pokedex-number-desc":
					return b.pokedex_number - a.pokedex_number;
				case "name-asc":
					return a.name.localeCompare(b.name, "ja");
				case "name-desc":
					return b.name.localeCompare(a.name, "ja");
				default:
					return 0;
			}
		},
	},
];

// ===== PERFORMANCE UTILITIES =====

/**
 * オプション比較関数（設定駆動）
 * JSON.stringifyよりも高速で、フィルター定義に基づいて動的に比較
 */
export function isOptionsEqual(a: Option, b: Option): boolean {
	// ソートの比較
	if (a.sort !== b.sort) return false;
	
	// フィルター定義を使って動的に比較
	return FILTER.every(({ key }) => {
		const valueA = a[key];
		const valueB = b[key];
		
		// 配列フィルターの場合
		if (Array.isArray(valueA) && Array.isArray(valueB)) {
			// 長さチェック（早期リターン）
			if (valueA.length !== valueB.length) return false;
			
			// ソートして比較（重複なしの前提）
			const sortedA = valueA.slice().sort().join(',');
			const sortedB = valueB.slice().sort().join(',');
			return sortedA === sortedB;
		}
		
		return valueA === valueB;
	});
}

/**
 * アクティブフィルターの有無を設定駆動で判定
 */
export function hasActiveFilters(options: Option): boolean {
	// フィルター定義を使って動的にチェック
	const hasArrayFilters = FILTER.some(({ key }) => {
		const value = options[key];
		if (Array.isArray(value)) {
			return value.length > 0;
		}
		return false;
	});
	
	// ソートの変更もアクティブな変更として扱う
	const hasSortChange = options.sort !== "pokedex-number-asc";
	
	return hasArrayFilters || hasSortChange;
}

// ===== POKEMON PROCESSING =====

export function processPokemons(
	pokemons: Pokemon[],
	option: Option,
): Pokemon[] {
	// フィルタリング処理
	const activeFilters = FILTER.filter(({ key }) => {
		const value = option[key];
		if (Array.isArray(value)) {
			return value.length > 0;
		}
		return false;
	});

	// アクティブフィルターが存在する場合のみフィルタリング実行
	const filtered = activeFilters.length > 0 
		? pokemons.filter((p) =>
			activeFilters.every(({ key, match }) => match(option[key], p))
		)
		: pokemons;

	// ソート処理
	if (option.sort && option.sort !== "pokedex-number-asc") {
		const sortDef = SORT[0]; // sort定義は1つのみ
		return [...filtered].sort((a, b) => sortDef.compare(a, b, option.sort));
	}
	
	return filtered;
}

