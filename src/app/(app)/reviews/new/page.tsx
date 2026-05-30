"use client";

import * as React from "react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCreateReview } from "@/hooks/use-reviews";
import type { SearchResult } from "@/lib/types";
import { toast } from "sonner";
import { ReviewEditor } from "@/components/reviews/review-editor";
import { RatingInput } from "@/components/reviews/rating-stars";
import { CatalogPickerCombobox } from "@/components/shows/catalog-picker-combobox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function NewReviewPage() {
    return (
        <Suspense>
            <NewReviewForm />
        </Suspense>
    );
}

function NewReviewForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedCatalogId = searchParams.get("catalogId");
    const createMutation = useCreateReview();

    const [selectedCatalog, setSelectedCatalog] = React.useState<SearchResult | undefined>();
    const [rating, setRating] = React.useState(7);
    const [content, setContent] = React.useState("");
    const [isPublic, setIsPublic] = React.useState(true);
    const [containsSpoilers, setContainsSpoilers] = React.useState(false);

    const effectiveCatalogId = selectedCatalog?.catalog_id ?? preselectedCatalogId ?? "";

    async function handleSave() {
        if (!effectiveCatalogId) {
            toast.error("Please select a title first");
            return;
        }
        try {
            await createMutation.mutateAsync({
                catalog_id: effectiveCatalogId,
                catalog_title: selectedCatalog?.title,
                rating,
                content: content || undefined,
                is_public: isPublic,
                contains_spoilers: containsSpoilers,
                show_genres: selectedCatalog?.genre,
            });
            toast.success("Review saved");
            router.push("/reviews");
        } catch {
            toast.error("Failed to save review");
        }
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={createMutation.isPending || !effectiveCatalogId}
                >
                    {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save review
                </Button>
            </div>

            <Separator />

            {/* Catalog picker */}
            {!preselectedCatalogId && (
                <div className="space-y-2">
                    <Label>Title</Label>
                    <CatalogPickerCombobox
                        value={selectedCatalog?.catalog_id}
                        onChange={setSelectedCatalog}
                        placeholder="Search the catalog…"
                    />
                </div>
            )}

            {/* Rating */}
            <div className="space-y-2">
                <Label>Rating</Label>
                <RatingInput value={rating} onChange={setRating} />
            </div>

            {/* Editor */}
            <div className="space-y-2">
                <Label>Review</Label>
                <ReviewEditor
                    content={content}
                    onChange={setContent}
                    placeholder="What did you think? Share your thoughts…"
                />
            </div>

            {/* Toggles */}
            <div className="space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label>Public</Label>
                        <p className="text-xs text-muted-foreground">Visible to other users</p>
                    </div>
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <Label>Contains spoilers</Label>
                        <p className="text-xs text-muted-foreground">
                            Warns readers before revealing plot details
                        </p>
                    </div>
                    <Switch checked={containsSpoilers} onCheckedChange={setContainsSpoilers} />
                </div>
            </div>
        </div>
    );
}
