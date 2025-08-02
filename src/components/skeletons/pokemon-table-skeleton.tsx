import { Skeleton } from "@ui/skeleton";

export function PokemonTableSkeleton() {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full border bg-card text-sm">
				<thead>
					<tr className="bg-muted">
						<th className="border-b px-4 py-2 text-left">ID</th>
						<th className="border-b px-4 py-2 text-left">Name</th>
						<th className="border-b px-4 py-2 text-left">Type</th>
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: 20 }, (_, i) => (
						<tr key={i} className="hover:bg-accent">
							<td className="border-b px-4 py-2">
								<Skeleton className="h-4 w-16" />
							</td>
							<td className="border-b px-4 py-2">
								<Skeleton className="h-4 w-24" />
							</td>
							<td className="border-b px-4 py-2">
								<div className="flex gap-2">
									<Skeleton className="h-6 w-6 rounded-full" />
									<Skeleton className="h-6 w-6 rounded-full" />
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
