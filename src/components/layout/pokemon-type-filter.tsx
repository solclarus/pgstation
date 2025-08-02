"use client";

import { FormControl, FormItem, FormLabel } from "@ui/form";
import Image from "next/image";

interface Option {
	value: string;
	label: string;
}

interface PokemonTypeFilterProps {
	label: string;
	options: Option[];
	value: string[];
	onChange: (value: string[]) => void;
}

export function PokemonTypeFilter({
	label,
	options,
	value,
	onChange,
}: PokemonTypeFilterProps) {
	const handleOptionClick = (optionValue: string) => {
		const isChecked = value.includes(optionValue);
		let newValue = [...value] as string[];

		if (isChecked) {
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
				<div className="grid grid-cols-6 gap-2">
					{options.map((option) => {
						const checked = value.includes(option.value);
						return (
							<button
								type="button"
								key={option.value}
								className="border-none bg-transparent p-0"
								onClick={() => handleOptionClick(option.value)}
							>
								<Image
									src={`/images/type/${option.value}.png`}
									alt={option.label}
									width={32}
									height={32}
									className={`size-8 rounded-full ${
										checked ? "opacity-100" : "opacity-30"
									}`}
								/>
							</button>
						);
					})}
				</div>
			</FormControl>
		</FormItem>
	);
}
