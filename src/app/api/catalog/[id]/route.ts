import { NextResponse } from "next/server";
import { MOCK_CATALOG_DETAIL } from "@/mocks/data";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const entry = MOCK_CATALOG_DETAIL[id];
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(entry);
}
