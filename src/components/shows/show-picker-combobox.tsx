"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useShows } from "@/hooks/use-shows";
import type { Show } from "@/lib/types";
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

// Popover is not in the installed components yet — we import it below.
// If Popover isn't installed, run: npx shadcn@latest add popover

interface ShowPickerComboboxProps {
    value?: string; // selected show id
    onChange: (show: Show | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function ShowPickerCombobox({
    value,
    onChange,
    placeholder = "Select a show…",
    disabled = false,
}: ShowPickerComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");

    const { data, isLoading } = useShows({ limit: 100 });
    const shows = data?.shows ?? [];

    const selected = shows.find((s) => s.id === value);

    const filtered = query
        ? shows.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()))
        : shows;

    function handleSelect(show: Show) {
        onChange(show.id === value ? undefined : show);
        setOpen(false);
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
                    <span className="truncate">{selected ? selected.title : placeholder}</span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder="Search shows…"
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        {isLoading ? (
                            <CommandEmpty>Loading…</CommandEmpty>
                        ) : filtered.length === 0 ? (
                            <CommandEmpty>No shows found.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {filtered.map((show) => (
                                    <CommandItem
                                        key={show.id}
                                        value={show.id}
                                        onSelect={() => handleSelect(show)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === show.id ? "opacity-100" : "opacity-0",
                                            )}
                                        />
                                        <div className="min-w-0">
                                            <p className="truncate text-sm">{show.title}</p>
                                            {show.original_title && (
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {show.original_title}
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
