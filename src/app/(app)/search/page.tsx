"use client";

import * as React from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import type { MediaType, SearchResult } from "@/lib/types";
import { MEDIA_TYPES, MEDIA_TYPE_LABELS } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
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

function SearchResultCard({ result }: { result: SearchResult }) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base">
                        <Link href={`/catalog/${result.catalog_id}`} className="hover:underline">
                            {result.title}
                        </Link>
                    </CardTitle>
                    <Badge variant="outline" className="shrink-0 text-xs capitalize">
                        {result.media_type}
                    </Badge>
                </div>
                {result.original_title && (
                    <p className="truncate text-xs text-muted-foreground">{result.original_title}</p>
                )}
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {result.year && <span>{result.year}</span>}
                    {result.country && <span>{result.country}</span>}
                    <span className="capitalize">{result.airing_status}</span>
                </div>
                {result.synopsis && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{result.synopsis}</p>
                )}
                {result.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {result.genre.slice(0, 3).map((g) => (
                            <Badge key={g} variant="secondary" className="text-xs">
                                {g}
                            </Badge>
                        ))}
                    </div>
                )}
                <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href={`/catalog/${result.catalog_id}`}>View details</Link>
                </Button>
            </CardContent>
        </Card>
    );
}

export default function SearchPage() {
    const [query, setQuery] = React.useState("");
    const [mediaType, setMediaType] = React.useState<MediaType | "all">("all");

    const debouncedQuery = useDebounce(query, 400);
    const enabled = debouncedQuery.length >= 1;

    const { data, isLoading } = useSearch(
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
                <CardGridSkeleton count={8} cols="4" />
            ) : results.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                    No results for &ldquo;{debouncedQuery}&rdquo;.
                </p>
            ) : (
                <>
                    <p className="text-sm text-muted-foreground">{data?.total ?? results.length} results</p>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {results.map((r) => (
                            <SearchResultCard key={r.catalog_id} result={r} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
