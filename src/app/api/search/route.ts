import { type NextRequest, NextResponse } from "next/server";
import { MOCK_CATALOG } from "@/mocks/data";
import type { SearchResult } from "@/lib/types";

export async function GET(request: NextRequest) {
    const sp = request.nextUrl.searchParams;
    const q = sp.get("q")?.toLowerCase() ?? "";
    const mediaType = sp.get("media_type") ?? "";
    const airingStatus = sp.get("airing_status") ?? "";
    const page = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "20")));

    let results = MOCK_CATALOG.map(
        (e): SearchResult => ({
            catalog_id: e.id,
            media_type: e.media_type,
            title: e.title,
            original_title: e.original_title,
            synopsis: e.synopsis,
            genre: e.genre,
            airing_status: e.airing_status,
            year: e.year,
            country: e.country,
            language: e.language,
            poster_url: e.poster_url,
        }),
    );

    if (q) {
        results = results.filter(
            (e) =>
                e.title.toLowerCase().includes(q) ||
                (e.original_title?.toLowerCase().includes(q) ?? false),
        );
    }
    if (mediaType) results = results.filter((e) => e.media_type === mediaType);
    if (airingStatus) results = results.filter((e) => e.airing_status === airingStatus);

    const total = results.length;
    const offset = (page - 1) * limit;
    return NextResponse.json({ results: results.slice(offset, offset + limit), total, page, limit });
}
