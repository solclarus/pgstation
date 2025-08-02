"use client";

import { Badge } from "@ui/badge";
import { FormControl, FormItem, FormLabel } from "@ui/form";

interface BooleanFilterProps {
	label: string;
	value: boolean[];
	onChange: (value: boolean[]) => void;
	trueLabel?: string;
	falseLabel?: string;
}

export function BooleanFilter({
	label,
	value,
	onChange,
	trueLabel = "実装済",
	falseLabel = "未実装",
}: BooleanFilterProps) {
	const handleToggle = (booleanValue: boolean) => {
		const currentValues = value || [];
		const newValues = currentValues.includes(booleanValue)
			? currentValues.filter((v) => v !== booleanValue)
			: [...currentValues, booleanValue];
		onChange(newValues);
	};

	return (
		<FormItem>
			<FormLabel className="font-medium text-sm">{label}</FormLabel>
			<FormControl>
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						className="border-none bg-transparent p-0"
						onClick={() => handleToggle(true)}
					>
						<Badge variant={value?.includes(true) ? "default" : "outline"}>
							{trueLabel}
						</Badge>
					</button>
					<button
						type="button"
						className="border-none bg-transparent p-0"
						onClick={() => handleToggle(false)}
					>
						<Badge variant={value?.includes(false) ? "default" : "outline"}>
							{falseLabel}
						</Badge>
					</button>
				</div>
			</FormControl>
		</FormItem>
	);
}
