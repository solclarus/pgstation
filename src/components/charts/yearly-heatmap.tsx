"use client";

import { CalendarDayComponent } from "@/components/charts/calendar-day";
import { getYearlyCalendar } from "@/lib/date-utils";
import type { Pokemon } from "@/types/pokemon";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader } from "@ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/select";
import { getYear, parseISO } from "date-fns";
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface YearlyHeatmapProps {
	pokemons: Pokemon[];
	onDateClick?: (date: string) => void;
}

export function YearlyHeatmap({ pokemons, onDateClick }: YearlyHeatmapProps) {
	const availableYears = useMemo(() => {
		const years = new Set<number>();

		for (const pokemon of pokemons) {
			if (pokemon.implemented_date) {
				try {
					const date = parseISO(pokemon.implemented_date);
					years.add(getYear(date));
				} catch {
					// 無効な日付文字列をスキップ
				}
			}
			if (pokemon.shiny_implemented_date) {
				try {
					const date = parseISO(pokemon.shiny_implemented_date);
					years.add(getYear(date));
				} catch {
					// 無効な日付文字列をスキップ
				}
			}
		}

		return Array.from(years).sort((a, b) => b - a);
	}, [pokemons]);

	const [selectedYear, setSelectedYear] = useState(() => {
		if (availableYears.length > 0) {
			return availableYears[0];
		}
		return new Date().getFullYear();
	});

	const yearlyData = useMemo(
		() => getYearlyCalendar(selectedYear, pokemons),
		[selectedYear, pokemons],
	);

	const navigateYear = (direction: "prev" | "next") => {
		const newYear = direction === "next" ? selectedYear + 1 : selectedYear - 1;
		setSelectedYear(newYear);
	};

	// 隣の年にデータがあるかチェック（availableYearsを使用して最適化）
	const hasDataForYear = useCallback(
		(year: number) => {
			return availableYears.includes(year);
		},
		[availableYears],
	);

	const canNavigatePrev = hasDataForYear(selectedYear - 1);
	const canNavigateNext = hasDataForYear(selectedYear + 1);

	return (
		<Card className="w-full">
			<CardHeader>
				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-2">
						<Select
							value={selectedYear.toString()}
							onValueChange={(value) => setSelectedYear(Number(value))}
						>
							<SelectTrigger className="w-24">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{availableYears.map((year) => (
									<SelectItem key={year} value={year.toString()}>
										{year}年
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<div className="flex items-center gap-1">
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigateYear("prev")}
								disabled={!canNavigatePrev}
							>
								<ChevronLeft className="size-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => navigateYear("next")}
								disabled={!canNavigateNext}
							>
								<ChevronRight className="size-4" />
							</Button>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
						<div className="flex items-center gap-1">
							<Calendar className="size-3" />
							通常実装: {yearlyData.totalImplementations}
						</div>
						<div className="flex items-center gap-1">
							<Sparkles className="size-3" />
							色違い実装: {yearlyData.totalShinyImplementations}
						</div>
					</div>

					<div className="hidden items-center gap-2 text-muted-foreground text-xs md:flex">
						<span>Less</span>
						<div className="flex items-center gap-1">
							<div className="size-3 rounded-sm bg-muted/30" />
							<div className="size-3 rounded-sm bg-green-200 dark:bg-green-900/50" />
							<div className="size-3 rounded-sm bg-green-400 dark:bg-green-700/70" />
							<div className="size-3 rounded-sm bg-green-600 dark:bg-green-600/90" />
							<div className="size-3 rounded-sm bg-green-800 dark:bg-green-500" />
						</div>
						<span>More</span>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				{/* GitHubスタイルヒートマップ - レスポンシブ対応 */}
				<div className="overflow-x-auto">
					<div className="flex min-w-fit gap-1.5 p-2">
						{yearlyData.weeks.map((week, weekIndex) => (
							<div key={weekIndex} className="grid grid-rows-7 gap-1.5">
								{week.days.map((day, dayIndex) => {
									if (!day) {
										return (
											<div
												key={dayIndex}
												className="h-2.5 w-2.5 md:h-3 md:w-3"
											/>
										);
									}

									const calendarDay = {
										date: day.date,
										implementations: day.implementations,
										shinyImplementations: day.shinyImplementations,
										isCurrentMonth: true,
									};
									return (
										<CalendarDayComponent
											key={dayIndex}
											day={calendarDay}
											onDateClick={onDateClick}
										/>
									);
								})}
							</div>
						))}
					</div>
				</div>

				{/* モバイル用カラーレジェンド */}
				<div className="mt-4 flex justify-center md:hidden">
					<div className="flex items-center gap-2 text-muted-foreground text-xs">
						<span>少ない</span>
						<div className="flex items-center gap-1">
							<div className="size-2.5 rounded-sm bg-muted/30" />
							<div className="size-2.5 rounded-sm bg-green-200 dark:bg-green-900/50" />
							<div className="size-2.5 rounded-sm bg-green-400 dark:bg-green-700/70" />
							<div className="size-2.5 rounded-sm bg-green-600 dark:bg-green-600/90" />
							<div className="size-2.5 rounded-sm bg-green-800 dark:bg-green-500" />
						</div>
						<span>多い</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
