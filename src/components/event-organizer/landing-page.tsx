'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  CalendarDays,
  Users,
  MapPin,
  ArrowRight,
  Star,
  Heart,
  Music,
  Briefcase,
  PartyPopper,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Clock,
  Award,
  CheckCircle2,
  Quote,
  Send,
  Play,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEventStore } from './store'

const services = [
  {
    icon: Heart,
    title: 'Weddings & Celebrations',
    description:
      'From intimate ceremonies to grand celebrations, we craft unforgettable wedding experiences with meticulous attention to every detail — from venue styling to seamless coordination.',
    gradient: 'from-rose-500 to-pink-600',
    bgGlow: 'bg-rose-500/10',
  },
  {
    icon: Briefcase,
    title: 'Corporate Events',
    description:
      'Elevate your brand with professionally managed conferences, product launches, galas, and team-building events that leave lasting impressions on your stakeholders.',
    gradient: 'from-amber-500 to-orange-600',
    bgGlow: 'bg-amber-500/10',
  },
  {
    icon: Music,
    title: 'Concerts & Festivals',
    description:
      'Large-scale entertainment events with world-class production, sound, and stage management. We handle everything from artist coordination to crowd logistics.',
    gradient: 'from-violet-500 to-purple-600',
    bgGlow: 'bg-violet-500/10',
  },
  {
    icon: PartyPopper,
    title: 'Private Parties',
    description:
      'Birthday bashes, anniversary celebrations, graduation parties, and more — we transform your vision into a vibrant reality with creative themes and flawless execution.',
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    icon: Sparkles,
    title: 'Cultural Events',
    description:
      'Celebrate heritage and tradition with culturally rich events that honor customs while creating modern, engaging experiences for diverse audiences.',
    gradient: 'from-cyan-500 to-sky-600',
    bgGlow: 'bg-cyan-500/10',
  },
  {
    icon: CalendarDays,
    title: 'End-to-End Planning',
    description:
      'Full-service event planning from concept to completion. Venue selection, vendor coordination, timeline management, and on-site coordination — we handle it all.',
    gradient: 'from-lime-500 to-green-600',
    bgGlow: 'bg-lime-500/10',
  },
]

const testimonials = [
  {
    name: 'Sara Mekonnen',
    role: 'Bride, Addis Ababa',
    avatar: 'SM',
    quote:
      'Enkutatash turned our wedding into an absolute fairy tale. Every single detail was perfect — from the floral arrangements to the music. Our guests are still talking about it months later!',
    rating: 5,
    event: 'Wedding Reception',
  },
  {
    name: 'Dawit Amare',
    role: 'CEO, Horizon Tech',
    avatar: 'DA',
    quote:
      'We hired Enkutatash for our annual company retreat and product launch. Their professionalism and creativity exceeded all expectations. The team handled 500+ guests effortlessly.',
    rating: 5,
    event: 'Corporate Launch',
  },
  {
    name: 'Hana Tadesse',
    role: 'Festival Director',
    avatar: 'HT',
    quote:
      'Working with Enkutatash on the Addis Music Festival was a game-changer. Their production quality and crowd management skills are second to none in the industry.',
    rating: 5,
    event: 'Music Festival',
  },
]

const portfolioEvents = [
  {
    title: 'Ethiopian New Year Gala',
    category: 'Cultural',
    attendees: '1,200+',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
  },
  {
    title: 'Horizon Tech Summit 2025',
    category: 'Corporate',
    attendees: '500+',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
  },
  {
    title: 'Mekonnen-Desta Wedding',
    category: 'Wedding',
    attendees: '350+',
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
  },
  {
    title: 'Addis Music Festival',
    category: 'Concert',
    attendees: '5,000+',
    gradient: 'from-violet-400 via-purple-500 to-indigo-600',
  },
  {
    title: 'Millennium Hall Expo',
    category: 'Exhibition',
    attendees: '3,000+',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
  },
  {
    title: 'Selam Birthday Bash',
    category: 'Private',
    attendees: '150+',
    gradient: 'from-lime-400 via-green-500 to-emerald-600',
  },
]

