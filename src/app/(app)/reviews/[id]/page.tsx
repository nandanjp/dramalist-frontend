"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useReview, useUpdateReview } from "@/hooks/use-reviews";
import type { Review } from "@/lib/types";
import { toast } from "sonner";
import { ReviewEditor } from "@/components/reviews/review-editor";
import { RatingInput } from "@/components/reviews/rating-stars";
import { QueryState } from "@/components/shared/query-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

function EditReviewForm({ review }: { review: Review }) {
    const router = useRouter();
    const updateMutation = useUpdateReview(review.id);

    const [form, setForm] = React.useState({
        rating: review.rating,
        content: review.content ?? "",
        isPublic: review.is_public,
        containsSpoilers: review.contains_spoilers,
    });

    async function handleSave() {
        try {
            await updateMutation.mutateAsync({
                rating: form.rating,
                content: form.content || undefined,
                is_public: form.isPublic,
                contains_spoilers: form.containsSpoilers,
            });
            toast.success("Review updated");
            router.push("/reviews");
        } catch {
            toast.error("Failed to update review");
        }
    }

    return (
        <div className="space-y-6">
            {/* Rating */}
            <div className="space-y-2">
                <Label>Rating</Label>
                <RatingInput
                    value={form.rating}
                    onChange={(v) => setForm((prev) => ({ ...prev, rating: v }))}
                />
            </div>

            {/* Editor */}
            <div className="space-y-2">
                <Label>Review</Label>
                <ReviewEditor
                    key={review.id}
                    content={form.content}
                    onChange={(v) => setForm((prev) => ({ ...prev, content: v }))}
                    placeholder="What did you think?"
                />
            </div>

            {/* Toggles */}
            <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label>Public</Label>
                        <p className="text-xs text-muted-foreground">Visible to other users</p>
                    </div>
                    <Switch
                        checked={form.isPublic}
                        onCheckedChange={(v) => setForm((prev) => ({ ...prev, isPublic: v }))}
                    />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <Label>Contains spoilers</Label>
                        <p className="text-xs text-muted-foreground">
                            Warns readers before revealing plot details
                        </p>
                    </div>
                    <Switch
                        checked={form.containsSpoilers}
                        onCheckedChange={(v) =>
                            setForm((prev) => ({ ...prev, containsSpoilers: v }))
                        }
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={updateMutation.isPending}>
                    {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save changes
                </Button>
            </div>
        </div>
    );
}

export default function EditReviewPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { data: review, isLoading, isError } = useReview(id);

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <h1 className="text-xl font-semibold">Edit review</h1>
            </div>
            <Separator />
            <QueryState isLoading={isLoading} isError={isError} isEmpty={!review && !isLoading}>
                {review && <EditReviewForm review={review} />}
            </QueryState>
        </div>
    );
}
