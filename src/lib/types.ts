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

// ── Shows ─────────────────────────────────────────────────────────────────────

export type ShowStatus = "watching" | "completed" | "dropped" | "plan_to_watch" | "on_hold";

export const SHOW_STATUSES: ShowStatus[] = [
    "watching",
    "completed",
    "dropped",
    "plan_to_watch",
    "on_hold",
];

export const STATUS_LABELS: Record<ShowStatus, string> = {
    watching: "Watching",
    completed: "Completed",
    dropped: "Dropped",
    plan_to_watch: "Plan to Watch",
    on_hold: "On Hold",
};

export interface Show {
    id: string;
    user_id: string;
    title: string;
    original_title: string | null;
    genre: string[];
    status: ShowStatus;
    episode_count: number | null;
    episodes_watched: number;
    year: number | null;
    country: string | null;
    language: string | null;
    notes: string | null;
    tags: string[];
    is_public: boolean;
    started_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface ShowListResponse {
    shows: Show[];
    total: number;
    page: number;
    limit: number;
}

export interface CreateShowRequest {
    title: string;
    original_title?: string;
    genre?: string[];
    status: ShowStatus;
    episode_count?: number;
    episodes_watched?: number;
    year?: number;
    country?: string;
    language?: string;
    notes?: string;
    tags?: string[];
    is_public?: boolean;
    started_at?: string;
    completed_at?: string;
}

export type UpdateShowRequest = Partial<CreateShowRequest>;

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface Review {
    id: string;
    show_id: string;
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
    show_id: string;
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
    show_id: string;
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
    show_id: string;
    user_id: string;
    rating: number;
    content_snippet: string | null;
    created_at: string;
}

// ── Search ────────────────────────────────────────────────────────────────────

export interface SearchResult {
    show_id: string;
    user_id: string;
    title: string;
    original_title: string;
    genre: string[];
    status: ShowStatus;
    tags: string[];
    year: number | null;
    is_public: boolean;
}

export interface SearchResponse {
    results: SearchResult[];
    total: number;
    page: number;
    limit: number;
}

export interface SearchParams {
    q?: string;
    status?: ShowStatus;
    genre?: string;
    mine?: boolean;
    page?: number;
    limit?: number;
}

// ── AI ────────────────────────────────────────────────────────────────────────

export interface AIRecommendation {
    title: string;
    reason: string;
    genre: string[];
    year: number | null;
    estimated_episodes: number | null;
}

export interface RecommendationsRequest {
    genre_breakdown: Record<string, number>;
    avg_rating: number | null;
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
