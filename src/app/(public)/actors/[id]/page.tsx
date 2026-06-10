"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, ChevronRight, Film, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActorDetail } from "@/hooks/use-catalog";
import { Skeleton } from "@/components/ui/skeleton";
import { MEDIA_TYPE_LABELS } from "@/lib/types";
import type { FilmographyEntry } from "@/lib/types";

// ── Utilities ────────────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as const;

function calcAge(birthdate: string | null): number | null {
    if (!birthdate) return null;
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function formatYear(dateStr: string | null): string | null {
    if (!dateStr) return null;
    return new Date(dateStr).getFullYear().toString();
}

const PORTRAIT_GRADIENTS = [
    "from-violet-400 via-purple-500 to-fuchsia-600",
    "from-rose-400 via-pink-500 to-rose-600",
    "from-sky-400 via-blue-500 to-indigo-600",
    "from-amber-400 via-orange-500 to-rose-500",
    "from-emerald-400 via-teal-500 to-cyan-600",
    "from-fuchsia-400 via-violet-500 to-purple-600",
];

const POSTER_GRADIENTS = [
    "from-violet-500 to-purple-700",
    "from-rose-500 to-pink-700",
    "from-sky-500 to-blue-700",
    "from-amber-500 to-orange-700",
    "from-emerald-500 to-teal-700",
    "from-fuchsia-500 to-violet-700",
];

function gradientFor(seed: string, palette: string[]) {
    return palette[seed.charCodeAt(0) % palette.length];
}

function initialsFor(name: string) {
    return name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
}

const ROLE_BADGE: Record<FilmographyEntry["role"], string> = {
    main:       "bg-violet-500/80 text-white",
    supporting: "bg-sky-500/80 text-white",
    guest:      "bg-amber-400/80 text-white",
};

const ROLE_LABEL: Record<FilmographyEntry["role"], string> = {
    main:       "Main",
    supporting: "Supporting",
    guest:      "Guest",
};

// ── Filmography card ─────────────────────────────────────────────────────────

function FilmCard({ entry, index }: { entry: FilmographyEntry; index: number }) {
    const gradient = gradientFor(entry.title, POSTER_GRADIENTS);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.5), ease }}
        >
            <Link href={`/catalog/${entry.catalog_id}`} className="group block">
                <div className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-sm transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-black/15 dark:group-hover:shadow-black/40">

                    {/* Poster or gradient fallback */}
                    {entry.poster_url ? (
                        <Image
                            src={entry.poster_url}
                            alt={entry.title}
                            fill
                            sizes="(min-width: 1024px) 16vw, (min-width: 768px) 20vw, (min-width: 640px) 25vw, 33vw"
                            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                        />
                    ) : (
                        <div className={cn("absolute inset-0 bg-linear-to-br", gradient)}>
                            <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-5xl italic text-white/10 select-none">
                                {initialsFor(entry.title)}
                            </span>
                        </div>
                    )}

                    {/* Permanent bottom overlay — title + year */}
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 via-black/40 to-transparent px-2.5 pb-2.5 pt-10 transition-opacity duration-300 group-hover:opacity-0">
                        <p className="font-display truncate text-[12px] italic leading-tight text-white">
                            {entry.title}
                        </p>
                        {entry.year && (
                            <p className="mt-0.5 text-[9px] tabular-nums text-white/50">
                                {entry.year}
                            </p>
                        )}
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-black/72 p-3 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                        {/* Role badge */}
                        <div className="mb-2">
                            <span className={cn(
                                "rounded-md px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider",
                                ROLE_BADGE[entry.role],
                            )}>
                                {ROLE_LABEL[entry.role]}
                            </span>
                        </div>

                        <p className="font-display line-clamp-2 text-[13px] italic leading-snug text-white">
                            {entry.title}
                        </p>

                        {entry.character_name && (
                            <p className="mt-1 text-[10px] text-white/60">
                                as {entry.character_name}
                            </p>
                        )}

                        <div className="mt-1.5 flex items-center justify-between">
                            {entry.year && (
                                <span className="font-mono text-[10px] tabular-nums text-white/40">
                                    {entry.year}
                                </span>
                            )}
                            <span className="text-[10px] font-medium text-violet-300/90">
                                View show →
                            </span>
                        </div>
                    </div>

                    {/* Media type chip — top right */}
                    <div className="absolute right-2 top-2">
                        <span className="rounded-lg bg-black/35 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white/65 backdrop-blur-sm">
                            {MEDIA_TYPE_LABELS[entry.media_type]}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ── Skeleton states ──────────────────────────────────────────────────────────

