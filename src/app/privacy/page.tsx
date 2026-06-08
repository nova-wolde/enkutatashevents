import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Enkutatash Event — how we collect, use, and protect your personal information.",
  openGraph: {
    title: "Privacy Policy | Enkutatash Event",
    description: "Privacy Policy for Enkutatash Event — how we collect, use, and protect your personal information.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Enkutatash Event",
    description: "Privacy Policy for Enkutatash Event — how we collect, use, and protect your personal information.",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: June 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              When you contact us through our website, phone, or social media, we may collect:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1 mt-2">
              <li>Name and contact information (email, phone number)</li>
              <li>Event details (date, venue, guest count, preferences)</li>
              <li>Website usage data through cookies and analytics</li>
              <li>Device and browser information for site optimization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>To respond to your event inquiries and provide quotations</li>
              <li>To plan, organize, and deliver event services</li>
              <li>To communicate about event logistics and updates</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. Information Sharing</h2>
            <p className="text-muted-foreground">
              We do not sell, trade, or rent your personal information to third parties. We may share
              information with trusted service providers (e.g., caterers, venue operators) solely for
              the purpose of delivering our event services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement reasonable security measures to protect your personal information. However,
              no method of transmission over the internet is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Cookies & Analytics</h2>
            <p className="text-muted-foreground">
              Our website uses cookies and Google Analytics to understand how visitors interact with
              our site. This data is aggregated and anonymous. You can disable cookies in your
              browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Your Rights</h2>
            <p className="text-muted-foreground">
              You may request access to, correction of, or deletion of your personal data at any
              time by contacting us at{" "}
              <a href="mailto:enkutatashevents@gmail.com" className="text-emerald-600 hover:underline">
                enkutatashevents@gmail.com
              </a>{" "}
              or calling{" "}
              <a href="tel:+251915895757" className="text-emerald-600 hover:underline">
                +251 915 895 757
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">7. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. Changes will be posted on this
              page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">8. Contact</h2>
            <p className="text-muted-foreground">
              Enkutatash Event<br />
              Ayat, Addis Ababa, Ethiopia<br />
              Email:{" "}
              <a href="mailto:enkutatashevents@gmail.com" className="text-emerald-600 hover:underline">
                enkutatashevents@gmail.com
              </a><br />
              Phone:{" "}
              <a href="tel:+251915895757" className="text-emerald-600 hover:underline">
                +251 915 895 757
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <a href="/" className="text-sm text-emerald-600 hover:underline">
            &larr; Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
