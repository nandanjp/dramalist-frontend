"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { SHOW_STATUSES, STATUS_LABELS, type Show } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const showSchema = z.object({
    title: z.string().min(1, "Title is required"),
    original_title: z.string().optional(),
    status: z.enum(["watching", "completed", "dropped", "plan_to_watch", "on_hold"]),
    genre: z.string().optional(), // comma-separated
    episode_count: z.coerce.number().int().min(0).optional().or(z.literal("")),
    episodes_watched: z.coerce.number().int().min(0).optional().or(z.literal("")),
    year: z.coerce.number().int().min(1900).max(2200).optional().or(z.literal("")),
    country: z.string().optional(),
    language: z.string().optional(),
    is_public: z.boolean(),
    notes: z.string().optional(),
});

export type ShowFormValues = z.infer<typeof showSchema>;

function toFormValues(show?: Show): ShowFormValues {
    if (!show) {
        return {
            title: "",
            original_title: "",
            status: "plan_to_watch",
            genre: "",
            episode_count: "",
            episodes_watched: "",
            year: "",
            country: "",
            language: "",
            is_public: false,
            notes: "",
        };
    }
    return {
        title: show.title,
        original_title: show.original_title ?? "",
        status: show.status,
        genre: show.genre.join(", "),
        episode_count: show.episode_count ?? "",
        episodes_watched: show.episodes_watched,
        year: show.year ?? "",
        country: show.country ?? "",
        language: show.language ?? "",
        is_public: show.is_public,
        notes: show.notes ?? "",
    };
}

export function formValuesToRequest(values: ShowFormValues) {
    return {
        title: values.title,
        original_title: values.original_title || undefined,
        status: values.status,
        genre: values.genre
            ? values.genre
                  .split(",")
                  .map((g) => g.trim())
                  .filter(Boolean)
            : [],
        episode_count: values.episode_count === "" ? undefined : Number(values.episode_count),
        episodes_watched:
            values.episodes_watched === "" ? undefined : Number(values.episodes_watched),
        year: values.year === "" ? undefined : Number(values.year),
        country: values.country || undefined,
        language: values.language || undefined,
        is_public: values.is_public,
        notes: values.notes || undefined,
    };
}

interface ShowFormProps {
    defaultValues?: Show;
    isPending?: boolean;
    onSubmit: (values: ShowFormValues) => void;
    onCancel?: () => void;
    submitLabel?: string;
}

export function ShowForm({
    defaultValues,
    isPending = false,
    onSubmit,
    onCancel,
    submitLabel = "Save",
}: ShowFormProps) {
    const form = useForm<ShowFormValues>({
        resolver: zodResolver(showSchema),
        defaultValues: toFormValues(defaultValues),
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Title + Original title */}
                <div className="grid gap-3 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title *</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Crash Landing on You" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="original_title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Original title</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 사랑의 불시착" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Status + Genre */}
                <div className="grid gap-3 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {SHOW_STATUSES.map((s) => (
                                            <SelectItem key={s} value={s}>
                                                {STATUS_LABELS[s]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="genre"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Genres</FormLabel>
                                <FormControl>
                                    <Input placeholder="Romance, Drama, Comedy" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Episodes */}
                <div className="grid gap-3 sm:grid-cols-3">
                    <FormField
                        control={form.control}
                        name="episode_count"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total episodes</FormLabel>
                                <FormControl>
                                    <Input type="number" min={0} placeholder="16" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="episodes_watched"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Watched</FormLabel>
                                <FormControl>
                                    <Input type="number" min={0} placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Year</FormLabel>
                                <FormControl>
                                    <Input type="number" min={1900} placeholder="2024" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Country + Language */}
                <div className="grid gap-3 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                    <Input placeholder="South Korea" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Language</FormLabel>
                                <FormControl>
                                    <Input placeholder="Korean" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Notes */}
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Personal notes…"
                                    className="resize-none"
                                    rows={3}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Public toggle */}
                <FormField
                    control={form.control}
                    name="is_public"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <FormLabel className="text-sm font-medium">Public</FormLabel>
                                <p className="text-xs text-muted-foreground">
                                    Visible on your public profile
                                </p>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
