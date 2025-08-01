import { ClassStatsComponent } from "@/components/stats/class-stats";
import { GenerationStats } from "@/components/stats/generation-stats";
import { ImplementationTrendComponent } from "@/components/stats/implementation-trend";
import { MonthlyStatsComponent } from "@/components/stats/monthly-stats";
import { RegionStats } from "@/components/stats/region-stats";
import { StatsOverview } from "@/components/stats/stats-overview";
import { TopImplementationDaysComponent } from "@/components/stats/top-implementation-days";
import { TypeStats } from "@/components/stats/type-stats";
import {
	getClassStats,
	getGenerationStats,
	getImplementationTrend,
	getMonthlyStats,
	getPokemonStats,
	getRegionStats,
	getTopImplementationDays,
	getTypeStats,
} from "@/lib/stats";
import { Suspense } from "react";

function StatsLoadingSkeleton() {
	return (
		<div className="space-y-8">
			{/* 基本統計スケルトン */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
				))}
			</div>

			{/* 実装トレンドスケルトン */}
			<div className="grid gap-4 md:grid-cols-2">
				{Array.from({ length: 2 }).map((_, i) => (
					<div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
				))}
			</div>

			{/* 月別統計スケルトン */}
			<div className="space-y-4">
				<div className="grid gap-4 md:grid-cols-3">
					{Array.from({ length: 3 }).map((_, i) => (
						<div key={i} className="h-20 animate-pulse rounded-lg bg-muted" />
					))}
				</div>
				<div className="h-80 animate-pulse rounded-lg bg-muted" />
			</div>

			{/* その他のコンポーネントスケルトン */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
				))}
			</div>
		</div>
	);
}

async function StatsContent() {
	const [
		overallStats,
		generationStats,
		regionStats,
		typeStats,
		classStats,
		implementationTrend,
		monthlyStats,
		topDays,
	] = await Promise.all([
		getPokemonStats(),
		getGenerationStats(),
		getRegionStats(),
		getTypeStats(),
		getClassStats(),
		getImplementationTrend(),
		getMonthlyStats(),
		getTopImplementationDays(),
	]);

	return (
		<div className="space-y-8">
			{/* 基本統計 */}
			<StatsOverview stats={overallStats} />

			{/* 実装トレンド */}
			<ImplementationTrendComponent trends={implementationTrend} />

			{/* 月別統計 */}
			<MonthlyStatsComponent stats={monthlyStats} />

			{/* トップ実装日 */}
			<TopImplementationDaysComponent
				topNormalDays={topDays.topNormalDays}
				topShinyDays={topDays.topShinyDays}
			/>

			{/* 分類別統計 */}
			<ClassStatsComponent stats={classStats} />

			{/* 世代別統計 */}
			<GenerationStats stats={generationStats} />

			{/* 地方別統計 */}
			<RegionStats stats={regionStats} />

			{/* タイプ別統計 */}
			<TypeStats stats={typeStats} />
		</div>
	);
}

export default function StatsPage() {
	return (
		<div className="container mx-auto py-8">
			<div className="mb-8">
				<h1 className="font-bold text-3xl">実装統計ダッシュボード</h1>
				<p className="text-muted-foreground">
					ポケモンの実装状況を総合的に分析した詳細統計情報です。実装トレンド、月別推移、分類別進捗など、様々な角度からデータを可視化しています。
				</p>
			</div>

			<Suspense fallback={<StatsLoadingSkeleton />}>
				<StatsContent />
			</Suspense>
		</div>
	);
}
