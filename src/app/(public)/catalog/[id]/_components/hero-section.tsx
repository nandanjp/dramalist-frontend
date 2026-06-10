"use client";

import Image from "next/image";
import { Calendar, Clock, Film, ImageIcon, MapPin, Star, Tv } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MEDIA_TYPE_LABELS } from "@/lib/types";
import type { CatalogDetail, ReviewAggregate } from "@/lib/types";
import { AiringStatusBadge } from "@/components/shared/airing-status-badge";
import { AddToListButton } from "@/components/shows/add-to-list-button";
import { Skeleton } from "@/components/ui/skeleton";


const GENRE_COLORS: Record<string, string> = {
    Romance:   "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    Drama:     "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
    Crime:     "bg-slate-100 text-slate-600 dark:bg-slate-800/70 dark:text-slate-300",
    Thriller:  "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    Comedy:    "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    Mystery:   "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
    Action:    "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300",
    Fantasy:   "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300",
    Melodrama: "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
    Legal:     "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
    Musical:   "bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300",
    Horror:    "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200",
    Historical:"bg-stone-100 text-stone-700 dark:bg-stone-800/70 dark:text-stone-300",
    Special:   "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
};
const GENRE_FALLBACK = "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300";

const ease = [0.22, 1, 0.36, 1] as const;

function HeroSkeleton() {
    return (
        <div className="relative overflow-hidden pb-12 pt-10">
            <div className="container">
                <div className="flex gap-6 md:gap-10">
                    <Skeleton className="aspect-2/3 w-[120px] shrink-0 rounded-2xl md:w-[180px] lg:w-[220px]" />
                    <div className="flex-1 space-y-4 pt-2">
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-4 w-1/3" />
                        </div>
                        <Skeleton className="h-7 w-36 rounded-full" />
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-14 rounded-full" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="mt-4 h-9 w-32 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface HeroSectionProps {
    entry: CatalogDetail | undefined;
    isLoading: boolean;
    aggregate: ReviewAggregate | undefined;
}

export function HeroSection({ entry, isLoading, aggregate }: HeroSectionProps) {
    if (isLoading) return <HeroSkeleton />;
    if (!entry) return null;

    const hasRating = aggregate?.avg_rating != null;

    return (
        <div className="relative overflow-hidden">
            {/* Layer 1 — atmospheric poster wash */}
            {entry.poster_url && (
                <div className="absolute inset-0 select-none" aria-hidden>
                    <Image
                        src={entry.poster_url}
                        alt=""
                        fill
                        className="scale-125 object-cover opacity-35 blur-2xl dark:opacity-20"
                        sizes="100vw"
                        priority
                    />
                </div>
            )}

            {/* Layer 2 — violet radial bloom, bottom-right */}
            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_88%_105%,rgba(139,92,246,0.22)_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_70%_55%_at_88%_105%,rgba(139,92,246,0.14)_0%,transparent_65%)]"
                aria-hidden
            />

            {/* Layer 3 — fade to page background */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/72 to-background dark:from-background/65 dark:via-background/82"
                aria-hidden
            />

            {/* Content */}
            <div className="relative container pt-10 pb-14 md:pb-16 md:pt-12">
                <div className="flex gap-6 md:gap-10">

                    {/* ── Poster ──────────────────────────────────────────── */}
                    <motion.div
                        className="shrink-0 self-start"
                        initial={{ opacity: 0, y: 24, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, ease }}
                    >
                        <div
                            className="relative w-[110px] rounded-2xl [clip-path:inset(0_round_1rem)] md:w-[180px] lg:w-[220px]"
                            style={{
                                boxShadow:
                                    "0 2px 4px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.14), 0 28px 56px rgba(0,0,0,0.18)",
                            }}
                        >
                            <div className="relative aspect-2/3">
                                {entry.poster_url ? (
                                    <Image
                                        src={entry.poster_url}
                                        alt={entry.title}
                                        fill
                                        sizes="(max-width: 768px) 110px, (max-width: 1024px) 180px, 220px"
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                                        <ImageIcon className="h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                                    </div>
                                )}
                            </div>

                        </div>
                    </motion.div>

                    {/* ── Metadata ────────────────────────────────────────── */}
                    <motion.div
                        className="min-w-0 flex-1 pt-1"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.48, delay: 0.08, ease }}
                    >
                        {/* Media type overline */}
                        <div className="mb-2.5 inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                            {MEDIA_TYPE_LABELS[entry.media_type]}
                        </div>

                        {/* Title */}
                        <h1 className="font-display text-2xl italic leading-tight text-foreground md:text-3xl lg:text-4xl">
                            {entry.title}
                        </h1>

                        {/* Original title */}
                        {entry.original_title && (
                            <p className="mt-1 text-sm text-muted-foreground/80">
                                {entry.original_title}
                            </p>
                        )}

                        {/* Aggregate rating — amber frosted pill */}
                        {hasRating && (
                            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 ring-1 ring-amber-200/60 dark:bg-amber-950/30 dark:ring-amber-800/40">
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                <span className="font-mono text-sm font-semibold tabular-nums text-amber-700 dark:text-amber-300">
                                    {aggregate!.avg_rating!.toFixed(1)}
                                </span>
                                <span className="text-[11px] text-amber-600/70 dark:text-amber-400/60">
                                    / 10 · {aggregate!.review_count.toLocaleString()}{" "}
                                    {aggregate!.review_count === 1 ? "review" : "reviews"}
                                </span>
                            </div>
                        )}

                        {/* Genre pills — semantic colour per genre */}
                        {entry.genre.length > 0 && (
                            <div className="mt-3.5 flex flex-wrap gap-1.5">
                                {entry.genre.map((g) => (
                                    <span
                                        key={g}
                                        className={cn(
                                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                                            GENRE_COLORS[g] ?? GENRE_FALLBACK,
                                        )}
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Meta row */}
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                            {entry.year && (
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Calendar className="h-3.5 w-3.5 shrink-0 text-violet-400 dark:text-violet-500" />
                                    {entry.year}
                                </span>
                            )}
                            {entry.country && (
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-400 dark:text-rose-500" />
                                    {entry.country}
                                </span>
                            )}
                            {entry.language && entry.language !== entry.country && (
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Film className="h-3.5 w-3.5 shrink-0 text-sky-400 dark:text-sky-500" />
                                    {entry.language}
                                </span>
                            )}
                            {entry.episode_count != null && (
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Tv className="h-3.5 w-3.5 shrink-0 text-emerald-400 dark:text-emerald-500" />
                                    {entry.episode_count}{" "}
                                    {entry.episode_count === 1 ? "episode" : "episodes"}
                                </span>
                            )}
                            {entry.duration_minutes != null && (
                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Clock className="h-3.5 w-3.5 shrink-0 text-amber-400 dark:text-amber-500" />
                                    {entry.duration_minutes} min
                                </span>
                            )}
                            <AiringStatusBadge status={entry.airing_status} />
                        </div>

                        {/* Actions */}
                        <div className="mt-6">
                            <AddToListButton catalogId={entry.id} variant="button" />
                        </div>
                    </motion.div>
                </div>

                {/* Synopsis */}
                {entry.synopsis && (
                    <motion.div
                        className="mt-8 max-w-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.22, ease }}
                    >
                        <p className="text-sm leading-relaxed text-muted-foreground md:text-[15px]">
                            {entry.synopsis}
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
