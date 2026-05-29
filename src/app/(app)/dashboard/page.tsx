"use client";

import { BookOpen, Star, Tv2, TrendingUp } from "lucide-react";
import { useMe } from "@/hooks/use-user";
import { useTrendingShows, useRecentShows } from "@/hooks/use-shows";
import { useRecentPublicReviews } from "@/hooks/use-reviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { QueryState } from "@/components/shared/query-state";
import { ShowCard } from "@/components/shows/show-card";
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
    const {
        data: trending,
        isLoading: trendingLoading,
        isError: trendingError,
    } = useTrendingShows();
    const { data: recent, isLoading: recentLoading, isError: recentError } = useRecentShows();
    const {
        data: reviews,
        isLoading: reviewsLoading,
        isError: reviewsError,
    } = useRecentPublicReviews();

    const stats = me?.watch_stats;
    const topGenre = stats?.genre_breakdown
        ? Object.entries(stats.genre_breakdown).sort((a, b) => b[1] - a[1])[0]?.[0]
        : null;

    return (
        <div className="space-y-8">
            <PageHeader
                title={`Welcome back${me?.profile.display_name ? `, ${me.profile.display_name}` : ""}`}
                description="Here's what's happening in your drama world."
            />

            {/* Stats */}
            {!meLoading && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        icon={BookOpen}
                        label="Shows tracked"
                        value={stats?.total_watched ?? 0}
                    />
                    <StatCard
                        icon={Tv2}
                        label="Episodes watched"
                        value={stats?.total_episodes ?? 0}
                    />
                    <StatCard
                        icon={Star}
                        label="Average rating"
                        value={
                            stats?.avg_rating != null ? `${stats.avg_rating.toFixed(1)} / 10` : "—"
                        }
                    />
                    <StatCard icon={TrendingUp} label="Top genre" value={topGenre ?? "—"} />
                </div>
            )}

            {/* Trending shows */}
            <section className="space-y-4">
                <h2 className="text-lg font-semibold">Trending</h2>
                <QueryState
                    isLoading={trendingLoading}
                    isError={trendingError}
                    isEmpty={!trending?.length}
                    empty={{ title: "No trending shows yet" }}
                >
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {trending?.map((show) => (
                            <ShowCard key={show.id} show={show} variant="public" />
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
                        {recent?.slice(0, 4).map((show) => (
                            <ShowCard key={show.id} show={show} variant="public" />
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
