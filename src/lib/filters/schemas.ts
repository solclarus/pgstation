import {
	pokemonClassSchema,
	pokemonFormSchema,
	pokemonTypeSchema,
	regionSchema,
} from "@/types/pokemon";
import { z } from "zod";

// ===== 基本スキーマ =====
export const booleanSchema = z.boolean();

export const sortOptionSchema = z
	.enum(["pokedex-number-asc", "pokedex-number-desc", "name-asc", "name-desc"])
	.default("pokedex-number-asc");

export const dateRangeSchema = z
	.object({
		from: z.date().optional(),
		to: z.date().optional(),
	})
	.optional();

// ===== フィルタースキーマ =====
export const filterSchema = z.object({
	class: z.array(pokemonClassSchema).default([]),
	form: z.array(pokemonFormSchema).default([]),
	isImplemented: z.array(booleanSchema).default([]),
	isShinyImplemented: z.array(booleanSchema).default([]),
	pokemonType: z.array(pokemonTypeSchema).default([]),
	region: z.array(regionSchema).default([]),
	implementationDateRange: dateRangeSchema,
});

// ===== メインスキーマ =====
export const optionSchema = z.object({
	filter: filterSchema.default({}),
	sort: sortOptionSchema.default("pokedex-number-asc"),
});

// ===== フォームスキーマ =====
export const formInputSchema = z.object({
	filter: filterSchema.partial().optional(),
	sort: sortOptionSchema.optional(),
});

// ===== 型定義 =====
export type FilterOption = z.infer<typeof filterSchema>;
export type Option = z.infer<typeof optionSchema>;
export type FormInput = z.infer<typeof formInputSchema>;
export type SortOption = z.infer<typeof sortOptionSchema>;

// ===== 定数 =====
export const DEFAULT_SORT_OPTION = sortOptionSchema.parse(undefined);
