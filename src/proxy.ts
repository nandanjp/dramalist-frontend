import { type NextRequest, NextResponse } from "next/server";

function isPublic(pathname: string): boolean {
    // Next.js internals + static assets
    if (pathname.startsWith("/_next/") || pathname.startsWith("/favicon")) return true;

    // Auth flows
    if (pathname === "/login" || pathname === "/signup") return true;
    if (pathname.startsWith("/auth/")) return true;

    // Public content pages — catalog and community are accessible without an account
    if (pathname === "/" || pathname === "/catalog" || pathname.startsWith("/catalog/"))
        return true;
    if (pathname === "/community" || pathname.startsWith("/community/")) return true;
    if (pathname === "/actors" || pathname.startsWith("/actors/")) return true;
    if (pathname.startsWith("/reviews/")) return true; // public review detail pages (/reviews/[id])

    // API routes have their own auth (or are mock handlers in dev) — never redirect these
    if (pathname.startsWith("/api/")) return true;

    return false;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isPublic(pathname)) return NextResponse.next();

    // Use the refresh-token cookie as a proxy for "has a session".
    // AuthProvider does a real refresh on mount; proxy just gates routing.
    const hasSession = request.cookies.has("drl_refresh");
    if (!hasSession) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        // Preserve the intended destination so the login page can redirect back.
        loginUrl.searchParams.set("next", pathname + (request.nextUrl.search ?? ""));
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
