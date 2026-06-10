import { NextResponse } from "next/server";
import { reviewStore } from "@/mocks/state";
import type { PublicReviewPreview } from "@/lib/types";

export async function GET() {
    const previews: PublicReviewPreview[] = reviewStore
        .filter((r) => r.is_public)
        .slice(0, 10)
        .map((r) => ({
            id: r.id,
            catalog_id: r.catalog_id,
            user_id: r.user_id,
            rating: r.rating,
            content_snippet: r.content ? r.content.slice(0, 120) : null,
            created_at: r.created_at,
        }));
    return NextResponse.json(previews);
}
