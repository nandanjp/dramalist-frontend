import { AppSidebar } from "@/components/app-sidebar";
import { AuthGate } from "@/components/auth/auth-gate";
import { NavBreadcrumb } from "@/components/nav-breadcrumb";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// No cookies() call — keeps this layout static so Next.js does not re-render it
// on every client navigation. SidebarProvider self-persists its open state via
// document.cookie on the client, so the sidebar state is still remembered across
// page loads (with a possible flash on hard refresh if the sidebar was closed).
export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider defaultOpen={true}>
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
                <main className="flex flex-1 flex-col p-4 md:p-6">
                    <AuthGate>{children}</AuthGate>
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}
