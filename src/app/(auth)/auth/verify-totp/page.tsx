"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/auth-provider";
import { useTotpVerify } from "@/hooks/use-auth-mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
    code: z
        .string()
        .length(6, "Enter the 6-digit code from your authenticator app")
        .regex(/^\d+$/, "Code must be digits only"),
});
type FormValues = z.infer<typeof schema>;

function VerifyTotpForm() {
    const router = useRouter();
    const params = useSearchParams();
    const pendingId = params.get("pending") ?? "";
    const { login } = useAuth();
    const verifyMutation = useTotpVerify();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { code: "" },
    });

    async function onSubmit(values: FormValues) {
        try {
            const res = await verifyMutation.mutateAsync({ pending_id: pendingId, code: values.code });
            await login(res.access_token, res.expires_in);
            router.push("/dashboard");
        } catch {
            form.setError("code", { message: "Invalid or expired code" });
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="items-center text-center">
                <ShieldCheck className="mb-1 h-8 w-8 text-primary" />
                <CardTitle>Two-factor authentication</CardTitle>
                <CardDescription>
                    Open your authenticator app and enter the 6-digit code.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification code</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={6}
                                            placeholder="000000"
                                            autoComplete="one-time-code"
                                            className="text-center tracking-[0.5em]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={verifyMutation.isPending}
                        >
                            {verifyMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Verify
                        </Button>
                    </form>
                </Form>

                <p className="text-center text-sm text-muted-foreground">
                    <Link href="/login" className="underline underline-offset-4">
                        Back to login
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}

export default function VerifyTotpPage() {
    return (
        <Suspense>
            <VerifyTotpForm />
        </Suspense>
    );
}
