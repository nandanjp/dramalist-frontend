"use client";

import { use } from "react";
import { useCatalogEntry } from "@/hooks/use-catalog";
import { useCatalogReviews, useReviewAggregate } from "@/hooks/use-reviews";
import { useAuth } from "@/hooks/use-auth";
import { HeroSection } from "./_components/hero-section";
import { CastSection } from "./_components/cast-section";
import { ReviewsSection } from "./_components/reviews-section";

interface Props {
    params: Promise<{ id: string }>;
}

export default function CatalogDetailPage({ params }: Props) {
    const { id } = use(params);

    const { data: entry, isLoading } = useCatalogEntry(id);
    const { data: aggregate } = useReviewAggregate(id);
    const { data: reviewData } = useCatalogReviews(id, { limit: 50 });
    const { user } = useAuth();

    const reviews = reviewData?.reviews ?? [];
    const myReview = user ? reviews.find((r) => r.user_id === user.id) : undefined;

    return (
        <div className="min-h-screen">
            <HeroSection entry={entry} isLoading={isLoading} aggregate={aggregate} />

            {entry && (
                <>
                    {entry.cast.length > 0 && (
                        <>
                            <div className="container">
                                <div className="h-px bg-border/50" />
                            </div>
                            <CastSection cast={entry.cast} />
                        </>
                    )}

                    <ReviewsSection
                        catalogId={id}
                        catalogTitle={entry.title}
                        entry={entry}
                        reviews={reviews}
                        aggregate={aggregate}
                        myReview={myReview}
                        user={user}
                    />
                </>
            )}
        </div>
    );
}
