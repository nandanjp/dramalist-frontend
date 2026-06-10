"use client";

import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface CatalogPaginationProps {
    page: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export function CatalogPagination({ page, total, limit, onPageChange }: CatalogPaginationProps) {
    const totalPages = Math.ceil(total / limit);
    if (totalPages <= 1) return null;

    function getPages(): (number | "…")[] {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
        if (page >= totalPages - 3)
            return [
                1,
                "…",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        return [1, "…", page - 1, page, page + 1, "…", totalPages];
    }

    return (
        <div className="mt-8">
            <Pagination className="justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page > 1) onPageChange(page - 1);
                            }}
                            aria-disabled={page === 1}
                            className={page === 1 ? "pointer-events-none opacity-50" : undefined}
                        />
                    </PaginationItem>

                    {getPages().map((p, i) =>
                        p === "…" ? (
                            <PaginationItem key={`ellipsis-${i}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href="#"
                                    isActive={p === page}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(p as number);
                                    }}
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (page < totalPages) onPageChange(page + 1);
                            }}
                            aria-disabled={page === totalPages}
                            className={
                                page === totalPages ? "pointer-events-none opacity-50" : undefined
                            }
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
