import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CalendarDays, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { blogPosts } from "@/lib/blog-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://enkutatashevents.com"

export const metadata: Metadata = {
  title: "Event Planning Blog | Enkutatash Events",
  description:
    "Expert tips and guides for event planning in Ethiopia. Wedding planning, corporate events, decoration trends, and more from Enkutatash Events.",
  keywords: [
    "event planning blog Ethiopia",
    "wedding tips Addis Ababa",
    "Ethiopian wedding guide",
    "corporate event planning tips",
    "Ethiopian event decoration ideas",
  ],
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: "Event Planning Blog | Enkutatash Events",
    description: "Expert tips for event planning in Ethiopia. Wedding guides, decoration trends, and more.",
    type: "website",
    url: `${SITE_URL}/blog`,
  },
}

export default function BlogPage() {
  const categories = [...new Set(blogPosts.map((p) => p.category))]

  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            Blog
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Event Planning{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Tips and Guides
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Expert advice for planning unforgettable events in Ethiopia. From wedding checklists to corporate event management, we cover everything you need to know.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="text-sm font-medium text-muted-foreground mr-1">Categories:</span>
            {categories.map((cat) => (
              <Badge key={cat} variant="secondary" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
                {cat}
              </Badge>
            ))}
          </div>

          <div className="grid gap-8">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-6 rounded-xl border border-border/50 hover:border-emerald-500/30 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </span>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5">
                        {post.category}
                      </Badge>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold group-hover:text-emerald-600 transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 shrink-0 self-start mt-1 transition-colors hidden sm:block" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
