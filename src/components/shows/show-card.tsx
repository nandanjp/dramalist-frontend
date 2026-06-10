"use client";

import Link from "next/link";
import type { UserListEntry } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShowStatusBadge } from "./show-status-badge";

interface ShowCardProps {
    entry: UserListEntry;
    /** "default" shows user-specific data (status, progress). "public" hides it. */
    variant?: "default" | "public";
    actions?: React.ReactNode;
    onClick?: () => void;
    href?: string;
}

export function ShowCard({ entry, variant = "default", actions, onClick, href }: ShowCardProps) {
    const episodeLabel =
        entry.episode_count != null
            ? `${entry.episodes_watched} / ${entry.episode_count} ep`
            : entry.episodes_watched > 0
              ? `${entry.episodes_watched} ep watched`
              : null;

    const resolvedHref = href ?? `/catalog/${entry.catalog_id}`;

    const card = (
        <Card
            onClick={onClick}
            className={
                onClick || href ? "cursor-pointer transition-shadow hover:shadow-md" : undefined
            }
        >
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <CardTitle className="line-clamp-2 text-base leading-tight">
                            {entry.title}
                        </CardTitle>
                        {entry.original_title && (
                            <p className="text-muted-foreground mt-0.5 truncate text-xs">
                                {entry.original_title}
                            </p>
                        )}
                    </div>
                    {variant === "default" && <ShowStatusBadge status={entry.status} />}
                </div>
            </CardHeader>

            <CardContent className="space-y-2">
                <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {entry.year && <span>{entry.year}</span>}
                    {entry.country && <span>{entry.country}</span>}
                    {variant === "default" && episodeLabel && <span>{episodeLabel}</span>}
                </div>

                {entry.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {entry.genre.slice(0, 3).map((g) => (
                            <Badge key={g} variant="secondary" className="text-xs">
                                {g}
                            </Badge>
                        ))}
                        {entry.genre.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{entry.genre.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {actions && <div className="pt-1">{actions}</div>}
            </CardContent>
        </Card>
    );

    if (href !== undefined) {
        return (
            <Link href={href} className="block">
                {card}
            </Link>
        );
    }
    return (
        <Link href={resolvedHref} className="block">
            {card}
        </Link>
    );
}
