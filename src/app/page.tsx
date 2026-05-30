import Link from "next/link";
import { BookOpen } from "lucide-react";
import { DramaMarquee } from "@/components/landing/drama-marquee";
import { BentoGrid } from "@/components/landing/bento-grid";
import { MoodDemoSection } from "@/components/landing/mood-demo-section";

// ── Nav ───────────────────────────────────────────────────────────────────────

function Nav() {
    return (
        <header className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
                        <BookOpen className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                    </div>
                    <span className="text-base font-semibold tracking-tight text-slate-900">Dramalist</span>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href="/login"
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                        Sign in
                    </Link>
                    <Link
                        href="/signup"
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                    >
                        Get started
                    </Link>
                </div>
            </div>
        </header>
    );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
    return (
        <section className="relative overflow-hidden bg-white pt-32 pb-0">
            {/* Subtle radial blobs */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 40% at 20% 60%, #ede9fe 0%, transparent 60%), radial-gradient(ellipse 50% 30% at 80% 20%, #f0e6ff 0%, transparent 60%)",
                }}
            />

            <div className="mx-auto max-w-4xl px-4 text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 text-xs font-medium text-violet-700">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                    </svg>
                    AI-powered drama discovery
                </div>

                <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                    Track the dramas
                    <br />
                    <span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)" }}
                    >
                        that move you.
                    </span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
                    Your personal cinema log for K-dramas and Asian TV. Rich reviews, AI-powered
                    recommendations, and a watchlist that actually reflects your taste.
                </p>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/signup"
                        className="rounded-xl bg-slate-900 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:bg-slate-700 hover:shadow-xl"
                    >
                        Start for free
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-xl border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
                    >
                        Sign in
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-10 border-t border-slate-100 pt-10">
                    {[
                        { value: "10K+", label: "Shows tracked" },
                        { value: "4K+", label: "Reviews written" },
                        { value: "30+", label: "Genres covered" },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                            <p className="text-xs text-slate-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Marquee — bleeds into the hero bottom */}
            <div className="mt-16">
                <DramaMarquee />
            </div>
        </section>
    );
}

// ── Bento section ─────────────────────────────────────────────────────────────

function BentoSection() {
    return (
        <section className="bg-slate-50 py-28">
            <div className="mx-auto max-w-6xl px-4">
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Everything a serious fan needs
                    </h2>
                    <p className="mt-4 text-slate-500">
                        Built for people who take their dramas seriously.
                    </p>
                </div>
                <BentoGrid />
            </div>
        </section>
    );
}

// ── How it works ──────────────────────────────────────────────────────────────

const STEPS = [
    {
        num: "01",
        title: "Add your shows",
        body: "Log dramas with episode progress, status, genres, tags, and notes. Watching, completed, plan to watch — all tracked.",
        icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
    },
    {
        num: "02",
        title: "Write rich reviews",
        body: "Full markdown support — headings, spoiler warnings, tables. Rate out of 10 with decimal precision. Your thoughts, beautifully formatted.",
        icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
    },
    {
        num: "03",
        title: "Discover what's next",
        body: "Personalized AI recommendations based on your genre breakdown, ratings, and watch history. Or describe a mood and let AI interpret it.",
        icon: (
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        ),
    },
];

function HowItWorks() {
    return (
        <section className="bg-white py-28">
            <div className="mx-auto max-w-5xl px-4">
                <div className="mx-auto mb-16 max-w-xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Up and running in minutes
                    </h2>
                    <p className="mt-4 text-slate-500">No spreadsheets. No browser bookmarks. Just your perfect drama log.</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                    {STEPS.map((step) => (
                        <div
                            key={step.num}
                            className="group relative rounded-2xl border border-slate-200 bg-white p-7 transition-shadow hover:shadow-lg"
                        >
                            <div className="absolute -top-3 left-6 rounded-md bg-violet-600 px-2.5 py-0.5 text-xs font-bold text-white">
                                {step.num}
                            </div>
                            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                {step.icon}
                            </div>
                            <h3 className="mb-2 font-semibold text-slate-900">{step.title}</h3>
                            <p className="text-sm leading-relaxed text-slate-500">{step.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function FinalCTA() {
    return (
        <section className="relative overflow-hidden bg-slate-950 py-28">
            {/* Glow */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(124,58,237,0.25) 0%, transparent 70%)",
                }}
            />
            <div className="relative mx-auto max-w-2xl px-4 text-center">
                <p className="mb-4 text-sm font-medium uppercase tracking-widest text-violet-400">
                    Ready?
                </p>
                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Your next favourite drama
                    <br />
                    is one click away.
                </h2>
                <p className="mt-5 text-slate-400">
                    Sign up with Google, GitHub, or email. Your first show takes 30 seconds to add.
                </p>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <Link
                        href="/signup"
                        className="rounded-xl bg-violet-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-xl"
                    >
                        Create your account — it&apos;s free
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-xl border border-slate-700 px-8 py-3.5 text-sm font-semibold text-slate-400 transition-all hover:border-slate-500 hover:text-white"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </section>
    );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
    return (
        <footer className="border-t border-slate-800 bg-slate-950 py-8">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-500 sm:flex-row">
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-800">
                        <BookOpen className="h-3 w-3 text-slate-400" strokeWidth={2} />
                    </div>
                    <span className="font-medium text-slate-300">Dramalist</span>
                </div>
                <p>Track the stories that move you.</p>
            </div>
        </footer>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
    return (
        <div className="min-h-screen">
            <Nav />
            <Hero />
            <BentoSection />
            <HowItWorks />
            <MoodDemoSection />
            <FinalCTA />
            <Footer />
        </div>
    );
}
