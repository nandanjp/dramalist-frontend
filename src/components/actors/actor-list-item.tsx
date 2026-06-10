"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProgressiveImage } from "@/components/shared/progressive-image";

interface ActorListItemProps {
    name: string;
    imageUrl?: string | null;
    /** Primary subtitle — character name, role, etc. */
    subtitle?: string | null;
    /** Secondary detail — nationality, show count, etc. */
    detail?: string | null;
    href?: string;
    /** Slot for row actions */
    actions?: React.ReactNode;
    className?: string;
}

function Avatar({ name, imageUrl }: { name: string; imageUrl?: string | null }) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    const fallback = (
        <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-[11px] font-semibold text-zinc-400 dark:bg-zinc-800">
            {initials}
        </div>
    );

    return (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            {imageUrl ? (
                <ProgressiveImage
                    src={imageUrl}
                    alt={name}
                    className="absolute inset-0 rounded-full"
                    fallback={fallback}
                />
            ) : (
                fallback
            )}
        </div>
    );
}

export function ActorListItem({
    name,
    imageUrl,
    subtitle,
    detail,
    href,
    actions,
    className,
}: ActorListItemProps) {
    const row = (
        <div className={cn("flex items-center gap-3", className)}>
            <Avatar name={name} imageUrl={imageUrl} />
            <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">{name}</p>
                {subtitle && <p className="text-muted-foreground truncate text-xs">{subtitle}</p>}
                {detail && <p className="text-muted-foreground/60 truncate text-xs">{detail}</p>}
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
        </div>
    );

    if (href) {
        return (
            <Link
                href={href}
                className="hover:bg-muted/40 -mx-2 -my-1 block rounded-lg px-2 py-1 transition-colors"
            >
                {row}
            </Link>
        );
    }
    return row;
}
