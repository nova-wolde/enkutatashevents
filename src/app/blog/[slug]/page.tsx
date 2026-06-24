import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, Clock, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { blogPosts } from "@/lib/blog-data"
import { SITE_URL } from "@/lib/seo-data"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return {}

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: [post.keyword, post.category, "event planning Ethiopia", "Enkutatash Events"],
    alternates: { canonical: `${SITE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      publishedTime: post.date,
      url: `${SITE_URL}/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) notFound()

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3)

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Organization", name: "Enkutatash Events" },
    publisher: { "@type": "Organization", name: "Enkutatash Events" },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    <div className="min-h-screen bg-background">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:underline mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            <Badge variant="outline" className="text-xs">{post.category}</Badge>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {post.readTime}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        </header>

        <div
          className="prose prose-sm sm:prose-base dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-p:leading-relaxed prose-p:text-muted-foreground
            prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {relatedPosts.length > 0 && (
        <section className="pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="p-4 rounded-xl border border-border/50 hover:border-emerald-500/30 hover:shadow-sm transition-all"
                >
                  <Badge variant="outline" className="text-[10px] mb-2">{rp.category}</Badge>
                  <h3 className="font-semibold text-sm mb-1 leading-snug">{rp.title}</h3>
                  <p className="text-xs text-muted-foreground">{rp.excerpt.substring(0, 80)}...</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
    </>
  )
}
