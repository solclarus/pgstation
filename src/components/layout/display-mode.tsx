"use client";

import { useShinyToggle } from "@/hooks/use-shiny-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Switch } from "@ui/switch";
import { Monitor } from "lucide-react";

export function DisplayMode() {
	const { isShiny, toggleShiny } = useShinyToggle();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-base">
					<Monitor className="h-4 w-4 text-blue-500" />
					表示モード
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm" />
						<span className="font-medium text-sm">通常実装</span>
					</div>
					<Switch
						checked={isShiny}
						onCheckedChange={toggleShiny}
						aria-label="色違い実装切り替え"
					/>
					<div className="flex items-center gap-3">
						<span className="font-medium text-sm">色違い実装</span>
						<div className="h-3 w-3 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 shadow-sm" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
