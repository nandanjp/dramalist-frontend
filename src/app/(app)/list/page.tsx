"use client";

import * as React from "react";
import Link from "next/link";
import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PenLine, Plus, Trash2 } from "lucide-react";
import { useListEntries, useDeleteListEntry } from "@/hooks/use-list";
import type { UserListEntry } from "@/lib/types";
import { STATUS_LABELS, SHOW_STATUSES } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/date";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { QueryState } from "@/components/shared/query-state";
import { ShowStatusBadge } from "@/components/shows/show-status-badge";
import { ListEntryDialog } from "@/components/shows/list-entry-dialog";
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

function ListRowActions({ entry }: { entry: UserListEntry }) {
    const [editOpen, setEditOpen] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const deleteMutation = useDeleteListEntry();

    async function handleDelete() {
        try {
            await deleteMutation.mutateAsync(entry.id);
            toast.success("Removed from list");
            setDeleteOpen(false);
        } catch {
            toast.error("Failed to remove from list");
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

            <ListEntryDialog open={editOpen} onOpenChange={setEditOpen} entry={entry} />
            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Remove from list?"
                description={`"${entry.title}" will be removed from your list.`}
                confirmLabel="Remove"
                variant="destructive"
                isPending={deleteMutation.isPending}
                onConfirm={handleDelete}
            />
        </>
    );
}

// ── Columns ───────────────────────────────────────────────────────────────────

const columns: ColumnDef<UserListEntry>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
        cell: ({ row }) => (
            <div className="max-w-[260px]">
                <Link
                    href={`/catalog/${row.original.catalog_id}`}
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
        cell: ({ row }) => <ListRowActions entry={row.original} />,
        size: 56,
    },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ListPage() {
    const [addOpen, setAddOpen] = React.useState(false);
    const [statusFilter, setStatusFilter] = React.useState<string>("all");

    const params = statusFilter !== "all" ? { status: statusFilter } : {};
    const { data, isLoading, isError } = useListEntries(params);
    const entries = data?.entries ?? [];

    return (
        <div className="space-y-6">
            <PageHeader
                title="My List"
                description="All the titles you're tracking."
                actions={
                    <Button onClick={() => setAddOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add to list
                    </Button>
                }
            />

            <QueryState isLoading={false} isError={isError} isEmpty={false}>
                <DataTable
                    columns={columns}
                    data={entries}
                    isLoading={isLoading}
                    filterColumn="title"
                    filterPlaceholder="Search list…"
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

            <ListEntryDialog open={addOpen} onOpenChange={setAddOpen} />
        </div>
    );
}
