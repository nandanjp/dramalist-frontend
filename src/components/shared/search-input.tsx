"use client";

import { Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    /** Shows a spinner in place of the search icon while fetching */
    isLoading?: boolean;
    className?: string;
}

export function SearchInput({
    value,
    onChange,
    placeholder = "Search…",
    isLoading = false,
    className,
}: SearchInputProps) {
    return (
        <div className={cn("relative", className)}>
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                {isLoading ? (
                    <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                ) : (
                    <Search className="text-muted-foreground h-4 w-4" />
                )}
            </div>
            <Input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn("pl-9", value && "pr-8")}
            />
            {value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onChange("")}
                    aria-label="Clear search"
                    className="absolute inset-y-0 right-1 my-auto h-7 w-7"
                >
                    <X className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
}
