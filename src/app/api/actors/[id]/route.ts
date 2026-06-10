import { NextResponse } from "next/server";
import { MOCK_ACTORS, MOCK_CAST, MOCK_CATALOG } from "@/mocks/data";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const actor = MOCK_ACTORS.find((a) => a.id === id);
    if (!actor) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Build filmography by scanning all cast lists for this actor
    const filmography = Object.entries(MOCK_CAST).flatMap(([catalogId, castList]) => {
        const member = castList.find((c) => c.actor_id === id);
        if (!member) return [];
        const catalog = MOCK_CATALOG.find((c) => c.id === catalogId);
        if (!catalog) return [];
        return [{
            cast_id:        member.cast_id,
            catalog_id:     catalogId,
            media_type:     catalog.media_type,
            title:          catalog.title,
            original_title: catalog.original_title ?? null,
            poster_url:     catalog.poster_url ?? null,
            year:           catalog.year ?? null,
            character_name: member.character_name,
            role:           member.role,
            sort_order:     member.sort_order,
        }];
    });

    return NextResponse.json({ ...actor, filmography });
}
