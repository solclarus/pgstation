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

export const pokemonClassSchema = z.enum([
	"normal",
	"legendary",
	"mythical",
	"ub",
]);

export const pokemonFormSchema = z.enum(["normal", "mega", "gmax"]);

export const regionSchema = z.enum([
	"kanto",
	"johto",
	"hoenn",
	"sinnoh",
	"unova",
	"kalos",
	"alola",
	"galar",
	"hisui",
	"paldea",
	"unknown",
]);

export type PokemonClass = z.infer<typeof pokemonClassSchema>;
export type PokemonForm = z.infer<typeof pokemonFormSchema>;
export type PokemonType = z.infer<typeof pokemonTypeSchema>;
export type Region = z.infer<typeof regionSchema>;

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
