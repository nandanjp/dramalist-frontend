import { type NextRequest, NextResponse } from "next/server";
import { reviewStore } from "@/mocks/state";

export async function GET(request: NextRequest) {
    const sp = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "20")));

    const total = reviewStore.length;
    const offset = (page - 1) * limit;
    return NextResponse.json({
        reviews: reviewStore.slice(offset, offset + limit),
        total,
        page,
        limit,
    });
}
