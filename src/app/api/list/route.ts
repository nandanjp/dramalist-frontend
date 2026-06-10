import { type NextRequest, NextResponse } from "next/server";
import { listStore } from "@/mocks/state";
import { MOCK_CATALOG, MOCK_USER_ID } from "@/mocks/data";
import type { UserListEntry } from "@/lib/types";

export async function GET(request: NextRequest) {
    const sp = request.nextUrl.searchParams;
    const status = sp.get("status") ?? "";
    const page = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "20")));

    let entries = [...listStore];
    if (status) entries = entries.filter((e) => e.status === status);

    const total = entries.length;
    const offset = (page - 1) * limit;
    return NextResponse.json({ entries: entries.slice(offset, offset + limit), total, page, limit });
}

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    if (!body?.catalog_id) {
        return NextResponse.json({ error: "catalog_id required" }, { status: 400 });
    }

    const existing = listStore.find((e) => e.catalog_id === body.catalog_id);
    if (existing) return NextResponse.json({ error: "already in list" }, { status: 409 });

    const catalog = MOCK_CATALOG.find((c) => c.id === body.catalog_id);
    if (!catalog) return NextResponse.json({ error: "catalog entry not found" }, { status: 404 });

    const now = new Date().toISOString();
    const entry: UserListEntry = {
        id: `lst-${Date.now()}`,
        user_id: MOCK_USER_ID,
        catalog_id: body.catalog_id,
        status: body.status ?? "plan_to_watch",
        episodes_watched: body.episodes_watched ?? 0,
        notes: body.notes ?? null,
        tags: body.tags ?? [],
        is_public: body.is_public ?? true,
        started_at: body.started_at ?? null,
        completed_at: body.completed_at ?? null,
        created_at: now,
        updated_at: now,
        title: catalog.title,
        original_title: catalog.original_title,
        media_type: catalog.media_type,
        genre: catalog.genre,
        year: catalog.year,
        country: catalog.country,
        language: catalog.language,
        episode_count: catalog.episode_count,
        airing_status: catalog.airing_status,
        poster_url: catalog.poster_url,
    };

    listStore.push(entry);
    return NextResponse.json(entry, { status: 201 });
}
