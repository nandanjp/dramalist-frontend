"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogoutAll } from "@/hooks/use-auth-mutations";
import { useAuth } from "@/providers/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    const router = useRouter();
    const { user, logout } = useAuth();
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
        <div className="max-w-2xl space-y-6">
            <PageHeader title="Settings" description="Manage your account preferences." />
            <Separator />

            {/* Account */}
            <section className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">Account</h2>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Profile</CardTitle>
                        <CardDescription>Your display name and email address.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Display name</Label>
                            <p className="text-sm font-medium">{user?.display_name ?? "—"}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Email</Label>
                            <p className="text-sm">{user?.email ?? "—"}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/profile">Edit profile</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </section>

            {/* Security */}
            <section className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">Security</h2>
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
            </section>

            {/* Appearance */}
            <section className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">Appearance</h2>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Theme</CardTitle>
                        <CardDescription>Switch between light and dark mode.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <Label>Color theme</Label>
                            <ThemeToggle />
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
