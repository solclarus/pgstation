import { PokemonList } from "@/components/pokemon-list";
import { getAllPokemon } from "@/lib/pokemon";
import { Suspense } from "react";

export default async function PokemonPage() {
	const pokemons = await getAllPokemon();

	return (
		<Suspense>
			<PokemonList pokemons={pokemons} />
		</Suspense>
	);
}
