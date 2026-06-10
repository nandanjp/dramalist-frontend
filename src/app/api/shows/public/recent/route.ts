import { NextResponse } from "next/server";
import { MOCK_CATALOG } from "@/mocks/data";

export async function GET() {
    // Return last 6 entries as "recently added"
    return NextResponse.json([...MOCK_CATALOG].reverse().slice(0, 6));
}
