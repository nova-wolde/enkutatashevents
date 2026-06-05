'use client'

import { useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Sparkles,
  CalendarDays,
  Users,
  MapPin,
  BarChart3,
  ArrowRight,
  Check,
  Star,
  Zap,
  Shield,
  Globe,
  ChevronRight,
  Play,
  Menu,
  X,
  Moon,
  Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useEventStore } from './store'

const features = [
  {
    icon: CalendarDays,
    title: 'Smart Event Scheduling',
    description:
      'Create and manage events with an intuitive calendar interface. Set dates, times, and venues effortlessly with smart conflict detection and automatic timezone handling.',
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    icon: Users,
    title: 'Attendee Management',
    description:
      'Track registrations, manage waitlists, and communicate with attendees seamlessly. Built-in tools for check-ins, badges, and real-time attendance monitoring.',
    gradient: 'from-violet-500 to-purple-600',
    bgGlow: 'bg-violet-500/10',
  },
  {
    icon: MapPin,
    title: 'Venue Coordination',
    description:
      'Browse and book venues with interactive maps, capacity planning, and resource allocation. Manage multiple venues and rooms from a single dashboard.',
    gradient: 'from-amber-500 to-orange-600',
    bgGlow: 'bg-amber-500/10',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description:
      'Real-time dashboards with attendance trends, revenue tracking, and engagement metrics. Export custom reports and make data-driven decisions for future events.',
    gradient: 'from-rose-500 to-pink-600',
    bgGlow: 'bg-rose-500/10',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Setup',
    description:
      'Go from idea to published event in under 60 seconds. Pre-built templates, bulk actions, and AI-powered suggestions help you work faster than ever before.',
    gradient: 'from-cyan-500 to-sky-600',
    bgGlow: 'bg-cyan-500/10',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'SOC 2 compliant infrastructure with end-to-end encryption, role-based access controls, and comprehensive audit trails. Your event data is always protected.',
    gradient: 'from-lime-500 to-green-600',
    bgGlow: 'bg-lime-500/10',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Event Director, TechConf',
    avatar: 'SC',
    quote:
      'EventHub transformed how we manage our 5,000-person annual conference. The real-time analytics alone saved us 20 hours per week in reporting time.',
    rating: 5,
  },
  {
    name: 'Marcus Rivera',
    role: 'CEO, MeetupPro',
    avatar: 'MR',
    quote:
      'We switched from three different tools to just EventHub. The all-in-one platform reduced our costs by 40% and our team actually enjoys using it.',
    rating: 5,
  },
  {
    name: 'Emily Nakamura',
    role: 'Festival Coordinator',
    avatar: 'EN',
    quote:
      'Managing a 3-day music festival with 50+ acts used to be a nightmare. EventHub made venue coordination and artist scheduling feel effortless.',
    rating: 5,
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '0',
    period: 'forever',
    description: 'Perfect for small gatherings and community events.',
    features: [
      'Up to 5 events per month',
      '100 attendees per event',
      'Basic analytics',
      'Email support',
      '1 venue',
    ],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '49',
    period: 'per month',
    description: 'For growing teams and mid-size events.',
    features: [
      'Unlimited events',
      'Up to 2,000 attendees',
      'Advanced analytics & reports',
      'Priority support',
      '10 venues',
      'Custom branding',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '199',
    period: 'per month',
    description: 'For large organizations and premium events.',
    features: [
      'Unlimited everything',
      'Unlimited attendees',
      'AI-powered insights',
      '24/7 dedicated support',
      'Unlimited venues',
      'White-label solution',
      'SSO & advanced security',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
]

const stats = [
  { value: '50K+', label: 'Events Created' },
  { value: '2M+', label: 'Attendees Managed' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.9/5', label: 'User Rating' },
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

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Event<span className="text-emerald-600 dark:text-emerald-400">Hub</span>
            </span>
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <button
              onClick={() => setAppView('business')}
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
            >
              Our Business
            </button>
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
              Sign In
            </Button>
            <Button
              onClick={() => setAppView('app')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
            >
              Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
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
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
        >
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block text-sm text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </a>
            <a
              href="#testimonials"
              className="block text-sm text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="block text-sm text-muted-foreground hover:text-foreground py-2"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </a>
            <button
              onClick={() => { setAppView('business'); setMobileOpen(false) }}
              className="block text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium py-2"
            >
              Our Business
            </button>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => { setAppView('app'); setMobileOpen(false) }}
                className="w-full"
              >
                Sign In
              </Button>
              <Button
                onClick={() => { setAppView('app'); setMobileOpen(false) }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Get Started <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

function HeroSection() {
  const { setAppView } = useEventStore()

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-teal-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-violet-500/3 blur-3xl" />
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
              Now with AI-powered event suggestions
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
            Organize events
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              that inspire
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            The all-in-one platform for creating, managing, and analyzing events.
            From intimate meetups to global conferences — EventHub scales with you.
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
              onClick={() => setAppView('app')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 px-8 h-12 text-base"
            >
              Start For Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 h-12 text-base group"
            >
              <Play className="mr-2 h-4 w-4 group-hover:text-emerald-600 transition-colors" />
              Watch Demo
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
              {['SC', 'MR', 'EN', 'JL', 'PP'].map((initials, i) => (
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
            <p className="text-sm text-muted-foreground">
              Trusted by <span className="font-semibold text-foreground">12,000+</span> event organizers worldwide
            </p>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
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
                <span className="text-xs text-muted-foreground">app.eventhub.io/dashboard</span>
              </div>
            </div>
            {/* Preview content */}
            <div className="p-6 md:p-8 bg-gradient-to-br from-muted/20 to-muted/5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
                {[
                  { label: 'Total Events', value: '248', change: '+12%', color: 'from-emerald-500/10 to-teal-500/10' },
                  { label: 'Attendees', value: '8,432', change: '+8.5%', color: 'from-violet-500/10 to-purple-500/10' },
                  { label: 'Upcoming', value: '18', change: '+3 this week', color: 'from-amber-500/10 to-orange-500/10' },
                  { label: 'Revenue', value: '$142K', change: '+23%', color: 'from-rose-500/10 to-pink-500/10' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-xl bg-gradient-to-br ${stat.color} border border-border/30 p-3 md:p-4`}
                  >
                    <p className="text-[10px] md:text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-lg md:text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-[9px] md:text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <div className="md:col-span-2 rounded-xl border border-border/30 bg-background/50 p-3 md:p-4">
                  <p className="text-xs font-medium mb-3">Upcoming Events</p>
                  <div className="space-y-2">
                    {['Tech Summit 2026', 'Design Workshop', 'Summer Music Festival'].map((event, i) => (
                      <div key={event} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                        <div
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                          style={{
                            background: [
                              'linear-gradient(135deg, #10b981, #0d9488)',
                              'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                              'linear-gradient(135deg, #f59e0b, #d97706)',
                            ][i],
                          }}
                        >
                          {event.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{event}</p>
                          <p className="text-[10px] text-muted-foreground">{['Jul 15', 'Jun 20', 'Aug 5'][i]}</p>
                        </div>
                        <Badge variant="secondary" className="text-[9px] h-5">
                          {['342', '28', '1.2K'][i]} going
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border/30 bg-background/50 p-3 md:p-4">
                  <p className="text-xs font-medium mb-3">Activity</p>
                  <div className="space-y-2">
                    {['Sarah registered', 'Venue added', 'Report exported'].map((act) => (
                      <div key={act} className="text-[10px] text-muted-foreground py-1 border-b border-border/20 last:border-0">
                        {act}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect behind preview */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 blur-2xl" />
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
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={staggerItem} className="text-center">
              <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Everything you need to
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> run amazing events</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            From planning to execution, EventHub provides all the tools you need in one powerful platform.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <motion.div key={feature.title} variants={staggerItem} whileHover={{ y: -4 }} className="group">
                <Card className="h-full rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-emerald-500/20">
                  <CardContent className="p-6">
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${feature.bgGlow} mb-4`}>
                      <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
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
            Loved by
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> event organizers</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            See why thousands of teams trust EventHub for their most important events.
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
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
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

function PricingSection() {
  const { setAppView } = useEventStore()

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <Badge variant="secondary" className="mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Simple,
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> transparent pricing</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {pricingPlans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="relative"
            >
              {plan.highlighted && (
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-600 -z-10" />
              )}
              <Card className={`h-full rounded-2xl ${plan.highlighted ? 'border-0 bg-background shadow-xl' : 'border-border/50 shadow-sm hover:shadow-lg'} transition-all duration-300`}>
                <CardContent className="p-6">
                  {plan.highlighted && (
                    <Badge className="mb-4 bg-emerald-600 text-white border-0">Most Popular</Badge>
                  )}
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-8 ${
                      plan.highlighted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20'
                        : ''
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => setAppView('app')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CTASection() {
  const { setAppView } = useEventStore()

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
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600" />
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />

          <div className="relative px-6 py-16 md:px-16 md:py-20 text-center">
            <Globe className="h-12 w-12 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Ready to create your next
              <br />
              unforgettable event?
            </h2>
            <p className="mt-4 text-white/80 text-lg max-w-xl mx-auto">
              Join 12,000+ organizers who trust EventHub. Get started in under 60 seconds — no credit card required.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setAppView('app')}
                className="bg-white text-emerald-700 hover:bg-white/90 shadow-xl px-8 h-12 text-base font-semibold"
              >
                Start For Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 h-12 text-base"
              >
                Schedule a Demo
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                Event<span className="text-emerald-600 dark:text-emerald-400">Hub</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              The all-in-one event management platform trusted by thousands of organizers worldwide.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2">
              {['Features', 'Pricing', 'Integrations', 'Changelog'].map((item) => (
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
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              {['Privacy', 'Terms', 'Security', 'GDPR'].map((item) => (
                <li key={item}>
                  <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 EventHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Twitter</a>
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">GitHub</a>
            <a className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">LinkedIn</a>
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
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  )
}
