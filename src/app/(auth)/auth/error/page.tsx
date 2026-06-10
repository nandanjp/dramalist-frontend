"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const MESSAGES: Record<string, string> = {
    access_denied: "You cancelled the sign-in request.",
    email_taken: "An account with this email already exists. Try signing in with your password.",
    oauth_failed: "Something went wrong with the sign-in provider. Please try again.",
};

export default function AuthErrorPage() {
    const params = useSearchParams();
    const reason = params.get("reason") ?? "oauth_failed";
    const message = MESSAGES[reason] ?? MESSAGES.oauth_failed;

    return (
        <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-white/60 bg-white/85 p-8 shadow-xl shadow-zinc-200/40 backdrop-blur-md dark:border-white/8 dark:bg-zinc-900/70 dark:shadow-none">
                <div className="mb-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-950/60">
                        <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                    </div>
                    <h1 className="font-hand text-3xl tracking-normal text-foreground">
                        Sign-in failed.
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                </div>

                <div className="flex flex-col gap-2">
                    <Button asChild className="w-full">
                        <Link href="/login">Try again</Link>
                    </Button>
                    <Button asChild variant="ghost" className="w-full text-muted-foreground">
                        <Link href="/">Go home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
