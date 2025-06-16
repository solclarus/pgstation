export const dynamic = "force-dynamic";
import { PokemonList } from "@/components/pokemon-list";
import { getAllPokemon } from "@/lib/pokemon";
import { Suspense } from "react";

export default async function PokemonPage() {
	const pokemons = await getAllPokemon();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PokemonList pokemons={pokemons} />
		</Suspense>
	);
}
