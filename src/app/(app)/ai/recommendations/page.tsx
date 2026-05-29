"use client";

import { Sparkles } from "lucide-react";
import { useMe } from "@/hooks/use-user";
import { useShows } from "@/hooks/use-shows";
import { useRecommendations } from "@/hooks/use-ai";
import type { AIRecommendation } from "@/lib/types";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardGridSkeleton } from "@/components/shared/card-grid-skeleton";

function RecommendationCard({ rec }: { rec: AIRecommendation }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{rec.title}</CardTitle>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {rec.year && <span>{rec.year}</span>}
                    {rec.estimated_episodes && <span>{rec.estimated_episodes} episodes</span>}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{rec.reason}</p>
                {rec.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {rec.genre.map((g) => (
                            <Badge key={g} variant="secondary" className="text-xs">
                                {g}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function RecommendationsPage() {
    const { data: me } = useMe();
    const { data: showsData } = useShows({ limit: 5, sort: "updated_at" });
    const { mutate, data: recommendations, isPending } = useRecommendations();

    const stats = me?.watch_stats;
    const recentTitles = (showsData?.shows ?? []).map((s) => s.title);

    function handleGenerate() {
        if (!stats) return;
        mutate({
            genre_breakdown: stats.genre_breakdown,
            avg_rating: stats.avg_rating,
            recent_shows: recentTitles,
        });
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Recommendations"
                description="AI-powered picks based on your watch history and taste."
                actions={
                    <Button onClick={handleGenerate} disabled={isPending || !stats}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        {isPending ? "Generating…" : "Get recommendations"}
                    </Button>
                }
            />

            {isPending && <CardGridSkeleton />}

            {!isPending && recommendations && recommendations.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {recommendations.map((rec, i) => (
                        <RecommendationCard key={i} rec={rec} />
                    ))}
                </div>
            )}

            {!isPending && !recommendations && !stats && (
                <div className="py-16 text-center text-sm text-muted-foreground">
                    <Sparkles className="mx-auto mb-3 h-8 w-8 opacity-40" strokeWidth={1.5} />
                    <p className="font-medium">Add some shows to your list first.</p>
                    <p className="mt-1">Recommendations are based on your watch history and ratings.</p>
                </div>
            )}

            {!isPending && !recommendations && stats && (
                <div className="py-16 text-center text-sm text-muted-foreground">
                    <Sparkles className="mx-auto mb-3 h-8 w-8 opacity-40" strokeWidth={1.5} />
                    <p>Click &ldquo;Get recommendations&rdquo; to generate personalised picks.</p>
                </div>
            )}
        </div>
    );
}
