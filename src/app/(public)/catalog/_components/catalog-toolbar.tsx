"use client";

import { useState } from "react";
import { CalendarRange, Check, ChevronDown, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
} from "@/components/ui/combobox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SearchInput } from "@/components/shared/search-input";
import { SortSelect } from "@/components/shared/sort-select";
import { ViewToggle, type ViewMode } from "@/components/shared/view-toggle";
import { MEDIA_TYPE_LABELS, MEDIA_TYPES } from "@/lib/types";
import type { AiringStatus, MediaType } from "@/lib/types";

// ── Filter state ──────────────────────────────────────────────────────────────

export interface FilterState {
    mediaType: MediaType | "";
    airingStatus: AiringStatus | "";
    genres: string[];
    sort: string;
    yearFrom: number | undefined;
    yearTo: number | undefined;
}

export const DEFAULT_FILTER_STATE: FilterState = {
    mediaType: "",
    airingStatus: "",
    genres: [],
    sort: "created_at:desc",
    yearFrom: undefined,
    yearTo: undefined,
};

// ── Constants ─────────────────────────────────────────────────────────────────

export const SORT_OPTIONS = [
    { value: "created_at:desc", label: "Recently added" },
    { value: "year:desc", label: "Newest" },
    { value: "year:asc", label: "Oldest" },
    { value: "title:asc", label: "Title A–Z" },
    { value: "title:desc", label: "Title Z–A" },
    { value: "episode_count:desc", label: "Most episodes" },
    { value: "episode_count:asc", label: "Fewest episodes" },
    { value: "duration_minutes:asc", label: "Shortest" },
    { value: "duration_minutes:desc", label: "Longest" },
    { value: "rating:desc", label: "Highest rated" },
];

const GENRES = [
    "Action", "Comedy", "Crime", "Drama", "Fantasy", "Historical",
    "Horror", "Legal", "Medical", "Melodrama", "Mystery", "Political",
    "Romance", "Sci-Fi", "School", "Supernatural", "Thriller",
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
    { length: CURRENT_YEAR - 1959 + 2 },
    (_, i) => CURRENT_YEAR + 1 - i,
);

const STATUS_CONFIG: { value: AiringStatus | ""; label: string; dot: string }[] = [
    { value: "", label: "All statuses", dot: "bg-zinc-400 dark:bg-zinc-500" },
    { value: "ongoing", label: "Ongoing", dot: "bg-sky-500" },
    { value: "completed", label: "Completed", dot: "bg-emerald-500" },
    { value: "upcoming", label: "Upcoming", dot: "bg-amber-400" },
];

const MOBILE_ALL = "__all__";

// ── Toolbar props ─────────────────────────────────────────────────────────────

export interface CatalogToolbarProps {
    inputQ: string;
    onInputQChange: (v: string) => void;
    draft: FilterState;
    onDraftChange: (patch: Partial<FilterState>) => void;
    isDirty: boolean;
    hasActiveFilters: boolean;
    onApply: () => void;
    onClear: () => void;
    view: ViewMode;
    onViewChange: (v: ViewMode) => void;
    isFetching: boolean;
    total: number | undefined;
}

// ── TypeCombobox ──────────────────────────────────────────────────────────────

function TypeCombobox({
    value,
    onChange,
}: {
    value: MediaType | "";
    onChange: (v: MediaType | "") => void;
}) {
    const [open, setOpen] = useState(false);
    const label = value === "" ? "All types" : MEDIA_TYPE_LABELS[value];
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-8 gap-1.5 border-border/60 px-3 text-xs font-medium",
                        value !== "" &&
                            "border-violet-200/60 bg-violet-100/90 text-violet-700 dark:border-violet-700/30 dark:bg-violet-950/60 dark:text-violet-300",
                    )}
                >
                    {label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-1" align="start">
                {(["", ...MEDIA_TYPES] as (MediaType | "")[]).map((type) => (
                    <Button
                        key={type || "__all__"}
                        variant="ghost"
                        onClick={() => {
                            onChange(type);
                            setOpen(false);
                        }}
                        className={cn(
                            "w-full justify-start gap-2 px-2 py-1.5 text-xs font-normal h-auto",
                            value === type && "font-medium text-foreground",
                        )}
                    >
                        <Check
                            className={cn(
                                "h-3.5 w-3.5",
                                value === type ? "opacity-100" : "opacity-0",
                            )}
                        />
                        {type === "" ? "All types" : MEDIA_TYPE_LABELS[type]}
                    </Button>
                ))}
            </PopoverContent>
        </Popover>
    );
}

// ── StatusCombobox ────────────────────────────────────────────────────────────

