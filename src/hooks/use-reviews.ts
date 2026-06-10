import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, buildQS } from "@/lib/api";
import type {
    CreateReviewRequest,
    PublicReviewPreview,
    Review,
    ReviewAggregate,
    ReviewListResponse,
    UpdateReviewRequest,
} from "@/lib/types";

export const reviewKeys = {
    all: () => ["reviews"] as const,
    mine: (params: Record<string, unknown>) => ["reviews", "mine", params] as const,
    catalog: (catalogID: string, params: Record<string, unknown>) =>
        ["reviews", "catalog", catalogID, params] as const,
    detail: (id: string) => ["reviews", "detail", id] as const,
    aggregate: (catalogID: string) => ["reviews", "aggregate", catalogID] as const,
    publicFeed: () => ["reviews", "public", "recent"] as const,
};

interface ListParams {
    page?: number;
    limit?: number;
    [key: string]: unknown;
}

export function useMyReviews(params: ListParams = {}) {
    return useQuery({
        queryKey: reviewKeys.mine(params),
        queryFn: () => {
            const qs = buildQS(params);
            return apiFetch<ReviewListResponse>(`/api/reviews/me${qs ? `?${qs}` : ""}`);
        },
    });
}

export function useCatalogReviews(catalogID: string, params: ListParams = {}) {
    return useQuery({
        queryKey: reviewKeys.catalog(catalogID, params),
        queryFn: () => {
            const qs = buildQS(params);
            return apiFetch<ReviewListResponse>(
                `/api/reviews/catalog/${catalogID}${qs ? `?${qs}` : ""}`,
            );
        },
        enabled: !!catalogID,
    });
}

export function useReview(id: string) {
    return useQuery({
        queryKey: reviewKeys.detail(id),
        queryFn: () => apiFetch<Review>(`/api/reviews/${id}`),
        enabled: !!id,
    });
}

export function useReviewAggregate(catalogID: string) {
    return useQuery({
        queryKey: reviewKeys.aggregate(catalogID),
        queryFn: () => apiFetch<ReviewAggregate>(`/api/reviews/aggregate/${catalogID}`),
        enabled: !!catalogID,
        staleTime: 60 * 1000,
    });
}

export function useRecentPublicReviews() {
    return useQuery({
        queryKey: reviewKeys.publicFeed(),
        queryFn: () => apiFetch<PublicReviewPreview[]>("/api/reviews/public/recent"),
        staleTime: 2 * 60 * 1000,
    });
}

export function useCreateReview() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateReviewRequest) =>
            apiFetch<Review>("/api/reviews", {
                method: "POST",
                body: JSON.stringify(data),
            }),
        onSuccess: (data) => {
            qc.invalidateQueries({
                queryKey: reviewKeys.catalog(data.catalog_id, {}),
            });
            qc.invalidateQueries({
                queryKey: reviewKeys.aggregate(data.catalog_id),
            });
            qc.invalidateQueries({ queryKey: reviewKeys.mine({}) });
        },
    });
}

export function useUpdateReview(id: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateReviewRequest) =>
            apiFetch<Review>(`/api/reviews/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: (data) => {
            qc.setQueryData(reviewKeys.detail(id), data);
            qc.invalidateQueries({
                queryKey: reviewKeys.catalog(data.catalog_id, {}),
            });
            qc.invalidateQueries({
                queryKey: reviewKeys.aggregate(data.catalog_id),
            });
        },
    });
}

export function useDeleteReview() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, catalogID }: { id: string; catalogID: string }) =>
            apiFetch(`/api/reviews/${id}`, { method: "DELETE" }).then(() => catalogID),
        onSuccess: (catalogID) => {
            qc.invalidateQueries({ queryKey: reviewKeys.catalog(catalogID, {}) });
            qc.invalidateQueries({ queryKey: reviewKeys.aggregate(catalogID) });
            qc.invalidateQueries({ queryKey: reviewKeys.mine({}) });
        },
    });
}
