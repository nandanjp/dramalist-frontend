"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ChevronDown,
    ChevronUp,
    Globe,
    Lock,
    MessageSquare,
    Pencil,
    Star,
    TriangleAlert,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatDistanceToNow } from "@/lib/date";
import { useCreateReview, useUpdateReview } from "@/hooks/use-reviews";
import type { CatalogDetail, Profile, Review, ReviewAggregate } from "@/lib/types";
import { RatingStars, RatingInput } from "@/components/reviews/rating-stars";
import { ReviewEditor } from "@/components/reviews/review-editor";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const LONG_THRESHOLD = 500;
const ease = [0.22, 1, 0.36, 1] as const;

// ── Single review card ────────────────────────────────────────────────────────

function ReviewCard({ review, isOwn }: { review: Review; isOwn: boolean }) {
    const [expanded, setExpanded] = useState(false);
    const hasContent = !!(review.content_html || review.content);
    const isLong = (review.content_html ?? review.content ?? "").length > LONG_THRESHOLD;

    return (
        <article
            className={cn(
                "relative rounded-2xl p-6",
                isOwn
                    ? "bg-violet-50 ring-1 ring-violet-200/70 dark:bg-violet-950/20 dark:ring-violet-800/30"
                    : "bg-muted/30 dark:bg-white/[0.025]",
            )}
            style={
                isOwn
                    ? { boxShadow: "0 2px 16px rgba(139,92,246,0.1), 0 1px 4px rgba(0,0,0,0.05)" }
                    : undefined
            }
        >
            {/* Header: rating + meta row */}
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                    <RatingStars rating={review.rating} />
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                        <time
                            dateTime={review.created_at}
                            title={formatDate(review.created_at)}
                            className="font-mono text-[11px] tabular-nums text-muted-foreground/50"
                        >
                            {formatDistanceToNow(review.created_at)}
                        </time>
                        {review.is_public ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/35">
                                <Globe className="h-2.5 w-2.5" />
                                Public
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/35">
                                <Lock className="h-2.5 w-2.5" />
                                Private
                            </span>
                        )}
                        {review.contains_spoilers && (
                            <span className="inline-flex items-center gap-1 rounded-sm bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                                <TriangleAlert className="h-2.5 w-2.5" />
                                Spoilers
                            </span>
                        )}
                    </div>
                </div>

                {isOwn && (
                    <span className="shrink-0 rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                        Your review
                    </span>
                )}
            </div>

            {/* Body — prose is the hero */}
            {hasContent && (
                <div>
                    <div
                        className={cn(
                            "review-prose",
                            !expanded &&
                                isLong &&
                                "max-h-52 overflow-hidden [mask-image:linear-gradient(to_bottom,black_58%,transparent_100%)]",
                        )}
                    >
                        {review.content_html ? (
                            <div dangerouslySetInnerHTML={{ __html: review.content_html }} />
                        ) : (
                            <p>{review.content}</p>
                        )}
                    </div>

                    {isLong && (
                        <button
                            onClick={() => setExpanded((e) => !e)}
                            className="mt-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium text-violet-600 ring-1 ring-violet-200 transition-all hover:bg-violet-50 hover:ring-violet-300 dark:text-violet-400 dark:ring-violet-800/50 dark:hover:bg-violet-950/30"
                        >
                            {expanded ? (
                                <>
                                    <ChevronUp className="h-3.5 w-3.5" />
                                    Show less
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="h-3.5 w-3.5" />
                                    Read full review
                                </>
                            )}
                        </button>
                    )}
                </div>
            )}

            {!hasContent && (
                <p className="text-sm italic text-muted-foreground/40">
                    Rating only — no written review.
                </p>
            )}
        </article>
    );
}

// ── Write / edit review form ──────────────────────────────────────────────────

interface ReviewFormProps {
    catalogId: string;
    catalogTitle: string;
    entry: CatalogDetail;
    existingReview: Review | undefined;
    onDone: () => void;
}

