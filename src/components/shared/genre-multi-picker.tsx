"use client";

import { Check, ChevronDown, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export const CATALOG_GENRES = [
    "action",
    "adventure",
    "comedy",
    "crime",
    "drama",
    "fantasy",
    "historical",
    "horror",
    "mystery",
    "romance",
    "sci-fi",
    "thriller",
] as const;

interface GenreMultiPickerProps {
    value: string[];
    onValueChange: (genres: string[]) => void;
    /** Override the default genre list */
    genres?: string[];
    className?: string;
}

export function GenreMultiPicker({
    value,
    onValueChange,
    genres = CATALOG_GENRES as unknown as string[],
    className,
}: GenreMultiPickerProps) {
    function toggle(genre: string) {
        onValueChange(value.includes(genre) ? value.filter((g) => g !== genre) : [...value, genre]);
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "border-border/60 h-9 gap-1.5 bg-transparent px-2.5 text-xs font-normal",
                        className,
                    )}
                >
                    <Tag className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0" />
                    <span className="text-muted-foreground">Genre</span>
                    {value.length > 0 && (
                        <span className="bg-primary/10 text-primary ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold">
                            {value.length}
                        </span>
                    )}
                    <ChevronDown className="text-muted-foreground/40 ml-0.5 h-3 w-3" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1.5" align="start">
                <div className="space-y-0.5">
                    {genres.map((genre) => {
                        const checked = value.includes(genre);
                        return (
                            <div
                                key={genre}
                                onClick={() => toggle(genre)}
                                className="hover:bg-muted/60 flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs transition-colors select-none"
                            >
                                <span
                                    className={cn(
                                        "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border transition-colors",
                                        checked
                                            ? "border-primary bg-primary"
                                            : "border-border bg-transparent",
                                    )}
                                >
                                    {checked && (
                                        <Check className="text-primary-foreground h-2.5 w-2.5" />
                                    )}
                                </span>
                                <span className="capitalize">{genre}</span>
                            </div>
                        );
                    })}
                </div>
                {value.length > 0 && (
                    <div className="border-border/40 mt-1.5 border-t pt-1.5">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground h-7 w-full gap-1.5 text-xs"
                            onClick={() => onValueChange([])}
                        >
                            <X className="h-3 w-3" />
                            Clear genres
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
