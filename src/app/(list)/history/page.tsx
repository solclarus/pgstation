import { PokemonHistoryList } from "@/components/pokemon-history-list";
import { getAllPokemon } from "@/lib/pokemon";
import { Suspense } from "react";

export default async function History() {
	const pokemons = await getAllPokemon();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PokemonHistoryList pokemons={pokemons} />
		</Suspense>
	);
}
