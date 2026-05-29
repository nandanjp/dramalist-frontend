"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MESSAGES: Record<string, string> = {
    missing_token: "No authentication token was received.",
    login_failed: "We couldn't sign you in. Please try again.",
    oauth_failed: "OAuth sign-in failed. Please try again.",
};

export default function AuthErrorPage() {
    const params = useSearchParams();
    const reason = params.get("reason") ?? "unknown";
    const message = MESSAGES[reason] ?? "An unexpected error occurred.";

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="items-center text-center">
                <TriangleAlert className="mb-1 h-8 w-8 text-destructive" />
                <CardTitle>Authentication failed</CardTitle>
                <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full">
                    <Link href="/login">Back to login</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
