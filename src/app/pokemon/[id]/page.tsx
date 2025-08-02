import { ImageCard } from "@/components/pokemon/image-card";
import { PokemonDetailSkeleton } from "@/components/skeletons/pokemon-detail-skeleton";
import {
	getClassDisplay,
	getRegionName,
	getStatName,
	getTypeColor,
} from "@/constants/pokemon-display";
import { getPokemon } from "@/lib/pokemon";
import type { PokemonApiResponse } from "@/types/pokemon";
import { Badge } from "@ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Progress } from "@ui/progress";
import { Separator } from "@ui/separator";
import {
	Calendar,
	Crown,
	Info,
	Palette,
	Ruler,
	Sparkles,
	Weight,
} from "lucide-react";
import { Suspense } from "react";

type Props = {
	params: Promise<{ id: string }>;
};

async function PokemonDetailContent({ params }: Props) {
	const { id } = await params;
	const pokemon = await getPokemon(id);
	if (!pokemon) {
		return null;
	}
	const response = await fetch(
		`https://pokeapi.co/api/v2/pokemon/${pokemon?.pokedex_number}`,
	);
	const { height, weight, stats }: PokemonApiResponse = await response.json();

	const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0);

	return (
		<div className="mx-auto max-w-4xl space-y-6 p-4">
			{/* ヘッダーセクション */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Badge variant="outline" className="text-sm">
								No.{pokemon.pokedex_number}
							</Badge>
							<CardTitle className="font-bold text-2xl">
								{pokemon.name}
							</CardTitle>
						</div>
						<Badge className={getClassDisplay(pokemon.pokemon_class).color}>
							<Crown className="mr-1 h-3 w-3" />
							{getClassDisplay(pokemon.pokemon_class).label}
						</Badge>
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
								<ImageCard id={pokemon.id} isShiny={false} priority />
							</div>
							<div className="space-y-2">
								<p className="text-center font-medium text-muted-foreground text-sm">
									色違い
								</p>
								<ImageCard id={pokemon.id} isShiny priority />
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
								<span className="font-medium">{(height / 10).toFixed(1)}m</span>
							</div>
							<div className="flex items-center gap-2">
								<Weight className="h-4 w-4 text-muted-foreground" />
								<span className="text-sm">体重:</span>
								<span className="font-medium">
									{(weight / 10).toFixed(1)}kg
								</span>
							</div>
						</div>

						<Separator />

						<div className="space-y-2">
							<p className="font-medium text-sm">地方</p>
							<Badge variant="secondary">{getRegionName(pokemon.region)}</Badge>
						</div>

						<div className="space-y-2">
							<p className="font-medium text-sm">タイプ</p>
							<div className="flex gap-2">
								{pokemon.pokemon_types.map((type) => (
									<Badge
										key={type}
										className={`text-white ${getTypeColor(type)}`}
									>
										{type.toUpperCase()}
									</Badge>
								))}
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
							{pokemon.implemented_date ? (
								<Badge
									variant="outline"
									className="border-blue-300 text-blue-700 dark:border-blue-700 dark:text-blue-300"
								>
									{pokemon.implemented_date}
								</Badge>
							) : (
								<Badge
									variant="outline"
									className="border-gray-300 text-gray-500"
								>
									未実装
								</Badge>
							)}
						</div>

						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<Sparkles className="h-3 w-3 text-yellow-500" />
								<span className="font-medium text-sm">色違い実装</span>
							</div>
							{pokemon.shiny_implemented_date ? (
								<Badge
									variant="outline"
									className="border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300"
								>
									{pokemon.shiny_implemented_date}
								</Badge>
							) : (
								<Badge
									variant="outline"
									className="border-gray-300 text-gray-500"
								>
									未実装
								</Badge>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* ステータスセクション */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>ステータス</span>
						<Badge variant="secondary">合計: {totalStats}</Badge>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{stats.map((stat) => (
						<div key={stat.stat.name} className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="font-medium text-sm">
									{getStatName(stat.stat.name)}
								</span>
								<span className="font-mono text-sm">{stat.base_stat}</span>
							</div>
							<Progress value={(stat.base_stat / 255) * 100} className="h-2" />
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	);
}

export default function PokemonDetail({ params }: Props) {
	return (
		<Suspense fallback={<PokemonDetailSkeleton />}>
			<PokemonDetailContent params={params} />
		</Suspense>
	);
}
