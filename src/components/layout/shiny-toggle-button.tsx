import { Button } from "@ui/button";

interface ShinyToggleButtonProps {
	isShiny: boolean;
	onToggle: (isShiny: boolean) => void;
	labels?: {
		normal: string;
		shiny: string;
	};
	className?: string;
}

export function ShinyToggleButton({
	isShiny,
	onToggle,
	labels = { normal: "通常", shiny: "色違い" },
	className = "mb-4 flex gap-2",
}: ShinyToggleButtonProps) {
	return (
		<div className={className}>
			<Button disabled={!isShiny} onClick={() => onToggle(false)}>
				{labels.normal}
			</Button>
			<Button disabled={isShiny} onClick={() => onToggle(true)}>
				{labels.shiny}
			</Button>
		</div>
	);
}
