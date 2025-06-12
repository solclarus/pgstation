import type { PokemonType, PokemonTypeMap } from "@/types/pokemon";

export const POKEMON_TYPES: Record<PokemonType, PokemonTypeMap> = {
	normal: {
		name: {
			en: "Normal",
			ja: "ノーマル",
		},
		color: "bg-gray-400",
	},
	fire: {
		name: {
			en: "Fire",
			ja: "ほのお",
		},
		color: "bg-red-500",
	},
	water: {
		name: {
			en: "Water",
			ja: "みず",
		},
		color: "bg-blue-500",
	},
	electric: {
		name: {
			en: "Electric",
			ja: "でんき",
		},
		color: "bg-yellow-400",
	},
	grass: {
		name: {
			en: "Grass",
			ja: "くさ",
		},
		color: "bg-green-500",
	},
	ice: {
		name: {
			en: "Ice",
			ja: "こおり",
		},
		color: "bg-blue-300",
	},
	fighting: {
		name: {
			en: "Fighting",
			ja: "かくとう",
		},
		color: "bg-red-700",
	},
	poison: {
		name: {
			en: "Poison",
			ja: "どく",
		},
		color: "bg-purple-500",
	},
	ground: {
		name: {
			en: "Ground",
			ja: "じめん",
		},
		color: "bg-yellow-600",
	},
	flying: {
		name: {
			en: "Flying",
			ja: "ひこう",
		},
		color: "bg-indigo-400",
	},
	psychic: {
		name: {
			en: "Psychic",
			ja: "エスパー",
		},
		color: "bg-pink-500",
	},
	bug: {
		name: {
			en: "Bug",
			ja: "むし",
		},
		color: "bg-green-400",
	},
	rock: {
		name: {
			en: "Rock",
			ja: "いわ",
		},
		color: "bg-yellow-800",
	},
	ghost: {
		name: {
			en: "Ghost",
			ja: "ゴースト",
		},
		color: "bg-purple-700",
	},
	dragon: {
		name: {
			en: "Dragon",
			ja: "ドラゴン",
		},
		color: "bg-indigo-700",
	},
	dark: {
		name: {
			en: "Dark",
			ja: "あく",
		},
		color: "bg-gray-800",
	},
	steel: {
		name: {
			en: "Steel",
			ja: "はがね",
		},
		color: "bg-gray-500",
	},
	fairy: {
		name: {
			en: "Fairy",
			ja: "フェアリー",
		},
		color: "bg-pink-300",
	},
};
