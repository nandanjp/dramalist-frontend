"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
    src: string;
    alt: string;
    /** Applied to the wrapper div — use this for sizing and rounding */
    className?: string;
    /** Rendered when the image fails to load */
    fallback: React.ReactNode;
    /**
     * Passed to Next.js Image to help the browser pick the right srcset entry.
     * Defaults to a sensible card-grid breakpoint set.
     */
    sizes?: string;
}

const DEFAULT_SIZES =
    "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw";

/**
 * Renders a skeleton while the image loads, then crossfades it in.
 * Falls back to the provided ReactNode on error.
 *
 * The parent is responsible for setting dimensions — this component
 * fills 100% of its container.
 */
export function ProgressiveImage({ src, alt, className, fallback, sizes }: ProgressiveImageProps) {
    const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

    if (status === "error") return <>{fallback}</>;

    return (
        <div className={cn("relative overflow-hidden", className)}>
            {status === "loading" && (
                <div className="absolute inset-0 animate-pulse bg-zinc-100 dark:bg-zinc-800" />
            )}
            <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes ?? DEFAULT_SIZES}
                className={cn(
                    "object-cover transition-opacity duration-300",
                    status === "loaded" ? "opacity-100" : "opacity-0",
                )}
                onLoad={() => setStatus("loaded")}
                onError={() => setStatus("error")}
            />
        </div>
    );
}
