"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Bot, Globe, Loader2, Pencil, Plus, Tv2 } from "lucide-react";
import { useShow } from "@/hooks/use-shows";
import { useReviewAggregate, useShowReviews } from "@/hooks/use-reviews";
import { useShowSummary } from "@/hooks/use-ai";
import type { Review, ShowSummary } from "@/lib/types";
import { formatDate } from "@/lib/date";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueryState } from "@/components/shared/query-state";
import { RatingStars } from "@/components/reviews/rating-stars";
import { NotFoundState } from "@/components/shared/not-found-state";
import { ShowStatusBadge } from "@/components/shows/show-status-badge";
import { ShowFormDialog } from "@/components/shows/show-form-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// ── Review item ───────────────────────────────────────────────────────────────

function ReviewItem({ review }: { review: Review }) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
                <RatingStars rating={review.rating} />
                <span className="text-xs text-muted-foreground">
                    {formatDate(review.updated_at)}
                </span>
            </div>
            {review.contains_spoilers && (
                <Badge variant="outline" className="text-xs">Spoilers</Badge>
            )}
            {review.content_html ? (
                <div
                    className="prose prose-sm dark:prose-invert max-w-none text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: review.content_html }}
                />
            ) : review.content ? (
                <p className="text-sm text-muted-foreground">{review.content}</p>
            ) : null}
        </div>
    );
}

// ── AI summary card ───────────────────────────────────────────────────────────

function AISummaryCard({
    showId,
    showTitle,
    reviewCount,
    reviews,
}: {
    showId: string;
    showTitle: string;
    reviewCount: number;
    reviews: Array<{ rating: number; content: string | null }>;
}) {
    const summaryMutation = useShowSummary();
    const result = summaryMutation.data;

    const sentimentColor: Record<ShowSummary["sentiment"], string> = {
        positive: "text-green-600 dark:text-green-400",
        negative: "text-destructive",
        mixed: "text-amber-600 dark:text-amber-400",
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Bot className="h-4 w-4" />
                    AI Review Summary
                </CardTitle>
                <Button
                    size="sm"
                    variant="outline"
                    disabled={summaryMutation.isPending || reviewCount === 0}
                    onClick={() =>
                        summaryMutation.mutate(
                            {
                                showId,
                                showTitle,
                                reviews: reviews
                                    .filter((r) => r.content)
                                    .map((r) => ({ rating: r.rating, content: r.content! })),
                            },
                            { onError: () => toast.error("Failed to generate summary") },
                        )
                    }
                >
                    {summaryMutation.isPending && (
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    )}
                    {result ? "Regenerate" : "Generate"}
                </Button>
            </CardHeader>
            <CardContent>
                {reviewCount === 0 && !result ? (
                    <p className="text-sm text-muted-foreground">
                        No reviews yet — be the first to write one.
                    </p>
                ) : summaryMutation.isPending ? (
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                ) : result ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Overall sentiment:</span>
                            <span className={`text-sm font-semibold capitalize ${sentimentColor[result.sentiment]}`}>
                                {result.sentiment}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{result.summary}</p>
                        {result.highlights.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-green-600 dark:text-green-400">
                                    What people love
                                </p>
                                <ul className="space-y-0.5">
                                    {result.highlights.map((h, i) => (
                                        <li key={i} className="text-sm text-muted-foreground">
                                            • {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {result.criticisms.length > 0 && (
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-destructive">
                                    Common criticisms
                                </p>
                                <ul className="space-y-0.5">
                                    {result.criticisms.map((c, i) => (
                                        <li key={i} className="text-sm text-muted-foreground">
                                            • {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Click &ldquo;Generate&rdquo; to get an AI-powered summary of all reviews.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ShowDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [editOpen, setEditOpen] = React.useState(false);

    const { data: show, isLoading: showLoading, isError: showError } = useShow(id);
    const { data: aggregate } = useReviewAggregate(id);
    const { data: reviewsData, isLoading: reviewsLoading, isError: reviewsError } =
        useShowReviews(id);

    const reviews = reviewsData?.reviews ?? [];

    if (showLoading) {
        return (
            <div className="max-w-3xl space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
            </div>
        );
    }

    if (showError || !show) {
        return (
            <NotFoundState
                heading="Show not found"
                description="This show doesn't exist or you don't have access to it."
            />
        );
    }

    return (
        <div className="max-w-3xl space-y-8">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" asChild className="-ml-2">
                    <Link href="/list">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        My List
                    </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    Edit
                </Button>
            </div>

            {/* Show info */}
            <Card>
                <CardContent className="space-y-4 pt-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="text-2xl font-bold leading-tight">{show.title}</h1>
                            {show.original_title && (
                                <p className="text-sm text-muted-foreground">{show.original_title}</p>
                            )}
                        </div>
                        <ShowStatusBadge status={show.status} />
                    </div>

                    {/* Meta row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        {show.year && <span>{show.year}</span>}
                        {show.country && (
                            <span className="flex items-center gap-1">
                                <Globe className="h-3.5 w-3.5" />
                                {show.country}
                            </span>
                        )}
                        {show.language && <span>{show.language}</span>}
                        {show.episode_count != null && (
                            <span className="flex items-center gap-1">
                                <Tv2 className="h-3.5 w-3.5" />
                                {show.episodes_watched} / {show.episode_count} ep
                            </span>
                        )}
                    </div>

                    {/* Genres + tags */}
                    {(show.genre.length > 0 || show.tags.length > 0) && (
                        <div className="flex flex-wrap gap-1.5">
                            {show.genre.map((g) => (
                                <Badge key={g} variant="secondary">{g}</Badge>
                            ))}
                            {show.tags.map((t) => (
                                <Badge key={t} variant="outline">{t}</Badge>
                            ))}
                        </div>
                    )}

                    {/* Notes */}
                    {show.notes && (
                        <p className="text-sm text-muted-foreground">{show.notes}</p>
                    )}

                    {/* Aggregate */}
                    {aggregate && (
                        <>
                            <Separator />
                            <div className="flex items-center gap-4 text-sm">
                                {aggregate.avg_rating != null && (
                                    <div className="flex items-center gap-2">
                                        <RatingStars rating={aggregate.avg_rating} />
                                        <span className="font-semibold">
                                            {aggregate.avg_rating.toFixed(1)}
                                        </span>
                                    </div>
                                )}
                                <span className="text-muted-foreground">
                                    {aggregate.review_count} review
                                    {aggregate.review_count !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* AI summary */}
            <AISummaryCard
                showId={id}
                showTitle={show.title}
                reviewCount={aggregate?.review_count ?? 0}
                reviews={reviews}
            />

            {/* Reviews */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Reviews</h2>
                    <Button size="sm" asChild>
                        <Link href={`/reviews/new?showId=${id}`}>
                            <Plus className="mr-2 h-4 w-4" />
                            Write a review
                        </Link>
                    </Button>
                </div>

                <QueryState
                    isLoading={reviewsLoading}
                    isError={reviewsError}
                    isEmpty={reviews.length === 0}
                    empty={{ title: "No reviews yet", description: "Be the first to review this show." }}
                >
                    <div className="space-y-6">
                        {reviews.map((review, i) => (
                            <React.Fragment key={review.id}>
                                {i > 0 && <Separator />}
                                <ReviewItem review={review} />
                            </React.Fragment>
                        ))}
                    </div>
                </QueryState>
            </section>

            <ShowFormDialog open={editOpen} onOpenChange={setEditOpen} show={show} />
        </div>
    );
}
