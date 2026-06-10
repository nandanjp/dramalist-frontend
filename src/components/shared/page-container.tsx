import * as React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** "default" = max-w-5xl (content pages), "wide" = max-w-7xl (browse/catalog) */
    size?: "default" | "wide" | "narrow";
}

export function PageContainer({
    size = "default",
    className,
    children,
    ...props
}: PageContainerProps) {
    return (
        <div
            className={cn(
                "mx-auto px-4 md:px-6 w-full",
                size === "narrow" && "max-w-xl md:max-w-2xl lg:max-w-3xl",
                size === "default" && "sm:max-w-3xl md:max-w-5xl lg:max-w-7xl",
                size === "wide" && "md:max-w-5xl lg:max-w-7xl",
                className,
            )}
            {...props}
        >
            {children}
        </div>
    );
}
