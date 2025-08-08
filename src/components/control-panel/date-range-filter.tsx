"use client";

import { cn } from "@/lib/utils";
import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar";
import { Label } from "@ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DateRangeFilterProps {
	value?: {
		from?: Date;
		to?: Date;
	};
	onChange: (range?: { from?: Date; to?: Date }) => void;
}

// ポケモンGO実装日
const POKEMON_GO_LAUNCH_DATE = new Date(2016, 6, 6); // 2016年7月6日

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
	const handleFromChange = (date: Date | undefined) => {
		onChange({
			...value,
			from: date,
		});
	};

	const handleToChange = (date: Date | undefined) => {
		onChange({
			...value,
			to: date,
		});
	};

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<Label>実装日期間</Label>
			</div>

			<div className="grid grid-cols-2 gap-2">
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								"justify-start text-left font-normal",
								!value?.from && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-1 size-3" />
							{value?.from ? format(value.from, "yyyy-MM-dd") : "開始日"}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={value?.from}
							onSelect={handleFromChange}
							disabled={(date) =>
								date < POKEMON_GO_LAUNCH_DATE ||
								(value?.to ? date > value.to : false)
							}
							captionLayout="dropdown"
						/>
					</PopoverContent>
				</Popover>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className={cn(
								"justify-start text-left font-normal ",
								!value?.to && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-1 size-3" />
							{value?.to ? format(value.to, "yyyy-MM-dd") : "終了日"}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0" align="start">
						<Calendar
							mode="single"
							selected={value?.to}
							onSelect={handleToChange}
							disabled={(date) =>
								date < POKEMON_GO_LAUNCH_DATE ||
								(value?.from ? date < value.from : false)
							}
							captionLayout="dropdown"
						/>
					</PopoverContent>
				</Popover>
			</div>
		</div>
	);
}
