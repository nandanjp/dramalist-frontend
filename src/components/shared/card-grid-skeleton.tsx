import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CardGridSkeletonProps {
    /** Number of skeleton cards to render. Defaults to 6. */
    count?: number;
    /** Maximum column count at large breakpoints. "3" = md:grid-cols-3, "4" = lg:grid-cols-4. Defaults to "3". */
    cols?: "3" | "4";
    skeletonClassName?: string;
}

export function CardGridSkeleton({
    count = 6,
    cols = "3",
    skeletonClassName,
}: CardGridSkeletonProps) {
    return (
        <div
            className={cn(
                "grid gap-4 sm:grid-cols-2",
                cols === "4" ? "md:grid-cols-3 lg:grid-cols-4" : "md:grid-cols-3",
            )}
        >
            {Array.from({ length: count }).map((_, i) => (
                <Skeleton key={i} className={cn("h-44 rounded-xl", skeletonClassName)} />
            ))}
        </div>
    );
}
