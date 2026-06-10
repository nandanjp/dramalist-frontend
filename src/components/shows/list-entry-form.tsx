"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { SHOW_STATUSES, STATUS_LABELS, type UserListEntry } from "@/lib/types";
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

const schema = z.object({
    status: z.enum(["watching", "completed", "dropped", "plan_to_watch", "on_hold"]),
    episodes_watched: z
        .string()
        .optional()
        .refine(
            (v) => v === undefined || v === "" || (Number.isInteger(Number(v)) && Number(v) >= 0),
            { message: "Must be a non-negative whole number" },
        ),
    notes: z.string().optional(),
    tags: z.string().optional(),
    is_public: z.boolean(),
});

export type ListEntryFormValues = z.infer<typeof schema>;

function toFormValues(entry?: UserListEntry): ListEntryFormValues {
    if (!entry) {
        return {
            status: "plan_to_watch",
            episodes_watched: "",
            notes: "",
            tags: "",
            is_public: false,
        };
    }
    return {
        status: entry.status,
        episodes_watched: entry.episodes_watched != null ? String(entry.episodes_watched) : "",
        notes: entry.notes ?? "",
        tags: entry.tags.join(", "),
        is_public: entry.is_public,
    };
}

export function formValuesToRequest(values: ListEntryFormValues) {
    return {
        status: values.status,
        episodes_watched:
            values.episodes_watched === "" ? undefined : Number(values.episodes_watched),
        notes: values.notes || undefined,
        tags: values.tags
            ? values.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
            : [],
        is_public: values.is_public,
    };
}

interface ListEntryFormProps {
    defaultValues?: UserListEntry;
    isPending?: boolean;
    onSubmit: (values: ListEntryFormValues) => void;
    onCancel?: () => void;
    submitLabel?: string;
}

export function ListEntryForm({
    defaultValues,
    isPending = false,
    onSubmit,
    onCancel,
    submitLabel = "Save",
}: ListEntryFormProps) {
    const form = useForm<ListEntryFormValues>({
        resolver: zodResolver(schema),
        defaultValues: toFormValues(defaultValues),
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        name="episodes_watched"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Episodes watched</FormLabel>
                                <FormControl>
                                    <Input type="number" min={0} placeholder="0" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. favourite, rewatch" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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

                <FormField
                    control={form.control}
                    name="is_public"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3">
                            <div>
                                <FormLabel className="text-sm font-medium">Public</FormLabel>
                                <p className="text-muted-foreground text-xs">
                                    Visible on your public profile
                                </p>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />

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
