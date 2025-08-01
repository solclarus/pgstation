"use client";

import { ControlPanel } from "@/components/layout/control-panel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@ui/sheet";
import { FilterIcon } from "lucide-react";
import { useState } from "react";

export default function ListLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const isMobile = useIsMobile();
	const [open, setOpen] = useState(false);

	// isMobileが判定されるまで描画しない
	if (isMobile === undefined) {
		return null;
	}

	return (
		<div className="flex min-h-screen gap-4 md:pl-4">
			{isMobile ? (
				<div className="fixed right-4 bottom-4 z-10">
					<Sheet open={open} onOpenChange={setOpen}>
						<SheetTrigger asChild>
							<Button variant="outline" size="icon">
								<FilterIcon />
							</Button>
						</SheetTrigger>
						<SheetContent side="bottom" className="!h-[80vh] max-h-[90dvh] p-0">
							<SheetHeader className="sr-only">
								<SheetTitle>Sidebar</SheetTitle>
							</SheetHeader>
							<div className="h-full">
								<ControlPanel onApplied={() => setOpen(false)} />
							</div>
						</SheetContent>
					</Sheet>
				</div>
			) : (
				<div className="fixed top-22 left-4 z-10 h-[calc(100vh-9.5rem)] w-80">
					<ControlPanel />
				</div>
			)}
			<div className="flex-1 md:ml-80">{children}</div>
		</div>
	);
}
