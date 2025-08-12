"use client";

import { YearlyHeatmap } from "@/components/charts/yearly-heatmap";
import { PokemonCard } from "@/components/pokemon/pokemon-card";
import { useListControls } from "@/hooks/use-list-controls";
import { useShinyToggle } from "@/hooks/use-shiny-toggle";
import { processPokemons } from "@/lib/filters";
import type { Pokemon } from "@/types/pokemon";
import { Badge } from "@ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { format } from "date-fns";
import { CheckCircle, Clock } from "lucide-react";
import { useCallback, useMemo } from "react";

export function PokemonHistoryList({ pokemons }: { pokemons: Pokemon[] }) {
	const { options } = useListControls();
	const { isShiny } = useShinyToggle();

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

	// 現在の日付を取得
	const today = format(new Date(), "yyyy-MM-dd");

	// 日付を過去（実装済み）と未来（実装予定）に分ける
	const allDates = Object.keys(grouped).filter((d) => d !== "未実装");
	const pastDates = allDates
		.filter((date) => date <= today)
		.sort((a, b) => b.localeCompare(a));
	const futureDates = allDates
		.filter((date) => date > today)
		.sort((a, b) => a.localeCompare(b)); // 未来の日付は昇順（近い順）

	// 統計情報を計算
	const stats = useMemo(() => {
		const implementedCount = processedPokemon.filter((p) =>
			isShiny ? p.shiny_implemented_date : p.implemented_date,
		).length;
		const futureCount = futureDates.reduce(
			(acc, date) => acc + grouped[date].length,
			0,
		);
		const pastCount = pastDates.reduce(
			(acc, date) => acc + grouped[date].length,
			0,
		);

		return {
			total: processedPokemon.length,
			implemented: implementedCount,
			future: futureCount,
			past: pastCount,
			completionRate:
				processedPokemon.length > 0
					? Math.round((implementedCount / processedPokemon.length) * 100)
					: 0,
		};
	}, [processedPokemon, isShiny, futureDates, pastDates]);

	// 日付セクションへのスクロール関数
	const scrollToDate = useCallback((date: string) => {
		const element = document.getElementById(`date-section-${date}`);
		if (element) {
			// 要素の位置を取得
			const elementRect = element.getBoundingClientRect();
			const absoluteElementTop = elementRect.top + window.pageYOffset;
			// ヘッダーやナビゲーションの高さを考慮してオフセットを調整
			const offset = 120; // 120pxのオフセット
			const targetPosition = absoluteElementTop - offset;

			window.scrollTo({
				top: targetPosition,
				behavior: "smooth",
			});
		}
	}, []);

	return (
		<div className="mx-auto max-w-7xl space-y-4">
			<YearlyHeatmap pokemons={pokemons} onDateClick={scrollToDate} />

			{futureDates.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
							<Clock className="h-6 w-6" />
							実装予定
							<Badge
								variant="secondary"
								className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
							>
								{stats.future}体
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{futureDates.map((date) => (
							<div
								key={date}
								id={`date-section-${date}`}
								className="scroll-mt-32 space-y-3"
							>
								<div className="flex items-center gap-3 border-orange-200/50 border-b pb-2 dark:border-orange-700/50">
									<Badge
										variant="outline"
										className="border-orange-300 text-orange-700 dark:border-orange-700 dark:text-orange-300"
									>
										{date}
									</Badge>
									<span className="text-muted-foreground text-sm">
										{grouped[date].length}体
									</span>
								</div>
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
							</div>
						))}
					</CardContent>
				</Card>
			)}

			{/* 実装履歴セクション */}
			{pastDates.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300">
							<CheckCircle className="h-6 w-6" />
							実装履歴
							<Badge
								variant="secondary"
								className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
							>
								{stats.past}体
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{pastDates.map((date) => (
							<div
								key={date}
								id={`date-section-${date}`}
								className="scroll-mt-32 space-y-3"
							>
								<div className="flex items-center gap-3 border-green-200/50 border-b pb-2 dark:border-green-700/50">
									<Badge
										variant="outline"
										className="border-green-300 text-green-700 dark:border-green-700 dark:text-green-300"
									>
										{date}
									</Badge>
									<span className="text-muted-foreground text-sm">
										{grouped[date].length}体
									</span>
								</div>
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
							</div>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
