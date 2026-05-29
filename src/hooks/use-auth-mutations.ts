import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type {
    LoginRequest,
    LoginResponse,
    TotpVerifyRequest,
    TokenResponse,
    ChangePasswordRequest,
} from "@/lib/types";

export function useLogin() {
    return useMutation({
        mutationFn: (data: LoginRequest) =>
            apiFetch<LoginResponse>("/auth/token", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
}

export function useTotpVerify() {
    return useMutation({
        mutationFn: (data: TotpVerifyRequest) =>
            apiFetch<TokenResponse>("/auth/totp/verify", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: (data: ChangePasswordRequest) =>
            apiFetch<void>("/auth/password", {
                method: "PUT",
                body: JSON.stringify(data),
            }),
    });
}

export function useLogoutAll() {
    return useMutation({
        mutationFn: () => apiFetch<void>("/auth/logout/all", { method: "POST" }),
    });
}
