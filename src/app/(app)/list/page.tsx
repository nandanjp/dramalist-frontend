"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PenLine, Plus, Trash2 } from "lucide-react";
import { useShows, useDeleteShow } from "@/hooks/use-shows";
import type { Show } from "@/lib/types";
import { STATUS_LABELS, SHOW_STATUSES } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/date";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { QueryState } from "@/components/shared/query-state";
import { ShowStatusBadge } from "@/components/shows/show-status-badge";
import { ShowFormDialog } from "@/components/shows/show-form-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// ── Row actions ───────────────────────────────────────────────────────────────

function ShowRowActions({ show }: { show: Show }) {
    const [editOpen, setEditOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const deleteMutation = useDeleteShow();

    async function handleDelete() {
        try {
            await deleteMutation.mutateAsync(show.id);
            toast.success("Show removed");
            setDeleteOpen(false);
        } catch {
            toast.error("Failed to remove show");
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
                    <DropdownMenuItem onClick={() => setEditOpen(true)}>
                        <PenLine className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setDeleteOpen(true)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ShowFormDialog open={editOpen} onOpenChange={setEditOpen} show={show} />
            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Remove show?"
                description={`"${show.title}" will be permanently removed from your list.`}
                confirmLabel="Remove"
                variant="destructive"
                isPending={deleteMutation.isPending}
                onConfirm={handleDelete}
            />
        </>
    );
}

// ── Columns ───────────────────────────────────────────────────────────────────

const columns: ColumnDef<Show>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => (
            <div className="max-w-[260px]">
                <Link
                    href={`/shows/${row.original.id}`}
                    className="truncate font-medium hover:underline"
                >
                    {row.original.title}
                </Link>
                {row.original.original_title && (
                    <p className="truncate text-xs text-muted-foreground">
                        {row.original.original_title}
                    </p>
                )}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <ShowStatusBadge status={row.original.status} />,
        filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
    },
    {
        id: "progress",
        header: "Progress",
        cell: ({ row }) => {
            const { episodes_watched: watched, episode_count: total } = row.original;
            if (!total && !watched) return <span className="text-muted-foreground">—</span>;
            return (
                <span className="tabular-nums">
                    {watched}/{total ?? "?"}
                </span>
            );
        },
    },
    {
        accessorKey: "genre",
        header: "Genre",
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {row.original.genre.slice(0, 2).join(", ") || "—"}
            </span>
        ),
    },
    {
        accessorKey: "year",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Year" />,
        cell: ({ row }) => row.original.year ?? <span className="text-muted-foreground">—</span>,
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Updated" />,
        cell: ({ row }) => (
            <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(row.original.updated_at)}
            </span>
        ),
    },
    {
        id: "actions",
        cell: ({ row }) => <ShowRowActions show={row.original} />,
        size: 56,
    },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ListPage() {
    const [addOpen, setAddOpen] = React.useState(false);
    const [statusFilter, setStatusFilter] = React.useState<string>("all");

    const params = statusFilter !== "all" ? { status: statusFilter } : {};
    const { data, isLoading, isError } = useShows(params);
    const shows = data?.shows ?? [];

    return (
        <div className="space-y-6">
            <PageHeader
                title="My List"
                description="All the shows you're tracking."
                actions={
                    <Button onClick={() => setAddOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add show
                    </Button>
                }
            />

            <QueryState isLoading={false} isError={isError} isEmpty={false}>
                <DataTable
                    columns={columns}
                    data={shows}
                    isLoading={isLoading}
                    filterColumn="title"
                    filterPlaceholder="Search shows…"
                    toolbarExtra={
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-8 w-36">
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
                    }
                />
            </QueryState>

            <ShowFormDialog open={addOpen} onOpenChange={setAddOpen} />
        </div>
    );
}
