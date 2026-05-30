import { BookOpen, Check } from "lucide-react";

const HIGHLIGHTS = [
    "Rich reviews with full markdown support",
    "AI-powered personalized recommendations",
    "Discover your next favourite drama",
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-svh">
            {/* Brand panel — hidden on mobile */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-[#0f172a] p-10 text-white">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                        <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-semibold tracking-tight">Dramalist</span>
                </div>

                <div className="space-y-6">
                    <p className="text-2xl font-medium leading-snug text-white/90">
                        Track the stories that move you.
                    </p>
                    <ul className="space-y-3">
                        {HIGHLIGHTS.map((item) => (
                            <li key={item} className="flex items-center gap-3 text-sm text-white/70">
                                <Check className="h-4 w-4 shrink-0 text-white/50" />
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="text-xs text-white/30">© {new Date().getFullYear()} Dramalist</p>
            </div>

            {/* Form panel */}
            <div className="flex flex-1 flex-col items-center justify-center bg-background p-4 sm:p-8">
                {children}
            </div>
        </div>
    );
}
