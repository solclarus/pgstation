"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@ui/button";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggleTheme = () => {
		const currentTheme = theme === "dark" ? "light" : "dark";
		setTheme(currentTheme);
	};

	if (!mounted) {
		return null;
	}

	return (
		<Button
			size="icon"
			variant="ghost"
			className="shrink-0 text-muted-foreground hover:text-primary"
			onClick={toggleTheme}
		>
			{theme === "light" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
		</Button>
	);
}
