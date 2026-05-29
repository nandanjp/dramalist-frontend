import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type {
    AIRecommendation,
    MoodSearchRequest,
    MoodSearchResult,
    RecommendationsRequest,
    ShowSummary,
} from "@/lib/types";

export interface ShowSummaryInput {
    showId: string;
    showTitle?: string;
    reviews: Array<{ rating: number; content: string }>;
}

export function useRecommendations() {
    return useMutation({
        mutationFn: (data: RecommendationsRequest) =>
            apiFetch<{ recommendations: AIRecommendation[] }>("/api/ai/recommendations", {
                method: "POST",
                body: JSON.stringify(data),
            }).then((res) => res.recommendations ?? []),
    });
}

export function useMoodSearch() {
    return useMutation({
        mutationFn: (data: MoodSearchRequest) =>
            apiFetch<MoodSearchResult>("/api/ai/mood-search", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
}

export function useShowSummary() {
    return useMutation({
        mutationFn: ({ showId, showTitle, reviews }: ShowSummaryInput) =>
            apiFetch<ShowSummary>(`/api/ai/shows/${showId}/summary`, {
                method: "POST",
                body: JSON.stringify({ show_title: showTitle ?? "", reviews }),
            }),
    });
}
