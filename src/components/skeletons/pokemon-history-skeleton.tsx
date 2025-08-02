import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import { CheckCircle, Clock } from "lucide-react";

export function PokemonHistorySkeleton() {
	return (
		<div className="mx-auto max-w-7xl space-y-4">
			{/* ヒートマップスケルトン */}
			<Card className="w-full">
				<CardHeader>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex items-center gap-2">
							<Skeleton className="h-8 w-24" />
							<div className="flex items-center gap-1">
								<Skeleton className="h-8 w-8" />
								<Skeleton className="h-8 w-8" />
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex flex-wrap items-center gap-4">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-4 w-28" />
						</div>
						<div className="hidden items-center gap-2 md:flex">
							<Skeleton className="h-3 w-8" />
							<div className="flex items-center gap-1">
								{Array.from({ length: 5 }, (_, i) => (
									<Skeleton key={i} className="h-3 w-3 rounded-sm" />
								))}
							</div>
							<Skeleton className="h-3 w-8" />
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<div className="flex min-w-fit gap-1.5 p-2">
							{Array.from({ length: 53 }, (_, weekIndex) => (
								<div key={weekIndex} className="grid grid-rows-7 gap-1.5">
									{Array.from({ length: 7 }, (_, dayIndex) => (
										<Skeleton
											key={dayIndex}
											className="h-2.5 w-2.5 rounded-sm md:h-3 md:w-3"
										/>
									))}
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* 実装予定セクション */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-3 text-orange-700 dark:text-orange-300">
						<Clock className="h-6 w-6" />
						実装予定
						<Skeleton className="h-6 w-12" />
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{Array.from({ length: 3 }, (_, i) => (
						<div key={i} className="space-y-3">
							<div className="flex items-center gap-3 border-orange-200/50 border-b pb-2 dark:border-orange-700/50">
								<Skeleton className="h-6 w-20" />
								<Skeleton className="h-4 w-8" />
							</div>
							<div className="grid-list">
								{Array.from({ length: 8 }, (_, j) => (
									<div
										key={j}
										className="grid aspect-square place-items-center p-6"
									>
										<Skeleton className="h-full w-full rounded-md" />
									</div>
								))}
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			{/* 実装履歴セクション */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-300">
						<CheckCircle className="h-6 w-6" />
						実装履歴
						<Skeleton className="h-6 w-12" />
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{Array.from({ length: 5 }, (_, i) => (
						<div key={i} className="space-y-3">
							<div className="flex items-center gap-3 border-green-200/50 border-b pb-2 dark:border-green-700/50">
								<Skeleton className="h-6 w-20" />
								<Skeleton className="h-4 w-8" />
							</div>
							<div className="grid-list">
								{Array.from({ length: 12 }, (_, j) => (
									<div
										key={j}
										className="grid aspect-square place-items-center p-6"
									>
										<Skeleton className="h-full w-full rounded-md" />
									</div>
								))}
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
