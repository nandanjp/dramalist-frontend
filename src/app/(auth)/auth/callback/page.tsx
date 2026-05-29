"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";

export default function CallbackPage() {
    return (
        <Suspense fallback={<CallbackSpinner />}>
            <CallbackHandler />
        </Suspense>
    );
}

function CallbackHandler() {
    const router = useRouter();
    const params = useSearchParams();
    const { login } = useAuth();
    const handled = useRef(false);

    useEffect(() => {
        if (handled.current) return;
        handled.current = true;

        const token = params.get("token");
        if (!token) {
            router.replace("/auth/error?reason=missing_token");
            return;
        }

        login(token)
            .then(() => router.replace("/dashboard"))
            .catch(() => router.replace("/auth/error?reason=login_failed"));
    }, [login, params, router]);

    return <CallbackSpinner />;
}

function CallbackSpinner() {
    return (
        <div className="flex flex-col items-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Signing you in…</p>
        </div>
    );
}
