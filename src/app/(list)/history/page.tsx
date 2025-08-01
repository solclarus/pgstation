export const dynamic = "force-dynamic";
import { PokemonHistoryList } from "@/components/pokemon/pokemon-history-list";
import { PokemonHistorySkeleton } from "@/components/skeletons/pokemon-history-skeleton";
import { getAllPokemon } from "@/lib/pokemon";
import { Suspense } from "react";

export default async function History() {
	const pokemons = await getAllPokemon();

	return (
		<Suspense fallback={<PokemonHistorySkeleton />}>
			<PokemonHistoryList pokemons={pokemons} />
		</Suspense>
	);
}
