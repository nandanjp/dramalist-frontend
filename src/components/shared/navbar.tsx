"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const NAV_LINKS = [
    { label: "Catalog", href: "/catalog" },
    { label: "Actors", href: "/actors" },
    { label: "Community", href: "/community" },
    { label: "My List", href: "/list" },
] as const;

function isActive(pathname: string, href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
}

function UserMenu() {
    const { user, logout } = useAuth();
    const router = useRouter();

    if (!user) return null;

    const initials = user.display_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    async function handleLogout() {
        await logout();
        router.push("/");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open user menu">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url ?? undefined} alt={user.display_name} />
                        <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                    <p className="text-foreground font-medium">{user.display_name}</p>
                    <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/list">My List</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive"
                >
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function MobileNav() {
    const { user, logout, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);

    async function handleLogout() {
        await logout();
        router.push("/");
        setOpen(false);
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col p-0">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                {/* Header */}
                <div className="border-b border-border/40 px-5 py-4">
                    <SheetClose asChild>
                        <Link
                            href="/"
                            className="font-hand bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-lg text-transparent dark:from-sky-400 dark:to-violet-400"
                        >
                            Dramalist
                        </Link>
                    </SheetClose>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col gap-1 p-3">
                    {NAV_LINKS.map(({ label, href }) => (
                        <SheetClose asChild key={href}>
                            <Link
                                href={href}
                                className={cn(
                                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive(pathname, href)
                                        ? "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                )}
                            >
                                {label}
                            </Link>
                        </SheetClose>
                    ))}
                </nav>

                {/* Footer — auth */}
                <div className="mt-auto border-t border-border/40 p-4">
                    {!isLoading && !user && (
                        <div className="flex flex-col gap-2">
                            <SheetClose asChild>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href="/login">Log in</Link>
                                </Button>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button className="w-full" asChild>
                                    <Link href="/signup">Sign up</Link>
                                </Button>
                            </SheetClose>
                        </div>
                    )}
                    {!isLoading && user && (
                        <div className="space-y-1">
                            <div className="mb-3 flex items-center gap-2.5">
                                <Avatar className="h-8 w-8 shrink-0">
                                    <AvatarImage src={user.avatar_url ?? undefined} alt={user.display_name} />
                                    <AvatarFallback className="text-xs font-medium">
                                        {user.display_name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-foreground">{user.display_name}</p>
                                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            {[
                                { label: "Dashboard", href: "/dashboard" },
                                { label: "Profile", href: "/profile" },
                                { label: "Settings", href: "/settings" },
                            ].map(({ label, href }) => (
                                <SheetClose asChild key={href}>
                                    <Link
                                        href={href}
                                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                    >
                                        {label}
                                    </Link>
                                </SheetClose>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                            >
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

export function Navbar() {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();

    return (
        <header className="border-border/40 bg-background/80 sticky top-0 z-40 border-b backdrop-blur-sm">
            <div className="container flex h-14 items-center justify-between md:h-16">
                {/* Left: logo + desktop nav */}
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="font-hand bg-gradient-to-r from-sky-600 to-violet-600 bg-clip-text text-lg tracking-normal text-transparent transition-opacity hover:opacity-70 dark:from-sky-400 dark:to-violet-400"
                    >
                        Dramalist
                    </Link>
                    <nav className="hidden items-center gap-5 md:flex">
                        {NAV_LINKS.map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "hover:text-foreground text-sm transition-colors",
                                    isActive(pathname, href)
                                        ? "text-foreground font-medium"
                                        : "text-muted-foreground",
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right: theme toggle + auth (desktop) + mobile menu */}
                <div className="flex items-center gap-1.5">
                    <ThemeToggle />
                    <div className="hidden items-center gap-1.5 md:flex">
                        {!isLoading && !user && (
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">Log in</Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/signup">Sign up</Link>
                                </Button>
                            </>
                        )}
                        {!isLoading && user && <UserMenu />}
                    </div>
                    <MobileNav />
                </div>
            </div>
        </header>
    );
}
