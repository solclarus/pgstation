"use client";

import {
	type Option,
	classFilterOptionSchema,
	formFilterOptionSchema,
	implementedStatusOptionSchema,
	pokemonTypeFilterOptionSchema,
	regionFilterOptionSchema,
	shinyImplementedStatusOptionSchema,
} from "@/lib/control-panel/schema";
import {
	validateMultiParams,
	validateSortOption,
} from "@/lib/control-panel/validator";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

// 型安全な検証関数
function validateImplementedStatus(value: string | null) {
	const result = implementedStatusOptionSchema.safeParse(value);
	return result.success ? result.data : "all";
}

function validateShinyImplementedStatus(value: string | null) {
	const result = shinyImplementedStatusOptionSchema.safeParse(value);
	return result.success ? result.data : "all";
}

export function usePokemonParams() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const options = useMemo(() => {
		return {
			class: validateMultiParams(
				searchParams,
				"class",
				classFilterOptionSchema,
			),
			form: validateMultiParams(searchParams, "form", formFilterOptionSchema),
			implementedStatus: validateImplementedStatus(
				searchParams.get("implementedStatus"),
			),
			shinyImplementedStatus: validateShinyImplementedStatus(
				searchParams.get("shinyImplementedStatus"),
			),
			pokemonType: validateMultiParams(
				searchParams,
				"pokemonType",
				pokemonTypeFilterOptionSchema,
			),
			region: validateMultiParams(
				searchParams,
				"region",
				regionFilterOptionSchema,
			),
			sort: validateSortOption(searchParams.get("sort")),
		};
	}, [searchParams]);

	const setOption = useCallback(
		(options: Option) => {
			const params = new URLSearchParams(searchParams);
			// フィルター
			for (const key of ["class", "form", "pokemonType", "region"] as const) {
				const value = options[key];
				if (value.length === 0 || value.includes("all")) {
					params.delete(key);
				} else {
					params.set(key, value.join(","));
				}
			}
			params.set("implementedStatus", options.implementedStatus);
			params.set("shinyImplementedStatus", options.shinyImplementedStatus);
			if (options.sort && options.sort !== "pokedex-number-asc") {
				params.set("sort", options.sort);
			} else {
				params.delete("sort");
			}
			router.push(`${pathname}?${params.toString()}`);
		},
		[router, pathname, searchParams],
	);

	// リセット
	const clearOption = useCallback(() => {
		router.push(pathname);
	}, [router, pathname]);

	return {
		options,
		setOption,
		clearOption,
	};
}
