import Link from "next/link";
import {
    BookOpen,
    Brain,
    List,
    Search,
    Sparkles,
    Star,
    TrendingUp,
    Users,
    Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* ── Sticky nav ── */}
            <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" strokeWidth={2} />
                        <span className="text-lg font-semibold tracking-tight">Dramalist</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Sign in</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/signup">Get started</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="relative overflow-hidden pt-32 pb-24">
                {/* Subtle radial glow behind hero text */}
                <div
                    className="pointer-events-none absolute inset-0 -z-10"
                    aria-hidden="true"
                    style={{
                        background:
                            "radial-gradient(ellipse 80% 50% at 50% -10%, hsl(var(--primary) / 0.15), transparent)",
                    }}
                />

                <div className="mx-auto max-w-4xl px-4 text-center">
                    <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium">
                        <Sparkles className="h-3 w-3" />
                        AI-powered drama discovery
                    </Badge>

                    <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
                        Your drama list,
                        <br />
                        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                            elevated.
                        </span>
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                        Track every Asian drama you watch, write rich markdown reviews, and let AI
                        discover your next obsession — all in one beautifully organized place.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Button size="lg" className="px-8 text-base" asChild>
                            <Link href="/signup">Start for free</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="px-8 text-base" asChild>
                            <Link href="/login">Sign in</Link>
                        </Button>
                    </div>

                    {/* Social proof row */}
                    <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
                        {[
                            { label: "Shows tracked", value: "10K+" },
                            { label: "Reviews written", value: "4K+" },
                            { label: "Genres covered", value: "30+" },
                        ].map((s) => (
                            <div key={s.label} className="text-center">
                                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                                <p className="text-xs">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Feature grid ── */}
            <section className="border-y border-border/50 bg-muted/20 py-24">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Everything a serious fan needs
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            Built for people who take their dramas seriously.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {FEATURES.map((f) => (
                            <div
                                key={f.title}
                                className="group rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
                            >
                                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <f.icon className="h-5 w-5" strokeWidth={1.5} />
                                </div>
                                <h3 className="mb-2 font-semibold">{f.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {f.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ── */}
            <section className="py-24">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="mx-auto mb-14 max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Up and running in minutes
                        </h2>
                        <p className="mt-4 text-muted-foreground">
                            No spreadsheets. No browser bookmarks. Just your perfect drama list.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-3">
                        {STEPS.map((step, i) => (
                            <div key={step.title} className="relative text-center">
                                {i < STEPS.length - 1 && (
                                    <div
                                        className="absolute left-1/2 top-5 hidden h-px w-full translate-x-1/2 bg-border sm:block"
                                        aria-hidden="true"
                                    />
                                )}
                                <div className="relative mx-auto mb-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary">
                                    {i + 1}
                                </div>
                                <h3 className="mb-2 font-semibold">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Final CTA ── */}
            <section className="border-t border-border/50 bg-muted/20 py-24">
                <div className="mx-auto max-w-2xl px-4 text-center">
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Zap className="h-6 w-6" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Ready to build your list?
                    </h2>
                    <p className="mt-4 text-muted-foreground">
                        Join with Google, GitHub, or email. Your first drama takes 30 seconds to add.
                    </p>
                    <Button size="lg" className="mt-8 px-10 text-base" asChild>
                        <Link href="/signup">Create your account</Link>
                    </Button>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-border/50 py-8">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium text-foreground">Dramalist</span>
                    </div>
                    <p>Track the stories that move you.</p>
                </div>
            </footer>
        </div>
    );
}

const FEATURES = [
    {
        icon: List,
        title: "Track your watchlist",
        description:
            "Log every drama with episode progress, status, start/end dates, genres, tags, and personal notes. Never lose track of where you left off.",
    },
    {
        icon: Star,
        title: "Rich markdown reviews",
        description:
            "Write long-form reviews with full CommonMark support — headings, tables, spoiler warnings, and more. Rate from 0 to 10 with precision.",
    },
    {
        icon: Brain,
        title: "AI recommendations",
        description:
            "Get personalized suggestions based on your taste profile and mood. Describe what you're feeling and AI surfaces your next perfect watch.",
    },
    {
        icon: Search,
        title: "Powerful search",
        description:
            "Find any show in your list or across the community instantly. Filter by genre, status, country, year, and tags with fuzzy matching.",
    },
    {
        icon: TrendingUp,
        title: "Watch statistics",
        description:
            "Visualize your habits — total episodes watched, genre breakdown, average rating, and how your taste evolves over time.",
    },
    {
        icon: Users,
        title: "Public profiles",
        description:
            "Share your watchlist and reviews with friends. Follow public profiles to see what others are watching and recommending.",
    },
];

const STEPS = [
    {
        title: "Create your account",
        description:
            "Sign up in seconds with Google, GitHub, or email. No credit card required.",
    },
    {
        title: "Add your first show",
        description:
            "Start logging the drama you're watching right now — title, episodes, status, and notes.",
    },
    {
        title: "Discover what's next",
        description:
            "Get AI recommendations tailored to your genre preferences and viewing history.",
    },
];
