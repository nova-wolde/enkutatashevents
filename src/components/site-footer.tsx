'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  ArrowRight,
  ArrowUp,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Send,
  MessageCircle,
  Music,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { services } from '@/lib/services-data'

// ─── Footer content shape (loose — accepts homepage SiteContent or defaults) ──
export interface FooterContent {
  businessName: string
  businessNameAmharic: string
  description: string
  descriptionAmharic: string
  email: string
  phones: string[]
  phoneLinks: string[]
  address: string
  addressAmharic: string
  workingHours: { day: string; hours: string }[]
  socialLinks: { platform: string; url: string }[]
}

const defaultContent: FooterContent = {
  businessName: 'Enkutatash Events',
  businessNameAmharic: 'እንቁጣጣሽ ኤቨንት',
  description:
    "Addis Ababa's premier event organizer. Crafting legendary experiences since 2022.",
  descriptionAmharic: 'ከ2022 ዓ.ም ጀምሮ ያልተረሳ ትዝታዎችን እያደራጅን',
  email: 'enkutatashevents@gmail.com',
  phones: ['+251 915 895 757', '+251 915 843 131', '+251 910 977 371'],
  phoneLinks: ['+251915895757', '+251915843131', '+251910977371'],
  address: 'Ayat, Addis Ababa',
  addressAmharic: 'አያት፣ አዲስ አበባ',
  workingHours: [
    { day: 'Mon - Fri', hours: '8:00 AM - 6:00 PM' },
    { day: 'Sat', hours: '9:00 AM - 2:00 PM' },
  ],
  socialLinks: [
    { platform: 'Instagram', url: 'https://www.instagram.com/enkutatashevents/' },
    { platform: 'Facebook', url: 'https://web.facebook.com/profile.php?id=61590503624575' },
    { platform: 'YouTube', url: 'https://www.youtube.com/@Enkutatashevents' },
    { platform: 'Telegram', url: 'https://t.me/httpenkutatashevent' },
    { platform: 'WhatsApp', url: 'https://whatsapp.com/channel/0029VbDBLNS6WaKf4RGzel3r' },
  ],
}

const socialIconMap: Record<string, React.ElementType> = {
  Instagram,
  Facebook,
  Youtube,
  Telegram: Send,
  WhatsApp: MessageCircle,
  TikTok: Music,
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

// ─── Small building blocks ────────────────────────────────────────────────────
function FooterColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400/90 mb-4 sm:mb-5">
      {children}
    </h3>
  )
}

function FooterLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  const cls = 'group inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors duration-200 py-1'
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        <span className="h-px w-0 bg-emerald-400 transition-all duration-300 group-hover:w-3" aria-hidden="true" />
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      <span className="h-px w-0 bg-emerald-400 transition-all duration-300 group-hover:w-3" aria-hidden="true" />
      {children}
    </Link>
  )
}

