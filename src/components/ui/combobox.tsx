"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Context ───────────────────────────────────────────────────────────────────

interface ComboboxContextValue {
    items: string[];
    multiple: boolean;
    open: boolean;
    setOpen: (open: boolean) => void;
    search: string;
    setSearch: (search: string) => void;
    filteredItems: string[];
    selectedValues: string[];
    isSelected: (item: string) => boolean;
    selectItem: (item: string) => void;
    deselectItem: (item: string) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

function useComboboxContext() {
    const ctx = React.useContext(ComboboxContext);
    if (!ctx) throw new Error("Combobox subcomponents must be used within <Combobox>");
    return ctx;
}

// ── Root ──────────────────────────────────────────────────────────────────────

// Single-select overload
interface ComboboxPropsSingle {
    items: string[];
    multiple?: false;
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

// Multi-select overload
interface ComboboxPropsMultiple {
    items: string[];
    multiple: true;
    value: string[];
    onValueChange: (value: string[]) => void;
    children: React.ReactNode;
    className?: string;
}

type ComboboxProps = ComboboxPropsSingle | ComboboxPropsMultiple;

function Combobox({ items, multiple = false, value, onValueChange, children, className }: ComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const selectedValues = React.useMemo<string[]>(
        () => (multiple ? (value as string[]) : value ? [value as string] : []),
        [multiple, value],
    );

    const filteredItems = React.useMemo(() => {
        if (!search.trim()) return items;
        const q = search.toLowerCase();
        return items.filter((item) => item.toLowerCase().includes(q));
    }, [items, search]);

    const isSelected = React.useCallback(
        (item: string) => selectedValues.includes(item),
        [selectedValues],
    );

    const selectItem = React.useCallback(
        (item: string) => {
            if (multiple) {
                const arr = value as string[];
                const next = arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item];
                (onValueChange as (v: string[]) => void)(next);
                setSearch("");
            } else {
                (onValueChange as (v: string) => void)(item);
                setOpen(false);
                setSearch("");
            }
        },
        [multiple, value, onValueChange],
    );

    const deselectItem = React.useCallback(
        (item: string) => {
            if (multiple) {
                (onValueChange as (v: string[]) => void)(
                    (value as string[]).filter((v) => v !== item),
                );
            } else {
                (onValueChange as (v: string) => void)("");
            }
        },
        [multiple, value, onValueChange],
    );

    const handleOpenChange = React.useCallback((next: boolean) => {
        setOpen(next);
        if (!next) setSearch("");
    }, []);

    return (
        <ComboboxContext.Provider
            value={{
                items,
                multiple,
                open,
                setOpen,
                search,
                setSearch,
                filteredItems,
                selectedValues,
                isSelected,
                selectItem,
                deselectItem,
                inputRef,
            }}
        >
            <PopoverPrimitive.Root open={open} onOpenChange={handleOpenChange}>
                <div className={cn("relative", className)}>{children}</div>
            </PopoverPrimitive.Root>
        </ComboboxContext.Provider>
    );
}

// ── ComboboxChips ─────────────────────────────────────────────────────────────

function ComboboxChips({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { open, setOpen, inputRef } = useComboboxContext();

    return (
        <PopoverPrimitive.Anchor asChild>
            <div
                role="combobox"
                aria-expanded={open}
                className={cn(
                    "flex min-h-9 flex-wrap items-center gap-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm",
                    "cursor-text transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring",
                    className,
                )}
                onMouseDown={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest("[data-chip-remove]") || target === inputRef.current) return;
                    e.preventDefault();
                    setOpen(true);
                    requestAnimationFrame(() => inputRef.current?.focus());
                }}
            >
                {children}
            </div>
        </PopoverPrimitive.Anchor>
    );
}

// ── ComboboxValue ─────────────────────────────────────────────────────────────

function ComboboxValue({ children }: { children?: React.ReactNode }) {
    return <>{children}</>;
}

// ── ComboboxChip ──────────────────────────────────────────────────────────────

