interface NotFoundStateProps {
    heading: string;
    description?: string;
}

export function NotFoundState({ heading, description }: NotFoundStateProps) {
    return (
        <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
            <p className="text-lg font-semibold">{heading}</p>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}
