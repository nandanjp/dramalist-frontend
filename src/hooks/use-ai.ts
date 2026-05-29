import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type {
    AIRecommendation,
    MoodSearchRequest,
    MoodSearchResult,
    RecommendationsRequest,
    ShowSummary,
} from "@/lib/types";

export function useRecommendations() {
    return useMutation({
        mutationFn: (data: RecommendationsRequest) =>
            apiFetch<AIRecommendation[]>("/ai/recommendations", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
}

export function useMoodSearch() {
    return useMutation({
        mutationFn: (data: MoodSearchRequest) =>
            apiFetch<MoodSearchResult>("/ai/mood-search", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
}

export function useShowSummary() {
    return useMutation({
        mutationFn: (showID: string) =>
            apiFetch<ShowSummary>(`/ai/shows/${showID}/summary`, {
                method: "POST",
                body: JSON.stringify({}),
            }),
    });
}
