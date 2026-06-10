import { formatDistanceToNow } from "@/lib/date";
import type { PublicReviewPreview, Review } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RatingStars } from "./rating-stars";

// ── Public preview card (feed / landing) ─────────────────────────────────────

interface ReviewPreviewCardProps {
    review: PublicReviewPreview;
}

export function ReviewPreviewCard({ review }: ReviewPreviewCardProps) {
    return (
        <Card className="flex flex-col gap-2 p-4">
            <RatingStars rating={review.rating} />
            {review.content_snippet && (
                <p className="text-muted-foreground line-clamp-3 text-sm">
                    {review.content_snippet}
                </p>
            )}
            <p className="text-muted-foreground text-xs">
                {formatDistanceToNow(review.created_at)}
            </p>
        </Card>
    );
}

// ── Full review card (my reviews page) ───────────────────────────────────────

interface ReviewCardProps {
    review: Review;
    actions?: React.ReactNode;
}

export function ReviewCard({ review, actions }: ReviewCardProps) {
    return (
        <Card>
            <CardContent className="space-y-2 pt-4">
                <RatingStars rating={review.rating} />
                {review.content && (
                    <p className="text-muted-foreground line-clamp-4 text-sm">{review.content}</p>
                )}
                <p className="text-muted-foreground text-xs">
                    {formatDistanceToNow(review.created_at)}
                    {!review.is_public && " · Private"}
                </p>
            </CardContent>
            {actions && <CardFooter className="gap-2 pt-0">{actions}</CardFooter>}
        </Card>
    );
}
