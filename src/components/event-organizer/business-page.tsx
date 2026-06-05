'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  MapPin,
  Globe,
  Mail,
  Phone,
  CalendarDays,
  Users,
  Star,
  ArrowRight,
  Share2,
  Heart,
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronRight,
  Instagram,
  Twitter,
  Linkedin,
  ArrowLeft,
  MessageSquare,
  Award,
  Briefcase,
  Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useEventStore } from './store'

const businessInfo = {
  name: 'EventHub Pro',
  tagline: 'Premium Event Planning & Management',
  description:
    'We are a full-service event planning and management company specializing in corporate conferences, music festivals, workshops, and social gatherings. With over 8 years of experience, our team has successfully delivered 500+ events across 30 cities, serving more than 200,000 attendees. We combine cutting-edge technology with creative vision to craft unforgettable experiences that bring people together.',
  founded: '2018',
  location: 'San Francisco, CA',
  website: 'www.eventhubpro.com',
  email: 'hello@eventhubpro.com',
  phone: '+1 (415) 555-0192',
  verified: true,
  rating: 4.9,
  reviewCount: 328,
  eventsCompleted: 500,
  totalAttendees: '200K+',
  citiesServed: 30,
  followers: '12.4K',
  coverGradient: 'from-emerald-600 via-teal-600 to-cyan-700',
}

const services = [
  {
    icon: CalendarDays,
    title: 'Conference Planning',
    description:
      'End-to-end conference management from venue selection and speaker coordination to attendee registration and post-event analytics. We handle logistics so you can focus on content.',
  },
  {
    icon: Trophy,
    title: 'Festival Production',
    description:
      'Large-scale festival production including stage design, artist management, vendor coordination, permits, and crowd safety. We create immersive multi-day experiences.',
  },
  {
    icon: Briefcase,
    title: 'Corporate Events',
    description:
      'Professional corporate gatherings including product launches, galas, team retreats, and annual meetings. Tailored experiences that align with your brand identity.',
  },
  {
    icon: Award,
    title: 'Workshop Design',
    description:
      'Interactive workshop facilitation with curriculum design, venue setup, material preparation, and participant engagement tracking. Learning experiences that stick.',
  },
]

const teamMembers = [
  {
    name: 'Jordan Mitchell',
    role: 'Founder & CEO',
    avatar: 'JM',
    gradient: 'from-emerald-500 to-teal-600',
    bio: '15 years in event production. Previously led events at Google and Salesforce.',
  },
  {
    name: 'Sarah Chen',
    role: 'Creative Director',
    avatar: 'SC',
    gradient: 'from-violet-500 to-purple-600',
    bio: 'Award-winning event designer with a passion for immersive experiences.',
  },
  {
    name: 'Marcus Rivera',
    role: 'Head of Operations',
    avatar: 'MR',
    gradient: 'from-amber-500 to-orange-600',
    bio: 'Logistics expert who ensures every detail is executed flawlessly.',
  },
  {
    name: 'Priya Patel',
    role: 'Client Relations',
    avatar: 'PP',
    gradient: 'from-rose-500 to-pink-600',
    bio: 'Dedicated to building lasting partnerships and exceeding expectations.',
  },
]

const upcomingEvents = [
  {
    name: 'Tech Summit 2026',
    date: 'Jul 15, 2026',
    venue: 'Grand Convention Center',
    attendees: 342,
    maxAttendees: 500,
    category: 'Conference',
    gradient: 'from-emerald-400 to-teal-600',
    price: '$299',
  },
  {
    name: 'Summer Music Festival',
    date: 'Aug 5, 2026',
    venue: 'Riverside Amphitheater',
    attendees: 1200,
    maxAttendees: 2000,
    category: 'Concert',
    gradient: 'from-amber-400 to-orange-600',
    price: '$149',
  },
  {
    name: 'Developer Day',
    date: 'Jul 28, 2026',
    venue: 'Grand Convention Center',
    attendees: 180,
    maxAttendees: 300,
    category: 'Conference',
    gradient: 'from-cyan-400 to-sky-600',
    price: '$199',
  },
]

