"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProgressiveImage } from "@/components/shared/progressive-image";

interface ActorCardProps {
    name: string;
    imageUrl?: string | null;
    /** Second line below the name — character name, nationality, etc. */
    subtitle?: string | null;
    /** If provided, the card wraps in a Link */
    href?: string;
    className?: string;
}

function Initials({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    return (
        <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-sm font-semibold text-zinc-400 dark:bg-zinc-800">
            {initials}
        </div>
    );
}

export function ActorCard({ name, imageUrl, subtitle, href, className }: ActorCardProps) {
    const content = (
        <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
            {/* Photo */}
            <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                {imageUrl ? (
                    <ProgressiveImage
                        src={imageUrl}
                        alt={name}
                        className="absolute inset-0"
                        fallback={<Initials name={name} />}
                    />
                ) : (
                    <Initials name={name} />
                )}
            </div>
            {/* Name + subtitle */}
            <div className="w-full space-y-0.5 px-0.5">
                <p className="text-foreground line-clamp-2 text-sm leading-tight font-medium">
                    {name}
                </p>
                {subtitle && <p className="text-muted-foreground truncate text-xs">{subtitle}</p>}
            </div>
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block transition-opacity hover:opacity-80">
                {content}
            </Link>
        );
    }
    return content;
}
