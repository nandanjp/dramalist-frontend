"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "@/lib/date";
import { useCatalogEntry } from "@/hooks/use-catalog";
import { RatingStars } from "@/components/reviews/rating-stars";
import { Skeleton } from "@/components/ui/skeleton";
import { MEDIA_TYPE_LABELS } from "@/lib/types";
import type { PublicReviewPreview } from "@/lib/types";

// ── Genre tint palette ────────────────────────────────────────────────────────

const GENRE_TINT: Record<string, string> = {
    Romance:   "bg-rose-50 dark:bg-rose-950/25",
    Drama:     "bg-violet-50/80 dark:bg-violet-950/25",
    Crime:     "bg-slate-50 dark:bg-slate-800/25",
    Thriller:  "bg-orange-50 dark:bg-orange-950/20",
    Comedy:    "bg-amber-50 dark:bg-amber-950/20",
    Mystery:   "bg-purple-50 dark:bg-purple-950/25",
    Action:    "bg-red-50 dark:bg-red-950/20",
    Fantasy:   "bg-indigo-50 dark:bg-indigo-950/25",
    Melodrama: "bg-pink-50 dark:bg-pink-950/20",
    Historical:"bg-stone-50 dark:bg-stone-900/30",
    Legal:     "bg-teal-50 dark:bg-teal-950/20",
    Horror:    "bg-red-50/70 dark:bg-red-950/20",
    Musical:   "bg-fuchsia-50 dark:bg-fuchsia-950/20",
    Special:   "bg-emerald-50 dark:bg-emerald-950/20",
};
const GENRE_TINT_FALLBACK = "bg-muted/30 dark:bg-white/[0.03]";

// ── Skeleton ──────────────────────────────────────────────────────────────────

export function CardFeedSkeleton() {
    return (
        <div className="space-y-8">
            <Skeleton className="h-64 w-full rounded-3xl md:h-72" />
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-border/40" />
                <Skeleton className="h-2.5 w-24 rounded-full" />
                <div className="h-px flex-1 bg-border/40" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-44 rounded-2xl" />
                ))}
            </div>
        </div>
    );
}

// ── Featured card ─────────────────────────────────────────────────────────────

