"use client";

import { LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ViewMode = "grid" | "list";

interface ViewToggleProps {
    value: ViewMode;
    onChange: (mode: ViewMode) => void;
    className?: string;
}

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
    return (
        <div className={cn("border-border/60 flex overflow-hidden rounded-md border", className)}>
            <Button
                variant={value === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-none border-0"
                onClick={() => onChange("grid")}
                aria-label="Grid view"
                aria-pressed={value === "grid"}
            >
                <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
                variant={value === "list" ? "secondary" : "ghost"}
                size="icon"
                className="border-border/60 h-9 w-9 rounded-none border-0 border-l"
                onClick={() => onChange("list")}
                aria-label="List view"
                aria-pressed={value === "list"}
            >
                <LayoutList className="h-4 w-4" />
            </Button>
        </div>
    );
}
