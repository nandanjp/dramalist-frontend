import { type NextRequest, NextResponse } from "next/server";
import { listStore } from "@/mocks/state";

export async function GET(request: NextRequest) {
    const sp = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") ?? "20")));

    const entries = listStore.filter((e) => e.is_public);
    const total = entries.length;
    const offset = (page - 1) * limit;
    return NextResponse.json({ entries: entries.slice(offset, offset + limit), total, page, limit });
}
