"use client";

import { type ReactNode, createContext, useContext, useState } from "react";

interface ShinyContextType {
	isShiny: boolean;
	toggleShiny: (shiny: boolean) => void;
}

const ShinyContext = createContext<ShinyContextType | undefined>(undefined);

export function ShinyProvider({ children }: { children: ReactNode }) {
	const [isShiny, setIsShiny] = useState(false);

	const toggleShiny = (shiny: boolean) => {
		setIsShiny(shiny);
	};

	return (
		<ShinyContext.Provider value={{ isShiny, toggleShiny }}>
			{children}
		</ShinyContext.Provider>
	);
}

export function useShinyToggle() {
	const context = useContext(ShinyContext);
	if (context === undefined) {
		throw new Error("useShinyToggle must be used within a ShinyProvider");
	}
	return context;
}
