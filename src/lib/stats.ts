"server-only";

import { getAllPokemon } from "@/lib/pokemon";
import type { Pokemon } from "@/types/pokemon";
import { cache } from "react";

export interface PokemonStats {
	total: number;
	implemented: number;
	shinyImplemented: number;
	implementationRate: number;
	shinyRate: number;
}

export interface GenerationStats extends PokemonStats {
	generation: number;
}

export interface RegionStats extends PokemonStats {
	region: string;
}

export interface TypeStats extends PokemonStats {
	type: string;
}

export interface ClassStats extends PokemonStats {
	class: string;
}

export const getPokemonStats = cache(async (): Promise<PokemonStats> => {
	const pokemons = await getAllPokemon();

	const total = pokemons.length;
	const implemented = pokemons.filter(
		(p) => p.implemented_date !== null,
	).length;
	const shinyImplemented = pokemons.filter(
		(p) => p.shiny_implemented_date !== null,
	).length;

	return {
		total,
		implemented,
		shinyImplemented,
		implementationRate: total > 0 ? (implemented / total) * 100 : 0,
		shinyRate: implemented > 0 ? (shinyImplemented / implemented) * 100 : 0,
	};
});

export const getGenerationStats = cache(
	async (): Promise<GenerationStats[]> => {
		const pokemons = await getAllPokemon();

		const generationMap = new Map<number, Pokemon[]>();

		for (const pokemon of pokemons) {
			const gen = pokemon.generation;
			if (!generationMap.has(gen)) {
				generationMap.set(gen, []);
			}
			const genPokemons = generationMap.get(gen);
			if (genPokemons) {
				genPokemons.push(pokemon);
			}
		}

		return Array.from(generationMap.entries())
			.map(([generation, genPokemons]) => {
				const total = genPokemons.length;
				const implemented = genPokemons.filter(
					(p) => p.implemented_date !== null,
				).length;
				const shinyImplemented = genPokemons.filter(
					(p) => p.shiny_implemented_date !== null,
				).length;

				return {
					generation,
					total,
					implemented,
					shinyImplemented,
					implementationRate: total > 0 ? (implemented / total) * 100 : 0,
					shinyRate:
						implemented > 0 ? (shinyImplemented / implemented) * 100 : 0,
				};
			})
			.sort((a, b) => a.generation - b.generation);
	},
);

export const getRegionStats = cache(async (): Promise<RegionStats[]> => {
	const pokemons = await getAllPokemon();

	const regionMap = new Map<string, Pokemon[]>();

	for (const pokemon of pokemons) {
		const region = pokemon.region;
		if (!regionMap.has(region)) {
			regionMap.set(region, []);
		}
		const regionPokemons = regionMap.get(region);
		if (regionPokemons) {
			regionPokemons.push(pokemon);
		}
	}

	return Array.from(regionMap.entries())
		.map(([region, regionPokemons]) => {
			const total = regionPokemons.length;
			const implemented = regionPokemons.filter(
				(p) => p.implemented_date !== null,
			).length;
			const shinyImplemented = regionPokemons.filter(
				(p) => p.shiny_implemented_date !== null,
			).length;

			return {
				region,
				total,
				implemented,
				shinyImplemented,
				implementationRate: total > 0 ? (implemented / total) * 100 : 0,
				shinyRate: implemented > 0 ? (shinyImplemented / implemented) * 100 : 0,
			};
		})
		.sort((a, b) => b.implementationRate - a.implementationRate);
});

export const getTypeStats = cache(async (): Promise<TypeStats[]> => {
	const pokemons = await getAllPokemon();

	const typeMap = new Map<string, Pokemon[]>();

	for (const pokemon of pokemons) {
		for (const type of pokemon.pokemon_types) {
			if (!typeMap.has(type)) {
				typeMap.set(type, []);
			}
			const typePokemons = typeMap.get(type);
			if (typePokemons) {
				typePokemons.push(pokemon);
			}
		}
	}

	return Array.from(typeMap.entries())
		.map(([type, typePokemons]) => {
			const total = typePokemons.length;
			const implemented = typePokemons.filter(
				(p) => p.implemented_date !== null,
			).length;
			const shinyImplemented = typePokemons.filter(
				(p) => p.shiny_implemented_date !== null,
			).length;

			return {
				type,
				total,
				implemented,
				shinyImplemented,
				implementationRate: total > 0 ? (implemented / total) * 100 : 0,
				shinyRate: implemented > 0 ? (shinyImplemented / implemented) * 100 : 0,
			};
		})
		.sort((a, b) => b.implementationRate - a.implementationRate);
});

export const getClassStats = cache(async (): Promise<ClassStats[]> => {
	const pokemons = await getAllPokemon();

	const classMap = new Map<string, Pokemon[]>();

	for (const pokemon of pokemons) {
		const pokemonClass = pokemon.pokemon_class;
		if (!classMap.has(pokemonClass)) {
			classMap.set(pokemonClass, []);
		}
		const classPokemons = classMap.get(pokemonClass);
		if (classPokemons) {
			classPokemons.push(pokemon);
		}
	}

	return Array.from(classMap.entries())
		.map(([pokemonClass, classPokemons]) => {
			const total = classPokemons.length;
			const implemented = classPokemons.filter(
				(p) => p.implemented_date !== null,
			).length;
			const shinyImplemented = classPokemons.filter(
				(p) => p.shiny_implemented_date !== null,
			).length;

			return {
				class: pokemonClass,
				total,
				implemented,
				shinyImplemented,
				implementationRate: total > 0 ? (implemented / total) * 100 : 0,
				shinyRate: implemented > 0 ? (shinyImplemented / implemented) * 100 : 0,
			};
		})
		.sort((a, b) => b.implementationRate - a.implementationRate);
});

