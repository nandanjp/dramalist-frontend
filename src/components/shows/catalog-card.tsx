"use client";

import Link from "next/link";
import type { CatalogEntry } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CatalogCardProps {
    entry: CatalogEntry;
    actions?: React.ReactNode;
}

export function CatalogCard({ entry, actions }: CatalogCardProps) {
    return (
        <Link href={`/catalog/${entry.id}`} className="block">
            <Card className="flex h-full flex-col transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <CardTitle className="line-clamp-2 text-base leading-tight">
                                {entry.title}
                            </CardTitle>
                            {entry.original_title && (
                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                    {entry.original_title}
                                </p>
                            )}
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs capitalize">
                            {entry.media_type}
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-between space-y-2">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        {entry.year && <span>{entry.year}</span>}
                        {entry.country && <span>{entry.country}</span>}
                        <span className="capitalize">{entry.airing_status}</span>
                    </div>

                    {entry.synopsis && (
                        <p className="line-clamp-2 text-xs text-muted-foreground">{entry.synopsis}</p>
                    )}

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
        </Link>
    );
}
