"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useListEntryCatalogId } from "@/hooks/use-list";
import { ListEntryDialog } from "./list-entry-dialog";

interface AddToListButtonProps {
    catalogId: string;
    /**
     * "button" — full labelled button (catalog detail, search results)
     * "icon"   — compact icon-only overlay (DramaCard poster, grid thumbnails)
     */
    variant?: "button" | "icon";
    className?: string;
}

/**
 * Auth-aware add/edit list action.
 *
 * - Not authenticated → redirects to /login?next=<current path>
 * - Already in list   → opens ListEntryDialog in edit mode
 * - Not in list       → opens ListEntryDialog in add mode
 */
export function AddToListButton({
    catalogId,
    variant = "button",
    className,
}: AddToListButtonProps) {
    const { user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const existingEntry = useListEntryCatalogId(catalogId);
    const [open, setOpen] = useState(false);

    const isInList = !!existingEntry;

    function handleClick() {
        if (!user) {
            router.push(`/login?next=${encodeURIComponent(pathname)}`);
            return;
        }
        setOpen(true);
    }

    return (
        <>
            {variant === "icon" ? (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClick}
                    aria-label={isInList ? "Edit list entry" : "Add to list"}
                    className={cn(
                        "bg-background/90 h-7 w-7 rounded-full shadow-md backdrop-blur-sm transition-transform duration-150 hover:scale-110",
                        isInList && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                        className,
                    )}
                >
                    {isInList ? (
                        <Check className="h-3.5 w-3.5" />
                    ) : (
                        <Plus className="h-3.5 w-3.5" />
                    )}
                </Button>
            ) : (
                <Button
                    onClick={handleClick}
                    variant={isInList ? "outline" : "default"}
                    className={className}
                >
                    {isInList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {isInList ? "In your list" : "Add to list"}
                </Button>
            )}

            <ListEntryDialog
                open={open}
                onOpenChange={setOpen}
                entry={existingEntry}
                preselectedCatalogId={isInList ? undefined : catalogId}
            />
        </>
    );
}
