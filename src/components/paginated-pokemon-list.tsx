"use client";

import { PokemonCard } from "@/components/pokemon-card";
import { ShinyToggleButton } from "@/components/shiny-toggle-button";
import { Button } from "@/components/ui/button";
import { usePokemonParams } from "@/hooks/use-pokemon-params";
import { useShinyToggle } from "@/hooks/use-shiny-toggle";
import { processPokemons } from "@/lib/control-panel/process";
import type { Pokemon } from "@/types/pokemon";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 48;

export function PaginatedPokemonList({ pokemons }: { pokemons: Pokemon[] }) {
	const { options } = usePokemonParams();
	const { isShiny, toggleShiny } = useShinyToggle();
	const [currentPage, setCurrentPage] = useState(1);

	const processedPokemon = useMemo(
		() => processPokemons(pokemons, options),
		[pokemons, options],
	);

	const totalPages = Math.ceil(processedPokemon.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentPagePokemon = processedPokemon.slice(startIndex, endIndex);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

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
				<>
					<div className="grid-list">
						{currentPagePokemon.map((pokemon) => (
							<PokemonCard
								key={pokemon.id}
								isShiny={isShiny}
								pokemon={pokemon}
							/>
						))}
					</div>

					{totalPages > 1 && (
						<div className="flex items-center justify-center space-x-2 pt-4">
							<Button
								variant="outline"
								size="icon"
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
							>
								<ChevronLeft className="size-4" />
							</Button>

							<div className="flex items-center space-x-1">
								{Array.from({ length: totalPages }, (_, i) => i + 1)
									.filter((page) => {
										const distance = Math.abs(page - currentPage);
										return distance <= 2 || page === 1 || page === totalPages;
									})
									.map((page, index, array) => (
										<div key={page} className="flex items-center">
											{index > 0 && array[index - 1] !== page - 1 && (
												<span className="px-2 text-muted-foreground">...</span>
											)}
											<Button
												variant={page === currentPage ? "default" : "outline"}
												size="sm"
												onClick={() => handlePageChange(page)}
												className="min-w-[2.5rem]"
											>
												{page}
											</Button>
										</div>
									))}
							</div>

							<Button
								variant="outline"
								size="icon"
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
							>
								<ChevronRight className="size-4" />
							</Button>
						</div>
					)}

					<div className="text-center text-muted-foreground text-sm">
						{startIndex + 1} - {Math.min(endIndex, processedPokemon.length)} /{" "}
						{processedPokemon.length}
					</div>
				</>
			)}
		</div>
	);
}
