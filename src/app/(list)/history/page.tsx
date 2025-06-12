import { PokemonHistoryList } from "@/components/pokemon-history-list";
import { getAllPokemon } from "@/lib/pokemon";

export default async function History() {
	const pokemons = await getAllPokemon();

	return <PokemonHistoryList pokemons={pokemons} />;
}
