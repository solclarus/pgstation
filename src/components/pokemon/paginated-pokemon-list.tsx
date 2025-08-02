"use client";

import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { useListControls } from "@/hooks/use-list-controls";
import { useShinyToggle } from "@/hooks/use-shiny-toggle";
import { processPokemons } from "@/lib/control-panel/config";
import type { Pokemon } from "@/types/pokemon";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

const ITEMS_PER_PAGE = 50;

export function PaginatedPokemonList({ pokemons }: { pokemons: Pokemon[] }) {
	const { options } = useListControls();
	const { isShiny } = useShinyToggle();
	const router = useRouter();
	const searchParams = useSearchParams();

	// URLからページ番号を取得（デフォルト: 1）
	const currentPage = useMemo(() => {
		const pageParam = searchParams.get("page");
		const page = pageParam ? Number.parseInt(pageParam, 10) : 1;
		return Number.isNaN(page) || page < 1 ? 1 : page;
	}, [searchParams]);

	const processedPokemon = useMemo(
		() => processPokemons(pokemons, options),
		[pokemons, options],
	);

	const totalPages = Math.ceil(processedPokemon.length / ITEMS_PER_PAGE);

	// 現在のページが総ページ数を超えている場合の調整
	const validCurrentPage = useMemo(() => {
		return totalPages > 0 && currentPage > totalPages
			? totalPages
			: currentPage;
	}, [currentPage, totalPages]);

	const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentPagePokemon = processedPokemon.slice(startIndex, endIndex);

	// URLを更新する関数
	const updateUrl = useCallback(
		(page: number) => {
			const params = new URLSearchParams(searchParams.toString());
			if (page === 1) {
				params.delete("page"); // 1ページ目はURLから削除
			} else {
				params.set("page", page.toString());
			}

			const newUrl = params.toString() ? `?${params.toString()}` : "";
			router.push(newUrl, { scroll: false });
		},
		[router, searchParams],
	);

	const handlePageChange = useCallback(
		(page: number) => {
			updateUrl(page);
			window.scrollTo({ top: 0, behavior: "smooth" });
		},
		[updateUrl],
	);

	// フィルタ変更時にページ1にリセット
	useEffect(() => {
		if (validCurrentPage !== currentPage && totalPages > 0) {
			updateUrl(validCurrentPage);
		}
	}, [validCurrentPage, currentPage, totalPages, updateUrl]);

	return (
		<div className="space-y-6">
			{/* ヘッダーカード */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-3">
							<Grid3X3 className="h-6 w-6 text-blue-500" />
							{isShiny ? "色違いポケモン一覧" : "ポケモン一覧"}
						</CardTitle>
						<p className="text-muted-foreground text-sm">
							{processedPokemon.length}体のポケモンが見つかりました
						</p>
					</div>
				</CardHeader>
			</Card>

			{processedPokemon.length === 0 ? (
				<Card>
					<CardContent className="py-12 text-center">
						<p className="text-lg text-muted-foreground">
							条件に一致するポケモンが見つかりません
						</p>
					</CardContent>
				</Card>
			) : (
				<>
					{/* ポケモングリッドカード */}
					<Card>
						<CardContent className="p-6">
							<div className="grid-list">
								{currentPagePokemon.map((pokemon) => (
									<PokemonCard
										key={pokemon.id}
										isShiny={isShiny}
										pokemon={pokemon}
									/>
								))}
							</div>
						</CardContent>
					</Card>

					{/* ページネーション */}
					{totalPages > 1 && (
						<div className="flex items-center justify-center space-x-2 pt-4">
							<Button
								variant="outline"
								size="icon"
								onClick={() => handlePageChange(validCurrentPage - 1)}
								disabled={validCurrentPage === 1}
							>
								<ChevronLeft className="size-4" />
							</Button>

							<div className="flex items-center space-x-1">
								{Array.from({ length: totalPages }, (_, i) => i + 1)
									.filter((page) => {
										const distance = Math.abs(page - validCurrentPage);
										return distance <= 2 || page === 1 || page === totalPages;
									})
									.map((page, index, array) => (
										<div key={page} className="flex items-center">
											{index > 0 && array[index - 1] !== page - 1 && (
												<span className="px-2 text-muted-foreground">...</span>
											)}
											<Button
												variant={
													page === validCurrentPage ? "default" : "outline"
												}
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
								onClick={() => handlePageChange(validCurrentPage + 1)}
								disabled={validCurrentPage === totalPages}
							>
								<ChevronRight className="size-4" />
							</Button>
						</div>
					)}

					{/* ページ情報 */}
					<div className="text-center text-muted-foreground text-sm">
						{startIndex + 1} - {Math.min(endIndex, processedPokemon.length)} /{" "}
						{processedPokemon.length}
						{totalPages > 1 && (
							<span className="ml-2">
								(ページ {validCurrentPage} / {totalPages})
							</span>
						)}
					</div>
				</>
			)}
		</div>
	);
}
