"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useActors } from "@/hooks/use-catalog";
import { SearchInput } from "@/components/shared/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import type { Actor } from "@/lib/types";

const ease = [0.22, 1, 0.36, 1] as const;

const NATIONALITIES = [
    "Korean",
    "Japanese",
    "Chinese",
    "Taiwanese",
    "Thai",
    "Filipino",
];

// Deterministic gradient per actor — seeded by name char code
const PORTRAIT_GRADIENTS = [
    ["from-violet-400", "via-purple-500",  "to-fuchsia-600"],
    ["from-rose-400",   "via-pink-500",    "to-rose-600"],
    ["from-sky-400",    "via-blue-500",    "to-indigo-600"],
    ["from-amber-400",  "via-orange-500",  "to-rose-500"],
    ["from-emerald-400","via-teal-500",    "to-cyan-600"],
    ["from-fuchsia-400","via-violet-500",  "to-purple-600"],
];

function gradientFor(name: string) {
    const idx = name.charCodeAt(0) % PORTRAIT_GRADIENTS.length;
    return PORTRAIT_GRADIENTS[idx].join(" ");
}

function initialsFor(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

// ── Actor portrait card ───────────────────────────────────────────────────────

function ActorPortraitCard({ actor, index }: { actor: Actor; index: number }) {
    const gradient = gradientFor(actor.name);
    const initials = initialsFor(actor.name);
    const hasBio = !!actor.biography;

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, delay: Math.min(index * 0.045, 0.45), ease }}
        >
            <Link href={`/actors/${actor.id}`} className="group block">
                {/* Portrait frame */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-black/10 dark:group-hover:shadow-black/40">

                    {/* Photo or gradient fallback */}
                    {actor.profile_image_url ? (
                        <Image
                            src={actor.profile_image_url}
                            alt={actor.name}
                            fill
                            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                        />
                    ) : (
                        <div className={cn("absolute inset-0 bg-linear-to-br", gradient)}>
                            {/* Large ghost initial */}
                            <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[5rem] italic text-white/[0.12] select-none">
                                {initials[0]}
                            </span>
                        </div>
                    )}

                    {/* Permanent bottom name gradient */}
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/45 to-transparent px-3 pb-3 pt-12 transition-opacity duration-300 group-hover:opacity-0">
                        <p className="font-display truncate text-sm italic leading-tight text-white md:text-[15px]">
                            {actor.name}
                        </p>
                        {actor.nationality && (
                            <p className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-widest text-white/50">
                                {actor.nationality}
                            </p>
                        )}
                    </div>

                    {/* Hover overlay — bio or just name centred */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-black/65 p-4 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        {actor.native_name && (
                            <p className="mb-1 text-[10px] font-medium text-white/45">
                                {actor.native_name}
                            </p>
                        )}
                        <p className="font-display text-sm italic leading-snug text-white md:text-base">
                            {actor.name}
                        </p>
                        {actor.nationality && (
                            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-white/50">
                                {actor.nationality}
                            </p>
                        )}
                        {hasBio && (
                            <p className="mt-2.5 line-clamp-4 text-[11px] leading-relaxed text-white/70">
                                {actor.biography}
                            </p>
                        )}
                        <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-violet-300/80">
                            <span>View profile</span>
                            <span className="translate-x-0 transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </div>
                    </div>

                    {/* Native name chip — top left, visible when no hover */}
                    {actor.native_name && (
                        <div className="absolute left-2.5 top-2.5 opacity-100 transition-opacity duration-200 group-hover:opacity-0">
                            <span className="rounded-lg bg-black/30 px-2 py-0.5 text-[9px] text-white/60 backdrop-blur-sm">
                                {actor.native_name}
                            </span>
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function ActorCardSkeleton({ index }: { index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className="aspect-[3/4] overflow-hidden rounded-2xl"
        >
            <Skeleton className="h-full w-full" />
        </motion.div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ActorsPage() {
    const [inputQ, setInputQ]       = useState("");
    const [nationality, setNat]     = useState("");
    const [page, setPage]           = useState(1);

    const q = useDebounce(inputQ, 320);

    const { data, isLoading, isFetching } = useActors({
        q: q || undefined,
        nationality: nationality || undefined,
        page,
        limit: 20,
    });

    const actors = data?.actors ?? [];
    const total  = data?.total  ?? 0;
    const totalPages = data ? Math.ceil(data.total / data.limit) : 1;

    function handleNat(nat: string) {
        setNat((prev) => (prev === nat ? "" : nat));
        setPage(1);
    }

    function clearAll() {
        setInputQ("");
        setNat("");
        setPage(1);
    }

    const hasFilters = !!inputQ || !!nationality;

    return (
        <div className="relative overflow-hidden">

            {/* ── Background atmosphere ─────────────────────────────── */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-40 -right-48 h-[640px] w-[640px] rounded-full bg-linear-to-bl from-violet-200/30 via-pink-200/15 to-transparent blur-3xl dark:from-violet-800/10 dark:via-pink-800/5 dark:to-transparent"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute top-72 -left-32 h-96 w-96 rounded-full bg-linear-to-tr from-fuchsia-200/20 via-violet-200/10 to-transparent blur-3xl dark:from-fuchsia-900/8 dark:via-violet-900/4 dark:to-transparent"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-linear-to-tl from-rose-200/15 via-pink-200/10 to-transparent blur-3xl dark:from-rose-900/6 dark:to-transparent"
            />

            <div className="container py-12 md:py-16">

                {/* ── Page header ───────────────────────────────────── */}
                <motion.div
                    className="mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease }}
                >
                    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

                        {/* Title + count */}
                        <div className="relative">
                            {/* Decorative quote — backdrop */}
                            <span
                                className="pointer-events-none absolute -top-6 -left-2 select-none font-display text-[100px] leading-none text-violet-400/[0.055] dark:text-violet-300/[0.06] md:text-[140px]"
                                aria-hidden
                            >
                                &ldquo;
                            </span>

                            <div className="relative">
                                <motion.div
                                    className="mb-3 flex items-center gap-2.5"
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.35, delay: 0.1, ease }}
                                >
                                    <div
                                        className="h-px w-10 rounded-full"
                                        style={{ background: "linear-gradient(90deg, hsl(262 83% 58%), hsl(340 75% 62%))" }}
                                    />
                                    <span className="font-hand text-[13px] tracking-wide text-rose-400/80 dark:text-rose-300/60">
                                        the people behind the stories
                                    </span>
                                </motion.div>

                                <motion.h1
                                    className="leading-[0.95]"
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.12, ease }}
                                >
                                    <span className="font-hand block text-[2.6rem] text-foreground/85 md:text-[3.2rem]">
                                        The
                                    </span>
                                    <span className="font-display -mt-1.5 block bg-linear-to-r from-violet-600 via-fuchsia-500 to-rose-500 bg-clip-text text-[2.6rem] italic text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-rose-400 md:text-[3.2rem]">
                                        Cast
                                    </span>
                                </motion.h1>

                                <motion.div
                                    className="mt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.22, ease }}
                                >
                                    <div
                                        className="mb-3 h-0.5 w-24 rounded-full"
                                        style={{ background: "linear-gradient(90deg, hsl(262 83% 58% / 0.85), hsl(340 75% 62% / 0.4), transparent)" }}
                                    />
                                    {data && !isLoading && (
                                        <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-br from-violet-500 to-rose-500 opacity-70" />
                                            <span className="font-semibold tabular-nums text-foreground">
                                                {total.toLocaleString()}
                                            </span>
                                            {total === 1 ? "actor" : "actors"} in the catalogue
                                        </p>
                                    )}
                                </motion.div>
                            </div>
                        </div>

                        {/* Search input */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.18, ease }}
                            className="w-full md:w-72"
                        >
                            <SearchInput
                                value={inputQ}
                                onChange={(v) => { setInputQ(v); setPage(1); }}
                                placeholder="Search by name…"
                                isLoading={isFetching}
                            />
                        </motion.div>
                    </div>

                    {/* Nationality filter chips */}
                    <motion.div
                        className="mt-6 flex flex-wrap items-center gap-2"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: 0.25, ease }}
                    >
                        {["All", ...NATIONALITIES].map((nat) => {
                            const active = nat === "All" ? nationality === "" : nationality === nat;
                            return (
                                <button
                                    key={nat}
                                    onClick={() => nat === "All" ? (setNat(""), setPage(1)) : handleNat(nat)}
                                    className={cn(
                                        "rounded-full border px-3.5 py-1 text-[11px] font-medium transition-all duration-200",
                                        active
                                            ? "border-violet-500/70 bg-violet-500/10 text-violet-600 dark:border-violet-400/60 dark:text-violet-400"
                                            : "border-border/60 text-muted-foreground hover:border-violet-400/40 hover:text-foreground",
                                    )}
                                >
                                    {nat}
                                </button>
                            );
                        })}

                        {hasFilters && (
                            <button
                                onClick={clearAll}
                                className="ml-1 flex items-center gap-1 text-[11px] text-muted-foreground/60 transition-colors hover:text-foreground"
                            >
                                <X className="h-3 w-3" />
                                Clear
                            </button>
                        )}
                    </motion.div>
                </motion.div>

                {/* ── Content ───────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {isLoading ? (
                        <motion.div
                            key="skeleton"
                            className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {Array.from({ length: 15 }).map((_, i) => (
                                <ActorCardSkeleton key={i} index={i} />
                            ))}
                        </motion.div>
                    ) : actors.length === 0 ? (
                        <motion.div
                            key="empty"
                            className="py-28 text-center"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, ease }}
                        >
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
                                <Users className="h-7 w-7 text-muted-foreground/35" />
                            </div>
                            <p className="font-display text-xl italic text-muted-foreground">
                                No actors found.
                            </p>
                            {hasFilters && (
                                <button
                                    onClick={clearAll}
                                    className="mt-3 text-sm text-violet-600 hover:underline dark:text-violet-400"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            className={cn(
                                "grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5",
                                isFetching && "pointer-events-none opacity-60 transition-opacity duration-200",
                            )}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {actors.map((actor, i) => (
                                <ActorPortraitCard key={actor.id} actor={actor} index={i} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Pagination ────────────────────────────────────── */}
                {data && totalPages > 1 && (
                    <motion.div
                        className="mt-12 flex items-center justify-center gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                            className="rounded-xl border border-border/60 px-5 py-2 text-sm text-muted-foreground transition-all hover:border-violet-400/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{page}</span>
                            {" / "}
                            <span className="font-semibold text-foreground">{totalPages}</span>
                        </span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="rounded-xl border border-border/60 px-5 py-2 text-sm text-muted-foreground transition-all hover:border-violet-400/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-35"
                        >
                            Next
                        </button>
                    </motion.div>
                )}

            </div>
        </div>
    );
}
