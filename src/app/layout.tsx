import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegistration } from "@/components/service-worker-registration";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

// ─── Font Optimization ────────────────────────────────────────────────────────
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// ─── Site Constants ───────────────────────────────────────────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://enkutatashevents.com";
const SITE_NAME = "Enkutatash Events";
const SITE_TITLE = "Enkutatash Events — Premium Event Organizers | Addis Ababa, Ethiopia";
const SITE_DESCRIPTION =
  "Enkutatash Events — Addis Ababa's premier event organizer and wedding planner in Ethiopia. Weddings, corporate events, concerts, cultural celebrations, stage & tent rental, sound & lighting, catering, decoration, and kids party entertainment. Free quotes available.";
const SITE_OG_IMAGE = `${SITE_URL}/og-image.png`;

// ─── Viewport ─────────────────────────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// ─── Metadata (SEO, Open Graph, Twitter Cards) ────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "event organizer Addis Ababa",
    "Ethiopian wedding planner",
    "corporate events Ethiopia",
    "concert organizer Addis",
    "cultural celebration Ethiopia",
    "tent rental Addis Ababa",
    "sound and lighting Ethiopia",
    "catering Addis Ababa",
    "decoration Ethiopia",
    "Enkutatashevents",
    "event planning Africa",
    "stage setup Addis",
    "enkutatashevents",
    "events in Ethiopia",
    "events in Addis Ababa",
    "event management company Ethiopia",
    "wedding event planner Addis Ababa",
    "wedding organizer Ethiopia",
    "kids party entertainment Addis",
    "party planner Addis Ababa",
    "birthday party organizer Ethiopia",
    "concert production Ethiopia",
    "stage rental Addis Ababa",
    "chair rental for events Addis",
    "catering service in Addis Ababa",
    "Ethiopian coffee ceremony catering",
    "bouncy castle rental Ethiopia",
    "event decorator Addis Ababa",
    "corporate event management Ethiopia",
    "best event organizer in Addis Ababa",
    "affordable event planner Ethiopia",
  ],
  authors: [{ name: "Enkutatash Event", url: SITE_URL }],
  creator: "Enkutatash Event",
  publisher: "Enkutatash Event",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
    languages: {
      "en": SITE_URL,
      "am": SITE_URL,
      "x-default": SITE_URL,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/enkutatash-logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Enkutatash Event — Premium Event Organizers in Addis Ababa",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },

  category: "Event Planning",
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────
function JsonLd() {
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: "Enkutatash Events",
    alternateName: ["እንቁጣጣሽ ኤቨንት", "Enkutatash Event Organizer", "enkutatashevents.com"],
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/enkutatash-logo.png`,
    image: `${SITE_URL}/og-image.png`,
    telephone: ["+251910977371", "+251915895757", "+251915843131"],
    email: "enkutatashevents@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Ayat",
      addressLocality: "Addis Ababa",
      addressRegion: "Addis Ababa",
      addressCountry: "ET",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 9.0222,
      longitude: 38.7469,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "15:00",
      },
    ],
    priceRange: "$$",
    sameAs: [
      "https://www.instagram.com/enkutatashevents",
      "https://web.facebook.com/profile.php?id=61590503624575",
      "https://www.youtube.com/@Enkutatashevents",
      "https://t.me/httpenkutatashevent",
      "https://whatsapp.com/channel/0029VbDBLNS6WaKf4RGzel3r",
    ],
    foundingDate: "2022",
  };

  const eventOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Enkutatash Events",
    alternateName: "እንቁጣጣሽ ኤቨንት",
    url: SITE_URL,
    logo: `${SITE_URL}/enkutatash-logo.png`,
    description: SITE_DESCRIPTION,
    telephone: "+251910977371",
    email: "enkutatashevents@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Addis Ababa",
      addressCountry: "ET",
    },
    knowsAbout: [
      "Wedding Planning",
      "Corporate Events",
      "Concert Organization",
      "Cultural Celebrations",
      "Stage & Tent Rental",
      "Sound & Light Supply",
      "Catering Services",
      "Event Decoration",
    ],
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Enkutatash Events",
    alternateName: "እንቁጣጣሽ ኤቨንት",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: ["en", "am"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE_URL}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Privacy Policy",
        item: `${SITE_URL}/privacy`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Terms of Service",
        item: `${SITE_URL}/terms`,
      },
    ],
  };

  const aggregateRating = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: { "@type": "Organization", name: "Enkutatash Events" },
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "85",
    reviewCount: "85",
  };

  const review = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "LocalBusiness", name: "Enkutatash Events" },
    author: { "@type": "Person", name: "Dr. Dereje" },
    reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    reviewBody:
      "Enkutatash delivered an outstanding experience for our university event. Professional, organized, and exceeded expectations.",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventOrg) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRating) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(review) }}
      />
    </>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {/* Skip-to-content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-br-lg focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div id="main-content">{children}</div>
          <Toaster />
          <CookieConsent />
          <ServiceWorkerRegistration />
        </ThemeProvider>
        {/* Analytics — only loads if env vars are set AND user has given cookie consent */}
        <Analytics />
      </body>
    </html>
  );
}

// ─── Analytics Component (gated by cookie consent) ────────────────────────────
function Analytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const GSC_VERIFICATION = process.env.NEXT_PUBLIC_GSC_VERIFICATION;
  const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <>
      {/* Google Search Console Verification — always present (not a tracking cookie) */}
      {GSC_VERIFICATION && (
        <meta name="google-site-verification" content={GSC_VERIFICATION} />
      )}

      {/* Google Analytics 4 — loaded after consent */}
      {GA_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function loadGA() {
                  var s1 = document.createElement('script');
                  s1.async = true;
                  s1.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
                  document.head.appendChild(s1);
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', { page_path: window.location.pathname });
                }

                function checkConsent() {
                  try {
                    var raw = localStorage.getItem('enkutatash-cookie-consent');
                    if (raw) {
                      var data = JSON.parse(raw);
                      if (data.accepted === true) { loadGA(); return; }
                    }
                  } catch(e) {}
                  // Wait for consent
                  window.addEventListener('cookie-consent-accepted', loadGA, { once: true });
                }

                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', checkConsent);
                } else {
                  checkConsent();
                }
              })();
            `,
          }}
        />
      )}

      {/* Meta Pixel — loaded after consent */}
      {META_PIXEL_ID && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function loadPixel() {
                  !function(f,b,e,v,n,t,s)
                  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                  n.queue=[];t=b.createElement(e);t.async=!0;
                  t.src=v;s=b.getElementsByTagName(e)[0];
                  s.parentNode.insertBefore(t,s)}(window, document,'script',
                  'https://connect.facebook.net/en_US/fbevents.js');
                  fbq('init', '${META_PIXEL_ID}');
                  fbq('track', 'PageView');
                }

                function checkConsent() {
                  try {
                    var raw = localStorage.getItem('enkutatash-cookie-consent');
                    if (raw) {
                      var data = JSON.parse(raw);
                      if (data.accepted === true) { loadPixel(); return; }
                    }
                  } catch(e) {}
                  window.addEventListener('cookie-consent-accepted', loadPixel, { once: true });
                }

                if (document.readyState === 'loading') {
                  document.addEventListener('DOMContentLoaded', checkConsent);
                } else {
                  checkConsent();
                }
              })();
            `,
          }}
        />
      )}
    </>
  );
}
