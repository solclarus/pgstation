"use client";

import { Badge } from "@ui/badge";
import { FormControl, FormItem, FormLabel } from "@ui/form";

interface Option {
	value: string;
	label: string;
}

interface MultiSelectFilterProps {
	label: string;
	options: Option[];
	value: string[];
	onChange: (value: string[]) => void;
}

export function MultiSelectFilter({
	label,
	options,
	value,
	onChange,
}: MultiSelectFilterProps) {
	const isChecked = (optionValue: string) => value.includes(optionValue);

	const handleClick = (optionValue: string) => {
		const isSelected = value.includes(optionValue);
		let newValue = [...value] as string[];

		if (isSelected) {
			newValue = newValue.filter((v) => v !== optionValue);
		} else {
			newValue.push(optionValue);
		}

		onChange(newValue);
	};

	return (
		<FormItem>
			<FormLabel className="font-medium text-sm">{label}</FormLabel>
			<FormControl>
				<div className="flex flex-wrap gap-2">
					{options.map((option) => {
						return (
							<button
								type="button"
								key={option.value}
								className="border-none bg-transparent p-0"
								onClick={() => handleClick(option.value)}
							>
								<Badge
									variant={isChecked(option.value) ? "default" : "outline"}
								>
									{option.label}
								</Badge>
							</button>
						);
					})}
				</div>
			</FormControl>
		</FormItem>
	);
}
