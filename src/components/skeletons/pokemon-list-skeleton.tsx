import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3X3 } from "lucide-react";

export function PokemonListSkeleton() {
	return (
		<div className="space-y-6">
			{/* ヘッダーカード */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="flex items-center gap-3">
							<Grid3X3 className="h-6 w-6 text-blue-500" />
							<Skeleton className="h-6 w-32" />
						</CardTitle>
						<Skeleton className="h-4 w-48" />
					</div>
				</CardHeader>
			</Card>

			{/* ポケモングリッドカード */}
			<Card>
				<CardContent className="p-6">
					<div className="grid-list">
						{Array.from({ length: 50 }, (_, i) => (
							<PokemonCardSkeleton key={i} />
						))}
					</div>
				</CardContent>
			</Card>

			{/* ページネーションスケルトン */}
			<div className="flex items-center justify-center space-x-2 pt-4">
				<Skeleton className="h-9 w-9" />
				<div className="flex items-center space-x-1">
					{Array.from({ length: 5 }, (_, i) => (
						<Skeleton key={i} className="h-8 w-10" />
					))}
				</div>
				<Skeleton className="h-9 w-9" />
			</div>

			{/* ページ情報スケルトン */}
			<div className="text-center">
				<Skeleton className="mx-auto h-4 w-32" />
			</div>
		</div>
	);
}

function PokemonCardSkeleton() {
	return (
		<div className="grid aspect-square place-items-center p-6">
			<div className="relative h-full w-full">
				<Skeleton className="h-full w-full rounded-md" />
			</div>
		</div>
	);
}
