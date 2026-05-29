"use client";

import * as React from "react";
import { Brain, Loader2, Search } from "lucide-react";
import { useMoodSearch } from "@/hooks/use-ai";
import { useSearch } from "@/hooks/use-search";
import { PageHeader } from "@/components/shared/page-header";
import { ShowFormDialog } from "@/components/shows/show-form-dialog";
import { ShowStatusBadge } from "@/components/shows/show-status-badge";
import type { SearchResult } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardGridSkeleton } from "@/components/shared/card-grid-skeleton";
import { Textarea } from "@/components/ui/textarea";

export default function MoodSearchPage() {
    const [prompt, setPrompt] = React.useState("");
    const [addTarget, setAddTarget] = React.useState<SearchResult | null>(null);
    const moodMutation = useMoodSearch();

    const result = moodMutation.data;
    const searchGenre = result?.genres[0] ?? "";

    const { data: searchResults, isLoading: searchLoading } = useSearch(
        { genre: searchGenre, limit: 12 },
        !!searchGenre,
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

            {/* Prompt input */}
            <div className="space-y-3">
                <Textarea
                    placeholder="e.g. Something emotional and heartfelt with beautiful cinematography, set in historical Korea…"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                    className="resize-none"
                />
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

            {/* AI result summary */}
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
                                <span className="text-xs text-muted-foreground">Tags:</span>
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

            {/* Search results from AI genres */}
            {searchLoading && <CardGridSkeleton />}

            {!searchLoading && searchResults?.results && searchResults.results.length > 0 && (
                <div className="space-y-4">
                    <p className="flex items-center gap-2 text-sm font-medium">
                        <Search className="h-4 w-4" />
                        Matching shows
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {searchResults.results.map((r) => (
                            <Card key={r.show_id}>
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 text-base">
                                            {r.title}
                                        </CardTitle>
                                        <ShowStatusBadge status={r.status} />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {r.genre.length > 0 && (
                                        <div className="flex flex-wrap gap-1">
                                            {r.genre.slice(0, 2).map((g) => (
                                                <Badge
                                                    key={g}
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {g}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setAddTarget(r)}
                                    >
                                        Add to my list
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {!moodMutation.isPending && !result && (
                <div className="py-16 text-center text-sm text-muted-foreground">
                    <Brain className="mx-auto mb-3 h-8 w-8 opacity-40" strokeWidth={1.5} />
                    <p>Describe your mood above to discover the right drama.</p>
                </div>
            )}

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
