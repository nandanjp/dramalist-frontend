"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    filterColumn?: string;
    filterPlaceholder?: string;
    /** Extra filter controls (status selects, toggles, etc.) rendered on the right. */
    children?: React.ReactNode;
}

export function DataTableToolbar<TData>({
    table,
    filterColumn,
    filterPlaceholder = "Filter…",
    children,
}: DataTableToolbarProps<TData>) {
    const isFiltered =
        table.getState().globalFilter !== "" || table.getState().columnFilters.length > 0;

    return (
        <div className="flex items-center gap-2">
            {filterColumn && (
                <Input
                    placeholder={filterPlaceholder}
                    value={(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""}
                    onChange={(e) => table.getColumn(filterColumn)?.setFilterValue(e.target.value)}
                    className="h-8 w-64"
                />
            )}

            {children}

            {isFiltered && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => {
                        table.resetColumnFilters();
                        table.resetGlobalFilter();
                    }}
                >
                    Reset
                    <X className="ml-1 h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
}
