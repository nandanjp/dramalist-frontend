import type {
    CatalogDetail,
    CatalogEntry,
    CastMember,
    Actor,
    MeResponse,
    UserListEntry,
    Review,
} from "@/lib/types";

// ── User ──────────────────────────────────────────────────────────────────────

export const MOCK_USER_ID = "00000000-0000-0000-0000-000000000001";

export const MOCK_ME: MeResponse = {
    profile: {
        id: MOCK_USER_ID,
        email: "dev@dramalist.app",
        display_name: "Dev User",
        avatar_url: "https://i.pravatar.cc/150?img=3",
        bio: "Watching dramas since 2015. Sucker for slow-burn romance and crime thrillers.",
        is_public: true,
        profile_slug: "devuser",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
    },
    preferences: {
        user_id: MOCK_USER_ID,
        default_sort: "created_at:desc",
        default_status_filter: [],
        default_genre_filter: [],
        ui_theme: "system",
        updated_at: "2024-01-01T00:00:00Z",
    },
    watch_stats: {
        user_id: MOCK_USER_ID,
        total_watched: 8,
        total_episodes: 134,
        avg_rating: 8.4,
        genre_breakdown: {
            Romance: 6,
            Drama: 8,
            Thriller: 3,
            Crime: 2,
            Mystery: 2,
        },
        updated_at: "2024-06-01T00:00:00Z",
    },
};

// ── Catalog ───────────────────────────────────────────────────────────────────

const now = "2024-06-01T00:00:00Z";

function entry(e: CatalogEntry): CatalogEntry {
    return e;
}

