import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ── Single removable filter pill ─────────────────────────────────────────────

interface FilterChipProps {
    /** Category label shown in medium weight, e.g. "Country" */
    label: string;
    /** Active value shown after the label, e.g. "Korean" */
    value: string;
    onRemove: () => void;
    className?: string;
}

export function FilterChip({ label, value, onRemove, className }: FilterChipProps) {
    return (
        <span
            className={cn(
                "border-border/60 bg-secondary text-muted-foreground inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs",
                className,
            )}
        >
            <span className="text-foreground font-medium">{label}:</span>
            {value}
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                aria-label={`Remove ${label} filter`}
                className="hover:text-foreground -mr-0.5 ml-0.5 h-4 w-4 rounded-full p-0.5"
            >
                <X className="h-2.5 w-2.5" />
            </Button>
        </span>
    );
}

// ── Active filters bar — row of chips + optional clear all ───────────────────

export interface ActiveFilter {
    id: string;
    label: string;
    value: string;
    onRemove: () => void;
}

interface ActiveFiltersBarProps {
    filters: ActiveFilter[];
    onClearAll?: () => void;
    className?: string;
}

export function ActiveFiltersBar({ filters, onClearAll, className }: ActiveFiltersBarProps) {
    if (filters.length === 0) return null;

    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            {filters.map((f) => (
                <FilterChip key={f.id} label={f.label} value={f.value} onRemove={f.onRemove} />
            ))}
            {onClearAll && filters.length > 1 && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={onClearAll}
                    className="text-muted-foreground hover:text-foreground h-auto bg-transparent px-0 py-0 text-xs underline-offset-2 hover:bg-transparent hover:underline"
                >
                    Clear all
                </Button>
            )}
        </div>
    );
}