function ComboboxChip({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const { deselectItem } = useComboboxContext();
    const label = typeof children === "string" ? children : undefined;

    return (
        <span
            className={cn(
                "inline-flex items-center gap-0.5 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground",
                className,
            )}
        >
            {children}
            {label && (
                <button
                    type="button"
                    data-chip-remove=""
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                        e.stopPropagation();
                        deselectItem(label);
                    }}
                    className="ml-0.5 rounded-full p-0.5 opacity-60 hover:opacity-100 focus-visible:outline-none"
                    aria-label={`Remove ${label}`}
                >
                    <X className="h-2.5 w-2.5" />
                </button>
            )}
        </span>
    );
}

// ── ComboboxChipsInput ────────────────────────────────────────────────────────

function ComboboxChipsInput({
    placeholder,
    className,
}: {
    placeholder?: string;
    className?: string;
}) {
    const { search, setSearch, setOpen, inputRef } = useComboboxContext();

    return (
        <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    e.currentTarget.blur();
                    setOpen(false);
                    setSearch("");
                }
            }}
            placeholder={placeholder}
            className={cn(
                "min-w-[80px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
                className,
            )}
        />
    );
}

// ── ComboboxInput (standalone trigger, single-select) ─────────────────────────

function ComboboxInput({
    placeholder,
    className,
}: {
    placeholder?: string;
    className?: string;
}) {
    const { search, setSearch, setOpen, selectedValues, inputRef } = useComboboxContext();
    const displayValue = search || (selectedValues.length === 1 ? selectedValues[0] : "");

    return (
        <PopoverPrimitive.Anchor asChild>
            <input
                ref={inputRef}
                type="text"
                value={displayValue}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        e.currentTarget.blur();
                        setOpen(false);
                        setSearch("");
                    }
                }}
                placeholder={placeholder}
                className={cn(
                    "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm outline-none",
                    "placeholder:text-muted-foreground focus:ring-1 focus:ring-ring",
                    className,
                )}
            />
        </PopoverPrimitive.Anchor>
    );
}

// ── ComboboxContent ───────────────────────────────────────────────────────────

function ComboboxContent({
    children,
    className,
    align = "start",
    sideOffset = 4,
}: {
    children: React.ReactNode;
    className?: string;
    align?: "start" | "center" | "end";
    sideOffset?: number;
}) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                align={align}
                sideOffset={sideOffset}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onFocusOutside={(e) => e.preventDefault()}
                className={cn(
                    "bg-popover text-popover-foreground z-50 w-[--radix-popover-anchor-width] min-w-44 overflow-hidden rounded-md border p-1 shadow-md",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out",
                    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                    "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
                    className,
                )}
            >
                {children}
            </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
    );
}

// ── ComboboxEmpty ─────────────────────────────────────────────────────────────

function ComboboxEmpty({ children }: { children: React.ReactNode }) {
    const { filteredItems } = useComboboxContext();
    if (filteredItems.length > 0) return null;
    return <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>;
}

// ── ComboboxList ──────────────────────────────────────────────────────────────

function ComboboxList({
    children,
    className,
}: {
    children: (item: string) => React.ReactNode;
    className?: string;
}) {
    const { filteredItems } = useComboboxContext();
    return (
        <div role="listbox" className={cn("max-h-60 overflow-y-auto", className)}>
            {filteredItems.map((item) => children(item))}
        </div>
    );
}

// ── ComboboxItem ──────────────────────────────────────────────────────────────

function ComboboxItem({
    value,
    children,
    className,
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) {
    const { isSelected, selectItem, multiple } = useComboboxContext();
    const selected = isSelected(value);

    return (
        <div
            role="option"
            aria-selected={selected}
            // preventDefault stops the anchor's onMouseDown from running,
            // which would steal focus from the input and close the popover.
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => selectItem(value)}
            className={cn(
                "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
                "hover:bg-accent hover:text-accent-foreground",
                className,
            )}
        >
            <div
                className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
                    multiple
                        ? selected
                            ? "border-primary bg-primary"
                            : "border-input"
                        : "border-transparent",
                )}
            >
                {selected && (
                    <Check
                        className={cn("h-3 w-3", multiple ? "text-primary-foreground" : "text-primary")}
                    />
                )}
            </div>
            {children}
        </div>
    );
}

export {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
};
