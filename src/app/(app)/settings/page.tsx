"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLogoutAll } from "@/hooks/use-auth-mutations";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
            <LogoutAllCard />
        </div>
    );
}
