"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import type { SearchResult } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CatalogPickerComboboxProps {
    value?: string;
    onChange: (result: SearchResult | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function CatalogPickerCombobox({
    value,
    onChange,
    placeholder = "Search catalog…",
    disabled = false,
}: CatalogPickerComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [selectedTitle, setSelectedTitle] = React.useState<string>("");

    const debouncedQuery = useDebounce(query, 300);
    const { data, isLoading } = useSearch(
        { q: debouncedQuery, limit: 20 },
        debouncedQuery.length >= 1,
    );
    const results = data?.results ?? [];

    function handleSelect(result: SearchResult) {
        const isDeselect = result.catalog_id === value;
        onChange(isDeselect ? undefined : result);
        setSelectedTitle(isDeselect ? "" : result.title);
        setOpen(false);
        setQuery("");
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal"
                    disabled={disabled}
                >
                    <span className="truncate">{selectedTitle || placeholder}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Type to search…"
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {isLoading ? (
                            <CommandEmpty>Searching…</CommandEmpty>
                        ) : debouncedQuery.length < 1 ? (
                            <CommandEmpty>Type to search the catalog.</CommandEmpty>
                        ) : results.length === 0 ? (
                            <CommandEmpty>No titles found.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {results.map((result) => (
                                    <CommandItem
                                        key={result.catalog_id}
                                        value={result.catalog_id}
                                        onSelect={() => handleSelect(result)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === result.catalog_id
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm">{result.title}</p>
                                            {result.original_title && (
                                                <p className="text-muted-foreground truncate text-xs">
                                                    {result.original_title}
                                                </p>
                                            )}
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
