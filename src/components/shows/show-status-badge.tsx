import { cn } from "@/lib/utils";
import { STATUS_LABELS, type ShowStatus } from "@/lib/types";

const CONFIG: Record<ShowStatus, { dot: string }> = {
    watching: { dot: "bg-sky-500" },
    completed: { dot: "bg-zinc-400" },
    dropped: { dot: "bg-rose-400" },
    plan_to_watch: { dot: "bg-amber-400" },
    on_hold: { dot: "bg-zinc-300" },
};

interface ShowStatusBadgeProps {
    status: ShowStatus;
    className?: string;
}

export function ShowStatusBadge({ status, className }: ShowStatusBadgeProps) {
    const { dot } = CONFIG[status];
    return (
        <span
            className={cn(
                "text-muted-foreground inline-flex items-center gap-1.5 text-xs",
                className,
            )}
        >
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
            {STATUS_LABELS[status]}
        </span>
    );
}
