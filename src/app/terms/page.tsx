import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Enkutatash Event — our agreement for event planning and organization services.",
  openGraph: {
    title: "Terms of Service | Enkutatash Event",
    description: "Terms of Service for Enkutatash Event — our agreement for event planning and organization services.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | Enkutatash Event",
    description: "Terms of Service for Enkutatash Event — our agreement for event planning and organization services.",
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: June 2026
        </p>

        <div className="space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">1. Services</h2>
            <p className="text-muted-foreground">
              Enkutatash Event provides event planning, organization, and related services including
              but not limited to: event coordination, decoration, stage and tent rental, sound and
              lighting supply, catering, and promotional services. All services are subject to
              availability and a signed service agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">2. Bookings & Payments</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>A booking is confirmed only upon receipt of a signed agreement and advance payment</li>
              <li>Advance payment amounts are specified in the individual service agreement</li>
              <li>Full payment must be received before the event date unless otherwise agreed in writing</li>
              <li>Prices are subject to change until a booking is confirmed</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">3. Cancellation Policy</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Cancellations made 30+ days before the event: 50% of advance payment refundable</li>
              <li>Cancellations made 15-29 days before the event: 25% of advance payment refundable</li>
              <li>Cancellations made less than 15 days before the event: No refund</li>
              <li>Force majeure events (natural disasters, government restrictions) will be handled on a case-by-case basis</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">4. Client Responsibilities</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-1">
              <li>Provide accurate event details and timely decisions</li>
              <li>Ensure venue access and necessary permits</li>
              <li>Communicate any changes as early as possible</li>
              <li>Ensure guests comply with venue rules and local regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">5. Liability</h2>
            <p className="text-muted-foreground">
              Enkutatash Event shall not be liable for any indirect, incidental, or consequential
              damages arising from our services. Our total liability shall not exceed the total
              amount paid for the specific service in question. We maintain appropriate insurance
              for our operations and equipment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on this website, including text, images, logos, and designs, is the
              property of Enkutatash Event and is protected by intellectual property laws.
              Event photos may be used for promotional purposes unless the client opts out in writing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mt-8 mb-3">7. Governing Law</h2>
            <p className="text-muted-foreground">
              These terms are governed by the laws of the Federal Democratic Republic of Ethiopia.
              Any disputes shall be resolved through amicable negotiation first, and if
              unsuccessful, through the courts of Addis Ababa.
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
              <a href="tel:+251910977371" className="text-emerald-600 hover:underline">
                +251 910 977 371
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
