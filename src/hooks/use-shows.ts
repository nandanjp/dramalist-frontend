import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, buildQS } from "@/lib/api";
import type {
    Actor,
    AddCastMemberRequest,
    CastMember,
    CreateShowRequest,
    Show,
    ShowListResponse,
    UpdateCastMemberRequest,
    UpdateShowRequest,
} from "@/lib/types";

export const showKeys = {
    all: () => ["shows"] as const,
    list: (params: Record<string, unknown>) => ["shows", "list", params] as const,
    detail: (id: string) => ["shows", "detail", id] as const,
    cast: (id: string) => ["shows", "cast", id] as const,
    public: (userID: string, params: Record<string, unknown>) =>
        ["shows", "public", userID, params] as const,
    trending: () => ["shows", "trending"] as const,
    recent: () => ["shows", "recent"] as const,
};

export const actorKeys = {
    search: (q: string) => ["actors", "search", q] as const,
};

interface ListParams {
    page?: number;
    limit?: number;
    sort?: string;
    status?: string;
    genre?: string;
    [key: string]: unknown;
}


export function useShows(params: ListParams = {}) {
    return useQuery({
        queryKey: showKeys.list(params),
        queryFn: () => {
            const qs = buildQS(params);
            return apiFetch<ShowListResponse>(`/api/shows${qs ? `?${qs}` : ""}`);
        },
        staleTime: 30 * 1000,
    });
}

export function useShow(id: string) {
    return useQuery({
        queryKey: showKeys.detail(id),
        queryFn: () => apiFetch<Show>(`/api/shows/${id}`),
        enabled: !!id,
    });
}

export function usePublicShows(userID: string, params: ListParams = {}) {
    return useQuery({
        queryKey: showKeys.public(userID, params),
        queryFn: () => {
            const qs = buildQS(params);
            return apiFetch<ShowListResponse>(`/api/shows/users/${userID}${qs ? `?${qs}` : ""}`);
        },
        enabled: !!userID,
    });
}

export function useTrendingShows() {
    return useQuery({
        queryKey: showKeys.trending(),
        queryFn: () => apiFetch<Show[]>("/api/shows/public/trending"),
        staleTime: 5 * 60 * 1000,
    });
}

export function useRecentShows() {
    return useQuery({
        queryKey: showKeys.recent(),
        queryFn: () => apiFetch<Show[]>("/api/shows/public/recent"),
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateShow() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateShowRequest) =>
            apiFetch<Show>("/api/shows", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: showKeys.all() });
        },
    });
}

export function useUpdateShow(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateShowRequest) =>
            apiFetch<Show>(`/api/shows/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: (data) => {
            qc.setQueryData(showKeys.detail(id), data);
            qc.invalidateQueries({ queryKey: showKeys.all() });
        },
    });
}

export function useDeleteShow() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiFetch(`/api/shows/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: showKeys.all() });
        },
    });
}

// ── Cast hooks ────────────────────────────────────────────────────────────────

export function useCast(showId: string) {
    return useQuery({
        queryKey: showKeys.cast(showId),
        queryFn: () => apiFetch<CastMember[]>(`/api/shows/${showId}/cast`),
        enabled: !!showId,
    });
}

export function useAddCastMember(showId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: AddCastMemberRequest) =>
            apiFetch<CastMember>(`/api/shows/${showId}/cast`, {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: showKeys.cast(showId) });
        },
    });
}

export function useUpdateCastMember(showId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ castId, data }: { castId: string; data: UpdateCastMemberRequest }) =>
            apiFetch(`/api/shows/${showId}/cast/${castId}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: showKeys.cast(showId) });
        },
    });
}

export function useRemoveCastMember(showId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (castId: string) =>
            apiFetch(`/api/shows/${showId}/cast/${castId}`, { method: "DELETE" }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: showKeys.cast(showId) });
        },
    });
}

// ── Actor hooks ───────────────────────────────────────────────────────────────

export function useActorSearch(q: string) {
    return useQuery({
        queryKey: actorKeys.search(q),
        queryFn: () => apiFetch<Actor[]>(`/api/actors?q=${encodeURIComponent(q)}`),
        enabled: q.length >= 2,
        staleTime: 60 * 1000,
    });
}

export function useCreateActor() {
    return useMutation({
        mutationFn: (name: string) =>
            apiFetch<Actor>("/api/actors", {
                method: "POST",
                body: JSON.stringify({ name }),
            }),
    });
}
