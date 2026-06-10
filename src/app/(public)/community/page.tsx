"use client";

import { motion } from "framer-motion";
import { Newspaper } from "lucide-react";
import { useRecentPublicReviews } from "@/hooks/use-reviews";
import { EmptyState } from "@/components/shared/empty-state";
import { FeaturedReviewCard, ReviewFeedCard, CardFeedSkeleton } from "./_components/review-feed-card";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CommunityPage() {
    const { data: reviews, isLoading } = useRecentPublicReviews();

    const featured = reviews?.[0];
    const rest = reviews?.slice(1) ?? [];

    const avgRating = reviews?.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : null;
    const topRating = reviews?.length
        ? Math.max(...reviews.map((r) => r.rating))
        : null;

    return (
        <div className="container py-10">

            {/* ── Page header ─────────────────────────────────────────── */}
            <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
            >
                <div className="mb-3 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                    Community
                </div>

                <h1 className="font-hand text-4xl tracking-normal text-foreground md:text-5xl lg:text-6xl">
                    The{" "}
                    <span className="font-display italic text-violet-600 dark:text-violet-400">
                        Dispatch
                    </span>
                </h1>

                <p className="mt-2 text-sm text-muted-foreground">
                    What everyone&apos;s been watching — and thinking.
                </p>

                {/* Stats strip */}
                {reviews && reviews.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[11px] text-muted-foreground/50">
                        <span>
                            <span className="font-mono font-semibold tabular-nums text-foreground/60">
                                {reviews.length}
                            </span>{" "}
                            {reviews.length === 1 ? "review" : "reviews"}
                        </span>
                        <span className="text-muted-foreground/20">·</span>
                        <span>
                            avg{" "}
                            <span className="font-mono font-semibold tabular-nums text-amber-500 dark:text-amber-400">
                                {avgRating}
                            </span>
                        </span>
                        <span className="text-muted-foreground/20">·</span>
                        <span>
                            top score{" "}
                            <span className="font-mono font-semibold tabular-nums text-amber-500 dark:text-amber-400">
                                {topRating}
                            </span>
                        </span>
                    </div>
                )}

                {/* Ornamental rule */}
                <div className="mt-6 flex items-center gap-4" aria-hidden>
                    <div className="h-px flex-1 bg-gradient-to-r from-violet-300/50 to-transparent dark:from-violet-700/35" />
                    <span className="text-[8px] text-violet-400/60 dark:text-violet-600/60">◆</span>
                    <div className="h-px flex-1 bg-gradient-to-l from-violet-300/50 to-transparent dark:from-violet-700/35" />
                </div>
            </motion.div>

            {/* ── Feed ─────────────────────────────────────────────────── */}
            {isLoading ? (
                <CardFeedSkeleton />
            ) : !reviews?.length ? (
                <EmptyState
                    icon={Newspaper}
                    title="Nothing here yet"
                    description="Be the first to share your thoughts on a show."
                />
            ) : (
                <div className="space-y-10">

                    {/* Featured review */}
                    {featured && <FeaturedReviewCard review={featured} />}

                    {/* Section divider */}
                    {rest.length > 0 && (
                        <motion.div
                            className="flex items-center gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.25, ease }}
                        >
                            <div className="h-px flex-1 bg-border/40" />
                            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground/35">
                                Latest Voices
                            </span>
                            <div className="h-px flex-1 bg-border/40" />
                        </motion.div>
                    )}

                    {/* Grid */}
                    {rest.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {rest.map((review, gridIndex) => (
                                <ReviewFeedCard
                                    key={review.id}
                                    review={review}
                                    index={gridIndex}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
