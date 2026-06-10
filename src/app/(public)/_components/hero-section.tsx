import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/shared/page-container";
import { AppPreview } from "./app-preview";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden py-12 md:py-20">
            {/* Pastel background blobs */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-24 -right-40 size-125 rounded-full bg-linear-to-bl from-rose-200/40 via-pink-200/25 to-transparent blur-3xl dark:from-rose-800/15 dark:via-pink-800/8 dark:to-transparent"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 -left-24 h-95 w-105 rounded-full bg-linear-to-tr from-violet-200/40 via-fuchsia-200/20 to-transparent blur-3xl dark:from-violet-900/18 dark:via-fuchsia-900/8 dark:to-transparent"
            />

            <PageContainer
                size="default"
                className="sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl"
            >
                <div className="grid grid-cols-1 items-center gap-8 md:gap-10 lg:grid-cols-2 lg:gap-12">
                    {/* ── Left: copy ───────────────────────────────────── */}
                    <div className="flex flex-col items-center gap-5 lg:items-start">
                        {/* Overline pill */}
                        <div className="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-[10px] font-semibold tracking-widest text-violet-700 uppercase dark:bg-violet-950/50 dark:text-violet-400">
                            Track · Discover · Review
                        </div>

                        {/* Headline */}
                        <h1 className="font-hand text-foreground text-center text-4xl leading-[1.1] tracking-normal md:text-5xl lg:text-left lg:text-6xl">
                            Your drama journey,
                            <br />
                            <span className="relative inline-block text-violet-600 dark:text-violet-400">
                                beautifully tracked.
                                {/* Wavy underline */}
                                <span
                                    aria-hidden
                                    className="absolute right-0 -bottom-1 left-0 overflow-hidden"
                                >
                                    <svg
                                        viewBox="0 0 300 8"
                                        preserveAspectRatio="none"
                                        className="h-1.5 w-full"
                                    >
                                        <path
                                            d="M0,4 C37.5,0 37.5,8 75,4 C112.5,0 112.5,8 150,4 C187.5,0 187.5,8 225,4 C262.5,0 262.5,8 300,4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            className="text-violet-400/60 dark:text-violet-500/50"
                                        />
                                    </svg>
                                </span>
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-muted-foreground max-w-md text-center text-sm leading-relaxed md:text-base lg:text-left">
                            Build your personal drama library, write rich reviews, and let AI
                            surface your next obsession — all in one place.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            <Button size="sm" className="lg:h-10 lg:px-5 lg:text-sm" asChild>
                                <Link href="/signup">
                                    Get started free
                                    <ArrowRight className="ml-1 h-3.5 w-3.5 lg:h-4 lg:w-4" />
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="lg:h-10 lg:px-5 lg:text-sm"
                                asChild
                            >
                                <Link href="/catalog">Browse catalog</Link>
                            </Button>
                        </div>
                    </div>

                    {/* ── Right: app preview ───────────────────────────── */}
                    <div className="lg:pl-2">
                        <AppPreview />
                    </div>
                </div>
            </PageContainer>
        </section>
    );
}
