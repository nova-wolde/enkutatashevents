import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Phone, Mail, CheckCircle2, MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { services } from "@/lib/services-data"
import { ethiopianCities, getCityBySlug, SITE_URL } from "@/lib/seo-data"

interface Props {
  params: Promise<{ city: string }>
}

export async function generateStaticParams() {
  return ethiopianCities.map((c) => ({ city: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) return {}

  const title = `Event Organizer in ${city.name}, ${city.region} | Enkutatash Events`
  const description = `Top-rated event organizer in ${city.name}, ${city.region}, Ethiopia. Wedding planning, decoration, stage & tent rental, sound & lighting, and catering services in ${city.name}. Free quotes.`

  return {
    title,
    description,
    keywords: [
      `event organizer in ${city.name}`,
      `${city.name} event planner`,
      `wedding planner ${city.name}`,
      `event decoration ${city.name}`,
      `${city.name} party organizer`,
      `stage rental ${city.name}`,
      `catering ${city.name}`,
      `events in ${city.name}`,
    ],
    alternates: { canonical: `${SITE_URL}/locations/${city.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/locations/${city.slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const cityServices = services.map((s) => ({
    ...s,
    cityTitle: `${s.title} in ${city.name}`,
  }))

  return (
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
          <li className="text-foreground font-medium" aria-current="page">{city.name}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            <MapPin className="h-3 w-3 mr-1" /> {city.region}, Ethiopia
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-5xl font-bold tracking-tight mb-4">
            Event Organizer in{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {city.name}
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Enkutatash Events provides premium event planning, decoration, stage and tent rental,
            sound and lighting, and catering services in {city.name}, {city.region}. We serve
            {city.name} and surrounding areas with professional event solutions for weddings,
            corporate events, concerts, and private celebrations.
          </p>
        </div>
      </section>

      {/* Services in this city */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-4">
            Our Services in {city.name}
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            We offer all 8 of our premium event services in {city.name}, {city.region}.
            Each service is delivered with the same quality and professionalism that defines Enkutatash Events.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cityServices.map((s) => (
              <Link
                key={s.id}
                href={`/${s.slug}`}
                className="group flex flex-col p-5 rounded-xl border border-border/50 hover:border-emerald-500/30 hover:shadow-md transition-all bg-background"
              >
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-xl mb-3 shrink-0`}>
                  {s.icon}
                </div>
                <h3 className="font-semibold text-sm group-hover:text-emerald-600 transition-colors mb-1">
                  {s.title} in {city.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                  {s.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="py-16 sm:py-20 bg-muted/30 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
                Why Enkutatash Events in {city.name}?
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-medium">Experienced Local Team</p>
                    <p className="text-sm text-muted-foreground">Our team knows {city.name} and the {city.region} region, including the best venues and local vendors.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-medium">Full-Service Solutions</p>
                    <p className="text-sm text-muted-foreground">From planning to decoration, equipment rental to catering — we handle everything for your event in {city.name}.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-medium">Proven Track Record</p>
                    <p className="text-sm text-muted-foreground">500+ events organized across Ethiopia with a 4.9-star average rating from clients.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-medium">Competitive Pricing</p>
                    <p className="text-sm text-muted-foreground">Quality event services at affordable rates. Free consultation and quote available.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-background rounded-xl p-8 border border-border/50">
              <h3 className="text-xl font-bold mb-4">Events We Cover in {city.name}</h3>
              <div className="grid grid-cols-2 gap-3">
                {["Weddings", "Corporate Events", "Conferences", "Birthday Parties", "Concerts", "Engagement Parties", "Graduations", "Baby Showers"].map(
                  (eventType) => (
                    <div key={eventType} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span>{eventType}</span>
                    </div>
                  )
                )}
              </div>
              <p className="mt-6 text-muted-foreground text-sm">
                Population: {city.population} &bull; Region: {city.region}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Other cities */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-4">
            We Also Serve These Cities
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            Enkutatash Events provides event services across all major Ethiopian cities and regions.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {ethiopianCities
              .filter((c) => c.slug !== city.slug)
              .slice(0, 18)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/locations/${c.slug}`}
                  className="flex items-center gap-2 p-3 rounded-lg border border-border/50 hover:border-emerald-500/30 hover:bg-muted/30 transition-all text-sm"
                >
                  <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{c.name}</span>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-muted/30 border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Plan Your Event in {city.name}
          </h2>
          <p className="text-muted-foreground mb-8">
            Get in touch for a free consultation and quote. We would love to help make your event in {city.name} extraordinary.
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
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-sm text-emerald-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}
