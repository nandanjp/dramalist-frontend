// ── Auth ──────────────────────────────────────────────────────────────────────

export interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    display_name: string;
    password: string;
}

export interface LoginResponse extends TokenResponse {
    require_totp?: boolean;
    pending_id?: string;
}

export interface TotpVerifyRequest {
    pending_id: string;
    code: string;
}

// ── User ──────────────────────────────────────────────────────────────────────

export interface Profile {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string | null;
    bio: string | null;
    is_public: boolean;
    profile_slug: string | null;
    created_at: string;
    updated_at: string;
}

export interface Preferences {
    user_id: string;
    default_sort: string;
    default_status_filter: string[];
    default_genre_filter: string[];
    ui_theme: string;
    updated_at: string;
}

export interface WatchStats {
    user_id: string;
    total_watched: number;
    total_episodes: number;
    avg_rating: number | null;
    genre_breakdown: Record<string, number>;
    updated_at: string;
}

export interface MeResponse {
    profile: Profile;
    preferences: Preferences;
    watch_stats: WatchStats | null;
}

export interface UpdateProfileRequest {
    display_name?: string;
    avatar_url?: string;
    bio?: string;
    is_public?: boolean;
    profile_slug?: string;
    preferences?: {
        default_sort?: string;
        default_status_filter?: string[];
        default_genre_filter?: string[];
        ui_theme?: string;
    };
}

// ── Shows / Status ────────────────────────────────────────────────────────────

export type ShowStatus = "watching" | "completed" | "dropped" | "plan_to_watch" | "on_hold";
export type MediaType = "show" | "movie" | "anime";
export type AiringStatus = "ongoing" | "completed" | "upcoming";
export type CastRole = "main" | "supporting" | "guest";

export const SHOW_STATUSES: ShowStatus[] = [
    "watching",
    "completed",
    "dropped",
    "plan_to_watch",
    "on_hold",
];

export const MEDIA_TYPES: MediaType[] = ["show", "movie", "anime"];

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
    show: "Show",
    movie: "Movie",
    anime: "Anime",
};

export const STATUS_LABELS: Record<ShowStatus, string> = {
    watching: "Watching",
    completed: "Completed",
    dropped: "Dropped",
    plan_to_watch: "Plan to Watch",
    on_hold: "On Hold",
};

// ── Catalog ───────────────────────────────────────────────────────────────────

export interface CatalogEntry {
    id: string;
    media_type: MediaType;
    title: string;
    original_title: string | null;
    synopsis: string | null;
    poster_url: string | null;
    year: number | null;
    country: string | null;
    language: string | null;
    episode_count: number | null;
    duration_minutes: number | null;
    genre: string[];
    airing_status: AiringStatus;
    created_at: string;
    updated_at: string;
}

export interface CatalogDetail extends CatalogEntry {
    cast: CastMember[];
}

export interface CatalogListResponse {
    results: CatalogEntry[];
    total: number;
    page: number;
    limit: number;
}

// ── User List ─────────────────────────────────────────────────────────────────

export interface UserListEntry {
    id: string;
    user_id: string;
    catalog_id: string;
    status: ShowStatus;
    episodes_watched: number;
    notes: string | null;
    tags: string[];
    is_public: boolean;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    // Denormalized from catalog join
    title: string;
    original_title: string | null;
    media_type: MediaType;
    genre: string[];
    year: number | null;
    country: string | null;
    language: string | null;
    episode_count: number | null;
    airing_status: AiringStatus;
    poster_url: string | null;
}

export interface UserListResponse {
    entries: UserListEntry[];
    total: number;
    page: number;
    limit: number;
}

export interface AddToListRequest {
    catalog_id: string;
    status: ShowStatus;
    episodes_watched?: number;
    notes?: string;
    tags?: string[];
    is_public?: boolean;
    started_at?: string;
    completed_at?: string;
}

export type UpdateListEntryRequest = Partial<Omit<AddToListRequest, "catalog_id">>;

// ── Actors / Cast ─────────────────────────────────────────────────────────────

export interface Actor {
    id: string;
    name: string;
}

export interface CastMember {
    cast_id: string;
    actor_id: string;
    actor_name: string;
    character_name: string | null;
    role: CastRole;
    sort_order: number;
}

export interface AddCastMemberRequest {
    actor_id: string;
    character_name?: string;
    role?: CastRole;
    sort_order?: number;
}

export interface UpdateCastMemberRequest {
    character_name?: string;
    role?: CastRole;
    sort_order?: number;
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface Review {
    id: string;
    catalog_id: string;
    catalog_title: string | null;
    user_id: string;
    rating: number;
    content: string | null;
    content_html: string | null;
    contains_spoilers: boolean;
    is_public: boolean;
    created_at: string;
    updated_at: string;
}

export interface ReviewAggregate {
    catalog_id: string;
    avg_rating: number | null;
    review_count: number;
}

export interface ReviewListResponse {
    reviews: Review[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateReviewRequest {
    catalog_id: string;
    catalog_title?: string;
    rating: number;
    content?: string;
    contains_spoilers?: boolean;
    is_public?: boolean;
    show_genres?: string[];
    show_episode_count?: number;
}

export interface UpdateReviewRequest {
    rating?: number;
    content?: string;
    contains_spoilers?: boolean;
    is_public?: boolean;
}

export interface PublicReviewPreview {
    id: string;
    catalog_id: string;
    user_id: string;
    rating: number;
    content_snippet: string | null;
    created_at: string;
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchResult {
    catalog_id: string;
    media_type: MediaType;
    title: string;
    original_title: string | null;
    synopsis: string | null;
    genre: string[];
    airing_status: AiringStatus;
    year: number | null;
    country: string | null;
    language: string | null;
    poster_url: string | null;
}

export interface SearchResponse {
    results: SearchResult[];
    total: number;
    page: number;
    limit: number;
}

export interface SearchParams {
    q?: string;
    media_type?: MediaType;
    genre?: string;
    year_from?: number;
    year_to?: number;
    country?: string;
    language?: string;
    airing_status?: AiringStatus;
    page?: number;
    limit?: number;
}

// ── AI ────────────────────────────────────────────────────────────────────────

export interface AIRecommendation {
    title: string;
    reason: string;
    genre?: string[];
    year?: number | null;
    estimated_episodes?: number | null;
}

export interface RecommendationsRequest {
    genre_breakdown: Record<string, number>;
    avg_rating: number | null;
    total_watched: number;
    recent_shows: string[];
}

export interface MoodSearchRequest {
    prompt: string;
}

export interface MoodSearchResult {
    query: string;
    genres: string[];
    tags: string[];
}

export interface ShowSummary {
    show_id: string;
    summary: string;
    sentiment: "positive" | "negative" | "mixed";
    highlights: string[];
    criticisms: string[];
}
