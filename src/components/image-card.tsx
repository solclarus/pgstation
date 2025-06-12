"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export const ImageCard = ({ id }: { id: string }) => {
	if (!id) return null;

	const supabase = createClient();
	const { data } = supabase.storage
		.from("sprites")
		.getPublicUrl(`pokemons/normal/${id}.png`);

	return (
		<div className={"grid aspect-square place-items-center p-6"}>
			<div className="relative h-full w-full">
				<Image
					src={data.publicUrl}
					alt={`pokemon-${id}`}
					className="object-contain"
					fill
				/>
			</div>
		</div>
	);
};