const stats = [
  { value: '500+', label: 'Events Organized', icon: CalendarDays },
  { value: '50K+', label: 'Happy Guests', icon: Users },
  { value: '8+', label: 'Years of Excellence', icon: Award },
  { value: '4.9', label: 'Average Rating', icon: Star },
]

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function LandingNavbar() {
  const { setAppView } = useEventStore()
  const { setTheme, theme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useState(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => setScrolled(window.scrollY > 20)
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-500 shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Enkutatash
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
            <a href="#services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Services
            </a>
            <a href="#portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Portfolio
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setAppView('app')}
              className="text-sm"
            >
              Owner Login
            </Button>
            <Button
              onClick={() => {
                const el = document.getElementById('contact')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
            >
              Book an Event <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {['About', 'Services', 'Portfolio', 'Testimonials', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-sm text-muted-foreground hover:text-foreground py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => { setAppView('app'); setMobileOpen(false) }}
                  className="w-full"
                >
                  Owner Login
                </Button>
                <Button
                  onClick={() => { setMobileOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Book an Event <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-teal-500/3 blur-3xl" />
      </div>

      {/* Decorative pattern - inspired by Ethiopian patterns */}
      <div className="absolute inset-0 -z-10 opacity-[0.015]">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, currentColor 2px, transparent 0)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-1.5 text-sm font-medium border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Premium Event Organizers in Addis Ababa
              <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight"
          >
            Where Every Event
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">
              Becomes Legendary
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Enkutatash is Addis Ababa&apos;s premier event organizer. From breathtaking weddings 
            to large-scale corporate events and cultural celebrations — we bring your vision to life 
            with elegance, precision, and a touch of magic.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 px-8 h-12 text-base"
            >
              Book Your Event
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-12 text-base group"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="mr-2 h-4 w-4 group-hover:text-emerald-600 transition-colors" />
              View Our Work
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 flex flex-col items-center gap-3"
          >
            <div className="flex -space-x-2">
              {['SM', 'DA', 'HT', 'YK', 'AB'].map((initials, i) => (
                <div
                  key={initials}
                  className="h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                  style={{
                    background: [
                      'linear-gradient(135deg, #10b981, #0d9488)',
                      'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      'linear-gradient(135deg, #f59e0b, #d97706)',
                      'linear-gradient(135deg, #ec4899, #db2777)',
                      'linear-gradient(135deg, #06b6d4, #0891b2)',
                    ][i],
                  }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                Trusted by <span className="font-semibold text-foreground">500+</span> happy clients
              </span>
            </div>
          </motion.div>
        </div>

        {/* Hero Image / Event Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 md:mt-20 relative"
        >
          <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl shadow-emerald-500/5 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">enkutatash.com</span>
              </div>
            </div>
            {/* Preview content - Event showcase */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-muted/20 to-muted/5">
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
                {portfolioEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.title}
                    className={`rounded-xl bg-gradient-to-br ${event.gradient} p-3 md:p-4 text-white aspect-[4/3] flex flex-col justify-end`}
                  >
                    <Badge className="w-fit text-[9px] md:text-[10px] bg-white/20 text-white border-0 mb-2">
                      {event.category}
                    </Badge>
                    <p className="text-xs md:text-sm font-bold leading-tight">{event.title}</p>
                    <p className="text-[9px] md:text-xs text-white/80 mt-1">{event.attendees} guests</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Events Organized', value: '500+', icon: CalendarDays },
                  { label: 'Happy Guests', value: '50K+', icon: Users },
                  { label: 'Years of Excellence', value: '8+', icon: Award },
                  { label: 'Client Rating', value: '4.9/5', icon: Star },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-background/60 border border-border/30 p-3 md:p-4 flex items-center gap-3"
                    >
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm md:text-lg font-bold">{stat.value}</p>
                        <p className="text-[9px] md:text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          {/* Glow effect behind preview */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-amber-500/5 blur-2xl" />
        </motion.div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="py-16 border-y border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} variants={staggerItem} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-3">
                  <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-500 p-[1px]">
              <div className="h-full w-full rounded-2xl bg-background flex flex-col items-center justify-center p-8 text-center">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-500 flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/20">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Enkutatash</h3>
                <p className="text-muted-foreground text-sm">Premium Event Organizers</p>
                <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-xs">
                  <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-3">
                    <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">8+</p>
                    <p className="text-xs text-muted-foreground">Years</p>
                  </div>
                  <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-3">
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400">500+</p>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                  <div className="rounded-xl bg-teal-500/5 border border-teal-500/10 p-3">
                    <p className="text-xl font-bold text-teal-600 dark:text-teal-400">50K+</p>
                    <p className="text-xs text-muted-foreground">Guests</p>
                  </div>
                  <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-3">
                    <p className="text-xl font-bold text-rose-600 dark:text-rose-400">4.9</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 -z-10 opacity-20 blur-xl" />
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 -z-10 opacity-20 blur-xl" />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
              About Us
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Crafting Unforgettable
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Moments Since 2018</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Named after the Ethiopian New Year — a celebration of new beginnings and fresh possibilities — 
              Enkutatash was founded with a simple belief: every event deserves to be extraordinary. Based in 
              the heart of Addis Ababa, we have spent over eight years transforming ordinary occasions into 
              legendary experiences.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our team of 25+ creative professionals brings together expertise in event design, production, 
              catering coordination, and logistics management. We understand the unique cultural nuances that 
              make Ethiopian celebrations special, while also delivering world-class standards that impress 
              international guests. Whether it is a traditional wedding with hundreds of guests or a sleek 
              corporate product launch, we approach every event with the same passion and meticulous attention 
              to detail.
            </p>
            <div className="mt-6 space-y-3">
              {[
                'End-to-end event planning and execution',
                'Award-winning creative design team',
                'Strong vendor network across Addis Ababa',
                'Dedicated project manager for every event',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Button
              className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Whatever the occasion,
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> we make it extraordinary</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From intimate gatherings to grand spectacles, our team delivers world-class event experiences tailored to your vision.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div key={service.title} variants={staggerItem} whileHover={{ y: -4 }} className="group">
                <Card className="h-full rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-emerald-500/20">
                  <CardContent className="p-6">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${service.bgGlow} mb-4`}>
                      <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
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

function PortfolioSection() {
  return (
    <section id="portfolio" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            Our Portfolio
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Events that
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> speak for themselves</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A glimpse into some of our most memorable events — each one a unique story of creativity and flawless execution.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {portfolioEvents.map((event) => (
            <motion.div key={event.title} variants={staggerItem} whileHover={{ y: -4, scale: 1.02 }} className="group cursor-pointer">
              <div className={`rounded-2xl bg-gradient-to-br ${event.gradient} p-[1px]`}>
                <div className="rounded-2xl bg-card p-5 h-full flex flex-col">
                  <div className={`rounded-xl bg-gradient-to-br ${event.gradient} h-40 mb-4 flex items-center justify-center`}>
                    <span className="text-4xl font-bold text-white/90">{event.title.charAt(0)}</span>
                  </div>
                  <Badge className="w-fit text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 mb-2">
                    {event.category}
                  </Badge>
                  <h3 className="text-lg font-semibold group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{event.attendees} guests attended</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group"
          >
            Plan Your Event With Us
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 md:py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            Testimonials
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            What our clients
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> say about us</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Don&apos;t just take our word for it — hear from the people who have experienced the Enkutatash difference.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={staggerItem} whileHover={{ y: -4 }}>
              <Card className="h-full rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {testimonial.event}
                    </Badge>
                  </div>
                  <Quote className="h-6 w-6 text-emerald-500/30 mb-2" />
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
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

function ProcessSection() {
  const steps = [
    {
      number: '01',
      title: 'Consultation',
      description: 'We start with a detailed conversation to understand your vision, budget, and expectations. This helps us tailor every detail to your needs.',
    },
    {
      number: '02',
      title: 'Design & Planning',
      description: 'Our creative team develops a comprehensive plan including mood boards, timelines, vendor selections, and budget breakdowns for your approval.',
    },
    {
      number: '03',
      title: 'Coordination',
      description: 'We coordinate with all vendors, manage logistics, and handle every detail behind the scenes so you can focus on what matters most.',
    },
    {
      number: '04',
      title: 'The Big Day',
      description: 'Our team is on-site from setup to teardown, ensuring everything runs flawlessly. You just show up and enjoy your extraordinary event.',
    },
  ]

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            From vision to reality
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> in 4 steps</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => (
            <motion.div key={step.number} variants={staggerItem}>
              <div className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px border-t border-dashed border-emerald-500/20" />
                )}
                <div className="text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormState({ name: '', email: '', phone: '', eventType: '', message: '' })
  }

  return (
    <section id="contact" className="py-20 md:py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
              Get in Touch
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Let&apos;s create something
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> extraordinary</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Ready to bring your event vision to life? Reach out to us and let&apos;s start planning. 
              Every great event begins with a conversation.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-sm text-muted-foreground">+251 11 234 5678</p>
                  <p className="text-sm text-muted-foreground">+251 91 234 5678</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-sm text-muted-foreground">hello@enkutatash.com</p>
                  <p className="text-sm text-muted-foreground">booking@enkutatash.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">Visit Us</p>
                  <p className="text-sm text-muted-foreground">Bole Road, Atlas Building, 3rd Floor</p>
                  <p className="text-sm text-muted-foreground">Addis Ababa, Ethiopia</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium">Working Hours</p>
                  <p className="text-sm text-muted-foreground">Mon - Fri: 8:00 AM - 6:00 PM</p>
                  <p className="text-sm text-muted-foreground">Sat: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-8 flex gap-3">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
              ].map((social) => {
                const Icon = social.icon
                return (
                  <Button key={social.label} variant="outline" size="icon" className="h-10 w-10 rounded-xl">
                    <Icon className="h-4 w-4" />
                  </Button>
                )
              })}
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <Card className="rounded-2xl border-border/50">
              <CardContent className="p-6 md:p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Full Name</label>
                        <Input
                          placeholder="Your name"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          required
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Email</label>
                        <Input
                          type="email"
                          placeholder="you@email.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          required
                          className="h-10"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Phone Number</label>
                        <Input
                          placeholder="+251 ..."
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Event Type</label>
                        <Input
                          placeholder="Wedding, Corporate, etc."
                          value={formState.eventType}
                          onChange={(e) => setFormState({ ...formState, eventType: e.target.value })}
                          className="h-10"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Tell Us About Your Event</label>
                      <Textarea
                        placeholder="Share your vision — date, venue preferences, number of guests, special requirements..."
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        required
                        rows={5}
                        className="resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 h-11"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      We typically respond within 24 hours. Your information is kept confidential.
                    </p>
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

function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-600" />
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />

          <div className="relative px-6 py-16 md:px-16 md:py-20 text-center">
            <Sparkles className="h-12 w-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Your Next Event Deserves
              <br />
              the Enkutatash Touch
            </h2>
            <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
              Let us transform your vision into an unforgettable experience. 
              Book a free consultation today and discover why hundreds of clients trust us.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-emerald-700 hover:bg-white/90 shadow-xl px-8 h-12 text-base font-semibold"
              >
                Book a Free Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 h-12 text-base"
                onClick={() => window.open('tel:+251112345678')}
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Us Now
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-500">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">Enkutatash</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Addis Ababa&apos;s premier event organizer. Crafting legendary experiences since 2018.
            </p>
            <div className="mt-4 flex gap-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <Button key={i} variant="ghost" size="icon" className="h-8 w-8">
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Services</h4>
            <ul className="space-y-2">
              {['Weddings', 'Corporate Events', 'Concerts', 'Private Parties', 'Cultural Events'].map((item) => (
                <li key={item}>
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              {['About Us', 'Portfolio', 'Testimonials', 'Blog', 'Careers'].map((item) => (
                <li key={item}>
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Contact</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">+251 11 234 5678</li>
              <li className="text-sm text-muted-foreground">hello@enkutatash.com</li>
              <li className="text-sm text-muted-foreground">Bole Road, Addis Ababa</li>
              <li className="text-sm text-muted-foreground">Mon-Sat, 8AM-6PM</li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Enkutatash Event Organizers. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Privacy Policy</a>
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
      <CTASection />
      <Footer />
    </div>
  )
}