function ReviewForm({ catalogId, catalogTitle, entry, existingReview, onDone }: ReviewFormProps) {
    const [rating, setRating] = useState(existingReview?.rating ?? 7);
    const [content, setContent] = useState(existingReview?.content ?? "");
    const [containsSpoilers, setContainsSpoilers] = useState(
        existingReview?.contains_spoilers ?? false,
    );
    const [isPublic, setIsPublic] = useState(existingReview?.is_public ?? true);

    const { mutate: createReview, isPending: creating } = useCreateReview();
    const { mutate: updateReview, isPending: updating } = useUpdateReview(existingReview?.id ?? "");

    const isPending = creating || updating;

    function handleSubmit() {
        if (existingReview) {
            updateReview(
                { rating, content: content || undefined, contains_spoilers: containsSpoilers, is_public: isPublic },
                { onSuccess: onDone },
            );
        } else {
            createReview(
                {
                    catalog_id: catalogId,
                    catalog_title: catalogTitle,
                    rating,
                    content: content || undefined,
                    contains_spoilers: containsSpoilers,
                    is_public: isPublic,
                    show_genres: entry.genre,
                    show_episode_count: entry.episode_count ?? undefined,
                },
                { onSuccess: onDone },
            );
        }
    }

    return (
        <div className="rounded-xl border border-violet-200 bg-violet-50/30 p-5 dark:border-violet-800/30 dark:bg-violet-950/10">
            <h3 className="font-display mb-4 text-base italic text-foreground">
                {existingReview ? "Edit your review" : "Write a review"}
            </h3>

            {/* Rating */}
            <div className="mb-4">
                <Label className="mb-2 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Your rating
                </Label>
                <RatingInput value={rating} onChange={setRating} />
            </div>

            {/* Editor */}
            <div className="mb-4">
                <Label className="mb-2 block text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Review{" "}
                    <span className="normal-case font-normal text-muted-foreground/60">
                        (optional)
                    </span>
                </Label>
                <ReviewEditor
                    key={existingReview?.id ?? "new"}
                    content={existingReview?.content ?? ""}
                    onChange={setContent}
                    placeholder="Share your thoughts on the show…"
                />
            </div>

            {/* Toggles */}
            <div className="mb-5 flex flex-wrap gap-5">
                <div className="flex items-center gap-2">
                    <Switch
                        id="spoilers"
                        checked={containsSpoilers}
                        onCheckedChange={setContainsSpoilers}
                    />
                    <Label htmlFor="spoilers" className="text-sm cursor-pointer">
                        Contains spoilers
                    </Label>
                </div>
                <div className="flex items-center gap-2">
                    <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
                    <Label htmlFor="public" className="text-sm cursor-pointer">
                        Public review
                    </Label>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Button onClick={handleSubmit} disabled={isPending} size="sm">
                    {isPending
                        ? "Saving…"
                        : existingReview
                          ? "Update review"
                          : "Post review"}
                </Button>
                <Button variant="ghost" size="sm" onClick={onDone} disabled={isPending}>
                    <X className="h-4 w-4" />
                    Cancel
                </Button>
            </div>
        </div>
    );
}

// ── Empty state ───────────────────────────────────────────────────────────────

function ReviewsEmptyState() {
    return (
        <motion.div
            className="py-10 text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
        >
            {/* Top ornament */}
            <div className="mb-10 flex items-center gap-3">
                <div className="h-px flex-1 bg-border/30" />
                <div className="h-1.5 w-1.5 rotate-45 bg-violet-400/50 dark:bg-violet-500/40" />
                <div className="h-px flex-1 bg-border/30" />
            </div>

            {/* Decorative opening quote */}
            <p
                className="font-display pointer-events-none select-none text-[96px] leading-none text-violet-200/80 dark:text-violet-800/60"
                aria-hidden
            >
                &#8220;
            </p>

            {/* Hollow stars */}
            <div className="-mt-3 mb-5 flex justify-center gap-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-[18px] w-[18px] text-border dark:text-border/60" strokeWidth={1.5} />
                ))}
            </div>

            {/* Headline */}
            <p className="font-display mb-2.5 text-[19px] italic text-foreground/70">
                The first word belongs to you.
            </p>

            {/* Subtext */}
            <p className="mx-auto mb-9 max-w-[22rem] text-[13px] leading-relaxed text-muted-foreground/50">
                No one has written here yet. Your thoughts shape what others discover next.
            </p>

            {/* Ghost prose lines — outline the shape of a review */}
            <div className="mx-auto max-w-[260px] space-y-2.5">
                {[88, 68, 92, 50].map((w, i) => (
                    <div
                        key={i}
                        className="mx-auto h-1.5 rounded-full bg-violet-100/90 dark:bg-violet-950/50"
                        style={{ width: `${w}%`, opacity: (1 - i * 0.15) * 0.55 }}
                    />
                ))}
            </div>

            {/* Bottom ornament */}
            <div className="mt-10 flex items-center gap-3">
                <div className="h-px flex-1 bg-border/30" />
                <div className="h-1.5 w-1.5 rotate-45 bg-violet-400/50 dark:bg-violet-500/40" />
                <div className="h-px flex-1 bg-border/30" />
            </div>
        </motion.div>
    );
}

