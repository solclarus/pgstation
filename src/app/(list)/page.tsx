import { PokemonList } from "@/components/pokemon-list";
import { getAllPokemon } from "@/lib/pokemon";

export default async function PokemonPage() {
	const pokemons = await getAllPokemon();

	return <PokemonList pokemons={pokemons} />;
}
