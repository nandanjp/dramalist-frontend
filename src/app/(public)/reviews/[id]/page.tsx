"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    ChevronRight,
    Clock,
    Film,
    Globe,
    ImageIcon,
    Lock,
    MapPin,
    TriangleAlert,
    Tv,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import { useReview } from "@/hooks/use-reviews";
import { useCatalogEntry } from "@/hooks/use-catalog";
import { RatingStars } from "@/components/reviews/rating-stars";
import { Skeleton } from "@/components/ui/skeleton";
import { MEDIA_TYPE_LABELS } from "@/lib/types";
import type { AiringStatus } from "@/lib/types";

const STATUS_GLOW_LIGHT: Record<AiringStatus, string> = {
    ongoing:   "radial-gradient(ellipse 90% 130% at 0% 50%, hsl(199 89% 92% / 0.60) 0%, transparent 70%)",
    completed: "radial-gradient(ellipse 90% 130% at 0% 50%, hsl(152 76% 90% / 0.60) 0%, transparent 70%)",
    upcoming:  "radial-gradient(ellipse 90% 130% at 0% 50%, hsl(43  96% 90% / 0.55) 0%, transparent 70%)",
};
const STATUS_GLOW_DARK: Record<AiringStatus, string> = {
    ongoing:   "radial-gradient(ellipse 90% 130% at 0% 50%, hsl(199 70% 18% / 0.38) 0%, transparent 70%)",
    completed: "radial-gradient(ellipse 90% 130% at 0% 50%, hsl(152 60% 14% / 0.38) 0%, transparent 70%)",
    upcoming:  "radial-gradient(ellipse 90% 130% at 0% 50%, hsl(43  80% 16% / 0.32) 0%, transparent 70%)",
};
const STATUS_TEXT: Record<AiringStatus, string> = {
    ongoing:   "text-sky-600 dark:text-sky-400",
    completed: "text-emerald-600 dark:text-emerald-400",
    upcoming:  "text-amber-600 dark:text-amber-400",
};
const STATUS_DOT: Record<AiringStatus, string> = {
    ongoing:   "bg-sky-500",
    completed: "bg-emerald-500",
    upcoming:  "bg-amber-400",
};

const ease = [0.22, 1, 0.36, 1] as const;

interface Props {
    params: Promise<{ id: string }>;
}

