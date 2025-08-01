"use client";

import type { ImplementationTrend } from "@/lib/stats";
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
import { LineChart, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis } from "recharts";

interface ImplementationTrendProps {
	trends: ImplementationTrend[];
}

const chartConfig = {
	implementations: {
		label: "通常実装",
		color: "#3b82f6", // 青色 - 通常実装
	},
	shinyImplementations: {
		label: "色違い実装",
		color: "#f59e0b", // オレンジ色 - 色違い実装
	},
	cumulativeImplementations: {
		label: "累積通常実装",
		color: "#1e40af", // 濃い青色 - 累積通常実装
	},
	cumulativeShinyImplementations: {
		label: "累積色違い実装",
		color: "#dc2626", // 赤色 - 累積色違い実装
	},
} satisfies ChartConfig;

export function ImplementationTrendComponent({
	trends,
}: ImplementationTrendProps) {
	// 最近3ヶ月のデータを表示
	const recentTrends = trends.slice(-90);

	// チャート用データの準備
	const chartData = recentTrends.map((trend) => ({
		date: trend.date,
		formattedDate: new Date(trend.date).toLocaleDateString("ja-JP", {
			month: "short",
			day: "numeric",
		}),
		implementations: trend.implementations,
		shinyImplementations: trend.shinyImplementations,
		cumulativeImplementations: trend.cumulativeImplementations,
		cumulativeShinyImplementations: trend.cumulativeShinyImplementations,
	}));

	// 最近30日のデータ（日別用）
	const dailyData = trends.slice(-30).map((trend) => ({
		date: trend.date,
		formattedDate: new Date(trend.date).toLocaleDateString("ja-JP", {
			month: "numeric",
			day: "numeric",
		}),
		implementations: trend.implementations,
		shinyImplementations: trend.shinyImplementations,
	}));

	const latestData = recentTrends[recentTrends.length - 1];
	const thirtyDaysSum = dailyData.reduce(
		(sum, item) => ({
			implementations: sum.implementations + item.implementations,
			shinyImplementations:
				sum.shinyImplementations + item.shinyImplementations,
		}),
		{ implementations: 0, shinyImplementations: 0 },
	);

	return (
		<div className="grid gap-4 md:grid-cols-2">
			{/* 累積実装トレンド */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<LineChart className="h-5 w-5 text-blue-500" />
						実装トレンド（累積）
					</CardTitle>
					<CardDescription>過去3ヶ月の累積実装数推移</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4 text-center">
							<div>
								<div className="font-bold text-2xl text-blue-600">
									{latestData?.cumulativeImplementations || 0}
								</div>
								<div className="text-muted-foreground text-sm">通常実装</div>
							</div>
							<div>
								<div className="font-bold text-2xl text-yellow-600">
									{latestData?.cumulativeShinyImplementations || 0}
								</div>
								<div className="text-muted-foreground text-sm">色違い実装</div>
							</div>
						</div>

						<ChartContainer config={chartConfig} className="h-[200px]">
							<AreaChart data={chartData}>
								<XAxis
									dataKey="formattedDate"
									tick={{ fontSize: 10 }}
									interval="preserveStartEnd"
								/>
								<YAxis tick={{ fontSize: 10 }} />
								<ChartTooltip content={<ChartTooltipContent />} />
								<Area
									type="monotone"
									dataKey="cumulativeImplementations"
									stackId="1"
									stroke="var(--color-cumulativeImplementations)"
									fill="var(--color-cumulativeImplementations)"
									fillOpacity={0.3}
								/>
								<Area
									type="monotone"
									dataKey="cumulativeShinyImplementations"
									stackId="2"
									stroke="var(--color-cumulativeShinyImplementations)"
									fill="var(--color-cumulativeShinyImplementations)"
									fillOpacity={0.3}
								/>
							</AreaChart>
						</ChartContainer>
					</div>
				</CardContent>
			</Card>

			{/* 日別実装数 */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<TrendingUp className="h-5 w-5 text-green-500" />
						日別実装数
					</CardTitle>
					<CardDescription>最近30日の日別実装数</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div className="grid grid-cols-2 gap-4 text-center">
							<div>
								<div className="font-bold text-green-600 text-xl">
									{thirtyDaysSum.implementations}
								</div>
								<div className="text-muted-foreground text-sm">
									30日間合計（通常）
								</div>
							</div>
							<div>
								<div className="font-bold text-orange-600 text-xl">
									{thirtyDaysSum.shinyImplementations}
								</div>
								<div className="text-muted-foreground text-sm">
									30日間合計（色違い）
								</div>
							</div>
						</div>

						<ChartContainer config={chartConfig} className="h-[200px]">
							<BarChart data={dailyData}>
								<XAxis
									dataKey="formattedDate"
									tick={{ fontSize: 10 }}
									interval="preserveStartEnd"
								/>
								<YAxis tick={{ fontSize: 10 }} />
								<ChartTooltip content={<ChartTooltipContent />} />
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
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
