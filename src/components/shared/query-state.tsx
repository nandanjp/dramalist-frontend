import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { EmptyState } from "./empty-state";

interface QueryStateProps {
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    errorMessage?: string;
    empty?: {
        icon?: LucideIcon;
        title: string;
        description?: string;
        actionLabel?: string;
        onAction?: () => void;
    };
    /** Content to render when data is available. */
    children: React.ReactNode;
}

/**
 * Handles the three query states (loading / error / empty) in a single place,
 * rendering children only when there is actual data.
 */
export function QueryState({
    isLoading,
    isError,
    isEmpty,
    errorMessage,
    empty,
    children,
}: QueryStateProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <EmptyState
                icon={AlertTriangle}
                title="Something went wrong"
                description={errorMessage ?? "Failed to load data. Try refreshing the page."}
            />
        );
    }

    if (isEmpty && empty) {
        return <EmptyState {...empty} />;
    }

    return <>{children}</>;
}
