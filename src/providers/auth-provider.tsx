"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, refreshToken, setToken } from "@/lib/api";
import { useLogout as useLogoutMutation } from "@/hooks/use-auth-mutations";
import type { MeResponse, Profile } from "@/lib/types";

interface AuthState {
    user: Profile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, expiresIn?: number) => Promise<void>;
    logout: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);

const REFRESH_LEAD_MS = 60_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Tracks when the current access token expires; drives the refresh timer and gates the user query.
    const [expiresAt, setExpiresAt] = useState<number | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const qc = useQueryClient();
    const { mutate: callLogout } = useLogoutMutation();

    const { data: meData, isLoading: meLoading } = useQuery({
        queryKey: ["user", "me"],
        queryFn: () => apiFetch<MeResponse>("/api/users/me"),
        enabled: expiresAt !== null,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    const user = meData?.profile ?? null;
    // Block consumers until the initial session restore attempt is complete.
    // If a token was found, also wait for the user query to resolve.
    const isLoading = !isInitialized || meLoading;

    const login = useCallback(async (token: string, expiresIn = 900) => {
        setToken(token);
        setExpiresAt(Date.now() + expiresIn * 1000);
    }, []);

    const logout = useCallback(() => {
        callLogout(undefined, {
            onSettled: () => {
                setToken(null);
                setExpiresAt(null);
                qc.clear();
            },
        });
    }, [callLogout, qc]);

    // Proactive refresh: fires REFRESH_LEAD_MS before the token expires.
    useEffect(() => {
        if (!expiresAt) return;
        const delay = Math.max(0, expiresAt - Date.now() - REFRESH_LEAD_MS);
        const timer = setTimeout(async () => {
            const result = await refreshToken();
            if (result) setExpiresAt(Date.now() + result.expiresIn * 1000);
            else {
                setToken(null);
                setExpiresAt(null);
                qc.removeQueries({ queryKey: ["user", "me"] });
            }
        }, delay);
        return () => clearTimeout(timer);
    }, [expiresAt, qc]);

    // On mount: attempt a silent token refresh to restore an existing session.
    useEffect(() => {
        async function restoreSession() {
            const result = await refreshToken();
            if (result) setExpiresAt(Date.now() + result.expiresIn * 1000);
            setIsInitialized(true);
        }
        restoreSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
