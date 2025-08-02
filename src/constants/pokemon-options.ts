import { POKEMON_TYPES } from "@/constants/pokemon-type";
import {
	POKEMON_CLASSES,
	POKEMON_FORMS,
	REGIONS,
	type PokemonType,
} from "@/types/pokemon";

// ===== POKEMON CLASS OPTIONS =====
export const CLASS_OPTIONS = Object.entries(POKEMON_CLASSES).map(([value, label]) => ({
	value: value as keyof typeof POKEMON_CLASSES,
	label,
}));

// ===== POKEMON FORM OPTIONS =====
export const FORM_OPTIONS = Object.entries(POKEMON_FORMS).map(([value, label]) => ({
	value: value as keyof typeof POKEMON_FORMS,
	label,
}));

// ===== REGION OPTIONS =====
export const REGION_OPTIONS = Object.entries(REGIONS).map(([value, label]) => ({
	value: value as keyof typeof REGIONS,
	label,
}));

// ===== POKEMON TYPE OPTIONS =====
export const POKEMON_TYPE_OPTIONS: {
	value: PokemonType;
	label: string;
	color: string;
}[] = Object.entries(POKEMON_TYPES).map(([key, value]) => ({
	value: key as PokemonType,
	label: value.name.ja,
	color: value.color,
}));

// ===== GENERATION OPTIONS =====
export const GENERATION_OPTIONS = [
	{ value: "1", label: "第1世代" },
	{ value: "2", label: "第2世代" },
	{ value: "3", label: "第3世代" },
	{ value: "4", label: "第4世代" },
	{ value: "5", label: "第5世代" },
	{ value: "6", label: "第6世代" },
	{ value: "7", label: "第7世代" },
	{ value: "8", label: "第8世代" },
	{ value: "9", label: "第9世代" },
];

// ===== SORT OPTIONS =====
export const SORT_OPTIONS: {
	value: "pokedex-number-asc" | "pokedex-number-desc" | "name-asc" | "name-desc";
	label: string;
}[] = [
	{ value: "pokedex-number-asc", label: "図鑑番号 (昇順)" },
	{ value: "pokedex-number-desc", label: "図鑑番号 (降順)" },
	{ value: "name-asc", label: "名前 (あ→ん)" },
	{ value: "name-desc", label: "名前 (ん→あ)" },
];