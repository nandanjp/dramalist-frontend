"use client";

import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useMyReviews } from "@/hooks/use-reviews";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewEntry } from "./_components/review-entry";

const ease = [0.22, 1, 0.36, 1] as const;

function ReviewsSkeleton() {
    return (
        <div className="divide-y divide-border/40">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 py-7 md:gap-6">
                    <Skeleton className="aspect-2/3 w-[96px] shrink-0 rounded-xl" />
                    <div className="flex-1 space-y-3 pt-0.5">
                        <Skeleton className="h-5 w-2/5" />
                        <Skeleton className="h-4 w-64" />
                        <div className="mt-5 space-y-2">
                            <Skeleton className="h-3 w-full" />
                            <Skeleton className="h-3 w-5/6" />
                            <Skeleton className="h-3 w-4/6" />
                            <Skeleton className="h-3 w-3/4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function ReviewsPage() {
    const { data, isLoading } = useMyReviews({ limit: 50 });
    const reviews = data?.reviews ?? [];

    return (
        <div className="container">
            {/* ── Page header ───────────────────────────────────────── */}
            <motion.div
                className="relative mb-12 overflow-visible"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
            >
                {/* Ambient glow — light */}
                <div
                    className="pointer-events-none absolute -inset-6 rounded-4xl dark:hidden"
                    aria-hidden
                    style={{
                        background:
                            "radial-gradient(ellipse 85% 110% at 0% 0%, hsl(268 70% 90% / 0.65) 0%, hsl(340 65% 88% / 0.35) 50%, transparent 85%)",
                    }}
                />
                {/* Ambient glow — dark */}
                <div
                    className="pointer-events-none absolute -inset-6 hidden rounded-4xl dark:block"
                    aria-hidden
                    style={{
                        background:
                            "radial-gradient(ellipse 85% 110% at 0% 0%, hsl(268 50% 22% / 0.45) 0%, hsl(340 45% 18% / 0.2) 50%, transparent 85%)",
                    }}
                />

                {/* Giant decorative opening quote */}
                <span
                    className="pointer-events-none absolute -top-4 right-0 select-none font-display text-[130px] leading-none text-violet-400/[0.07] dark:text-violet-300/[0.07] md:text-[170px]"
                    aria-hidden
                >
                    &ldquo;
                </span>

                <div className="relative">
                    {/* Eyebrow */}
                    <motion.div
                        className="mb-3 flex items-center gap-2.5"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: 0.1, ease }}
                    >
                        <div
                            className="h-px w-10 rounded-full"
                            style={{
                                background: "linear-gradient(90deg, hsl(262 83% 58%), hsl(340 75% 62%))",
                            }}
                        />
                        <span className="font-hand text-[13px] tracking-wide text-rose-400/80 dark:text-rose-300/60">
                            personal journal
                        </span>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="leading-[0.95]"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.12, ease }}
                    >
                        <span className="font-hand block text-[2.6rem] text-foreground/85 md:text-[3.25rem]">
                            Your
                        </span>
                        <span className="font-display -mt-1.5 block bg-linear-to-r from-violet-600 via-fuchsia-500 to-rose-500 bg-clip-text text-[2.6rem] italic text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-rose-400 md:text-[3.25rem]">
                            Reviews
                        </span>
                    </motion.h1>

                    {/* Accent rule + count */}
                    <motion.div
                        className="mt-5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.22, ease }}
                    >
                        <div
                            className="mb-3 h-0.5 w-24 rounded-full"
                            style={{
                                background:
                                    "linear-gradient(90deg, hsl(262 83% 58% / 0.85), hsl(340 75% 62% / 0.45), transparent)",
                            }}
                        />
                        {data && !isLoading && (
                            <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-violet-500 to-rose-500 opacity-70 dark:opacity-60" />
                                <span className="font-semibold tabular-nums text-foreground">
                                    {data.total.toLocaleString()}
                                </span>{" "}
                                {data.total === 1 ? "review" : "reviews"} written
                            </p>
                        )}
                    </motion.div>
                </div>
            </motion.div>

            {/* ── Content ───────────────────────────────────────────── */}
            {isLoading ? (
                <ReviewsSkeleton />
            ) : reviews.length === 0 ? (
                <EmptyState
                    icon={MessageSquare}
                    title="No reviews yet"
                    description="Browse the catalogue, add shows to your list, and share what you thought."
                />
            ) : (
                <div className="divide-y divide-border/40">
                    {reviews.map((review, index) => (
                        <ReviewEntry key={review.id} review={review} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
