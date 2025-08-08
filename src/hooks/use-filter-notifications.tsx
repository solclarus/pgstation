"use client";

import type { Option } from "@/lib/control-panel/config";
import { hasActiveFilters } from "@/lib/control-panel/config";
import { Filter, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useFilterNotifications(options: Option) {
	const previousOptions = useRef<Option | null>(null);
	const hasShownInitialLoad = useRef(false);

	useEffect(() => {
		// 初期ロード時はスキップ
		if (!hasShownInitialLoad.current) {
			hasShownInitialLoad.current = true;
			previousOptions.current = options;
			return;
		}

		// オプションが変更された場合のみ通知
		if (
			previousOptions.current &&
			JSON.stringify(previousOptions.current) !== JSON.stringify(options)
		) {
			const isActive = hasActiveFilters(options);

			if (isActive) {
				toast.success("フィルターが適用されました", {
					duration: 2000,
					icon: <Filter className="h-4 w-4" />,
				});
			} else {
				toast.info("フィルターが解除されました", {
					duration: 2000,
					icon: <RotateCcw className="h-4 w-4" />,
				});
			}
		}

		previousOptions.current = options;
	}, [options]);

	const showClearNotification = () => {
		toast.info("フィルターがリセットされました", {
			duration: 2000,
			icon: <RotateCcw className="h-4 w-4" />,
		});
	};

	return { showClearNotification };
}