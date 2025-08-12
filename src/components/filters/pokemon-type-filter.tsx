"use client";

import Image from "next/image";
import { BaseFilter, useMultiSelect } from "./base-filter";
import type { MultiSelectFilterProps } from "./types";

export function PokemonTypeFilter({
	label,
	options,
	value,
	onChange,
}: MultiSelectFilterProps) {
	const { handleToggle, isSelected } = useMultiSelect(value, onChange);

	return (
		<BaseFilter label={label}>
			<div className="grid grid-cols-6 gap-2">
				{options.map((option) => (
					<button
						type="button"
						key={option.value}
						className="border-none bg-transparent p-0"
						onClick={() => handleToggle(option.value)}
					>
						<Image
							src={`/images/type/${option.value}.png`}
							alt={option.label}
							width={32}
							height={32}
							unoptimized
							className={`size-8 rounded-full ${
								isSelected(option.value) ? "opacity-100" : "opacity-30"
							}`}
						/>
					</button>
				))}
			</div>
		</BaseFilter>
	);
}
