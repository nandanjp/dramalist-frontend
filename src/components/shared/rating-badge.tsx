import { cn } from "@/lib/utils";

interface RatingBadgeProps {
    rating: number;
    /** "sm" — card use (10px text), "md" — detail pages (13px text) */
    size?: "sm" | "md";
    className?: string;
}

export function RatingBadge({ rating, size = "sm", className }: RatingBadgeProps) {
    const formatted = rating.toFixed(1);
    return (
        <span
            className={cn(
                "inline-flex items-center gap-0.5 font-medium text-amber-500 tabular-nums",
                size === "sm" && "text-[10px]",
                size === "md" && "text-[13px]",
                className,
            )}
        >
            <span aria-hidden>★</span>
            {formatted}
        </span>
    );
}
