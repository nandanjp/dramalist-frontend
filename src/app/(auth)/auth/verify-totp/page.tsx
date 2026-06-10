"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldCheck } from "lucide-react";
import { useTotpVerify } from "@/hooks/use-auth-mutations";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
    code: z
        .string()
        .min(6, "Enter your 6-digit code")
        .max(8)
        .regex(/^\d+$/, "Code must be digits only"),
});

type FormValues = z.infer<typeof schema>;

export default function VerifyTotpPage() {
    const router = useRouter();
    const params = useSearchParams();
    const pendingId = params.get("pending") ?? "";
    const auth = useAuth();
    const verify = useTotpVerify();
    const [serverError, setServerError] = React.useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { code: "" },
    });

    const isPending = verify.isPending;

    async function onSubmit(values: FormValues) {
        if (!pendingId) {
            setServerError("Invalid session. Please sign in again.");
            return;
        }
        setServerError(null);
        try {
            const res = await verify.mutateAsync({ pending_id: pendingId, code: values.code });
            await auth.login(res.access_token, res.expires_in);
            router.push("/dashboard");
        } catch {
            setServerError("Invalid code. Please try again.");
            form.reset();
        }
    }

    return (
        <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-white/60 bg-white/85 p-8 shadow-xl shadow-zinc-200/40 backdrop-blur-md dark:border-white/8 dark:bg-zinc-900/70 dark:shadow-none">
                {/* Icon + header */}
                <div className="mb-6">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950/60">
                        <ShieldCheck className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h1 className="font-hand text-3xl tracking-normal text-foreground">
                        Two-factor auth.
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Enter the 6-digit code from your authenticator app.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Authentication code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="123456"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            maxLength={8}
                                            className="text-center text-lg tracking-widest"
                                            disabled={isPending}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {serverError && (
                            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                                {serverError}
                            </p>
                        )}

                        <Button type="submit" className="mt-1 w-full" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Verifying…
                                </>
                            ) : (
                                "Verify"
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-sm text-muted-foreground"
                            disabled={isPending}
                            onClick={() => router.push("/login")}
                        >
                            Back to sign in
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
