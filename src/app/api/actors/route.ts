import { type NextRequest, NextResponse } from "next/server";
import { MOCK_ACTORS } from "@/mocks/data";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const q           = searchParams.get("q")?.toLowerCase() ?? "";
    const nationality = searchParams.get("nationality")?.toLowerCase() ?? "";
    const page        = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit       = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "24", 10)));

    let results = MOCK_ACTORS;

    if (q) {
        results = results.filter(
            (a) =>
                a.name.toLowerCase().includes(q) ||
                (a.native_name?.toLowerCase().includes(q) ?? false),
        );
    }

    if (nationality) {
        results = results.filter(
            (a) => a.nationality?.toLowerCase().includes(nationality) ?? false,
        );
    }

    const total  = results.length;
    const actors = results.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ actors, total, page, limit });
}
