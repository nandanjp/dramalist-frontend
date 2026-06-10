import { type NextRequest, NextResponse } from "next/server";
import { meStore } from "@/mocks/state";

export async function GET() {
    return NextResponse.json(meStore.data);
}

export async function PATCH(request: NextRequest) {
    const body = await request.json().catch(() => ({}));
    const { preferences, ...profileFields } = body;

    meStore.data = {
        ...meStore.data,
        profile: { ...meStore.data.profile, ...profileFields, updated_at: new Date().toISOString() },
        preferences: preferences
            ? { ...meStore.data.preferences, ...preferences, updated_at: new Date().toISOString() }
            : meStore.data.preferences,
    };

    return NextResponse.json(meStore.data);
}
