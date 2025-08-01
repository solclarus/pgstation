import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Progress } from "@ui/progress";

interface StatsCardProps {
	title: string;
	total: number;
	implemented: number;
	shinyImplemented: number;
	implementationRate: number;
	shinyRate: number;
	className?: string;
}

export function StatsCard({
	title,
	total,
	implemented,
	shinyImplemented,
	implementationRate,
	shinyRate,
	className,
}: StatsCardProps) {
	return (
		<Card className={className}>
			<CardHeader className="pb-2">
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex justify-between text-sm">
					<span>総数</span>
					<span className="font-medium">{total}</span>
				</div>

				<div className="space-y-1">
					<div className="flex justify-between text-sm">
						<span>実装済み</span>
						<span className="font-medium">
							{implemented}/{total}
						</span>
					</div>
					<Progress value={implementationRate} className="h-2" />
					<div className="text-center text-muted-foreground text-xs">
						{implementationRate.toFixed(1)}%
					</div>
				</div>

				<div className="space-y-1">
					<div className="flex justify-between text-sm">
						<span>色違い実装</span>
						<span className="font-medium">
							{shinyImplemented}/{implemented}
						</span>
					</div>
					<Progress value={shinyRate} className="h-2" />
					<div className="text-center text-muted-foreground text-xs">
						{shinyRate.toFixed(1)}%
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
