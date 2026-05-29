import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { TotpVerifyRequest, TokenResponse } from "@/lib/types";

export function useTotpVerify() {
    return useMutation({
        mutationFn: (data: TotpVerifyRequest) =>
            apiFetch<TokenResponse>("/auth/totp/verify", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
}

export function useLogoutAll() {
    return useMutation({
        mutationFn: () => apiFetch<void>("/auth/logout/all", { method: "POST" }),
    });
}
