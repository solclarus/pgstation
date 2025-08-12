import { SearchBox } from "@/components/layout/search-box";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { config } from "@/config/site";
import { getAllPokemon } from "@/lib/pokemon";
import { BarChart3, FootprintsIcon, ListIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export async function Header() {
	const pokemons = await getAllPokemon();

	return (
		<header className="fixed inset-shadow-lg top-4 right-4 left-4 z-50 flex h-14 items-center justify-between rounded-md border bg-card/10 px-4 shadow-sm backdrop-blur-lg">
			<div className="flex items-center">
				<Link href={"/"} className="flex items-center gap-2">
					<div className="overflow-hidden rounded-md">
						<Image
							src={"/icon.jpg"}
							alt={"icon"}
							width={28}
							height={28}
							unoptimized
						/>
					</div>
					<span className="font-extrabold">{config.title}</span>
				</Link>
				<nav className="ml-4 flex items-center gap-4">
					<Link
						href={"/history"}
						className="text-muted-foreground hover:text-primary"
					>
						<FootprintsIcon size={16} />
					</Link>
					<Link
						href={"/table"}
						className="text-muted-foreground hover:text-primary"
					>
						<ListIcon size={16} />
					</Link>
					<Link
						href={"/stats"}
						className="text-muted-foreground hover:text-primary"
					>
						<BarChart3 size={16} />
					</Link>
				</nav>
			</div>
			<div className="flex items-center gap-2">
				<SearchBox pokemons={pokemons} />
				<ThemeSwitcher />
			</div>
		</header>
	);
}
