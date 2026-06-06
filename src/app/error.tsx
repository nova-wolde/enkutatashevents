"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4" role="alert">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Something Went Wrong
        </h1>
        <p className="text-muted-foreground mb-8">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-emerald-600/20 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold hover:bg-muted transition-colors"
          >
            Go Home
          </a>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
