import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    title: string;
    /** Shown inline after title in muted text */
    count?: number;
    /** Renders a "See all" link at the right edge */
    seeAllHref?: string;
    seeAllLabel?: string;
    className?: string;
}

export function SectionHeader({
    title,
    count,
    seeAllHref,
    seeAllLabel = "See all",
    className,
}: SectionHeaderProps) {
    return (
        <div className={cn("flex items-baseline justify-between gap-4", className)}>
            <div className="flex items-baseline gap-2">
                <h2 className="text-foreground text-base font-semibold tracking-tight">{title}</h2>
                {count !== undefined && (
                    <span className="text-muted-foreground/60 text-xs">{count}</span>
                )}
            </div>
            {seeAllHref && (
                <Link
                    href={seeAllHref}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-0.5 text-xs transition-colors"
                >
                    {seeAllLabel}
                    <ChevronRight className="h-3 w-3" />
                </Link>
            )}
        </div>
    );
}
