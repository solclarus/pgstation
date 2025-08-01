import { type CalendarDay, formatDate } from "@/lib/date-utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@ui/tooltip";
import { format, isToday } from "date-fns";

interface CalendarDayProps {
	day: CalendarDay;
	onDateClick?: (date: string) => void;
}

export function CalendarDayComponent({ day, onDateClick }: CalendarDayProps) {
	const hasImplementations = day.implementations.length > 0;
	const hasShinyImplementations = day.shinyImplementations.length > 0;
	const totalImplementations =
		day.implementations.length + day.shinyImplementations.length;

	// 今日の日付かどうかを判定
	const isTodayCheck = isToday(day.date);
	const dayString = format(day.date, "yyyy-MM-dd");

	// ヒートマップの強度を計算 (0-4段階)
	const getHeatmapIntensity = (count: number): number => {
		if (count === 0) return 0;
		if (count <= 2) return 1;
		if (count <= 5) return 2;
		if (count <= 10) return 3;
		return 4;
	};

	const intensity = getHeatmapIntensity(totalImplementations);

	// GitHubスタイルのヒートマップ色を取得
	const getHeatmapColor = (intensity: number): string => {
		// 今日の日付の場合は特別なスタイルを適用
		if (isTodayCheck) {
			switch (intensity) {
				case 0:
					return "bg-blue-200 hover:bg-blue-300 dark:bg-blue-800/70 dark:hover:bg-blue-800 border-2 border-blue-500 dark:border-blue-400";
				case 1:
					return "bg-green-200 hover:bg-green-300 dark:bg-green-900/50 dark:hover:bg-green-900/70 border-2 border-blue-500 dark:border-blue-400";
				case 2:
					return "bg-green-400 hover:bg-green-500 dark:bg-green-700/70 dark:hover:bg-green-700/90 border-2 border-blue-500 dark:border-blue-400";
				case 3:
					return "bg-green-600 hover:bg-green-700 dark:bg-green-600/90 dark:hover:bg-green-600 border-2 border-blue-500 dark:border-blue-400";
				case 4:
					return "bg-green-800 hover:bg-green-900 dark:bg-green-500 dark:hover:bg-green-400 border-2 border-blue-500 dark:border-blue-400";
				default:
					return "bg-blue-200 hover:bg-blue-300 dark:bg-blue-800/70 dark:hover:bg-blue-800 border-2 border-blue-500 dark:border-blue-400";
			}
		}

		// 通常の日付
		switch (intensity) {
			case 0:
				return "bg-muted/30 hover:bg-muted/50";
			case 1:
				return "bg-green-200 hover:bg-green-300 dark:bg-green-900/50 dark:hover:bg-green-900/70";
			case 2:
				return "bg-green-400 hover:bg-green-500 dark:bg-green-700/70 dark:hover:bg-green-700/90";
			case 3:
				return "bg-green-600 hover:bg-green-700 dark:bg-green-600/90 dark:hover:bg-green-600";
			case 4:
				return "bg-green-800 hover:bg-green-900 dark:bg-green-500 dark:hover:bg-green-400";
			default:
				return "bg-muted/30 hover:bg-muted/50";
		}
	};

	const heatmapColor = getHeatmapColor(intensity);

	// ホバー時の詳細情報を生成（JSX形式で返す）
	const getHoverDetails = () => {
		const datePart = formatDate(day.date);
		const todayIndicator = isTodayCheck ? " (今日)" : "";

		if (totalImplementations === 0) {
			return (
				<div className="text-sm">
					<div className="font-medium">
						{datePart}
						{todayIndicator}
					</div>
					<div className="text-muted-foreground">実装なし</div>
				</div>
			);
		}

		return (
			<div className="text-sm">
				<div className="mb-1 font-medium">
					{datePart}
					{todayIndicator}
				</div>
				{hasImplementations && (
					<div className="flex items-center gap-1.5">
						<div className="h-2 w-2 rounded-full bg-blue-500" />
						<span>通常実装: {day.implementations.length}体</span>
					</div>
				)}
				{hasShinyImplementations && (
					<div className="flex items-center gap-1.5">
						<div className="h-2 w-2 rounded-full bg-gradient-to-br from-yellow-400 to-pink-500" />
						<span>色違い実装: {day.shinyImplementations.length}体</span>
					</div>
				)}
			</div>
		);
	};

	// 日付クリック時の処理
	const handleDateClick = () => {
		if (onDateClick && totalImplementations > 0) {
			const dateString = dayString;
			onDateClick(dateString);
		}
	};

	// キーボードイベント処理
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (
			(event.key === "Enter" || event.key === " ") &&
			totalImplementations > 0
		) {
			event.preventDefault();
			handleDateClick();
		}
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<div
						className={`size-2.5 rounded-sm transition-colors md:h-3 md:w-3 ${heatmapColor} ${
							totalImplementations > 0
								? "cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
								: "cursor-default"
						}`}
						onClick={handleDateClick}
						onKeyDown={handleKeyDown}
						tabIndex={totalImplementations > 0 ? 0 : -1}
						role={totalImplementations > 0 ? "button" : undefined}
						aria-label={
							totalImplementations > 0
								? `${formatDate(day.date)}${isTodayCheck ? " (今日)" : ""} の実装情報にジャンプ`
								: undefined
						}
					/>
				</TooltipTrigger>
				<TooltipContent>{getHoverDetails()}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
