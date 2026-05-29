"use client";

import Link from "next/link";
import type { Show } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShowStatusBadge } from "./show-status-badge";

interface ShowCardProps {
    show: Show;
    /** "default" shows user-specific data (status, progress). "public" hides it. */
    variant?: "default" | "public";
    /** Rendered in the card footer area — action buttons, links, etc. */
    actions?: React.ReactNode;
    onClick?: () => void;
    /** If provided, wraps the card in a Next.js Link. */
    href?: string;
}

export function ShowCard({ show, variant = "default", actions, onClick, href }: ShowCardProps) {
    const episodeLabel =
        show.episode_count != null
            ? `${show.episodes_watched} / ${show.episode_count} ep`
            : show.episodes_watched > 0
              ? `${show.episodes_watched} ep watched`
              : null;

    const card = (
        <Card
            onClick={onClick}
            className={
                onClick || href
                    ? "cursor-pointer transition-shadow hover:shadow-md"
                    : undefined
            }
        >
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                        <CardTitle className="line-clamp-2 text-base leading-tight">
                            {show.title}
                        </CardTitle>
                        {show.original_title && (
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {show.original_title}
                            </p>
                        )}
                    </div>
                    {variant === "default" && <ShowStatusBadge status={show.status} />}
                </div>
            </CardHeader>

            <CardContent className="space-y-2">
                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {show.year && <span>{show.year}</span>}
                    {show.country && <span>{show.country}</span>}
                    {variant === "default" && episodeLabel && <span>{episodeLabel}</span>}
                </div>

                {/* Genres */}
                {show.genre.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {show.genre.slice(0, 3).map((g) => (
                            <Badge key={g} variant="secondary" className="text-xs">
                                {g}
                            </Badge>
                        ))}
                        {show.genre.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{show.genre.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {actions && <div className="pt-1">{actions}</div>}
            </CardContent>
        </Card>
    );

    if (href) {
        return (
            <Link href={href} className="block">
                {card}
            </Link>
        );
    }
    return card;
}
