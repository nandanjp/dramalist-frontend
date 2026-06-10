import { type NextRequest, NextResponse } from "next/server";
import { reviewStore } from "@/mocks/state";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
    const { id } = await params;
    const review = reviewStore.find((r) => r.id === id);
    if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(review);
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
    const { id } = await params;
    const idx = reviewStore.findIndex((r) => r.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    reviewStore[idx] = { ...reviewStore[idx], ...body, updated_at: new Date().toISOString() };
    return NextResponse.json(reviewStore[idx]);
}

export async function DELETE(_req: Request, { params }: Ctx) {
    const { id } = await params;
    const idx = reviewStore.findIndex((r) => r.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    reviewStore.splice(idx, 1);
    return new NextResponse(null, { status: 204 });
}
