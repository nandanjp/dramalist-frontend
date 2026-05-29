"use client";

import { useCreateShow, useUpdateShow } from "@/hooks/use-shows";
import type { Show } from "@/lib/types";
import { toast } from "sonner";
import { FormDialog } from "@/components/shared/form-dialog";
import { ShowForm, formValuesToRequest, type ShowFormValues } from "./show-form";

interface ShowFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** When provided, the dialog operates in edit mode. */
    show?: Show;
    onSuccess?: (show: Show) => void;
}

export function ShowFormDialog({ open, onOpenChange, show, onSuccess }: ShowFormDialogProps) {
    const createMutation = useCreateShow();
    const updateMutation = useUpdateShow(show?.id ?? "");

    const isEdit = !!show;
    const isPending = createMutation.isPending || updateMutation.isPending;

    async function handleSubmit(values: ShowFormValues) {
        const body = formValuesToRequest(values);
        try {
            if (isEdit) {
                const updated = await updateMutation.mutateAsync(body);
                toast.success("Show updated");
                onSuccess?.(updated);
            } else {
                const created = await createMutation.mutateAsync(body);
                toast.success("Show added to your list");
                onSuccess?.(created);
            }
            onOpenChange(false);
        } catch {
            toast.error(isEdit ? "Failed to update show" : "Failed to add show");
        }
    }

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Edit show" : "Add to list"}
            description={isEdit ? "Update your show details." : "Add a new show to your list."}
            maxWidth="sm:max-w-2xl"
        >
            <ShowForm
                defaultValues={show}
                isPending={isPending}
                onSubmit={handleSubmit}
                onCancel={() => onOpenChange(false)}
                submitLabel={isEdit ? "Update" : "Add show"}
            />
        </FormDialog>
    );
}
