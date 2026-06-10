import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// ── Floating decorative helpers (server-safe, CSS animation only) ─────────────

const glass =
    "border border-white/50 bg-white/80 backdrop-blur-sm shadow-sm dark:border-white/8 dark:bg-zinc-900/65";

function FloatWrap({
    className,
    duration = 3.4,
    delay = 0,
    children,
}: {
    className?: string;
    duration?: number;
    delay?: number;
    children: React.ReactNode;
}) {
    return (
        <div
            className={cn("pointer-events-none absolute select-none", className)}
            style={{
                animation: `gentle-float ${duration}s ease-in-out infinite`,
                animationDelay: `${delay}s`,
            }}
        >
            {children}
        </div>
    );
}

function ShowChip({
    title,
    year,
    genre,
    rating,
    hue,
    className,
    duration,
    delay,
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
        <FloatWrap className={className} duration={duration} delay={delay}>
            <div className={cn("flex items-center gap-2 rounded-xl p-2.5 pr-3.5", glass)}>
                <div
                    className={cn(
                        "flex h-9 w-6 shrink-0 items-center justify-center rounded bg-gradient-to-br",
                        hue,
                    )}
                >
                    <div className="h-2 w-2 rounded-sm bg-white/30 dark:bg-black/20" />
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground">{title}</p>
                    <p className="text-[10px] text-muted-foreground/60">
                        {year} · {genre}
                    </p>
                </div>
                <span className="ml-1 shrink-0 text-xs font-bold text-amber-500 dark:text-amber-400">
                    ★{rating}
                </span>
            </div>
        </FloatWrap>
    );
}

function GenreChip({
    label,
    colors,
    className,
    duration,
    delay,
}: {
    label: string;
    colors: string;
    className?: string;
    duration?: number;
    delay?: number;
}) {
    return (
        <FloatWrap className={className} duration={duration} delay={delay}>
            <div
                className={cn(
                    "rounded-full border px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur-sm",
                    colors,
                )}
            >
                {label}
            </div>
        </FloatWrap>
    );
}

function StatusChip({
    label,
    dotColor,
    textColor,
    className,
    duration,
    delay,
}: {
    label: string;
    dotColor: string;
    textColor: string;
    className?: string;
    duration?: number;
    delay?: number;
}) {
    return (
        <FloatWrap className={className} duration={duration} delay={delay}>
            <div className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5", glass)}>
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotColor)} />
                <span className={cn("text-[11px] font-medium", textColor)}>{label}</span>
            </div>
        </FloatWrap>
    );
}

// ── Decorative left panel ─────────────────────────────────────────────────────

