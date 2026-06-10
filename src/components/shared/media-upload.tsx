"use client";

import * as React from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import {
    useMediaUpload,
    type MediaEntityType,
    type MediaMediaType,
} from "@/hooks/use-media-upload";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MediaUploadProps {
    entityType: MediaEntityType;
    entityId: string;
    mediaType: MediaMediaType;
    currentUrl?: string;
    onSuccess: (url: string) => void;
    accept?: string;
    className?: string;
    previewClassName?: string;
    label?: string;
}

export function MediaUpload({
    entityType,
    entityId,
    mediaType,
    currentUrl,
    onSuccess,
    accept = "image/jpeg,image/png,image/webp,image/gif",
    className,
    previewClassName,
    label = "Upload image",
}: MediaUploadProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [preview, setPreview] = React.useState<string | null>(currentUrl ?? null);
    const [isDragging, setIsDragging] = React.useState(false);

    const { upload, isUploading, progress, error, reset } = useMediaUpload({
        entityType,
        entityId,
        mediaType,
        onSuccess: (url) => {
            setPreview(url);
            onSuccess(url);
        },
    });

    function handleFile(file: File) {
        const localPreview = URL.createObjectURL(file);
        setPreview(localPreview);
        upload(file);
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = "";
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }

    function handleClear() {
        reset();
        setPreview(null);
        onSuccess("");
    }

    return (
        <div className={cn("space-y-2", className)}>
            <div
                className={cn(
                    "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
                    isDragging
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/25 hover:border-muted-foreground/50",
                    previewClassName ?? "h-40",
                )}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !isUploading && inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
            >
                {preview ? (
                    <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={preview}
                            alt="Preview"
                            className="h-full w-full rounded-[calc(theme(borderRadius.lg)-2px)] object-cover"
                        />
                        {isUploading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[calc(theme(borderRadius.lg)-2px)] bg-black/50">
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                                <span className="mt-1 text-xs text-white">{progress}%</span>
                            </div>
                        )}
                        {!isUploading && (
                            <Button
                                type="button"
                                size="icon"
                                variant="destructive"
                                className="absolute top-1.5 right-1.5 h-6 w-6"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleClear();
                                }}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </>
                ) : (
                    <div className="text-muted-foreground flex flex-col items-center gap-1 p-4 text-center">
                        {isUploading ? (
                            <>
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span className="text-xs">{progress}%</span>
                            </>
                        ) : (
                            <>
                                <ImageIcon className="h-8 w-8 opacity-40" />
                                <span className="text-xs">{label}</span>
                                <span className="text-xs opacity-60">or drag &amp; drop</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                className="sr-only"
                onChange={handleInputChange}
            />

            {!preview && !isUploading && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => inputRef.current?.click()}
                >
                    <Upload className="mr-2 h-3.5 w-3.5" />
                    {label}
                </Button>
            )}

            {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
    );
}