export function FeaturedReviewCard({ review }: { review: PublicReviewPreview }) {
    const { data: catalog } = useCatalogEntry(review.catalog_id);
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <div
                role="article"
                onClick={() => router.push(`/reviews/${review.id}`)}
                onKeyDown={(e) => e.key === "Enter" && router.push(`/reviews/${review.id}`)}
                tabIndex={0}
                className="group relative cursor-pointer overflow-hidden rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
            >
                {/* Blurred poster backdrop */}
                {catalog?.poster_url ? (
                    <div className="absolute inset-0" aria-hidden>
                        <Image
                            src={catalog.poster_url}
                            alt=""
                            fill
                            sizes="100vw"
                            className="scale-125 object-cover blur-xl"
                            priority
                        />
                        <div className="absolute inset-0 bg-background/75 dark:bg-background/55" />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-violet-50 dark:bg-violet-950/30" aria-hidden />
                )}

                {/* Mobile gradient: top-to-bottom */}
                <div
                    className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/88 dark:from-background/10 dark:to-background/75 md:hidden"
                    aria-hidden
                />
                {/* Desktop gradient: left-to-right */}
                <div
                    className="absolute inset-0 hidden bg-gradient-to-r from-background/90 via-background/60 to-background/15 dark:from-background/85 dark:via-background/50 dark:to-background/10 md:block"
                    aria-hidden
                />

                {/* Content — always horizontal, sizes scale with breakpoint */}
                <div className="relative flex items-center gap-4 p-5 sm:gap-5 sm:p-6 md:gap-10 md:p-10 lg:p-12">

                    {/* Poster */}
                    <Link
                        href={`/catalog/${review.catalog_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 self-start"
                    >
                        <div className="relative w-[72px] overflow-hidden rounded-xl shadow-[0_6px_24px_rgba(0,0,0,0.18)] transition-transform duration-300 hover:scale-[1.03] sm:w-[84px] md:w-[130px] md:rounded-2xl md:shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                            <div className="relative aspect-2/3">
                                {catalog?.poster_url ? (
                                    <Image
                                        src={catalog.poster_url}
                                        alt={catalog.title ?? ""}
                                        fill
                                        sizes="(max-width: 768px) 84px, 130px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                        <ImageIcon className="h-6 w-6 text-zinc-300 dark:text-zinc-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>

                    {/* Editorial content */}
                    <div className="min-w-0 flex-1">

                        {/* Label row */}
                        <div className="mb-3 flex items-center gap-2.5 md:mb-4 md:gap-3">
                            <span className="inline-flex items-center rounded-full bg-violet-600 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white md:px-3 md:text-[10px]">
                                Featured
                            </span>
                            {catalog ? (
                                <span className="font-mono text-[9px] text-muted-foreground/40 tabular-nums md:text-[10px]">
                                    {MEDIA_TYPE_LABELS[catalog.media_type]}&ensp;·&ensp;{formatDistanceToNow(review.created_at)}
                                </span>
                            ) : (
                                <Skeleton className="h-3 w-28" />
                            )}
                        </div>

                        {/* Pull-quote */}
                        {review.content_snippet ? (
                            <div className="relative">
                                <span
                                    className="pointer-events-none absolute -top-3 -left-0.5 select-none font-display text-[44px] leading-none text-violet-400/30 dark:text-violet-400/20 md:-top-4 md:-left-1 md:text-[72px]"
                                    aria-hidden
                                >
                                    &ldquo;
                                </span>
                                <p className="font-display pl-4 text-sm italic leading-relaxed text-foreground/85 line-clamp-2 sm:text-base sm:line-clamp-3 md:pl-5 md:text-xl">
                                    {review.content_snippet}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2 pl-4 md:pl-5">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-3/4 md:block hidden" />
                            </div>
                        )}

                        {/* Show title + rating */}
                        <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-1.5 md:mt-5 md:gap-x-6">
                            {catalog ? (
                                <Link
                                    href={`/catalog/${review.catalog_id}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h3 className="font-display text-xs italic text-foreground/60 transition-colors hover:text-violet-600 dark:hover:text-violet-400 md:text-sm">
                                        {catalog.title}
                                        {catalog.year && (
                                            <span className="ml-1.5 font-mono text-[9px] not-italic text-muted-foreground/40 md:ml-2 md:text-[10px]">
                                                {catalog.year}
                                            </span>
                                        )}
                                    </h3>
                                </Link>
                            ) : (
                                <Skeleton className="h-3.5 w-32" />
                            )}
                            <div className="flex items-baseline gap-1">
                                <span className="font-mono text-[22px] font-black leading-none tabular-nums text-amber-500 dark:text-amber-400 md:text-[28px]">
                                    {review.rating}
                                </span>
                                <span className="font-mono text-[9px] text-muted-foreground/35">/10</span>
                            </div>
                        </div>

                        {/* Stars — hidden on mobile to keep card compact */}
                        <div className="mt-1.5 hidden md:block md:mt-2">
                            <RatingStars rating={review.rating} />
                        </div>

                        {/* Read hint */}
                        <div className="mt-3 md:mt-5">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-violet-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:text-violet-400 md:text-[12px]">
                                Read full review
                                <ArrowRight className="h-3 w-3 -translate-x-1 transition-transform duration-200 group-hover:translate-x-0 md:h-3.5 md:w-3.5" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// ── Grid card ─────────────────────────────────────────────────────────────────

interface ReviewFeedCardProps {
    review: PublicReviewPreview;
    index: number;
}

