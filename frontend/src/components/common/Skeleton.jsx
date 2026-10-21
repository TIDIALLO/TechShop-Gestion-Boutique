import { cn } from "../../lib/cn"

// Bloc gris animé (shimmer) affiché pendant le chargement.
export default function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-lg", className)} />
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Chargement du tableau de bord">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  )
}
