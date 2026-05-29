import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = new Set(["/", "/login", "/auth/callback", "/auth/verify-totp", "/auth/error"]);

function isPublic(pathname: string): boolean {
    if (PUBLIC_PATHS.has(pathname)) return true;
    // Allow Next.js internals and static files
    if (pathname.startsWith("/_next/")) return true;
    if (pathname.startsWith("/favicon")) return true;
    return false;
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isPublic(pathname)) return NextResponse.next();

    // Use the refresh-token cookie as a proxy for "has a session".
    // The AuthProvider does a real refresh on mount; middleware just gates routing.
    const hasSession = request.cookies.has("drl_refresh");
    if (!hasSession) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = "/login";
        loginUrl.search = "";
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
