import type { Pokemon } from "@/types/pokemon";
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	endOfYear,
	format,
	isSameMonth,
	isSameYear,
	parseISO,
	startOfMonth,
	startOfWeek,
	startOfYear,
} from "date-fns";
import { ja } from "date-fns/locale";

// 共通のカレンダー日付インターフェース
export interface BaseCalendarDay {
	date: Date;
	implementations: Pokemon[];
	shinyImplementations: Pokemon[];
}

// 月間カレンダー用
export interface CalendarDay extends BaseCalendarDay {
	isCurrentMonth: boolean;
}

export interface CalendarWeek {
	days: CalendarDay[];
}

export interface CalendarMonth {
	year: number;
	month: number;
	weeks: CalendarWeek[];
	totalImplementations: number;
	totalShinyImplementations: number;
}

// 年間ヒートマップ用
export interface YearlyCalendarDay extends BaseCalendarDay {
	totalCount: number;
}

export interface YearlyCalendarWeek {
	days: (YearlyCalendarDay | null)[];
	monthName?: string;
}

export interface YearlyCalendarData {
	year: number;
	weeks: YearlyCalendarWeek[];
	totalImplementations: number;
	totalShinyImplementations: number;
}

// 共通のPokemonフィルタリング関数
function filterPokemonsByDate(
	pokemons: Pokemon[],
	dateString: string,
	isShiny: boolean,
): Pokemon[] {
	return pokemons.filter((pokemon) => {
		const dateField = isShiny
			? pokemon.shiny_implemented_date
			: pokemon.implemented_date;
		if (!dateField) return false;
		return dateField === dateString;
	});
}

// 共通の統計計算関数
function calculateYearlyStats(
	pokemons: Pokemon[],
	year: number,
): { implementations: number; shinyImplementations: number } {
	const yearDate = new Date(year, 0, 1);
	let implementations = 0;
	let shinyImplementations = 0;

	for (const pokemon of pokemons) {
		if (pokemon.implemented_date) {
			try {
				const date = parseISO(pokemon.implemented_date);
				if (isSameYear(date, yearDate)) {
					implementations++;
				}
			} catch {
				// 無効な日付文字列をスキップ
			}
		}
		if (pokemon.shiny_implemented_date) {
			try {
				const date = parseISO(pokemon.shiny_implemented_date);
				if (isSameYear(date, yearDate)) {
					shinyImplementations++;
				}
			} catch {
				// 無効な日付文字列をスキップ
			}
		}
	}

	return { implementations, shinyImplementations };
}

export function getCalendarMonth(
	year: number,
	month: number,
	pokemons: Pokemon[],
): CalendarMonth {
	const monthDate = new Date(year, month, 1);
	const monthStart = startOfMonth(monthDate);
	const monthEnd = endOfMonth(monthDate);

	// カレンダー表示用に週の開始/終了を取得（日曜開始）
	const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
	const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

	// 全ての日を取得
	const allDays = eachDayOfInterval({
		start: calendarStart,
		end: calendarEnd,
	});

	const weeks: CalendarWeek[] = [];

	// 7日ずつ週に分割
	for (let i = 0; i < allDays.length; i += 7) {
		const weekDays = allDays.slice(i, i + 7).map((dayDate) => {
			const dateString = format(dayDate, "yyyy-MM-dd");

			const implementations = filterPokemonsByDate(pokemons, dateString, false);
			const shinyImplementations = filterPokemonsByDate(
				pokemons,
				dateString,
				true,
			);

			const day: CalendarDay = {
				date: dayDate,
				implementations,
				shinyImplementations,
				isCurrentMonth: isSameMonth(dayDate, monthDate),
			};

			return day;
		});

		weeks.push({ days: weekDays });
	}

	const totalImplementations = pokemons.filter((pokemon) => {
		if (!pokemon.implemented_date) return false;
		const implementedDate = parseISO(pokemon.implemented_date);
		return (
			isSameMonth(implementedDate, monthDate) &&
			isSameYear(implementedDate, monthDate)
		);
	}).length;

	const totalShinyImplementations = pokemons.filter((pokemon) => {
		if (!pokemon.shiny_implemented_date) return false;
		const implementedDate = parseISO(pokemon.shiny_implemented_date);
		return (
			isSameMonth(implementedDate, monthDate) &&
			isSameYear(implementedDate, monthDate)
		);
	}).length;

	return {
		year,
		month,
		weeks,
		totalImplementations,
		totalShinyImplementations,
	};
}

export function getYearlyCalendar(
	year: number,
	pokemons: Pokemon[],
): YearlyCalendarData {
	const yearStart = startOfYear(new Date(year, 0, 1));
	const yearEnd = endOfYear(new Date(year, 11, 31));

	// GitHubスタイルのヒートマップ用に週の開始/終了を取得
	const calendarStart = startOfWeek(yearStart, { weekStartsOn: 0 });
	const calendarEnd = endOfWeek(yearEnd, { weekStartsOn: 0 });

	// 全ての日を取得
	const allDays = eachDayOfInterval({
		start: calendarStart,
		end: calendarEnd,
	});

	const weeks: YearlyCalendarWeek[] = [];

	// 7日ずつ週に分割
	for (let i = 0; i < allDays.length; i += 7) {
		const weekDays = allDays.slice(i, i + 7);
		const week: YearlyCalendarWeek = { days: [] };

		// 週の最初の日が月の1-7日の場合、月名を設定
		const weekStart = weekDays[0];
		if (
			weekStart.getDate() <= 7 &&
			isSameYear(weekStart, new Date(year, 0, 1))
		) {
			week.monthName = format(weekStart, "M月", { locale: ja });
		}

		for (const dayDate of weekDays) {
			// 年内の日付のみ処理
			if (isSameYear(dayDate, new Date(year, 0, 1))) {
				const dateString = format(dayDate, "yyyy-MM-dd");

				const implementations = filterPokemonsByDate(
					pokemons,
					dateString,
					false,
				);
				const shinyImplementations = filterPokemonsByDate(
					pokemons,
					dateString,
					true,
				);

				const day: YearlyCalendarDay = {
					date: dayDate,
					implementations,
					shinyImplementations,
					totalCount: implementations.length + shinyImplementations.length,
				};

				week.days.push(day);
			} else {
				week.days.push(null);
			}
		}

		weeks.push(week);
	}

	// 統計を計算
	const stats = calculateYearlyStats(pokemons, year);

	return {
		year,
		weeks,
		totalImplementations: stats.implementations,
		totalShinyImplementations: stats.shinyImplementations,
	};
}

export function formatDate(date: Date): string {
	return format(date, "yyyy年M月d日", { locale: ja });
}

export function getAvailableMonths(
	pokemons: Pokemon[],
): Array<{ year: number; month: number }> {
	const months = new Set<string>();

	for (const pokemon of pokemons) {
		if (pokemon.implemented_date) {
			const date = parseISO(pokemon.implemented_date);
			months.add(format(date, "yyyy-M"));
		}
		if (pokemon.shiny_implemented_date) {
			const date = parseISO(pokemon.shiny_implemented_date);
			months.add(format(date, "yyyy-M"));
		}
	}

	return Array.from(months)
		.map((monthStr) => {
			const [year, month] = monthStr.split("-").map(Number);
			return { year, month: month - 1 };
		})
		.sort((a, b) => {
			if (a.year !== b.year) return b.year - a.year;
			return b.month - a.month;
		});
}
