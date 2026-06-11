# Enkutatash Event — Pre-Deployment Checklist

> **Target:** Next.js 16 (App Router) website for Enkutatash Event, Addis Ababa, Ethiopia
> **Last Updated:** March 2026
> **Build Status:** ✅ Compiles successfully

---

## ✅ IMPLEMENTED (Code changes in this project)

### 1. SEO Optimization

| Item | Status | File(s) |
|------|--------|---------|
| Meta title (template-based) | ✅ Done | `src/app/layout.tsx` |
| Meta description | ✅ Done | `src/app/layout.tsx` |
| Keywords | ✅ Done | `src/app/layout.tsx` |
| Canonical URL | ✅ Done | `src/app/layout.tsx` → `alternates.canonical` |
| Open Graph tags (og:title, og:description, og:image, og:type, og:locale) | ✅ Done | `src/app/layout.tsx` → `openGraph` |
| Twitter Card (summary_large_image) | ✅ Done | `src/app/layout.tsx` → `twitter` |
| JSON-LD: LocalBusiness schema | ✅ Done | `src/app/layout.tsx` → `JsonLd()` component |
| JSON-LD: EventOrganization schema | ✅ Done | `src/app/layout.tsx` → `JsonLd()` component |
| Dynamic sitemap.xml | ✅ Done | `src/app/sitemap.ts` |
| Dynamic robots.txt | ✅ Done | `src/app/robots.ts` |
| robots meta (index, follow, max-snippet, max-image-preview) | ✅ Done | `src/app/layout.tsx` → `robots` |
| Image alt text (existing) | ✅ Already had descriptive alts | `landing-page.tsx` |
| Title template for sub-pages | ✅ Done | `title.template: '%s \| Enkutatash Event'` |

### 2. Performance

| Item | Status | File(s) |
|------|--------|---------|
| Font display: swap | ✅ Done | `src/app/layout.tsx` → `display: "swap"` |
| Font preloading (critical only) | ✅ Done | `geistSans: preload: true`, `geistMono: preload: false` |
| Google Fonts preconnect | ✅ Done | `layout.tsx` `<head>` |
| Removed `unoptimized` from all `<Image>` | ✅ Done | `landing-page.tsx`, `header.tsx`, `sidebar.tsx` |
| Added `sizes` to fill images | ✅ Done | `landing-page.tsx` (3 different size contexts) |
| Added `priority` to above-fold images | ✅ Done | `header.tsx`, `sidebar.tsx`, landing navbar logo |
| Image formats: AVIF + WebP | ✅ Done | `next.config.ts` → `formats` |
| Image deviceSizes + imageSizes | ✅ Done | `next.config.ts` → `deviceSizes`, `imageSizes` |
| Cache-Control: immutable for static assets | ✅ Done | `next.config.ts` → `headers()` |
| Cache-Control: immutable for event images | ✅ Done | `next.config.ts` → `headers()` |
| Compression enabled | ✅ Done | `next.config.ts` → `compress: true` |
| X-Powered-By removed | ✅ Done | `next.config.ts` → `poweredByHeader: false` |
| React strict mode enabled | ✅ Done | `next.config.ts` → `reactStrictMode: true` |
| TypeScript strict build | ✅ Done | `next.config.ts` → `ignoreBuildErrors: false` |
| Standalone output for Docker/PM2 | ✅ Done | `next.config.ts` → `output: "standalone"` |

### 3. Accessibility (a11y)

| Item | Status | File(s) |
|------|--------|---------|
| Skip-to-content link | ✅ Done | `src/app/layout.tsx` |
| `<html lang="en">` | ✅ Done | `src/app/layout.tsx` |
| `sr-only` labels on icon buttons | ✅ Already existed | `header.tsx` ("Toggle sidebar", "Toggle theme", "Notifications") |
| `role="alert"` on error page | ✅ Done | `src/app/error.tsx` |
| `role="status"` + `aria-label` on loading page | ✅ Done | `src/app/loading.tsx` |
| Min touch target 44px (mobile) | ✅ Already existed | Landing page buttons use `min-h-[44px]` |
| `suppressHydrationWarning` on html | ✅ Done | `src/app/layout.tsx` (required for theme) |
| Main content landmark | ✅ Done | `<div id="main-content">` in layout |

### 4. Security

| Item | Status | File(s) |
|------|--------|---------|
| Content-Security-Policy (CSP) | ✅ Done | `next.config.ts` → `headers()` |
| X-Frame-Options: DENY | ✅ Done | `next.config.ts` → `headers()` |
| X-Content-Type-Options: nosniff | ✅ Done | `next.config.ts` → `headers()` |
| X-XSS-Protection: 1; mode=block | ✅ Done | `next.config.ts` → `headers()` |
| Referrer-Policy: strict-origin-when-cross-origin | ✅ Done | `next.config.ts` → `headers()` |
| Permissions-Policy | ✅ Done | `next.config.ts` → `headers()` |
| Strict-Transport-Security (HSTS) | ✅ Done | `next.config.ts` → `headers()` |
| Cross-Origin-Opener-Policy | ✅ Done | `next.config.ts` → `headers()` |
| Cross-Origin-Resource-Policy | ✅ Done | `next.config.ts` → `headers()` |
| HTTPS enforcement middleware | ✅ Done | `src/middleware.ts` |
| Rate limiting on API routes | ✅ Done | `src/middleware.ts` (60 req/min) |
| Sensitive path blocking (.env, .git, /admin, /prisma, /db) | ✅ Done | `src/middleware.ts` |
| Environment variables documented | ✅ Done | `.env.example` |

