'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  ArrowUp,
  ChevronRight,
  Clock,
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from 'lucide-react'

// ─── Footer content shape (loose — accepts homepage SiteContent or defaults) ──
export interface FooterContent {
  businessName: string
  businessNameAmharic: string
  description: string
  descriptionAmharic: string
  email: string
  phones: string[]
  phoneLinks: string[]
  address?: string
  addressAmharic?: string
  workingHours?: { day: string; hours: string }[]
  socialLinks?: { platform: string; url: string }[]
}

const defaultContent: FooterContent = {
  businessName: 'Enkutatash Events',
  businessNameAmharic: 'እንቁጣጣሽ ኤቨንት',
  description: 'Premium event organizers in Addis Ababa.',
  descriptionAmharic: 'በአዲስ አበባ ፕሪሚየም ዝግጅት አደራጆች',
  email: 'enkutatashevents@gmail.com',
  phones: ['+251 915 895 757', '+251 915 843 131', '+251 910 977 371'],
  phoneLinks: ['+251915895757', '+251915843131', '+251910977371'],
  address: 'Ayat Mall, 1st Floor, Office No. E1F-19, Ayat, Addis Ababa',
  addressAmharic: 'አያት ሞል፣ 1ኛ ፎቅ፣ ቢሮ ቁጥር E1F-19፣ አያት፣ አዲስ አበባ',
}

// ─── Language hook (reads the same localStorage key the site toggle writes) ──
function useFooterLanguage() {
  const [lang, setLang] = useState<'en' | 'am'>('en')

  useEffect(() => {
    const read = () => {
      const saved = localStorage.getItem('enkutatash-language')
      if (saved === 'am' || saved === 'en') setLang(saved)
    }
    read()
    // React to the on-page EN/አማ toggle (custom event) and other-tab changes
    const onCustom = (e: Event) => setLang((e as CustomEvent<'en' | 'am'>).detail === 'am' ? 'am' : 'en')
    window.addEventListener('enkutatash:language', onCustom)
    window.addEventListener('storage', read)
    return () => {
      window.removeEventListener('enkutatash:language', onCustom)
      window.removeEventListener('storage', read)
    }
  }, [])

  const t = useCallback((en: string, am: string) => (lang === 'am' ? am || en : en), [lang])
  return { lang, t }
}

// ─── Adey Abeba flower motif (8 petals, brand emblem) ───────────────────────
function FlowerMotif({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <g fill="currentColor">
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse key={i} cx="100" cy="54" rx="16" ry="41" transform={`rotate(${i * 45} 100 100)`} />
        ))}
        <circle cx="100" cy="100" r="15" />
      </g>
    </svg>
  )
}

const socialIconFor = (platform: string) => {
  const p = platform.toLowerCase()
  if (p.includes('instagram')) return Instagram
  if (p.includes('face')) return Facebook
  if (p.includes('you')) return Youtube
  return Globe
}

