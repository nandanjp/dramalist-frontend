import { cn } from "@/lib/utils";
import type { AiringStatus } from "@/lib/types";

const CONFIG: Record<AiringStatus, { dot: string; label: string }> = {
    ongoing: { dot: "bg-sky-500", label: "Ongoing" },
    completed: { dot: "bg-zinc-400", label: "Completed" },
    upcoming: { dot: "bg-amber-400", label: "Upcoming" },
};

export function AiringStatusBadge({
    status,
    className,
}: {
    status: AiringStatus;
    className?: string;
}) {
    const { dot, label } = CONFIG[status];
    return (
        <span
            className={cn(
                "text-muted-foreground inline-flex items-center gap-1.5 text-xs",
                className,
            )}
        >
            <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
            {label}
        </span>
    );
}
