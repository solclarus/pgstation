"use client";

import { Badge } from "@ui/badge";
import { BaseFilter, useMultiSelect } from "./base-filter";
import type { BooleanFilterProps } from "./types";

export function BooleanFilter({
	label,
	value,
	onChange,
	trueLabel = "実装済",
	falseLabel = "未実装",
}: BooleanFilterProps) {
	const { handleToggle, isSelected } = useMultiSelect(value || [], onChange);

	return (
		<BaseFilter label={label}>
			<div className="flex flex-wrap gap-2">
				<button
					type="button"
					className="border-none bg-transparent p-0"
					onClick={() => handleToggle(true)}
				>
					<Badge variant={isSelected(true) ? "default" : "outline"}>
						{trueLabel}
					</Badge>
				</button>
				<button
					type="button"
					className="border-none bg-transparent p-0"
					onClick={() => handleToggle(false)}
				>
					<Badge variant={isSelected(false) ? "default" : "outline"}>
						{falseLabel}
					</Badge>
				</button>
			</div>
		</BaseFilter>
	);
}