export function ReviewFeedCard({ review, index }: ReviewFeedCardProps) {
    const { data: catalog } = useCatalogEntry(review.catalog_id);
    const router = useRouter();

    const genreTint = catalog?.genre?.[0]
        ? (GENRE_TINT[catalog.genre[0]] ?? GENRE_TINT_FALLBACK)
        : GENRE_TINT_FALLBACK;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
            <div
                role="article"
                onClick={() => router.push(`/reviews/${review.id}`)}
                onKeyDown={(e) => e.key === "Enter" && router.push(`/reviews/${review.id}`)}
                tabIndex={0}
                className={cn(
                    "group relative cursor-pointer overflow-hidden rounded-2xl p-4 outline-none transition-all duration-200",
                    "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/25",
                    "focus-visible:ring-2 focus-visible:ring-violet-500/50",
                    "md:p-5",
                    genreTint,
                )}
            >
                {/* Decorative large quotation mark */}
                <span
                    className="pointer-events-none absolute right-3 top-1 select-none font-display text-[80px] leading-none text-foreground/[0.04] dark:text-foreground/[0.05]"
                    aria-hidden
                >
                    &ldquo;
                </span>

                <div className="relative flex gap-3">
                    {/* Poster */}
                    <Link
                        href={`/catalog/${review.catalog_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 self-start"
                    >
                        <div className="relative w-[54px] overflow-hidden rounded-xl shadow-sm transition-transform duration-300 hover:scale-[1.04]">
                            <div className="relative aspect-2/3">
                                {catalog?.poster_url ? (
                                    <Image
                                        src={catalog.poster_url}
                                        alt={catalog.title ?? ""}
                                        fill
                                        sizes="54px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                        <ImageIcon className="h-3.5 w-3.5 text-zinc-300 dark:text-zinc-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>

                    {/* Content */}
                    <div className="min-w-0 flex-1">

                        {/* Rating number */}
                        <div className="mb-1.5 flex items-baseline gap-1">
                            <span className="font-mono text-[26px] font-black leading-none tabular-nums text-amber-500 dark:text-amber-400">
                                {review.rating}
                            </span>
                            <span className="font-mono text-[9px] text-muted-foreground/35">/10</span>
                        </div>

                        {/* Show title */}
                        {catalog ? (
                            <Link
                                href={`/catalog/${review.catalog_id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="block"
                            >
                                <h3 className="font-display line-clamp-1 text-[13px] italic leading-snug text-foreground transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                                    {catalog.title}
                                </h3>
                            </Link>
                        ) : (
                            <Skeleton className="h-4 w-3/4" />
                        )}

                        {/* Genre + year */}
                        {catalog ? (
                            <div className="mt-0.5 flex items-center gap-1.5">
                                {catalog.genre[0] && (
                                    <span className="text-[10px] font-medium text-muted-foreground/50">
                                        {catalog.genre[0]}
                                    </span>
                                )}
                                {catalog.year && (
                                    <>
                                        {catalog.genre[0] && <span className="text-[9px] text-muted-foreground/25">·</span>}
                                        <span className="font-mono text-[10px] tabular-nums text-muted-foreground/40">
                                            {catalog.year}
                                        </span>
                                    </>
                                )}
                            </div>
                        ) : (
                            <Skeleton className="mt-1 h-3 w-1/2" />
                        )}
                    </div>
                </div>

                {/* Pull-quote */}
                {review.content_snippet ? (
                    <p className="font-display mt-3 line-clamp-2 overflow-hidden text-ellipsis text-[12px] italic leading-relaxed text-muted-foreground/65">
                        &ldquo;{review.content_snippet}&rdquo;
                    </p>
                ) : (
                    <div className="mt-3 space-y-1.5">
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-4/5" />
                    </div>
                )}

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-[9px] tabular-nums text-muted-foreground/30">
                        {formatDistanceToNow(review.created_at)}
                    </span>
                    <span className="flex items-center gap-0.5 text-[10px] font-medium text-violet-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100 dark:text-violet-400">
                        Read
                        <ArrowRight className="h-2.5 w-2.5" />
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
