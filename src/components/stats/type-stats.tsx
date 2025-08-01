"use client";

import { StatsCard } from "@/components/stats/stats-card";
import type { TypeStats as TypeStatsType } from "@/lib/stats";
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
import { Bar, BarChart, XAxis, YAxis } from "recharts";

interface TypeStatsProps {
	stats: TypeStatsType[];
}

const TYPE_NAMES: Record<string, string> = {
	normal: "ノーマル",
	fire: "ほのお",
	water: "みず",
	electric: "でんき",
	grass: "くさ",
	ice: "こおり",
	fighting: "かくとう",
	poison: "どく",
	ground: "じめん",
	flying: "ひこう",
	psychic: "エスパー",
	bug: "むし",
	rock: "いわ",
	ghost: "ゴースト",
	dragon: "ドラゴン",
	dark: "あく",
	steel: "はがね",
	fairy: "フェアリー",
};

const chartConfig = {
	implementationRate: {
		label: "実装率",
		color: "#06b6d4", // シアン - 実装率
	},
	shinyRate: {
		label: "色違い実装率",
		color: "#f59e0b", // アンバー - 色違い実装率
	},
	total: {
		label: "総数",
		color: "#6b7280", // グレー - 総数
	},
} satisfies ChartConfig;

export function TypeStats({ stats }: TypeStatsProps) {
	// 実装率上位12タイプのみ表示
	const topStats = stats.slice(0, 12);

	// チャート用データの準備
	const chartData = topStats.map((stat) => ({
		type: TYPE_NAMES[stat.type] || stat.type,
		typeEn: stat.type,
		total: stat.total,
		implemented: stat.implemented,
		shinyImplemented: stat.shinyImplemented,
		implementationRate: stat.implementationRate,
		shinyRate: stat.shinyRate,
	}));

	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-semibold text-lg">タイプ別統計</h2>
				<p className="text-muted-foreground text-sm">
					各タイプの実装率ランキング（上位12タイプ）
				</p>
			</div>

			{/* タイプ別実装率ランキング */}
			<Card>
				<CardHeader>
					<CardTitle>タイプ別実装率ランキング</CardTitle>
					<CardDescription>実装率の高いタイプ順での比較</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig} className="h-[400px]">
						<BarChart data={chartData} layout="horizontal">
							<XAxis type="number" tick={{ fontSize: 12 }} />
							<YAxis
								dataKey="type"
								type="category"
								tick={{ fontSize: 12 }}
								tickLine={false}
								axisLine={false}
								width={80}
							/>
							<ChartTooltip
								content={
									<ChartTooltipContent
										formatter={(value, name) => [
											name === "implementationRate" || name === "shinyRate"
												? `${Number(value).toFixed(1)}%`
												: `${value}匹`,
											chartConfig[name as keyof typeof chartConfig]?.label ||
												name,
										]}
									/>
								}
							/>
							<Bar
								dataKey="implementationRate"
								fill="var(--color-implementationRate)"
								radius={[0, 2, 2, 0]}
							/>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* タイプ別詳細カード */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{topStats.map((stat) => (
					<StatsCard
						key={stat.type}
						title={TYPE_NAMES[stat.type] || stat.type}
						total={stat.total}
						implemented={stat.implemented}
						shinyImplemented={stat.shinyImplemented}
						implementationRate={stat.implementationRate}
						shinyRate={stat.shinyRate}
					/>
				))}
			</div>
		</div>
	);
}
