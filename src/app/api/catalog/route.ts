import { type NextRequest, NextResponse } from "next/server";
import { MOCK_CATALOG } from "@/mocks/data";
import type { CatalogEntry } from "@/lib/types";

export async function GET(request: NextRequest) {
    const sp = request.nextUrl.searchParams;
    const q = sp.get("q")?.toLowerCase() ?? "";
    const mediaType = sp.get("media_type") ?? "";
    const airingStatus = sp.get("airing_status") ?? "";
    const genres = sp.getAll("genre");
    const yearFrom = sp.get("year_from") ? parseInt(sp.get("year_from")!) : null;
    const yearTo = sp.get("year_to") ? parseInt(sp.get("year_to")!) : null;
    const page = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "24")));
    const sort = sp.get("sort") ?? "created_at:desc";

    let results = [...MOCK_CATALOG];

    if (q) {
        results = results.filter(
            (e) =>
                e.title.toLowerCase().includes(q) ||
                (e.original_title?.toLowerCase().includes(q) ?? false),
        );
    }
    if (mediaType) results = results.filter((e) => e.media_type === mediaType);
    if (airingStatus) results = results.filter((e) => e.airing_status === airingStatus);
    if (genres.length) results = results.filter((e) => genres.every((g) => e.genre.includes(g)));
    if (yearFrom !== null) results = results.filter((e) => e.year !== null && e.year >= yearFrom);
    if (yearTo !== null) results = results.filter((e) => e.year !== null && e.year <= yearTo);

    const [sortField, sortDir] = sort.split(":");
    results.sort((a, b) => {
        const av = a[sortField as keyof CatalogEntry] ?? "";
        const bv = b[sortField as keyof CatalogEntry] ?? "";
        const cmp = av < bv ? -1 : av > bv ? 1 : 0;
        return sortDir === "desc" ? -cmp : cmp;
    });

    const total = results.length;
    const offset = (page - 1) * limit;
    return NextResponse.json({
        results: results.slice(offset, offset + limit),
        total,
        page,
        limit,
    });
}
