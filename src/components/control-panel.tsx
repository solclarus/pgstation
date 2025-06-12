"use client";

import { usePokemonParams } from "@/hooks/use-pokemon-params";
import {
	CLASS_FILTER_OPTIONS,
	FORM_FILETR_OPTIONS,
	IMPLEMENTED_STATUS_OPTIONS,
	REGION_FILTER_OPTIONS,
	SHINY_IMPLEMENTED_STATUS_OPTIONS,
	SORT_OPTIONS,
	pokemonTypeOptions,
} from "@/lib/control-panel/options";
import { type Option, optionSchema } from "@/lib/control-panel/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@ui/form";
import { ScrollArea } from "@ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/select";
import { CircleDotIcon } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function ControlPanel({ onApplied }: { onApplied?: () => void } = {}) {
	const { options, setOption, clearOption } = usePokemonParams();

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
	const hasChanges = JSON.stringify(formValues) !== JSON.stringify(options);
	const hasActiveFilters =
		JSON.stringify(options.class) !== JSON.stringify(["all"]) ||
		JSON.stringify(options.form) !== JSON.stringify(["all"]) ||
		options.implementedStatus !== "all" ||
		options.shinyImplementedStatus !== "all" ||
		JSON.stringify(options.pokemonType) !== JSON.stringify(["all"]) ||
		JSON.stringify(options.region) !== JSON.stringify(["all"]) ||
		options.sort !== "pokedex-number-asc";

	return (
		<ScrollArea className="h-full rounded-md border bg-card p-4">
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-lg">フィルター・ソート</h2>
				</div>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						{/* 分類マルチセレクター */}
						<FormField
							control={form.control}
							name="class"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-sm">分類</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											{CLASS_FILTER_OPTIONS.map((option) => {
												const checked = field.value.includes(option.value);
												return (
													<button
														type="button"
														key={option.value}
														className="border-none bg-transparent p-0"
														onClick={() => {
															let newValue = [
																...field.value,
															] as typeof field.value;
															if (option.value === "all") {
																newValue = ["all"];
															} else {
																newValue = newValue.filter((v) => v !== "all");
																if (checked) {
																	newValue = newValue.filter(
																		(v) => v !== option.value,
																	);
																} else {
																	newValue.push(option.value);
																}
																if (newValue.length === 0) {
																	newValue = ["all"];
																}
															}
															field.onChange(newValue);
														}}
													>
														<Badge variant={checked ? "default" : "outline"}>
															{option.label}
														</Badge>
													</button>
												);
											})}
										</div>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="form"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-sm">姿</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											{FORM_FILETR_OPTIONS.map((option) => {
												const checked = field.value.includes(option.value);
												return (
													<button
														type="button"
														key={option.value}
														className="border-none bg-transparent p-0"
														onClick={() => {
															let newValue = [
																...field.value,
															] as typeof field.value;
															if (option.value === "all") {
																newValue = ["all"];
															} else {
																newValue = newValue.filter((v) => v !== "all");
																if (checked) {
																	newValue = newValue.filter(
																		(v) => v !== option.value,
																	);
																} else {
																	newValue.push(option.value);
																}
																if (newValue.length === 0) {
																	newValue = ["all"];
																}
															}
															field.onChange(newValue);
														}}
													>
														<Badge variant={checked ? "default" : "outline"}>
															{option.label}
														</Badge>
													</button>
												);
											})}
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="implementedStatus"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-sm">実装</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											{IMPLEMENTED_STATUS_OPTIONS.map((option) => (
												<button
													type="button"
													key={option.value}
													className="border-none bg-transparent p-0"
													onClick={() => field.onChange(option.value)}
												>
													<Badge
														variant={
															field.value === option.value
																? "default"
																: "outline"
														}
													>
														{option.label}
													</Badge>
												</button>
											))}
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="shinyImplementedStatus"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-sm">
										色違い実装
									</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											{SHINY_IMPLEMENTED_STATUS_OPTIONS.map((option) => (
												<button
													type="button"
													key={option.value}
													className="border-none bg-transparent p-0"
													onClick={() => field.onChange(option.value)}
												>
													<Badge
														variant={
															field.value === option.value
																? "default"
																: "outline"
														}
													>
														{option.label}
													</Badge>
												</button>
											))}
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="pokemonType"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-sm">タイプ</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											{pokemonTypeOptions.map((option) => {
												const checked = field.value.includes(option.value);
												return (
													<button
														type="button"
														key={option.value}
														className="border-none bg-transparent p-0"
														onClick={() => {
															let newValue = [
																...field.value,
															] as typeof field.value;
															if (option.value === "all") {
																newValue = ["all"];
															} else {
																newValue = newValue.filter((v) => v !== "all");
																if (checked) {
																	newValue = newValue.filter(
																		(v) => v !== option.value,
																	);
																} else {
																	newValue.push(option.value);
																}
																if (newValue.length === 0) {
																	newValue = ["all"];
																}
															}
															field.onChange(newValue);
														}}
													>
														{option.value === "all" ? (
															<CircleDotIcon
																aria-label={option.label}
																className={`size-8 rounded-full ${
																	checked ? "opacity-100" : "opacity-30"
																}`}
															/>
														) : (
															<Image
																src={`/images/type/${option.value}.png`}
																alt={option.label}
																width={32}
																height={32}
																className={`size-8 rounded-full ${
																	checked ? "opacity-100" : "opacity-30"
																}`}
															/>
														)}
													</button>
												);
											})}
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="region"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-sm">地方</FormLabel>
									<FormControl>
										<div className="flex flex-wrap gap-2">
											{REGION_FILTER_OPTIONS.map((option) => {
												const checked = field.value.includes(option.value);
												return (
													<button
														type="button"
														key={option.value}
														className="border-none bg-transparent p-0"
														onClick={() => {
															let newValue = [
																...field.value,
															] as typeof field.value;
															if (option.value === "all") {
																newValue = ["all"];
															} else {
																newValue = newValue.filter((v) => v !== "all");
																if (checked) {
																	newValue = newValue.filter(
																		(v) => v !== option.value,
																	);
																} else {
																	newValue.push(option.value);
																}
																if (newValue.length === 0) {
																	newValue = ["all"];
																}
															}
															field.onChange(newValue);
														}}
													>
														<Badge variant={checked ? "default" : "outline"}>
															{option.label}
														</Badge>
													</button>
												);
											})}
										</div>
									</FormControl>
								</FormItem>
							)}
						/>

						{/* ソートセレクター */}
						<FormField
							control={form.control}
							name="sort"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-medium text-sm">ソート</FormLabel>
									<Select onValueChange={field.onChange} value={field.value}>
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
								disabled={!hasActiveFilters}
								className="flex-1"
							>
								リセット
							</Button>
							<Button type="submit" disabled={!hasChanges} className="flex-1">
								適用
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</ScrollArea>
	);
}
