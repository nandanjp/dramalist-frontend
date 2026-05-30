"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, Play, Star, Tv2, TrendingUp } from "lucide-react";
import { useMe } from "@/hooks/use-user";
import { useTrendingCatalog, useRecentCatalog } from "@/hooks/use-catalog";
import { useRecentPublicReviews } from "@/hooks/use-reviews";
import { useListEntries } from "@/hooks/use-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { QueryState } from "@/components/shared/query-state";
import { CatalogCard } from "@/components/shows/catalog-card";
import { ReviewPreviewCard } from "@/components/reviews/review-card";

// ── Stats card ────────────────────────────────────────────────────────────────

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string | number;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold">{value}</p>
            </CardContent>
        </Card>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
    const { data: me, isLoading: meLoading } = useMe();
    const { data: watching } = useListEntries({ status: "watching", limit: 6 });
    const {
        data: trending,
        isLoading: trendingLoading,
        isError: trendingError,
    } = useTrendingCatalog();
    const { data: recent, isLoading: recentLoading, isError: recentError } = useRecentCatalog();
    const {
        data: reviews,
        isLoading: reviewsLoading,
        isError: reviewsError,
    } = useRecentPublicReviews();

    const stats = me?.watch_stats;
    const topGenre = stats?.genre_breakdown
        ? Object.entries(stats.genre_breakdown).sort((a, b) => b[1] - a[1])[0]?.[0]
        : null;
    const watchingEntries = watching?.entries ?? [];

    return (
        <div className="space-y-8">
            <PageHeader
                title={`Welcome back${me?.profile.display_name ? `, ${me.profile.display_name}` : ""}`}
                description="Here's what's happening in your drama world."
            />

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {meLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4 rounded" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <>
                        <StatCard icon={BookOpen} label="Shows tracked" value={stats?.total_watched ?? 0} />
                        <StatCard icon={Tv2} label="Episodes watched" value={stats?.total_episodes ?? 0} />
                        <StatCard
                            icon={Star}
                            label="Average rating"
                            value={stats?.avg_rating != null ? `${stats.avg_rating.toFixed(1)} / 10` : "—"}
                        />
                        <StatCard icon={TrendingUp} label="Top genre" value={topGenre ?? "—"} />
                    </>
                )}
            </div>

            {/* Continue Watching */}
            {watchingEntries.length > 0 && (
                <section className="space-y-4">
                    <h2 className="flex items-center gap-2 text-lg font-semibold">
                        <Play className="h-4 w-4" />
                        Continue Watching
                    </h2>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                        {watchingEntries.map((entry) => (
                            <Link
                                key={entry.id}
                                href={`/catalog/${entry.catalog_id}`}
                                className="flex gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/40"
                            >
                                {entry.poster_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={entry.poster_url}
                                        alt={entry.title}
                                        className="h-16 w-11 shrink-0 rounded object-cover"
                                    />
                                ) : (
                                    <div className="h-16 w-11 shrink-0 rounded bg-muted" />
                                )}
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="truncate font-medium text-sm leading-tight">{entry.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {entry.episodes_watched} ep{entry.episodes_watched !== 1 ? "s" : ""} watched
                                        {entry.episode_count ? ` / ${entry.episode_count}` : ""}
                                    </p>
                                    {entry.genre.length > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                            {entry.genre[0]}
                                        </Badge>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Trending */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Trending</h2>
                <QueryState
                    isLoading={trendingLoading}
                    isError={trendingError}
                    isEmpty={!trending?.length}
                    empty={{ title: "No trending titles yet" }}
                >
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {trending?.map((entry) => (
                            <CatalogCard key={entry.id} entry={entry} />
                        ))}
                    </div>
                </QueryState>
            </section>

            {/* Recently added */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Recently added</h2>
                <QueryState
                    isLoading={recentLoading}
                    isError={recentError}
                    isEmpty={!recent?.length}
                    empty={{ title: "Nothing recently added" }}
                >
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {recent?.slice(0, 4).map((entry) => (
                            <CatalogCard key={entry.id} entry={entry} />
                        ))}
                    </div>
                </QueryState>
            </section>

            {/* Community reviews */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Community reviews</h2>
                <QueryState
                    isLoading={reviewsLoading}
                    isError={reviewsError}
                    isEmpty={!reviews?.length}
                    empty={{ title: "No public reviews yet" }}
                >
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {reviews?.slice(0, 3).map((r) => (
                            <ReviewPreviewCard key={r.id} review={r} />
                        ))}
                    </div>
                </QueryState>
            </section>
        </div>
    );
}
