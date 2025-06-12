import {
	pokemonClassSchema,
	pokemonFormSchema,
	pokemonTypeSchema,
	regionSchema,
} from "@/types/pokemon";
import { z } from "zod";

export const classFilterOptionSchema = z.enum([
	"all",
	...pokemonClassSchema.options,
]);

export const formFilterOptionSchema = z.enum([
	"all",
	...pokemonFormSchema.options,
]);

export const implementedStatusOptionSchema = z.enum([
	"all",
	"implemented",
	"not-implemented",
]);

export const shinyImplementedStatusOptionSchema = z.enum([
	"all",
	"shiny-implemented",
	"shiny-not-implemented",
]);

export const pokemonTypeFilterOptionSchema = z.enum([
	"all",
	...pokemonTypeSchema.options,
]);

export const regionFilterOptionSchema = z.enum([
	"all",
	...regionSchema.options,
]);

export const sortOptionSchema = z.enum([
	"pokedex-number-asc",
	"pokedex-number-desc",
	"name-asc",
	"name-desc",
]);

export const optionSchema = z.object({
	class: z.array(classFilterOptionSchema),
	form: z.array(formFilterOptionSchema),
	implementedStatus: implementedStatusOptionSchema,
	shinyImplementedStatus: shinyImplementedStatusOptionSchema,
	pokemonType: z.array(pokemonTypeFilterOptionSchema),
	region: z.array(regionFilterOptionSchema),
	sort: sortOptionSchema,
});

export type Option = z.infer<typeof optionSchema>;
export type SortOption = z.infer<typeof sortOptionSchema>;
