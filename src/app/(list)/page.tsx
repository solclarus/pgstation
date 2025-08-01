export const dynamic = "force-dynamic";
import { PaginatedPokemonList } from "@/components/pokemon/paginated-pokemon-list";
import { PokemonListSkeleton } from "@/components/skeletons/pokemon-list-skeleton";
import { getAllPokemon } from "@/lib/pokemon";
import { Suspense } from "react";

export default async function PokemonPage() {
	const pokemons = await getAllPokemon();

	return (
		<Suspense fallback={<PokemonListSkeleton />}>
			<PaginatedPokemonList pokemons={pokemons} />
		</Suspense>
	);
}
