"use client";

import * as React from "react";
import Link from "next/link";

interface MoodResult {
    query: string;
    genres: string[];
    tags: string[];
}

const EXAMPLE_PROMPTS = [
    "Something emotional with a slow-burn romance",
    "A gripping mystery set in historical Korea",
    "Light-hearted office romance with great chemistry",
    "An epic fantasy with incredible world-building",
];

export function MoodDemoSection() {
    const [prompt, setPrompt] = React.useState("");
    const [result, setResult] = React.useState<MoodResult | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [exampleIndex, setExampleIndex] = React.useState(0);

    // Cycle the placeholder text
    React.useEffect(() => {
        const t = setInterval(() => {
            setExampleIndex((i) => (i + 1) % EXAMPLE_PROMPTS.length);
        }, 3500);
        return () => clearInterval(t);
    }, []);

    async function handleSearch() {
        const text = prompt.trim();
        if (!text || loading) return;
        setLoading(true);
        setError(false);
        setResult(null);
        try {
            const res = await fetch("/api/ai/mood-search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: text }),
            });
            if (!res.ok) throw new Error();
            const data: MoodResult = await res.json();
            setResult(data);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    }

    function applyExample(p: string) {
        setPrompt(p);
        setResult(null);
        setError(false);
    }

    return (
        <section className="bg-slate-950 py-28">
            <div className="mx-auto max-w-3xl px-4">
                {/* Heading */}
                <div className="mb-12 text-center">
                    <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI-powered
                    </span>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Describe your mood.<br />
                        <span className="text-violet-400">Find your next drama.</span>
                    </h2>
                    <p className="mt-4 text-slate-400">
                        Try it right now — no account needed.
                    </p>
                </div>

                {/* Example prompts */}
                <div className="mb-4 flex flex-wrap justify-center gap-2">
                    {EXAMPLE_PROMPTS.map((p) => (
                        <button
                            key={p}
                            onClick={() => applyExample(p)}
                            className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400 transition-colors hover:border-violet-500/50 hover:text-violet-400"
                        >
                            {p}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={3}
                        placeholder={`e.g. "${EXAMPLE_PROMPTS[exampleIndex]}"`}
                        className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900 px-5 py-4 pr-36 text-sm text-slate-200 placeholder:text-slate-600 focus:border-violet-500/50 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                    <button
                        onClick={handleSearch}
                        disabled={!prompt.trim() || loading}
                        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-violet-500 disabled:opacity-40"
                    >
                        {loading ? (
                            <>
                                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Thinking…
                            </>
                        ) : (
                            <>
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Search
                            </>
                        )}
                    </button>
                </div>

                {/* Result */}
                {result && (
                    <div className="mt-6 animate-fade-up rounded-2xl border border-slate-700 bg-slate-900 p-6">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
                            Interpreted as
                        </p>
                        <p className="mb-5 text-sm italic text-slate-300">
                            &ldquo;{result.query}&rdquo;
                        </p>
                        <div className="space-y-3">
                            {result.genres.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs text-slate-500">Genres</span>
                                    {result.genres.map((g) => (
                                        <span
                                            key={g}
                                            className="rounded-full bg-violet-500/15 px-2.5 py-0.5 text-xs font-medium capitalize text-violet-400"
                                        >
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {result.tags.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-xs text-slate-500">Tags</span>
                                    {result.tags.map((t) => (
                                        <span
                                            key={t}
                                            className="rounded-full border border-slate-700 px-2.5 py-0.5 text-xs capitalize text-slate-400"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-5 border-t border-slate-800 pt-4 text-center">
                            <p className="text-xs text-slate-500">
                                Sign up to search your personal list and get recommendations based on your history.
                            </p>
                            <Link
                                href="/signup"
                                className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-500"
                            >
                                Get started — it&apos;s free
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="mt-4 text-center text-sm text-slate-500">
                        Couldn&apos;t reach the AI right now. <button onClick={handleSearch} className="text-violet-400 underline">Try again</button>
                    </p>
                )}
            </div>
        </section>
    );
}