### 5. PWA & Mobile

| Item | Status | File(s) |
|------|--------|---------|
| Web App Manifest | ✅ Done | `public/manifest.json` |
| Apple touch icon | ✅ Done | `layout.tsx` → `icons.apple` |
| Theme color (light + dark) | ✅ Done | `layout.tsx` → `viewport.themeColor` |
| Viewport configuration | ✅ Done | `layout.tsx` → `viewport` (exported separately per Next.js 14+ convention) |
| manifest.json linked | ✅ Done | `layout.tsx` → `manifest: "/manifest.json"` |

### 6. Error Handling & Monitoring

| Item | Status | File(s) |
|------|--------|---------|
| Custom 404 page | ✅ Done | `src/app/not-found.tsx` |
| Error boundary | ✅ Done | `src/app/error.tsx` (with reset + error.digest) |
| Loading state | ✅ Done | `src/app/loading.tsx` (accessible spinner) |

### 7. Analytics & Tracking

| Item | Status | File(s) |
|------|--------|---------|
| Google Analytics 4 (GA4) | ✅ Scaffolding | `src/components/analytics.tsx` |
| GA4 page view tracking | ✅ Done | `src/components/analytics.tsx` → `TrackPageViews` |
| Google Search Console verification | ✅ Scaffolding | `src/components/analytics.tsx` |
| Meta (Facebook) Pixel | ✅ Scaffolding | `src/components/analytics.tsx` |
| Analytics component in layout | ✅ Done | `src/app/layout.tsx` → `<Analytics />` |

### 8. Legal & Compliance

| Item | Status | File(s) |
|------|--------|---------|
| Privacy Policy page | ✅ Done | `src/app/privacy/page.tsx` |
| Terms of Service page | ✅ Done | `src/app/terms/page.tsx` |
| SEO metadata on legal pages | ✅ Done | Individual page `metadata` exports |

---

## ⬜ REMAINING MANUAL STEPS (Pre-Deployment)

### Critical — Must Do Before Launch

| # | Task | Details |
|---|------|---------|
| 1 | **Generate 180×180 Apple Touch Icon** | Create `apple-touch-icon.png` (180×180px) from the Enkutatash logo. Place in `/public/`. Update `layout.tsx` `icons.apple` path. |
| 2 | **Generate 512×512 PWA Icon** | Create a high-resolution 512×512 version of the logo for `manifest.json` icon. |
| 3 | **Generate 1200×630 OG Image** | Create `enkutatash-logo-wide.png` (1200×630px) for social sharing. Currently referenced but may not exist. Place in `/public/`. |
| 4 | **Set `NEXT_PUBLIC_SITE_URL`** | In production `.env`, set to your actual domain (e.g., `https://enkutatashevents.com`). Affects canonical URLs, sitemap, OG image paths, and JSON-LD. |
| 5 | **Google Analytics Setup** | 1. Create GA4 property at analytics.google.com. 2. Get Measurement ID (G-XXXXXXXXXX). 3. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in `.env`. |
| 6 | **Google Search Console** | 1. Verify domain ownership at search.google.com/search-console. 2. Get verification code. 3. Set `NEXT_PUBLIC_GSC_VERIFICATION` in `.env`. 4. Submit sitemap URL. |
| 7 | **HTTPS/TLS Certificate** | Ensure Caddy is configured with a valid TLS certificate for your domain. HSTS header is already set. |
| 8 | **Update Social Media URLs** | In `layout.tsx` JSON-LD, confirm Instagram/Facebook/Twitter URLs are correct. Same for `.env.example`. |

### Important — Should Do Before Launch

