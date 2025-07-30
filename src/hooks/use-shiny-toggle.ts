import { useCallback, useState } from "react";

export function useShinyToggle(initialValue = false) {
	const [isShiny, setIsShiny] = useState(initialValue);

	const toggleShiny = useCallback((shiny: boolean) => {
		setIsShiny(shiny);
	}, []);

	return { isShiny, toggleShiny };
}
