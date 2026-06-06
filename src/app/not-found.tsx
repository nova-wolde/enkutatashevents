import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <Image
          src="/enkutatash-logo.png"
          alt="Enkutatash Event Logo"
          width={64}
          height={64}
          unoptimized
          className="h-16 w-16 mx-auto mb-6 rounded-xl object-contain"
        />
        <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to planning amazing events!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
