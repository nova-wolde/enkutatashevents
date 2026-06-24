import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, ArrowRight, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ethiopianCities } from "@/lib/seo-data"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://enkutatashevents.com"

export const metadata: Metadata = {
  title: "Event Organizer Across Ethiopian Cities | Enkutatash Events",
  description:
    "Enkutatash Events provides professional event planning, decoration, stage rental, sound & lighting, and catering services across all major Ethiopian cities including Addis Ababa, Adama, Hawassa, Bahir Dar, and more.",
  keywords: [
    "event organizer Ethiopia",
    "event planner Ethiopian cities",
    "wedding planner across Ethiopia",
    "event services in all Ethiopian regions",
    "event management nationwide Ethiopia",
  ],
  alternates: { canonical: `${SITE_URL}/locations` },
  openGraph: {
    title: "Event Organizer Across Ethiopian Cities | Enkutatash Events",
    description:
      "Professional event services across all major Ethiopian cities. Wedding planning, decoration, stage rental, sound & lighting, and catering nationwide.",
    type: "website",
    url: `${SITE_URL}/locations`,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
}

export default function LocationsPage() {
  const regions = [...new Set(ethiopianCities.map((c) => c.region))].sort()

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            <MapPin className="h-3 w-3 mr-1" /> Nationwide Coverage
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-5xl font-bold tracking-tight mb-4">
            Event Organizer Services{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Across Ethiopia
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Enkutatash Events provides premium event planning, decoration, stage and tent rental,
            sound and lighting, and catering services across all major Ethiopian cities and regions.
            No matter where your event is, we bring professional service to you.
          </p>
        </div>
      </section>

      {/* Cities by region */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {regions.map((region) => (
            <div key={region} className="mb-12 last:mb-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                {region} Region
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {ethiopianCities
                  .filter((c) => c.region === region)
                  .map((city) => (
                    <Link
                      key={city.slug}
                      href={`/locations/${city.slug}`}
                      className="group flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-emerald-500/30 hover:shadow-md transition-all bg-background"
                    >
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {city.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm group-hover:text-emerald-600 transition-colors">
                          {city.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Population: {city.population}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 shrink-0 transition-colors" />
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 bg-muted/30 border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Event Services Anywhere in Ethiopia
          </h2>
          <p className="text-muted-foreground mb-8">
            No matter where your event is located, Enkutatash Events can help. Contact us for a free consultation.
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
    </div>
  )
}
