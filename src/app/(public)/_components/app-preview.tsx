"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import { BarChart2, ListChecks, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Shared card header ────────────────────────────────────────────────────────

function PreviewCardHeader({
    label,
    icon,
    meta,
    accent,
}: {
    label: string;
    icon: React.ReactNode;
    meta?: React.ReactNode;
    accent?: string;
}) {
    return (
        <CardHeader
            className={cn(
                "border-border/40 flex-row items-center justify-between space-y-0 border-b px-4 py-3",
                accent,
            )}
        >
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground/70">{icon}</span>
                <span className="text-muted-foreground/60 text-[11px] font-semibold tracking-widest uppercase">
                    {label}
                </span>
            </div>
            {meta && <span className="text-muted-foreground/50 text-[11px]">{meta}</span>}
        </CardHeader>
    );
}

// ── My List card ──────────────────────────────────────────────────────────────

const LIST_ENTRIES = [
    {
        title: "Goblin",
        original: "도깨비",
        genre: "Fantasy",
        status: "completed",
        rating: 9.8,
        watched: 16,
        total: 16,
    },
    {
        title: "Alchemy of Souls",
        original: "환혼",
        genre: "Fantasy",
        status: "watching",
        rating: null,
        watched: 8,
        total: 30,
    },
    {
        title: "Reply 1988",
        original: "응답하라 1988",
        genre: "Family",
        status: "completed",
        rating: 9.5,
        watched: 20,
        total: 20,
    },
    {
        title: "Signal",
        original: "시그널",
        genre: "Thriller",
        status: "completed",
        rating: 9.7,
        watched: 16,
        total: 16,
    },
    {
        title: "My Mister",
        original: "나의 아저씨",
        genre: "Drama",
        status: "completed",
        rating: 9.6,
        watched: 16,
        total: 16,
    },
    {
        title: "Crash Landing on You",
        original: "사랑의 불시착",
        genre: "Romance",
        status: "plan_to_watch",
        rating: null,
        watched: 0,
        total: 16,
    },
] as const;

const STATUS_CONFIG: Record<string, { dot: string; label: string; text: string }> = {
    completed: {
        dot: "bg-zinc-400 dark:bg-zinc-500",
        label: "Done",
        text: "text-zinc-500 dark:text-zinc-400",
    },
    watching: { dot: "bg-sky-500", label: "Watching", text: "text-sky-600 dark:text-sky-400" },
    plan_to_watch: {
        dot: "bg-amber-400",
        label: "Planned",
        text: "text-amber-600 dark:text-amber-400",
    },
};

const GENRE_CONFIG: Record<string, { bg: string; text: string }> = {
    Fantasy: {
        bg: "bg-violet-100 dark:bg-violet-950/60",
        text: "text-violet-600 dark:text-violet-400",
    },
    Family: {
        bg: "bg-emerald-100 dark:bg-emerald-950/60",
        text: "text-emerald-700 dark:text-emerald-400",
    },
    Thriller: { bg: "bg-sky-100 dark:bg-sky-950/60", text: "text-sky-600 dark:text-sky-400" },
    Drama: { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-500 dark:text-zinc-400" },
    Romance: { bg: "bg-rose-100 dark:bg-rose-950/60", text: "text-rose-600 dark:text-rose-400" },
};

function ColHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <span
            className={cn(
                "text-muted-foreground/40 text-[9px] font-semibold tracking-widest uppercase",
                className,
            )}
        >
            {children}
        </span>
    );
}

