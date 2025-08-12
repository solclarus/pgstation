import { FILTER_CONFIGS } from "./configs";
import {
	DEFAULT_SORT_OPTION,
	type FilterOption,
	type FormInput,
	type Option,
	filterSchema,
	optionSchema,
} from "./schemas";

export const getDefaultFilterValues = (): FilterOption =>
	filterSchema.parse({});
export const getDefaultOptionValues = (): Option => optionSchema.parse({});

export const parseFormInput = (formValues: FormInput): Option => {
	return optionSchema.parse({
		filter: { ...getDefaultFilterValues(), ...formValues.filter },
		sort: formValues.sort || DEFAULT_SORT_OPTION,
	});
};

export const getFieldValue = <T>(value: T | undefined, defaultValue: T): T =>
	value !== undefined ? value : defaultValue;

export function isOptionsEqual(a: Option, b: Option): boolean {
	if ((a.sort || DEFAULT_SORT_OPTION) !== (b.sort || DEFAULT_SORT_OPTION)) {
		return false;
	}

	return Object.keys(FILTER_CONFIGS).every((key) => {
		const k = key as keyof FilterOption;
		const vA = a.filter[k];
		const vB = b.filter[k];

		if (Array.isArray(vA) && Array.isArray(vB)) {
			return (
				vA.length === vB.length &&
				vA.slice().sort().join(",") === vB.slice().sort().join(",")
			);
		}

		return vA === vB;
	});
}
