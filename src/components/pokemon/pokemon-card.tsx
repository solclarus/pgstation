"use client";

import { ImageCard } from "@/components/pokemon/image-card";
import type { Pokemon } from "@/types/pokemon";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@ui/tooltip";
import Link from "next/link";

interface PokemonCardProps {
	isShiny: boolean;
	pokemon: Pokemon;
	priority?: boolean;
}

export const PokemonCard = ({
	isShiny,
	pokemon,
	priority = false,
}: PokemonCardProps) => {
	if (!pokemon) {
		return <div className="h-full w-full" />;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Link href={`pokemon/${pokemon.id}`}>
						<ImageCard id={pokemon.id} isShiny={isShiny} priority={priority} />
					</Link>
				</TooltipTrigger>
				<TooltipContent>
					<div className="flex flex-col items-center">
						<p className="font-bold">{pokemon.name}</p>
						<p className="text-xs">No.{pokemon.pokedex_number}</p>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};