| # | Task | Details |
|---|------|---------|
| 9 | **Meta Pixel (Optional)** | If running Facebook ads: create pixel at Meta Events Manager, set `NEXT_PUBLIC_META_PIXEL_ID` in `.env`. |
| 10 | **Add Privacy & Terms links to Footer** | The landing page footer needs links to `/privacy` and `/terms`. Currently these pages exist but aren't linked. |
| 11 | **Convert event images to WebP** | The 27 images in `/public/events/` are JPGs. For even better performance, convert them to WebP format (30-50% smaller). The Next.js `<Image>` component will auto-optimize, but serving WebP directly saves server CPU. |
| 12 | **Run Lighthouse Audit** | Run Chrome Lighthouse (or `npx lighthouse http://localhost:3000`) and target 90+ on all categories. |
| 13 | **Test Social Sharing** | Use these tools to verify OG tags render correctly: |
|   | - Facebook: https://developers.facebook.com/tools/debug/ |
|   | - Twitter: https://cards-dev.twitter.com/validator |
|   | - LinkedIn: https://www.linkedin.com/post-inspector/ |
| 14 | **Test JSON-LD** | Validate at https://search.google.com/test/rich-results |
| 15 | **Color Contrast Audit** | Run axe DevTools or WAVE on the landing page. The emerald-600 (#059669) on white passes WCAG AA (4.56:1), but verify all muted-foreground colors. |
| 16 | **Input Sanitization in Forms** | The contact form in the landing page sends data via email/phone. If you add a backend API route for form submissions, validate with **zod** (already installed): |

```typescript
// Example: src/app/api/contact/route.ts
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 });
  }
  // Process validated data...
}
```

### Nice-to-Have — Post-Launch

| # | Task | Details |
|---|------|---------|
| 17 | **Service Worker (PWA Offline)** | For full offline support, add `next-pwa` or create a custom service worker. Not critical for an event organizer site. |
| 18 | **Bundle Analysis** | Run `npx @next/bundle-analyzer` to check for oversized chunks. Framer-motion is large (~30KB gzipped) — consider replacing with CSS animations on landing page. |
| 19 | **Rate Limiting → Redis** | Current rate limiter is in-memory (resets on deploy). For production at scale, use Upstash Redis: `npm install @upstash/ratelimit @upstash/redis` |
| 20 | **Error Monitoring → Sentry** | Add Sentry for real-time error tracking: `npx @sentry/wizard@latest -i nextjs` |
| 21 | **CSP Reporting** | Add `report-uri` or `report-to` to CSP header to monitor violations without breaking functionality. |
| 22 | **Migrate middleware → proxy** | Next.js 16 deprecates `middleware.ts` in favor of `proxy`. Currently works with a warning. Plan migration. |
| 23 | **Server-Side Rendering** | The landing page is currently `'use client'`. For better SEO, consider converting the landing page to a Server Component with client islands. |

---

## 📁 FILES CREATED / MODIFIED

### New Files Created
```
src/app/sitemap.ts              — Dynamic sitemap generation
src/app/robots.ts               — Dynamic robots.txt
src/app/not-found.tsx           — Custom 404 page
src/app/error.tsx               — Error boundary
src/app/loading.tsx             — Loading state
src/app/privacy/page.tsx        — Privacy Policy
src/app/terms/page.tsx          — Terms of Service
src/middleware.ts                — Security middleware (HTTPS, rate limiting, path blocking)
src/components/analytics.tsx    — GA4, GSC, Meta Pixel
public/manifest.json            — PWA Web App Manifest
.env.example                    — Environment variables template
```

### Modified Files
```
src/app/layout.tsx              — Full SEO metadata, viewport, JSON-LD, skip link, analytics
next.config.ts                  — Security headers, image optimization, caching, compression
src/components/event-organizer/landing-page.tsx — Removed unoptimized, added sizes/priority
src/components/event-organizer/header.tsx        — Removed unoptimized, added priority
src/components/event-organizer/sidebar.tsx       — Removed unoptimized, added priority
tsconfig.json                   — Excluded examples/ and skills/ from build
```

### Removed (effectively replaced)
```
public/robots.txt               — Replaced by src/app/robots.ts (dynamic)
```

---

## 🔑 ENVIRONMENT VARIABLES CHECKLIST

Set these in your production `.env` before deploying:

```bash
# REQUIRED
NEXT_PUBLIC_SITE_URL=https://enkutatashevents.com
DATABASE_URL=file:./db/custom.db

# RECOMMENDED
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GSC_VERIFICATION=your-verification-code

# OPTIONAL
NEXT_PUBLIC_META_PIXEL_ID=
NEXTAUTH_SECRET=
NEXTAUTH_URL=https://enkutatashevents.com
NEXT_PUBLIC_PHONE=+251915895757
NEXT_PUBLIC_EMAIL=enkutatashevents@gmail.com
NEXT_PUBLIC_INSTAGRAM=https://www.instagram.com/enkutatashevents
NEXT_PUBLIC_FACEBOOK=https://www.facebook.com/enkutatashevents
NEXT_PUBLIC_TWITTER=https://twitter.com/enkutatash
```

---

## 🧪 PRE-LAUNCH TEST SCRIPT

Run through these checks before going live:

1. `npx next build` — ✅ Passes
2. `npx next start` — Verify site loads at localhost:3000
3. Check `/sitemap.xml` renders XML
4. Check `/robots.txt` renders properly
5. Check `/privacy` and `/terms` pages load
6. Check `/nonexistent-page` shows custom 404
7. View page source — verify `<meta>` tags, `<script type="application/ld+json">`, OG tags
8. Test on mobile (Chrome DevTools device emulation)
9. Test keyboard navigation: Tab through all interactive elements
10. Test with screen reader (VoiceOver/NVDA)
11. Run `npx lighthouse http://localhost:3000 --output html`
12. Verify no console errors in production build

---

*Generated for Enkutatash Event — Addis Ababa, Ethiopia*
