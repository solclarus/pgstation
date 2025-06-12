"server-only";

import { createClient } from "@/lib/supabase/server";
import type { Pokemon } from "@/types/pokemon";
import { cache } from "react";

export const getAllPokemon = cache(async (): Promise<Pokemon[]> => {
	const supabase = await createClient();
	const { data, error } = await supabase.from("pokemon_master").select("*");

	if (error) {
		console.error("Error fetching pokemon masters:", error);
		throw error;
	}

	return (data as Pokemon[]) || [];
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

	return data || null;
});
