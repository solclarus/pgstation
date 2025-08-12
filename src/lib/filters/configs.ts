import type { Pokemon } from "@/types/pokemon";
import {
	pokemonClassSchema,
	pokemonFormSchema,
	pokemonTypeSchema,
	regionSchema,
} from "@/types/pokemon";
import { isValid, isWithinInterval, parseISO, startOfDay } from "date-fns";
import type { z } from "zod";
import type { FilterOption, SortOption } from "./schemas";

// ===== フィルター設定型 =====
export type FilterConfig =
	| {
			type: "array";
			schema: z.ZodSchema<string>;
			match: (values: string[], pokemon: Pokemon) => boolean;
	  }
	| {
			type: "boolean";
			isEmpty: (value: boolean[]) => boolean;
			format: (value: boolean[]) => string;
			match: (values: boolean[], pokemon: Pokemon) => boolean;
	  }
	| {
			type: "dateRange";
			urlParams: string[];
			match: (
				value: { from?: Date; to?: Date } | undefined,
				pokemon: Pokemon,
			) => boolean;
	  };

// ===== フィルター設定 =====
export const FILTER_CONFIGS: Record<keyof FilterOption, FilterConfig> = {
	class: {
		type: "array",
		schema: pokemonClassSchema,
		match: (values, pokemon) => values.includes(pokemon.pokemon_class),
	},
	form: {
		type: "array",
		schema: pokemonFormSchema,
		match: (values, pokemon) => values.includes(pokemon.pokemon_form),
	},
	isImplemented: {
		type: "boolean",
		isEmpty: (value: boolean[]) => value.length === 0 || value.length === 2,
		format: (value: boolean[]) => value.map(String).join(","),
		match: (values, pokemon) => values.includes(!!pokemon.implemented_date),
	},
	isShinyImplemented: {
		type: "boolean",
		isEmpty: (value: boolean[]) => value.length === 0 || value.length === 2,
		format: (value: boolean[]) => value.map(String).join(","),
		match: (values, pokemon) =>
			values.includes(!!pokemon.shiny_implemented_date),
	},
	pokemonType: {
		type: "array",
		schema: pokemonTypeSchema,
		match: (values, pokemon) =>
			pokemon.pokemon_types.some((type) => values.includes(type)),
	},
	region: {
		type: "array",
		schema: regionSchema,
		match: (values, pokemon) => values.includes(pokemon.region),
	},
	implementationDateRange: {
		type: "dateRange",
		urlParams: ["from", "to"],
		match: (value, pokemon) => {
			if (!value || (!value.from && !value.to)) return true;

			const pokemonDate = pokemon.implemented_date
				? parseISO(pokemon.implemented_date)
				: null;

			if (!pokemonDate || !isValid(pokemonDate)) return false;

			const pokemonDateOnly = startOfDay(pokemonDate);

			if (value.from && value.to) {
				return isWithinInterval(pokemonDateOnly, {
					start: startOfDay(value.from),
					end: startOfDay(value.to),
				});
			}

			if (value.from) {
				return pokemonDateOnly >= startOfDay(value.from);
			}

			if (value.to) {
				return pokemonDateOnly <= startOfDay(value.to);
			}

			return true;
		},
	},
} as const;

// ===== ソート比較関数 =====
export function comparePokemon(
	a: Pokemon,
	b: Pokemon,
	sortOption: SortOption,
): number {
	switch (sortOption) {
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
}
