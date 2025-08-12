// 共通型定義
export interface FilterOption {
	value: string;
	label: string;
}

export interface BaseFilterProps<T> {
	label: string;
	value: T;
	onChange: (value: T) => void;
}

export interface MultiSelectFilterProps extends BaseFilterProps<string[]> {
	options: FilterOption[];
}

export interface BooleanFilterProps extends BaseFilterProps<boolean[]> {
	trueLabel?: string;
	falseLabel?: string;
}

export interface DateRangeFilterProps
	extends BaseFilterProps<{ from?: Date; to?: Date } | undefined> {}
