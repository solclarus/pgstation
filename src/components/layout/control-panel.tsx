"use client";

import { DisplayMode } from "@/components/layout/display-mode";
import { useListControls } from "@/hooks/use-list-controls";
import {
	CLASS_OPTIONS,
	FORM_OPTIONS,
	POKEMON_TYPE_OPTIONS,
	REGION_OPTIONS,
	SORT_OPTIONS,
} from "@/constants/pokemon-options";
import {
	type Option,
	optionSchema,
	isOptionsEqual,
	hasActiveFilters,
} from "@/lib/control-panel/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@ui/form";
import { ScrollArea } from "@ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/select";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { BooleanFilter } from "./boolean-filter";
import { MultiSelectFilter } from "./multi-select-filter";
import { PokemonTypeFilter } from "./pokemon-type-filter";
import { DateRangeFilter } from "../control-panel/date-range-filter";

export function ControlPanel({ onApplied }: { onApplied?: () => void } = {}) {
	const { options, setOption, clearOption } = useListControls();

	const form = useForm<Option>({
		resolver: zodResolver(optionSchema),
		defaultValues: options,
	});

	useEffect(() => {
		form.reset(options);
	}, [options, form]);

	const onSubmit = (values: Option) => {
		setOption(values);
		onApplied?.();
	};

	const formValues = form.watch();
	
	// パフォーマンス最適化: useMemoで軽量な比較関数を使用
	const hasChanges = useMemo(
		() => !isOptionsEqual(formValues, options),
		[formValues, options]
	);
	
	// パフォーマンス最適化: useMemoでアクティブフィルター判定を最適化
	const hasActiveFiltersState = useMemo(
		() => hasActiveFilters(options),
		[options]
	);

	return (
		<ScrollArea className="h-full">
			<div className="space-y-4">
				<DisplayMode />

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-base">
							<SlidersHorizontal className="h-4 w-4 text-green-500" />
							フィルター・ソート
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								className="space-y-4"
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<FormField
									control={form.control}
									name="class"
									render={({ field }) => (
										<MultiSelectFilter
											label={"分類"}
											options={CLASS_OPTIONS}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								/>

								<FormField
									control={form.control}
									name="form"
									render={({ field }) => (
										<MultiSelectFilter
											label={"姿"}
											options={FORM_OPTIONS}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								/>
								<FormField
									control={form.control}
									name="isImplemented"
									render={({ field }) => (
										<BooleanFilter
											label="実装"
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								/>
								<FormField
									control={form.control}
									name="isShinyImplemented"
									render={({ field }) => (
										<BooleanFilter
											label="色違い実装"
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								/>
								<FormField
									control={form.control}
									name="pokemonType"
									render={({ field }) => (
										<PokemonTypeFilter
											label="タイプ"
											options={POKEMON_TYPE_OPTIONS}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								/>
								<FormField
									control={form.control}
									name="region"
									render={({ field }) => (
										<MultiSelectFilter
											label={"地方"}
											options={REGION_OPTIONS}
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								/>

								<FormField
									control={form.control}
									name="implementationDateRange"
									render={({ field }) => (
										<DateRangeFilter
											value={field.value}
											onChange={field.onChange}
										/>
									)}
								/>

								{/* ソートセレクター */}
								<FormField
									control={form.control}
									name="sort"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-medium text-sm">
												ソート
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												value={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{SORT_OPTIONS.map((option) => (
														<SelectItem key={option.value} value={option.value}>
															{option.label}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormItem>
									)}
								/>

								<div className="flex gap-2">
									<Button
										type="button"
										variant="outline"
										onClick={clearOption}
										disabled={!hasActiveFiltersState}
										className="flex-1"
									>
										リセット
									</Button>
									<Button
										type="submit"
										disabled={!hasChanges}
										className="flex-1"
									>
										適用
									</Button>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</ScrollArea>
	);
}
