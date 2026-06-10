import * as React from "react";
import { cn } from "@/lib/utils";

// Page-level headline — use once per page
export function PageTitle({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h1
            className={cn(
                "text-foreground text-2xl font-semibold tracking-tight md:text-3xl lg:text-4xl",
                className,
            )}
            {...props}
        >
            {children}
        </h1>
    );
}

// Section header — "Trending", "My List", etc.
export function SectionTitle({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2
            className={cn(
                "text-foreground text-base font-semibold tracking-tight md:text-lg",
                className,
            )}
            {...props}
        >
            {children}
        </h2>
    );
}

// Eyebrow / overline — "LIBRARY", "12 TITLES", section labels
export function Overline({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn(
                "text-muted-foreground/60 text-[10px] font-semibold tracking-widest uppercase md:text-[11px]",
                className,
            )}
            {...props}
        >
            {children}
        </p>
    );
}

// Standard body copy
export function Body({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn("text-foreground text-sm leading-relaxed md:text-base", className)}
            {...props}
        >
            {children}
        </p>
    );
}

// Secondary body — descriptions, helper text
export function BodyMuted({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn(
                "text-muted-foreground text-sm leading-relaxed md:text-base",
                className,
            )}
            {...props}
        >
            {children}
        </p>
    );
}

// Small metadata — timestamps, counts, hints
export function Caption({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn("text-muted-foreground text-[11px] md:text-xs", className)} {...props}>
            {children}
        </p>
    );
}
