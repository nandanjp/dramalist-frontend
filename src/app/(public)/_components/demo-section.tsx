"use client";

import * as React from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { MoreHorizontal, Pencil, Plus, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { Overline } from "@/components/shared/typography";
import {
    Table,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// ── Data ──────────────────────────────────────────────────────────────────────

const DEMO_ENTRIES = [
    { title: "Goblin", original: "도깨비", year: 2016, genre: "Fantasy", status: "completed", rating: 9.8, watched: 16, total: 16 },
    { title: "Alchemy of Souls", original: "환혼", year: 2022, genre: "Fantasy", status: "watching", rating: null, watched: 8, total: 30 },
    { title: "Reply 1988", original: "응답하라 1988", year: 2015, genre: "Family", status: "completed", rating: 9.5, watched: 20, total: 20 },
    { title: "Signal", original: "시그널", year: 2016, genre: "Thriller", status: "completed", rating: 9.7, watched: 16, total: 16 },
    { title: "My Mister", original: "나의 아저씨", year: 2018, genre: "Drama", status: "completed", rating: 9.6, watched: 16, total: 16 },
    { title: "Crash Landing on You", original: "사랑의 불시착", year: 2019, genre: "Romance", status: "plan_to_watch", rating: null, watched: 0, total: 16 },
] as const;

const STATUS_CONFIG: Record<string, { dot: string; label: string; text: string }> = {
    completed: { dot: "bg-zinc-400 dark:bg-zinc-500", label: "Done", text: "text-zinc-500 dark:text-zinc-400" },
    watching: { dot: "bg-sky-500", label: "Watching", text: "text-sky-600 dark:text-sky-400" },
    plan_to_watch: { dot: "bg-amber-400", label: "Planned", text: "text-amber-600 dark:text-amber-400" },
};

const GENRE_CONFIG: Record<string, { bg: string; text: string }> = {
    Fantasy: { bg: "bg-violet-100 dark:bg-violet-950/60", text: "text-violet-600 dark:text-violet-400" },
    Family: { bg: "bg-emerald-100 dark:bg-emerald-950/60", text: "text-emerald-700 dark:text-emerald-400" },
    Thriller: { bg: "bg-sky-100 dark:bg-sky-950/60", text: "text-sky-600 dark:text-sky-400" },
    Drama: { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-500 dark:text-zinc-400" },
    Romance: { bg: "bg-rose-100 dark:bg-rose-950/60", text: "text-rose-600 dark:text-rose-400" },
};

const POSTER_HUE: Record<string, string> = {
    "Goblin": "from-violet-200/80 to-violet-100/50 dark:from-violet-900/50 dark:to-violet-950/30",
    "Alchemy of Souls": "from-sky-200/80 to-sky-100/50 dark:from-sky-900/50 dark:to-sky-950/30",
    "Reply 1988": "from-emerald-200/80 to-emerald-100/50 dark:from-emerald-900/50 dark:to-emerald-950/30",
    "Signal": "from-slate-200/80 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-950/30",
    "My Mister": "from-zinc-200/80 to-zinc-100/50 dark:from-zinc-800/50 dark:to-zinc-900/30",
    "Crash Landing on You": "from-rose-200/80 to-rose-100/50 dark:from-rose-900/50 dark:to-rose-950/30",
};

const TYPED_QUERY = "goblin";

// ── Animation variants ────────────────────────────────────────────────────────

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const rowFade: Variants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease } },
};

// ── Demo section ──────────────────────────────────────────────────────────────

