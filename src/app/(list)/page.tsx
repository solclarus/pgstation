export const dynamic = "force-dynamic";
import { PaginatedPokemonList } from "@/components/paginated-pokemon-list";
import { getAllPokemon } from "@/lib/pokemon";
import { Suspense } from "react";

export default async function PokemonPage() {
	const pokemons = await getAllPokemon();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PaginatedPokemonList pokemons={pokemons} />
		</Suspense>
	);
}
