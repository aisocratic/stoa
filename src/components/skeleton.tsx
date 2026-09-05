import { cn } from "../cn.js"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("bg-muted/70 dark:bg-muted/50 animate-skeleton-pulse rounded-md", className)} {...props} />
}

// Table skeleton - for leaderboard-style tables
function SkeletonTable({ className, rows = 5, columns = 4, ...props }: React.ComponentProps<"div"> & { rows?: number; columns?: number }) {
  return (
    <div data-slot="skeleton-table" className={cn("border border-border rounded-xl overflow-hidden bg-card", className)} {...props}>
      <div className="p-4 border-b border-border">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="p-4 space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex items-center gap-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} className={cn("h-4", colIndex === 0 ? "w-8" : colIndex === 1 ? "flex-1" : "w-16")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export { Skeleton, SkeletonTable }
