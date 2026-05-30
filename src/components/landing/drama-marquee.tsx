"use client";

interface DramaCard {
    title: string;
    originalTitle: string;
    year: number;
    genres: string[];
    rating: number;
}

const ROW_ONE: DramaCard[] = [
    { title: "Goblin", originalTitle: "도깨비", year: 2016, genres: ["Fantasy", "Romance"], rating: 9.8 },
    { title: "Alchemy of Souls", originalTitle: "환혼", year: 2022, genres: ["Fantasy", "Romance"], rating: 9.5 },
    { title: "Mr. Sunshine", originalTitle: "미스터 션샤인", year: 2018, genres: ["Historical", "Romance"], rating: 9.6 },
    { title: "Reply 1988", originalTitle: "응답하라 1988", year: 2015, genres: ["Slice of Life", "Comedy"], rating: 9.9 },
    { title: "My Love from the Star", originalTitle: "별에서 온 그대", year: 2013, genres: ["Fantasy", "Romance"], rating: 9.4 },
    { title: "Twenty-Five Twenty-One", originalTitle: "스물다섯 스물하나", year: 2022, genres: ["Romance", "Drama"], rating: 9.3 },
    { title: "Signal", originalTitle: "시그널", year: 2016, genres: ["Crime", "Mystery"], rating: 9.7 },
    { title: "Moving", originalTitle: "무빙", year: 2023, genres: ["Action", "Thriller"], rating: 9.5 },
];

const ROW_TWO: DramaCard[] = [
    { title: "Crash Landing on You", originalTitle: "사랑의 불시착", year: 2019, genres: ["Romance", "Drama"], rating: 9.7 },
    { title: "Flower of Evil", originalTitle: "악의 꽃", year: 2020, genres: ["Thriller", "Mystery"], rating: 9.6 },
    { title: "Vincenzo", originalTitle: "빈센조", year: 2021, genres: ["Crime", "Comedy"], rating: 9.5 },
    { title: "Business Proposal", originalTitle: "사내맞선", year: 2022, genres: ["Romance", "Comedy"], rating: 9.2 },
    { title: "Kingdom", originalTitle: "킹덤", year: 2019, genres: ["Historical", "Horror"], rating: 9.4 },
    { title: "My Mister", originalTitle: "나의 아저씨", year: 2018, genres: ["Drama"], rating: 9.8 },
    { title: "Itaewon Class", originalTitle: "이태원클라쓰", year: 2020, genres: ["Drama", "Romance"], rating: 9.3 },
    { title: "Squid Game", originalTitle: "오징어 게임", year: 2021, genres: ["Thriller", "Horror"], rating: 9.0 },
];

function Card({ drama }: { drama: DramaCard }) {
    return (
        <div className="mx-2 flex w-52 shrink-0 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{drama.title}</p>
                    <p className="truncate text-xs text-slate-400">{drama.originalTitle}</p>
                </div>
                <span className="shrink-0 text-xs font-bold text-violet-600">
                    ★ {drama.rating}
                </span>
            </div>
            <div className="flex flex-wrap gap-1">
                {drama.genres.map((g) => (
                    <span
                        key={g}
                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                        {g}
                    </span>
                ))}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-400">
                    {drama.year}
                </span>
            </div>
        </div>
    );
}

export function DramaMarquee() {
    const doubled1 = [...ROW_ONE, ...ROW_ONE];
    const doubled2 = [...ROW_TWO, ...ROW_TWO];

    return (
        <div className="relative overflow-hidden py-4">
            {/* Fade masks */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />

            {/* Row 1 — left */}
            <div className="flex animate-marquee hover:[animation-play-state:paused]">
                {doubled1.map((d, i) => (
                    <Card key={`r1-${i}`} drama={d} />
                ))}
            </div>

            {/* Row 2 — right */}
            <div className="mt-3 flex animate-marquee-reverse hover:[animation-play-state:paused]">
                {doubled2.map((d, i) => (
                    <Card key={`r2-${i}`} drama={d} />
                ))}
            </div>
        </div>
    );
}
