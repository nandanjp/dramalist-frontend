"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import type { SearchResult } from "@/lib/types";
import { SHOW_STATUSES, STATUS_LABELS } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { ShowFormDialog } from "@/components/shows/show-form-dialog";
import { ShowStatusBadge } from "@/components/shows/show-status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardGridSkeleton } from "@/components/shared/card-grid-skeleton";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ── Result card ───────────────────────────────────────────────────────────────

function SearchResultCard({
    result,
    onAdd,
}: {
    result: SearchResult;
    onAdd: (result: SearchResult) => void;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base">{result.title}</CardTitle>
                    <ShowStatusBadge status={result.status} />
                </div>
                {result.original_title && (
                    <p className="truncate text-xs text-muted-foreground">
                        {result.original_title}
                    </p>
                )}
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {result.year && <span>{result.year}</span>}
                </div>
                {result.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {result.genre.slice(0, 3).map((g) => (
                            <Badge key={g} variant="secondary" className="text-xs">
                                {g}
                            </Badge>
                        ))}
                    </div>
                )}
                <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => onAdd(result)}
                >
                    Add to my list
                </Button>
            </CardContent>
        </Card>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SearchPage() {
    const [query, setQuery] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [addTarget, setAddTarget] = React.useState<SearchResult | null>(null);

    const debouncedQuery = useDebounce(query, 400);
    const enabled = debouncedQuery.length >= 1;

    const { data, isLoading } = useSearch(
        {
            q: debouncedQuery || undefined,
            status: statusFilter !== "all" ? (statusFilter as SearchResult["status"]) : undefined,
            limit: 24,
        },
        enabled,
    );

    const results = data?.results ?? [];

    return (
        <div className="space-y-6">
            <PageHeader title="Search" description="Find dramas across all public lists." />

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <div className="relative min-w-[200px] flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by title, genre, tag…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {SHOW_STATUSES.map((s) => (
                            <SelectItem key={s} value={s}>
                                {STATUS_LABELS[s]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Results */}
            {!enabled ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                    Type to search across public drama lists.
                </p>
            ) : isLoading ? (
                <CardGridSkeleton count={8} cols="4" />
            ) : results.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{debouncedQuery}&rdquo;.
                </p>
            ) : (
                <>
                    <p className="text-sm text-muted-foreground">
                        {data?.total ?? results.length} results
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {results.map((r) => (
                            <SearchResultCard key={r.show_id} result={r} onAdd={setAddTarget} />
                        ))}
                    </div>
                </>
            )}

            {/* Pre-filled add dialog */}
            {addTarget && (
                <ShowFormDialog
                    open={!!addTarget}
                    onOpenChange={(open) => {
                        if (!open) setAddTarget(null);
                    }}
                    show={{
                        id: "",
                        user_id: "",
                        title: addTarget.title,
                        original_title: addTarget.original_title || null,
                        genre: addTarget.genre,
                        status: "plan_to_watch",
                        episode_count: null,
                        episodes_watched: 0,
                        year: addTarget.year,
                        country: null,
                        language: null,
                        notes: null,
                        tags: addTarget.tags,
                        is_public: false,
                        started_at: null,
                        completed_at: null,
                        created_at: "",
                        updated_at: "",
                    }}
                />
            )}
        </div>
    );
}
