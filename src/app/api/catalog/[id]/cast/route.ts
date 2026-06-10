import { NextResponse } from "next/server";
import { MOCK_CAST } from "@/mocks/data";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    return NextResponse.json(MOCK_CAST[id] ?? []);
}
