import { StatsCard } from "@/components/stats/stats-card";
import type { RegionStats as RegionStatsType } from "@/lib/stats";

interface RegionStatsProps {
	stats: RegionStatsType[];
}

const REGION_NAMES: Record<string, string> = {
	kanto: "カントー地方",
	johto: "ジョウト地方",
	hoenn: "ホウエン地方",
	sinnoh: "シンオウ地方",
	unova: "イッシュ地方",
	kalos: "カロス地方",
	alola: "アローラ地方",
	galar: "ガラル地方",
	hisui: "ヒスイ地方",
	paldea: "パルデア地方",
	unknown: "不明",
};

export function RegionStats({ stats }: RegionStatsProps) {
	return (
		<div className="space-y-4">
			<h2 className="font-semibold text-lg">地方別統計</h2>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{stats.map((stat) => (
					<StatsCard
						key={stat.region}
						title={REGION_NAMES[stat.region] || stat.region}
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
