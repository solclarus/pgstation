"use client";

import { cn } from "@/lib/utils";
import type { Pokemon } from "@/types/pokemon";
import { Button } from "@ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@ui/command";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

export function SearchBox({ pokemons }: { pokemons: Pokemon[] }) {
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery] = useDebounce(searchQuery, 300);

	// Fuse.jsの設定
	const fuse = useMemo(() => {
		return new Fuse(pokemons, {
			keys: [
				{
					name: "name",
					weight: 0.8, // 名前により高い重みを付ける
				},
			],
			threshold: 0.4, // あいまい度（0.0が厳密、1.0が緩い）
			ignoreLocation: true,
			includeScore: true,
			minMatchCharLength: 1, // 1文字から検索開始
		});
	}, [pokemons]);

	// 検索結果の取得
	const searchResults = useMemo(() => {
		if (!debouncedQuery) {
			return pokemons; // 検索クエリがない場合は全件表示
		}
		const results = fuse.search(debouncedQuery);
		return results.map((result) => result.item);
	}, [debouncedQuery, fuse, pokemons]);

	// キーボードショートカット
	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	// ダイアログが閉じられた時に検索クエリをリセット
	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		if (!isOpen) {
			setSearchQuery("");
		}
	};

	// ポケモン選択時の処理
	const handleSelect = (pokemonId: string) => {
		setOpen(false);
		setSearchQuery("");
		router.push(`/pokemon/${pokemonId}`);
	};

	return (
		<div className="">
			<Button
				variant={"outline"}
				onClick={() => setOpen(true)}
				className={cn(
					"h-8 w-8 text-muted-foreground md:w-full md:rounded-md md:px-3 md:text-xs",
				)}
			>
				<Search />
				<div className="hidden space-x-1 md:block">
					<span>ポケモンを探す</span>
					<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-muted-foreground opacity-100">
						<span className="text-xs">⌘</span>K
					</kbd>
				</div>
			</Button>
			<CommandDialog open={open} onOpenChange={handleOpenChange}>
				<CommandInput
					placeholder="ピカチュウ"
					value={searchQuery}
					onValueChange={setSearchQuery}
				/>
				<CommandList>
					<CommandEmpty>
						{debouncedQuery
							? `"${debouncedQuery}" に一致するポケモンが見つかりませんでした`
							: "見つかりませんでした"}
					</CommandEmpty>
					<CommandGroup
						heading={`ポケモン${searchResults.length < pokemons.length ? ` (${searchResults.length}件)` : ""}`}
					>
						{searchResults.map((pokemon) => {
							return (
								<CommandItem
									key={pokemon.id}
									onSelect={() => handleSelect(pokemon.id)}
								>
									<div className="flex items-center gap-2">
										<div className="flex flex-col">
											<span>{pokemon.name}</span>
										</div>
									</div>
								</CommandItem>
							);
						})}
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</div>
	);
}