const pastHighlights = [
  {
    name: 'AI & ML Conference 2025',
    attendees: 450,
    rating: 4.9,
    tag: 'Best Rated',
    gradient: 'from-violet-400 to-purple-600',
  },
  {
    name: 'Global Music Fest 2025',
    attendees: 3500,
    rating: 4.8,
    tag: 'Largest Event',
    gradient: 'from-rose-400 to-pink-600',
  },
  {
    name: 'Startup Summit 2025',
    attendees: 800,
    rating: 4.9,
    tag: 'Sold Out',
    gradient: 'from-emerald-400 to-teal-600',
  },
]

const reviews = [
  {
    name: 'David Kim',
    avatar: 'DK',
    role: 'VP Marketing, Acme Corp',
    rating: 5,
    text: 'EventHub Pro organized our annual product launch and it was absolutely flawless. Every detail was handled with precision and creativity. Our team was blown away by the experience.',
    date: '2 weeks ago',
  },
  {
    name: 'Lisa Wang',
    avatar: 'LW',
    role: 'Festival Director',
    rating: 5,
    text: 'Working with this team on our 3-day music festival was a dream. They managed 50+ artists, 5 stages, and 10,000 attendees without a hitch. Already planning next year together.',
    date: '1 month ago',
  },
  {
    name: 'Robert Johnson',
    avatar: 'RJ',
    role: 'CEO, TechStart Inc',
    rating: 5,
    text: 'The corporate retreat they organized for our leadership team was transformative. The venue selection, activities, and attention to dietary requirements were exceptional.',
    date: '2 months ago',
  },
]

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function BusinessPage() {
  const { setAppView } = useEventStore()
  const [liked, setLiked] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <button
            onClick={() => setAppView('landing')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLiked(!liked)}
              className={liked ? 'text-rose-500 border-rose-500/30' : ''}
            >
              <Heart className={`h-4 w-4 mr-1.5 ${liked ? 'fill-rose-500' : ''}`} />
              {liked ? 'Saved' : 'Save'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1.5" />
              Share
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <MessageSquare className="h-4 w-4 mr-1.5" />
              Contact Us
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Cover image */}
      <div className={`relative h-48 sm:h-64 md:h-80 bg-gradient-to-br ${businessInfo.coverGradient}`}>
        <div className="absolute inset-0 bg-black/10" />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-8 left-12 h-20 w-20 rounded-full border-2 border-white/50" />
          <div className="absolute bottom-12 right-20 h-32 w-32 rounded-full border-2 border-white/30" />
          <div className="absolute top-1/2 left-1/3 h-16 w-16 rounded-full border-2 border-white/40" />
        </div>
      </div>

      {/* Business info header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-20">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            {/* Logo */}
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 border-4 border-background">
              <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
            </div>

            {/* Info */}
            <div className="flex-1 pt-2 sm:pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{businessInfo.name}</h1>
                {businessInfo.verified && (
                  <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground mt-1">{businessInfo.tagline}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {businessInfo.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{businessInfo.rating}</span>
                  ({businessInfo.reviewCount} reviews)
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  {businessInfo.followers} followers
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8"
          >
            {[
              { value: businessInfo.eventsCompleted + '+', label: 'Events Completed', icon: CalendarDays, color: 'text-emerald-600 dark:text-emerald-400' },
              { value: businessInfo.totalAttendees, label: 'Total Attendees', icon: Users, color: 'text-violet-600 dark:text-violet-400' },
              { value: businessInfo.citiesServed.toString(), label: 'Cities Served', icon: Globe, color: 'text-amber-600 dark:text-amber-400' },
              { value: businessInfo.founded, label: 'Founded', icon: Award, color: 'text-rose-600 dark:text-rose-400' },
            ].map((stat) => (
              <Card key={stat.label} className="rounded-xl border-border/50 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-lg font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <Separator className="my-8" />

          {/* Main content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
            {/* Left column - main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold mb-4">About Us</h2>
                <p className="text-muted-foreground leading-relaxed">{businessInfo.description}</p>
              </motion.section>

              {/* Services */}
              <motion.section
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                <h2 className="text-xl font-semibold mb-4">Our Services</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {services.map((service) => {
                    const Icon = service.icon
                    return (
                      <motion.div key={service.title} variants={staggerItem} whileHover={{ y: -2 }}>
                        <Card className="h-full rounded-xl border-border/50 shadow-sm hover:shadow-md transition-all duration-200 hover:border-emerald-500/20">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <h3 className="font-semibold">{service.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.section>

              {/* Upcoming Events */}
              <motion.section
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Upcoming Events</h2>
                  <Button variant="ghost" size="sm" className="text-emerald-600 dark:text-emerald-400">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <motion.div key={event.name} variants={staggerItem} whileHover={{ y: -2 }}>
                      <Card className="rounded-xl border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            {/* Event gradient */}
                            <div className={`h-24 sm:h-auto sm:w-32 bg-gradient-to-br ${event.gradient} flex items-center justify-center shrink-0`}>
                              <CalendarDays className="h-6 w-6 text-white/80" />
                            </div>
                            {/* Event info */}
                            <div className="flex-1 p-4 sm:p-5">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                <div>
                                  <h3 className="font-semibold">{event.name}</h3>
                                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5" />
                                      {event.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3.5 w-3.5" />
                                      {event.venue}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="text-xs">
                                    {event.category}
                                  </Badge>
                                  <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                    {event.price}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center gap-2">
                                  <div className="flex -space-x-1.5">
                                    {['A', 'B', 'C'].map((l, i) => (
                                      <div
                                        key={l}
                                        className="h-6 w-6 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white"
                                        style={{
                                          background: [
                                            'linear-gradient(135deg, #10b981, #0d9488)',
                                            'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                                            'linear-gradient(135deg, #f59e0b, #d97706)',
                                          ][i],
                                        }}
                                      >
                                        {l}
                                      </div>
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {event.attendees}/{event.maxAttendees} attending
                                  </span>
                                </div>
                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                  Register
                                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Past Highlights */}
              <motion.section
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                <h2 className="text-xl font-semibold mb-4">Past Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {pastHighlights.map((event) => (
                    <motion.div key={event.name} variants={staggerItem} whileHover={{ y: -4 }}>
                      <Card className="rounded-xl border-border/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                        <div className={`h-32 bg-gradient-to-br ${event.gradient} flex items-end p-4`}>
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                            {event.tag}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-sm">{event.name}</h3>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {event.attendees.toLocaleString()} attendees
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-xs font-medium">{event.rating}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Reviews */}
              <motion.section
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Client Reviews</h2>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{businessInfo.rating}</span>
                    <span className="text-sm text-muted-foreground">({businessInfo.reviewCount})</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <motion.div key={review.name} variants={staggerItem}>
                      <Card className="rounded-xl border-border/50 shadow-sm">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">
                                  {review.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold">{review.name}</p>
                                <p className="text-xs text-muted-foreground">{review.role}</p>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{review.date}</span>
                          </div>
                          <div className="flex gap-0.5 mt-3">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            </div>

            {/* Right column - sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Card className="rounded-xl border-border/50 shadow-sm">
                  <CardContent className="p-5 space-y-4">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 h-11">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full h-11">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Us
                    </Button>
                    <Separator />
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{businessInfo.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                        <a className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                          {businessInfo.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{businessInfo.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{businessInfo.phone}</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-center gap-3">
                      {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                        <button
                          key={i}
                          className="h-9 w-9 rounded-lg bg-muted/50 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center transition-colors"
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Team */}
              <motion.section
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
              >
                <h3 className="text-lg font-semibold mb-4">Our Team</h3>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <motion.div key={member.name} variants={staggerItem} whileHover={{ x: 4 }}>
                      <Card className="rounded-xl border-border/50 shadow-sm hover:shadow-md transition-all duration-200">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                              {member.avatar}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{member.bio}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.section>

              {/* Business Hours */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-xl border-border/50 shadow-sm">
                  <CardContent className="p-5">
                    <h3 className="text-sm font-semibold mb-3">Business Hours</h3>
                    <div className="space-y-2 text-sm">
                      {[
                        { day: 'Mon - Fri', hours: '9:00 AM - 6:00 PM', active: true },
                        { day: 'Saturday', hours: '10:00 AM - 4:00 PM', active: false },
                        { day: 'Sunday', hours: 'Closed', active: false },
                      ].map((schedule) => (
                        <div key={schedule.day} className="flex items-center justify-between">
                          <span className="text-muted-foreground">{schedule.day}</span>
                          <span className={schedule.active ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}>
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Currently Open</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
