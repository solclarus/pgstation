"use client";

import type { MonthlyStats } from "@/lib/stats";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@ui/chart";
import { Calendar, TrendingUp, Trophy } from "lucide-react";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from "recharts";

interface MonthlyStatsProps {
	stats: MonthlyStats[];
}

const chartConfig = {
	implementations: {
		label: "通常実装",
		color: "#10b981", // エメラルドグリーン - 通常実装
	},
	shinyImplementations: {
		label: "色違い実装",
		color: "#f59e0b", // アンバー - 色違い実装
	},
	implementationRate: {
		label: "色違い実装率",
		color: "#8b5cf6", // パープル - 実装率
	},
} satisfies ChartConfig;

export function MonthlyStatsComponent({ stats }: MonthlyStatsProps) {
	// 最近12ヶ月のデータ
	const recentStats = stats.slice(-12);

	// 最も活発だった月を特定
	const mostActiveMonth = stats.reduce((prev, current) =>
		prev.implementations > current.implementations ? prev : current,
	);

	const bestShinyMonth = stats.reduce((prev, current) =>
		prev.shinyImplementations > current.shinyImplementations ? prev : current,
	);

	const formatMonth = (monthStr: string) => {
		const [year, month] = monthStr.split("-");
		return `${year}年${Number.parseInt(month)}月`;
	};

	const formatMonthShort = (monthStr: string) => {
		const [year, month] = monthStr.split("-");
		return `${year.slice(2)}/${Number.parseInt(month)}`;
	};

	// チャート用データの準備
	const chartData = recentStats.map((stat) => ({
		month: stat.month,
		formattedMonth: formatMonthShort(stat.month),
		implementations: stat.implementations,
		shinyImplementations: stat.shinyImplementations,
		implementationRate: stat.implementationRate,
	}));

	return (
		<div className="space-y-6">
			{/* 月別ハイライト */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Trophy className="h-4 w-4 text-yellow-500" />
							最多実装月
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-1">
							<div className="font-bold text-lg text-yellow-600">
								{formatMonth(mostActiveMonth.month)}
							</div>
							<div className="text-muted-foreground text-sm">
								<span className="font-semibold text-yellow-600">
									{mostActiveMonth.implementations}
								</span>
								件の実装
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm">
							<TrendingUp className="h-4 w-4 text-green-500" />
							色違い最多月
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-1">
							<div className="font-bold text-green-600 text-lg">
								{formatMonth(bestShinyMonth.month)}
							</div>
							<div className="text-muted-foreground text-sm">
								<span className="font-semibold text-green-600">
									{bestShinyMonth.shinyImplementations}
								</span>
								件の色違い実装
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-3">
						<CardTitle className="flex items-center gap-2 text-sm">
							<Calendar className="h-4 w-4 text-blue-500" />
							月平均実装数
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-1">
							<div className="font-bold text-blue-600 text-lg">
								{(
									stats.reduce((sum, s) => sum + s.implementations, 0) /
									stats.length
								).toFixed(1)}
							</div>
							<div className="text-muted-foreground text-sm">件/月</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 月別推移グラフ */}
			<Card>
				<CardHeader>
					<CardTitle>月別実装推移（最近12ヶ月）</CardTitle>
					<CardDescription>月ごとの実装数と色違い実装率の推移</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig} className="h-[300px]">
						<BarChart data={chartData}>
							<XAxis
								dataKey="formattedMonth"
								tick={{ fontSize: 12 }}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis tick={{ fontSize: 12 }} />
							<ChartTooltip
								content={
									<ChartTooltipContent
										formatter={(value, name) => [
											name === "implementationRate"
												? `${Number(value).toFixed(1)}%`
												: `${value}件`,
											chartConfig[name as keyof typeof chartConfig]?.label ||
												name,
										]}
									/>
								}
							/>
							<Bar
								dataKey="implementations"
								fill="var(--color-implementations)"
								radius={[2, 2, 0, 0]}
							/>
							<Bar
								dataKey="shinyImplementations"
								fill="var(--color-shinyImplementations)"
								radius={[2, 2, 0, 0]}
							/>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* 色違い実装率推移 */}
			<Card>
				<CardHeader>
					<CardTitle>色違い実装率推移</CardTitle>
					<CardDescription>月別の色違い実装率の変化</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig} className="h-[200px]">
						<LineChart data={chartData}>
							<XAxis
								dataKey="formattedMonth"
								tick={{ fontSize: 12 }}
								tickLine={false}
								axisLine={false}
							/>
							<YAxis
								tick={{ fontSize: 12 }}
								domain={[0, 100]}
								tickFormatter={(value) => `${value}%`}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										formatter={(value) => [
											`${Number(value).toFixed(1)}%`,
											"色違い実装率",
										]}
									/>
								}
							/>
							<Line
								type="monotone"
								dataKey="implementationRate"
								stroke="var(--color-implementationRate)"
								strokeWidth={3}
								dot={{
									fill: "var(--color-implementationRate)",
									strokeWidth: 2,
									r: 4,
								}}
								activeDot={{
									r: 6,
									stroke: "var(--color-implementationRate)",
									strokeWidth: 2,
								}}
							/>
						</LineChart>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	);
}