function StatusCombobox({
    value,
    onChange,
}: {
    value: AiringStatus | "";
    onChange: (v: AiringStatus | "") => void;
}) {
    const [open, setOpen] = useState(false);
    const current = STATUS_CONFIG.find((s) => s.value === value) ?? STATUS_CONFIG[0];
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-8 gap-1.5 border-border/60 px-3 text-xs font-medium",
                        value === "ongoing" &&
                            "border-sky-200/60 bg-sky-100/90 text-sky-700 dark:border-sky-700/30 dark:bg-sky-950/60 dark:text-sky-300",
                        value === "completed" &&
                            "border-emerald-200/60 bg-emerald-100/90 text-emerald-700 dark:border-emerald-700/30 dark:bg-emerald-950/60 dark:text-emerald-300",
                        value === "upcoming" &&
                            "border-amber-200/60 bg-amber-100/90 text-amber-700 dark:border-amber-700/30 dark:bg-amber-950/60 dark:text-amber-300",
                    )}
                >
                    <span className={cn("h-1.5 w-1.5 rounded-full", current.dot)} />
                    {current.label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1" align="start">
                {STATUS_CONFIG.map(({ value: v, label, dot }) => (
                    <Button
                        key={v || "__all__"}
                        variant="ghost"
                        onClick={() => {
                            onChange(v);
                            setOpen(false);
                        }}
                        className={cn(
                            "w-full justify-start gap-2 px-2 py-1.5 text-xs font-normal h-auto",
                            value === v && "font-medium text-foreground",
                        )}
                    >
                        <Check
                            className={cn(
                                "h-3.5 w-3.5",
                                value === v ? "opacity-100" : "opacity-0",
                            )}
                        />
                        <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
                        {label}
                    </Button>
                ))}
            </PopoverContent>
        </Popover>
    );
}

// ── GenreCombobox ─────────────────────────────────────────────────────────────

