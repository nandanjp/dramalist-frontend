"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useDebounce } from "@/hooks/use-debounce";
import { useCatalogSearch } from "@/hooks/use-catalog";
import type { ViewMode } from "@/components/shared/view-toggle";
import {
    CatalogToolbar,
    DEFAULT_FILTER_STATE,
    type FilterState,
} from "./_components/catalog-toolbar";
import { CatalogGrid } from "./_components/catalog-grid";
import { CatalogPagination } from "./_components/catalog-pagination";

const LIMIT = 10;

export default function CatalogPage() {
    const [inputQ, setInputQ] = useState("");
    const [draft, setDraft] = useState<FilterState>(DEFAULT_FILTER_STATE);
    const [applied, setApplied] = useState<FilterState>(DEFAULT_FILTER_STATE);
    const [page, setPage] = useState(1);
    const [view, setView] = useState<ViewMode>("grid");

    const queryQ = useDebounce(inputQ, 350);
    const isDirty = JSON.stringify(draft) !== JSON.stringify(applied);

    const hasActiveFilters =
        applied.mediaType !== "" ||
        applied.airingStatus !== "" ||
        applied.genres.length > 0 ||
        applied.yearFrom !== undefined ||
        applied.yearTo !== undefined;

    const { data, isLoading, isFetching } = useCatalogSearch({
        q: queryQ || undefined,
        media_type: applied.mediaType || undefined,
        airing_status: applied.airingStatus || undefined,
        genre: applied.genres.length ? applied.genres : undefined,
        year_from: applied.yearFrom,
        year_to: applied.yearTo,
        page,
        limit: LIMIT,
        sort: applied.sort,
    });

    function onDraftChange(patch: Partial<FilterState>) {
        setDraft((prev) => ({ ...prev, ...patch }));
    }

    function applyFilters() {
        setApplied(draft);
        setPage(1);
    }

    function clearAll() {
        setDraft(DEFAULT_FILTER_STATE);
        setApplied(DEFAULT_FILTER_STATE);
        setPage(1);
    }

    function onInputQChange(v: string) {
        setInputQ(v);
        setPage(1);
    }

    return (
        <div className="relative overflow-hidden">
            {/* Background blobs — same language as the hero section */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-32 -right-40 size-130 rounded-full bg-linear-to-bl from-violet-200/35 via-pink-200/20 to-transparent blur-3xl dark:from-violet-800/12 dark:via-pink-800/6 dark:to-transparent"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute top-96 -left-32 size-96 rounded-full bg-linear-to-tr from-fuchsia-200/25 via-violet-200/15 to-transparent blur-3xl dark:from-fuchsia-900/10 dark:via-violet-900/5 dark:to-transparent"
            />

            <div className="container py-10">
                {/* Page header */}
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="mb-3 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-[10px] font-semibold tracking-widest text-violet-700 uppercase dark:bg-violet-950/50 dark:text-violet-400">
                        Discover · Explore · Watch
                    </div>
                    <h1 className="font-hand text-foreground text-4xl tracking-normal md:text-5xl">
                        Browse the{" "}
                        <span className="font-display italic text-violet-600 dark:text-violet-400">
                            Catalogue
                        </span>
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-md text-sm leading-relaxed">
                        Every drama, movie and anime in the collection — search, filter, and find
                        your next obsession.
                    </p>
                </motion.div>

                <CatalogToolbar
                    inputQ={inputQ}
                    onInputQChange={onInputQChange}
                    draft={draft}
                    onDraftChange={onDraftChange}
                    isDirty={isDirty}
                    hasActiveFilters={hasActiveFilters}
                    onApply={applyFilters}
                    onClear={clearAll}
                    view={view}
                    onViewChange={setView}
                    isFetching={isFetching}
                    total={data?.total}
                />

                <CatalogGrid entries={data?.results} isLoading={isLoading} view={view} />

                {data && (
                    <CatalogPagination
                        page={page}
                        total={data.total}
                        limit={LIMIT}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </div>
    );
}
