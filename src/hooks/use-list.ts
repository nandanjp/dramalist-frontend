import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, buildQS } from "@/lib/api";
import type {
    AddToListRequest,
    UpdateListEntryRequest,
    UserListEntry,
    UserListResponse,
} from "@/lib/types";

export const listKeys = {
    all: () => ["list"] as const,
    entries: (params: Record<string, unknown>) => ["list", "entries", params] as const,
    detail: (id: string) => ["list", "detail", id] as const,
    public: (userID: string, params: Record<string, unknown>) =>
        ["list", "public", userID, params] as const,
};

interface ListParams {
    page?: number;
    limit?: number;
    sort?: string;
    status?: string;
    [key: string]: unknown;
}

export function useListEntries(params: ListParams = {}) {
    return useQuery({
        queryKey: listKeys.entries(params),
        queryFn: () => {
            const qs = buildQS(params);
            return apiFetch<UserListResponse>(`/api/list${qs ? `?${qs}` : ""}`);
        },
        staleTime: 30 * 1000,
    });
}

export function useListEntry(id: string) {
    return useQuery({
        queryKey: listKeys.detail(id),
        queryFn: () => apiFetch<UserListEntry>(`/api/list/${id}`),
        enabled: !!id,
    });
}

export function usePublicList(userID: string, params: ListParams = {}) {
    return useQuery({
        queryKey: listKeys.public(userID, params),
        queryFn: () => {
            const qs = buildQS(params);
            return apiFetch<UserListResponse>(`/api/list/users/${userID}${qs ? `?${qs}` : ""}`);
        },
        enabled: !!userID,
    });
}

/**
 * Returns a Set of catalog_ids in the user's list.
 * All instances on the same page share one TanStack Query cache entry.
 * Use for O(1) membership checks (InListIndicator, etc.).
 */
export function useListCatalogSet(): Set<string> {
    const { data } = useListEntries({ limit: 1000 });
    return useMemo(() => {
        const set = new Set<string>();
        if (data?.entries) {
            for (const entry of data.entries) set.add(entry.catalog_id);
        }
        return set;
    }, [data]);
}

/**
 * Returns the full UserListEntry for a given catalog_id, or undefined if not in list.
 * Used by AddToListButton to switch between add and edit mode.
 */
export function useListEntryCatalogId(catalogId: string): UserListEntry | undefined {
    const { data } = useListEntries({ limit: 1000 });
    return useMemo(() => data?.entries.find((e) => e.catalog_id === catalogId), [data, catalogId]);
}

export function useAddToList() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: AddToListRequest) =>
            apiFetch<UserListEntry>("/api/list", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (newEntry) => {
            // Write the new entry into all list caches immediately
            qc.setQueriesData<UserListResponse>({ queryKey: listKeys.all() }, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    total: old.total + 1,
                    entries: [newEntry, ...old.entries],
                };
            });
            qc.invalidateQueries({ queryKey: listKeys.all() });
        },
    });
}

export function useUpdateListEntry(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateListEntryRequest) =>
            apiFetch<UserListEntry>(`/api/list/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onMutate: async (newData) => {
            await qc.cancelQueries({ queryKey: listKeys.all() });

            const previousDetail = qc.getQueryData<UserListEntry>(listKeys.detail(id));
            const previousEntries = qc.getQueriesData<UserListResponse>({
                queryKey: listKeys.all(),
            });

            // Optimistically update detail cache
            if (previousDetail) {
                qc.setQueryData(listKeys.detail(id), { ...previousDetail, ...newData });
            }

            // Optimistically update in all entries list caches
            qc.setQueriesData<UserListResponse>({ queryKey: listKeys.all() }, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    entries: old.entries.map((e) => (e.id === id ? { ...e, ...newData } : e)),
                };
            });

            return { previousDetail, previousEntries };
        },
        onError: (_, __, context) => {
            if (context?.previousDetail) {
                qc.setQueryData(listKeys.detail(id), context.previousDetail);
            }
            if (context?.previousEntries) {
                for (const [key, data] of context.previousEntries) {
                    qc.setQueryData(key, data);
                }
            }
        },
        onSuccess: (data) => {
            qc.setQueryData(listKeys.detail(id), data);
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: listKeys.all() });
        },
    });
}

export function useDeleteListEntry() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiFetch(`/api/list/${id}`, { method: "DELETE" }),
        onMutate: async (id) => {
            await qc.cancelQueries({ queryKey: listKeys.all() });
            const previousEntries = qc.getQueriesData<UserListResponse>({
                queryKey: listKeys.all(),
            });

            qc.setQueriesData<UserListResponse>({ queryKey: listKeys.all() }, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    total: Math.max(0, old.total - 1),
                    entries: old.entries.filter((e) => e.id !== id),
                };
            });

            return { previousEntries };
        },
        onError: (_, __, context) => {
            if (context?.previousEntries) {
                for (const [key, data] of context.previousEntries) {
                    qc.setQueryData(key, data);
                }
            }
        },
        onSettled: () => {
            qc.invalidateQueries({ queryKey: listKeys.all() });
        },
    });
}
