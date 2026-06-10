import { NextResponse } from "next/server";
import { meStore } from "@/mocks/state";

export async function GET() {
    return NextResponse.json(meStore.data.profile);
}
