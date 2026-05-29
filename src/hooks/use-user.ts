import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { MeResponse, Profile, UpdateProfileRequest } from "@/lib/types";

export const userKeys = {
    me: () => ["user", "me"] as const,
    stats: () => ["user", "stats"] as const,
    profile: (slug: string) => ["user", "profile", slug] as const,
};

export function useMe() {
    return useQuery({
        queryKey: userKeys.me(),
        queryFn: () => apiFetch<MeResponse>("/users/me"),
        staleTime: 5 * 60 * 1000,
    });
}

export function usePublicProfile(slug: string) {
    return useQuery({
        queryKey: userKeys.profile(slug),
        queryFn: () => apiFetch<Profile>(`/users/${slug}`),
        enabled: !!slug,
    });
}

export function useUpdateProfile() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateProfileRequest) =>
            apiFetch<MeResponse>("/users/me", {
                method: "PATCH",
                body: JSON.stringify(data),
            }),
        onSuccess: (data) => {
            qc.setQueryData(userKeys.me(), data);
        },
    });
}
