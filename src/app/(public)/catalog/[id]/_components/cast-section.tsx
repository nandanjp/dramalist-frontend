"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { CastMember, CastRole } from "@/lib/types";

const ROLE_LABEL: Record<CastRole, string> = {
    main: "Main",
    supporting: "Supporting",
    guest: "Guest",
};

const ROLE_DOT: Record<CastRole, string> = {
    main: "bg-violet-500",
    supporting: "bg-zinc-400 dark:bg-zinc-500",
    guest: "bg-amber-400",
};

const ROLE_TEXT: Record<CastRole, string> = {
    main: "text-violet-600 dark:text-violet-400",
    supporting: "text-zinc-500 dark:text-zinc-400",
    guest: "text-amber-600 dark:text-amber-400",
};

const AVATAR_GRADIENT = [
    "from-violet-400 to-fuchsia-500",
    "from-indigo-400 to-violet-500",
    "from-fuchsia-400 to-rose-400",
    "from-purple-400 to-indigo-400",
    "from-violet-500 to-purple-600",
];

function initials(name: string) {
    return name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0] ?? "")
        .join("")
        .toUpperCase();
}

const ease = [0.22, 1, 0.36, 1] as const;

interface CastSectionProps {
    cast: CastMember[];
}

export function CastSection({ cast }: CastSectionProps) {
    const sorted = [...cast].sort((a, b) => {
        const order: Record<CastRole, number> = { main: 0, supporting: 1, guest: 2 };
        if (order[a.role] !== order[b.role]) return order[a.role] - order[b.role];
        return a.sort_order - b.sort_order;
    });

    return (
        <section className="container py-10">
            {/* Section header */}
            <motion.div
                className="mb-7 flex items-end gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease }}
            >
                <div>
                    <div className="mb-1.5 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-violet-700 dark:bg-violet-950/50 dark:text-violet-400">
                        Cast
                    </div>
                    <h2 className="font-display text-xl italic text-foreground">The Ensemble</h2>
                </div>
                <span className="mb-0.5 font-mono text-[12px] tabular-nums text-muted-foreground/45">
                    {sorted.length}
                </span>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {sorted.map((member, index) => {
                    const gradient = AVATAR_GRADIENT[index % AVATAR_GRADIENT.length];
                    return (
                        <motion.div
                            key={member.cast_id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: Math.min(index * 0.04, 0.35),
                                ease,
                            }}
                            className="group flex flex-col items-center gap-2.5 rounded-2xl bg-muted/25 p-4 text-center transition-all duration-300 hover:bg-muted/50 hover:shadow-[0_4px_20px_rgba(0,0,0,0.07)] dark:bg-white/[0.025] dark:hover:bg-white/[0.05] dark:hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                        >
                            {/* Avatar — gradient initials circle */}
                            <div
                                className={cn(
                                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[15px] font-semibold tracking-wide text-white transition-transform duration-300 group-hover:scale-[1.05]",
                                    gradient,
                                )}
                                style={{
                                    boxShadow:
                                        "0 2px 6px rgba(0,0,0,0.14), 0 1px 2px rgba(0,0,0,0.08)",
                                }}
                            >
                                {initials(member.actor_name)}
                            </div>

                            {/* Name + character */}
                            <div className="min-w-0 w-full space-y-0.5">
                                <p className="truncate text-[13px] font-medium text-foreground">
                                    {member.actor_name}
                                </p>
                                {member.character_name && (
                                    <p className="truncate text-[11px] text-muted-foreground/65">
                                        {member.character_name}
                                    </p>
                                )}
                            </div>

                            {/* Role — dot + label, no chip box */}
                            <div
                                className={cn(
                                    "flex items-center gap-1 text-[10px] font-medium",
                                    ROLE_TEXT[member.role],
                                )}
                            >
                                <span
                                    className={cn("h-1.5 w-1.5 rounded-full", ROLE_DOT[member.role])}
                                />
                                {ROLE_LABEL[member.role]}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
