import type { Metadata } from "next";
import { Nunito, Caveat, Lora } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";

const nunito = Nunito({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700", "800"],
    display: "swap",
});

const caveat = Caveat({ subsets: ["latin"], variable: "--font-hand", display: "swap" });

const lora = Lora({
    subsets: ["latin"],
    style: ["normal", "italic"],
    weight: ["400", "500", "600"],
    variable: "--font-serif",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Dramalist",
    description: "Track and discover dramas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${nunito.className} ${caveat.variable} ${lora.variable}`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <QueryProvider>
                        <AuthProvider>{children}</AuthProvider>
                    </QueryProvider>
                    <Toaster richColors closeButton />
                </ThemeProvider>
            </body>
        </html>
    );
}
