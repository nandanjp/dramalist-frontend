"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    ChevronDown,
    ChevronUp,
    Globe,
    ImageIcon,
    Lock,
    MoreHorizontal,
    Pencil,
    Trash2,
    TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate, formatDistanceToNow } from "@/lib/date";
import { useCatalogEntry } from "@/hooks/use-catalog";
import { useDeleteReview } from "@/hooks/use-reviews";
import type { Review } from "@/lib/types";
import { RatingStars } from "@/components/reviews/rating-stars";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Content is "long" if the HTML has enough chars to exceed ~5 visual lines
const LONG_THRESHOLD = 500;

interface ReviewEntryProps {
    review: Review;
    index: number;
}

function PosterPlaceholder() {
    return (
        <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
            <ImageIcon className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
        </div>
    );
}

export function ReviewEntry({ review, index }: ReviewEntryProps) {
    const [expanded, setExpanded] = useState(false);
    const { data: catalog, isLoading: posterLoading } = useCatalogEntry(review.catalog_id);
    const { mutate: deleteReview, isPending: deleting } = useDeleteReview();

    const posterUrl = catalog?.poster_url;
    const isLong = (review.content_html ?? review.content ?? "").length > LONG_THRESHOLD;
    const hasContent = !!(review.content_html || review.content);

    return (
        <motion.article
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.35,
                delay: Math.min(index * 0.06, 0.4),
                ease: [0.22, 1, 0.36, 1],
            }}
            className="group relative flex gap-4 py-7 md:gap-6"
        >
            {/* ── Poster ──────────────────────────────────────────── */}
            <Link
                href={`/catalog/${review.catalog_id}`}
                className="shrink-0 self-start"
                tabIndex={-1}
                aria-hidden
            >
                <div className="relative w-[72px] overflow-hidden rounded-xl shadow-sm transition-transform duration-300 hover:scale-[1.03] md:w-[96px]">
                    <div className="relative aspect-2/3">
                        {posterLoading ? (
                            <div className="h-full w-full animate-pulse bg-zinc-100 dark:bg-zinc-800" />
                        ) : posterUrl ? (
                            <Image
                                src={posterUrl}
                                alt={review.catalog_title ?? ""}
                                fill
                                sizes="96px"
                                className="object-cover"
                            />
                        ) : (
                            <PosterPlaceholder />
                        )}
                    </div>
                    {/* Violet accent line — brand identity on each entry */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-violet-500" />
                </div>
            </Link>

            {/* ── Content column ───────────────────────────────────── */}
            <div className="min-w-0 flex-1">
                {/* Title + actions row */}
                <div className="flex items-start justify-between gap-3">
                    <Link href={`/catalog/${review.catalog_id}`} className="min-w-0">
                        <h2 className="font-display line-clamp-2 text-base italic leading-snug text-foreground transition-colors hover:text-violet-600 dark:hover:text-violet-400 md:text-lg">
                            {review.catalog_title ?? "Unknown title"}
                        </h2>
                    </Link>

                    {/* Actions dropdown — hover-revealed */}
                    <div className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-36">
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href={`/catalog/${review.catalog_id}`}
                                            className="flex items-center gap-2"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                            Edit review
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive flex items-center gap-2"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Your review of{" "}
                                        <span className="font-medium text-foreground">
                                            {review.catalog_title}
                                        </span>{" "}
                                        will be permanently removed.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            deleteReview({
                                                id: review.id,
                                                catalogID: review.catalog_id,
                                            })
                                        }
                                        disabled={deleting}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Meta row — rating + date + badges */}
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <RatingStars rating={review.rating} />
                    <span className="text-muted-foreground/30 hidden text-[11px] sm:inline">·</span>
                    <div className="flex items-center gap-1.5">
                        <time
                            dateTime={review.created_at}
                            title={formatDate(review.created_at)}
                            className="font-mono text-[11px] tabular-nums text-muted-foreground/60"
                        >
                            {formatDistanceToNow(review.created_at)}
                        </time>
                        {review.is_public ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/40">
                                <Globe className="h-2.5 w-2.5" />
                                Public
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/40">
                                <Lock className="h-2.5 w-2.5" />
                                Private
                            </span>
                        )}
                    </div>
                    {review.contains_spoilers && (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                            <TriangleAlert className="h-2.5 w-2.5" />
                            Spoilers
                        </span>
                    )}
                </div>

                {/* Review body */}
                {hasContent ? (
                    <div className="mt-4">
                        <div
                            className={cn(
                                "review-prose relative min-w-0",
                                !expanded &&
                                    isLong &&
                                    "max-h-40 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]",
                            )}
                        >
                            {review.content_html ? (
                                <div
                                    dangerouslySetInnerHTML={{ __html: review.content_html }}
                                />
                            ) : (
                                <p>{review.content}</p>
                            )}
                        </div>

                        {isLong && (
                            <button
                                onClick={() => setExpanded((e) => !e)}
                                className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                            >
                                {expanded ? (
                                    <>
                                        <ChevronUp className="h-3 w-3" />
                                        Show less
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-3 w-3" />
                                        Read full review
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-muted-foreground/40 mt-4 text-sm italic">
                        Rating only — no written review.
                    </p>
                )}
            </div>
        </motion.article>
    );
}
