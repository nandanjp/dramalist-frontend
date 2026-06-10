"use client";

import { useState } from "react";
import { useAddToList, useUpdateListEntry } from "@/hooks/use-list";
import type { SearchResult, UserListEntry } from "@/lib/types";
import { toast } from "sonner";
import { FormDialog } from "@/components/shared/form-dialog";
import { CatalogPickerCombobox } from "./catalog-picker-combobox";
import { ListEntryForm, formValuesToRequest, type ListEntryFormValues } from "./list-entry-form";
import { Label } from "@/components/ui/label";

interface ListEntryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    entry?: UserListEntry;
    preselectedCatalogId?: string;
    onSuccess?: (entry: UserListEntry) => void;
}

export function ListEntryDialog({
    open,
    onOpenChange,
    entry,
    preselectedCatalogId,
    onSuccess,
}: ListEntryDialogProps) {
    const addMutation = useAddToList();
    const updateMutation = useUpdateListEntry(entry?.id ?? "");
    const [selectedCatalog, setSelectedCatalog] = useState<SearchResult | undefined>();

    const isEdit = !!entry;
    const isPending = addMutation.isPending || updateMutation.isPending;

    const effectiveCatalogId =
        entry?.catalog_id ?? selectedCatalog?.catalog_id ?? preselectedCatalogId;

    async function handleSubmit(values: ListEntryFormValues) {
        const body = formValuesToRequest(values);
        try {
            if (isEdit) {
                const updated = await updateMutation.mutateAsync(body);
                toast.success("List entry updated");
                onSuccess?.(updated);
            } else {
                if (!effectiveCatalogId) {
                    toast.error("Please select a title first");
                    return;
                }
                const created = await addMutation.mutateAsync({
                    catalog_id: effectiveCatalogId,
                    ...body,
                });
                toast.success("Added to your list");
                onSuccess?.(created);
            }
            onOpenChange(false);
        } catch {
            toast.error(isEdit ? "Failed to update entry" : "Failed to add to list");
        }
    }

    return (
        <FormDialog
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Edit list entry" : "Add to list"}
            description={
                isEdit
                    ? `Update your tracking for "${entry.title}".`
                    : "Find a title and set your tracking details."
            }
            maxWidth="sm:max-w-lg"
        >
            {!isEdit && !preselectedCatalogId && (
                <div className="space-y-2 pb-2">
                    <Label>Title</Label>
                    <CatalogPickerCombobox
                        value={selectedCatalog?.catalog_id}
                        onChange={setSelectedCatalog}
                    />
                </div>
            )}
            {isEdit && <p className="pb-2 text-sm font-medium">{entry.title}</p>}
            <ListEntryForm
                defaultValues={entry}
                isPending={isPending}
                onSubmit={handleSubmit}
                onCancel={() => onOpenChange(false)}
                submitLabel={isEdit ? "Update" : "Add to list"}
            />
        </FormDialog>
    );
}
