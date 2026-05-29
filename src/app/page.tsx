import Link from "next/link";
import { BookOpen, Brain, List, Sparkles, Star } from "lucide-react";
import { MOCK_REVIEWS, MOCK_SHOWS } from "@/lib/mock-data";
import { ShowCard } from "@/components/shows/show-card";
import { ReviewPreviewCard } from "@/components/reviews/review-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
    {
        icon: List,
        title: "Track everything",
        description:
            "Keep a detailed log of every drama you watch, with episode progress, status, and personal notes.",
    },
    {
        icon: Star,
        title: "Write rich reviews",
        description:
            "Craft long-form reviews with full markdown support — headings, lists, spoiler warnings, and more.",
    },
    {
        icon: Brain,
        title: "AI-powered discovery",
        description:
            "Get personalized recommendations and mood-based search powered by AI trained on your taste.",
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">Dramalist</span>
                    </div>
                    <Button asChild>
                        <Link href="/login">Sign in</Link>
                    </Button>
                </div>
            </header>

            {/* Hero */}
            <section className="mx-auto max-w-6xl px-4 py-24 text-center">
                <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
                    Your drama watchlist,
                    <br />
                    <span className="text-primary">elevated.</span>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                    Track, review, and discover Asian dramas with AI-powered recommendations and a
                    powerful markdown review editor.
                </p>
                <div className="mt-10 flex items-center justify-center gap-4">
                    <Button size="lg" asChild>
                        <Link href="/login">Get started free</Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                        <Link href="#trending">Browse trending</Link>
                    </Button>
                </div>
            </section>

            {/* Features */}
            <section className="border-y bg-muted/30">
                <div className="mx-auto max-w-6xl px-4 py-20">
                    <h2 className="mb-12 text-center text-3xl font-bold">
                        Everything you need to track your dramas
                    </h2>
                    <div className="grid gap-6 md:grid-cols-3">
                        {FEATURES.map((f) => (
                            <Card key={f.title} className="border-0 shadow-none">
                                <CardHeader className="pb-2">
                                    <f.icon
                                        className="mb-2 h-8 w-8 text-primary"
                                        strokeWidth={1.5}
                                    />
                                    <CardTitle className="text-xl">{f.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{f.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending shows */}
            <section id="trending" className="mx-auto max-w-6xl px-4 py-20">
                <div className="mb-8 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold">Trending now</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {MOCK_SHOWS.map((show) => (
                        <ShowCard key={show.id} show={show} variant="public" />
                    ))}
                </div>
            </section>

            {/* Recent reviews */}
            <section className="border-t bg-muted/30">
                <div className="mx-auto max-w-6xl px-4 py-20">
                    <div className="mb-8 flex items-center gap-2">
                        <Star className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-bold">Community reviews</h2>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {MOCK_REVIEWS.map((r) => (
                            <ReviewPreviewCard key={r.id} review={r} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA footer */}
            <section className="border-t">
                <div className="mx-auto max-w-6xl px-4 py-20 text-center">
                    <h2 className="text-3xl font-bold">Ready to start tracking?</h2>
                    <p className="mt-3 text-muted-foreground">
                        Join and build your perfect drama list.
                    </p>
                    <Button size="lg" className="mt-8" asChild>
                        <Link href="/login">Create your list</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
