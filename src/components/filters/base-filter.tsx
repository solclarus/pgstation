"use client";

import { FormControl, FormItem, FormLabel } from "@ui/form";
import type { ReactNode } from "react";

interface BaseFilterProps {
	label: string;
	children: ReactNode;
}

export function BaseFilter({ label, children }: BaseFilterProps) {
	return (
		<FormItem>
			<FormLabel className="font-medium text-sm">{label}</FormLabel>
			<FormControl>{children}</FormControl>
		</FormItem>
	);
}

// 共通の選択状態管理ロジック
export function useMultiSelect<T>(value: T[], onChange: (value: T[]) => void) {
	const handleToggle = (item: T) => {
		const isSelected = value.includes(item);
		const newValue = isSelected
			? value.filter((v) => v !== item)
			: [...value, item];
		onChange(newValue);
	};

	const isSelected = (item: T) => value.includes(item);

	return { handleToggle, isSelected };
}
