import { config } from "@/config/site";
import { format } from "date-fns";

export function Footer() {
	return (
		<footer className="sticky top-full h-16 w-full px-10 py-6">
			<div className="flex items-center justify-center text-muted-foreground text-sm">
				<span>
					&copy; {format(new Date(), "yyyy")} {config.title}
				</span>
			</div>
		</footer>
	);
}
