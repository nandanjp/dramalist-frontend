import * as React from "react";

export type MediaEntityType = "catalog" | "actor" | "user";
export type MediaMediaType = "poster" | "banner" | "thumbnail" | "avatar" | "profile";

export interface UseMediaUploadOptions {
    entityType: MediaEntityType;
    entityId: string;
    mediaType: MediaMediaType;
    onSuccess?: (url: string) => void;
    onError?: (error: string) => void;
}

export interface UseMediaUploadResult {
    upload: (file: File) => void;
    isUploading: boolean;
    progress: number;
    error: string | null;
    reset: () => void;
}

export function useMediaUpload({
    entityType,
    entityId,
    mediaType,
    onSuccess,
    onError,
}: UseMediaUploadOptions): UseMediaUploadResult {
    const [isUploading, setIsUploading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [error, setError] = React.useState<string | null>(null);
    const xhrRef = React.useRef<XMLHttpRequest | null>(null);

    function reset() {
        xhrRef.current?.abort();
        setIsUploading(false);
        setProgress(0);
        setError(null);
    }

    function upload(file: File) {
        setIsUploading(true);
        setProgress(0);
        setError(null);

        const formData = new FormData();
        formData.append("entity_type", entityType);
        formData.append("entity_id", entityId);
        formData.append("media_type", mediaType);
        formData.append("file", file);

        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;

        xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
                setProgress(Math.round((e.loaded / e.total) * 100));
            }
        });

        xhr.addEventListener("load", () => {
            setIsUploading(false);
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    onSuccess?.(data.url ?? data.media_url ?? "");
                } catch {
                    onSuccess?.("");
                }
            } else {
                const msg = `Upload failed (${xhr.status})`;
                setError(msg);
                onError?.(msg);
            }
        });

        xhr.addEventListener("error", () => {
            setIsUploading(false);
            const msg = "Upload failed — network error";
            setError(msg);
            onError?.(msg);
        });

        xhr.addEventListener("abort", () => {
            setIsUploading(false);
        });

        const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
        xhr.open("POST", `${BASE}/api/media/upload`);
        xhr.send(formData);
    }

    return { upload, isUploading, progress, error, reset };
}
