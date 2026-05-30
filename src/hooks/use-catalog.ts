import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { Actor, CastMember, CatalogDetail, CatalogEntry } from "@/lib/types";

export const catalogKeys = {
    all: () => ["catalog"] as const,
    detail: (id: string) => ["catalog", "detail", id] as const,
    cast: (id: string) => ["catalog", "cast", id] as const,
    trending: () => ["catalog", "trending"] as const,
    recent: () => ["catalog", "recent"] as const,
};

export const actorKeys = {
    search: (q: string) => ["actors", "search", q] as const,
};

export function useCatalogEntry(id: string) {
    return useQuery({
        queryKey: catalogKeys.detail(id),
        queryFn: () => apiFetch<CatalogDetail>(`/api/catalog/${id}`),
        enabled: !!id,
    });
}

export function useCatalogCast(catalogId: string) {
    return useQuery({
        queryKey: catalogKeys.cast(catalogId),
        queryFn: () => apiFetch<CastMember[]>(`/api/catalog/${catalogId}/cast`),
        enabled: !!catalogId,
    });
}

export function useTrendingCatalog() {
    return useQuery({
        queryKey: catalogKeys.trending(),
        queryFn: () => apiFetch<CatalogEntry[]>("/api/shows/public/trending"),
        staleTime: 5 * 60 * 1000,
    });
}

export function useRecentCatalog() {
    return useQuery({
        queryKey: catalogKeys.recent(),
        queryFn: () => apiFetch<CatalogEntry[]>("/api/shows/public/recent"),
        staleTime: 5 * 60 * 1000,
    });
}

export function useActorSearch(q: string) {
    return useQuery({
        queryKey: actorKeys.search(q),
        queryFn: () => apiFetch<Actor[]>(`/api/actors?q=${encodeURIComponent(q)}`),
        enabled: q.length >= 2,
        staleTime: 60 * 1000,
    });
}
