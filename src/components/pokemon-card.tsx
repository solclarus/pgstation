"use client";

import { ImageCard } from "@/components/image-card";
import type { Pokemon } from "@/types/pokemon";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@ui/tooltip";
import Link from "next/link";

export const PokemonCard = ({
	isShiny,
	pokemon,
}: { isShiny: boolean; pokemon: Pokemon }) => {
	if (!pokemon) {
		return <div className="h-full w-full" />;
	}

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>
					<Link href={`pokemon/${pokemon.id}`}>
						<ImageCard id={pokemon.id} isShiny={isShiny} />
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
