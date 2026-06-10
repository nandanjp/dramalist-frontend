import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { Actor, ActorDetail, ActorListResponse, CastMember, CatalogDetail, CatalogEntry, CatalogListResponse } from "@/lib/types";

export interface CatalogSearchParams {
    q?: string;
    media_type?: string;
    airing_status?: string;
    genre?: string[];
    year_from?: number;
    year_to?: number;
    page?: number;
    limit?: number;
    sort?: string;
}

export const catalogKeys = {
    all: () => ["catalog"] as const,
    search: (params: CatalogSearchParams) => ["catalog", "search", params] as const,
    detail: (id: string) => ["catalog", "detail", id] as const,
    cast: (id: string) => ["catalog", "cast", id] as const,
    trending: () => ["catalog", "trending"] as const,
    recent: () => ["catalog", "recent"] as const,
};

export interface ActorBrowseParams {
    q?: string;
    nationality?: string;
    page?: number;
    limit?: number;
}

export const actorKeys = {
    search: (q: string) => ["actors", "search", q] as const,
    list: (params: ActorBrowseParams) => ["actors", "list", params] as const,
    detail: (id: string) => ["actors", "detail", id] as const,
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

export function useCatalogSearch(params: CatalogSearchParams) {
    return useQuery({
        queryKey: catalogKeys.search(params),
        queryFn: () => {
            const sp = new URLSearchParams();
            if (params.q) sp.set("q", params.q);
            if (params.media_type) sp.set("media_type", params.media_type);
            if (params.airing_status) sp.set("airing_status", params.airing_status);
            params.genre?.forEach((g) => sp.append("genre", g));
            if (params.year_from != null) sp.set("year_from", String(params.year_from));
            if (params.year_to != null) sp.set("year_to", String(params.year_to));
            sp.set("page", String(params.page ?? 1));
            sp.set("limit", String(params.limit ?? 24));
            if (params.sort) sp.set("sort", params.sort);
            return apiFetch<CatalogListResponse>(`/api/catalog?${sp.toString()}`);
        },
        staleTime: 2 * 60 * 1000,
        placeholderData: (prev) => prev,
    });
}

export function useActors(params: ActorBrowseParams) {
    return useQuery({
        queryKey: actorKeys.list(params),
        queryFn: () => {
            const sp = new URLSearchParams();
            if (params.q) sp.set("q", params.q);
            if (params.nationality) sp.set("nationality", params.nationality);
            sp.set("page", String(params.page ?? 1));
            sp.set("limit", String(params.limit ?? 24));
            return apiFetch<ActorListResponse>(`/api/actors?${sp.toString()}`);
        },
        staleTime: 2 * 60 * 1000,
        placeholderData: (prev) => prev,
    });
}

export function useActorDetail(id: string) {
    return useQuery({
        queryKey: actorKeys.detail(id),
        queryFn: () => apiFetch<ActorDetail>(`/api/actors/${id}`),
        enabled: !!id,
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
