"use client";

import * as React from "react";

// ── Shared tile wrapper ───────────────────────────────────────────────────────

function Tile({
    className = "",
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}
        >
            {children}
        </div>
    );
}

function TileHeader({ label, icon }: { label: string; icon: React.ReactNode }) {
    return (
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3.5">
            <span className="text-violet-600">{icon}</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                {label}
            </span>
        </div>
    );
}

// ── Tile 1: My List ───────────────────────────────────────────────────────────

const MOCK_SHOWS = [
    { title: "Goblin", status: "Completed", rating: "9.8", ep: "16/16" },
    { title: "Alchemy of Souls", status: "Completed", rating: "9.5", ep: "30/30" },
    { title: "Signal", status: "Completed", rating: "9.7", ep: "16/16" },
    { title: "Vincenzo", status: "Watching", rating: "—", ep: "8/20" },
    { title: "Moving", status: "Plan to watch", rating: "—", ep: "0/20" },
];

const STATUS_COLORS: Record<string, string> = {
    "Completed": "bg-emerald-100 text-emerald-700",
    "Watching": "bg-blue-100 text-blue-700",
    "Plan to watch": "bg-slate-100 text-slate-500",
};

function MyListTile() {
    const [visible, setVisible] = React.useState(0);

    React.useEffect(() => {
        if (visible >= MOCK_SHOWS.length) return;
        const t = setTimeout(() => setVisible((v) => v + 1), 280);
        return () => clearTimeout(t);
    }, [visible]);

    return (
        <Tile className="sm:col-span-2 lg:col-span-1 lg:row-span-2">
            <TileHeader
                label="My List"
                icon={
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                }
            />
            {/* Filter bar */}
            <div className="flex gap-1.5 border-b border-slate-100 px-5 py-2.5">
                {["All", "Watching", "Completed"].map((f, i) => (
                    <span
                        key={f}
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                            i === 0
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-500"
                        }`}
                    >
                        {f}
                    </span>
                ))}
            </div>
            <div className="divide-y divide-slate-50 px-5">
                {MOCK_SHOWS.slice(0, visible).map((show) => (
                    <div
                        key={show.title}
                        className="flex items-center gap-3 py-3 animate-fade-up"
                    >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                            <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <rect x="2" y="3" width="20" height="14" rx="2" />
                                <path d="M8 21h8M12 17v4" />
                            </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">{show.title}</p>
                            <p className="text-[10px] text-slate-400">{show.ep} episodes</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_COLORS[show.status]}`}>
                            {show.status}
                        </span>
                        <span className="w-6 shrink-0 text-right text-xs font-bold text-violet-600">
                            {show.rating}
                        </span>
                    </div>
                ))}
            </div>
        </Tile>
    );
}

// ── Tile 2: Reviews ───────────────────────────────────────────────────────────

const REVIEW_TEXT = "The chemistry between the leads is absolutely unmatched. One of the most re-watchable shows ever made — every scene feels alive with feeling.";

