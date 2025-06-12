"use client";

import { PokemonCard } from "@/components/pokemon-card";
import { usePokemonParams } from "@/hooks/use-pokemon-params";
import { processPokemons } from "@/lib/control-panel/process";
import type { Pokemon } from "@/types/pokemon";
import { useMemo } from "react";

export function PokemonHistoryList({ pokemons }: { pokemons: Pokemon[] }) {
	const { options } = usePokemonParams();

	const processedPokemon = useMemo(
		() => processPokemons(pokemons, options),
		[pokemons, options],
	);

	// 実装日ごとにグループ化
	const grouped: Record<string, typeof pokemons> = {};
	for (const p of processedPokemon) {
		const date = p.implemented_date || "未実装";
		if (!grouped[date]) grouped[date] = [];
		grouped[date].push(p);
	}

	// 日付昇順で並べる
	// const sortedDates = Object.keys(grouped)
	// 	.filter((d) => d !== "未実装")
	// 	.sort((a, b) => b.localeCompare(a))
	// 	.concat(Object.keys(grouped).includes("未実装") ? ["未実装"] : []);
	const sortedDates = (
		Object.keys(grouped).includes("未実装") ? ["未実装"] : []
	).concat(
		Object.keys(grouped)
			.filter((d) => d !== "未実装")
			.sort((a, b) => b.localeCompare(a)),
	);

	return (
		<div className="space-y-8">
			{sortedDates.map((date) => (
				<section key={date}>
					<h2 className="mb-2 font-bold text-base text-muted-foreground">
						{date}
					</h2>
					<div className="grid-list">
						{grouped[date]
							.slice()
							.sort((a, b) => a.pokedex_number - b.pokedex_number)
							.map((pokemon) => (
								<PokemonCard key={pokemon.id} pokemon={pokemon} />
							))}
					</div>
				</section>
			))}
		</div>
	);
}
