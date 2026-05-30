"use client";

import * as React from "react";
import Link from "next/link";
import { Brain, Loader2 } from "lucide-react";
import { useMoodSearch } from "@/hooks/use-ai";
import { useSearch } from "@/hooks/use-search";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardGridSkeleton } from "@/components/shared/card-grid-skeleton";
import { Textarea } from "@/components/ui/textarea";

const EXAMPLE_PROMPTS = [
    "Something emotional and bittersweet set in historical Korea",
    "A light romance with a tsundere lead and lots of comedy",
    "Slow-burn detective thriller with a dark atmosphere",
    "Wholesome slice-of-life about finding yourself",
];

export default function MoodSearchPage() {
    const [prompt, setPrompt] = React.useState("");
    const moodMutation = useMoodSearch();

    const result = moodMutation.data;

    const { data: searchResults, isLoading: searchLoading } = useSearch(
        {
            q: result?.query,
            genre: result?.genres[0],
            limit: 12,
        },
        !!result,
    );

    async function handleSearch() {
        if (!prompt.trim()) return;
        await moodMutation.mutateAsync({ prompt: prompt.trim() });
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Mood Search"
                description="Describe what you're in the mood for and let AI find the perfect drama."
            />

            <div className="space-y-3">
                <Textarea
                    placeholder="e.g. Something emotional and heartfelt with beautiful cinematography, set in historical Korea…"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="resize-none"
                />
                <div className="flex flex-wrap gap-2">
                    {EXAMPLE_PROMPTS.map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => setPrompt(p)}
                            className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <Button
                    onClick={handleSearch}
                    disabled={moodMutation.isPending || !prompt.trim()}
                    className="w-full sm:w-auto"
                >
                    {moodMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Brain className="mr-2 h-4 w-4" />
                    )}
                    Find shows
                </Button>
            </div>

            {/* AI interpretation summary */}
            {result && (
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Interpreted as</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-sm italic text-muted-foreground">
                            &ldquo;{result.query}&rdquo;
                        </p>
                        {result.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                <span className="text-xs text-muted-foreground">Genres:</span>
                                {result.genres.map((g) => (
                                    <Badge key={g} variant="secondary" className="text-xs">
                                        {g}
                                    </Badge>
                                ))}
                            </div>
                        )}
                        {result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                <span className="text-xs text-muted-foreground">Themes:</span>
                                {result.tags.map((t) => (
                                    <Badge key={t} variant="outline" className="text-xs">
                                        {t}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {searchLoading && <CardGridSkeleton />}

            {!searchLoading && searchResults?.results && searchResults.results.length > 0 && (
                <div className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">
                        {searchResults.total} matching titles
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {searchResults.results.map((r) => (
                            <Card key={r.catalog_id} className="flex flex-col">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 text-base">
                                            <Link
                                                href={`/catalog/${r.catalog_id}`}
                                                className="hover:underline"
                                            >
                                                {r.title}
                                            </Link>
                                        </CardTitle>
                                        <Badge variant="outline" className="shrink-0 text-xs capitalize">
                                            {r.media_type}
                                        </Badge>
                                    </div>
                                    {r.year && (
                                        <p className="text-xs text-muted-foreground">{r.year}</p>
                                    )}
                                </CardHeader>
                                <CardContent className="flex flex-1 flex-col justify-between space-y-3">
                                    {r.synopsis && (
                                        <p className="line-clamp-3 text-xs text-muted-foreground">
                                            {r.synopsis}
                                        </p>
                                    )}
                                    {r.genre.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {r.genre.slice(0, 3).map((g) => (
                                                <Badge key={g} variant="secondary" className="text-xs">
                                                    {g}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <Button size="sm" variant="outline" className="w-full" asChild>
                                        <Link href={`/catalog/${r.catalog_id}`}>View details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {!searchLoading && result && searchResults?.results?.length === 0 && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                    No matching titles found. Try a different description.
                </p>
            )}

            {!moodMutation.isPending && !result && (
                <div className="py-16 text-center text-sm text-muted-foreground">
                    <Brain className="mx-auto mb-3 h-8 w-8 opacity-40" strokeWidth={1.5} />
                    <p>Describe your mood above to discover the right drama.</p>
                </div>
            )}
        </div>
    );
}
