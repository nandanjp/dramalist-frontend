"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useListCatalogSet } from "@/hooks/use-list";

interface InListIndicatorProps {
    catalogId: string;
    className?: string;
}

/**
 * Small "✓ In list" badge. Renders nothing when:
 * - user is not authenticated
 * - the catalog ID is not in their list
 *
 * Reads from the shared list cache — does not fire its own network request.
 */
export function InListIndicator({ catalogId, className }: InListIndicatorProps) {
    const { user } = useAuth();
    const listSet = useListCatalogSet();

    if (!user || !listSet.has(catalogId)) return null;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-0.5 rounded-full bg-zinc-900/80 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm dark:bg-white/80 dark:text-zinc-900",
                className,
            )}
        >
            <Check className="h-2.5 w-2.5" />
            In list
        </span>
    );
}