export interface ImplementationTrend {
	date: string;
	implementations: number;
	shinyImplementations: number;
	cumulativeImplementations: number;
	cumulativeShinyImplementations: number;
}

export interface MonthlyStats {
	month: string;
	implementations: number;
	shinyImplementations: number;
	implementationRate: number;
}

export const getImplementationTrend = cache(
	async (): Promise<ImplementationTrend[]> => {
		const pokemons = await getAllPokemon();
		const dateMap = new Map<
			string,
			{ implementations: number; shinyImplementations: number }
		>();

		// 実装日ごとにカウント
		for (const pokemon of pokemons) {
			if (pokemon.implemented_date) {
				const date = pokemon.implemented_date;
				if (!dateMap.has(date)) {
					dateMap.set(date, { implementations: 0, shinyImplementations: 0 });
				}
				const data = dateMap.get(date);
				if (data) {
					data.implementations++;
				}
			}

			if (pokemon.shiny_implemented_date) {
				const date = pokemon.shiny_implemented_date;
				if (!dateMap.has(date)) {
					dateMap.set(date, { implementations: 0, shinyImplementations: 0 });
				}
				const data = dateMap.get(date);
				if (data) {
					data.shinyImplementations++;
				}
			}
		}

		// 日付順にソートして累積値を計算
		const sortedDates = Array.from(dateMap.keys()).sort();
		let cumulativeImplementations = 0;
		let cumulativeShinyImplementations = 0;

		return sortedDates.map((date) => {
			const data = dateMap.get(date);
			if (!data) {
				return {
					date,
					implementations: 0,
					shinyImplementations: 0,
					cumulativeImplementations,
					cumulativeShinyImplementations,
				};
			}

			cumulativeImplementations += data.implementations;
			cumulativeShinyImplementations += data.shinyImplementations;

			return {
				date,
				implementations: data.implementations,
				shinyImplementations: data.shinyImplementations,
				cumulativeImplementations,
				cumulativeShinyImplementations,
			};
		});
	},
);

export const getMonthlyStats = cache(async (): Promise<MonthlyStats[]> => {
	const pokemons = await getAllPokemon();
	const monthMap = new Map<
		string,
		{ implementations: number; shinyImplementations: number }
	>();

	for (const pokemon of pokemons) {
		if (pokemon.implemented_date) {
			const month = pokemon.implemented_date.substring(0, 7); // YYYY-MM
			if (!monthMap.has(month)) {
				monthMap.set(month, { implementations: 0, shinyImplementations: 0 });
			}
			const data = monthMap.get(month);
			if (data) {
				data.implementations++;
			}
		}

		if (pokemon.shiny_implemented_date) {
			const month = pokemon.shiny_implemented_date.substring(0, 7);
			if (!monthMap.has(month)) {
				monthMap.set(month, { implementations: 0, shinyImplementations: 0 });
			}
			const data = monthMap.get(month);
			if (data) {
				data.shinyImplementations++;
			}
		}
	}

	return Array.from(monthMap.entries())
		.map(([month, data]) => ({
			month,
			implementations: data.implementations,
			shinyImplementations: data.shinyImplementations,
			implementationRate:
				data.implementations > 0
					? (data.shinyImplementations / data.implementations) * 100
					: 0,
		}))
		.sort((a, b) => a.month.localeCompare(b.month));
});

export interface TopImplementationDays {
	date: string;
	count: number;
	type: "normal" | "shiny";
}

export const getTopImplementationDays = cache(
	async (): Promise<{
		topNormalDays: TopImplementationDays[];
		topShinyDays: TopImplementationDays[];
	}> => {
		const pokemons = await getAllPokemon();
		const normalDateMap = new Map<string, number>();
		const shinyDateMap = new Map<string, number>();

		// 通常実装日のカウント
		for (const pokemon of pokemons) {
			if (pokemon.implemented_date) {
				const date = pokemon.implemented_date;
				normalDateMap.set(date, (normalDateMap.get(date) || 0) + 1);
			}
		}

		// 色違い実装日のカウント
		for (const pokemon of pokemons) {
			if (pokemon.shiny_implemented_date) {
				const date = pokemon.shiny_implemented_date;
				shinyDateMap.set(date, (shinyDateMap.get(date) || 0) + 1);
			}
		}

		const topNormalDays = Array.from(normalDateMap.entries())
			.map(([date, count]) => ({ date, count, type: "normal" as const }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		const topShinyDays = Array.from(shinyDateMap.entries())
			.map(([date, count]) => ({ date, count, type: "shiny" as const }))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		return { topNormalDays, topShinyDays };
	},
);
