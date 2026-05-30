"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { BookOpen, CalendarDays } from "lucide-react";
import { usePublicProfile } from "@/hooks/use-user";
import { usePublicList } from "@/hooks/use-list";
import { SHOW_STATUSES, STATUS_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/date";
import { getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { CardGridSkeleton } from "@/components/shared/card-grid-skeleton";
import { NotFoundState } from "@/components/shared/not-found-state";
import { ShowCard } from "@/components/shows/show-card";

export default function PublicProfilePage() {
    const { slug } = useParams<{ slug: string }>();
    const [statusFilter, setStatusFilter] = React.useState("all");

    const { data: profile, isLoading: profileLoading, isError: profileError } =
        usePublicProfile(slug);

    const listParams = statusFilter !== "all" ? { status: statusFilter } : {};
    const { data: listData, isLoading: listLoading } = usePublicList(
        profile?.id ?? "",
        listParams,
    );

    const entries = listData?.entries ?? [];

    if (profileLoading) {
        return (
            <div className="max-w-4xl space-y-8">
                <Skeleton className="h-36 w-full rounded-xl" />
                <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <CardGridSkeleton />
                </div>
            </div>
        );
    }

    if (profileError || !profile) {
        return (
            <NotFoundState
                heading="Profile not found"
                description="This profile is private or doesn't exist."
            />
        );
    }

    return (
        <div className="max-w-4xl space-y-8">
            {/* Header */}
            <Card>
                <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-start sm:gap-6">
                    <Avatar className="h-20 w-20 shrink-0 self-center sm:self-auto">
                        <AvatarImage src={profile.avatar_url ?? undefined} />
                        <AvatarFallback className="text-2xl">
                            {getInitials(profile.display_name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-2">
                        <div>
                            <h1 className="text-2xl font-bold leading-tight">
                                {profile.display_name}
                            </h1>
                            {profile.profile_slug && (
                                <p className="text-sm text-muted-foreground">
                                    @{profile.profile_slug}
                                </p>
                            )}
                        </div>

                        {profile.bio && (
                            <p className="text-sm text-muted-foreground">{profile.bio}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <CalendarDays className="h-3.5 w-3.5" />
                                Member since {formatDate(profile.created_at)}
                            </span>
                            {listData != null && (
                                <span className="flex items-center gap-1">
                                    <BookOpen className="h-3.5 w-3.5" />
                                    {listData.total} public title
                                    {listData.total !== 1 ? "s" : ""}
                                </span>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* List */}
            <section className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold">List</h2>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            {SHOW_STATUSES.map((s) => (
                                <SelectItem key={s} value={s}>
                                    {STATUS_LABELS[s]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {listLoading ? (
                    <CardGridSkeleton />
                ) : entries.length === 0 ? (
                    <p className="py-16 text-center text-sm text-muted-foreground">
                        No public titles yet.
                    </p>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {entries.map((entry) => (
                            <ShowCard key={entry.id} entry={entry} variant="public" />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
