'use client'

import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  CalendarDays,
  Users,
  MapPin,
  ArrowRight,
  Star,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Moon,
  Sun,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Youtube,
  Send,
  MessageCircle,
  Clock,
  Award,
  CheckCircle2,
  Quote,
  Megaphone,
  PartyPopper,
  Palette,
  Tent,
  Speaker,
  Armchair,
  UtensilsCrossed,
  Gamepad2,
  Eye,
  Target,
  TrendingUp,
  Handshake,
  Lightbulb,
  Shield,
  BarChart3,
  Rocket,
  Heart,
  Loader2,
  Globe,
  Pause,
  Play,
  Music,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEventStore } from './store'
import { BookingDialog } from './booking-dialog'
import { hardcodedSiteContent } from './hardcoded-data'

// ─── Icon Lookup ──────────────────────────────────────────────────────────────
const iconLookup: Record<string, React.ElementType> = {
  Megaphone, PartyPopper, Palette, Tent, Speaker, Armchair,
  UtensilsCrossed, Gamepad2, CalendarDays, Users, Award, Star,
  Heart, Sparkles, Shield, TrendingUp, Eye, Target,
  CheckCircle2, Handshake, Lightbulb, Rocket, BarChart3,
}

function getIcon(name: string): React.ElementType {
  return iconLookup[name] || Sparkles
}

// ─── Language Context ────────────────────────────────────────────────────────
type Language = 'en' | 'am'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (en: string, am: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (en) => en,
})

function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('enkutatash-language')
      if (saved === 'am' || saved === 'en') return saved
    }
    return 'en'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('enkutatash-language', lang)
  }

  const t = (en: string, am: string) => language === 'am' ? (am || en) : en

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

function useLanguage() {
  return useContext(LanguageContext)
}

