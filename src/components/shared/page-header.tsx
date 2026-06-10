interface PageHeaderProps {
    title: string;
    description?: string;
    /** Rendered in the top-right corner — action buttons, etc. */
    actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                {description && <p className="text-muted-foreground text-sm">{description}</p>}
            </div>
            {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
    );
}
