import { type NextRequest, NextResponse } from "next/server";
import { reviewStore } from "@/mocks/state";
import { MOCK_USER_ID } from "@/mocks/data";
import type { Review } from "@/lib/types";

export async function POST(request: NextRequest) {
    const body = await request.json().catch(() => null);
    if (!body?.catalog_id || body.rating == null) {
        return NextResponse.json({ error: "catalog_id and rating required" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const review: Review = {
        id: `rev-${Date.now()}`,
        catalog_id: body.catalog_id,
        catalog_title: body.catalog_title ?? null,
        user_id: MOCK_USER_ID,
        rating: body.rating,
        content: body.content ?? null,
        content_html: body.content ? `<p>${body.content}</p>` : null,
        contains_spoilers: body.contains_spoilers ?? false,
        is_public: body.is_public ?? true,
        created_at: now,
        updated_at: now,
    };

    reviewStore.push(review);
    return NextResponse.json(review, { status: 201 });
}
