'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  CalendarDays,
  Users,
  MapPin,
  ArrowRight,
  Star,
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
  Megaphone,
  PartyPopper,
  Palette,
  Tent,
  Speaker,
  Armchair,
  UtensilsCrossed,
  Gamepad2,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useEventStore } from './store'

const services = [
  {
    icon: Megaphone,
    title: 'Advert & Promotion',
    description:
      'Strategic advertising and promotional campaigns to maximize your event\'s reach. We handle social media marketing, print materials, radio spots, and digital advertising to ensure your event gets the attention it deserves across Addis Ababa and beyond.',
    gradient: 'from-amber-500 to-orange-600',
    bgGlow: 'bg-amber-500/10',
  },
  {
    icon: PartyPopper,
    title: 'Event Organization',
    description:
      'Full-service event planning and management from concept to completion. Whether it\'s a grand wedding, corporate conference, or cultural celebration, our experienced team coordinates every detail to deliver a seamless and memorable experience.',
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    icon: Palette,
    title: 'Decoration',
    description:
      'Stunning decorative designs tailored to your theme and vision. From elegant floral arrangements and balloon artistry to traditional Ethiopian motifs and modern aesthetics, our decoration team transforms any venue into a breathtaking setting.',
    gradient: 'from-rose-500 to-pink-600',
    bgGlow: 'bg-rose-500/10',
  },
  {
    icon: Tent,
    title: 'Stage & Tent Rent',
    description:
      'Professional stage setups and tent rentals for events of any scale. We provide high-quality tents, custom-built stages, podiums, and backdrop systems suitable for outdoor weddings, concerts, corporate events, and community gatherings.',
    gradient: 'from-violet-500 to-purple-600',
    bgGlow: 'bg-violet-500/10',
  },
  {
    icon: Speaker,
    title: 'Sound & Light Supply',
    description:
      'State-of-the-art sound systems and professional lighting setups for events of all sizes. From intimate gatherings requiring subtle ambiance to large concerts demanding powerful PA systems and dynamic light shows, we deliver crystal-clear audio and stunning visual effects.',
    gradient: 'from-cyan-500 to-sky-600',
    bgGlow: 'bg-cyan-500/10',
  },
  {
    icon: Armchair,
    title: 'Chair & Table Supply',
    description:
      'A wide selection of chairs, tables, and furniture rentals to match any event style. From banquet-style round tables and elegant chiavari chairs to functional conference setups and traditional Ethiopian seating arrangements, we have your needs covered.',
    gradient: 'from-indigo-500 to-blue-600',
    bgGlow: 'bg-indigo-500/10',
  },
  {
    icon: UtensilsCrossed,
    title: 'Catering Supply',
    description:
      'Delicious catering services featuring the best of Ethiopian and international cuisine. Our culinary team prepares everything from traditional injera platters and coffee ceremonies to continental menus, ensuring every guest is treated to an unforgettable dining experience.',
    gradient: 'from-orange-500 to-red-600',
    bgGlow: 'bg-orange-500/10',
  },
  {
    icon: Gamepad2,
    title: 'Kids Game Material Supply',
    description:
      'Fun and safe entertainment options for children at your event. We supply bouncy castles, ball pits, face painting stations, game booths, and age-appropriate activities that keep young guests engaged and happy while adults enjoy the celebration.',
    gradient: 'from-lime-500 to-green-600',
    bgGlow: 'bg-lime-500/10',
  },
]

const testimonials = [
  {
    name: 'Dr. Dereje',
    nameAmharic: 'ዶ/ር ደረጄ',
    role: 'Director General, Addis Ababa Science & Technology University',
    roleAmharic: 'ዋና ዳይሬክተር፣ አዲስ አበባ ሳይንስ እና ቴክኖሎጂ ዩኒቨርስቲ',
    avatar: 'ደ',
    quote:
      'Enkutatash delivered an outstanding experience for our university event. Their attention to detail, professionalism, and ability to manage large-scale academic gatherings is truly impressive. I highly recommend their services to any institution seeking excellence.',
    rating: 5,
    event: 'University Event',
  },
  {
    name: 'W/o Tsige Jimma',
    nameAmharic: 'ወ/ሮ ፅጌ ጂማ',
    role: 'Deputy Chief Executive, Lemi Kuraa Sub-city',
    roleAmharic: 'ምክትል ስራ አስኪያጅ፣ ለሚ ኩራ ክ/ከተማ',
    avatar: 'ፅ',
    quote:
      'We partnered with Enkutatash for our sub-city official events and the results were remarkable. Their team understands government protocols and delivers with precision. The decoration and stage setup were beyond our expectations — truly a trusted partner.',
    rating: 5,
    event: 'Government Event',
  },
  {
    name: 'Ato Midiksa Kebede',
    nameAmharic: 'አቶ ሚዴቅሳ ከበደ',
    role: 'Deputy Bureau Head, Addis Ababa Peace & Security Administration',
    roleAmharic: 'ምክትል የቢሮ ሀላፊ፣ አዲስ አበባ ሰላምና ፀጥታ አስተዳደር',
    avatar: 'ሚ',
    quote:
      'Enkutatash handled our bureau\'s official ceremony with exceptional professionalism. From sound and lighting to catering and seating arrangements, everything was perfectly coordinated. They are the most reliable event organizer in Addis Ababa.',
    rating: 5,
    event: 'Official Ceremony',
  },
]

