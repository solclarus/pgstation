export const dynamic = "force-dynamic";
import { getAllPokemon } from "@/lib/pokemon";
import Image from "next/image";
import { Suspense } from "react";

export default async function Table() {
	const pokemons = await getAllPokemon();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<div className="overflow-x-auto">
				<table className="min-w-full border bg-card text-sm">
					<thead>
						<tr className="bg-muted">
							<th className="border-b px-4 py-2 text-left">ID</th>
							<th className="border-b px-4 py-2 text-left">Name</th>
							<th className="border-b px-4 py-2 text-left">Type</th>
						</tr>
					</thead>
					<tbody>
						{pokemons.map((pokemon) => (
							<tr key={pokemon.id} className="hover:bg-accent">
								<td className="border-b px-4 py-2">{pokemon.id}</td>
								<td className="border-b px-4 py-2">{pokemon.name}</td>
								<td className="flex gap-2 border-b px-4 py-2">
									{pokemon.pokemon_types.map((type) => {
										return (
											<Image
												key={type}
												src={`/images/type/${type}.png`}
												alt={type}
												width={32}
												height={32}
												className={"size-6 rounded-full"}
											/>
										);
									})}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Suspense>
	);
}
