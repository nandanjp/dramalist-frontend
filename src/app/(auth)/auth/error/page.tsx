"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const MESSAGES: Record<string, string> = {
    missing_token: "No token was received. Please try signing in again.",
    login_failed: "We couldn't sign you in. Your session may have expired.",
    oauth_failed: "The OAuth provider returned an error. Please try a different sign-in method.",
};

export default function AuthErrorPage() {
    return (
        <Suspense fallback={<ErrorCard message="An unexpected error occurred." />}>
            <AuthErrorContent />
        </Suspense>
    );
}

function AuthErrorContent() {
    const params = useSearchParams();
    const reason = params.get("reason") ?? "unknown";
    return <ErrorCard message={MESSAGES[reason] ?? "An unexpected error occurred during sign-in."} />;
}

function ErrorCard({ message }: { message: string }) {
    return (
        <div className="w-full max-w-sm space-y-6 text-center">
            <div className="flex flex-col items-center gap-3">
                <TriangleAlert className="h-12 w-12 text-destructive" />
                <div className="space-y-1">
                    <h1 className="text-xl font-bold">Authentication failed</h1>
                    <p className="text-sm text-muted-foreground">{message}</p>
                </div>
            </div>
            <Button asChild className="w-full">
                <Link href="/login">Back to login</Link>
            </Button>
        </div>
    );
}