const portfolioEvents = [
  {
    title: 'Cultural Festival',
    titleAmharic: 'የባህል ፌስቲቫል',
    category: 'Cultural',
    attendees: '1,000+',
    image: '/events/event-5.jpg',
    description: 'A vibrant outdoor cultural celebration featuring traditional music, dance, and Ethiopian heritage under our signature tent setup.',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
  },
  {
    title: 'Wedding Reception',
    titleAmharic: 'የሰርግ ስብሰባ',
    category: 'Wedding',
    attendees: '350+',
    image: '/events/event-2.jpg',
    description: 'An elegant wedding reception with breathtaking floral backdrops, gold accents, and a sweetheart table setup designed to perfection.',
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
  },
  {
    title: 'Live Concert',
    titleAmharic: 'ቀጥታ ሙዚቃ',
    category: 'Concert',
    attendees: '5,000+',
    image: '/events/event-4.jpg',
    description: 'A spectacular live concert with full stage setup, professional sound systems, dynamic lighting, and traditional Ethiopian performances.',
    gradient: 'from-violet-400 via-purple-500 to-indigo-600',
  },
  {
    title: 'Corporate Event',
    titleAmharic: 'የኮርፖሬት ዝግጅት',
    category: 'Corporate',
    attendees: '500+',
    image: '/events/event-6.jpg',
    description: 'A premium corporate gathering with elegant white leather seating, marble-topped tables, and VIP lounge areas for distinguished guests.',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
  },
  {
    title: 'VIP Lounge Setup',
    titleAmharic: 'ቪአይፒ ሎውንጅ',
    category: 'Corporate',
    attendees: '200+',
    image: '/events/event-7.jpg',
    description: 'Luxury VIP lounge with plush white leather armchairs, gold-framed marble tables, and an elegant atmosphere for exclusive gatherings.',
    gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
  },
  {
    title: 'Grand Wedding',
    titleAmharic: 'ታላቅ ሰርግ',
    category: 'Wedding',
    attendees: '800+',
    image: '/events/event-8.jpg',
    description: 'A grand wedding ceremony in a multi-level venue with floral-patterned aisle, gold-framed VIP chairs, and tiered balcony seating.',
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
  },
  {
    title: 'Formal Ceremony',
    titleAmharic: 'ሥርዓተ ሰርግ',
    category: 'Ceremony',
    attendees: '600+',
    image: '/events/event-9.jpg',
    description: 'A formal ceremony in an elegant auditorium with ornate gold chairs, fresh floral arrangements, and a beautifully decorated grand venue.',
    gradient: 'from-lime-400 via-green-500 to-emerald-600',
  },
  {
    title: 'Musical Performance',
    titleAmharic: 'ሙዚቃዊ ትንታኔ',
    category: 'Concert',
    attendees: '3,000+',
    image: '/events/event-3.jpg',
    description: 'A captivating musical performance with dynamic blue stage lighting, decorative floral columns, and professional broadcast setup.',
    gradient: 'from-violet-400 via-purple-500 to-indigo-600',
  },
  {
    title: 'Event Decoration',
    titleAmharic: 'የዝግጅት ጌጣጌጥ',
    category: 'Decoration',
    attendees: 'Various',
    image: '/events/event-1.jpg',
    description: 'Premium decorative lighting and gold candelabra fixtures that add elegance and warmth to any event setting.',
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
  },
  {
    title: 'Ceremony Hall Setup',
    titleAmharic: 'የሥርዓት አዳራሽ ዝጌጣጌጥ',
    category: 'Ceremony',
    attendees: '600+',
    image: '/events/event-10.jpg',
    description: 'A grand ceremony hall with blue-and-white draped curtains, glass podium, and floral-patterned aisle carpet for a prestigious formal event.',
    gradient: 'from-blue-400 via-indigo-500 to-violet-600',
  },
  {
    title: 'Conference Hall Setup',
    titleAmharic: 'የስብሰባ አዳራሽ ዝጌጣጌጥ',
    category: 'Corporate',
    attendees: '800+',
    image: '/events/event-11.jpg',
    description: 'A spacious conference hall with tiered seating, VIP gold-accented chairs, and marble-topped tables for a high-profile professional gathering.',
    gradient: 'from-slate-400 via-gray-500 to-zinc-600',
  },
  {
    title: 'Elegant Celebration',
    titleAmharic: 'ምሩር ስብሰባ',
    category: 'Celebration',
    attendees: '300+',
    image: '/events/event-12.jpg',
    description: 'An elegant celebration with ornate woven backdrop, vibrant floral arrangements, and traditional Ethiopian decorative elements for a cultural event.',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
  },
  {
    title: 'Diamond Club Symposia',
    titleAmharic: 'ዳያሞንድ ክለብ ሲምፖዚየም',
    category: 'Symposium',
    attendees: '500+',
    image: '/events/event-13.jpg',
    description: 'The Diamond Club Symposia 2025 with professional stage, branded backdrop, Ethiopian flags, and glass podium for a prestigious academic symposium.',
    gradient: 'from-amber-400 via-yellow-500 to-emerald-600',
  },
  {
    title: 'Official Government Event',
    titleAmharic: 'የመንግስት ዝግጅት',
    category: 'Government',
    attendees: '400+',
    image: '/events/event-14.jpg',
    description: 'A formal government event with blue curtain backdrop, green carpet stage, Amharic banner, and podium for an official ceremony.',
    gradient: 'from-blue-400 via-cyan-500 to-teal-600',
  },
  {
    title: 'National Celebration',
    titleAmharic: 'ብሔራዊ በዓል',
    category: 'Cultural',
    attendees: '10,000+',
    image: '/events/event-15.jpg',
    description: 'A massive public national celebration with thousands waving Ethiopian flags, large tent stage, and organized crowd in matching vests.',
    gradient: 'from-green-400 via-yellow-500 to-red-500',
  },
  {
    title: 'Elegant Indoor Gala',
    titleAmharic: 'ምሩር ውስጥ ጋላ',
    category: 'Ceremony',
    attendees: '300+',
    image: '/events/event-16.jpg',
    description: 'An elegant indoor gala with vibrant yellow floral-patterned green carpet aisle, blue and gold-framed VIP chairs, and multi-level balcony seating in a grand hall.',
    gradient: 'from-yellow-400 via-amber-500 to-orange-600',
  },
  {
    title: 'Formal Auditorium Conference',
    titleAmharic: 'የአዳራሽ ስብሰባ',
    category: 'Corporate',
    attendees: '300+',
    image: '/events/event-17.jpg',
    description: 'A formal conference in a multi-level auditorium with blue carpet, white polka dots, ornate gold chairs, marble-topped tables, and tiered balcony seating.',
    gradient: 'from-blue-400 via-indigo-500 to-violet-600',
  },
  {
    title: 'Grand Stage Ceremony',
    titleAmharic: 'ታላቅ የመድረክ ሥርዓት',
    category: 'Ceremony',
    attendees: '100+',
    image: '/events/event-18.jpg',
    description: 'A grand stage ceremony with blue and white draped curtains, glass podium, and a vibrant yellow-and-green floral-patterned carpet aisle in an elegant hall.',
    gradient: 'from-teal-400 via-cyan-500 to-blue-600',
  },
  {
    title: 'Professional Conference Setup',
    titleAmharic: 'ሙያዊ የስብሰባ ዝጌጣጌጥ',
    category: 'Corporate',
    attendees: '300+',
    image: '/events/event-19.jpg',
    description: 'A professional conference setup in a spacious multi-level venue with gold-accented VIP chairs, floral arrangements on marble tables, and tiered upper-level seating.',
    gradient: 'from-slate-400 via-blue-500 to-indigo-600',
  },
  {
    title: 'Elegant Wedding Ceremony',
    titleAmharic: 'ምሩር የሰርግ ሥርዓት',
    category: 'Wedding',
    attendees: '150+',
    image: '/events/event-20.jpg',
    description: 'An elegant wedding ceremony with golden circular-patterned backdrop, red and white floral arrangements, ornate wooden chairs, and chandelier-lit hall.',
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
  },
  {
    title: 'Academic Symposium',
    titleAmharic: 'የትምህርት ሲምፖዚየም',
    category: 'Symposium',
    attendees: '200+',
    image: '/events/event-21.jpg',
    description: 'An academic symposium with professional stage setup, branded backdrop with Ethiopian flags, transparent podium, and green carpet stage at Addis Ababa Science and Technology University.',
    gradient: 'from-emerald-400 via-green-500 to-teal-600',
  },
  {
    title: 'Official Conference',
    titleAmharic: 'የመንግስት ስብሰባ',
    category: 'Government',
    attendees: '150+',
    image: '/events/event-22.jpg',
    description: 'An official government conference with Amharic banner, blue curtain backdrop, green carpet stage, central podium, and gold-accented VIP seating.',
    gradient: 'from-blue-400 via-cyan-500 to-teal-600',
  },
  {
    title: 'Patriotic Rally',
    titleAmharic: 'አገር አፍቃሪ ሰልፍ',
    category: 'Cultural',
    attendees: '2,000+',
    image: '/events/event-23.jpg',
    description: 'A large-scale patriotic rally with thousands waving Ethiopian flags, blue tent stage, organized crowd in matching vests, and an outdoor grassy field venue.',
    gradient: 'from-green-400 via-yellow-500 to-red-500',
  },
  {
    title: 'Corporate Floral Display',
    titleAmharic: 'የኮርፖሬት የአበባ ውበት',
    category: 'Decoration',
    attendees: '30+',
    image: '/events/event-24.jpg',
    description: 'A stunning corporate floral centerpiece with red, pink, and orange roses arranged in a lavish bouquet, set in a modern office lobby with marble finishes.',
    gradient: 'from-rose-400 via-pink-500 to-red-600',
  },
  {
    title: 'Intimate Wedding Setup',
    titleAmharic: 'የቤተሰብ ሰርግ ዝጌጣጌጥ',
    category: 'Wedding',
    attendees: '50+',
    image: '/events/event-25.jpg',
    description: 'An intimate wedding setup with chrome circular-backrest chairs on a shaggy rug, white draped curtain backdrop adorned with hanging floral garlands.',
    gradient: 'from-pink-400 via-rose-500 to-red-500',
  },
  {
    title: 'Cultural Decor Showcase',
    titleAmharic: 'የባህል ጌጣጌጥ ማሳያ',
    category: 'Decoration',
    attendees: 'Various',
    image: '/events/event-26.jpg',
    description: 'A rustic cultural decor display with peach and purple drapes, woven straw hats, ornate white chair, and traditional Ethiopian decorative elements against a stone wall.',
    gradient: 'from-purple-400 via-violet-500 to-indigo-600',
  },
  {
    title: 'Event Furniture Collection',
    titleAmharic: 'የዝግጅት ዕቃዎች ስብስብ',
    category: 'Decoration',
    attendees: 'Various',
    image: '/events/event-27.jpg',
    description: 'An impressive collection of elegant event furniture including high-backed cream chairs with gold frames, ornate wooden chairs, and premium seating arrangements.',
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
  },
]

