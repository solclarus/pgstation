import { POKEMON_TYPES } from "@/constants/pokemon-type";
import type { SortOption } from "@/lib/control-panel";
import type {
	PokemonClass,
	PokemonForm,
	PokemonType,
	Region,
} from "@/types/pokemon";

export const CLASS_FILTER_OPTIONS: {
	value: "all" | PokemonClass;
	label: string;
}[] = [
	{ value: "all", label: "全て" },
	{ value: "normal", label: "通常" },
	{ value: "legendary", label: "伝説" },
	{ value: "mythical", label: "幻" },
	{ value: "ub", label: "UB" },
];

export const REGION_FILTER_OPTIONS: {
	value: "all" | Region;
	label: string;
}[] = [
	{ value: "all", label: "全て" },
	{ value: "kanto", label: "カントー" },
	{ value: "johto", label: "ジョウト" },
	{ value: "hoenn", label: "ホウエン" },
	{ value: "sinnoh", label: "シンオウ" },
	{ value: "unova", label: "イッシュ" },
	{ value: "kalos", label: "カロス" },
	{ value: "alola", label: "アローラ" },
	{ value: "galar", label: "ガラル" },
	{ value: "hisui", label: "ヒスイ" },
	{ value: "paldea", label: "パルデア" },
	{ value: "unknown", label: "未確認" },
];

export const FORM_FILETR_OPTIONS: {
	value: "all" | PokemonForm;
	label: string;
}[] = [
	{ value: "all", label: "全て" },
	{ value: "normal", label: "通常" },
	{ value: "mega", label: "メガシンカ" },
	{ value: "gmax", label: "キョダイマックス" },
];

export const IMPLEMENTED_STATUS_OPTIONS: {
	value: "all" | "implemented" | "not-implemented";
	label: string;
}[] = [
	{ value: "all", label: "全て" },
	{ value: "implemented", label: "実装済み" },
	{ value: "not-implemented", label: "未実装" },
];

export const SHINY_IMPLEMENTED_STATUS_OPTIONS: {
	value: "all" | "shiny-implemented" | "shiny-not-implemented";
	label: string;
}[] = [
	{ value: "all", label: "全て" },
	{ value: "shiny-implemented", label: "色違い実装済み" },
	{ value: "shiny-not-implemented", label: "色違い未実装" },
];

export const pokemonTypeOptions: {
	value: "all" | PokemonType;
	label: string;
	color: string;
}[] = [
	{ value: "all", label: "全て", color: "bg-gray-200" },
	...Object.entries(POKEMON_TYPES).map(([key, value]) => ({
		value: key as PokemonType,
		label: value.name.ja,
		color: value.color,
	})),
];

export const generationOptions = [
	{ value: "all", label: "全て" },
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

export const SORT_OPTIONS: {
	value: SortOption;
	label: string;
}[] = [
	{ value: "pokedex-number-asc", label: "図鑑番号 (昇順)" },
	{ value: "pokedex-number-desc", label: "図鑑番号 (降順)" },
	{ value: "name-asc", label: "名前 (あ→ん)" },
	{ value: "name-desc", label: "名前 (ん→あ)" },
];