// ── Aggregate banner — compact inline stats row ───────────────────────────────

function AggregateBanner({ aggregate }: { aggregate: ReviewAggregate }) {
    if (aggregate.review_count === 0) return null;

    const avg = aggregate.avg_rating;
    const filled = avg != null ? Math.round((avg / 10) * 5) : 0;

    return (
        <div className="mt-2 flex items-center gap-2.5">
            {avg != null && (
                <>
                    <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                                key={i}
                                className={cn(
                                    "h-3.5 w-3.5",
                                    i < filled
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-muted-foreground/20",
                                )}
                            />
                        ))}
                    </div>
                    <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                        {avg.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground/30 text-[11px]">·</span>
                </>
            )}
            <span className="text-[13px] text-muted-foreground">
                <span className="font-medium text-foreground">
                    {aggregate.review_count.toLocaleString()}
                </span>{" "}
                {aggregate.review_count === 1 ? "review" : "reviews"}
            </span>
        </div>
    );
}

// ── Main reviews section ──────────────────────────────────────────────────────

interface ReviewsSectionProps {
    catalogId: string;
    catalogTitle: string;
    entry: CatalogDetail;
    reviews: Review[];
    aggregate: ReviewAggregate | undefined;
    myReview: Review | undefined;
    user: Profile | null;
}

export function ReviewsSection({
    catalogId,
    catalogTitle,
    entry,
    reviews,
    aggregate,
    myReview,
    user,
}: ReviewsSectionProps) {
    const [showForm, setShowForm] = useState(false);

    const otherReviews = reviews.filter((r) => r.user_id !== user?.id);

    return (
        <section className="container pb-16 pt-4">
            {/* Divider */}
            <div className="mb-10 h-px bg-border/50" />

            {/* Section header — aggregate inline below heading */}
            <motion.div
                className="mb-8 flex items-start justify-between gap-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
            >
                <div>
                    <div className="mb-1.5 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                        Reviews
                    </div>
                    <h2 className="font-display text-xl italic text-foreground">
                        What people are saying
                    </h2>
                    {aggregate && <AggregateBanner aggregate={aggregate} />}
                </div>

                {/* Write review CTA */}
                {user && !myReview && !showForm && (
                    <Button
                        size="sm"
                        variant="outline"
                        className="mt-1 shrink-0"
                        onClick={() => setShowForm(true)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Write a review
                    </Button>
                )}
            </motion.div>

            {/* My review + edit */}
            {user && myReview && !showForm && (
                <div className="mb-6">
                    <ReviewCard review={myReview} isOwn={true} />
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        <Pencil className="h-3 w-3" />
                        Edit your review
                    </button>
                </div>
            )}

            {/* Review form */}
            {showForm && (
                <div className="mb-6">
                    <ReviewForm
                        catalogId={catalogId}
                        catalogTitle={catalogTitle}
                        entry={entry}
                        existingReview={myReview}
                        onDone={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Not logged in nudge */}
            {!user && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 px-5 py-4">
                    <MessageSquare className="h-5 w-5 shrink-0 text-violet-500" />
                    <p className="text-sm text-muted-foreground">
                        <Link
                            href={`/login?next=/catalog/${catalogId}`}
                            className="font-medium text-violet-600 hover:underline dark:text-violet-400"
                        >
                            Sign in
                        </Link>{" "}
                        to write your own review.
                    </p>
                </div>
            )}

            {/* Reviews list — single col or 2-col grid */}
            {otherReviews.length > 0 ? (
                <div
                    className={cn(
                        "gap-5",
                        otherReviews.length === 1
                            ? "flex flex-col"
                            : "grid grid-cols-1 items-start md:grid-cols-2",
                    )}
                >
                    {otherReviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: Math.min(index * 0.05, 0.3),
                                ease,
                            }}
                        >
                            <ReviewCard review={review} isOwn={false} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                !myReview && aggregate?.review_count === 0 && <ReviewsEmptyState />
            )}
        </section>
    );
}
