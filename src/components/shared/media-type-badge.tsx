import { Film, Sparkles, Tv2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MediaType } from "@/lib/types";

const CONFIG: Record<MediaType, { icon: React.ElementType; label: string }> = {
    show: { icon: Tv2, label: "Show" },
    movie: { icon: Film, label: "Movie" },
    anime: { icon: Sparkles, label: "Anime" },
};

export function MediaTypeBadge({ type, className }: { type: MediaType; className?: string }) {
    const { icon: Icon, label } = CONFIG[type];
    return (
        <span
            className={cn(
                "text-muted-foreground inline-flex items-center gap-1 text-xs",
                className,
            )}
        >
            <Icon className="h-3 w-3 shrink-0" />
            {label}
        </span>
    );
}
