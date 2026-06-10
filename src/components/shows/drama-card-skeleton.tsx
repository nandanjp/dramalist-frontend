import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder — matches DramaCard's exact dimensions. */
export function DramaCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col", className)}>
            <Skeleton className="aspect-2/3 w-full rounded-xl" />
            <div className="mt-2.5 space-y-1.5 px-0.5">
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3 w-2/3 rounded" />
            </div>
        </div>
    );
}

/** Loading placeholder — matches DramaListItem's exact dimensions. */
export function DramaListItemSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Skeleton className="h-15 w-10 shrink-0 rounded-md" />
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
                <Skeleton className="h-3 w-1/3 rounded" />
            </div>
        </div>
    );
}
