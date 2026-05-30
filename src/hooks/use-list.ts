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

export function useAddToList() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: AddToListRequest) =>
            apiFetch<UserListEntry>("/api/list", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: () => {
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
        onSuccess: (data) => {
            qc.setQueryData(listKeys.detail(id), data);
            qc.invalidateQueries({ queryKey: listKeys.all() });
        },
    });
}

export function useDeleteListEntry() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => apiFetch(`/api/list/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: listKeys.all() });
        },
    });
}
