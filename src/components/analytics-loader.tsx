"use client";

// ─── Runtime-Configurable Analytics Loader ───────────────────────────────────
// Loads GA4 / Meta Pixel / GSC verification using IDs from the owner dashboard
// (Settings → Integrations → stored in Redis, served by /api/public-settings).
// Env vars (NEXT_PUBLIC_GA_MEASUREMENT_ID etc.) act as build-time fallbacks, so
// nothing breaks if the API is unreachable. IDs pasted in the admin panel take
// effect on the next page load — no redeploy required.
//
// GA4 + Meta Pixel are gated behind the cookie-consent banner (GDPR/ePrivacy).

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    enkutatashAnalyticsLoaded?: string;
  }
}

const ENV_GA = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";
const ENV_META = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

const CONSENT_EVENT = "cookie-consent-accepted";
const CONSENT_KEY = "enkutatash-cookie-consent";

function loadGtag(measurementId: string) {
  if (!measurementId || window.enkutatashAnalyticsLoaded?.includes(`ga:${measurementId}`))
    return;
  window.enkutatashAnalyticsLoaded = `${window.enkutatashAnalyticsLoaded || ""} ga:${measurementId}`;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId, { page_path: window.location.pathname });
}

function loadMetaPixel(pixelId: string) {
  if (!pixelId || window.enkutatashAnalyticsLoaded?.includes(`meta:${pixelId}`)) return;
  window.enkutatashAnalyticsLoaded = `${window.enkutatashAnalyticsLoaded || ""} meta:${pixelId}`;

  /* eslint-disable */
  const n: any = (window as any).fbq = function () {
    (n as any).callMethod
      ? (n as any).callMethod.apply(n, arguments)
      : (n as any).queue.push(arguments);
  };
  if (!(window as any)._fbq) (window as any)._fbq = n;
  n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  s.parentNode!.insertBefore(s, document.getElementsByTagName("script")[0]);
  /* eslint-enable */
  window.fbq!("init", pixelId);
  window.fbq!("track", "PageView");
}

function onConsent(loaders: Array<() => void>) {
  const run = () => loaders.forEach((fn) => fn());
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.accepted === true) {
        run();
        return;
      }
    }
  } catch {
    /* malformed consent data — wait for event */
  }
  window.addEventListener(CONSENT_EVENT, run, { once: true });
}

export function AnalyticsLoader() {
  useEffect(() => {
    let cancelled = false;

    const apply = (ids: {
      gaMeasurementId: string;
      gscVerification: string;
      metaPixelId: string;
    }) => {
      if (cancelled) return;

      // GSC verification meta — inject only if not already server-rendered
      if (ids.gscVerification && !document.querySelector('meta[name="google-site-verification"]')) {
        const meta = document.createElement("meta");
        meta.name = "google-site-verification";
        meta.content = ids.gscVerification;
        document.head.appendChild(meta);
      }

      const loaders: Array<() => void> = [];
      if (ids.gaMeasurementId) loaders.push(() => loadGtag(ids.gaMeasurementId));
      if (ids.metaPixelId) loaders.push(() => loadMetaPixel(ids.metaPixelId));
      if (loaders.length > 0) onConsent(loaders);
    };

    // 1) Start immediately with env fallbacks so analytics works even if the API fails
    const envOnly = {
      gaMeasurementId: ENV_GA,
      gscVerification: "",
      metaPixelId: ENV_META,
    };

    // 2) Fetch runtime settings — they override / complement env vars
    interface PublicSettings {
      gaMeasurementId?: string;
      gscVerification?: string;
      metaPixelId?: string;
    }
    fetch("/api/public-settings")
      .then((r): Promise<PublicSettings | null> => (r.ok ? r.json() : Promise.resolve(null)))
      .then((data: PublicSettings | null) => {
        if (cancelled || !data) {
          apply(envOnly);
          return;
        }
        apply({
          gaMeasurementId: data.gaMeasurementId || ENV_GA,
          gscVerification: data.gscVerification || "",
          metaPixelId: data.metaPixelId || ENV_META,
        });
      })
      .catch(() => {
        if (!cancelled) apply(envOnly);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
