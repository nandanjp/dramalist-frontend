"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Search } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import type { MediaType, SearchResult } from "@/lib/types";
import { MEDIA_TYPES, MEDIA_TYPE_LABELS } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

function SearchResultRow({ result }: { result: SearchResult }) {
    return (
        <div className="flex gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40">
            {/* Poster */}
            <div className="shrink-0">
                {result.poster_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={result.poster_url}
                        alt={result.title}
                        className="h-20 w-14 rounded object-cover sm:h-24 sm:w-16"
                    />
                ) : (
                    <div className="h-20 w-14 rounded bg-muted sm:h-24 sm:w-16" />
                )}
            </div>

            {/* Content */}
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                <div className="space-y-0.5">
                    <div className="flex flex-wrap items-start gap-2">
                        <Link
                            href={`/catalog/${result.catalog_id}`}
                            className="font-semibold leading-tight hover:underline"
                        >
                            {result.title}
                        </Link>
                        <Badge variant="outline" className="shrink-0 text-xs capitalize">
                            {result.media_type}
                        </Badge>
                    </div>
                    {result.original_title && (
                        <p className="truncate text-xs text-muted-foreground">{result.original_title}</p>
                    )}
                    <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                        {result.year && <span>{result.year}</span>}
                        {result.country && <span>{result.country}</span>}
                        <span className="capitalize">{result.airing_status}</span>
                    </div>
                </div>

                {result.synopsis && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{result.synopsis}</p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                    {result.genre.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {result.genre.slice(0, 3).map((g) => (
                                <Badge key={g} variant="secondary" className="text-xs">
                                    {g}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 shrink-0 text-xs" asChild>
                        <Link href={`/catalog/${result.catalog_id}`}>View details →</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ResultSkeleton() {
    return (
        <div className="flex gap-3 rounded-lg border p-3">
            <Skeleton className="h-20 w-14 shrink-0 rounded sm:h-24 sm:w-16" />
            <div className="flex-1 space-y-2 py-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
            </div>
        </div>
    );
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [query, setQuery] = React.useState(() => searchParams.get("q") ?? "");
    const [mediaType, setMediaType] = React.useState<MediaType | "all">("all");

    const debouncedQuery = useDebounce(query, 400);
    const enabled = debouncedQuery.length >= 1;

    const { data, isLoading, isError } = useSearch(
        {
            q: debouncedQuery || undefined,
            media_type: mediaType !== "all" ? mediaType : undefined,
            limit: 24,
        },
        enabled,
    );

    const results = data?.results ?? [];

    return (
        <div className="space-y-6">
            <PageHeader title="Search" description="Browse the drama catalog." />

            <div className="flex flex-wrap gap-3">
                <div className="relative min-w-[200px] flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by title, genre, synopsis…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-9"
                        autoFocus={!!searchParams.get("q")}
                    />
                </div>
                <Select
                    value={mediaType}
                    onValueChange={(v) => setMediaType(v as MediaType | "all")}
                >
                    <SelectTrigger className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All types</SelectItem>
                        {MEDIA_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                                {MEDIA_TYPE_LABELS[t]}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {!enabled ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                    Type to search the catalog.
                </p>
            ) : isLoading ? (
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => <ResultSkeleton key={i} />)}
                </div>
            ) : isError ? (
                <EmptyState
                    icon={AlertTriangle}
                    title="Search failed"
                    description="Something went wrong. Please try again."
                />
            ) : results.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{debouncedQuery}&rdquo;.
                </p>
            ) : (
                <>
                    <p className="text-sm text-muted-foreground">{data?.total ?? results.length} results</p>
                    <div className="space-y-2">
                        {results.map((r) => (
                            <SearchResultRow key={r.catalog_id} result={r} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
