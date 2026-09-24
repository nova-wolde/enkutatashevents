'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
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

// ─── Simple site-wide footer ─────────────────────────────────────────────────
export function SiteFooter({ content }: { content?: Partial<FooterContent> }) {
  const c = useMemo<FooterContent>(() => ({ ...defaultContent, ...content }), [content])
  const { t } = useFooterLanguage()
  const pathname = usePathname()
  const isHome = pathname === '/'

  const year = new Date().getFullYear()
  const hash = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  const links = [
    { en: 'About Us', am: 'ስለ እኛ', href: hash('about') },
    { en: 'Services', am: 'አገልግሎቶች', href: '/services' },
    { en: 'Locations', am: 'አካባቢዎች', href: '/locations' },
    { en: 'Blog', am: 'ብሎግ', href: '/blog' },
    { en: 'Contact', am: 'ያግኙን', href: hash('contact') },
  ]

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer
      aria-label="Site footer"
      className="relative bg-zinc-950 text-zinc-300 overflow-hidden"
    >
      {/* Brand hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-500/60 via-amber-400/40 to-transparent" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand + links */}
        <div className="py-10 sm:py-12 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3" aria-label={`${c.businessName} — home`}>
              <Image
                src="/enkutatash-logo.png"
                alt={`${c.businessName} logo`}
                width={36}
                height={36}
                unoptimized
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl object-contain"
              />
              <span className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg font-bold text-white">{c.businessName}</span>
                <span className="text-[10px] text-zinc-500">{c.businessNameAmharic}</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500">
              {t(c.description, c.descriptionAmharic || c.description)}
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-12 gap-y-2.5 sm:gap-x-16 md:text-right shrink-0">
            {links.map((item) => (
              <Link
                key={item.en}
                href={item.href}
                className="text-sm text-zinc-400 hover:text-white transition-colors py-0.5"
              >
                {t(item.en, item.am)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Address + office number + email (only lifeline on subpages) */}
        <div className="pb-8 flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm text-zinc-500">
          <a
            href="https://www.google.com/maps?q=9.020682,38.868906"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <MapPin className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            {t(c.address || 'Ayat Mall, 1st Floor, Office No. E1F-19, Ayat, Addis Ababa', c.addressAmharic || 'አያት ሞል፣ 1ኛ ፎቅ፣ ቢሮ ቁጥር E1F-19፣ አያት፣ አዲስ አበባ')}
          </a>
          <a
            href={`tel:${c.phoneLinks?.[2] || c.phoneLinks?.[0] || c.phones?.[0]}`}
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            {c.phones?.[2] || c.phones?.[0]}
          </a>
          <a href={`mailto:${c.email}`} className="inline-flex items-center gap-2 hover:text-white transition-colors break-all">
            <Mail className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            {c.email}
          </a>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-500 text-center sm:text-left">
            &copy; {year} {c.businessName} <span className="text-zinc-600">·</span> {c.businessNameAmharic}. {t('All rights reserved.', 'መብቱ በህግ የተጠበቀ ነው።')}
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
            <button
              onClick={scrollToTop}
              aria-label={t('Back to top', 'ወደ ላይ ተመለስ')}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors duration-200 hover:border-emerald-500/60 hover:bg-emerald-600 hover:text-white"
            >
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
