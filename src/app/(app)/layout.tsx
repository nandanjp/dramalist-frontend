import { cookies } from "next/headers";
import { AppSidebar } from "@/components/app-sidebar";
import { NavBreadcrumb } from "@/components/nav-breadcrumb";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const sidebarOpen = cookieStore.get("sidebar_state")?.value !== "false";

    return (
        <SidebarProvider defaultOpen={sidebarOpen}>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <NavBreadcrumb />
                    <div className="ml-auto">
                        <ThemeToggle />
                    </div>
                </header>
                <main className="flex flex-1 flex-col p-4 md:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
