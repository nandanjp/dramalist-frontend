"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PenLine, Plus, Trash2 } from "lucide-react";
import { useMyReviews, useDeleteReview } from "@/hooks/use-reviews";
import type { Review } from "@/lib/types";
import { formatDate } from "@/lib/date";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { QueryState } from "@/components/shared/query-state";
import { RatingStars } from "@/components/reviews/rating-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ── Row actions ───────────────────────────────────────────────────────────────

function ReviewRowActions({ review }: { review: Review }) {
    const router = useRouter();
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const deleteMutation = useDeleteReview();

    async function handleDelete() {
        try {
            await deleteMutation.mutateAsync({ id: review.id, catalogID: review.catalog_id });
            toast.success("Review deleted");
            setDeleteOpen(false);
        } catch {
            toast.error("Failed to delete review");
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/reviews/${review.id}`)}>
                        <PenLine className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete review?"
                description="This action cannot be undone."
                confirmLabel="Delete"
                variant="destructive"
                isPending={deleteMutation.isPending}
                onConfirm={handleDelete}
            />
        </>
    );
}

// ── Page ─────────────────────────────────────────────────────────────────���────

export default function ReviewsPage() {
    const router = useRouter();
    const { data: reviewsData, isLoading, isError } = useMyReviews();
    const reviews = reviewsData?.reviews ?? [];

    const columns: ColumnDef<Review>[] = [
        {
            id: "title",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
            accessorFn: (row) => row.catalog_title ?? row.catalog_id,
            cell: ({ row }) => (
                <a
                    href={`/catalog/${row.original.catalog_id}`}
                    className="max-w-[240px] truncate font-medium hover:underline"
                >
                    {row.original.catalog_title ?? row.original.catalog_id}
                </a>
            ),
        },
        {
            accessorKey: "rating",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Rating" />,
            cell: ({ row }) => <RatingStars rating={row.original.rating} />,
        },
        {
            id: "snippet",
            header: "Review",
            meta: { className: "hidden md:table-cell" },
            cell: ({ row }) =>
                row.original.content ? (
                    <p className="max-w-[300px] truncate text-sm text-muted-foreground">
                        {row.original.content.slice(0, 80)}
                    </p>
                ) : (
                    <span className="text-sm text-muted-foreground">No content</span>
                ),
        },
        {
            accessorKey: "is_public",
            header: "Visibility",
            meta: { className: "hidden md:table-cell" },
            cell: ({ row }) =>
                row.original.is_public ? (
                    <Badge variant="secondary">Public</Badge>
                ) : (
                    <Badge variant="outline">Private</Badge>
                ),
        },
        {
            accessorKey: "updated_at",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {formatDate(row.original.updated_at)}
                </span>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => <ReviewRowActions review={row.original} />,
            size: 56,
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="My Reviews"
                description="All your drama reviews in one place."
                actions={
                    <Button onClick={() => router.push("/reviews/new")}>
                        <Plus className="mr-2 h-4 w-4" />
                        Write review
                    </Button>
                }
            />

            <QueryState isLoading={false} isError={isError} isEmpty={false}>
                <DataTable
                    columns={columns}
                    data={reviews}
                    isLoading={isLoading}
                    filterColumn="title"
                    filterPlaceholder="Filter by title…"
                />
            </QueryState>
        </div>
    );
}
