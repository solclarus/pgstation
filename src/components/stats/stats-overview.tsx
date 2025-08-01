import type { PokemonStats } from "@/lib/stats";
import { BarChart3, Star, TrendingUp, Zap } from "lucide-react";

interface StatsOverviewProps {
	stats: PokemonStats;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<div className="rounded-lg border bg-card p-6">
				<div className="flex items-center space-x-2">
					<BarChart3 className="size-4 text-blue-500" />
					<h3 className="font-medium text-sm">総ポケモン数</h3>
				</div>
				<div className="mt-2">
					<div className="font-bold text-2xl text-blue-600">{stats.total}</div>
					<p className="text-muted-foreground text-xs">登録済み</p>
				</div>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<div className="flex items-center space-x-2">
					<TrendingUp className="size-4 text-green-500" />
					<h3 className="font-medium text-sm">実装済み</h3>
				</div>
				<div className="mt-2">
					<div className="font-bold text-2xl text-green-600">
						{stats.implemented}
					</div>
					<p className="text-muted-foreground text-xs">
						{stats.implementationRate.toFixed(1)}% 完了
					</p>
				</div>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<div className="flex items-center space-x-2">
					<Star className="size-4 text-yellow-500" />
					<h3 className="font-medium text-sm">色違い実装</h3>
				</div>
				<div className="mt-2">
					<div className="font-bold text-2xl text-yellow-600">
						{stats.shinyImplemented}
					</div>
					<p className="text-muted-foreground text-xs">
						{stats.shinyRate.toFixed(1)}% 完了
					</p>
				</div>
			</div>

			<div className="rounded-lg border bg-card p-6">
				<div className="flex items-center space-x-2">
					<Zap className="size-4 text-purple-500" />
					<h3 className="font-medium text-sm">未実装</h3>
				</div>
				<div className="mt-2">
					<div className="font-bold text-2xl text-purple-600">
						{stats.total - stats.implemented}
					</div>
					<p className="text-muted-foreground text-xs">
						{(100 - stats.implementationRate).toFixed(1)}% 残り
					</p>
				</div>
			</div>
		</div>
	);
}
