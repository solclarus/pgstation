import type { Option } from "@/lib/control-panel";
import type { Pokemon } from "@/types/pokemon";

// フィルター定義リスト
const FILTER: Array<{
	key: keyof Option;
	match: (optionValue: unknown, pokemon: Pokemon) => boolean;
}> = [
	{
		key: "class",
		match: (values, p) => {
			if (
				!Array.isArray(values) ||
				values.length === 0 ||
				values.includes("all")
			)
				return true;
			return values.includes(p.pokemon_class);
		},
	},
	{
		key: "form",
		match: (values, p) => {
			if (
				!Array.isArray(values) ||
				values.length === 0 ||
				values.includes("all")
			)
				return true;
			return values.includes(p.pokemon_form);
		},
	},
	{
		key: "implementedStatus",
		match: (value, p) => {
			if (!value || value === "all") return true;
			if (value === "implemented") return !!p.implemented_date;
			if (value === "not-implemented") return !p.implemented_date;
			return true;
		},
	},
	{
		key: "shinyImplementedStatus",
		match: (value, p) => {
			if (!value || value === "all") return true;
			if (value === "shiny-implemented") return !!p.shiny_implemented_date;
			if (value === "shiny-not-implemented") return !p.shiny_implemented_date;
			return true;
		},
	},
	{
		key: "pokemonType",
		match: (values, p) => {
			if (
				!Array.isArray(values) ||
				values.length === 0 ||
				values.includes("all")
			)
				return true;
			return p.pokemon_types.some((type) => values.includes(type));
		},
	},
	{
		key: "region",
		match: (values, p) => {
			if (
				!Array.isArray(values) ||
				values.length === 0 ||
				values.includes("all")
			)
				return true;
			return values.includes(p.region);
		},
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

export function processPokemons(
	pokemons: Pokemon[],
	option: Option,
): Pokemon[] {
	// フィルター
	const filtered = pokemons.filter((p) =>
		FILTER.every(({ key, match }) => match(option[key], p)),
	);

	// ソート
	const sortDef = SORT.find((def) => def.key === "sort");
	if (sortDef && option.sort) {
		return [...filtered].sort((a, b) => sortDef.compare(a, b, option.sort));
	}
	return filtered;
}
