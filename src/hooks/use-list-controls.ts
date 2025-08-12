"use client";

import type { Option } from "@/lib/filters";
import { normalizeSearchParams, updateURLParams } from "@/lib/filters";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

export function useListControls() {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const { options, cleanedParams } = useMemo(() => {
		return normalizeSearchParams(searchParams);
	}, [searchParams]);

	// 無効パラメータがあれば副作用としてURL修正
	useEffect(() => {
		if (cleanedParams) {
			router.replace(`${pathname}?${cleanedParams.toString()}`);
		}
	}, [cleanedParams, router, pathname]);

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
