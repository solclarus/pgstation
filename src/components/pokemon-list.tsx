"use client";

import { PokemonCard } from "@/components/pokemon-card";
import { ShinyToggleButton } from "@/components/shiny-toggle-button";
import { usePokemonParams } from "@/hooks/use-pokemon-params";
import { useShinyToggle } from "@/hooks/use-shiny-toggle";
import { processPokemons } from "@/lib/control-panel/process";
import type { Pokemon } from "@/types/pokemon";
import { useMemo } from "react";

export function PokemonList({ pokemons }: { pokemons: Pokemon[] }) {
	const { options } = usePokemonParams();

	const { isShiny, toggleShiny } = useShinyToggle();

	const processedPokemon = useMemo(
		() => processPokemons(pokemons, options),
		[pokemons, options],
	);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h1 className="font-bold text-2xl">
					{isShiny ? "色違いポケモン一覧" : "ポケモン一覧"}
				</h1>
				<p className="text-muted-foreground">
					{processedPokemon.length}匹のポケモンが見つかりました
				</p>
			</div>
			<ShinyToggleButton isShiny={isShiny} onToggle={toggleShiny} />
			{processedPokemon.length === 0 ? (
				<div className="py-12 text-center">
					<p className="text-lg text-muted-foreground">
						条件に一致するポケモンが見つかりません
					</p>
				</div>
			) : (
				<div className="grid-list">
					{processedPokemon.map((pokemon) => (
						<PokemonCard key={pokemon.id} isShiny={isShiny} pokemon={pokemon} />
					))}
				</div>
			)}
		</div>
	);
}
