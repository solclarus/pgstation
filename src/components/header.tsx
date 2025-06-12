import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { config } from "@/config/site";
import { FootprintsIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
	return (
		<header className="fixed inset-shadow-lg top-4 right-4 left-4 z-50 flex h-14 items-center justify-between rounded-md border bg-card/10 px-4 shadow-sm backdrop-blur-lg">
			<div className="flex items-center">
				<Link href={"/"} className="flex items-center gap-2">
					<div className="overflow-hidden rounded-md">
						<Image src={"/icon.jpg"} alt={"icon"} width={28} height={28} />
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
				</nav>
			</div>
			<div className="flex items-center gap-4">
				{/* <SearchBox /> */}
				<ThemeSwitcher />
			</div>
		</header>
	);
}