function MyListCard() {
    const [visible, setVisible] = useState(0);

    useEffect(() => {
        if (visible >= LIST_ENTRIES.length) return;
        const delay = visible === 0 ? 500 : 320;
        const t = setTimeout(() => setVisible((v) => v + 1), delay);
        return () => clearTimeout(t);
    }, [visible]);

    return (
        <Card className="border-border/50 overflow-hidden rounded-2xl">
            <PreviewCardHeader
                label="My List"
                icon={<ListChecks className="h-3.5 w-3.5" />}
                meta={`${visible} / ${LIST_ENTRIES.length} shows`}
                accent="bg-violet-50/60 dark:bg-violet-950/30"
            />
            <CardContent className="p-0">
                {/* Column headers */}
                <div className="border-border/20 flex items-center gap-2 border-b px-4 py-1.5">
                    <div className="w-6 shrink-0" />
                    <ColHeader className="min-w-0 flex-1">Title</ColHeader>
                    <ColHeader className="w-14.5 shrink-0">Genre</ColHeader>
                    <ColHeader className="w-16 shrink-0">Status</ColHeader>
                    <ColHeader className="w-9 shrink-0 text-right">Ep</ColHeader>
                    <ColHeader className="w-8 shrink-0 text-right">★</ColHeader>
                </div>

                {/* Rows — always all in DOM, skeleton until revealed */}
                <div className="divide-border/30 divide-y">
                    {LIST_ENTRIES.map((entry, i) => {
                        const revealed = i < visible;
                        const cfg = STATUS_CONFIG[entry.status];
                        const genre = GENRE_CONFIG[entry.genre];
                        const epLabel =
                            entry.status === "plan_to_watch"
                                ? "—"
                                : `${entry.watched}/${entry.total}`;

                        return (
                            <div key={entry.title} className="flex items-center gap-2 px-4 py-2">
                                {/* Poster placeholder — always visible */}
                                <div className="bg-muted/80 flex h-8 w-6 shrink-0 items-center justify-center rounded">
                                    <div className="bg-muted-foreground/20 h-3 w-3 rounded-sm" />
                                </div>

                                {revealed ? (
                                    <>
                                        <div className="animate-in fade-in min-w-0 flex-1 duration-300">
                                            <p className="text-foreground truncate text-xs font-medium">
                                                {entry.title}
                                            </p>
                                            <p className="text-muted-foreground/50 text-[10px]">
                                                {entry.original}
                                            </p>
                                        </div>
                                        <div className="animate-in fade-in w-14.5 shrink-0 duration-300">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    "border-transparent px-1.5 py-0.5 text-[9px] font-medium shadow-none",
                                                    genre.bg,
                                                    genre.text,
                                                )}
                                            >
                                                {entry.genre}
                                            </Badge>
                                        </div>
                                        <div className="animate-in fade-in flex w-16 shrink-0 items-center gap-1.5 duration-300">
                                            <span
                                                className={cn(
                                                    "h-1.5 w-1.5 shrink-0 rounded-full",
                                                    cfg.dot,
                                                )}
                                            />
                                            <span className={cn("text-[10px]", cfg.text)}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground/60 animate-in fade-in w-9 shrink-0 text-right text-[10px] duration-300">
                                            {epLabel}
                                        </span>
                                        <span className="animate-in fade-in w-8 shrink-0 text-right text-[10px] font-semibold text-amber-500 duration-300 dark:text-amber-400">
                                            {entry.rating ? `★${entry.rating}` : "—"}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="min-w-0 flex-1 space-y-1.5">
                                            <div className="bg-muted h-2.5 w-24 animate-pulse rounded" />
                                            <div className="bg-muted/60 h-2 w-14 animate-pulse rounded" />
                                        </div>
                                        <div className="w-14.5 shrink-0">
                                            <div className="bg-muted h-4.5 w-12 animate-pulse rounded-md" />
                                        </div>
                                        <div className="w-16 shrink-0">
                                            <div className="bg-muted h-2 w-12 animate-pulse rounded" />
                                        </div>
                                        <div className="flex w-9 shrink-0 justify-end">
                                            <div className="bg-muted h-2 w-6 animate-pulse rounded" />
                                        </div>
                                        <div className="flex w-8 shrink-0 justify-end">
                                            <div className="bg-muted h-2.5 w-5 animate-pulse rounded" />
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// ── Watch Stats card ──────────────────────────────────────────────────────────

const GENRES = [
    { name: "Romance", pct: 78 },
    { name: "Fantasy", pct: 60 },
];

export function StatsCard() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });

    return (
        <Card ref={ref} className="border-border/50 overflow-hidden rounded-2xl">
            <PreviewCardHeader
                label="Watch Stats"
                icon={<BarChart2 className="h-3.5 w-3.5" />}
                accent="bg-emerald-50/60 dark:bg-emerald-950/20"
            />
            <CardContent className="p-4">
                <div className="mb-4 flex gap-4">
                    <div>
                        <p className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400">24</p>
                        <p className="text-muted-foreground/60 text-[10px]">Shows</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-violet-600 dark:text-violet-400">
                            312
                        </p>
                        <p className="text-muted-foreground/60 text-[10px]">Episodes</p>
                    </div>
                    <div>
                        <p className="text-sm font-bold text-amber-500 dark:text-amber-400">
                            ★ 8.4
                        </p>
                        <p className="text-muted-foreground/60 text-[10px]">Avg rating</p>
                    </div>
                </div>
                <div className="space-y-2.5">
                    {GENRES.map((g) => (
                        <div key={g.name}>
                            <div className="mb-1.5 flex justify-between">
                                <span className="text-muted-foreground/70 text-[10px]">
                                    {g.name}
                                </span>
                                <span className="text-muted-foreground text-[10px] font-medium">
                                    {g.pct}%
                                </span>
                            </div>
                            <Progress
                                value={inView ? g.pct : 0}
                                className="h-1.5 [&>div]:duration-700 [&>div]:ease-out"
                            />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

// ── AI Picks card ─────────────────────────────────────────────────────────────

const AI_PICKS = [
    { title: "Mr. Sunshine", reason: "Sweeping historical epic with emotional depth." },
    { title: "My Mister", reason: "Quiet, profound storytelling at its best." },
];

export function AiPicksCard() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    const [visible, setVisible] = useState(0);

    useEffect(() => {
        if (!inView || visible >= AI_PICKS.length) return;
        const t = setTimeout(() => setVisible((v) => v + 1), visible === 0 ? 400 : 500);
        return () => clearTimeout(t);
    }, [inView, visible]);

    return (
        <Card ref={ref} className="border-border/50 overflow-hidden rounded-2xl">
            <PreviewCardHeader
                label="AI Picks"
                icon={<Sparkles className="h-3.5 w-3.5" />}
                accent="bg-amber-50/60 dark:bg-amber-950/20"
            />
            <CardContent className="space-y-1.5 p-3">
                {/* Pick slots — always rendered at full height */}
                {AI_PICKS.map((pick, i) => (
                    <div
                        key={pick.title}
                        className="rounded-xl bg-amber-50/80 px-3 py-2.5 dark:bg-amber-950/20"
                    >
                        {i < visible ? (
                            <>
                                <p className="text-foreground animate-in fade-in text-xs font-medium duration-300">
                                    {pick.title}
                                </p>
                                <p className="text-muted-foreground/70 animate-in fade-in mt-0.5 text-[10px] leading-relaxed duration-300">
                                    {pick.reason}
                                </p>
                            </>
                        ) : (
                            <div className="space-y-1.5">
                                <div className="h-2.5 w-24 animate-pulse rounded bg-amber-200/60 dark:bg-amber-900/30" />
                                <div className="h-2 w-36 animate-pulse rounded bg-amber-200/40 dark:bg-amber-900/20" />
                            </div>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

// ── Composed preview ──────────────────────────────────────────────────────────

export function AppPreview() {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-linear-to-br from-fuchsia-100/60 via-violet-50/40 to-transparent blur-2xl dark:from-fuchsia-950/30 dark:via-violet-950/20 dark:to-transparent" />
            <div className="relative">
                <MyListCard />
            </div>
        </div>
    );
}