// ─── Site-wide footer — "emerald medallion" redesign ────────────────────────
export function SiteFooter({ content }: { content?: Partial<FooterContent> }) {
  const c = useMemo<FooterContent>(() => ({ ...defaultContent, ...content }), [content])
  const { t } = useFooterLanguage()
  const pathname = usePathname()
  const isHome = pathname === '/'

  const year = new Date().getFullYear()
  const hash = (id: string) => (isHome ? `#${id}` : `/#${id}`)
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const exploreLinks = [
    { en: 'About Us', am: 'ስለ እኛ', href: hash('about') },
    { en: 'Services', am: 'አገልግሎቶች', href: '/services' },
    { en: 'Locations', am: 'አካባቢዎች', href: '/locations' },
    { en: 'Blog', am: 'ብሎግ', href: '/blog' },
    { en: 'Contact', am: 'ያግኙን', href: hash('contact') },
  ]

  const serviceLinks = [
    { en: 'Weddings', am: 'ሠርጎች', href: '/services' },
    { en: 'Corporate Events', am: 'የድርጅት ዝግጅቶች', href: '/services' },
    { en: 'Concerts & Live Shows', am: 'ኮንሰርቶችና ትርኢቶች', href: '/services' },
    { en: 'Cultural Celebrations', am: 'ባህላዊ በዓላት', href: '/services' },
    { en: 'Event Decoration', am: 'የዝግጅት ጌጣጌጥ', href: '/services' },
  ]

  const socials = c.socialLinks?.length
    ? c.socialLinks
    : [
        { platform: 'Instagram', url: 'https://www.instagram.com/enkutatashevents/' },
        { platform: 'Facebook', url: 'https://web.facebook.com/profile.php?id=61590503624575' },
        { platform: 'YouTube', url: 'https://www.youtube.com/@Enkutatashevents' },
      ]

  const headingClass =
    'text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300/80 mb-4'
  const linkRow =
    'group inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors duration-200 py-1'

  return (
    <footer
      aria-label="Site footer"
      className="relative overflow-hidden text-zinc-300 bg-[#04150f]"
    >
      {/* canvas: emerald wash + glow blobs + flower watermark */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#07231a_0%,#04150f_45%,#030d09_100%)]" aria-hidden="true" />
      <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden="true" />
      <div className="absolute top-1/3 -right-20 h-64 w-64 rounded-full bg-amber-400/[0.05] blur-3xl" aria-hidden="true" />
      <FlowerMotif className="pointer-events-none absolute -bottom-20 -right-16 h-[380px] w-[380px] rotate-12 text-amber-200/[0.04] sm:h-[460px] sm:w-[460px]" />
      {/* brand hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── CTA band ── */}
        <div className="py-10 sm:py-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-amber-300/80 mb-2">
              {c.businessNameAmharic} · Enkutatash Events
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              {t("Let's plan your next unforgettable event.", 'ቀጣዩን የማይረሳ ዝግጅትዎን እናቅድ።')}
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              {t(
                'Weddings, corporate gatherings, concerts and cultural celebrations — crafted end to end.',
                'ሠርጎች፣ የድርጅት ስብሰባዎች፣ ኮንሰርቶችና ባህላዊ በዓላት — ከመጀመሪያ እስከ መጨረሻ እናዘጋጃለን።'
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={hash('contact')}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-[#03130d] transition-colors duration-200 hover:bg-emerald-400"
            >
              {t('Book an Event', 'ዝግጅት ያስይዙ')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`tel:${c.phoneLinks?.[2] || c.phoneLinks?.[0] || c.phones?.[0]}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {t('Call Us Now', 'አሁን ይደውሉልን')}
            </a>
          </div>
        </div>

        {/* ── main grid ── */}
        <div className="border-t border-white/5 py-10 sm:py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* brand */}
          <div className="lg:col-span-5 max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3" aria-label={`${c.businessName} — home`}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#12503B] to-[#062A1F] ring-1 ring-emerald-400/25">
                <Image
                  src="/enkutatash-logo.png"
                  alt={`${c.businessName} logo`}
                  width={44}
                  height={44}
                  unoptimized
                  className="h-10 w-10 object-contain"
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-white">{c.businessName}</span>
                <span className="text-xs text-amber-300/80">{c.businessNameAmharic}</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              {t(c.description, c.descriptionAmharic || c.description)}
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              {socials.map((s) => {
                const Icon = socialIconFor(s.platform)
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all duration-200 hover:border-emerald-400/50 hover:bg-emerald-500 hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* explore */}
          <nav aria-label={t('Footer', 'ግርጌ')} className="lg:col-span-2">
            <h3 className={headingClass}>{t('Explore', 'ያስሱ')}</h3>
            <ul className="space-y-1">
              {exploreLinks.map((item) => (
                <li key={item.en}>
                  <Link href={item.href} className={linkRow}>
                    <ChevronRight
                      className="h-3 w-3 text-emerald-400 opacity-0 -ml-4 transition-all duration-200 group-hover:opacity-100 group-hover:ml-0"
                      aria-hidden="true"
                    />
                    {t(item.en, item.am)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* what we do */}
          <nav aria-label={t('Services', 'አገልግሎቶች')} className="lg:col-span-2">
            <h3 className={headingClass}>{t('What we do', 'የምንሰራው')}</h3>
            <ul className="space-y-1">
              {serviceLinks.map((item) => (
                <li key={item.en}>
                  <Link href={item.href} className={linkRow}>
                    <ChevronRight
                      className="h-3 w-3 text-emerald-400 opacity-0 -ml-4 transition-all duration-200 group-hover:opacity-100 group-hover:ml-0"
                      aria-hidden="true"
                    />
                    {t(item.en, item.am)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          <div className="lg:col-span-3">
            <h3 className={headingClass}>{t('Visit us', 'ያግኙን')}</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://www.google.com/maps?q=9.020682,38.868906"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 text-zinc-400 hover:text-white transition-colors"
                >
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  <span>
                    {t(c.address || defaultContent.address!, c.addressAmharic || defaultContent.addressAmharic!)}
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span className="flex flex-col gap-0.5">
                  {(c.phones || []).slice(0, 3).map((p, i) => (
                    <a
                      key={p}
                      href={`tel:${c.phoneLinks?.[i] || p.replace(/\s/g, '')}`}
                      className="text-zinc-400 hover:text-white transition-colors"
                    >
                      {p}
                    </a>
                  ))}
                </span>
              </li>
              <li>
                <a
                  href={`mailto:${c.email}`}
                  className="flex items-start gap-2.5 text-zinc-400 hover:text-white transition-colors break-all"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  {c.email}
                </a>
              </li>
              {c.workingHours && c.workingHours.length > 0 && (
                <li className="flex items-start gap-2.5">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  <span className="flex flex-col gap-0.5 text-zinc-500">
                    {c.workingHours.slice(0, 3).map((h) => (
                      <span key={h.day}>
                        <span className="text-zinc-400">{h.day}</span> · {h.hours}
                      </span>
                    ))}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ── bottom bar ── */}
        <div className="border-t border-white/5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500 text-center sm:text-left">
            &copy; {year} {c.businessName} <span className="text-zinc-600">·</span> {c.businessNameAmharic}.{' '}
            {t('All rights reserved.', 'መብቱ በህግ የተጠበቀ ነው።')}
          </p>

          <div className="flex items-center gap-4 sm:gap-5 text-xs">
            <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">
              {t('Privacy', 'ፖሊሲ')}
            </Link>
            <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">
              {t('Terms', 'ውሎች')}
            </Link>
            <button
              onClick={() => window.dispatchEvent(new Event('show-cookie-consent'))}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              {t('Cookies', 'ኩኪዎች')}
            </button>
            <span className="hidden md:inline text-zinc-600">{t('Proudly based in Ayat, Addis Ababa.', 'በኩራት በአያት፣ አዲስ አበባ የተመሠረት።')}</span>
            <button
              onClick={scrollToTop}
              aria-label={t('Back to top', 'ወደ ላይ ተመለስ')}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors duration-200 hover:border-emerald-400/60 hover:bg-emerald-500 hover:text-white"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
