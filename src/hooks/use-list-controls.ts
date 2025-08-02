"use client";

import type { Option } from "@/lib/control-panel/config";
import {
	parseAndCleanSearchParams,
	updateURLParams,
} from "@/lib/control-panel/config";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useRef, useEffect } from "react";

export function useListControls() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	
	// URL解析のキャッシュ用ref
	const lastSearchParams = useRef<string>("");
	const cachedOptions = useRef<Option | null>(null);
	const pendingCleanupParams = useRef<URLSearchParams | null>(null);

	const options = useMemo(() => {
		const currentParams = searchParams.toString();
		
		// パラメータが変更されていない場合はキャッシュを返す
		if (currentParams === lastSearchParams.current && cachedOptions.current) {
			return cachedOptions.current;
		}
		
		// 新しいパラメータを解析してキャッシュに保存
		const { options: parsed, cleanedParams } = parseAndCleanSearchParams(searchParams);
		
		// 無効なパラメータが検出された場合、useEffectで処理するためにrefに保存
		if (cleanedParams) {
			pendingCleanupParams.current = cleanedParams;
		}
		
		lastSearchParams.current = currentParams;
		cachedOptions.current = parsed;
		
		return parsed;
	}, [searchParams]);

	// useEffectでマウント後にURL修正を実行
	useEffect(() => {
		if (pendingCleanupParams.current) {
			const cleanedParams = pendingCleanupParams.current;
			pendingCleanupParams.current = null;
			
			const newUrl = `${pathname}?${cleanedParams.toString()}`;
			router.replace(newUrl);
		}
	}); // 依存関係配列なし = 毎回実行されるが、refで制御

	const setOption = useCallback(
		(options: Option) => {
			const params = updateURLParams(searchParams, options);
			router.push(`${pathname}?${params.toString()}`);
		},
		[router, pathname, searchParams],
	);

	const clearOption = useCallback(() => {
		router.push(pathname);
	}, [router, pathname]);

	return {
		options,
		setOption,
		clearOption,
	};
}
