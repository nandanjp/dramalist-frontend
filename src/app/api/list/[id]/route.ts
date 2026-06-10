import { type NextRequest, NextResponse } from "next/server";
import { listStore } from "@/mocks/state";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
    const { id } = await params;
    const entry = listStore.find((e) => e.id === id);
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(entry);
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
    const { id } = await params;
    const idx = listStore.findIndex((e) => e.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json().catch(() => ({}));
    listStore[idx] = { ...listStore[idx], ...body, updated_at: new Date().toISOString() };
    return NextResponse.json(listStore[idx]);
}

export async function DELETE(_req: Request, { params }: Ctx) {
    const { id } = await params;
    const idx = listStore.findIndex((e) => e.id === id);
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });
    listStore.splice(idx, 1);
    return new NextResponse(null, { status: 204 });
}
