import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Skeleton } from "@ui/skeleton";
import { Calendar, Info, Palette, Ruler, Weight } from "lucide-react";

export function PokemonDetailSkeleton() {
	return (
		<div className="mx-auto max-w-4xl space-y-6 p-4">
			{/* ヘッダーセクション */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Skeleton className="h-6 w-16" />
							<Skeleton className="h-8 w-40" />
						</div>
						<Skeleton className="h-6 w-16" />
					</div>
				</CardHeader>
			</Card>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* 画像セクション */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Palette className="h-5 w-5" />
							ポケモン画像
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<p className="text-center font-medium text-muted-foreground text-sm">
									通常
								</p>
								<Skeleton className="aspect-square w-full rounded-md" />
							</div>
							<div className="space-y-2">
								<p className="text-center font-medium text-muted-foreground text-sm">
									色違い
								</p>
								<Skeleton className="aspect-square w-full rounded-md" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* 基本情報セクション */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Info className="h-5 w-5" />
							基本情報
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<Ruler className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">身長:</span>
								<Skeleton className="h-4 w-12" />
							</div>
							<div className="flex items-center gap-2">
								<Weight className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">体重:</span>
								<Skeleton className="h-4 w-12" />
							</div>
						</div>

						<div className="space-y-2">
							<p className="font-medium text-sm">地方</p>
							<Skeleton className="h-6 w-20" />
						</div>

						<div className="space-y-2">
							<p className="font-medium text-sm">タイプ</p>
							<div className="flex gap-2">
								<Skeleton className="h-6 w-16" />
								<Skeleton className="h-6 w-16" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* 実装情報セクション */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						実装情報
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full bg-blue-500" />
								<span className="font-medium text-sm">通常実装</span>
							</div>
							<Skeleton className="h-6 w-24" />
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="h-3 w-3 rounded-full bg-yellow-500" />
								<span className="font-medium text-sm">色違い実装</span>
							</div>
							<Skeleton className="h-6 w-24" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* ステータスセクション */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>ステータス</span>
						<Skeleton className="h-6 w-16" />
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{Array.from({ length: 6 }, (_, i) => (
						<div key={i} className="space-y-2">
							<div className="flex items-center justify-between">
								<Skeleton className="h-4 w-12" />
								<Skeleton className="h-4 w-8" />
							</div>
							<Skeleton className="h-2 w-full" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
