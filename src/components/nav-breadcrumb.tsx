"use client";

import { usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const LABELS: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/catalog": "Catalogue",
    "/list": "My List",
    "/search": "Search",
    "/reviews": "My Reviews",
    "/reviews/new": "New Review",
    "/ai/recommendations": "Recommendations",
    "/ai/mood": "Mood Search",
    "/profile": "Profile",
    "/settings": "Settings",
    "/shows": "Show",
    "/users": "Profile",
};

function getLabel(pathname: string): string {
    if (LABELS[pathname]) return LABELS[pathname];
    for (const [prefix, label] of Object.entries(LABELS)) {
        if (pathname.startsWith(prefix + "/")) return label;
    }
    return "Dramalist";
}

export function NavBreadcrumb() {
    const pathname = usePathname();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbPage>{getLabel(pathname)}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
    );
}
