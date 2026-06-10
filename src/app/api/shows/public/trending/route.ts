import { NextResponse } from "next/server";
import { MOCK_CATALOG } from "@/mocks/data";

export async function GET() {
    // Return first 6 shows as "trending"
    return NextResponse.json(MOCK_CATALOG.filter((e) => e.media_type === "show").slice(0, 6));
}
