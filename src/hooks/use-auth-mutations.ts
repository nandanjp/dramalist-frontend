import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    TotpVerifyRequest,
    TokenResponse,
} from "@/lib/types";

export function useLogin() {
    return useMutation({
        mutationFn: (data: LoginRequest) =>
            apiFetch<LoginResponse>("/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
            }),
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterRequest) =>
            apiFetch<LoginResponse>("/auth/register", {
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

export function useLogout() {
    return useMutation({
        mutationFn: () => apiFetch<void>("/auth/logout", { method: "POST" }),
    });
}

export function useLogoutAll() {
    return useMutation({
        mutationFn: () => apiFetch<void>("/auth/logout/all", { method: "POST" }),
    });
}
