import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Phone, Mail, CheckCircle2, Home, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { services, getServiceBySlug } from "@/lib/services-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://enkutatashevents.com"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    keywords: service.metaKeywords,
    alternates: { canonical: `/${service.slug}` },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      type: "website",
      url: `${SITE_URL}/${service.slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle,
      description: service.metaDescription,
    },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const otherServices = services.filter((s) => s.id !== service.id)

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What ${service.title.toLowerCase()} services do you offer in Addis Ababa?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Enkutatash Events provides professional ${service.title.toLowerCase()} services in Addis Ababa and across Ethiopia. ${service.longDescription.substring(0, 200)}`,
        },
      },
      {
        "@type": "Question",
        name: `How much does ${service.title.toLowerCase()} cost in Addis Ababa?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The cost of ${service.title.toLowerCase()} depends on the size, complexity, and specific requirements of your event. We offer customized packages and free consultations to provide accurate quotes. Contact us for a free estimate tailored to your needs.`,
        },
      },
      {
        "@type": "Question",
        name: `Do you provide ${service.title.toLowerCase()} for events outside Addis Ababa?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, we provide ${service.title.toLowerCase()} services across all major Ethiopian cities including Adama, Hawassa, Bahir Dar, Dire Dawa, and more. Contact us to discuss your location and we will arrange our team.`,
        },
      },
      {
        "@type": "Question",
        name: `How do I book ${service.title.toLowerCase()} for my event?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `You can book our ${service.title.toLowerCase()} services by calling +251 910 977 371, emailing enkutatashevents@gmail.com, or using the contact form on our website. We will schedule a free consultation to discuss your requirements.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-muted-foreground">
          <li>
            <Link href="/" className="hover:text-emerald-600 flex items-center gap-1">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/services" className="hover:text-emerald-600">Services</Link>
          </li>
          <li>/</li>
          <li className="text-foreground font-medium" aria-current="page">{service.title}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className={`absolute top-20 left-1/4 h-72 w-72 rounded-full opacity-10 blur-3xl bg-gradient-to-br ${service.gradient}`} />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br ${service.gradient} items-center justify-center text-3xl shadow-lg mb-6`}>
            {service.icon}
          </div>
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            {service.titleAmharic}
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-5xl font-bold tracking-tight mb-4">
            {service.title} in{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Addis Ababa
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl">
            {service.description}
          </p>
        </div>
      </section>

      {/* Highlights */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">What We Offer</h2>
              <ul className="space-y-3">
                {service.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3">
                    <CheckCircle2 className={`h-5 w-5 mt-0.5 shrink-0 bg-gradient-to-br ${service.gradient} text-white rounded-full p-0.5`} />
                    <span className="text-muted-foreground">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-muted/30 rounded-xl p-6 sm:p-8 border border-border/50">
              <h2 className="text-2xl font-bold mb-4">Why Choose Enkutatash Events?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {service.longDescription}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Experienced team in Addis Ababa</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>High-quality equipment and materials</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Reliable and on-time service delivery</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>Competitive pricing in Ethiopia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Services */}
      <section className="py-16 sm:py-20 bg-muted/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-4">
            Explore More Services
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            We offer 8 comprehensive event services in Addis Ababa and across Ethiopia. Browse all our offerings below.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherServices.slice(0, 6).map((s) => (
              <Link
                key={s.id}
                href={`/${s.slug}`}
                className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-emerald-500/30 hover:shadow-md transition-all bg-background"
              >
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-xl shrink-0`}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm group-hover:text-emerald-600 transition-colors truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground truncate">Addis Ababa, Ethiopia</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Ready to book your {service.title.toLowerCase()} service?
          </h2>
          <p className="text-muted-foreground mb-8">
            Get in touch today for a free consultation and quote. We will work with you to create
            an unforgettable experience tailored to your vision and budget.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/#contact">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
                Book Your Event <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
            <a href="tel:+251910977371">
              <Button size="lg" variant="outline">
                <Phone className="mr-2 h-5 w-5" /> Call +251 910 977 371
              </Button>
            </a>
            <a href="mailto:enkutatashevents@gmail.com">
              <Button size="lg" variant="outline">
                <Mail className="mr-2 h-5 w-5" /> Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-muted/30 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Common questions about our {service.title.toLowerCase()} services in Addis Ababa and across Ethiopia.
          </p>
          <div className="space-y-4">
            {[
              {
                q: `What ${service.title.toLowerCase()} services do you offer in Addis Ababa?`,
                a: `Enkutatash Events provides professional ${service.title.toLowerCase()} services in Addis Ababa and across Ethiopia. ${service.longDescription.substring(0, 250)}`,
              },
              {
                q: `How much does ${service.title.toLowerCase()} cost in Addis Ababa?`,
                a: `The cost depends on the size, complexity, and specific requirements of your event. We offer customized packages and free consultations to provide accurate quotes. Contact us for a free estimate.`,
              },
              {
                q: `Do you provide ${service.title.toLowerCase()} outside Addis Ababa?`,
                a: `Yes, we serve all major Ethiopian cities including Adama, Hawassa, Bahir Dar, Dire Dawa, Mekelle, Gondar, and more. Contact us to discuss your location.`,
              },
              {
                q: `How do I book ${service.title.toLowerCase()} for my event?`,
                a: `Call +251 910 977 371, email enkutatashevents@gmail.com, or use our website contact form. We will schedule a free consultation to discuss your requirements.`,
              },
            ].map((faq, i) => (
              <details key={i} className="group rounded-xl border border-border/50 bg-background">
                <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer font-medium text-sm sm:text-base list-none [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90 ml-2" />
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-muted-foreground border-t border-border/50 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/services" className="text-sm text-emerald-600 hover:underline">
          &larr; Back to All Services
        </Link>
      </div>
    </div>
    </>
  )
}
