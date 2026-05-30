const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export function buildQS(params: Record<string, unknown>): string {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    }
    return qs.toString();
}

// Module-level token storage — set by AuthProvider, read by every apiFetch call.
let _token: string | null = null;

export function setToken(token: string | null) {
    _token = token;
}

// Deduplicate concurrent refresh attempts.
let _refreshing: Promise<{ token: string; expiresIn: number } | null> | null = null;

export async function refreshToken(): Promise<{ token: string; expiresIn: number } | null> {
    if (_refreshing) return _refreshing;

    _refreshing = (async () => {
        try {
            const res = await fetch(`${BASE}/auth/token/refresh`, {
                method: "POST",
                credentials: "include",
            });
            if (!res.ok) return null;
            const data = await res.json();
            _token = data.access_token;
            return { token: data.access_token, expiresIn: data.expires_in ?? 900 };
        } catch {
            return null;
        } finally {
            _refreshing = null;
        }
    })();

    return _refreshing;
}

export class ApiError extends Error {
    constructor(
        public readonly status: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export async function apiFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
    const makeHeaders = (token: string | null): Record<string, string> => ({
        "Content-Type": "application/json",
        ...(init.headers as Record<string, string> | undefined),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });

    let res = await fetch(`${BASE}${path}`, {
        ...init,
        headers: makeHeaders(_token),
        credentials: "include",
    });

    // On 401, attempt one token refresh then retry.
    // Skip for auth endpoints — they're unauthenticated; a 401 is a credential failure, not an expired token.
    const isAuthPath = path.startsWith("/auth/");
    if (res.status === 401 && !isAuthPath) {
        const result = await refreshToken();
        if (!result) {
            if (typeof window !== "undefined") window.location.href = "/login";
            throw new ApiError(401, "Unauthorized");
        }
        res = await fetch(`${BASE}${path}`, {
            ...init,
            headers: makeHeaders(result.token),
            credentials: "include",
        });
    }

    if (res.status === 204) return undefined as T;

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError(res.status, body.error ?? `HTTP ${res.status}`);
    }

    return res.json() as Promise<T>;
}
