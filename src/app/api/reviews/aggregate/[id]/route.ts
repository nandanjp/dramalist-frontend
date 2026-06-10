import { NextResponse } from "next/server";
import { reviewStore } from "@/mocks/state";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const reviews = reviewStore.filter((r) => r.catalog_id === id);
    const avg =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : null;
    return NextResponse.json({ catalog_id: id, avg_rating: avg, review_count: reviews.length });
}