// ─── Content Type ─────────────────────────────────────────────────────────────
interface SiteContent {
  businessName: string
  businessNameAmharic: string
  tagline: string
  heroTitle: string
  heroTitleAmharic: string
  heroSubtitle: string
  heroSubtitleAmharic: string
  heroBadge: string
  aboutTitle: string
  aboutSubtitle: string
  aboutDescription: string
  aboutHighlights: string[]
  vision: string
  visionAmharic: string
  mission: string
  missionAmharic: string
  goals: { icon: string; title: string; titleAmharic: string; gradient: string }[]
  objectives: { icon: string; title: string; description: string }[]
  stats: { value: string; label: string; labelAmharic: string; icon: string }[]
  services: { id: string; title: string; titleAmharic: string; description: string; descriptionAmharic: string; icon: string; gradient: string; bgGlow: string }[]
  testimonials: { id: string; name: string; nameAmharic: string; role: string; roleAmharic: string; avatar: string; quote: string; quoteAmharic: string; rating: number; event: string }[]
  portfolioEvents: { id: string; title: string; titleAmharic: string; category: string; attendees: string; image: string; description: string; descriptionAmharic: string; gradient: string }[]
  email: string
  phones: string[]
  phoneLinks: string[]
  address: string
  workingHours: { day: string; hours: string }[]
  socialLinks: { platform: string; url: string }[]
  venues: string[]
  teamMembers: { id: string; name: string; role: string; avatar: string; gradient: string; bio: string }[]
  eventCategories: string[]
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function LandingNavbar({ content }: { content: SiteContent }) {
  const { setAppView, setBookingDialogOpen } = useEventStore()
  const { setTheme, theme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <Image src="/enkutatash-logo.png" alt="Enkutatash Logo" width={40} height={40} unoptimized className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-lg sm:text-xl font-bold tracking-tight">{content.businessName}</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground leading-none hidden xs:block">
                {content.businessNameAmharic}
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('About', 'ስለ እኛ')}</a>
            <a href="#vision" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Vision', 'ራዕይ')}</a>
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Services', 'አገልግሎቶች')}</a>
            <a href="#portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Portfolio', 'ስራዎቻችን')}</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('Contact', 'ያግኙን')}</a>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}>
              <Globe className="h-4 w-4" />
              <span className="absolute -bottom-0.5 -right-0.5 text-[7px] font-bold leading-none">{language === 'en' ? 'EN' : 'አማ'}</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" onClick={() => setAppView('login')} className="text-sm">{t('Owner Login', 'ባለቤት መግቢያ')}</Button>
            <Button onClick={() => setBookingDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20">
              {t('Book an Event', 'ዝግጅት ያስይዙ')} <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>

          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}>
              <Globe className="h-4 w-4" />
              <span className="absolute -bottom-0.5 -right-0.5 text-[7px] font-bold leading-none">{language === 'en' ? 'EN' : 'አማ'}</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {[{ en: 'About', am: 'ስለ እኛ', href: 'about' }, { en: 'Vision', am: 'ራዕይ', href: 'vision' }, { en: 'Services', am: 'አገልግሎቶች', href: 'services' }, { en: 'Portfolio', am: 'ስራዎቻችን', href: 'portfolio' }, { en: 'Contact', am: 'ያግኙን', href: 'contact' }].map((item) => (
                <a key={item.en} href={`#${item.href}`} className="block text-sm text-muted-foreground hover:text-foreground py-2.5 min-h-[44px] flex items-center" onClick={() => setMobileOpen(false)}>
                  {t(item.en, item.am)}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Button variant="outline" onClick={() => { setAppView('login'); setMobileOpen(false) }} className="w-full min-h-[44px]">{t('Owner Login', 'ባለቤት መግቢያ')}</Button>
                <Button onClick={() => { setMobileOpen(false); setBookingDialogOpen(true) }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white min-h-[44px]">
                  {t('Book an Event', 'ዝግጅት ያስይዙ')} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function HeroSection({ content }: { content: SiteContent }) {
  const { setBookingDialogOpen } = useEventStore()
  const { language, t } = useLanguage()
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-44 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 h-48 sm:h-72 w-48 sm:w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-48 sm:h-72 w-48 sm:w-72 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 sm:h-96 w-64 sm:w-96 rounded-full bg-teal-500/3 blur-3xl" />
      </div>
      <div className="absolute inset-0 -z-10 opacity-[0.015]">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: `radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0)`, backgroundSize: '50px 50px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 text-[11px] sm:text-sm font-medium border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 flex-wrap justify-center">
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
              <span>{content.heroBadge}</span>
              <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1" />
            </Badge>
          </motion.div>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }} className="text-base sm:text-lg md:text-xl text-emerald-600 dark:text-emerald-400 font-medium mb-2">
            {language === 'am' ? content.heroTitleAmharic : content.heroTitle}
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            {(language === 'am' ? (content.heroTitleAmharic || content.heroTitle) : content.heroTitle).split(' ').map((word, i, arr) => 
              i >= arr.length - 1 ? (
                <span key={i} className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 bg-clip-text text-transparent"> {word}</span>
              ) : (
                <span key={i}>{i > 0 ? ' ' : ''}{word}</span>
              )
            )}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="mt-3 sm:mt-6 text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            {language === 'am' ? (content.heroSubtitleAmharic || content.heroSubtitle) : content.heroSubtitle}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Button size="lg" onClick={() => setBookingDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 px-5 sm:px-8 h-12 sm:h-12 text-sm sm:text-base w-full sm:w-auto min-h-[44px]">
              {t('Book Your Event', 'ዝግጅትዎን ያስይዙ')} <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
            {content.phoneLinks && content.phoneLinks[0] && (
              <a href={`tel:${content.phoneLinks[0]}`} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="px-5 sm:px-8 h-12 sm:h-12 text-sm sm:text-base group w-full min-h-[44px]">
                  <Phone className="mr-2 h-4 w-4 group-hover:text-emerald-600 transition-colors" /> {t('Call Us Now', 'አሁን ይደውሉ')}
                </Button>
              </a>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 sm:mt-12 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {['SM', 'DA', 'HT', 'YK', 'AB'].map((initials, i) => (
                <div key={initials} className="h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: ['linear-gradient(135deg, #10b981, #0d9488)', 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 'linear-gradient(135deg, #f59e0b, #d97706)', 'linear-gradient(135deg, #ec4899, #db2777)', 'linear-gradient(135deg, #06b6d4, #0891b2)'][i] }}>
                  {initials}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (<Star key={s} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {t('Trusted by', 'የሚያምኑት በ')} <span className="font-semibold text-foreground">{content.stats[0]?.value || '500+'}</span> {t('happy clients', 'እርካታ ደንበኞች')}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Hero Showcase */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="mt-8 sm:mt-16 md:mt-20 relative">
          <div className="relative rounded-xl sm:rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl shadow-emerald-500/5 overflow-hidden">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400/80" />
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400/80" />
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="flex-1 text-center"><span className="text-[10px] sm:text-xs text-muted-foreground">enkutatashevents.com</span></div>
            </div>
            <div className="p-2 sm:p-6 md:p-8 bg-gradient-to-br from-muted/20 to-muted/5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-6">
                {content.portfolioEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-[4/3] flex flex-col justify-end">
                    <Image src={event.image} alt={event.title} fill unoptimized className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-2.5 sm:p-3 md:p-4">
                      <Badge className="w-fit text-[9px] sm:text-[10px] bg-white/20 text-white border-0 mb-1 sm:mb-2 backdrop-blur-sm">{event.category}</Badge>
                      <p className="text-xs sm:text-sm font-bold leading-tight text-white">{event.title}</p>
                      <p className="text-[10px] sm:text-sm text-white/80 mt-0.5 sm:mt-1">{event.attendees} {t('guests', 'እንግዶች')}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-3">
                {content.stats.map((stat) => {
                  const Icon = getIcon(stat.icon)
                  return (
                    <div key={stat.label} className="rounded-lg sm:rounded-xl bg-background/60 border border-border/30 p-2 sm:p-3 md:p-4 flex items-center gap-2 sm:gap-3">
                      <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-md sm:rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm md:text-lg font-bold">{stat.value}</p>
                        <p className="text-[7px] sm:text-[9px] md:text-xs text-muted-foreground truncate">{stat.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-amber-500/5 blur-2xl" />
        </motion.div>
      </div>
    </section>
  )
}

function StatsSection({ content }: { content: SiteContent }) {
  const { language, t } = useLanguage()
  return (
    <section className="py-8 sm:py-16 border-y border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {content.stats.map((stat) => {
            const Icon = getIcon(stat.icon)
            return (
              <motion.div key={stat.label} variants={staggerItem} className="text-center">
                <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-2 sm:mb-3">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-[11px] sm:text-sm text-muted-foreground mt-1">{language === 'am' && stat.labelAmharic ? stat.labelAmharic : stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function AboutSection({ content }: { content: SiteContent }) {
  const { language, t } = useLanguage()
  return (
    <section id="about" className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }} className="relative">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <div className="col-span-2 relative rounded-lg sm:rounded-xl overflow-hidden aspect-[16/9]">
                <Image src="/events/event-2.jpg" alt="Wedding Reception" fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-square">
                <Image src="/events/event-5.jpg" alt="Cultural Festival" fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-square">
                <Image src="/events/event-4.jpg" alt="Live Concert" fill unoptimized className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
            <div className="absolute -bottom-3 -right-1 sm:-bottom-4 sm:-right-3 bg-background/90 border border-border/50 rounded-full shadow-lg px-3 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm z-10 flex items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-[10px] sm:text-xs font-bold">4+ Yrs</span>
              </div>
              <div className="w-px h-3 bg-border/50" />
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-[10px] sm:text-xs font-bold">500+ Events</span>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-2 sm:mb-3 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-xs">
              {t('About Us', 'ስለ እኛ')}
            </Badge>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
              {(language === 'am' ? content.aboutSubtitle : content.aboutTitle).split(' ').map((word, i, arr) => 
                i >= arr.length - 2 ? <span key={i} className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> {word}</span> : <span key={i}>{i > 0 ? ' ' : ''}{word}</span>
              )}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 font-medium">{language === 'am' ? content.aboutTitle : content.aboutSubtitle}</p>
            <p className="mt-2 sm:mt-3 text-muted-foreground text-xs sm:text-sm leading-relaxed">{content.aboutDescription}</p>
            <div className="mt-3 sm:mt-4 flex flex-wrap gap-x-4 gap-y-1.5 sm:gap-y-2">
              {content.aboutHighlights.map((label) => (
                <div key={label} className="flex items-center gap-1 sm:gap-1.5">
                  <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
            <Button size="sm" className="mt-3 sm:mt-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('Get in Touch', 'ያግኙን')} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function VisionMissionSection({ content }: { content: SiteContent }) {
  const { language, t } = useLanguage()
  return (
    <section id="vision" className="py-8 sm:py-14 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.4 }} className="text-center max-w-xl mx-auto mb-6 sm:mb-10">
          <Badge variant="secondary" className="mb-2 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-[10px] sm:text-xs">{t('Vision & Mission', 'ራዕይና ተልዕኮ')}</Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            {t('Driven by Purpose,', 'በዓላማ የሚመራፁ')} <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t('Defined by Excellence', 'በልቅናት የተገለጹ')}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-10">
          <motion.div initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.4 }}>
            <Card className="h-full rounded-xl border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-background to-teal-500/5 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold">{t('Our Vision', 'ራዕያችን')}</h3>
                    <p className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">{language === 'am' ? content.visionAmharic : t('Our Vision', 'ራዕያችን')}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{language === 'am' ? (content.visionAmharic || content.vision) : content.vision}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.4 }}>
            <Card className="h-full rounded-xl border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-background to-orange-500/5 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold">{t('Our Mission', 'ተልዕኳችን')}</h3>
                    <p className="text-[9px] sm:text-[10px] text-amber-600 dark:text-amber-400 font-medium">{language === 'am' ? content.missionAmharic : t('Our Mission', 'ተልዕኳችን')}</p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{language === 'am' ? (content.missionAmharic || content.mission) : content.mission}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Goals */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.4 }} className="mb-6 sm:mb-10">
          <div className="flex items-center justify-center gap-1.5 mb-3 sm:mb-4">
            <Badge variant="secondary" className="border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400 text-[10px] sm:text-xs">{t('Goals', 'ግቦቻችን')}</Badge>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {content.goals.map((goal) => {
              const Icon = getIcon(goal.icon)
              return (
                <div key={goal.title} className="flex items-center gap-1.5 sm:gap-2 bg-background border border-border/50 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-gradient-to-br ${goal.gradient} flex items-center justify-center`}>
                    <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium">{language === 'am' && goal.titleAmharic ? goal.titleAmharic : goal.title}</span>
                  {goal.titleAmharic && <span className="text-[8px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-medium hidden sm:inline">({language === 'am' ? goal.title : goal.titleAmharic})</span>}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Objectives */}
        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.4 }} className="mb-2">
          <div className="flex items-center justify-center gap-1.5 mb-3 sm:mb-4">
            <Badge variant="secondary" className="border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-violet-400 text-[10px] sm:text-xs">{t('Objectives', 'የስራ ዓላማዎች')}</Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {content.objectives.map((objective) => {
              const Icon = getIcon(objective.icon)
              return (
                <div key={objective.title} className="group flex items-start gap-1.5 sm:gap-2 bg-background border border-border/50 rounded-lg p-2 sm:p-2.5 shadow-sm hover:shadow-md hover:border-violet-500/20 transition-all">
                  <div className="shrink-0 h-6 w-6 sm:h-7 sm:w-7 rounded-md bg-violet-500/10 flex items-center justify-center">
                    <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[10px] sm:text-xs font-semibold group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-tight">{objective.title}</h4>
                    <p className="text-[8px] sm:text-[10px] text-muted-foreground leading-relaxed mt-0.5 hidden sm:block">{objective.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ServicesSection({ content }: { content: SiteContent }) {
  const { language, t } = useLanguage()
  return (
    <section id="services" className="py-12 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }} className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">{t('Our Services', 'አገልግሎቶቻችን')}</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            {t('Whatever the occasion,', 'ምንም ዓይነት ዝግጅት ቢሆን፣')} <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t('we make it extraordinary', 'ልዩ እናደርገዋለን')}</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg">{t('From intimate gatherings to grand spectacles, our team delivers world-class event experiences tailored to your vision.', 'ከትንሽ ስብሰባ እስከ ታላላቅ ዝግጅቶች፣ ቡድናችን ለራስዎ ራዕይ የተስተካከለ የዓለም አቀፍ ልምድ ያቀርባል።')}</p>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {content.services.map((service) => {
            const Icon = getIcon(service.icon)
            return (
              <motion.div key={service.id} variants={staggerItem} whileHover={{ y: -4 }} className="group">
                <Card className="h-full rounded-xl sm:rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-emerald-500/20">
                  <CardContent className="p-4 sm:p-6">
                    <div className={`inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl ${service.bgGlow} mb-3 sm:mb-4`}>
                      <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{language === 'am' && service.titleAmharic ? service.titleAmharic : service.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{language === 'am' && service.descriptionAmharic ? service.descriptionAmharic : service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function PortfolioSection({ content }: { content: SiteContent }) {
  const { language, t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<typeof content.portfolioEvents[0] | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const categories = ['All', ...Array.from(new Set(content.portfolioEvents.map(e => e.category)))]
  const filteredEvents = activeCategory === 'All' ? content.portfolioEvents : content.portfolioEvents.filter(e => e.category === activeCategory)

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) el.addEventListener('scroll', checkScroll, { passive: true })
    return () => { if (el) el.removeEventListener('scroll', checkScroll) }
  }, [checkScroll, activeCategory, filteredEvents.length])

  useEffect(() => {
    if (!isAutoPlaying || !scrollRef.current) return
    const interval = setInterval(() => {
      if (!scrollRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' })
      }
    }, 3500)
    return () => clearInterval(interval)
  }, [isAutoPlaying, activeCategory])

  const scrollByAmount = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: direction === 'left' ? -340 : 340, behavior: 'smooth' })
  }

  return (
    <section id="portfolio" className="py-12 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }} className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">{t('Our Portfolio', 'የተሰሩ ስራዎች')}</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            {t('Events that', 'ዝግጅቶች የራሳቸውን')} <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t('speak for themselves', 'ድምጽ ይሰማሉ')}</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg">{t('A glimpse into some of our most memorable events — each one a unique story of creativity and flawless execution.', 'ከታሪካችን ውስጥ ካሉ አንዳንድ ማስታወሻ ዝግጅቶቻችን — እያንዳንዱ የፈጠራና የስኬት ልዩ ታሪክ ነው።')}</p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-sm font-medium transition-all border min-h-[36px] ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                  : 'bg-background border-border/50 text-muted-foreground hover:border-emerald-500/30 hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Horizontal Slider */}
        <div className="relative group/slider">
          {/* Left Arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scrollByAmount('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/90 border border-border/50 shadow-lg flex items-center justify-center hover:bg-background transition-all opacity-0 group-hover/slider:opacity-100 backdrop-blur-sm min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {/* Right Arrow */}
          {canScrollRight && (
            <button
              onClick={() => scrollByAmount('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/90 border border-border/50 shadow-lg flex items-center justify-center hover:bg-background transition-all opacity-0 group-hover/slider:opacity-100 backdrop-blur-sm min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2"
            style={{ scrollSnapType: 'x mandatory' }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            onTouchStart={() => setIsAutoPlaying(false)}
            onTouchEnd={() => setTimeout(() => setIsAutoPlaying(true), 3000)}
          >
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4 }}
                className="shrink-0 w-[280px] sm:w-[320px] md:w-[360px] snap-start group cursor-pointer"
                onClick={() => { setSelectedImage(event.image); setSelectedEvent(event) }}
              >
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[4/3]">
                  <Image src={event.image} alt={event.title} fill unoptimized className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <Badge className="w-fit text-[9px] sm:text-[10px] bg-white/20 text-white border-0 mb-1 sm:mb-2 backdrop-blur-sm">{event.category}</Badge>
                    <h3 className="text-sm sm:text-base font-bold text-white leading-tight">{language === 'am' && event.titleAmharic ? event.titleAmharic : event.title}</h3>
                    {event.titleAmharic && <p className="text-[8px] sm:text-[10px] text-white/80 mt-0.5">{language === 'am' ? event.title : event.titleAmharic}</p>}
                    <p className="text-[10px] sm:text-sm text-white/70 mt-1">{event.attendees} {t('guests', 'እንግዶች')}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Auto-play / Pause indicator */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="absolute bottom-4 right-4 z-10 h-8 w-8 rounded-full bg-background/70 border border-border/50 flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity backdrop-blur-sm"
          >
            {isAutoPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Scroll indicator dots */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {t('Scroll to explore', 'ለማሰስ ያሸብልሉ')} — {filteredEvents.length} {t('events', 'ዝግጅቶች')}
          </span>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && selectedEvent && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => { setSelectedImage(null); setSelectedEvent(null) }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative max-w-4xl w-full max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => { setSelectedImage(null); setSelectedEvent(null) }} className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors z-10"><X className="h-6 w-6" /></button>
                <div className="relative rounded-2xl overflow-hidden bg-black">
                  <Image src={selectedImage} alt={selectedEvent.title} width={1200} height={800} unoptimized className="object-contain w-full max-h-[70vh]" />
                </div>
                <div className="mt-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="text-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/30">{selectedEvent.category}</Badge>
                    <span className="text-xs text-white/50">{selectedEvent.attendees} {t('guests', 'እንግዶች')}</span>
                  </div>
                  <h3 className="text-xl font-bold">{language === 'am' && selectedEvent.titleAmharic ? selectedEvent.titleAmharic : selectedEvent.title}</h3>
                  {selectedEvent.titleAmharic && <p className="text-sm text-emerald-400 mt-0.5">{language === 'am' ? selectedEvent.title : selectedEvent.titleAmharic}</p>}
                  <p className="text-sm text-white/70 mt-2">{language === 'am' && selectedEvent.descriptionAmharic ? selectedEvent.descriptionAmharic : selectedEvent.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-8 sm:mt-12">
          <Button size="lg" onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 min-h-[44px]">
            {t('Plan Your Event With Us', 'ዝግጅትዎን ከእኛ ጋር ያቅዱ')} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

function ProcessSection() {
  const { language, t } = useLanguage()
  const steps = [
    { number: '01', title: t('Consultation', 'ምክር'), titleAm: 'ምክር', description: t('We start with a detailed conversation to understand your vision, budget, and expectations. This helps us tailor every detail to your needs.', 'በመጀመሪያ ራዕይዎን፣ በጀትዎን እና ተስፋዎን ለመረዳት ዝርዝር ውይይት እናደርጋለን። ይህ እያንዳንዱን ዝርዝር ለእርስዎ ፍላጎት ለማስተካከል ይረዳል።') },
    { number: '02', title: t('Design & Planning', 'ዲዛይንና እቅድ'), titleAm: 'ዲዛይንና እቅድ', description: t('Our creative team develops a comprehensive plan including mood boards, timelines, vendor selections, and budget breakdowns for your approval.', 'ፈጠራ ቡድናችን ሞድ ቦርድ፣ ጊዜያዊ መስመር፣ አቅራቢ ምርጫ እና በጀት ዝርዝር ያካተተ ሰፊ እቅድ ያዘጋጃል።') },
    { number: '03', title: t('Coordination', 'ቅንብር'), titleAm: 'ቅንብር', description: t('We coordinate with all vendors, manage logistics, and handle every detail behind the scenes so you can focus on what matters most.', 'ከሁሉም አቅራቢዎች ጋር እንተባበራለን፣ ኮንትሮል እናደርጋለን፣ እና እያንዳንዱን ዝርዝር በትክክል እንደቅምቃምለን ስለሚስብዎት ትኩረት ማድረግ ይችላሉ።') },
    { number: '04', title: t('The Big Day', 'ታላቁ ቀን'), titleAm: 'ታላቁ ቀን', description: t('Our team is on-site from setup to teardown, ensuring everything runs flawlessly. You just show up and enjoy your extraordinary event.', 'ቡድናችን ከመጫኛ እስከ መፍታት በቦታው ላይ ነው፣ ሁሉም ነገር በትክክል እንዲሄድ ያረጋግጣል። እርስዎ ብቻ ይገቡ እና ድንቅ ዝግጅትዎን ያስይዙ።') },
  ]
  return (
    <section className="py-12 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }} className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">{t('How It Works', 'እንዴት እንደሚሰራ')}</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{t('Your journey to a', 'ወደሚፈልጉት')} <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t('perfect event', 'ፍጹም ዝግጅት')}</span></h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, i) => (
            <motion.div key={step.number} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <div className="relative">
                <span className="text-5xl sm:text-6xl font-bold bg-gradient-to-b from-emerald-200 to-emerald-500 bg-clip-text text-transparent">{step.number}</span>
                <h3 className="text-lg sm:text-xl font-semibold mt-2">{step.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection({ content }: { content: SiteContent }) {
  const { language, t } = useLanguage()
  return (
    <section id="testimonials" className="py-12 sm:py-20 md:py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }} className="text-center max-w-2xl mx-auto mb-8 sm:mb-16">
          <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">{t('Testimonials', 'ደንበኞቻችን ምን ይላሉ')}</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{t('What our clients', 'ደንበኞቻችን')} <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t('say about us', 'ምን ይላሉ')}</span></h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg">{t("Don't just take our word for it — hear from the people who have experienced the Enkutatash difference.", 'የእኛን ቃል ብቻ አይውሰዱ — የእንቁጣጣሽን ልዩነት ከተሞከሩት ሰዎች ይስሙ።')}</p>
        </motion.div>
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
          {content.testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={staggerItem} whileHover={{ y: -4 }}>
              <Card className="h-full rounded-xl sm:rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (<Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />))}
                    </div>
                    <Badge variant="secondary" className="text-[9px] sm:text-[10px]">{testimonial.event}</Badge>
                  </div>
                  <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500/30 mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6">&ldquo;{language === 'am' && testimonial.quoteAmharic ? testimonial.quoteAmharic : testimonial.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm sm:text-base font-bold shrink-0">{testimonial.avatar}</div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate">{language === 'am' && testimonial.nameAmharic ? testimonial.nameAmharic : testimonial.name}</p>
                      {testimonial.nameAmharic && <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">{language === 'am' ? testimonial.name : testimonial.nameAmharic}</p>}
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{language === 'am' && testimonial.roleAmharic ? testimonial.roleAmharic : testimonial.role}</p>
                      {testimonial.roleAmharic && <p className="text-[9px] sm:text-[10px] text-muted-foreground/70 truncate">{language === 'am' ? testimonial.role : testimonial.roleAmharic}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ContactSection({ content }: { content: SiteContent }) {
  const { setBookingDialogOpen } = useEventStore()
  const { t } = useLanguage()
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', eventType: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setFormState({ name: '', email: '', phone: '', eventType: '', message: '' })
      } else {
        setSubmitError(data.errors?.join(', ') || 'Failed to send message')
      }
    } catch {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="py-12 sm:py-20 md:py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }}>
            <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">{t('Get in Touch', 'ያግኙን')}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{t("Let's create something", 'እንፍጠር')} <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t('extraordinary', 'ልዩ ነገር')}</span></h2>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg leading-relaxed">{t("Ready to bring your event vision to life? Reach out to us and let's start planning. Every great event begins with a conversation.", 'የዝግጅት ራዕይዎን ለማሳደጵ ዝግጁ ነዎት? ያግኙን እና እንዳቅድ። እያንዳንዱ ታላቅ ዝግጅት ከውይይት ይጀምራል።')}</p>

            <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">{t('Call Us', 'ደውሉልን')}</p>
                  {(content.phones || []).map((phone, i) => (
                    <a key={i} href={`tel:${(content.phoneLinks || [])[i] || phone}`} className="text-xs sm:text-sm text-muted-foreground hover:text-emerald-600 transition-colors block">{phone}</a>
                  ))}
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">{t('Email Us', 'ኢሜይል ይላኩ')}</p>
                  <a href={`mailto:${content.email}`} className="text-xs sm:text-sm text-muted-foreground hover:text-emerald-600 transition-colors block">{content.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">{t('Visit Us', 'ይጠብቁን')}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{content.address}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Ethiopia</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">{t('Working Hours', 'የስራ ሰዓታት')}</p>
                  {(content.workingHours || []).map((wh, i) => (
                    <p key={i} className="text-xs sm:text-sm text-muted-foreground">{wh.day}: {wh.hours}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-3">
              {(content.socialLinks || []).filter(s => s.url).map((social) => {
                const iconMap: Record<string, React.ElementType> = { Instagram, Facebook, Youtube, Telegram: Send, WhatsApp: MessageCircle, TikTok: Music }
                const Icon = iconMap[social.platform] || Instagram
                return (
                  <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="h-10 w-10 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl min-h-[44px] min-w-[44px]">
                      <Icon className="h-4 w-4" />
                    </Button>
                  </a>
                )
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }}>
            <Card className="rounded-xl sm:rounded-2xl border-border/50">
              <CardContent className="p-4 sm:p-6 md:p-8">
                {submitted ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 sm:mb-4">
                      <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Message Sent! — መልእክት ተልኳል!</h3>
                    <p className="text-sm text-muted-foreground">Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div><label className="text-xs sm:text-sm font-medium mb-1.5 block">{t('Your Name', 'ስምዎ')}</label><Input placeholder={t('Your name', 'ስምዎ')} value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} required className="h-10 sm:h-11 min-h-[44px]" /></div>
                      <div><label className="text-xs sm:text-sm font-medium mb-1.5 block">{t('Your Email', 'ኢሜይል')}</label><Input type="email" placeholder="you@email.com" value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} required className="h-10 sm:h-11 min-h-[44px]" /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div><label className="text-xs sm:text-sm font-medium mb-1.5 block">{t('Phone', 'ስልክ')}</label><Input placeholder="+251 ..." value={formState.phone} onChange={(e) => setFormState({ ...formState, phone: e.target.value })} className="h-10 sm:h-11 min-h-[44px]" /></div>
                      <div><label className="text-xs sm:text-sm font-medium mb-1.5 block">{t('Event Date', 'የዝግጅት ቀን')}</label><Input placeholder="Wedding, Corporate, etc." value={formState.eventType} onChange={(e) => setFormState({ ...formState, eventType: e.target.value })} className="h-10 sm:h-11 min-h-[44px]" /></div>
                    </div>
                    <div><label className="text-xs sm:text-sm font-medium mb-1.5 block">{t('Message', 'መልዕክት')}</label><Textarea placeholder="Share your vision — date, venue preferences, number of guests, special requirements..." value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} required rows={4} className="resize-none" /></div>
                    <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 h-11 sm:h-11 min-h-[44px] disabled:opacity-60 disabled:cursor-not-allowed">
                      {submitting ? (<><div className="mr-2 h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>) : (<><Send className="mr-2 h-4 w-4" />{t('Send Message', 'መልዕክት ይላኩ')}</>)}
                    </Button>
                    {submitError && <p className="text-xs text-red-500 dark:text-red-400 text-center mt-2">{submitError}</p>}
                    <p className="text-[10px] sm:text-xs text-muted-foreground text-center">We typically respond within 24 hours. Your information is kept confidential.</p>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


function Footer({ content }: { content: SiteContent }) {
  const { language, t } = useLanguage()
  return (
    <footer className="border-t border-border/50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Image src="/enkutatash-logo.png" alt="Enkutatash Logo" width={32} height={32} unoptimized className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg object-contain" />
              <div className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg font-bold">{content.businessName}</span>
                <span className="text-[8px] sm:text-[10px] text-muted-foreground">{content.businessNameAmharic}</span>
              </div>
            </div>
            <p className="text-[11px] sm:text-sm text-muted-foreground max-w-xs">{content.description}</p>
            <div className="mt-3 sm:mt-4 flex gap-1.5 sm:gap-2">
              {(content.socialLinks || []).filter(s => s.url).map((social, i) => {
                const iconMap: Record<string, React.ElementType> = { Instagram, Facebook, Youtube, Telegram: Send, WhatsApp: MessageCircle, TikTok: Music }
                const Icon = iconMap[social.platform] || Instagram
                return <a key={i} href={social.url} target="_blank" rel="noopener noreferrer"><Button variant="ghost" size="icon" className="h-10 w-10 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"><Icon className="h-4 w-4" /></Button></a>
              })}
            </div>
          </div>
          <div>
            <h4 className="text-[11px] sm:text-sm font-semibold mb-2 sm:mb-3">{t('Company', 'ድርጅት')}</h4>
            <ul className="space-y-1 sm:space-y-2">
              {[{ en: 'About Us', am: 'ስለ እኛ' }, { en: 'Portfolio', am: 'ስራዎቻችን' }, { en: 'Testimonials', am: 'ደንበኞቻችን' }, { en: 'Contact', am: 'ያግኙን' }].map((item) => (<li key={item.en}><a className="text-[10px] sm:text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{t(item.en, item.am)}</a></li>))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] sm:text-sm font-semibold mb-2 sm:mb-3">{t('Contact Us', 'ያግኙን')}</h4>
            <ul className="space-y-1 sm:space-y-2">
              {(content.phones || []).slice(0, 2).map((phone, i) => (<li key={i} className="text-[10px] sm:text-sm text-muted-foreground">{phone}</li>))}
              <li className="text-[10px] sm:text-sm text-muted-foreground break-all">{content.email}</li>
              <li className="text-[10px] sm:text-sm text-muted-foreground">{content.address}</li>
            </ul>
          </div>
        </div>
        <div className="pt-6 sm:pt-8 border-t border-border/50 flex flex-col items-center justify-center gap-2">
          <p className="text-[10px] sm:text-sm text-muted-foreground">&copy; 2026 {content.businessName} Event / {content.businessNameAmharic}. All rights reserved.</p>
          <div className="flex items-center gap-3 text-[10px] sm:text-xs text-muted-foreground">
            <a href="/privacy" className="hover:text-foreground transition-colors">{t('Privacy Policy', 'የግላዊነት ፖሊሲ')}</a>
            <span className="text-border">|</span>
            <button
              onClick={() => window.dispatchEvent(new Event('show-cookie-consent'))}
              className="hover:text-foreground transition-colors"
            >
              {t('Cookie Settings', 'የኩኪ ቅንብሮች')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Landing Page Component ──────────────────────────────────────────────
export function LandingPage() {
  const [content, setContent] = useState<SiteContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/content')
      .then((r) => r.json())
      .then((data) => {
        if (data.content) setContent(data.content as SiteContent)
        else setContent(hardcodedSiteContent as unknown as SiteContent)
      })
      .catch(() => {
        // API failed (rate limited, Redis down, etc.) — use hardcoded data as fallback
        setContent(hardcodedSiteContent as unknown as SiteContent)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!content) {
    return null
  }

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <LandingNavbar content={content} />
        <HeroSection content={content} />
        <StatsSection content={content} />
        <AboutSection content={content} />
        <VisionMissionSection content={content} />
        <ServicesSection content={content} />
        <PortfolioSection content={content} />
        <ProcessSection />
        <TestimonialsSection content={content} />
        <ContactSection content={content} />
        <Footer content={content} />
        <BookingDialog />
      </div>
    </LanguageProvider>
  )
}
