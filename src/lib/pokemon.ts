"server-only";

import { createClient } from "@/lib/supabase/server";
import type { Pokemon } from "@/types/pokemon";
import { cache } from "react";
import { z } from "zod";

// Pokemon型用のZodスキーマを定義
const pokemonSchema = z.object({
	id: z.string(),
	pokedex_number: z.number(),
	name: z.string(),
	region: z.string(),
	implemented_date: z.string().nullable(),
	shiny_implemented_date: z.string().nullable(),
	form_order: z.number(),
	generation: z.number(),
	pokemon_class: z.string(),
	pokemon_form: z.string(),
	pokemon_types: z.array(z.string()),
});

// 型ガード関数
function isPokemonArray(data: unknown): data is Pokemon[] {
	const pokemonArraySchema = z.array(pokemonSchema);
	return pokemonArraySchema.safeParse(data).success;
}

function isPokemon(data: unknown): data is Pokemon {
	return pokemonSchema.safeParse(data).success;
}

export const getAllPokemon = cache(async (): Promise<Pokemon[]> => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("pokemon_master")
		.select("*")
		.order("pokedex_number")
		.order("form_order");

	if (error) {
		console.error("Error fetching pokemon masters:", error);
		throw error;
	}

	if (!data) {
		return [];
	}

	// 型安全な検証
	if (!isPokemonArray(data)) {
		console.error("Invalid pokemon data format:", data);
		throw new Error("Invalid pokemon data format received from database");
	}

	return data;
});

export const getPokemon = cache(async (id: string): Promise<Pokemon | null> => {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("pokemon_master")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching pokemon master by ID:", error);
		throw error;
	}

	if (!data) {
		return null;
	}

	// 型安全な検証
	if (!isPokemon(data)) {
		console.error("Invalid pokemon data format:", data);
		throw new Error("Invalid pokemon data format received from database");
	}

	return data;
});