export const MOCK_CATALOG: CatalogEntry[] = [
    entry({
        id: "cat-001",
        media_type: "show",
        title: "Reply 1988",
        original_title: "응답하라 1988",
        synopsis:
            "Set in a Seoul neighbourhood in 1988, five families and their teenage children navigate life, friendship, and first loves during a pivotal year in South Korean history.",
        poster_url: "https://i.pravatar.cc/400?img=11",
        year: 2015,
        country: "South Korea",
        language: "Korean",
        episode_count: 20,
        duration_minutes: 90,
        genre: ["Romance", "Drama", "Comedy"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-002",
        media_type: "show",
        title: "Crash Landing on You",
        original_title: "사랑의 불시착",
        synopsis:
            "A South Korean heiress paragliding in Switzerland accidentally crash-lands in North Korea and falls in love with a North Korean army officer who tries to help her return home.",
        poster_url: "https://i.pravatar.cc/400?img=12",
        year: 2019,
        country: "South Korea",
        language: "Korean",
        episode_count: 16,
        duration_minutes: 75,
        genre: ["Romance", "Drama", "Comedy"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-003",
        media_type: "show",
        title: "Vincenzo",
        original_title: "빈센조",
        synopsis:
            "A Korean-Italian mafia lawyer returns to Korea and joins forces with a sharp-tongued attorney to bring down a corrupt conglomerate — using the villains' own methods.",
        poster_url: "https://i.pravatar.cc/400?img=13",
        year: 2021,
        country: "South Korea",
        language: "Korean",
        episode_count: 20,
        duration_minutes: 70,
        genre: ["Crime", "Comedy", "Romance"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-004",
        media_type: "show",
        title: "My Mister",
        original_title: "나의 아저씨",
        synopsis:
            "Three middle-aged brothers and a young woman with a difficult life find healing through their unlikely connection, slowly transforming each other's worlds.",
        poster_url: "https://i.pravatar.cc/400?img=14",
        year: 2018,
        country: "South Korea",
        language: "Korean",
        episode_count: 16,
        duration_minutes: 70,
        genre: ["Drama", "Melodrama"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-005",
        media_type: "show",
        title: "Extraordinary Attorney Woo",
        original_title: "이상한 변호사 우영우",
        synopsis:
            "A brilliant attorney with autism navigates the challenges of a top law firm while taking on cases that touch on social justice, all while discovering what it means to truly connect with others.",
        poster_url: "https://i.pravatar.cc/400?img=15",
        year: 2022,
        country: "South Korea",
        language: "Korean",
        episode_count: 16,
        duration_minutes: 60,
        genre: ["Legal", "Romance", "Drama"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-006",
        media_type: "show",
        title: "Signal",
        original_title: "시그널",
        synopsis:
            "A cold-case profiler in 2015 discovers a walkie-talkie that connects him to a detective in 1989, together they attempt to solve cases across time — changing the past with unforeseen consequences.",
        poster_url: "https://i.pravatar.cc/400?img=16",
        year: 2016,
        country: "South Korea",
        language: "Korean",
        episode_count: 16,
        duration_minutes: 60,
        genre: ["Crime", "Mystery", "Thriller"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-007",
        media_type: "show",
        title: "Descendants of the Sun",
        original_title: "태양의 후예",
        synopsis:
            "A special forces captain and a surgeon fall in love amid military missions and humanitarian crises in a fictional war-torn country.",
        poster_url: null,
        year: 2016,
        country: "South Korea",
        language: "Korean",
        episode_count: 16,
        duration_minutes: 60,
        genre: ["Romance", "Action", "Drama"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-008",
        media_type: "show",
        title: "It's Okay to Not Be Okay",
        original_title: "사이코지만 괜찮아",
        synopsis:
            "A community health worker, his autistic older brother, and a self-centered children's book author find healing for their emotional wounds through an unlikely connection.",
        poster_url: "https://i.pravatar.cc/400?img=18",
        year: 2020,
        country: "South Korea",
        language: "Korean",
        episode_count: 16,
        duration_minutes: 65,
        genre: ["Romance", "Drama"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-009",
        media_type: "movie",
        title: "Parasite",
        original_title: "기생충",
        synopsis:
            "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
        poster_url: "https://i.pravatar.cc/400?img=19",
        year: 2019,
        country: "South Korea",
        language: "Korean",
        episode_count: null,
        duration_minutes: 132,
        genre: ["Thriller", "Drama", "Comedy"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-010",
        media_type: "movie",
        title: "Train to Busan",
        original_title: "부산행",
        synopsis:
            "While a zombie outbreak rapidly spreads across South Korea, a father and daughter fight to survive on a KTX train making its way to Busan.",
        poster_url: null,
        year: 2016,
        country: "South Korea",
        language: "Korean",
        episode_count: null,
        duration_minutes: 118,
        genre: ["Action", "Horror", "Thriller"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-011",
        media_type: "movie",
        title: "The Handmaiden",
        original_title: "아가씨",
        synopsis:
            "A young woman is hired as a handmaiden to a Japanese heiress living in a secluded estate, but the maid has a secret agenda entangled in deception and desire.",
        poster_url: "https://i.pravatar.cc/400?img=21",
        year: 2016,
        country: "South Korea",
        language: "Korean",
        episode_count: null,
        duration_minutes: 145,
        genre: ["Thriller", "Drama", "Mystery"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-012",
        media_type: "anime",
        title: "Attack on Titan",
        original_title: "進撃の巨人",
        synopsis:
            "In a world where humanity lives within enormous walled cities to protect themselves from gigantic man-eating humanoids called Titans, a young boy vows revenge after his mother is eaten.",
        poster_url: "https://i.pravatar.cc/400?img=22",
        year: 2013,
        country: "Japan",
        language: "Japanese",
        episode_count: 87,
        duration_minutes: 24,
        genre: ["Action", "Fantasy", "Drama"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-013",
        media_type: "anime",
        title: "Your Lie in April",
        original_title: "四月は君の嘘",
        synopsis:
            "A piano prodigy who lost his ability to hear his own playing meets a free-spirited violinist who helps him rediscover his love for music.",
        poster_url: "https://i.pravatar.cc/400?img=23",
        year: 2014,
        country: "Japan",
        language: "Japanese",
        episode_count: 22,
        duration_minutes: 22,
        genre: ["Romance", "Drama", "Musical"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
    entry({
        id: "cat-014",
        media_type: "anime",
        title: "Violet Evergarden",
        original_title: "ヴァイオレット・エヴァーガーデン",
        synopsis:
            "A former child soldier, now fitted with prosthetic arms, works as an Auto Memories Doll — a letter-writer for hire — as she struggles to understand the final words her major said to her.",
        poster_url: null,
        year: 2018,
        country: "Japan",
        language: "Japanese",
        episode_count: 13,
        duration_minutes: 24,
        genre: ["Drama", "Fantasy", "Romance"],
        airing_status: "completed",
        created_at: now,
        updated_at: now,
    }),
];

// ── Actors ────────────────────────────────────────────────────────────────────

export const MOCK_ACTORS: Actor[] = [
    { id: "act-001", name: "Park Bo-gum", native_name: "박보검", birthdate: "1993-06-01", nationality: "Korean", biography: "Park Bo-gum is a South Korean actor and singer who rose to prominence with his role in the hit drama Reply 1988. Known for his warm on-screen presence and versatility, he has starred in a string of critically acclaimed series including Encounter and Record of Youth. His natural charm and dedication to his craft have made him one of the most beloved actors of his generation.", profile_image_url: "https://i.pravatar.cc/400?img=51" },
    { id: "act-002", name: "Son Ye-jin", native_name: "손예진", birthdate: "1982-01-11", nationality: "Korean", biography: "Son Ye-jin is one of South Korea's most celebrated actresses, known for her refined screen presence and emotional depth. Her career spans two decades, with landmark performances in classics like A Moment to Remember and commercial hits like Crash Landing on You, where she starred opposite Hyun Bin, whom she later married.", profile_image_url: "https://i.pravatar.cc/400?img=47" },
    { id: "act-003", name: "Hyun Bin", native_name: "현빈", birthdate: "1982-09-25", nationality: "Korean", biography: "Hyun Bin is a South Korean actor who gained widespread recognition for Secret Garden before cementing his global superstar status in Crash Landing on You. His ability to portray stoic yet emotionally complex characters has earned him a devoted fanbase across Asia.", profile_image_url: "https://i.pravatar.cc/400?img=52" },
    { id: "act-004", name: "IU", native_name: "아이유", birthdate: "1993-05-16", nationality: "Korean", biography: "IU, born Lee Ji-eun, is a multi-talented South Korean singer-songwriter and actress. She transitioned seamlessly from pop stardom to acting, delivering acclaimed performances in My Mister and Hotel Del Luna. Her portrayal of nuanced, morally complex characters has established her as one of the finest dramatic actresses in Korean entertainment.", profile_image_url: "https://i.pravatar.cc/400?img=48" },
    { id: "act-005", name: "Lee Je-hoon", native_name: "이제훈", birthdate: "1984-07-04", nationality: "Korean", biography: "Lee Je-hoon is a South Korean actor celebrated for his intense and naturalistic performances. He first drew attention in the film Architecture 101 and has since starred in prestige dramas including Signal and Move to Heaven, earning widespread critical acclaim for his emotional range.", profile_image_url: "https://i.pravatar.cc/400?img=53" },
    { id: "act-006", name: "Park Seo-joon", native_name: "박서준", birthdate: "1988-12-16", nationality: "Korean", biography: "Park Seo-joon is a South Korean actor known for his charismatic leads in romantic comedies and action dramas. He gained international recognition through Itaewon Class and What's Wrong with Secretary Kim, and crossed over to Hollywood with a role in the Marvel film The Marvels.", profile_image_url: "https://i.pravatar.cc/400?img=54" },
    { id: "act-007", name: "Kim Go-eun", native_name: "김고은", birthdate: "1991-07-02", nationality: "Korean", biography: "Kim Go-eun is a South Korean actress who made a striking film debut in A Muse before earning drama fame in Goblin. She continued to impress in The King: Eternal Monarch and Yumi's Cells, showcasing remarkable range from fantasy romance to grounded slice-of-life storytelling.", profile_image_url: "https://i.pravatar.cc/400?img=49" },
    { id: "act-008", name: "Jung Ho-yeon", native_name: "정호연", birthdate: "1994-06-23", nationality: "Korean", biography: "Jung Ho-yeon is a South Korean model and actress who made her acting debut in the global phenomenon Squid Game, earning a Screen Actors Guild Award for her breakthrough performance. Her portrayal of the desperate and resourceful Kang Sae-byeok captivated audiences worldwide.", profile_image_url: "https://i.pravatar.cc/400?img=44" },
];

// ── Cast ──────────────────────────────────────────────────────────────────────

function cast(
    id: string,
    actorId: string,
    actorName: string,
    character: string,
    role: "main" | "supporting" | "guest",
    order: number,
): CastMember {
    return {
        cast_id: id,
        actor_id: actorId,
        actor_name: actorName,
        character_name: character,
        role,
        sort_order: order,
    };
}

export const MOCK_CAST: Record<string, CastMember[]> = {
    "cat-001": [
        cast("cs-001", "act-001", "Park Bo-gum", "Choi Taek", "main", 0),
        cast("cs-002", "act-004", "IU", "Sung Deok-sun", "main", 1),
    ],
    "cat-002": [
        cast("cs-003", "act-003", "Hyun Bin", "Ri Jeong-hyeok", "main", 0),
        cast("cs-004", "act-002", "Son Ye-jin", "Yoon Se-ri", "main", 1),
    ],
    "cat-003": [
        cast("cs-005", "act-006", "Park Seo-joon", "Jang Han-seok", "main", 0),
        cast("cs-006", "act-007", "Kim Go-eun", "Hong Cha-young", "main", 1),
    ],
    "cat-004": [
        cast("cs-007", "act-004", "IU", "Lee Ji-an", "main", 0),
    ],
    "cat-005": [
        cast("cs-008", "act-007", "Kim Go-eun", "Woo Young-woo", "main", 0),
        cast("cs-009", "act-006", "Park Seo-joon", "Lee Jun-ho", "main", 1),
    ],
    "cat-006": [
        cast("cs-010", "act-005", "Lee Je-hoon", "Park Hae-young", "main", 0),
    ],
    "cat-008": [
        cast("cs-011", "act-001", "Park Bo-gum", "Moon Gang-tae", "main", 0),
        cast("cs-012", "act-008", "Jung Ho-yeon", "Ko Moon-young", "main", 1),
    ],
    "cat-009": [cast("cs-013", "act-002", "Son Ye-jin", "Oh Geun-se", "supporting", 0)],
    "cat-012": [],
    "cat-013": [],
    "cat-014": [],
};

// ── Catalog detail (entry + cast merged) ──────────────────────────────────────

export const MOCK_CATALOG_DETAIL: Record<string, CatalogDetail> = Object.fromEntries(
    MOCK_CATALOG.map((e) => [
        e.id,
        { ...e, cast: MOCK_CAST[e.id] ?? [] },
    ]),
);

// ── User list ─────────────────────────────────────────────────────────────────

function listEntry(
    id: string,
    catalogId: string,
    status: UserListEntry["status"],
    episodesWatched: number,
    rating?: number,
): UserListEntry {
    const catalog = MOCK_CATALOG.find((c) => c.id === catalogId)!;
    return {
        id,
        user_id: MOCK_USER_ID,
        catalog_id: catalogId,
        status,
        episodes_watched: episodesWatched,
        notes: null,
        tags: [],
        is_public: true,
        started_at: "2024-01-10T00:00:00Z",
        completed_at: status === "completed" ? "2024-03-01T00:00:00Z" : null,
        created_at: "2024-01-10T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z",
        title: catalog.title,
        original_title: catalog.original_title,
        media_type: catalog.media_type,
        genre: catalog.genre,
        year: catalog.year,
        country: catalog.country,
        language: catalog.language,
        episode_count: catalog.episode_count,
        airing_status: catalog.airing_status,
        poster_url: catalog.poster_url,
    };
}

export const MOCK_LIST: UserListEntry[] = [
    listEntry("lst-001", "cat-001", "completed", 20),
    listEntry("lst-002", "cat-002", "completed", 16),
    listEntry("lst-003", "cat-003", "completed", 20),
    listEntry("lst-004", "cat-006", "completed", 16),
    listEntry("lst-005", "cat-009", "completed", 1),
    listEntry("lst-006", "cat-012", "completed", 87),
    listEntry("lst-007", "cat-004", "watching", 8),
    listEntry("lst-008", "cat-013", "plan_to_watch", 0),
];

// ── Reviews ───────────────────────────────────────────────────────────────────

function review(
    id: string,
    catalogId: string,
    title: string,
    rating: number,
    content: string,
): Review {
    return {
        id,
        catalog_id: catalogId,
        catalog_title: title,
        user_id: MOCK_USER_ID,
        rating,
        content,
        content_html: `<p>${content}</p>`,
        contains_spoilers: false,
        is_public: true,
        created_at: "2024-03-01T00:00:00Z",
        updated_at: "2024-03-01T00:00:00Z",
    };
}

export const MOCK_REVIEWS: Review[] = [
    review(
        "rev-001",
        "cat-001",
        "Reply 1988",
        10,
        "An absolute masterpiece. The nostalgic warmth, the ensemble cast chemistry, and the neighbourhood feel make this one of the greatest dramas ever made. Cried multiple times.",
    ),
    review(
        "rev-002",
        "cat-002",
        "Crash Landing on You",
        9,
        "The chemistry between the leads is off the charts. The North Korea setting is handled with surprising heart, and the supporting cast steals every scene they're in.",
    ),
    review(
        "rev-003",
        "cat-006",
        "Signal",
        9,
        "Tightly plotted and emotionally devastating. The walkie-talkie conceit never gets old, and the final episodes hit harder than almost anything I've seen in the genre.",
    ),
    review(
        "rev-004",
        "cat-009",
        "Parasite",
        10,
        "Bong Joon-ho's precision filmmaking is unmatched. Every detail pays off. A film that rewards multiple viewings and haunts you long after.",
    ),
    // Rich full review used for testing the review detail page
    {
        id: "rev-005",
        catalog_id: "cat-004",
        catalog_title: "My Mister",
        user_id: MOCK_USER_ID,
        rating: 10,
        contains_spoilers: true,
        is_public: true,
        created_at: "2024-05-14T09:22:00Z",
        updated_at: "2024-05-20T14:05:00Z",
        content: `There is a scene about two-thirds through My Mister where Park Dong-hoon sits alone in a quiet bar, soju in hand, and the camera simply watches him breathe. No dialogue. No score swell. Just a middle-aged man, somewhere between exhaustion and something almost like peace, existing in a world that has asked too much of him for too long. It is one of the most quietly devastating moments I have ever seen in a drama — and it is not the only one.

My Mister is about three brothers and a young woman who are all, in different ways, losing. The brothers — Sang-hoon, Sang-hun, and Dong-hoon — are caught in the specific misery of adulthood: failed ambitions, suffocated marriages, debts that feel like a moral failing. Lee Ji-an is twenty-something, carrying a grandmother on her back and a loan shark at her door, listening in on Dong-hoon's phone calls not to destroy him but because his ordinary life — his simple decency — is the closest thing to warmth she has ever felt.

The drama's genius is structural. Writer Park Hae-young refuses to let the central relationship tip into romance. What Dong-hoon and Ji-an share is something rarer onscreen: recognition. Two people who see each other without flattery or agenda. She overhears his humiliations; he notices her survival. The tenderness that builds between them is unconditional in a way romantic love rarely is.

IU's performance here is unlike anything else in her filmography. Ji-an is guarded to the point of blankness in public, and IU communicates entire internal landscapes through near-stillness — the set of her jaw, the way her eyes track a room for exits. Lee Sun-kyun matches her with an understated precision that makes Dong-hoon's goodness feel hard-won rather than saintly.

The supporting cast — particularly Oh Dal-su as the eldest brother and the ensemble of bar regulars — gives the show a texture of community that most dramas only gesture toward. The neighbourhood breathes.

A word on the ending. The final scene is among the most cathartic in recent memory: Ji-an, years later, fully herself, saying the thing she could not say before. It earns every second of the sixteen episodes that precede it. I watched it three times and cried differently each time.

My Mister is not escapism. It does not offer the satisfactions of romance or thriller. What it offers is something quieter and more durable: the sense that being witnessed — truly seen by another person — might be enough to survive on. I do not know of another drama that understands this as well, or renders it as honestly.`,
        content_html: `<h2>A Drama About Surviving, and Being Seen</h2>
<p>There is a scene about two-thirds through <em>My Mister</em> where Park Dong-hoon sits alone in a quiet bar, soju in hand, and the camera simply watches him breathe. No dialogue. No score swell. Just a middle-aged man, somewhere between exhaustion and something almost like peace, existing in a world that has asked too much of him for too long. It is one of the most quietly devastating moments I have ever seen in a drama — and it is not the only one.</p>
<p><em>My Mister</em> is about three brothers and a young woman who are all, in different ways, <strong>losing</strong>. The brothers — Sang-hoon, Sang-hun, and Dong-hoon — are caught in the specific misery of adulthood: failed ambitions, suffocated marriages, debts that feel like a moral failing. Lee Ji-an is twenty-something, carrying a grandmother on her back and a loan shark at her door, listening in on Dong-hoon's phone calls not to destroy him but because his ordinary life — his simple decency — is the closest thing to warmth she has ever felt.</p>
<h2>A Relationship Without a Name</h2>
<p>The drama's genius is structural. Writer Park Hae-young refuses to let the central relationship tip into romance. What Dong-hoon and Ji-an share is something rarer onscreen: <strong>recognition</strong>. Two people who see each other without flattery or agenda. She overhears his humiliations; he notices her survival. The tenderness that builds between them is unconditional in a way romantic love rarely is.</p>
<blockquote><p>"There's a person who makes me want to be a good person." — Park Dong-hoon</p></blockquote>
<p>IU's performance here is unlike anything else in her filmography. Ji-an is guarded to the point of blankness in public, and IU communicates entire internal landscapes through near-stillness — the set of her jaw, the way her eyes track a room for exits. Lee Sun-kyun matches her with an understated precision that makes Dong-hoon's goodness feel hard-won rather than saintly.</p>
<p>The supporting cast — particularly Oh Dal-su as the eldest brother and the ensemble of bar regulars — gives the show a texture of community that most dramas only gesture toward. The neighbourhood breathes.</p>
<h2>On the Ending (Spoilers)</h2>
<p>The final scene is among the most cathartic in recent memory: Ji-an, years later, fully herself, saying the thing she could not say before. It earns every second of the sixteen episodes that precede it. I watched it three times and cried differently each time.</p>
<hr>
<p><em>My Mister</em> is not escapism. It does not offer the satisfactions of romance or thriller. What it offers is something quieter and more durable: the sense that being witnessed — truly seen by another person — might be enough to survive on. I do not know of another drama that understands this as well, or renders it as honestly.</p>`,
    },
];

// ── Actor helpers ─────────────────────────────────────────────────────────────

export function actorPhotoUrl(actorId: string): string | null {
    return MOCK_ACTORS.find((a) => a.id === actorId)?.profile_image_url ?? null;
}
