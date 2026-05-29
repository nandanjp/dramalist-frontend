import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { SearchParams, SearchResponse } from "@/lib/types";

export const searchKeys = {
    results: (params: SearchParams) => ["search", params] as const,
};

export function useSearch(params: SearchParams, enabled = true) {
    return useQuery({
        queryKey: searchKeys.results(params),
        queryFn: () => {
            const qs = new URLSearchParams();
            if (params.q) qs.set("q", params.q);
            if (params.status) qs.set("status", params.status);
            if (params.genre) qs.set("genre", params.genre);
            if (params.mine) qs.set("mine", "true");
            if (params.page) qs.set("page", String(params.page));
            if (params.limit) qs.set("limit", String(params.limit));
            return apiFetch<SearchResponse>(`/search?${qs.toString()}`);
        },
        enabled,
        staleTime: 30 * 1000,
        placeholderData: (prev) => prev,
    });
}
