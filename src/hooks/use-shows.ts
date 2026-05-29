import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, buildQS } from "@/lib/api";
import type { CreateShowRequest, Show, ShowListResponse, UpdateShowRequest } from "@/lib/types";

export const showKeys = {
    all: () => ["shows"] as const,
    list: (params: Record<string, unknown>) => ["shows", "list", params] as const,
    detail: (id: string) => ["shows", "detail", id] as const,
    public: (userID: string, params: Record<string, unknown>) =>
        ["shows", "public", userID, params] as const,
    trending: () => ["shows", "trending"] as const,
    recent: () => ["shows", "recent"] as const,
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
            return apiFetch<ShowListResponse>(`/shows${qs ? `?${qs}` : ""}`);
        },
        staleTime: 30 * 1000,
    });
}

export function useShow(id: string) {
    return useQuery({
        queryKey: showKeys.detail(id),
        queryFn: () => apiFetch<Show>(`/shows/${id}`),
        enabled: !!id,
    });
}

export function usePublicShows(userID: string, params: ListParams = {}) {
    return useQuery({
        queryKey: showKeys.public(userID, params),
        queryFn: () => {
            const qs = buildQS(params);
            return apiFetch<ShowListResponse>(`/shows/users/${userID}${qs ? `?${qs}` : ""}`);
        },
        enabled: !!userID,
    });
}

export function useTrendingShows() {
    return useQuery({
        queryKey: showKeys.trending(),
        queryFn: () => apiFetch<Show[]>("/shows/public/trending"),
        staleTime: 5 * 60 * 1000,
    });
}

export function useRecentShows() {
    return useQuery({
        queryKey: showKeys.recent(),
        queryFn: () => apiFetch<Show[]>("/shows/public/recent"),
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateShow() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateShowRequest) =>
            apiFetch<Show>("/shows", {
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
            apiFetch<Show>(`/shows/${id}`, {
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
        mutationFn: (id: string) => apiFetch(`/shows/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: showKeys.all() });
        },
    });
}
