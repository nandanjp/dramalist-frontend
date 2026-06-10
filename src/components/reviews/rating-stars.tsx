"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Read-only display ─────────────────────────────────────────────────────────

interface RatingStarsProps {
    rating: number;
    max?: number;
    className?: string;
}

export function RatingStars({ rating, max = 10, className }: RatingStarsProps) {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1;
    const emptyStars = Math.floor(max / 2) - fullStars - (halfStar ? 1 : 0);

    return (
        <span
            className={cn("flex items-center gap-0.5", className)}
            aria-label={`${rating} / ${max}`}
        >
            {Array.from({ length: fullStars }).map((_, i) => (
                <Star key={`f${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            ))}
            {halfStar && (
                <span className="relative inline-block h-4 w-4">
                    <Star className="absolute inset-0 h-4 w-4 text-yellow-400" />
                    <Star
                        className="absolute inset-0 h-4 w-4 fill-yellow-400 text-yellow-400"
                        style={{ clipPath: "inset(0 50% 0 0)" }}
                    />
                </span>
            )}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <Star key={`e${i}`} className="text-muted-foreground/40 h-4 w-4" />
            ))}
            <span className="text-muted-foreground ml-1 text-xs tabular-nums">
                {rating}/{max}
            </span>
        </span>
    );
}

// ── Interactive input ─────────────────────────────────────────────────────────

interface RatingInputProps {
    value: number;
    onChange: (value: number) => void;
    max?: number;
    className?: string;
}

export function RatingInput({ value, onChange, max = 10, className }: RatingInputProps) {
    const [hovered, setHovered] = React.useState<number | null>(null);
    const starCount = max / 2;
    const display = hovered ?? value;

    return (
        <div className={cn("flex items-center gap-1", className)} role="group" aria-label="Rating">
            {Array.from({ length: starCount }).map((_, i) => {
                const full = (i + 1) * 2;
                const half = full - 1;
                const isFull = display >= full;
                const isHalf = !isFull && display >= half;

                return (
                    <span
                        key={i}
                        className="relative inline-block h-6 w-6 cursor-pointer"
                        onMouseLeave={() => setHovered(null)}
                    >
                        {/* Left half → half-star */}
                        <span
                            className="absolute inset-y-0 left-0 w-1/2"
                            onMouseEnter={() => setHovered(half)}
                            onClick={() => onChange(half)}
                        />
                        {/* Right half → full star */}
                        <span
                            className="absolute inset-y-0 right-0 w-1/2"
                            onMouseEnter={() => setHovered(full)}
                            onClick={() => onChange(full)}
                        />
                        <Star
                            className={cn(
                                "pointer-events-none h-6 w-6 transition-colors",
                                isFull
                                    ? "fill-yellow-400 text-yellow-400"
                                    : isHalf
                                      ? "text-yellow-400"
                                      : "text-muted-foreground/40",
                            )}
                            style={isHalf ? { clipPath: "inset(0 50% 0 0)" } : undefined}
                        />
                        {isHalf && (
                            <Star
                                className="pointer-events-none absolute inset-0 h-6 w-6 fill-yellow-400 text-yellow-400"
                                style={{ clipPath: "inset(0 50% 0 0)" }}
                            />
                        )}
                    </span>
                );
            })}
            <span className="text-muted-foreground ml-1 w-8 text-sm tabular-nums">
                {display}/10
            </span>
        </div>
    );
}
