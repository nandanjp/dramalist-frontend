"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useMe, useUpdateProfile } from "@/hooks/use-user";
import type { MeResponse } from "@/lib/types";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { MediaUpload } from "@/components/shared/media-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
    display_name: z.string().min(1, "Display name is required").max(80),
    bio: z.string().max(500).optional(),
    avatar_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
    profile_slug: z
        .string()
        .max(40)
        .regex(/^[a-z0-9-]*$/, "Only lowercase letters, numbers, and hyphens")
        .optional(),
    is_public: z.boolean(),
});

type FormValues = z.infer<typeof schema>;


function ProfileForm({ me }: { me: MeResponse }) {
    const { profile } = me;
    const updateProfile = useUpdateProfile();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            display_name: profile.display_name ?? "",
            bio: profile.bio ?? "",
            avatar_url: profile.avatar_url ?? "",
            profile_slug: profile.profile_slug ?? "",
            is_public: profile.is_public,
        },
    });

    const avatarUrl = useWatch({ control: form.control, name: "avatar_url" });
    const profileSlug = useWatch({ control: form.control, name: "profile_slug" });
    const displayName = useWatch({ control: form.control, name: "display_name" });

    async function onSubmit(values: FormValues) {
        try {
            await updateProfile.mutateAsync({
                display_name: values.display_name,
                bio: values.bio || undefined,
                avatar_url: values.avatar_url || undefined,
                profile_slug: values.profile_slug || undefined,
                is_public: values.is_public,
            });
            toast.success("Profile updated");
        } catch {
            toast.error("Failed to update profile");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Avatar preview */}
                <Card>
                    <CardContent className="flex items-center gap-4 pt-6">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={avatarUrl || undefined} />
                            <AvatarFallback className="text-lg">
                                {getInitials(displayName)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{displayName || "—"}</p>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Fields */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Public profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="display_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="profile_slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Profile URL slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your-name" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        dramalist.nandan-hl.dev/users/{profileSlug || "your-name"}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bio"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Bio</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell others a bit about yourself…"
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        {(field.value?.length ?? 0)} / 500
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Avatar</FormLabel>
                            <MediaUpload
                                entityType="user"
                                entityId={me.profile.id}
                                mediaType="avatar"
                                currentUrl={avatarUrl || undefined}
                                onSuccess={(url) => form.setValue("avatar_url", url, { shouldDirty: true })}
                                label="Upload avatar"
                                previewClassName="h-32 w-32 rounded-full overflow-hidden"
                            />
                        </FormItem>
                        <FormField
                            control={form.control}
                            name="avatar_url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Avatar URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://… (or upload above)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_public"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                                    <div>
                                        <FormLabel>Public profile</FormLabel>
                                        <FormDescription>
                                            Allow others to view your profile and public lists
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={updateProfile.isPending}>
                        {updateProfile.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save changes
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default function ProfilePage() {
    const { data: me, isLoading } = useMe();

    if (isLoading) {
        return (
            <div className="max-w-2xl space-y-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl space-y-6">
            <PageHeader title="Profile" description="Your public profile information." />
            {me && <ProfileForm me={me} />}
        </div>
    );
}
