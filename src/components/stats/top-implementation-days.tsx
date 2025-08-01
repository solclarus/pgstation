import type { TopImplementationDays } from "@/lib/stats";
import { Badge } from "@ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Calendar, Star, Zap } from "lucide-react";

interface TopImplementationDaysProps {
	topNormalDays: TopImplementationDays[];
	topShinyDays: TopImplementationDays[];
}

export function TopImplementationDaysComponent({
	topNormalDays,
	topShinyDays,
}: TopImplementationDaysProps) {
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
	};

	const formatDateShort = (dateStr: string) => {
		const date = new Date(dateStr);
		return `${date.getMonth() + 1}/${date.getDate()}`;
	};

	const getDayOfWeek = (dateStr: string) => {
		const date = new Date(dateStr);
		const days = ["日", "月", "火", "水", "木", "金", "土"];
		return days[date.getDay()];
	};

	return (
		<div className="grid gap-6 lg:grid-cols-2">
			{/* 通常実装の多い日トップ10 */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Calendar className="h-5 w-5 text-blue-500" />
						通常実装が多い日 TOP10
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{topNormalDays.map((day, index) => (
							<div key={day.date} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Badge
										variant={index < 3 ? "default" : "outline"}
										className={`flex h-8 w-8 items-center justify-center rounded-full ${
											index === 0
												? "bg-yellow-500 text-white"
												: index === 1
													? "bg-gray-400 text-white"
													: index === 2
														? "bg-amber-600 text-white"
														: ""
										}`}
									>
										{index + 1}
									</Badge>
									<div>
										<div className="font-medium">{formatDate(day.date)}</div>
										<div className="text-muted-foreground text-sm">
											{getDayOfWeek(day.date)}曜日
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="font-bold text-blue-600 text-lg">
										{day.count}件
									</div>
									<div className="text-muted-foreground text-xs">実装</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* 色違い実装の多い日トップ10 */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Star className="h-5 w-5 text-yellow-500" />
						色違い実装が多い日 TOP10
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{topShinyDays.map((day, index) => (
							<div key={day.date} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Badge
										variant={index < 3 ? "default" : "outline"}
										className={`flex h-8 w-8 items-center justify-center rounded-full ${
											index === 0
												? "bg-yellow-500 text-white"
												: index === 1
													? "bg-gray-400 text-white"
													: index === 2
														? "bg-amber-600 text-white"
														: ""
										}`}
									>
										{index + 1}
									</Badge>
									<div>
										<div className="font-medium">{formatDate(day.date)}</div>
										<div className="text-muted-foreground text-sm">
											{getDayOfWeek(day.date)}曜日
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="font-bold text-lg text-yellow-600">
										{day.count}件
									</div>
									<div className="text-muted-foreground text-xs">
										色違い実装
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* 実装活動サマリー */}
			<Card className="lg:col-span-2">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Zap className="h-5 w-5 text-purple-500" />
						実装活動サマリー
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-4">
						<div className="text-center">
							<div className="font-bold text-2xl text-blue-600">
								{topNormalDays[0]?.count || 0}
							</div>
							<div className="text-muted-foreground text-sm">
								1日最大通常実装数
							</div>
							{topNormalDays[0] && (
								<div className="mt-1 text-muted-foreground text-xs">
									{formatDateShort(topNormalDays[0].date)}
								</div>
							)}
						</div>

						<div className="text-center">
							<div className="font-bold text-2xl text-yellow-600">
								{topShinyDays[0]?.count || 0}
							</div>
							<div className="text-muted-foreground text-sm">
								1日最大色違い実装数
							</div>
							{topShinyDays[0] && (
								<div className="mt-1 text-muted-foreground text-xs">
									{formatDateShort(topShinyDays[0].date)}
								</div>
							)}
						</div>

						<div className="text-center">
							<div className="font-bold text-2xl text-green-600">
								{topNormalDays.reduce((sum, day) => sum + day.count, 0)}
							</div>
							<div className="text-muted-foreground text-sm">
								TOP10日合計（通常）
							</div>
						</div>

						<div className="text-center">
							<div className="font-bold text-2xl text-orange-600">
								{topShinyDays.reduce((sum, day) => sum + day.count, 0)}
							</div>
							<div className="text-muted-foreground text-sm">
								TOP10日合計（色違い）
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
