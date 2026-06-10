"use client";

import { Film } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { DramaCard } from "@/components/shows/drama-card";
import { DramaListItem } from "@/components/shows/drama-list-item";
import type { CatalogEntry } from "@/lib/types";
import type { ViewMode } from "@/components/shared/view-toggle";

interface CatalogGridProps {
    entries: CatalogEntry[] | undefined;
    isLoading: boolean;
    view: ViewMode;
}

// ── Animation variants ────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

const gridContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
};

const cardItem = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease } },
};

// ── Skeletons ─────────────────────────────────────────────────────────────────

function GridSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="aspect-2/3 rounded-xl" />
                    <Skeleton className="h-[13px] w-4/5 rounded" />
                    <Skeleton className="h-[11px] w-2/5 rounded" />
                </div>
            ))}
        </div>
    );
}

function ListSkeleton() {
    return (
        <div className="bg-card/40 border-border/60 divide-border/60 divide-y overflow-hidden rounded-xl border">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <Skeleton className="h-16 w-11 shrink-0 rounded-lg" />
                    <div className="flex-1 space-y-1.5 pt-0.5">
                        <Skeleton className="h-[14px] w-3/5 rounded" />
                        <Skeleton className="h-[11px] w-4/5 rounded" />
                        <Skeleton className="mt-1 h-[10px] w-2/5 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ── Grid ──────────────────────────────────────────────────────────────────────

export function CatalogGrid({ entries, isLoading, view }: CatalogGridProps) {
    if (isLoading) {
        return view === "grid" ? <GridSkeleton /> : <ListSkeleton />;
    }

    if (!entries?.length) {
        return (
            <EmptyState
                icon={Film}
                title="No titles found"
                description="Try adjusting your filters or search query."
            />
        );
    }

    if (view === "list") {
        return (
            <div
                key={entries[0]?.id}
                className="overflow-hidden rounded-xl border border-border/60 bg-card/40"
            >
                {entries.map((entry, index) => (
                    <motion.div
                        key={entry.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, ease, delay: index * 0.03 }}
                        className={cn(
                            "relative transition-colors hover:bg-muted/50 dark:hover:bg-muted/30",
                            index > 0 && "border-t border-border/60",
                        )}
                    >
                        {/* Sequential index — watermark */}
                        <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 select-none font-mono text-[10px] tabular-nums text-muted-foreground/20">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <DramaListItem
                            data={{
                                id: entry.id,
                                title: entry.title,
                                originalTitle: entry.original_title,
                                synopsis: entry.synopsis,
                                posterUrl: entry.poster_url,
                                year: entry.year,
                                country: entry.country,
                                airingStatus: entry.airing_status,
                                mediaType: entry.media_type,
                                genre: entry.genre,
                                episodeCount: entry.episode_count,
                                durationMinutes: entry.duration_minutes,
                            }}
                            className="py-3 pl-8 pr-4"
                        />
                    </motion.div>
                ))}
            </div>
        );
    }

    return (
        <motion.div
            key={entries[0]?.id}
            className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5"
            variants={gridContainer}
            initial="hidden"
            animate="visible"
        >
            {entries.map((entry) => (
                <motion.div key={entry.id} variants={cardItem}>
                    <DramaCard
                        data={{
                            id: entry.id,
                            title: entry.title,
                            originalTitle: entry.original_title,
                            posterUrl: entry.poster_url,
                            year: entry.year,
                            country: entry.country,
                            airingStatus: entry.airing_status,
                            mediaType: entry.media_type,
                            genre: entry.genre,
                        }}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
