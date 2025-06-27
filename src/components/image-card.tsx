"use client";

import { createClient } from "@/lib/supabase/client";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const ImageCard = ({
	id,
	isShiny,
}: { id: string; isShiny: boolean }) => {
	if (!id) return null;

	const supabase = createClient();
	const { data } = supabase.storage
		.from("sprites")
		.getPublicUrl(`pokemons/${isShiny ? "shiny" : "normal"}/${id}.png`);

	const [imgStatus, setImgStatus] = useState<"loading" | "error" | "loaded">(
		"loading",
	);

	return (
		<div className={"grid aspect-square place-items-center p-6"}>
			<div className="relative h-full w-full">
				{imgStatus !== "loaded" && (
					<div className="absolute inset-0 flex items-center justify-center">
						<ImageIcon className="size-8 text-muted-foreground" />
					</div>
				)}
				<Image
					src={data.publicUrl}
					alt={`pokemon-${id}`}
					className="object-contain"
					fill
					loading="lazy"
					onLoad={() => setImgStatus("loaded")}
					onError={() => setImgStatus("error")}
					style={{ display: imgStatus === "error" ? "none" : undefined }}
				/>
			</div>
		</div>
	);
};
