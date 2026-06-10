"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/shared/page-container";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const PRODUCT_LINKS = [
    { label: "Catalog", href: "/catalog" },
    { label: "My List", href: "/list" },
] as const;

const ACCOUNT_LINKS = [
    { label: "Sign up", href: "/signup" },
    { label: "Log in", href: "/login" },
] as const;

interface FooterProps {
    className?: string;
}

export function Footer({ className }: FooterProps) {
    return (
        <footer className={cn("relative bg-background", className)}>
            {/* Gradient rule — fades in from edges */}
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            <PageContainer className="pb-8 pt-10 md:pb-10 md:pt-12">
                {/* Main row */}
                <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
                    {/* Brand */}
                    <div className="space-y-1.5">
                        <Link
                            href="/"
                            className="font-hand bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-xl tracking-normal text-transparent transition-opacity hover:opacity-70 dark:from-sky-400 dark:to-violet-400"
                        >
                            Dramalist
                        </Link>
                        <p className="text-xs text-muted-foreground">
                            Track every drama you love.
                        </p>
                    </div>

                    {/* Link groups */}
                    <div className="flex gap-10">
                        <div className="space-y-2.5">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                                Product
                            </p>
                            {PRODUCT_LINKS.map(({ label, href }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="block text-xs text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                        <div className="space-y-2.5">
                            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                                Account
                            </p>
                            {ACCOUNT_LINKS.map(({ label, href }) => (
                                <Link
                                    key={href}
                                    href={href}
                                    className="block text-xs text-muted-foreground transition-colors hover:text-foreground"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-8 flex items-center justify-between border-t border-border/30 pt-6">
                    <p className="text-[11px] text-muted-foreground/40">
                        &copy; {new Date().getFullYear()} Dramalist. All rights reserved.
                    </p>
                    <ThemeToggle />
                </div>
            </PageContainer>
        </footer>
    );
}
