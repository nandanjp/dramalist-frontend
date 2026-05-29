"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChangePassword, useLogoutAll } from "@/hooks/use-auth-mutations";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const schema = z
    .object({
        current_password: z.string().min(1, "Required"),
        new_password: z.string().min(8, "At least 8 characters"),
        confirm_password: z.string().min(1, "Required"),
    })
    .refine((d) => d.new_password === d.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    });

type FormValues = z.infer<typeof schema>;

function ChangePasswordForm() {
    const changePassword = useChangePassword();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { current_password: "", new_password: "", confirm_password: "" },
    });

    async function onSubmit(values: FormValues) {
        try {
            await changePassword.mutateAsync({
                current_password: values.current_password,
                new_password: values.new_password,
            });
            toast.success("Password updated");
            form.reset();
        } catch {
            toast.error("Failed to update password — check your current password");
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Change password</CardTitle>
                <CardDescription>
                    Update the password for your email-based account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="current_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current password</FormLabel>
                                    <FormControl>
                                        <Input type="password" autoComplete="current-password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="new_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New password</FormLabel>
                                    <FormControl>
                                        <Input type="password" autoComplete="new-password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm new password</FormLabel>
                                    <FormControl>
                                        <Input type="password" autoComplete="new-password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={changePassword.isPending}>
                                {changePassword.isPending && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Update password
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

function LogoutAllCard() {
    const router = useRouter();
    const { logout } = useAuth();
    const logoutAll = useLogoutAll();

    async function handleLogoutAll() {
        try {
            await logoutAll.mutateAsync();
            await logout();
            router.push("/login");
        } catch {
            toast.error("Failed to log out all devices");
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Sessions</CardTitle>
                <CardDescription>
                    Sign out of all devices including this one. Useful if you lost access to a
                    device.
                </CardDescription>
            </CardHeader>
            <CardFooter>
                <Button
                    variant="destructive"
                    onClick={handleLogoutAll}
                    disabled={logoutAll.isPending}
                >
                    {logoutAll.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Log out all devices
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function SettingsPage() {
    return (
        <div className="max-w-2xl space-y-6">
            <PageHeader title="Settings" description="Manage your account preferences." />
            <Separator />
            <ChangePasswordForm />
            <LogoutAllCard />
        </div>
    );
}
