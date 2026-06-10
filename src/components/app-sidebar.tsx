"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BookMarked,
    LayoutDashboard,
    Library,
    LogOut,
    MessageSquare,
    Search,
    Settings,
    Sparkles,
    User,
    Wand2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_MAIN = [
    {
        label: "Discover",
        items: [
            { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { title: "Catalogue", href: "/catalog", icon: Library },
            { title: "Search", href: "/search", icon: Search },
        ],
    },
    {
        label: "My Content",
        items: [
            { title: "My List", href: "/list", icon: BookMarked },
            { title: "Reviews", href: "/reviews", icon: MessageSquare },
        ],
    },
    {
        label: "AI",
        items: [
            { title: "Recommendations", href: "/ai/recommendations", icon: Sparkles },
            { title: "Mood Search", href: "/ai/mood", icon: Wand2 },
        ],
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const initials = user?.display_name ? user.display_name.slice(0, 2).toUpperCase() : "?";

    return (
        <Sidebar collapsible="icon">
            {/* Brand */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard">
                                <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-sky-500 to-violet-600">
                                    <span className="font-hand text-sm font-bold text-white">
                                        D
                                    </span>
                                </div>
                                <span className="font-hand bg-linear-to-r from-sky-600 to-violet-600 bg-clip-text text-xl tracking-normal text-transparent dark:from-sky-400 dark:to-violet-400">
                                    Dramalist
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarSeparator />

            {/* Navigation */}
            <SidebarContent>
                {NAV_MAIN.map((group) => (
                    <SidebarGroup key={group.label}>
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => {
                                    const isActive =
                                        item.href === "/dashboard"
                                            ? pathname === "/dashboard"
                                            : pathname.startsWith(item.href);
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                                tooltip={item.title}
                                            >
                                                <Link href={item.href}>
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarSeparator />

            {/* User footer */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user?.avatar_url ?? undefined} />
                                        <AvatarFallback className="rounded-lg bg-linear-to-br from-sky-100 to-violet-100 text-xs font-semibold text-violet-700 dark:from-sky-950/60 dark:to-violet-950/60 dark:text-violet-300">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">
                                            {user?.display_name ?? "Account"}
                                        </span>
                                        <span className="text-muted-foreground truncate text-xs">
                                            {user?.email ?? ""}
                                        </span>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" align="start" className="w-56">
                                <DropdownMenuItem asChild>
                                    <Link href="/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => logout()}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
