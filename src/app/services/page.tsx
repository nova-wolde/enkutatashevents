import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Our Services — Event Planning, Decoration, Sound & Lighting | Addis Ababa",
  description:
    "Enkutatash Event offers 8 premium event services in Addis Ababa: wedding planning, corporate events, concerts, cultural celebrations, decoration, stage & tent rental, sound & lighting, and catering. Free quotes available.",
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
  ],
  openGraph: {
    title: "Our Services — Enkutatash Event | Addis Ababa",
    description:
      "8 premium event services in Addis Ababa: weddings, corporate events, concerts, decoration, stage & tent rental, sound & lighting, catering, and promotion.",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Services — Enkutatash Event | Addis Ababa",
    description:
      "8 premium event services in Addis Ababa: weddings, corporate events, concerts, decoration, stage & tent rental, sound & lighting, catering, and promotion.",
  },
  alternates: {
    canonical: "/services",
  },
};

const services = [
  {
    id: "advert-promotion",
    slug: "services/advert-promotion",
    title: "Advert & Promotion",
    titleAmharic: "ማስታወቂያ እና ማስፋፊያ",
    description:
      "Strategic advertising and promotional campaigns to maximize your event's reach across Addis Ababa and beyond. We handle social media marketing, print materials, radio spots, and digital advertising to ensure your event gets the attention it deserves. Our team creates compelling campaigns that drive attendance and engagement, using data-driven approaches to target the right audience at the right time.",
    highlights: [
      "Social media marketing campaigns",
      "Radio and TV advertising",
      "Print material design and distribution",
      "Digital advertising and retargeting",
      "Event branding and promotional strategy",
    ],
    icon: "📣",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "event-organization",
    slug: "services/event-organization",
    title: "Event Organization",
    titleAmharic: "ዝግጅት አደራጅ",
    description:
      "Full-service event planning and management from concept to completion. Whether it is a grand wedding, corporate conference, or cultural celebration, our experienced team coordinates every detail to deliver a seamless and memorable experience. We handle venue selection, vendor coordination, timeline management, and on-site supervision to ensure flawless execution from start to finish.",
    highlights: [
      "End-to-end event planning",
      "Venue selection and booking",
      "Vendor coordination and management",
      "Timeline and logistics planning",
      "On-site event supervision",
    ],
    icon: "🎉",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "decoration",
    slug: "services/decoration",
    title: "Decoration",
    titleAmharic: "ጌጣጌጥ",
    description:
      "Stunning decorative designs tailored to your theme and vision. From elegant floral arrangements and balloon artistry to traditional Ethiopian motifs and modern aesthetics, our decoration team transforms any venue into a breathtaking setting. We work closely with clients to understand their style preferences and create custom decoration plans that exceed expectations.",
    highlights: [
      "Custom floral arrangements",
      "Traditional Ethiopian decor",
      "Modern and contemporary designs",
      "Balloon artistry and installations",
      "Theme-based decoration packages",
    ],
    icon: "🎨",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    id: "stage-tent-rental",
    slug: "services/stage-tent-rental",
    title: "Stage & Tent Rental",
    titleAmharic: "መድረክ እና ድንኳን ኪራይ",
    description:
      "Professional stage setups and tent rentals for events of any scale. We provide high-quality tents, custom-built stages, podiums, and backdrop systems suitable for outdoor weddings, concerts, corporate events, and community gatherings. Our equipment is well-maintained, and our setup team ensures everything is installed safely and on schedule.",
    highlights: [
      "Tents of all sizes (50 to 10,000+ guests)",
      "Custom-built stages and podiums",
      "Backdrop and draping systems",
      "VIP seating and lounge setups",
      "Outdoor and indoor configurations",
    ],
    icon: "⛺",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    id: "sound-lighting",
    slug: "services/sound-lighting",
    title: "Sound & Lighting Supply",
    titleAmharic: "ድምጽ እና ብርሃን",
    description:
      "State-of-the-art sound systems and professional lighting setups for events of all sizes. From intimate gatherings requiring subtle ambiance to large concerts demanding powerful PA systems and dynamic light shows, we deliver crystal-clear audio and stunning visual effects. Our technicians handle setup, operation, and breakdown to ensure a flawless audiovisual experience.",
    highlights: [
      "Professional PA systems for all venue sizes",
      "Dynamic stage and effect lighting",
      "DJ equipment and monitoring",
      "LED video walls and projectors",
      "On-site sound engineering",
    ],
    icon: "🔊",
    gradient: "from-cyan-500 to-sky-600",
  },
  {
    id: "chair-table-supply",
    slug: "services/chair-table-supply",
    title: "Chair & Table Supply",
    titleAmharic: "ወንበር እና ጠረጴዛ አቅርቦት",
    description:
      "A wide selection of chairs, tables, and furniture rentals to match any event style. From banquet-style round tables and elegant chiavari chairs to functional conference setups and traditional Ethiopian seating arrangements, we have your needs covered. All furniture is clean, well-maintained, and delivered with professional setup and breakdown service.",
    highlights: [
      "Chiavari and banquet chairs",
      "Round and rectangular tables",
      "VIP and lounge furniture",
      "Traditional Ethiopian seating",
      "Delivery, setup, and breakdown",
    ],
    icon: "🪑",
    gradient: "from-indigo-500 to-blue-600",
  },
  {
    id: "catering",
    slug: "services/catering",
    title: "Catering Supply",
    titleAmharic: "ምግብ አቅርቦት",
    description:
      "Delicious catering services featuring the best of Ethiopian and international cuisine. Our culinary team prepares everything from traditional injera platters and coffee ceremonies to continental menus, ensuring every guest is treated to an unforgettable dining experience. We accommodate dietary requirements and offer customized menus to match your event theme and budget.",
    highlights: [
      "Traditional Ethiopian cuisine",
      "International and continental menus",
      "Ethiopian coffee ceremony setup",
      "Custom menu planning",
      "Full-service waitstaff available",
    ],
    icon: "🍽️",
    gradient: "from-orange-500 to-red-600",
  },
  {
    id: "kids-entertainment",
    slug: "services/kids-entertainment",
    title: "Kids Game Material Supply",
    titleAmharic: "የህፃናት መጫወቻ",
    description:
      "Fun and safe entertainment options for children at your event. We supply bouncy castles, ball pits, face painting stations, game booths, and age-appropriate activities that keep young guests engaged and happy while adults enjoy the celebration. All equipment meets safety standards and our staff supervises activities to ensure a worry-free experience for parents.",
    highlights: [
      "Bouncy castles and inflatables",
      "Ball pits and soft play areas",
      "Face painting and art stations",
      "Game booths and activities",
      "Supervised play areas",
    ],
    icon: "🎮",
    gradient: "from-lime-500 to-green-600",
  },
];

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
              <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 hover:border-emerald-500/20 overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center text-2xl shrink-0 shadow-lg`}>
                      {service.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {service.title}
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
