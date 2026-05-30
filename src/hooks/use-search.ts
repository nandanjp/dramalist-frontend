import { useQuery } from "@tanstack/react-query";
import { apiFetch, buildQS } from "@/lib/api";
import type { SearchParams, SearchResponse } from "@/lib/types";

export const searchKeys = {
    results: (params: SearchParams) => ["search", params] as const,
};

export function useSearch(params: SearchParams, enabled = true) {
    return useQuery({
        queryKey: searchKeys.results(params),
        queryFn: () => apiFetch<SearchResponse>(`/api/search?${buildQS(params as Record<string, unknown>)}`),
        enabled,
        staleTime: 30 * 1000,
        placeholderData: (prev) => prev,
    });
}
