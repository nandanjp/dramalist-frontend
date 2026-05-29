"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { apiFetch, refreshToken, setToken } from "@/lib/api";
import type { MeResponse, Profile } from "@/lib/types";

interface AuthState {
    user: Profile | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (token: string, expiresIn?: number) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthState | null>(null);

const REFRESH_LEAD_MS = 60_000;

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Profile | null>(null);
    const [isLoading, setLoading] = useState(true);
    // Tracks when the current access token expires; drives the refresh timer.
    const [expiresAt, setExpiresAt] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchAndSetUser = useCallback(async () => {
        try {
            const data = await apiFetch<MeResponse>("/users/me");
            setUser(data.profile);
        } catch {
            setUser(null);
        }
    }, []);

    const login = useCallback(
        async (token: string, expiresIn = 900) => {
            setToken(token);
            setExpiresAt(Date.now() + expiresIn * 1000);
            await fetchAndSetUser();
        },
        [fetchAndSetUser],
    );

    const logout = useCallback(async () => {
        try {
            await apiFetch("/auth/logout", { method: "POST" });
        } catch {
            // best-effort
        }
        setToken(null);
        setUser(null);
        setExpiresAt(null);
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    // Proactive refresh: fires REFRESH_LEAD_MS before the token expires.
    // Re-runs whenever expiresAt changes (i.e. after each successful refresh).
    useEffect(() => {
        if (!expiresAt) return;
        const delay = Math.max(0, expiresAt - Date.now() - REFRESH_LEAD_MS);
        timerRef.current = setTimeout(async () => {
            const result = await refreshToken();
            if (result) setExpiresAt(Date.now() + result.expiresIn * 1000);
            else setUser(null);
        }, delay);
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [expiresAt]);

    // On mount: attempt a silent token refresh to restore session.
    useEffect(() => {
        (async () => {
            const result = await refreshToken();
            if (result) {
                setExpiresAt(Date.now() + result.expiresIn * 1000);
                await fetchAndSetUser();
            }
            setLoading(false);
        })();
    }, [fetchAndSetUser]);

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

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
