"use client";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Skeleton } from "@ui/skeleton";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ImageCardProps {
	id: string;
	isShiny: boolean;
	priority?: boolean;
	className?: string;
}

export const ImageCard = ({
	id,
	isShiny,
	priority = false,
	className = "grid aspect-square place-items-center p-6",
}: ImageCardProps) => {
	const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">(
		"loading",
	);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const imageUrl = useMemo(() => {
		if (!id || !isClient) return null;
		const supabase = createClient();
		const { data } = supabase.storage
			.from("sprites")
			.getPublicUrl(`pokemons/${isShiny ? "shiny" : "normal"}/${id}.png`);
		return data.publicUrl;
	}, [id, isShiny, isClient]);

	const handleLoad = useCallback(() => setLoadState("loaded"), []);
	const handleError = useCallback(() => setLoadState("error"), []);

	if (!isClient) {
		return (
			<div className={className}>
				<div className="relative h-full w-full">
					<Skeleton className="absolute inset-0 rounded-md" />
				</div>
			</div>
		);
	}

	if (!imageUrl) return null;

	return (
		<div className={className}>
			<div className="relative h-full w-full">
				{loadState === "loading" && (
					<Skeleton className="absolute inset-0 rounded-md" />
				)}

				{loadState === "error" && (
					<div className="absolute inset-0 flex flex-col items-center justify-center rounded-md bg-muted/10">
						<div className="flex flex-col items-center gap-1">
							<ImageIcon className="size-6 text-muted-foreground/50" />
							<span className="text-muted-foreground/70 text-xs">
								読み込み失敗
							</span>
						</div>
					</div>
				)}

				<Image
					src={imageUrl}
					alt={`pokemon-${id}${isShiny ? "-shiny" : ""}`}
					fill
					priority={priority}
					loading={priority ? undefined : "lazy"}
					sizes="(max-width: 768px) 25vw, (max-width: 1200px) 20vw, 128px"
					className={cn("object-contain transition-opacity duration-300", {
						"opacity-0": loadState !== "loaded",
						"opacity-100": loadState === "loaded",
					})}
					onLoad={handleLoad}
					onError={handleError}
				/>
			</div>
		</div>
	);
};