function ReviewsTile() {
    const [chars, setChars] = React.useState(0);
    const [started, setStarted] = React.useState(false);

    React.useEffect(() => {
        const delay = setTimeout(() => setStarted(true), 600);
        return () => clearTimeout(delay);
    }, []);

    React.useEffect(() => {
        if (!started || chars >= REVIEW_TEXT.length) return;
        const t = setTimeout(() => setChars((c) => c + 1), 18);
        return () => clearTimeout(t);
    }, [started, chars]);

    return (
        <Tile>
            <TileHeader
                label="Reviews"
                icon={
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                }
            />
            <div className="p-5">
                <div className="mb-3 flex items-center gap-0.5">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full ${i < 9 ? "bg-violet-500" : "bg-slate-200"}`}
                        />
                    ))}
                    <span className="ml-2 text-sm font-bold text-slate-800">9.8</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600">
                    {REVIEW_TEXT.slice(0, chars)}
                    {chars < REVIEW_TEXT.length && (
                        <span className="ml-px inline-block h-3.5 w-px animate-pulse bg-slate-400" />
                    )}
                </p>
                <p className="mt-3 text-right text-xs font-medium text-slate-400">— Goblin</p>
            </div>
        </Tile>
    );
}

// ── Tile 3: AI Picks ──────────────────────────────────────────────────────────

const AI_PICKS = [
    { title: "Mr. Sunshine", reason: "Sweeping historical epic with the same emotional depth you love." },
    { title: "My Mister", reason: "A quiet, profound drama for fans of slow-burn storytelling." },
    { title: "Signal", reason: "Gripping mystery that keeps you guessing until the final frame." },
];

function AiPicksTile() {
    const [visible, setVisible] = React.useState(0);

    React.useEffect(() => {
        if (visible >= AI_PICKS.length) return;
        const t = setTimeout(() => setVisible((v) => v + 1), 500);
        return () => clearTimeout(t);
    }, [visible]);

    return (
        <Tile>
            <TileHeader
                label="AI Picks"
                icon={
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                    </svg>
                }
            />
            <div className="space-y-2 p-4">
                {AI_PICKS.slice(0, visible).map((pick) => (
                    <div
                        key={pick.title}
                        className="rounded-xl bg-slate-50 p-3 animate-fade-up"
                    >
                        <p className="text-xs font-semibold text-slate-800">{pick.title}</p>
                        <p className="mt-0.5 text-[10px] leading-relaxed text-slate-500">{pick.reason}</p>
                    </div>
                ))}
                {visible === 0 && (
                    <div className="flex items-center gap-2 py-2">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:0ms]" />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:150ms]" />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-400 [animation-delay:300ms]" />
                        <span className="text-[10px] text-slate-400">Analysing your taste…</span>
                    </div>
                )}
            </div>
        </Tile>
    );
}

// ── Tile 4: Watch Stats ───────────────────────────────────────────────────────

const GENRES = [
    { name: "Romance", pct: 82 },
    { name: "Fantasy", pct: 64 },
    { name: "Thriller", pct: 45 },
    { name: "Drama", pct: 38 },
];

function StatsTile() {
    const [animated, setAnimated] = React.useState(false);

    React.useEffect(() => {
        const t = setTimeout(() => setAnimated(true), 300);
        return () => clearTimeout(t);
    }, []);

    return (
        <Tile>
            <TileHeader
                label="Watch Stats"
                icon={
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                }
            />
            <div className="p-4">
                <div className="mb-3 flex gap-4">
                    <div>
                        <p className="text-lg font-bold text-slate-900">24</p>
                        <p className="text-[10px] text-slate-400">Shows</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-slate-900">312</p>
                        <p className="text-[10px] text-slate-400">Episodes</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-violet-600">9.3</p>
                        <p className="text-[10px] text-slate-400">Avg rating</p>
                    </div>
                </div>
                <div className="space-y-2">
                    {GENRES.map((g) => (
                        <div key={g.name}>
                            <div className="mb-0.5 flex justify-between">
                                <span className="text-[10px] text-slate-500">{g.name}</span>
                                <span className="text-[10px] font-medium text-slate-600">{g.pct}%</span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                <div
                                    className="h-full rounded-full bg-violet-500 transition-all duration-1000 ease-out"
                                    style={{ width: animated ? `${g.pct}%` : "0%" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Tile>
    );
}

// ── Tile 5: Public Profile ────────────────────────────────────────────────────

function ProfileTile() {
    return (
        <Tile>
            <TileHeader
                label="Public Profile"
                icon={
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                }
            />
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                        N
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">dramafan</p>
                        <p className="text-[10px] text-slate-400">dramalist.app/@dramafan</p>
                    </div>
                </div>
                <div className="mt-3 flex gap-4 border-t border-slate-100 pt-3">
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-900">24</p>
                        <p className="text-[10px] text-slate-400">Shows</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-slate-900">18</p>
                        <p className="text-[10px] text-slate-400">Reviews</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-bold text-violet-600">Romance</p>
                        <p className="text-[10px] text-slate-400">Top genre</p>
                    </div>
                </div>
            </div>
        </Tile>
    );
}

// ── Grid ──────────────────────────────────────────────────────────────────────

export function BentoGrid() {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MyListTile />
            <ReviewsTile />
            <AiPicksTile />
            <StatsTile />
            <ProfileTile />
        </div>
    );
}
