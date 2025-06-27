import { ImageCard } from "@/components/image-card";
import { getPokemon } from "@/lib/pokemon";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function PokemonDetail({ params }: Props) {
	const { id } = await params;
	const pokemon = await getPokemon(id);

	if (!pokemon) {
		return null;
	}

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

				{/* 基本ステータスカード */}
				{/* <div className="rounded-md border bg-card p-6 shadow-sm">
					<h3 className="mb-3 font-bold">基本情報</h3>
					<div className="flex items-center justify-between">
						<span className="font-medium text-sm">体重</span>
						<span>{(pokemon.weight / 10).toFixed(1)} kg</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="font-medium text-sm">身長</span>
						<span>{(pokemon.height / 10).toFixed(1)} m</span>
					</div>
				</div> */}
			</div>
		</div>
	);
}
