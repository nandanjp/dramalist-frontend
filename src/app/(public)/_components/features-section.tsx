"use client";

import * as React from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { BarChart2, ListChecks, Search, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/shared/page-container";
import { Overline } from "@/components/shared/typography";
import { AiPicksCard, StatsCard } from "./app-preview";

// ── Shared animation variants ─────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

// ── Track & Review mockup ─────────────────────────────────────────────────────

const TRACK_ROWS = [
    { title: "Goblin", ep: "16/16", status: "completed" },
    { title: "Alchemy of Souls", ep: "8/30", status: "watching" },
] as const;

const TRACK_STATUS = {
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

function TrackAndReviewMockup() {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    const [revealed, setRevealed] = React.useState(0);

    React.useEffect(() => {
        if (!inView || revealed >= 3) return;
        const t = setTimeout(() => setRevealed((v) => v + 1), revealed === 0 ? 300 : 220);
        return () => clearTimeout(t);
    }, [inView, revealed]);

    return (
        <div ref={ref} className="flex flex-col gap-2.5">
            {/* Mini list */}
            <div className="overflow-hidden rounded-xl border border-violet-100/80 dark:border-violet-900/20">
                <div className="flex items-center justify-between border-b border-violet-100/60 bg-violet-50/70 px-3 py-1.5 dark:border-violet-900/20 dark:bg-violet-950/30">
                    <div className="flex items-center gap-1.5">
                        <ListChecks className="h-3 w-3 text-violet-600 dark:text-violet-400" />
                        <span className="text-[10px] font-semibold tracking-widest text-violet-700/70 uppercase dark:text-violet-400/70">
                            My List
                        </span>
                    </div>
                    <span className="text-muted-foreground/50 text-[10px]">2 shows</span>
                </div>
                <div className="bg-card divide-border/20 divide-y">
                    {TRACK_ROWS.map((row, i) => {
                        const cfg = TRACK_STATUS[row.status];
                        const isRevealed = revealed > i;
                        return (
                            <div key={row.title} className="flex items-center gap-2 px-3 py-1.5">
                                <div className="bg-muted/80 flex h-5 w-3.5 shrink-0 items-center justify-center rounded">
                                    <div className="bg-muted-foreground/20 h-1.5 w-1.5 rounded-sm" />
                                </div>
                                {isRevealed ? (
                                    <>
                                        <span className="text-foreground animate-in fade-in min-w-0 flex-1 truncate text-[10px] font-medium duration-300">
                                            {row.title}
                                        </span>
                                        <div className="animate-in fade-in flex shrink-0 items-center gap-1 duration-300">
                                            <span
                                                className={cn(
                                                    "h-1.5 w-1.5 shrink-0 rounded-full",
                                                    cfg.dot,
                                                )}
                                            />
                                            <span className={cn("text-[9px]", cfg.text)}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <span className="text-muted-foreground/50 animate-in fade-in w-8 shrink-0 text-right text-[9px] duration-300">
                                            {row.ep}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <div className="min-w-0 flex-1">
                                            <div className="bg-muted h-2 w-16 animate-pulse rounded" />
                                        </div>
                                        <div className="shrink-0">
                                            <div className="bg-muted h-2 w-10 animate-pulse rounded" />
                                        </div>
                                        <div className="flex w-8 shrink-0 justify-end">
                                            <div className="bg-muted h-2 w-5 animate-pulse rounded" />
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* Compact review */}
            <div className="bg-card overflow-hidden rounded-xl border border-rose-100/60 dark:border-rose-900/15">
                <div className="flex items-center gap-2.5 border-b border-rose-100/40 px-3 py-2 dark:border-rose-900/10">
                    <div className="flex h-7 w-4.5 shrink-0 items-center justify-center rounded bg-linear-to-b from-rose-200/70 to-rose-100/40 dark:from-rose-900/40 dark:to-rose-950/20">
                        <div className="h-1.5 w-1.5 rounded-sm bg-white/40 dark:bg-black/20" />
                    </div>
                    {revealed >= 3 ? (
                        <>
                            <div className="animate-in fade-in min-w-0 flex-1 duration-300">
                                <p className="text-foreground truncate text-[10px] font-semibold">
                                    Crash Landing on You
                                </p>
                                <p className="text-muted-foreground/50 text-[9px]">
                                    2019 · Romance
                                </p>
                            </div>
                            <div className="animate-in fade-in flex shrink-0 items-center gap-0.5 duration-300">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <span key={i} className="text-[8px] text-amber-400">
                                        ★
                                    </span>
                                ))}
                                <span className="ml-1 text-[10px] font-semibold text-amber-500 dark:text-amber-400">
                                    9.6
                                </span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="bg-muted h-2.5 w-28 animate-pulse rounded" />
                                <div className="bg-muted/60 h-2 w-16 animate-pulse rounded" />
                            </div>
                            <div className="shrink-0">
                                <div className="bg-muted h-2 w-14 animate-pulse rounded" />
                            </div>
                        </>
                    )}
                </div>
                <div className="px-3 py-2">
                    {revealed >= 3 ? (
                        <p className="text-muted-foreground/70 animate-in fade-in text-[10px] leading-relaxed duration-300">
                            &ldquo;Masterful storytelling — the chemistry is undeniable.&rdquo;
                        </p>
                    ) : (
                        <div className="bg-muted h-2.5 w-full animate-pulse rounded" />
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Discover mockup ───────────────────────────────────────────────────────────

const CATALOG_ITEMS = [
    {
        title: "Goblin",
        original: "도깨비",
        genre: "Fantasy",
        rating: "9.8",
        year: "2016",
        hue: "from-violet-200/60 to-violet-100/30 dark:from-violet-900/40 dark:to-violet-950/20",
    },
    {
        title: "Signal",
        original: "시그널",
        genre: "Thriller",
        rating: "9.7",
        year: "2016",
        hue: "from-sky-200/60 to-sky-100/30 dark:from-sky-900/40 dark:to-sky-950/20",
    },
] as const;

const CATALOG_GENRE: Record<string, string> = {
    Fantasy: "bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
    Thriller: "bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
};

function DiscoverMockup() {
    const ref = React.useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.3 });
    const [revealed, setRevealed] = React.useState(0);

    React.useEffect(() => {
        if (!inView || revealed >= 2) return;
        const t = setTimeout(() => setRevealed((v) => v + 1), revealed === 0 ? 300 : 220);
        return () => clearTimeout(t);
    }, [inView, revealed]);

    return (
        <div ref={ref} className="flex flex-col gap-2">
            {/* mini search bar — static skeleton */}
            <div className="flex items-center gap-2 rounded-lg border border-violet-100/60 bg-violet-50/40 px-2.5 py-1.5 dark:border-violet-900/15 dark:bg-violet-950/10">
                <Search className="h-2.5 w-2.5 text-violet-400/60 dark:text-violet-400/40" />
                <div className="h-2 w-20 rounded bg-violet-200/50 dark:bg-violet-900/30" />
            </div>
            {/* 2 horizontal result rows */}
            <div className="flex flex-col gap-2">
                {CATALOG_ITEMS.map((item, i) => {
                    const isRevealed = revealed > i;
                    return (
                        <div
                            key={item.title}
                            className="bg-card border-border/40 flex items-center gap-2.5 overflow-hidden rounded-lg border px-2.5 py-2"
                        >
                            <div
                                className={cn(
                                    "flex h-10 w-7 shrink-0 items-center justify-center rounded bg-linear-to-br",
                                    item.hue,
                                )}
                            >
                                <div className="h-3 w-3 rounded bg-white/20 dark:bg-black/20" />
                            </div>
                            {isRevealed ? (
                                <>
                                    <div className="animate-in fade-in min-w-0 flex-1 duration-300">
                                        <p className="text-foreground truncate text-[10px] font-medium">
                                            {item.title}
                                        </p>
                                        <p className="text-muted-foreground/50 text-[9px]">
                                            {item.original} · {item.year}
                                        </p>
                                    </div>
                                    <div className="animate-in fade-in flex shrink-0 flex-col items-end gap-1 duration-300">
                                        <span className="text-[9px] font-semibold text-amber-500 dark:text-amber-400">
                                            ★{item.rating}
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "border-transparent px-1 py-0.5 text-[8px] font-medium shadow-none",
                                                CATALOG_GENRE[item.genre],
                                            )}
                                        >
                                            {item.genre}
                                        </Badge>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="min-w-0 flex-1 space-y-1.5">
                                        <div className="bg-muted h-2 w-14 animate-pulse rounded" />
                                        <div className="bg-muted/60 h-2 w-10 animate-pulse rounded" />
                                    </div>
                                    <div className="flex shrink-0 flex-col items-end gap-1">
                                        <div className="bg-muted h-2 w-6 animate-pulse rounded" />
                                        <div className="bg-muted h-3.5 w-10 animate-pulse rounded" />
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Feature card wrapper ──────────────────────────────────────────────────────

function FeatureCard({
    icon,
    iconBg,
    title,
    description,
    children,
    accent,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
    children: React.ReactNode;
    accent?: string;
}) {
    return (
        <Card
            className={cn("border-border/50 flex h-full flex-col rounded-2xl shadow-none", accent)}
        >
            <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2.5">
                        <span
                            className={cn(
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                                iconBg,
                            )}
                        >
                            {icon}
                        </span>
                        <span className="text-foreground text-sm font-semibold">{title}</span>
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
                </div>
                {children}
            </CardContent>
        </Card>
    );
}

// ── Features section ──────────────────────────────────────────────────────────

export function FeaturesSection() {
    return (
        <section className="py-16 md:py-24">
            <PageContainer
                size="default"
                className="sm:max-w-xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
            >
                {/* Header */}
                <motion.div
                    className="mb-10 max-w-lg"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={fadeUp}
                >
                    <Overline className="mb-3">Features</Overline>
                    <h2 className="font-hand text-foreground mb-2 text-2xl tracking-normal md:text-3xl lg:text-4xl">
                        Built for drama fans.
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed md:text-base">
                        Everything you need to track, discover, and review dramas — all in one
                        place.
                    </p>
                </motion.div>

                {/* Row 1 — two UI mockup cards */}
                <motion.div
                    className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={stagger}
                >
                    <motion.div variants={fadeUp} className="h-full">
                        <FeatureCard
                            icon={<ListChecks className="h-3.5 w-3.5" />}
                            iconBg="bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400"
                            title="Track & Review"
                            description="Build your drama library, set statuses, track episodes, and leave ratings and reviews — all in one place."
                            accent="border-violet-100/80 bg-violet-50/60 dark:border-violet-900/20 dark:bg-violet-950/10"
                        >
                            <TrackAndReviewMockup />
                        </FeatureCard>
                    </motion.div>

                    <motion.div variants={fadeUp} className="h-full">
                        <FeatureCard
                            icon={<Search className="h-3.5 w-3.5" />}
                            iconBg="bg-violet-100 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400"
                            title="Browse & Discover"
                            description="Explore a growing catalog of Korean, Japanese, Chinese, and Thai dramas filtered by genre, year, and rating."
                            accent="border-violet-100/80 bg-violet-50/60 dark:border-violet-900/20 dark:bg-violet-950/10"
                        >
                            <DiscoverMockup />
                        </FeatureCard>
                    </motion.div>
                </motion.div>

                {/* Row 2 — AI + Stats showcase cards */}
                <motion.div
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={stagger}
                >
                    <motion.div variants={fadeUp} className="h-full">
                        <Card className="flex h-full flex-col rounded-2xl border-amber-100 bg-amber-50/60 shadow-none dark:border-amber-950/30 dark:bg-amber-950/10">
                            <CardContent className="flex flex-1 flex-col gap-4 p-5">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                                            <Sparkles className="h-3.5 w-3.5" />
                                        </span>
                                        <span className="text-foreground text-sm font-semibold">
                                            AI Recommendations
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        Our AI analyses your watch history and surfaces dramas
                                        you&apos;re likely to love — no scrolling endless lists.
                                    </p>
                                </div>
                                <AiPicksCard />
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={fadeUp} className="h-full">
                        <Card className="flex h-full flex-col rounded-2xl border-emerald-100 bg-emerald-50/60 shadow-none dark:border-emerald-950/30 dark:bg-emerald-950/10">
                            <CardContent className="flex flex-1 flex-col gap-4 p-5">
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                            <BarChart2 className="h-3.5 w-3.5" />
                                        </span>
                                        <span className="text-foreground text-sm font-semibold">
                                            Watching Insights
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground text-xs leading-relaxed">
                                        Get a bird&apos;s eye view of your habits. Genre breakdowns,
                                        episode counts, average ratings — your watching story in
                                        numbers.
                                    </p>
                                </div>
                                <StatsCard />
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </PageContainer>
        </section>
    );
}
