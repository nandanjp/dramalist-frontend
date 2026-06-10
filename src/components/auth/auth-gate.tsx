"use client";

import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function AuthGate({ children }: { children: React.ReactNode }) {
    const { isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center py-24">
                <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}
