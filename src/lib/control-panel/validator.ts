import { sortOptionSchema } from "@/lib/control-panel";
import type { z } from "zod";

// ソートパラメータの検証
export function validateSortOption(value: string | null) {
	const result = sortOptionSchema.safeParse(value);
	return result.success ? result.data : "pokedex-number-asc";
}

// 複数パラメータの検証
export function validateMultiParams<T>(
	searchParams: URLSearchParams,
	paramName: string,
	schema: z.ZodSchema<T>,
): T[] {
	// パラメータを取得
	const paramValue = searchParams.get(paramName);

	// パラメータが存在しない場合は空配列を返す
	if (!paramValue) return ["all"] as T[];

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

	return validItems;
}