function HeroSkeleton() {
    return (
        <div className="flex flex-col gap-8 md:flex-row md:gap-12">
            <Skeleton className="aspect-[3/4] w-full rounded-2xl md:w-[220px] md:shrink-0" />
            <div className="flex-1 space-y-4 pt-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-14 w-3/4" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-24 rounded-lg" />
                    <Skeleton className="h-6 w-20 rounded-lg" />
                </div>
                <Skeleton className="h-0.5 w-24" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
            </div>
        </div>
    );
}

function FilmGridSkeleton() {
    return (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 md:gap-3 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[2/3] rounded-xl" />
            ))}
        </div>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────────

interface Props {
    params: Promise<{ id: string }>;
}

export default function ActorDetailPage({ params }: Props) {
    const { id } = use(params);
    const { data: actor, isLoading } = useActorDetail(id);
    const [bioExpanded, setBioExpanded] = useState(false);

    const age = actor ? calcAge(actor.birthdate) : null;
    const birthYear = actor ? formatYear(actor.birthdate) : null;

    const BIO_THRESHOLD = 600;
    const bioText = actor?.biography ?? "";
    const isLongBio = bioText.length > BIO_THRESHOLD;
    const displayedBio = isLongBio && !bioExpanded
        ? bioText.slice(0, BIO_THRESHOLD).trimEnd() + "…"
        : bioText;

    const sortedFilmography = actor
        ? [...actor.filmography].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
        : [];

    // Not found
    if (!isLoading && !actor) {
        return (
            <div className="container py-28 text-center">
                <p className="font-display text-2xl italic text-muted-foreground">
                    Actor not found.
                </p>
                <Link
                    href="/actors"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm text-violet-600 hover:underline dark:text-violet-400"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to actors
                </Link>
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden">

            {/* ── Atmospheric blurred photo wash ────────────────────── */}
            {actor?.profile_image_url && (
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
                    <Image
                        src={actor.profile_image_url}
                        alt=""
                        fill
                        sizes="100vw"
                        className="scale-110 object-cover object-top opacity-[0.045] blur-3xl dark:opacity-[0.065]"
                        priority
                    />
                </div>
            )}

            {/* ── Background blobs ──────────────────────────────────── */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-40 -right-48 h-[580px] w-[580px] rounded-full bg-linear-to-bl from-violet-200/28 via-pink-200/14 to-transparent blur-3xl dark:from-violet-800/10 dark:via-pink-800/5 dark:to-transparent"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute top-80 -left-32 h-80 w-80 rounded-full bg-linear-to-tr from-fuchsia-200/18 via-violet-200/10 to-transparent blur-3xl dark:from-fuchsia-900/7 dark:via-violet-900/4 dark:to-transparent"
            />

            <div className="container py-10 md:py-14">

                {/* ── Breadcrumb ────────────────────────────────────── */}
                <motion.nav
                    className="mb-10 flex items-center gap-1.5 text-[12px] text-muted-foreground/55"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                >
                    <Link href="/community" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                        Community
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/actors" className="transition-colors hover:text-violet-600 dark:hover:text-violet-400">
                        Actors
                    </Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-muted-foreground/35">
                        {isLoading ? "…" : (actor?.name ?? "")}
                    </span>
                </motion.nav>

                {/* ── Hero section ──────────────────────────────────── */}
                {isLoading ? (
                    <HeroSkeleton />
                ) : actor ? (
                    <motion.div
                        className="flex flex-col gap-8 md:flex-row md:gap-12 lg:gap-16"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease }}
                    >
                        {/* Portrait */}
                        <motion.div
                            className="w-full shrink-0 md:w-[220px] lg:w-[260px]"
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.05, ease }}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/35">
                                {actor.profile_image_url ? (
                                    <Image
                                        src={actor.profile_image_url}
                                        alt={actor.name}
                                        fill
                                        sizes="(min-width: 1024px) 260px, (min-width: 768px) 220px, 90vw"
                                        className="object-cover object-top"
                                        priority
                                    />
                                ) : (
                                    <div className={cn(
                                        "absolute inset-0 bg-linear-to-br",
                                        gradientFor(actor.name, PORTRAIT_GRADIENTS),
                                    )}>
                                        <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-display text-[7rem] italic text-white/[0.12] select-none">
                                            {initialsFor(actor.name)[0]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Info column */}
                        <div className="min-w-0 flex-1">

                            {/* Native name */}
                            {actor.native_name && (
                                <motion.p
                                    className="mb-1 text-[13px] text-muted-foreground/60"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    {actor.native_name}
                                </motion.p>
                            )}

                            {/* Name — hero typography */}
                            <motion.h1
                                className="font-display bg-linear-to-r from-violet-600 via-fuchsia-500 to-rose-500 bg-clip-text text-[2.6rem] italic leading-[1.05] text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-rose-400 md:text-[3.2rem] lg:text-[3.8rem]"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.12, ease }}
                            >
                                {actor.name}
                            </motion.h1>

                            {/* Meta chips */}
                            <motion.div
                                className="mt-4 flex flex-wrap items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.35, delay: 0.2 }}
                            >
                                {actor.nationality && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-background/60 px-2.5 py-1 text-[12px] text-muted-foreground ring-1 ring-border/50 backdrop-blur-sm dark:bg-muted/30">
                                        <MapPin className="h-3 w-3 opacity-50" />
                                        {actor.nationality}
                                    </span>
                                )}
                                {birthYear && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-background/60 px-2.5 py-1 text-[12px] text-muted-foreground ring-1 ring-border/50 backdrop-blur-sm dark:bg-muted/30">
                                        <Calendar className="h-3 w-3 opacity-50" />
                                        b.{" "}{birthYear}
                                        {age !== null && (
                                            <span className="text-muted-foreground/50">· {age} yrs</span>
                                        )}
                                    </span>
                                )}
                                {sortedFilmography.length > 0 && (
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-background/60 px-2.5 py-1 text-[12px] text-muted-foreground ring-1 ring-border/50 backdrop-blur-sm dark:bg-muted/30">
                                        <Film className="h-3 w-3 opacity-50" />
                                        {sortedFilmography.length} {sortedFilmography.length === 1 ? "credit" : "credits"}
                                    </span>
                                )}
                            </motion.div>

                            {/* Gradient accent rule */}
                            <motion.div
                                className="my-5 h-0.5 w-24 rounded-full"
                                style={{ transformOrigin: "left", background: "linear-gradient(90deg, hsl(262 83% 58% / 0.8), hsl(340 75% 62% / 0.4), transparent)" }}
                                initial={{ opacity: 0, scaleX: 0 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                transition={{ duration: 0.4, delay: 0.25, ease }}
                            />

                            {/* Biography */}
                            {bioText ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.28, ease }}
                                >
                                    <div className="relative">
                                        {/* Decorative opening quote */}
                                        <span
                                            className="pointer-events-none absolute -top-3 -left-1 select-none font-display text-[56px] leading-none text-violet-400/20 dark:text-violet-300/15"
                                            aria-hidden
                                        >
                                            &ldquo;
                                        </span>
                                        <p className="relative pl-1 text-sm leading-[1.85] text-muted-foreground md:text-[15px]">
                                            {displayedBio}
                                        </p>
                                    </div>
                                    {isLongBio && (
                                        <button
                                            onClick={() => setBioExpanded((e) => !e)}
                                            className="mt-2 text-[12px] font-medium text-violet-600 transition-colors hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                                        >
                                            {bioExpanded ? "Show less" : "Read more"}
                                        </button>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.p
                                    className="text-sm italic text-muted-foreground/40"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.28 }}
                                >
                                    No biography available.
                                </motion.p>
                            )}
                        </div>
                    </motion.div>
                ) : null}

                {/* ── Filmography section ───────────────────────────── */}
                {(isLoading || sortedFilmography.length > 0) && (
                    <motion.section
                        className="mt-16 md:mt-20"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.35, ease }}
                    >
                        {/* Section header */}
                        <div className="mb-7">
                            <div className="flex items-baseline gap-3">
                                <h2 className="font-hand text-2xl text-foreground/90 md:text-3xl">
                                    Filmography
                                </h2>
                                {!isLoading && (
                                    <span className="font-mono text-sm tabular-nums text-muted-foreground/50">
                                        {sortedFilmography.length}
                                    </span>
                                )}
                            </div>
                            <div
                                className="mt-2 h-0.5 w-20 rounded-full"
                                style={{ background: "linear-gradient(90deg, hsl(262 83% 58% / 0.7), hsl(340 75% 62% / 0.35), transparent)" }}
                            />
                        </div>

                        {isLoading ? (
                            <FilmGridSkeleton />
                        ) : (
                            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 md:gap-3 lg:grid-cols-6">
                                {sortedFilmography.map((entry, i) => (
                                    <FilmCard key={entry.cast_id} entry={entry} index={i} />
                                ))}
                            </div>
                        )}
                    </motion.section>
                )}

                {/* ── Footer nav ────────────────────────────────────── */}
                <motion.div
                    className="mt-14 border-t border-border/40 pt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                >
                    <Link
                        href="/actors"
                        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        All actors
                    </Link>
                </motion.div>

            </div>
        </div>
    );
}