function DecorativePanel() {
    return (
        <div className="relative hidden flex-col overflow-hidden lg:flex lg:w-[52%]">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-50/60 to-rose-100 dark:from-violet-950/80 dark:via-zinc-900 dark:to-fuchsia-950/40" />

            {/* Soft blobs */}
            <div
                aria-hidden
                className="pointer-events-none absolute -left-20 top-20 h-80 w-80 rounded-full bg-violet-200/50 blur-3xl dark:bg-violet-800/15"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 right-10 h-72 w-72 rounded-full bg-fuchsia-200/50 blur-3xl dark:bg-fuchsia-800/15"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute right-0 top-1/2 h-64 w-64 rounded-full bg-rose-200/35 blur-3xl dark:bg-rose-900/10"
            />

            {/* ── Floating chips — orbit the centered text ── */}

            {/* Top cluster */}
            <ShowChip
                title="Goblin"
                year="2016"
                genre="Fantasy"
                rating="9.8"
                hue="from-violet-200/80 to-violet-100/50 dark:from-violet-900/50 dark:to-violet-950/30"
                className="-rotate-3 left-[7%] top-[11%]"
                duration={3.7}
                delay={0}
            />
            <GenreChip
                label="Fantasy"
                colors="bg-violet-100/90 text-violet-700 border-violet-200/60 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-700/20"
                className="rotate-2 right-[9%] top-[8%]"
                duration={3.1}
                delay={0.5}
            />
            <StatusChip
                label="Watching"
                dotColor="bg-sky-500"
                textColor="text-sky-700 dark:text-sky-400"
                className="-rotate-2 left-[38%] top-[18%]"
                duration={3.3}
                delay={1.1}
            />

            {/* Left + right flanks (beside the text block) */}
            <GenreChip
                label="Romance"
                colors="bg-rose-100/90 text-rose-700 border-rose-200/60 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700/20"
                className="left-[4%] top-[44%] rotate-3"
                duration={2.9}
                delay={1.3}
            />
            <ShowChip
                title="Reply 1988"
                year="2015"
                genre="Family"
                rating="9.5"
                hue="from-emerald-200/80 to-emerald-100/50 dark:from-emerald-900/50 dark:to-emerald-950/30"
                className="-rotate-2 right-[4%] top-[42%]"
                duration={4.0}
                delay={0.9}
            />

            {/* Bottom cluster */}
            <GenreChip
                label="★ 9.7"
                colors="bg-amber-100/90 text-amber-700 border-amber-200/60 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/20"
                className="left-[8%] bottom-[14%] -rotate-3"
                duration={3.5}
                delay={1.8}
            />
            <StatusChip
                label="16 / 16 eps"
                dotColor="bg-zinc-400 dark:bg-zinc-500"
                textColor="text-zinc-600 dark:text-zinc-400"
                className="rotate-2 right-[8%] bottom-[12%]"
                duration={3.2}
                delay={0.4}
            />
            <GenreChip
                label="Completed"
                colors="bg-emerald-100/90 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700/20"
                className="-rotate-1 left-[35%] bottom-[20%]"
                duration={3.6}
                delay={0.8}
            />

            {/* ── Main text — vertically centered ───── */}
            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-10 py-10">
                {/* Brand */}
                <div className="absolute left-10 top-10">
                    <Link href="/" className="font-hand bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-2xl tracking-normal text-transparent dark:from-violet-400 dark:to-fuchsia-400">
                        Dramalist
                    </Link>
                </div>

                {/* Headline */}
                <div className="max-w-sm text-center">
                    <h2 className="font-hand mb-4 text-5xl leading-tight tracking-normal text-foreground xl:text-6xl">
                        Track the stories
                        <br />
                        <span className="relative text-violet-600 dark:text-violet-400">
                            that move you.
                            {/* Wavy underline */}
                            <span
                                aria-hidden
                                className="absolute -bottom-1 left-0 right-0 overflow-hidden"
                            >
                                <svg
                                    viewBox="0 0 260 8"
                                    preserveAspectRatio="none"
                                    className="h-[6px] w-full"
                                >
                                    <path
                                        d="M0,4 C32.5,0 32.5,8 65,4 C97.5,0 97.5,8 130,4 C162.5,0 162.5,8 195,4 C227.5,0 227.5,8 260,4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        className="text-violet-400/60 dark:text-violet-500/50"
                                    />
                                </svg>
                            </span>
                        </span>
                    </h2>

                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Build your personal drama library, write rich reviews, and discover your
                        next obsession — all in one place.
                    </p>
                </div>

                {/* Stats row */}
                <div className="mt-10 flex items-center gap-8">
                    <div className="text-center">
                        <p className="font-hand text-2xl tracking-normal text-violet-600 dark:text-violet-400">
                            157+
                        </p>
                        <p className="text-[11px] text-muted-foreground/60">Shows catalogued</p>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="text-center">
                        <p className="font-hand text-2xl tracking-normal text-violet-600 dark:text-violet-400">
                            ★ 8.4
                        </p>
                        <p className="text-[11px] text-muted-foreground/60">Avg community rating</p>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="text-center">
                        <p className="font-hand text-2xl tracking-normal text-rose-600 dark:text-rose-400">
                            Free
                        </p>
                        <p className="text-[11px] text-muted-foreground/60">Forever</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Layout ────────────────────────────────────────────────────────────────────

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-svh">
            <DecorativePanel />

            {/* Form panel */}
            <div className="relative flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-violet-50/40 via-background to-fuchsia-50/40 p-6 dark:from-violet-950/10 dark:via-background dark:to-fuchsia-950/10 sm:p-10">
                {/* Theme toggle — top-right */}
                <div className="absolute right-5 top-5">
                    <ThemeToggle />
                </div>

                {/* Mobile brand — only visible when left panel is hidden */}
                <div className="mb-8 lg:hidden">
                    <Link href="/" className="font-hand bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-2xl tracking-normal text-transparent dark:from-violet-400 dark:to-fuchsia-400">
                        Dramalist
                    </Link>
                </div>

                {children}
            </div>
        </div>
    );
}
