import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone, Mail, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { services } from "@/lib/services-data";

export const metadata: Metadata = {
  title: "Our Services — Event Planning, Decoration, Sound & Lighting | Addis Ababa",
  description:
    "Enkutatash Events offers 8 premium event services in Addis Ababa, Ethiopia: wedding planning, corporate events, concerts, cultural celebrations, decoration, stage & tent rental, sound & lighting, and catering. Free quotes available.",
  keywords: [
    "event services Addis Ababa",
    "wedding planner Ethiopia",
    "corporate event organizer",
    "concert production Addis",
    "cultural event planning",
    "event decoration Ethiopia",
    "stage tent rental Addis Ababa",
    "sound lighting rental",
    "catering service Ethiopia",
    "event promotion Addis",
    "event management Ethiopia",
    "party planner Addis Ababa",
    "wedding organizer Ethiopia",
    "kids party entertainment Addis",
  ],
  openGraph: {
    title: "Our Services — Enkutatash Events | Addis Ababa, Ethiopia",
    description:
      "8 premium event services in Addis Ababa: weddings, corporate events, concerts, decoration, stage & tent rental, sound & lighting, catering, and promotion. Free quotes.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services — Enkutatash Events | Addis Ababa, Ethiopia",
    description:
      "8 premium event services in Addis Ababa: weddings, corporate events, concerts, decoration, stage & tent rental, sound & lighting, catering, and promotion.",
  },
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            Our Services
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Whatever the occasion,{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              we make it extraordinary
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            From intimate gatherings to grand spectacles, Enkutatash delivers world-class
            event services across Addis Ababa and Ethiopia. Explore our 8 comprehensive services below.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service) => (
              <Link key={service.id} href={`/${service.slug}`} className="block group">
                <Card className="hover:shadow-xl transition-all duration-300 hover:border-emerald-500/20 overflow-hidden cursor-pointer">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                        {service.icon}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                          {service.title}
                          <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </h2>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{service.titleAmharic}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <ul className="space-y-1.5">
                      {service.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-muted/30 border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
            Ready to plan your next event?
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

      {/* Back to Home */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="text-sm text-emerald-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  );
}
