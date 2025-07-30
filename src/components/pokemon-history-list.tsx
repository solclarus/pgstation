"use client";

import { PokemonCard } from "@/components/pokemon-card";
import { ShinyToggleButton } from "@/components/shiny-toggle-button";
import { usePokemonParams } from "@/hooks/use-pokemon-params";
import { useShinyToggle } from "@/hooks/use-shiny-toggle";
import { processPokemons } from "@/lib/control-panel/process";
import type { Pokemon } from "@/types/pokemon";
import { useMemo } from "react";

export function PokemonHistoryList({ pokemons }: { pokemons: Pokemon[] }) {
	const { options } = usePokemonParams();

	const { isShiny, toggleShiny } = useShinyToggle();

	const processedPokemon = useMemo(
		() => processPokemons(pokemons, options),
		[pokemons, options],
	);

	// 実装日ごとにグループ化
	const grouped: Record<string, typeof pokemons> = {};
	for (const p of processedPokemon) {
		const date = isShiny
			? p.shiny_implemented_date || "未実装"
			: p.implemented_date || "未実装";
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
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-2xl">
					{isShiny ? "ポケモン色違い実装履歴" : "ポケモン実装履歴"}
				</h1>
				<p className="text-muted-foreground">
					{processedPokemon.length}匹のポケモンが見つかりました
				</p>
			</div>
			<ShinyToggleButton
				isShiny={isShiny}
				onToggle={toggleShiny}
				labels={{
					normal: "通常実装履歴",
					shiny: "色違い実装履歴",
				}}
			/>
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
								<PokemonCard
									key={pokemon.id}
									isShiny={isShiny}
									pokemon={pokemon}
								/>
							))}
					</div>
				</section>
			))}
		</div>
	);
}