// ─── Site-wide footer ─────────────────────────────────────────────────────────
export function SiteFooter({ content }: { content?: Partial<FooterContent> }) {
  const c = useMemo<FooterContent>(() => ({ ...defaultContent, ...content }), [content])
  const { t } = useFooterLanguage()
  const pathname = usePathname()
  const isHome = pathname === '/'

  const year = new Date().getFullYear()
  const hash = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  const exploreLinks = [
    { en: 'About Us', am: 'ስለ እኛ', href: hash('about') },
    { en: 'Services', am: 'አገልግሎቶች', href: '/services' },
    { en: 'Locations', am: 'አካባቢዎች', href: '/locations' },
    { en: 'Portfolio', am: 'ስራዎቻችን', href: hash('portfolio') },
    { en: 'Testimonials', am: 'ደንበኞቻችን', href: hash('testimonials') },
    { en: 'Blog', am: 'ብሎግ', href: '/blog' },
    { en: 'Contact', am: 'ያግኙን', href: hash('contact') },
  ]

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer
      aria-label="Site footer"
      className="relative bg-zinc-950 text-zinc-300 overflow-hidden"
    >
      {/* Brand hairline + ambient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-500/60 via-amber-400/40 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(ellipse_50%_100%_at_50%_100%,rgba(16,185,129,0.10),transparent_70%)]" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── CTA band ── */}
        <div className="pt-10 sm:pt-14">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/60 via-zinc-900/60 to-zinc-900/30 p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -top-20 -right-10 h-44 w-44 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 -left-10 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl" aria-hidden="true" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <p className="text-emerald-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] mb-2">
                  {t('Get started today', 'ዛሬ ይጀምሩ')}
                </p>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
                  {t('Ready to create an unforgettable event?', 'ያልተረሳ ዝግጅት ለመፍጠር ተዘጋጅተዋል?')}
                </h2>
                <p className="mt-2 text-sm text-zinc-400 max-w-xl">
                  {t(
                    'Tell us your vision — we handle planning, decoration, sound, catering and everything in between.',
                    'ራዕይዎን ይንገሩን — ማቀድ፣ ማስጌጣት፣ ድምፅ፣ ምግብ እና ቀሪዎቹን ሁሉ እኛ እንወስዳለን።'
                  )}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">
                <Link
                  href={hash('contact')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 min-h-[48px] text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all duration-200 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                >
                  {t('Book an Event', 'ዝግጅት ያስይዙ')}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href={`tel:${c.phoneLinks[2] || c.phoneLinks[0] || '+251910977371'}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 hover:border-emerald-400/50 bg-white/5 hover:bg-white/10 px-6 min-h-[48px] text-sm font-semibold text-white transition-colors duration-200"
                >
                  <Phone className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  {t('Call Now', 'አሁኑኑ ይደውሉ')}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main columns ── */}
        <nav aria-label="Footer" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8 py-12 sm:py-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4" aria-label={`${c.businessName} — home`}>
              <Image
                src="/enkutatash-logo.png"
                alt={`${c.businessName} logo`}
                width={40}
                height={40}
                unoptimized
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-contain"
              />
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-bold text-white">{c.businessName}</span>
                <span className="text-[10px] text-zinc-500">{c.businessNameAmharic}</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-xs mb-5">
              {t(c.description, c.descriptionAmharic || c.description)}
            </p>
            <div className="flex flex-wrap gap-2" aria-label={t('Social media', 'ማህበራዊ ሚዲያ')}>
              {(c.socialLinks || [])
                .filter((s) => s.url)
                .map((social, i) => {
                  const Icon = socialIconMap[social.platform] || Instagram
                  return (
                    <a
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${c.businessName} on ${social.platform}`}
                      className="inline-flex h-10 w-10 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all duration-200 hover:border-emerald-500/60 hover:bg-emerald-600 hover:text-white hover:-translate-y-0.5"
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )
                })}
            </div>
          </div>

          {/* Explore */}
          <div>
            <FooterColumnTitle>{t('Explore', 'ያስሱ')}</FooterColumnTitle>
            <ul className="space-y-1">
              {exploreLinks.map((item) => (
                <li key={item.en}>
                  <FooterLink href={item.href} external={item.href.startsWith('http')}>
                    {t(item.en, item.am)}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <FooterColumnTitle>{t('Our Services', 'አገልግሎቶቻችን')}</FooterColumnTitle>
            <ul className="space-y-1">
              {services.map((service) => (
                <li key={service.id}>
                  <FooterLink href={`/${service.slug}`}>
                    {t(service.title, service.titleAmharic || service.title)}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <FooterColumnTitle>{t('Contact Us', 'ያግኙን')}</FooterColumnTitle>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="space-y-0.5">
                  {(c.phones || []).slice(0, 3).map((phone, i) => (
                    <a
                      key={i}
                      href={`tel:${c.phoneLinks?.[i] || phone}`}
                      className="block text-zinc-400 hover:text-white transition-colors py-0.5"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <a href={`mailto:${c.email}`} className="text-zinc-400 hover:text-white transition-colors break-all py-0.5">
                  {c.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <span className="text-zinc-400">
                  {t(c.address, c.addressAmharic || c.address)}
                  <span className="block text-zinc-500">Ethiopia</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" aria-hidden="true" />
                <div className="text-zinc-400 space-y-0.5">
                  {(c.workingHours || []).map((wh, i) => (
                    <p key={i} className="tabular-nums">
                      <span className="text-zinc-500">{wh.day}:</span> {wh.hours}
                    </p>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </nav>

        {/* ── Bottom bar ── */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-zinc-500 text-center md:text-left">
            &copy; {year} {c.businessName} <span className="text-zinc-600">·</span> {c.businessNameAmharic}. {t('All rights reserved.', 'መብቱ በህግ የተጠበቀ ነው።')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs sm:text-sm">
            <Link href="/privacy" className="text-zinc-500 hover:text-white transition-colors">
              {t('Privacy Policy', 'የግላዊነት ፖሊሲ')}
            </Link>
            <Link href="/terms" className="text-zinc-500 hover:text-white transition-colors">
              {t('Terms of Service', 'የአገልግሎት ውሎች')}
            </Link>
            <button
              onClick={() => window.dispatchEvent(new Event('show-cookie-consent'))}
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              {t('Cookie Settings', 'የኩኪ ቅንብሮች')}
            </button>
            <button
              onClick={scrollToTop}
              aria-label={t('Back to top', 'ወደ ላይ ተመለስ')}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-all duration-200 hover:border-emerald-500/60 hover:bg-emerald-600 hover:text-white"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
