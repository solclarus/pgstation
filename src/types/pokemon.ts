import { z } from "zod";

export type Pokemon = {
	id: string;
	pokedex_number: number;
	name: string;
	region: Region;
	implemented_date: string | null;
	shiny_implemented_date: string | null;
	form_order: number;
	generation: number;
	pokemon_class: PokemonClass;
	pokemon_form: PokemonForm;
	pokemon_types: PokemonType[];
};

export type PokemonTypeMap = {
	name: {
		en: string;
		ja: string;
	};
	color: string;
};

// ===== POKEMON CLASS =====
export const POKEMON_CLASSES = {
	normal: "通常",
	legendary: "伝説",
	mythical: "幻",
	ub: "UB",
} as const;

export type PokemonClass = keyof typeof POKEMON_CLASSES;
export const pokemonClassSchema = z.enum(
	Object.keys(POKEMON_CLASSES) as [
		keyof typeof POKEMON_CLASSES,
		...Array<keyof typeof POKEMON_CLASSES>,
	],
);

// ===== POKEMON FORM =====
export const POKEMON_FORMS = {
	normal: "通常",
	mega: "メガシンカ",
	gmax: "キョダイマックス",
} as const;

export type PokemonForm = keyof typeof POKEMON_FORMS;
export const pokemonFormSchema = z.enum(
	Object.keys(POKEMON_FORMS) as [
		keyof typeof POKEMON_FORMS,
		...Array<keyof typeof POKEMON_FORMS>,
	],
);

// ===== REGIONS =====
export const REGIONS = {
	kanto: "カントー",
	johto: "ジョウト",
	hoenn: "ホウエン",
	sinnoh: "シンオウ",
	unova: "イッシュ",
	kalos: "カロス",
	alola: "アローラ",
	galar: "ガラル",
	hisui: "ヒスイ",
	paldea: "パルデア",
	unknown: "未確認",
} as const;

export type Region = keyof typeof REGIONS;
export const regionSchema = z.enum(
	Object.keys(REGIONS) as [
		keyof typeof REGIONS,
		...Array<keyof typeof REGIONS>,
	],
);

// ===== POKEMON TYPES =====
// Note: Pokemon types are handled separately in constants/pokemon-type.ts
// to maintain the existing color and multi-language structure
export const pokemonTypeSchema = z.enum([
	"normal",
	"fire",
	"water",
	"electric",
	"grass",
	"ice",
	"fighting",
	"poison",
	"ground",
	"flying",
	"psychic",
	"bug",
	"rock",
	"ghost",
	"dragon",
	"dark",
	"steel",
	"fairy",
]);

export type PokemonType = z.infer<typeof pokemonTypeSchema>;

export interface PokemonApiResponse {
	height: number;
	weight: number;
	stats: Array<{
		base_stat: number;
		effort: number;
		stat: {
			name: string;
			url: string;
		};
	}>;
}
