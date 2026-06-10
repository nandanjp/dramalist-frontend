"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function CallbackPage() {
    const router = useRouter();
    const params = useSearchParams();
    const auth = useAuth();
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const token = params.get("token");
        const expiresIn = params.get("expires_in");
        const err = params.get("error");

        if (err) {
            router.replace(`/auth/error?reason=${encodeURIComponent(err)}`);
            return;
        }

        if (!token) {
            setError("No token received from the OAuth provider.");
            return;
        }

        auth.login(token, expiresIn ? parseInt(expiresIn, 10) : undefined)
            .then(() => router.replace("/dashboard"))
            .catch(() => setError("Couldn't complete sign-in. Please try again."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (error) {
        return (
            <div className="w-full max-w-sm">
                <div className="rounded-2xl border border-white/60 bg-white/85 p-8 shadow-xl shadow-zinc-200/40 backdrop-blur-md dark:border-white/8 dark:bg-zinc-900/70 dark:shadow-none text-center">
                    <p className="mb-4 text-sm text-destructive">{error}</p>
                    <Button
                        variant="link"
                        onClick={() => router.push("/login")}
                        className="h-auto p-0 text-sm text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        Back to sign in
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-sky-500" />
            <p className="text-sm">Completing sign-in…</p>
        </div>
    );
}
