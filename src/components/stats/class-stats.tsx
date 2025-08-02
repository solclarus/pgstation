import { getClassDisplay } from "@/constants/pokemon-display";
import type { ClassStats } from "@/lib/stats";
import { Badge } from "@ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Progress } from "@ui/progress";
import { Users } from "lucide-react";

interface ClassStatsProps {
	stats: ClassStats[];
}

export function ClassStatsComponent({ stats }: ClassStatsProps) {
	const getClassColor = (className: string) => {
		switch (className) {
			case "legendary":
				return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800";
			case "mythical":
				return "text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800";
			case "ultra-beast":
				return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";
			case "paradox":
				return "text-pink-600 bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800";
			default:
				return "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800";
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Users className="h-5 w-5 text-indigo-500" />
					分類別実装状況
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{stats.map((stat) => (
						<div key={stat.class} className="space-y-3">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Badge
										variant="outline"
										className={getClassColor(stat.class)}
									>
										{getClassDisplay(stat.class).label}
									</Badge>
									<span className="text-muted-foreground text-sm">
										{stat.total}匹中{stat.implemented}匹実装済み
									</span>
								</div>
								<div className="text-right">
									<div className="font-bold text-lg">
										{stat.implementationRate.toFixed(1)}%
									</div>
								</div>
							</div>

							{/* 実装進捗バー */}
							<div className="space-y-2">
								<div className="flex items-center justify-between text-sm">
									<span>通常実装進捗</span>
									<span>
										{stat.implemented}/{stat.total}
									</span>
								</div>
								<Progress value={stat.implementationRate} className="h-2" />
							</div>

							{/* 色違い実装状況 */}
							<div className="grid grid-cols-3 gap-4 pt-2 text-center">
								<div>
									<div className="text-muted-foreground text-sm">総数</div>
									<div className="font-bold">{stat.total}</div>
								</div>
								<div>
									<div className="text-muted-foreground text-sm">実装済み</div>
									<div className="font-bold text-green-600">
										{stat.implemented}
									</div>
								</div>
								<div>
									<div className="text-muted-foreground text-sm">
										色違い実装
									</div>
									<div className="font-bold text-yellow-600">
										{stat.shinyImplemented}
										<span className="ml-1 text-muted-foreground text-xs">
											({stat.shinyRate.toFixed(1)}%)
										</span>
									</div>
								</div>
							</div>

							{/* セパレーター */}
							{stat !== stats[stats.length - 1] && (
								<div className="border-border/50 border-t" />
							)}
						</div>
					))}

					{/* 全体サマリー */}
					<div className="mt-6 border-t pt-4">
						<div className="grid grid-cols-2 gap-4 text-center">
							<div>
								<div className="text-muted-foreground text-sm">最高実装率</div>
								<div className="font-bold text-green-600 text-lg">
									{Math.max(...stats.map((s) => s.implementationRate)).toFixed(
										1,
									)}
									%
								</div>
								<div className="text-muted-foreground text-xs">
									{
										getClassDisplay(
											stats.reduce((prev, current) =>
												prev.implementationRate > current.implementationRate
													? prev
													: current,
											).class,
										).label
									}
								</div>
							</div>
							<div>
								<div className="text-muted-foreground text-sm">
									最高色違い率
								</div>
								<div className="font-bold text-lg text-yellow-600">
									{Math.max(...stats.map((s) => s.shinyRate)).toFixed(1)}%
								</div>
								<div className="text-muted-foreground text-xs">
									{
										getClassDisplay(
											stats.reduce((prev, current) =>
												prev.shinyRate > current.shinyRate ? prev : current,
											).class,
										).label
									}
								</div>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
