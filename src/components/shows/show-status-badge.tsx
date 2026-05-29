import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type ShowStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_CLASSES: Record<ShowStatus, string> = {
    watching: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    dropped: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    plan_to_watch: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    on_hold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
};

interface ShowStatusBadgeProps {
    status: ShowStatus;
    className?: string;
}

export function ShowStatusBadge({ status, className }: ShowStatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn("border-transparent font-medium", STATUS_CLASSES[status], className)}
        >
            {STATUS_LABELS[status]}
        </Badge>
    );
}
