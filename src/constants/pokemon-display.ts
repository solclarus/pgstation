/**
 * ポケモン表示に関する定数とマッピング関数
 */

// ポケモンタイプの色マッピング
export const TYPE_COLOR_MAP: Record<string, string> = {
	normal: "bg-gray-400",
	fire: "bg-red-500",
	water: "bg-blue-500",
	electric: "bg-yellow-400",
	grass: "bg-green-500",
	ice: "bg-blue-200",
	fighting: "bg-red-700",
	poison: "bg-purple-500",
	ground: "bg-yellow-600",
	flying: "bg-indigo-400",
	psychic: "bg-pink-500",
	bug: "bg-green-400",
	rock: "bg-yellow-800",
	ghost: "bg-purple-700",
	dragon: "bg-indigo-700",
	dark: "bg-gray-800",
	steel: "bg-gray-500",
	fairy: "bg-pink-300",
} as const;

// ポケモンクラスの表示情報
export const CLASS_DISPLAY_MAP: Record<
	string,
	{ label: string; color: string }
> = {
	normal: {
		label: "通常",
		color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
	},
	legendary: {
		label: "伝説",
		color:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
	},
	mythical: {
		label: "幻",
		color:
			"bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
	},
	ub: {
		label: "UB",
		color:
			"bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
	},
} as const;

// 地方名のマッピング
export const REGION_DISPLAY_MAP: Record<string, string> = {
	kanto: "カントー",
	johto: "ジョウト",
	hoenn: "ホウエン",
	sinnoh: "シンオウ",
	unova: "イッシュ",
	kalos: "カロス",
	alola: "アローラ",
	galar: "ガラル",
	hisui: "ヒスイ",
	paldea: "パルデア",
	unknown: "不明",
} as const;

// ステータス名のマッピング
export const STAT_DISPLAY_MAP: Record<string, string> = {
	hp: "HP",
	attack: "攻撃",
	defense: "防御",
	"special-attack": "特攻",
	"special-defense": "特防",
	speed: "素早さ",
} as const;

// ヘルパー関数
export const getTypeColor = (type: string): string =>
	TYPE_COLOR_MAP[type] || "bg-gray-400";

export const getClassDisplay = (className: string) =>
	CLASS_DISPLAY_MAP[className] || {
		label: className,
		color: "bg-gray-100 text-gray-800",
	};

export const getRegionName = (region: string): string =>
	REGION_DISPLAY_MAP[region] || region;

export const getStatName = (stat: string): string =>
	STAT_DISPLAY_MAP[stat] || stat;
