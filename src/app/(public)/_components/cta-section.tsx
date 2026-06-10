"use client";

import * as React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { Overline } from "@/components/shared/typography";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

// ── Floating decorative elements ──────────────────────────────────────────────

const glass =
    "border border-white/50 bg-white/80 shadow-sm backdrop-blur-sm dark:border-white/8 dark:bg-zinc-900/65";

function ShowCard({
    title,
    year,
    genre,
    rating,
    hue,
    className,
    duration = 3.6,
    delay = 0,
}: {
    title: string;
    year: string;
    genre: string;
    rating: string;
    hue: string;
    className?: string;
    duration?: number;
    delay?: number;
}) {
    return (
        <motion.div
            aria-hidden
            className={cn("pointer-events-none absolute hidden select-none lg:block", className)}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
        >
            <div className={cn("flex items-center gap-2 rounded-xl p-2.5 pr-3.5", glass)}>
                <div
                    className={cn(
                        "flex h-9 w-6 shrink-0 items-center justify-center rounded bg-linear-to-br",
                        hue,
                    )}
                >
                    <div className="h-2 w-2 rounded-sm bg-white/30 dark:bg-black/20" />
                </div>
                <div className="min-w-0">
                    <p className="text-foreground text-xs font-semibold">{title}</p>
                    <p className="text-muted-foreground/60 text-[10px]">
                        {year} · {genre}
                    </p>
                </div>
                <span className="ml-1 shrink-0 text-xs font-bold text-amber-500 dark:text-amber-400">
                    ★{rating}
                </span>
            </div>
        </motion.div>
    );
}

function Pill({
    label,
    colors,
    className,
    duration = 3.2,
    delay = 0,
}: {
    label: string;
    colors: string;
    className?: string;
    duration?: number;
    delay?: number;
}) {
    return (
        <motion.div
            aria-hidden
            className={cn("pointer-events-none absolute hidden select-none md:block", className)}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
        >
            <div
                className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur-sm",
                    colors,
                )}
            >
                {label}
            </div>
        </motion.div>
    );
}

function StatusChip({
    label,
    dotColor,
    textColor,
    className,
    duration = 2.9,
    delay = 0,
}: {
    label: string;
    dotColor: string;
    textColor: string;
    className?: string;
    duration?: number;
    delay?: number;
}) {
    return (
        <motion.div
            aria-hidden
            className={cn("pointer-events-none absolute hidden select-none md:block", className)}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
        >
            <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5", glass)}>
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotColor)} />
                <span className={cn("text-[11px] font-medium", textColor)}>{label}</span>
            </div>
        </motion.div>
    );
}

// ── CTA section ───────────────────────────────────────────────────────────────

export function CtaSection() {
    return (
        <section className="relative overflow-hidden py-24 md:py-32">
            {/* Ambient glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
                <div className="h-[500px] w-[900px] rounded-full bg-gradient-to-r from-rose-300/22 via-violet-300/22 to-sky-300/22 blur-3xl dark:from-rose-500/10 dark:via-violet-500/12 dark:to-sky-500/10" />
            </div>

            {/* ── Floating elements — left ────────────────────── */}
            <Pill
                label="Fantasy"
                colors="bg-violet-100/90 text-violet-700 border-violet-200/60 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-700/20"
                className="-rotate-6 left-[16%] top-[10%]"
                duration={3.1}
                delay={0.4}
            />
            <ShowCard
                title="Goblin"
                year="2016"
                genre="Fantasy"
                rating="9.8"
                hue="from-violet-200/80 to-violet-100/50 dark:from-violet-900/50 dark:to-violet-950/30"
                className="-rotate-3 left-[2%] top-[24%]"
                duration={3.7}
                delay={0}
            />
            <StatusChip
                label="Done"
                dotColor="bg-zinc-400 dark:bg-zinc-500"
                textColor="text-zinc-600 dark:text-zinc-400"
                className="rotate-2 left-[17%] top-[38%]"
                duration={3.2}
                delay={0.8}
            />
            <Pill
                label="Thriller"
                colors="bg-sky-100/90 text-sky-700 border-sky-200/60 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-700/20"
                className="-rotate-3 left-[15%] top-[58%]"
                duration={2.9}
                delay={1.5}
            />
            <StatusChip
                label="16 / 16 eps"
                dotColor="bg-zinc-400 dark:bg-zinc-500"
                textColor="text-zinc-600 dark:text-zinc-400"
                className="rotate-1 left-[3%] top-[66%]"
                duration={3.4}
                delay={1.2}
            />

            {/* ── Floating elements — right ───────────────────── */}
            <Pill
                label="Romance"
                colors="bg-rose-100/90 text-rose-700 border-rose-200/60 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700/20"
                className="right-[16%] top-[12%] rotate-5"
                duration={2.8}
                delay={1.4}
            />
            <ShowCard
                title="Reply 1988"
                year="2015"
                genre="Family"
                rating="9.5"
                hue="from-emerald-200/80 to-emerald-100/50 dark:from-emerald-900/50 dark:to-emerald-950/30"
                className="right-[2%] top-[27%] rotate-3"
                duration={4.0}
                delay={0.9}
            />
            <Pill
                label="★ 9.7"
                colors="bg-amber-100/90 text-amber-700 border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/20"
                className="-rotate-3 right-[17%] top-[34%]"
                duration={3.5}
                delay={0.3}
            />
            <Pill
                label="★ 8.4 avg"
                colors="bg-amber-100/90 text-amber-700 border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/20"
                className="right-[15%] top-[52%] rotate-4"
                duration={3.6}
                delay={2.0}
            />
            <StatusChip
                label="Planned"
                dotColor="bg-amber-400"
                textColor="text-amber-700 dark:text-amber-400"
                className="-rotate-2 right-[3%] top-[63%]"
                duration={3.0}
                delay={1.7}
            />
            <StatusChip
                label="Watching"
                dotColor="bg-sky-500"
                textColor="text-sky-700 dark:text-sky-400"
                className="right-[16%] top-[66%] rotate-2"
                duration={3.3}
                delay={0.6}
            />

            {/* ── Main content ────────────────────────────────── */}
            <PageContainer>
                <motion.div
                    className="relative flex flex-col items-center gap-6 text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={container}
                >
                    <motion.div variants={fadeUp}>
                        <Overline>Get started</Overline>
                    </motion.div>

                    <motion.h2
                        variants={fadeUp}
                        className="font-hand text-foreground max-w-2xl text-4xl tracking-normal md:text-5xl lg:text-6xl"
                    >
                        Your drama journey
                        <br className="hidden sm:block" />{" "}
                        <span className="text-violet-600 dark:text-violet-400">starts here.</span>
                    </motion.h2>

                    <motion.p
                        variants={fadeUp}
                        className="text-muted-foreground max-w-md text-sm leading-relaxed md:text-base"
                    >
                        Track every show, leave reviews, and discover your next obsession — free,
                        forever.
                    </motion.p>

                    <motion.div
                        variants={fadeUp}
                        className="flex flex-wrap items-center justify-center gap-3"
                    >
                        <Button size="lg" asChild>
                            <Link href="/signup">
                                Sign up free
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="ghost" size="lg" asChild>
                            <Link href="/catalog">Browse catalog</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </PageContainer>
        </section>
    );
}
