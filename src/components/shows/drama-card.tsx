"use client";

import Link from "next/link";
import { ImageIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ProgressiveImage } from "@/components/shared/progressive-image";
import type { AiringStatus, MediaType } from "@/lib/types";
import { MEDIA_TYPE_LABELS } from "@/lib/types";

export interface DramaCardData {
    /** catalog entry id — used for /catalog/:id href */
    id: string;
    title: string;
    originalTitle?: string | null;
    synopsis?: string | null;
    posterUrl?: string | null;
    year?: number | null;
    country?: string | null;
    airingStatus: AiringStatus;
    mediaType: MediaType;
    genre?: string[];
    episodeCount?: number | null;
    durationMinutes?: number | null;
}

interface DramaCardProps {
    data: DramaCardData;
    /**
     * Overlay rendered in the bottom-left of the poster.
     * Use <InListIndicator> or any other badge here.
     */
    badge?: React.ReactNode;
    /** Called when the quick-add overlay button is pressed */
    onAddToList?: () => void;
    className?: string;
}


function PosterFallback() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <ImageIcon className="h-7 w-7 text-zinc-300 dark:text-zinc-600" />
        </div>
    );
}

export function DramaCard({ data, badge, onAddToList, className }: DramaCardProps) {
    return (
        <div className={cn("group flex flex-col", className)}>
            {/* ── Poster ─────────────────────────────────────────── */}
            <Link href={`/catalog/${data.id}`} className="block">
                <div className="relative aspect-2/3 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                    {data.posterUrl ? (
                        <ProgressiveImage
                            src={data.posterUrl}
                            alt={data.title}
                            className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                            fallback={<PosterFallback />}
                        />
                    ) : (
                        <PosterFallback />
                    )}

                    {/* Year — top left pill */}
                    {data.year && data.posterUrl && (
                        <span className="absolute left-2 top-2 z-10 rounded-full bg-black/50 px-1.5 py-0.5 font-mono text-[10px] tabular-nums tracking-wider text-white/90 backdrop-blur-sm">
                            {data.year}
                        </span>
                    )}

                    {/* Media type — top right */}
                    <div className="absolute right-2 top-2 z-10">
                        <span className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-sm">
                            {MEDIA_TYPE_LABELS[data.mediaType]}
                        </span>
                    </div>

                    {/* Bottom gradient */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/65 to-transparent" />

                    {/* Genres — revealed on hover inside bottom gradient */}
                    {data.genre && data.genre.length > 0 && (
                        <div className="absolute bottom-4 left-2 right-2 z-10 flex flex-wrap gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            {data.genre.slice(0, 3).map((g) => (
                                <span
                                    key={g}
                                    className="rounded-sm bg-white/15 px-1.5 py-0.5 text-[9px] font-medium text-white/90 backdrop-blur-sm"
                                >
                                    {g}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Badge slot — bottom-left overlay */}
                    {badge && <div className="absolute bottom-2 left-2 z-10">{badge}</div>}

                    {/* Quick-add overlay — appears on hover */}
                    {onAddToList && (
                        <div className="absolute inset-0 flex items-end justify-end p-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onAddToList();
                                }}
                                className="bg-background/90 h-7 w-7 rounded-full shadow-md backdrop-blur-sm transition-transform duration-150 hover:scale-110"
                                aria-label={`Add ${data.title} to list`}
                            >
                                <Plus className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    )}

                </div>
            </Link>

            {/* ── Metadata ────────────────────────────────────────── */}
            <div className="mt-2.5 px-0.5">
                <Link href={`/catalog/${data.id}`}>
                    <p className="font-display line-clamp-2 text-[13px] italic leading-snug text-foreground transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                        {data.title}
                    </p>
                </Link>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    {(!data.posterUrl && data.year) && (
                        <span className="font-mono text-[11px] text-muted-foreground/60">
                            {data.year}
                        </span>
                    )}
                    {data.country && (
                        <span className="truncate text-[11px] text-muted-foreground/50">
                            {data.country}
                        </span>
                    )}
                    {!data.posterUrl && data.genre && data.genre.length > 0 && (
                        <span className="truncate text-[11px] text-muted-foreground/40">
                            {data.genre.slice(0, 2).join(" · ")}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
