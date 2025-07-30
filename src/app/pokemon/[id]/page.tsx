import { ImageCard } from "@/components/image-card";
import { getPokemon } from "@/lib/pokemon";
import type { PokemonApiResponse } from "@/types/pokemon";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function PokemonDetail({ params }: Props) {
	const { id } = await params;
	const pokemon = await getPokemon(id);
	if (!pokemon) {
		return null;
	}
	const response = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${pokemon?.pokedex_number}`,
	);
	const { height, weight, stats }: PokemonApiResponse = await response.json();

	return (
		<div className="mx-auto flex max-w-lg flex-col items-center justify-center gap-4">
			<div className="grid grid-cols-1 gap-2">
				<div className="flex items-center justify-between rounded-md border bg-card px-6 py-4 shadow-sm">
					<p className="text-sm">No.{pokemon.pokedex_number}</p>
					<h2 className="font-bold text-lg">{pokemon.name}</h2>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<ImageCard id={pokemon.id} isShiny={false} />
					<ImageCard id={pokemon.id} isShiny />
				</div>
			</div>
		</div>
	);
}
