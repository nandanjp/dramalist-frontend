"use client";

import Link from "next/link";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProgressiveImage } from "@/components/shared/progressive-image";
import { AiringStatusBadge } from "@/components/shared/airing-status-badge";
import { MEDIA_TYPE_LABELS } from "@/lib/types";
import type { DramaCardData } from "./drama-card";

interface DramaListItemProps {
    data: DramaCardData;
    /** Slot for row actions (e.g. edit/delete dropdown) */
    actions?: React.ReactNode;
    className?: string;
}

export function DramaListItem({ data, actions, className }: DramaListItemProps) {
    const hasEpisodes = data.episodeCount != null;
    const hasDuration = data.durationMinutes != null;

    return (
        <div className={cn("flex items-center gap-3 md:gap-4", className)}>
            {/* Poster thumbnail */}
            <Link href={`/catalog/${data.id}`} className="shrink-0">
                <div className="relative aspect-3/4 w-12 overflow-hidden rounded-lg bg-zinc-100 md:w-11 dark:bg-zinc-800">
                    {data.posterUrl ? (
                        <ProgressiveImage
                            src={data.posterUrl}
                            alt={data.title}
                            className="absolute inset-0"
                            fallback={
                                <div className="flex h-full w-full items-center justify-center">
                                    <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />
                                </div>
                            }
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon className="h-3.5 w-3.5 text-zinc-400" />
                        </div>
                    )}
                </div>
            </Link>

            {/* Primary info column — always visible, flex-1 fills available space */}
            <div className="min-w-0 flex-1">
                <Link href={`/catalog/${data.id}`}>
                    <p className="font-display text-foreground truncate text-sm italic transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                        {data.title}
                    </p>
                </Link>
                {data.originalTitle && (
                    <p className="text-muted-foreground truncate text-[11px]">{data.originalTitle}</p>
                )}

                {/* Synopsis — desktop only, fills horizontal whitespace */}
                {data.synopsis && (
                    <p className="text-muted-foreground/50 mt-0.5 hidden truncate text-[11px] leading-relaxed md:block">
                        {data.synopsis}
                    </p>
                )}

                {/* Genre chips — desktop only, below synopsis */}
                {data.genre && data.genre.length > 0 && (
                    <div className="mt-1 hidden flex-wrap items-center gap-1 md:flex">
                        {data.genre.slice(0, 4).map((g) => (
                            <span
                                key={g}
                                className="bg-accent/70 text-muted-foreground/70 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                            >
                                {g}
                            </span>
                        ))}
                        {data.genre.length > 4 && (
                            <span className="text-muted-foreground/40 text-[10px]">
                                +{data.genre.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Mobile row 1 — year · media type · episodes or duration */}
                <div className="mt-0.5 flex flex-wrap items-center gap-x-1 gap-y-0 md:hidden">
                    {data.year && (
                        <span className="font-mono tabular-nums text-[10px] text-muted-foreground/70">
                            {data.year}
                        </span>
                    )}
                    {data.year && <span className="text-[10px] text-muted-foreground/30">·</span>}
                    <span className="text-[10px] text-muted-foreground/60">
                        {MEDIA_TYPE_LABELS[data.mediaType]}
                    </span>
                    {hasEpisodes && (
                        <>
                            <span className="text-[10px] text-muted-foreground/30">·</span>
                            <span className="text-[10px] text-muted-foreground/60">
                                {data.episodeCount} eps
                            </span>
                        </>
                    )}
                    {!hasEpisodes && hasDuration && (
                        <>
                            <span className="text-[10px] text-muted-foreground/30">·</span>
                            <span className="text-[10px] text-muted-foreground/60">
                                {data.durationMinutes} min
                            </span>
                        </>
                    )}
                </div>

                {/* Mobile row 2 — status + country */}
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0 md:hidden">
                    <AiringStatusBadge status={data.airingStatus} />
                    {data.country && (
                        <span className="text-[10px] text-muted-foreground/50">{data.country}</span>
                    )}
                </div>

                {/* Mobile row 3 — genres */}
                {data.genre && data.genre.length > 0 && (
                    <p className="mt-0.5 truncate text-[10px] text-muted-foreground/40 md:hidden">
                        {data.genre.slice(0, 3).join(" · ")}
                    </p>
                )}
            </div>

            {/* Year + Country — md+ */}
            <div className="hidden w-[72px] shrink-0 text-right md:block">
                {data.year && (
                    <p className="font-mono tabular-nums text-[11px] text-foreground/60">
                        {data.year}
                    </p>
                )}
                {data.country && (
                    <p className="text-muted-foreground/50 mt-0.5 truncate text-[11px]">
                        {data.country}
                    </p>
                )}
            </div>

            {/* Episodes + Duration — md+ */}
            <div className="hidden w-[68px] shrink-0 text-right md:block">
                {data.episodeCount != null && (
                    <p className="text-[11px] text-muted-foreground/70">{data.episodeCount} eps</p>
                )}
                {data.durationMinutes != null && (
                    <p className="text-muted-foreground/40 mt-0.5 text-[11px]">
                        {data.durationMinutes} min
                    </p>
                )}
            </div>

            {/* Media type — md+ */}
            <div className="hidden w-[56px] shrink-0 text-right md:block">
                <span className="text-muted-foreground/50 text-[11px] font-medium">
                    {MEDIA_TYPE_LABELS[data.mediaType]}
                </span>
            </div>

            {/* Status — md+ */}
            <div className="hidden w-[90px] shrink-0 md:flex md:justify-end">
                <AiringStatusBadge status={data.airingStatus} />
            </div>

            {/* Actions */}
            {actions && <div className="shrink-0">{actions}</div>}
        </div>
    );
}
