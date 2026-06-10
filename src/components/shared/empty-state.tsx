import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            {Icon && <Icon className="text-muted-foreground h-10 w-10" strokeWidth={1.5} />}
            <div className="space-y-1">
                <p className="text-sm font-medium">{title}</p>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
            {actionLabel && onAction && (
                <Button size="sm" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