export default function ReviewDetailPage({ params }: Props) {
    const { id } = use(params);
    const { data: review, isLoading: reviewLoading } = useReview(id);
    const { data: catalog, isLoading: catalogLoading } = useCatalogEntry(
        review?.catalog_id ?? "",
    );

    const isLoading = reviewLoading || (!!review && catalogLoading);

    if (!reviewLoading && !review) {
        return (
            <div className="container py-24 text-center">
                <p className="font-display text-2xl italic text-muted-foreground">
                    Review not found.
                </p>
                <Link
                    href="/community"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-violet-600 hover:underline dark:text-violet-400"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to community
                </Link>
            </div>
        );
    }

    return (
        <div className="container pb-20 pt-10">

            {/* ── Breadcrumb ───────────────────────────────────────── */}
            <motion.nav
                className="mb-8 flex items-center gap-1.5 text-[12px] text-muted-foreground/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                <Link
                    href="/community"
                    className="transition-colors hover:text-violet-600 dark:hover:text-violet-400"
                >
                    Community
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-muted-foreground/40">Review</span>
            </motion.nav>

            {/* ── Show context header ──────────────────────────────── */}
            <motion.div
                className="relative mb-8 overflow-hidden rounded-2xl border border-border/50 bg-card/30 dark:bg-card/50"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease }}
            >
                {/* Status-tinted ambient glow */}
                {catalog && (
                    <>
                        <div
                            className="pointer-events-none absolute inset-0 dark:hidden"
                            aria-hidden
                            style={{ background: STATUS_GLOW_LIGHT[catalog.airing_status] }}
                        />
                        <div
                            className="pointer-events-none absolute inset-0 hidden dark:block"
                            aria-hidden
                            style={{ background: STATUS_GLOW_DARK[catalog.airing_status] }}
                        />
                    </>
                )}

                <div className="relative flex gap-4 p-4 md:gap-5 md:p-5">
                    {/* Poster */}
                    <Link
                        href={review ? `/catalog/${review.catalog_id}` : "#"}
                        className="shrink-0 self-start"
                        tabIndex={-1}
                        aria-hidden
                    >
                        <div className="relative w-[80px] overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.03] md:w-[110px]">
                            <div className="relative aspect-2/3">
                                {isLoading ? (
                                    <div className="h-full w-full animate-pulse bg-zinc-100 dark:bg-zinc-800" />
                                ) : catalog?.poster_url ? (
                                    <Image
                                        src={catalog.poster_url}
                                        alt={catalog.title}
                                        fill
                                        sizes="110px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                        <ImageIcon className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>

                    {/* Show info */}
                    <div className="min-w-0 flex-1 pt-0.5">
                        {isLoading ? (
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-1/4" />
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-3.5 w-2/3" />
                            </div>
                        ) : catalog ? (
                            <>
                                {/* Media type — editorial rule + coloured label */}
                                <div className="mb-1.5 flex items-center gap-2">
                                    <div className={cn("h-3 w-0.5 rounded-full", STATUS_DOT[catalog.airing_status])} />
                                    <span className={cn(
                                        "font-mono text-[10px] font-semibold uppercase tracking-widest",
                                        STATUS_TEXT[catalog.airing_status],
                                    )}>
                                        {MEDIA_TYPE_LABELS[catalog.media_type]}
                                    </span>
                                </div>

                                {/* Title */}
                                <Link href={`/catalog/${catalog.id}`} className="group block">
                                    <h2 className="font-display line-clamp-2 text-xl italic leading-snug text-foreground transition-colors group-hover:text-violet-600 dark:group-hover:text-violet-400 md:text-2xl">
                                        {catalog.title}
                                    </h2>
                                </Link>

                                {/* Original title */}
                                {catalog.original_title && (
                                    <p className="mt-0.5 text-[12px] text-muted-foreground/60">
                                        {catalog.original_title}
                                    </p>
                                )}

                                {/* Metadata chips */}
                                <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                                    {catalog.year && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border/50 dark:bg-muted/30">
                                            <Calendar className="h-2.5 w-2.5 opacity-50" />
                                            {catalog.year}
                                        </span>
                                    )}
                                    {catalog.country && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border/50 dark:bg-muted/30">
                                            <MapPin className="h-2.5 w-2.5 opacity-50" />
                                            {catalog.country}
                                        </span>
                                    )}
                                    {catalog.episode_count != null && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border/50 dark:bg-muted/30">
                                            <Tv className="h-2.5 w-2.5 opacity-50" />
                                            {catalog.episode_count} eps
                                        </span>
                                    )}
                                    {catalog.duration_minutes != null && (
                                        <span className="inline-flex items-center gap-1 rounded-md bg-background/60 px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border/50 dark:bg-muted/30">
                                            <Clock className="h-2.5 w-2.5 opacity-50" />
                                            {catalog.duration_minutes} min
                                        </span>
                                    )}
                                </div>

                                {/* Airing status row */}
                                <div className="mt-3 flex items-center gap-1.5">
                                    <div
                                        className={cn(
                                            "h-1.5 w-1.5 rounded-full",
                                            STATUS_DOT[catalog.airing_status],
                                            catalog.airing_status === "ongoing" && "animate-pulse",
                                        )}
                                    />
                                    <span className={cn("text-[10px] font-medium capitalize", STATUS_TEXT[catalog.airing_status])}>
                                        {catalog.airing_status}
                                    </span>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </motion.div>

            {/* ── Divider ──────────────────────────────────────────── */}
            <div className="mb-8 h-px bg-border/50" />

            {/* ── Review section ───────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease }}
            >
                {/* Rating */}
                {isLoading ? (
                    <Skeleton className="mb-6 h-6 w-32" />
                ) : review ? (
                    <div className="mb-6">
                        <RatingStars rating={review.rating} />
                    </div>
                ) : null}

                {/* Badges */}
                {review && (
                    <div className="mb-5 flex flex-wrap items-center gap-2">
                        {review.is_public ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/50">
                                <Globe className="h-3 w-3" />
                                Public review
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/50">
                                <Lock className="h-3 w-3" />
                                Private review
                            </span>
                        )}
                        {review.contains_spoilers && (
                            <span className="inline-flex items-center gap-1 rounded-sm bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                                <TriangleAlert className="h-3 w-3" />
                                Contains spoilers
                            </span>
                        )}
                    </div>
                )}

                {/* Review body */}
                {isLoading ? (
                    <div className="space-y-2.5">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                ) : review?.content_html ? (
                    <div
                        className="review-prose"
                        dangerouslySetInnerHTML={{ __html: review.content_html }}
                    />
                ) : review?.content ? (
                    <div className="review-prose">
                        <p>{review.content}</p>
                    </div>
                ) : review ? (
                    <p className="text-sm italic text-muted-foreground/50">
                        Rating only — no written review.
                    </p>
                ) : null}

                {/* Date */}
                {review && (
                    <p className="mt-8 font-mono text-[11px] tabular-nums text-muted-foreground/40">
                        Written{" "}
                        <time dateTime={review.created_at}>
                            {formatDate(review.created_at)}
                        </time>
                        {review.updated_at !== review.created_at && (
                            <> · edited {formatDate(review.updated_at)}</>
                        )}
                    </p>
                )}
            </motion.div>

            {/* ── Footer nav ───────────────────────────────────────── */}
            {review && (
                <motion.div
                    className="mt-10 flex items-center justify-between border-t border-border/40 pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Link
                        href="/community"
                        className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        All reviews
                    </Link>
                    <Link
                        href={`/catalog/${review.catalog_id}`}
                        className="flex items-center gap-1.5 text-sm text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        <Film className="h-3.5 w-3.5" />
                        View show
                    </Link>
                </motion.div>
            )}
        </div>
    );
}
