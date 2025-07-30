import { sortOptionSchema } from "@/lib/control-panel";
import type { z } from "zod";

// デフォルト値を定数として定義
const DEFAULT_SORT_OPTION = "pokedex-number-asc" as const;
const DEFAULT_MULTI_PARAM_VALUE = "all" as const;

// 汎用的な単一パラメータ検証関数
export function validateSingleParam<T>(
	value: string | null,
	schema: z.ZodSchema<T>,
	defaultValue: T,
): T {
	if (value === null) return defaultValue;

	const result = schema.safeParse(value);
	return result.success ? result.data : defaultValue;
}

// ソートパラメータの検証
export function validateSortOption(value: string | null) {
	return validateSingleParam(value, sortOptionSchema, DEFAULT_SORT_OPTION);
}

// 複数パラメータの検証
export function validateMultiParams<T>(
	searchParams: URLSearchParams,
	paramName: string,
	schema: z.ZodSchema<T>,
): T[] {
	// パラメータを取得
	const paramValue = searchParams.get(paramName);

	// パラメータが存在しない場合はデフォルト値を返す
	if (!paramValue) {
		// "all"がT型に含まれるかチェック
		const defaultResult = schema.safeParse(DEFAULT_MULTI_PARAM_VALUE);
		if (defaultResult.success) {
			return [defaultResult.data];
		}
		return [];
	}

	const items = paramValue
		.split(",")
		.map((item) => item.trim())
		.filter(Boolean);

	// 各要素をスキーマで検証
	const validItems: T[] = [];
	const seenValues = new Set<string>();

	for (const item of items) {
		const result = schema.safeParse(item);
		if (result.success) {
			// 重複チェック
			const checkValue = String(result.data).toLowerCase();

			if (seenValues.has(checkValue)) {
				continue; // 重複をスキップ
			}
			seenValues.add(checkValue);

			validItems.push(result.data);
		}
	}

	// 有効な値がない場合はデフォルト値を返す
	if (validItems.length === 0) {
		const defaultResult = schema.safeParse(DEFAULT_MULTI_PARAM_VALUE);
		if (defaultResult.success) {
			return [defaultResult.data];
		}
	}

	return validItems;
}