const stats = [
  { value: '500+', label: 'Events Organized', icon: CalendarDays },
  { value: '50K+', label: 'Happy Guests', icon: Users },
  { value: '4+', label: 'Years of Excellence', icon: Award },
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
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <Image
              src="/enkutatash-logo.png"
              alt="Enkutatash Logo"
              width={40}
              height={40}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-contain"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-lg sm:text-xl font-bold tracking-tight">
                Enkutatash
              </span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground leading-none hidden xs:block">
                እንቁጣጣሽ ኤቨንት
              </span>
            </div>
          </div>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
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
          <div className="hidden lg:flex items-center gap-3">
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
          <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
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
            className="lg:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {['About', 'Services', 'Portfolio', 'Testimonials', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-sm text-muted-foreground hover:text-foreground py-2.5 min-h-[44px] flex items-center"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => { setAppView('app'); setMobileOpen(false) }}
                  className="w-full min-h-[44px]"
                >
                  Owner Login
                </Button>
                <Button
                  onClick={() => { setMobileOpen(false); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white min-h-[44px]"
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
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 md:pt-44 md:pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/4 h-48 sm:h-72 w-48 sm:w-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-20 right-1/4 h-48 sm:h-72 w-48 sm:w-72 rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 sm:h-96 w-64 sm:w-96 rounded-full bg-teal-500/3 blur-3xl" />
      </div>

      {/* Decorative pattern */}
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
              className="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 text-[11px] sm:text-sm font-medium border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 flex-wrap justify-center"
            >
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5" />
              <span>Premium Event Organizers in Addis Ababa</span>
              <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 ml-1" />
            </Badge>
          </motion.div>

          {/* Amharic subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-base sm:text-lg md:text-xl text-emerald-600 dark:text-emerald-400 font-medium mb-2"
          >
            እንቁጣጣሽ ኤቨንት
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-tight"
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
            className="mt-3 sm:mt-6 text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
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
            className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            <Button
              size="lg"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 px-5 sm:px-8 h-12 sm:h-12 text-sm sm:text-base w-full sm:w-auto min-h-[44px]"
            >
              Book Your Event
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
            <a href="tel:+251915895757" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="px-5 sm:px-8 h-12 sm:h-12 text-sm sm:text-base group w-full min-h-[44px]"
              >
                <Phone className="mr-2 h-4 w-4 group-hover:text-emerald-600 transition-colors" />
                Call Us Now
              </Button>
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 sm:mt-12 flex flex-col items-center gap-3"
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
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
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
          className="mt-8 sm:mt-16 md:mt-20 relative"
        >
          <div className="relative rounded-xl sm:rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl shadow-emerald-500/5 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 border-b border-border/50 bg-muted/30">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-400/80" />
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400/80" />
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[10px] sm:text-xs text-muted-foreground">enkutatashevents.com</span>
              </div>
            </div>
            {/* Preview content - Event showcase */}
            <div className="p-2 sm:p-6 md:p-8 bg-gradient-to-br from-muted/20 to-muted/5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-6">
                {portfolioEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.title}
                    className="relative rounded-lg sm:rounded-xl overflow-hidden aspect-[4/3] flex flex-col justify-end"
                  >
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="relative z-10 p-2.5 sm:p-3 md:p-4">
                      <Badge className="w-fit text-[9px] sm:text-[10px] bg-white/20 text-white border-0 mb-1 sm:mb-2 backdrop-blur-sm">
                        {event.category}
                      </Badge>
                      <p className="text-xs sm:text-sm font-bold leading-tight text-white">{event.title}</p>
                      <p className="text-[10px] sm:text-sm text-white/80 mt-0.5 sm:mt-1">{event.attendees} guests</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-3">
                {[
                  { label: 'Events', value: '500+', icon: CalendarDays },
                  { label: 'Guests', value: '50K+', icon: Users },
                  { label: 'Years', value: '4+', icon: Award },
                  { label: 'Rating', value: '4.9/5', icon: Star },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div
                      key={stat.label}
                      className="rounded-lg sm:rounded-xl bg-background/60 border border-border/30 p-2 sm:p-3 md:p-4 flex items-center gap-2 sm:gap-3"
                    >
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
          {/* Glow effect behind preview */}
          <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-amber-500/5 blur-2xl" />
        </motion.div>
      </div>
    </section>
  )
}

function StatsSection() {
  return (
    <section className="py-8 sm:py-16 border-y border-border/50 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <motion.div key={stat.label} variants={staggerItem} className="text-center">
                <div className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-2 sm:mb-3">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-[11px] sm:text-sm text-muted-foreground mt-1">{stat.label}</p>
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
    <section id="about" className="py-12 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-500 p-[1px]">
              <div className="h-full w-full rounded-xl sm:rounded-2xl bg-background flex flex-col items-center justify-center p-4 sm:p-8 text-center">
                <Image
                  src="/enkutatash-logo.png"
                  alt="Enkutatash Logo"
                  width={80}
                  height={80}
                  className="h-14 w-14 sm:h-20 sm:w-20 rounded-2xl object-contain mb-3 sm:mb-6"
                />
                <h3 className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-2">Enkutatash</h3>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm sm:text-base font-medium mb-0.5">እንቁጣጣሽ ኤቨንት</p>
                <p className="text-muted-foreground text-xs sm:text-sm">Premium Event Organizers</p>
                <div className="mt-3 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-xs">
                  <div className="rounded-lg sm:rounded-xl bg-emerald-500/5 border border-emerald-500/10 p-2 sm:p-3">
                    <p className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">4+</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Years</p>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-amber-500/5 border border-amber-500/10 p-2 sm:p-3">
                    <p className="text-lg sm:text-xl font-bold text-amber-600 dark:text-amber-400">500+</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Events</p>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-teal-500/5 border border-teal-500/10 p-2 sm:p-3">
                    <p className="text-lg sm:text-xl font-bold text-teal-600 dark:text-teal-400">50K+</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Guests</p>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-rose-500/5 border border-rose-500/10 p-2 sm:p-3">
                    <p className="text-lg sm:text-xl font-bold text-rose-600 dark:text-rose-400">4.9</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 h-16 sm:h-24 w-16 sm:w-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 -z-10 opacity-20 blur-xl" />
            <div className="absolute -top-4 sm:-top-6 -left-4 sm:-left-6 h-16 sm:h-24 w-16 sm:w-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 -z-10 opacity-20 blur-xl" />
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
              About Us
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Crafting Unforgettable
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> Moments Since 2022</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg leading-relaxed">
              Named after the Ethiopian New Year — a celebration of new beginnings and fresh possibilities — 
              Enkutatash was founded with a simple belief: every event deserves to be extraordinary. Based in 
              the heart of Addis Ababa, we have been transforming ordinary occasions into 
              legendary experiences.
            </p>
            <p className="mt-2 sm:mt-4 text-muted-foreground text-xs sm:text-base leading-relaxed">
              Our team of creative professionals brings together expertise in event design, production, 
              catering coordination, and logistics management. We understand the unique cultural nuances that 
              make Ethiopian celebrations special, while also delivering world-class standards that impress 
              international guests. Whether it is a traditional wedding with hundreds of guests or a sleek 
              corporate product launch, we approach every event with the same passion and meticulous attention 
              to detail.
            </p>
            <div className="mt-3 sm:mt-6 space-y-1.5 sm:space-y-3">
              {[
                'End-to-end event planning and execution',
                'Award-winning creative design team',
                'Strong vendor network across Addis Ababa',
                'Dedicated project manager for every event',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 sm:gap-3">
                  <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm">{item}</span>
                </div>
              ))}
            </div>
            <Button
              className="mt-4 sm:mt-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 min-h-[44px]"
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
    <section id="services" className="py-12 sm:py-20 md:py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-16"
        >
          <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            Our Services
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Whatever the occasion,
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> we make it extraordinary</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg">
            From intimate gatherings to grand spectacles, our team delivers world-class event experiences tailored to your vision.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon
            return (
              <motion.div key={service.title} variants={staggerItem} whileHover={{ y: -4 }} className="group">
                <Card className="h-full rounded-xl sm:rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-emerald-500/20">
                  <CardContent className="p-4 sm:p-6">
                    <div className={`inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl ${service.bgGlow} mb-3 sm:mb-4`}>
                      <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg sm:rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center`}>
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<typeof portfolioEvents[0] | null>(null)

  // Determine which events get the "large" treatment in the grid
  const largeIndices = [0, 7, 12, 17, 22] // Events at these positions get row-span-2

  return (
    <section id="portfolio" className="py-12 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-16"
        >
          <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            Our Portfolio
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Events that
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> speak for themselves</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg">
            A glimpse into some of our most memorable events — each one a unique story of creativity and flawless execution.
          </p>
        </motion.div>

        {/* Dynamic gallery grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4"
        >
          {portfolioEvents.map((event, index) => {
            const isLarge = largeIndices.includes(index)
            return (
              <motion.div
                key={event.title}
                variants={staggerItem}
                className={`${isLarge ? 'row-span-2' : ''} group cursor-pointer`}
                onClick={() => { setSelectedImage(event.image); setSelectedEvent(event) }}
              >
                <div className={`relative rounded-xl sm:rounded-2xl overflow-hidden ${isLarge ? 'h-full min-h-[250px] sm:min-h-[400px]' : 'aspect-[4/3]'}`}>
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className={`absolute bottom-0 left-0 right-0 ${isLarge ? 'p-3 sm:p-5' : 'p-2.5 sm:p-4'}`}>
                    <Badge className={`w-fit ${isLarge ? 'text-[9px] sm:text-xs' : 'text-[8px] sm:text-[10px]'} bg-white/20 text-white border-0 mb-1 ${isLarge ? 'sm:mb-2' : ''} backdrop-blur-sm`}>
                      {event.category}
                    </Badge>
                    <h3 className={`${isLarge ? 'text-sm sm:text-lg' : 'text-xs sm:text-sm'} font-bold text-white`}>{event.title}</h3>
                    <p className="text-[8px] sm:text-[10px] text-white/80 mt-0.5">{event.titleAmharic}</p>
                    {isLarge && (
                      <p className="text-[10px] sm:text-sm text-white/70 mt-1">{event.attendees} guests</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => { setSelectedImage(null); setSelectedEvent(null) }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative max-w-4xl w-full max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => { setSelectedImage(null); setSelectedEvent(null) }}
                  className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors z-10"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="relative rounded-2xl overflow-hidden bg-black">
                  <Image
                    src={selectedImage}
                    alt={selectedEvent.title}
                    width={1200}
                    height={800}
                    className="object-contain w-full max-h-[70vh]"
                  />
                </div>
                <div className="mt-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="text-xs bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                      {selectedEvent.category}
                    </Badge>
                    <span className="text-xs text-white/50">{selectedEvent.attendees} guests</span>
                  </div>
                  <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                  <p className="text-sm text-emerald-400 mt-0.5">{selectedEvent.titleAmharic}</p>
                  <p className="text-sm text-white/70 mt-2">{selectedEvent.description}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="group min-h-[44px]"
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
    <section id="testimonials" className="py-12 sm:py-20 md:py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-16"
        >
          <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            Testimonials
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            What our clients
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> say about us</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg">
            Don&apos;t just take our word for it — hear from the people who have experienced the Enkutatash difference.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={staggerItem} whileHover={{ y: -4 }}>
              <Card className="h-full rounded-xl sm:rounded-2xl border-border/50 shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Badge variant="secondary" className="text-[9px] sm:text-[10px]">
                      {testimonial.event}
                    </Badge>
                  </div>
                  <Quote className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500/30 mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-sm sm:text-base font-bold shrink-0">
                      {testimonial.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold truncate">{testimonial.name}</p>
                      {'nameAmharic' in testimonial && testimonial.nameAmharic && (
                        <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 font-medium truncate">{testimonial.nameAmharic as string}</p>
                      )}
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{testimonial.role}</p>
                      {'roleAmharic' in testimonial && testimonial.roleAmharic && (
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground/70 truncate">{testimonial.roleAmharic as string}</p>
                      )}
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
    <section className="py-12 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-16"
        >
          <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
            How It Works
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            From vision to reality
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> in 4 steps</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6"
        >
          {steps.map((step, index) => (
            <motion.div key={step.number} variants={staggerItem}>
              <div className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-px border-t border-dashed border-emerald-500/20" />
                )}
                <div className="text-center">
                  <div className="inline-flex h-10 w-10 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-3 sm:mb-4">
                    <span className="text-sm sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{step.title}</h3>
                  <p className="text-[11px] sm:text-sm text-muted-foreground leading-relaxed px-1">{step.description}</p>
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
    <section id="contact" className="py-12 sm:py-20 md:py-28 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Left - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-3 sm:mb-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400">
              Get in Touch
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Let&apos;s create something
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"> extraordinary</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-muted-foreground text-sm sm:text-lg leading-relaxed">
              Ready to bring your event vision to life? Reach out to us and let&apos;s start planning. 
              Every great event begins with a conversation.
            </p>

            <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Call Us</p>
                  <a href="tel:+251915895757" className="text-xs sm:text-sm text-muted-foreground hover:text-emerald-600 transition-colors block">+251 915 895 757</a>
                  <a href="tel:+251915843131" className="text-xs sm:text-sm text-muted-foreground hover:text-emerald-600 transition-colors block">+251 915 843 131</a>
                  <a href="tel:+251910977371" className="text-xs sm:text-sm text-muted-foreground hover:text-emerald-600 transition-colors block">+251 910 977 371</a>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Email Us</p>
                  <a href="mailto:enkutatashevents@gmail.com" className="text-xs sm:text-sm text-muted-foreground hover:text-emerald-600 transition-colors block">enkutatashevents@gmail.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Visit Us</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Ayat, Addis Ababa</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Ethiopia</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-medium text-sm sm:text-base">Working Hours</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Mon - Fri: 8:00 AM - 6:00 PM</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Sat: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="mt-6 sm:mt-8 flex gap-2 sm:gap-3">
              {[
                { icon: Instagram, label: 'Instagram' },
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
              ].map((social) => {
                const Icon = social.icon
                return (
                  <Button key={social.label} variant="outline" size="icon" className="h-10 w-10 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl min-h-[44px] min-w-[44px]">
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
            <Card className="rounded-xl sm:rounded-2xl border-border/50">
              <CardContent className="p-4 sm:p-6 md:p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 sm:py-12 text-center"
                  >
                    <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3 sm:mb-4">
                      <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-sm text-muted-foreground">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-1.5 block">Full Name</label>
                        <Input
                          placeholder="Your name"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                          required
                          className="h-10 sm:h-11 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-1.5 block">Email</label>
                        <Input
                          type="email"
                          placeholder="you@email.com"
                          value={formState.email}
                          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                          required
                          className="h-10 sm:h-11 min-h-[44px]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-1.5 block">Phone Number</label>
                        <Input
                          placeholder="+251 ..."
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                          className="h-10 sm:h-11 min-h-[44px]"
                        />
                      </div>
                      <div>
                        <label className="text-xs sm:text-sm font-medium mb-1.5 block">Event Type</label>
                        <Input
                          placeholder="Wedding, Corporate, etc."
                          value={formState.eventType}
                          onChange={(e) => setFormState({ ...formState, eventType: e.target.value })}
                          className="h-10 sm:h-11 min-h-[44px]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium mb-1.5 block">Tell Us About Your Event</label>
                      <Textarea
                        placeholder="Share your vision — date, venue preferences, number of guests, special requirements..."
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                        required
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 h-11 sm:h-11 min-h-[44px]"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
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
    <section className="py-12 sm:py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5 }}
          className="relative rounded-xl sm:rounded-3xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-amber-600" />
          <div className="absolute inset-0 bg-grid-white/5 bg-[size:40px_40px]" />
          
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 h-48 sm:h-64 w-48 sm:w-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 h-32 sm:h-48 w-32 sm:w-48 rounded-full bg-white/5 translate-y-1/3 -translate-x-1/4" />

          <div className="relative px-4 py-10 sm:px-6 sm:py-16 md:px-16 md:py-20 text-center">
            <Sparkles className="h-7 w-7 sm:h-12 sm:w-12 text-white/80 mx-auto mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
              Your Next Event Deserves
              <br />
              the Enkutatash Touch
            </h2>
            <p className="mt-3 sm:mt-4 text-white/80 text-sm sm:text-lg max-w-xl mx-auto">
              Let us transform your vision into an unforgettable experience. 
              Book a free consultation today and discover why hundreds of clients trust us.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-emerald-700 hover:bg-white/90 shadow-xl w-full sm:w-auto px-5 sm:px-8 h-11 sm:h-12 text-sm sm:text-base font-semibold min-h-[44px]"
              >
                Book a Free Consultation
                <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
              <a href="tel:+251915895757" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto px-5 sm:px-8 h-11 sm:h-12 text-sm sm:text-base min-h-[44px]"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Us Now
                </Button>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-6 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-6 sm:mb-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Image
                src="/enkutatash-logo.png"
                alt="Enkutatash Logo"
                width={32}
                height={32}
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg object-contain"
              />
              <div className="flex flex-col leading-tight">
                <span className="text-base sm:text-lg font-bold">Enkutatash</span>
                <span className="text-[8px] sm:text-[10px] text-muted-foreground">እንቁጣጣሽ ኤቨንት</span>
              </div>
            </div>
            <p className="text-[11px] sm:text-sm text-muted-foreground max-w-xs">
              Addis Ababa&apos;s premier event organizer. Crafting legendary experiences since 2018.
            </p>
            <div className="mt-3 sm:mt-4 flex gap-1.5 sm:gap-2">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <Button key={i} variant="ghost" size="icon" className="h-10 w-10 sm:h-8 sm:w-8 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0">
                  <Icon className="h-4 w-4 sm:h-4 sm:w-4" />
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[11px] sm:text-sm font-semibold mb-2 sm:mb-3">Services</h4>
            <ul className="space-y-1 sm:space-y-2">
              {['Advert & Promotion', 'Event Organization', 'Decoration', 'Stage & Tent', 'Sound & Light', 'Chair & Table', 'Catering', 'Kids Games'].map((item) => (
                <li key={item}>
                  <a className="text-[10px] sm:text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer block py-0.5 min-h-[28px] sm:min-h-0 flex items-center">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] sm:text-sm font-semibold mb-2 sm:mb-3">Company</h4>
            <ul className="space-y-1 sm:space-y-2">
              {['About Us', 'Portfolio', 'Testimonials', 'Contact'].map((item) => (
                <li key={item}>
                  <a className="text-[10px] sm:text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] sm:text-sm font-semibold mb-2 sm:mb-3">Contact</h4>
            <ul className="space-y-1 sm:space-y-2">
              <li className="text-[10px] sm:text-sm text-muted-foreground">+251 915 895 757</li>
              <li className="text-[10px] sm:text-sm text-muted-foreground">+251 915 843 131</li>
              <li className="text-[10px] sm:text-sm text-muted-foreground break-all">enkutatashevents@gmail.com</li>
              <li className="text-[10px] sm:text-sm text-muted-foreground">Ayat, Addis Ababa</li>
            </ul>
          </div>
        </div>
        <div className="pt-6 sm:pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-sm text-muted-foreground">
            &copy; 2026 Enkutatash Event / እንቁጣጣሽ ኤቨንት. All rights reserved.
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <a className="text-[10px] sm:text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Privacy Policy</a>
            <a className="text-[10px] sm:text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Terms of Service</a>
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