export function DemoSection() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inView = useInView(containerRef, { once: true, amount: 0.2 });
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const [searchQuery, setSearchQuery] = React.useState("");

    React.useEffect(() => {
        if (!inView) return;

        let idx = 1;
        const schedule = (fn: () => void, ms: number) => {
            timerRef.current = setTimeout(fn, ms);
        };
        const erase = (len: number) => {
            if (len < 0) return;
            setSearchQuery(TYPED_QUERY.slice(0, len));
            schedule(() => erase(len - 1), 65);
        };
        const type = () => {
            setSearchQuery(TYPED_QUERY.slice(0, idx));
            if (idx < TYPED_QUERY.length) {
                idx++;
                schedule(type, 90);
            } else {
                schedule(() => erase(TYPED_QUERY.length), 1600);
            }
        };
        schedule(type, 1300);

        return () => clearTimeout(timerRef.current);
    }, [inView]);

    return (
        <section className="py-16 md:py-24">
            <PageContainer size="wide">
                {/* Header */}
                <motion.div
                    className="mb-10 max-w-lg"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={fadeUp}
                >
                    <Overline className="mb-3">Live Demo</Overline>
                    <h2 className="font-hand mb-2 text-2xl tracking-normal text-foreground md:text-3xl lg:text-4xl">
                        Your drama list, in action.
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                        Track every show you&apos;ve watched, are watching, and plan to see. Search, filter, and stay organised.
                    </p>
                </motion.div>

                {/* Gradient border wrapper — motion wraps the border so bg doesn't flash before animation */}
                <motion.div
                    ref={containerRef}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    variants={fadeUp}
                    className="rounded-[17px] bg-gradient-to-br from-fuchsia-300/25 via-border to-violet-300/25 p-px dark:from-fuchsia-700/25 dark:via-border dark:to-violet-700/25"
                >
                    <div className="relative overflow-hidden rounded-2xl bg-card">
                        {/* One-shot sheen sweep on entry */}
                        <motion.div
                            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent dark:via-white/[0.04]"
                            initial={{ x: "-100%" }}
                            animate={inView ? { x: "220%" } : { x: "-100%" }}
                            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
                        />

                        {/* Toolbar */}
                        <div className="flex flex-wrap items-center gap-2 border-b border-violet-100/60 bg-violet-50/40 px-4 py-3 dark:border-violet-900/20 dark:bg-violet-950/15">
                            {/* Search input mockup */}
                            <div className="flex flex-1 items-center gap-2 rounded-lg border border-border/50 bg-background px-3 py-1.5 sm:max-w-64">
                                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                                <span className="min-w-[3ch] flex-1 text-sm">
                                    {searchQuery ? (
                                        <span className="text-foreground">{searchQuery}</span>
                                    ) : (
                                        <span className="text-muted-foreground/35">Search your list…</span>
                                    )}
                                </span>
                                <span className="h-3.5 w-px animate-pulse bg-foreground/40" />
                            </div>

                            {/* Status filter pills */}
                            <div className="hidden items-center gap-1 sm:flex">
                                {(["All", "Watching", "Done", "Planned"] as const).map((label, i) => (
                                    <Badge
                                        key={label}
                                        variant="outline"
                                        className={cn(
                                            "select-none rounded-full border-transparent px-2.5 py-1 text-xs font-medium shadow-none",
                                            i === 0
                                                ? "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300"
                                                : "text-muted-foreground/55",
                                        )}
                                    >
                                        {label}
                                    </Badge>
                                ))}
                            </div>

                            <Button size="sm" className="ml-auto shrink-0 gap-1.5">
                                <Plus className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Add show</span>
                            </Button>
                        </div>

                        {/* [&>div] targets the shadcN Table's overflow-auto wrapper div */}
                        <div className="[&>div]:overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="hidden w-8 text-center text-xs md:table-cell">#</TableHead>
                                    <TableHead className="text-xs">Title</TableHead>
                                    <TableHead className="hidden w-24 text-xs sm:table-cell">Genre</TableHead>
                                    <TableHead className="w-28 text-xs">Status</TableHead>
                                    <TableHead className="hidden w-20 text-right text-xs md:table-cell">Ep</TableHead>
                                    <TableHead className="w-14 text-right text-xs">Rating</TableHead>
                                    <TableHead className="w-16 text-xs" />
                                </TableRow>
                            </TableHeader>
                            <motion.tbody
                                className="[&_tr:last-child]:border-0"
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                                variants={stagger}
                            >
                                {DEMO_ENTRIES.map((entry, i) => {
                                    const cfg = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG["completed"];
                                    const genre = GENRE_CONFIG[entry.genre] ?? { bg: "bg-zinc-100 dark:bg-zinc-800", text: "text-zinc-500 dark:text-zinc-400" };
                                    const isMatch =
                                        !searchQuery ||
                                        entry.title.toLowerCase().includes(searchQuery.toLowerCase());
                                    const epLabel =
                                        entry.status === "plan_to_watch"
                                            ? "—"
                                            : `${entry.watched}/${entry.total}`;

                                    return (
                                        <motion.tr
                                            key={entry.title}
                                            variants={rowFade}
                                            className={cn(
                                                "border-b transition-opacity duration-300 hover:bg-muted/40",
                                                !isMatch && searchQuery ? "opacity-20" : "opacity-100",
                                            )}
                                        >
                                            {/* # */}
                                            <TableCell className="hidden text-center text-xs text-muted-foreground/30 md:table-cell">
                                                {i + 1}
                                            </TableCell>

                                            {/* Title + poster */}
                                            <TableCell>
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className={cn(
                                                            "flex h-9 w-6 shrink-0 items-center justify-center rounded bg-gradient-to-br",
                                                            POSTER_HUE[entry.title],
                                                        )}
                                                    >
                                                        <div className="h-2.5 w-2.5 rounded-sm bg-white/30 dark:bg-black/20" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {entry.title}
                                                        </p>
                                                        <p className="truncate text-xs text-muted-foreground/50">
                                                            {entry.original} · {entry.year}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>

                                            {/* Genre */}
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "border-transparent px-2 py-0.5 text-[11px] font-medium shadow-none",
                                                        genre.bg,
                                                        genre.text,
                                                    )}
                                                >
                                                    {entry.genre}
                                                </Badge>
                                            </TableCell>

                                            {/* Status */}
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", cfg.dot)} />
                                                    <span className={cn("text-xs", cfg.text)}>{cfg.label}</span>
                                                </div>
                                            </TableCell>

                                            {/* Episodes */}
                                            <TableCell className="hidden text-right text-xs text-muted-foreground/60 md:table-cell">
                                                {epLabel}
                                            </TableCell>

                                            {/* Rating */}
                                            <TableCell className="text-right text-xs font-semibold text-amber-500 dark:text-amber-400">
                                                {entry.rating != null ? `★${entry.rating}` : "—"}
                                            </TableCell>

                                            {/* Actions */}
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-0.5">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/35">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/35">
                                                        <MoreHorizontal className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    );
                                })}
                            </motion.tbody>
                        </Table>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between border-t border-border/40 bg-muted/10 px-4 py-3">
                            <span className="text-xs text-muted-foreground/50">
                                24 shows · 312 episodes ·{" "}
                                <span className="text-amber-500 dark:text-amber-400">★ 8.4</span> avg
                            </span>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" disabled className="px-2 text-xs opacity-30">
                                    ← Prev
                                </Button>
                                <Badge className="rounded-md border-transparent bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700 shadow-none hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300">
                                    1
                                </Badge>
                                <Button variant="ghost" size="sm" className="px-2 text-xs">
                                    Next →
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </PageContainer>
        </section>
    );
}
