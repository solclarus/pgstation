"use client";

import { StatsCard } from "@/components/stats/stats-card";
import type { GenerationStats as GenerationStatsType } from "@/lib/stats";
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

interface GenerationStatsProps {
	stats: GenerationStatsType[];
}

const GENERATION_NAMES: Record<number, string> = {
	1: "第1世代 (カントー)",
	2: "第2世代 (ジョウト)",
	3: "第3世代 (ホウエン)",
	4: "第4世代 (シンオウ)",
	5: "第5世代 (イッシュ)",
	6: "第6世代 (カロス)",
	7: "第7世代 (アローラ)",
	8: "第8世代 (ガラル)",
	9: "第9世代 (パルデア)",
};

const chartConfig = {
	total: {
		label: "総数",
		color: "#e5e7eb", // グレー - 総数（背景）
	},
	implemented: {
		label: "実装済み",
		color: "#059669", // エメラルド - 実装済み
	},
	shinyImplemented: {
		label: "色違い実装",
		color: "#eab308", // イエロー - 色違い実装
	},
	implementationRate: {
		label: "実装率",
		color: "#7c3aed", // バイオレット - 実装率
	},
} satisfies ChartConfig;

export function GenerationStats({ stats }: GenerationStatsProps) {
	// チャート用データの準備
	const chartData = stats.map((stat) => ({
		generation: `第${stat.generation}世代`,
		generationShort: `Gen${stat.generation}`,
		total: stat.total,
		implemented: stat.implemented,
		shinyImplemented: stat.shinyImplemented,
		implementationRate: stat.implementationRate,
		unimplemented: stat.total - stat.implemented,
	}));

	return (
		<div className="space-y-6">
			<div>
				<h2 className="font-semibold text-lg">世代別統計</h2>
				<p className="text-muted-foreground text-sm">
					各世代のポケモン実装状況
				</p>
			</div>

			{/* 世代別実装状況グラフ */}
			<Card>
				<CardHeader>
					<CardTitle>世代別実装状況</CardTitle>
					<CardDescription>
						各世代の総数、実装済み、色違い実装数の比較
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ChartContainer config={chartConfig} className="h-[300px]">
						<BarChart data={chartData}>
							<XAxis
								dataKey="generationShort"
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
												: `${value}匹`,
											chartConfig[name as keyof typeof chartConfig]?.label ||
												name,
										]}
									/>
								}
							/>
							<Bar
								dataKey="total"
								fill="var(--color-total)"
								radius={[2, 2, 0, 0]}
								fillOpacity={0.3}
							/>
							<Bar
								dataKey="implemented"
								fill="var(--color-implemented)"
								radius={[2, 2, 0, 0]}
							/>
							<Bar
								dataKey="shinyImplemented"
								fill="var(--color-shinyImplemented)"
								radius={[2, 2, 0, 0]}
							/>
						</BarChart>
					</ChartContainer>
				</CardContent>
			</Card>

			{/* 世代別カード表示 */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{stats.map((stat) => (
					<StatsCard
						key={stat.generation}
						title={
							GENERATION_NAMES[stat.generation] || `第${stat.generation}世代`
						}
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
