import { type NextRequest, NextResponse } from "next/server";
import { reviewStore } from "@/mocks/state";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Ctx) {
    const { id } = await params;
    const sp = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "20")));

    const all = reviewStore.filter((r) => r.catalog_id === id);
    const total = all.length;
    const offset = (page - 1) * limit;
    return NextResponse.json({ reviews: all.slice(offset, offset + limit), total, page, limit });
}
