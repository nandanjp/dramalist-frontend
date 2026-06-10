import { MOCK_LIST, MOCK_ME, MOCK_REVIEWS } from "./data";
import type { MeResponse, Review, UserListEntry } from "@/lib/types";

// In-memory mutable stores — reset on server restart, persist across hot reloads.
export const meStore: { data: MeResponse } = { data: JSON.parse(JSON.stringify(MOCK_ME)) };
export const listStore: UserListEntry[] = JSON.parse(JSON.stringify(MOCK_LIST));
export const reviewStore: Review[] = JSON.parse(JSON.stringify(MOCK_REVIEWS));
