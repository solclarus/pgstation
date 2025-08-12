"use client";

import { Badge } from "@ui/badge";
import { BaseFilter, useMultiSelect } from "./base-filter";
import type { MultiSelectFilterProps } from "./types";

export function MultiSelectFilter({
	label,
	options,
	value,
	onChange,
}: MultiSelectFilterProps) {
	const { handleToggle, isSelected } = useMultiSelect(value, onChange);

	return (
		<BaseFilter label={label}>
			<div className="flex flex-wrap gap-2">
				{options.map((option) => (
					<button
						type="button"
						key={option.value}
						className="border-none bg-transparent p-0"
						onClick={() => handleToggle(option.value)}
					>
						<Badge variant={isSelected(option.value) ? "default" : "outline"}>
							{option.label}
						</Badge>
					</button>
				))}
			</div>
		</BaseFilter>
	);
}