function GenreCombobox({
    genres,
    onChange,
}: {
    genres: string[];
    onChange: (v: string[]) => void;
}) {
    return (
        <Combobox
            items={[...GENRES]}
            multiple
            value={genres}
            onValueChange={onChange}
            className="w-56"
        >
            <ComboboxChips
                className={cn(
                    "h-8 min-h-0 flex-nowrap overflow-hidden gap-1 border-border/60 px-2 py-1 text-xs",
                    genres.length > 0 &&
                        "border-violet-200/60 bg-violet-100/90 dark:border-violet-700/30 dark:bg-violet-950/60",
                )}
            >
                <ComboboxValue>
                    {genres.slice(0, 2).map((g) => (
                        <ComboboxChip
                            key={g}
                            className="bg-violet-500/20 text-violet-700 dark:text-violet-300"
                        >
                            {g}
                        </ComboboxChip>
                    ))}
                    {genres.length > 2 && (
                        <span className="inline-flex shrink-0 items-center rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                            +{genres.length - 2}
                        </span>
                    )}
                </ComboboxValue>
                <ComboboxChipsInput
                    placeholder={genres.length === 0 ? "Genre…" : ""}
                    className="text-xs min-w-0"
                />
            </ComboboxChips>
            <ComboboxContent>
                <ComboboxEmpty>No genres found.</ComboboxEmpty>
                <ComboboxList className="text-xs">
                    {(item) => (
                        <ComboboxItem key={item} value={item} className="text-xs">
                            {item}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    );
}

// ── YearRangePopover ──────────────────────────────────────────────────────────

function YearRangePopover({
    yearFrom,
    yearTo,
    onFromChange,
    onToChange,
}: {
    yearFrom: number | undefined;
    yearTo: number | undefined;
    onFromChange: (v: number | undefined) => void;
    onToChange: (v: number | undefined) => void;
}) {
    const [open, setOpen] = useState(false);
    const isActive = yearFrom !== undefined || yearTo !== undefined;
    const label = isActive
        ? yearFrom && yearTo
            ? `${yearFrom}–${yearTo}`
            : yearFrom
              ? `From ${yearFrom}`
              : `Up to ${yearTo}`
        : "Year range";

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-8 gap-1.5 border-border/60 px-3 text-xs font-medium",
                        isActive &&
                            "border-violet-200/60 bg-violet-100/90 text-violet-700 dark:border-violet-700/30 dark:bg-violet-950/60 dark:text-violet-300",
                    )}
                >
                    <CalendarRange className="h-3.5 w-3.5" />
                    {label}
                    <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    Year range
                </p>
                <div className="flex items-end gap-2">
                    <div className="flex-1">
                        <p className="mb-1 text-[10px] text-muted-foreground">From</p>
                        <Select
                            value={yearFrom !== undefined ? String(yearFrom) : "any"}
                            onValueChange={(v) => onFromChange(v === "any" ? undefined : Number(v))}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-52">
                                <SelectItem value="any" className="text-xs">
                                    Any
                                </SelectItem>
                                {YEAR_OPTIONS.map((y) => (
                                    <SelectItem key={y} value={String(y)} className="text-xs">
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1">
                        <p className="mb-1 text-[10px] text-muted-foreground">To</p>
                        <Select
                            value={yearTo !== undefined ? String(yearTo) : "any"}
                            onValueChange={(v) => onToChange(v === "any" ? undefined : Number(v))}
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="max-h-52">
                                <SelectItem value="any" className="text-xs">
                                    Any
                                </SelectItem>
                                {YEAR_OPTIONS.map((y) => (
                                    <SelectItem key={y} value={String(y)} className="text-xs">
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

// ── MobileFiltersSheet ────────────────────────────────────────────────────────

function MobileFiltersSheet({
    draft,
    onDraftChange,
    isDirty,
    onApply,
    onClear,
}: Pick<
    CatalogToolbarProps,
    "draft" | "onDraftChange" | "isDirty" | "onApply" | "onClear"
>) {
    const [open, setOpen] = useState(false);
    const activeCount =
        (draft.mediaType !== "" ? 1 : 0) +
        (draft.airingStatus !== "" ? 1 : 0) +
        draft.genres.length +
        (draft.yearFrom !== undefined || draft.yearTo !== undefined ? 1 : 0) +
        (draft.sort !== DEFAULT_FILTER_STATE.sort ? 1 : 0);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="relative h-9 w-9 shrink-0"
                    aria-label="Open filters"
                >
                    <Filter className="h-4 w-4" />
                    {activeCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                            {activeCount}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col overflow-y-auto">
                <SheetHeader className="mb-6 text-left">
                    <SheetTitle className="font-hand text-xl tracking-normal">Filters</SheetTitle>
                </SheetHeader>

                <div className="flex-1 space-y-6">
                    <div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                            Type
                        </p>
                        <ToggleGroup
                            type="single"
                            value={draft.mediaType || MOBILE_ALL}
                            onValueChange={(v) =>
                                onDraftChange({
                                    mediaType: (!v || v === MOBILE_ALL ? "" : v) as MediaType | "",
                                })
                            }
                            className="flex flex-wrap justify-start gap-1.5"
                        >
                            <ToggleGroupItem
                                value={MOBILE_ALL}
                                className="h-7 rounded-full px-3 text-xs data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                            >
                                All
                            </ToggleGroupItem>
                            {MEDIA_TYPES.map((type) => (
                                <ToggleGroupItem
                                    key={type}
                                    value={type}
                                    className="h-7 rounded-full px-3 text-xs data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                                >
                                    {MEDIA_TYPE_LABELS[type]}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>

                    <div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                            Status
                        </p>
                        <ToggleGroup
                            type="single"
                            value={draft.airingStatus || MOBILE_ALL}
                            onValueChange={(v) =>
                                onDraftChange({
                                    airingStatus: (!v || v === MOBILE_ALL
                                        ? ""
                                        : v) as AiringStatus | "",
                                })
                            }
                            className="flex flex-wrap justify-start gap-1.5"
                        >
                            {STATUS_CONFIG.map(({ value, label, dot }) => (
                                <ToggleGroupItem
                                    key={value || MOBILE_ALL}
                                    value={value || MOBILE_ALL}
                                    className="h-7 gap-1.5 rounded-full px-3 text-xs data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                                >
                                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dot)} />
                                    {label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>

                    <div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                            Genre
                        </p>
                        <Combobox
                            items={[...GENRES]}
                            multiple
                            value={draft.genres}
                            onValueChange={(v) => onDraftChange({ genres: v })}
                        >
                            <ComboboxChips
                                className={cn(
                                    "h-9 min-h-0 flex-nowrap overflow-hidden",
                                    draft.genres.length > 0 &&
                                        "border-violet-200/60 bg-violet-100/90 dark:border-violet-700/30 dark:bg-violet-950/60",
                                )}
                            >
                                <ComboboxValue>
                                    {draft.genres.slice(0, 2).map((g) => (
                                        <ComboboxChip
                                            key={g}
                                            className="bg-violet-500/20 text-violet-700 dark:text-violet-300"
                                        >
                                            {g}
                                        </ComboboxChip>
                                    ))}
                                    {draft.genres.length > 2 && (
                                        <span className="inline-flex shrink-0 items-center rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-700 dark:text-violet-300">
                                            +{draft.genres.length - 2}
                                        </span>
                                    )}
                                </ComboboxValue>
                                <ComboboxChipsInput
                                    placeholder={draft.genres.length === 0 ? "Add genre…" : ""}
                                    className="min-w-0"
                                />
                            </ComboboxChips>
                            <ComboboxContent>
                                <ComboboxEmpty>No genres found.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item} value={item}>
                                            {item}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>

                    <div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                            Year range
                        </p>
                        <YearRangePopover
                            yearFrom={draft.yearFrom}
                            yearTo={draft.yearTo}
                            onFromChange={(v) => onDraftChange({ yearFrom: v })}
                            onToChange={(v) => onDraftChange({ yearTo: v })}
                        />
                    </div>

                    <div>
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                            Sort
                        </p>
                        <SortSelect
                            value={draft.sort}
                            onValueChange={(v) => onDraftChange({ sort: v })}
                            options={SORT_OPTIONS}
                            className="w-full"
                        />
                    </div>
                </div>

                <SheetFooter className="mt-6 flex flex-row gap-2 sm:justify-start sm:space-x-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => {
                            onClear();
                            setOpen(false);
                        }}
                    >
                        <X className="mr-1 h-3.5 w-3.5" />
                        Clear all
                    </Button>
                    <Button
                        size="sm"
                        variant={isDirty ? "default" : "outline"}
                        className="w-full"
                        onClick={() => {
                            onApply();
                            setOpen(false);
                        }}
                    >
                        Apply
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}

// ── CatalogToolbar ────────────────────────────────────────────────────────────

export function CatalogToolbar({
    inputQ,
    onInputQChange,
    draft,
    onDraftChange,
    isDirty,
    hasActiveFilters,
    onApply,
    onClear,
    view,
    onViewChange,
    isFetching,
    total,
}: CatalogToolbarProps) {
    const hasDraftFilters =
        draft.mediaType !== "" ||
        draft.airingStatus !== "" ||
        draft.genres.length > 0 ||
        draft.yearFrom !== undefined ||
        draft.yearTo !== undefined ||
        draft.sort !== DEFAULT_FILTER_STATE.sort;

    return (
        <div className="mb-6 space-y-3">
            {/* Row 1: search + sort + view + mobile filter trigger */}
            <div className="flex items-center gap-2.5">
                <SearchInput
                    value={inputQ}
                    onChange={onInputQChange}
                    placeholder="Search dramas, movies…"
                    isLoading={isFetching}
                    className="flex-1"
                />
                <SortSelect
                    value={draft.sort}
                    onValueChange={(v) => onDraftChange({ sort: v })}
                    options={SORT_OPTIONS}
                    className="hidden w-44 sm:flex"
                />
                <ViewToggle value={view} onChange={onViewChange} />
                <div className="md:hidden">
                    <MobileFiltersSheet
                        draft={draft}
                        onDraftChange={onDraftChange}
                        isDirty={isDirty}
                        onApply={onApply}
                        onClear={onClear}
                    />
                </div>
            </div>

            {/* Row 2: desktop filter controls */}
            <div className="hidden items-center gap-2 md:flex">
                <TypeCombobox
                    value={draft.mediaType}
                    onChange={(v) => onDraftChange({ mediaType: v })}
                />
                <div className="h-4 w-px bg-border/60" />
                <StatusCombobox
                    value={draft.airingStatus}
                    onChange={(v) => onDraftChange({ airingStatus: v })}
                />
                <div className="h-4 w-px bg-border/60" />
                <GenreCombobox
                    genres={draft.genres}
                    onChange={(v) => onDraftChange({ genres: v })}
                />
                <YearRangePopover
                    yearFrom={draft.yearFrom}
                    yearTo={draft.yearTo}
                    onFromChange={(v) => onDraftChange({ yearFrom: v })}
                    onToChange={(v) => onDraftChange({ yearTo: v })}
                />

                <div className="ml-auto flex items-center gap-2">
                    {hasDraftFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClear}
                            className="h-auto gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3 w-3" />
                            Clear
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant={isDirty ? "default" : "outline"}
                        className={cn("h-8 px-4 text-xs transition-colors", !isDirty && "opacity-50")}
                        onClick={onApply}
                        disabled={!isDirty}
                    >
                        Apply
                    </Button>
                </div>
            </div>

            {/* Result count */}
            {total !== undefined && (
                <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{total.toLocaleString()}</span>{" "}
                    {total === 1 ? "title" : "titles"}
                    {hasActiveFilters && " matching filters"}
                </p>
            )}
        </div>
    );
}
