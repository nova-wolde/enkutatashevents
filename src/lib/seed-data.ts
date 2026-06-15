/**
 * Centralized seed data for the Enkutatash Event website.
 * Extracted from individual API route files for reuse.
 */

// ─── Event Gradients ───────────────────────────────────────────────────────────
export const gradients = [
  "from-emerald-400 to-teal-600",
  "from-violet-400 to-purple-600",
  "from-amber-400 to-orange-600",
  "from-rose-400 to-pink-600",
  "from-cyan-400 to-sky-600",
  "from-lime-400 to-green-600",
  "from-fuchsia-400 to-purple-600",
  "from-teal-400 to-emerald-600",
  "from-orange-400 to-red-600",
  "from-indigo-400 to-violet-600",
]

// ─── Seed Events ───────────────────────────────────────────────────────────────
export function getSeedEvents() {
  return [
    { id: "1", name: "Meskel Festival Celebration", date: "2026-09-27", time: "09:00", venue: "Meskel Square, Addis Ababa", attendees: 1200, maxAttendees: 2000, category: "Cultural", status: "upcoming", description: "A grand cultural celebration of Meskel featuring traditional music, bonfire ceremony, and Ethiopian heritage performances.", ticketPrice: 0, imageGradient: gradients[0] },
    { id: "2", name: "Addis Corporate Summit 2026", date: "2026-07-15", time: "08:30", venue: "Hyatt Regency Addis Ababa", attendees: 280, maxAttendees: 400, category: "Corporate", status: "upcoming", description: "A premium corporate gathering with keynote speakers from leading Ethiopian businesses, networking sessions, and VIP dinner.", ticketPrice: 5000, imageGradient: gradients[1] },
    { id: "3", name: "Abebe & Selamawit Wedding", date: "2026-08-10", time: "14:00", venue: "Sheraton Addis Grand Ballroom", attendees: 450, maxAttendees: 500, category: "Wedding", status: "upcoming", description: "A luxurious wedding ceremony and reception with traditional Ethiopian and modern decoration, live music, and premium catering.", ticketPrice: 0, imageGradient: gradients[2] },
    { id: "4", name: "Ethio Jazz Night", date: "2026-06-20", time: "19:00", venue: "African Jazz Village, Addis Ababa", attendees: 180, maxAttendees: 250, category: "Concert", status: "ongoing", description: "An evening of Ethio-jazz performances featuring renowned musicians, with premium sound and lighting setup.", ticketPrice: 1500, imageGradient: gradients[3] },
    { id: "5", name: "Diamond Club Symposium 2026", date: "2026-05-15", time: "09:00", venue: "Addis Ababa University Main Hall", attendees: 500, maxAttendees: 500, category: "Symposium", status: "completed", description: "The annual Diamond Club Symposia with academic presentations, panel discussions, and networking for scholars and professionals.", ticketPrice: 2000, imageGradient: gradients[4] },
    { id: "6", name: "National Day Celebration", date: "2026-09-12", time: "10:00", venue: "Millennium Hall, Addis Ababa", attendees: 3000, maxAttendees: 5000, category: "Government", status: "upcoming", description: "A formal government event celebrating the Ethiopian National Day with official ceremonies, cultural displays, and public festivities.", ticketPrice: 0, imageGradient: gradients[5] },
    { id: "7", name: "Teff & Coffee Cultural Festival", date: "2026-04-22", time: "11:00", venue: "Unity Park, Addis Ababa", attendees: 800, maxAttendees: 1000, category: "Cultural", status: "completed", description: "A vibrant cultural festival celebrating Ethiopian teff and coffee heritage with traditional food, coffee ceremonies, and live performances.", ticketPrice: 300, imageGradient: gradients[6] },
    { id: "8", name: "Tech Hub Launch Event", date: "2026-03-10", time: "15:00", venue: "ICT Park, Addis Ababa", attendees: 0, maxAttendees: 200, category: "Corporate", status: "cancelled", description: "Technology hub launch event has been postponed due to construction delays.", ticketPrice: 0, imageGradient: gradients[7] },
    { id: "9", name: "Ethiopian New Year Gala — Enkutatash 2019", date: "2026-09-11", time: "18:00", venue: "Sheraton Addis Grand Ballroom", attendees: 350, maxAttendees: 400, category: "Cultural", status: "upcoming", description: "An elegant Ethiopian New Year celebration featuring traditional music, cultural dances, gourmet Ethiopian cuisine, and a spectacular stage setup.", ticketPrice: 3500, imageGradient: gradients[8] },
    { id: "10", name: "Lemi Kuraa Sub-city Official Event", date: "2026-07-28", time: "09:30", venue: "Lemi Kuraa Sub-city Hall", attendees: 200, maxAttendees: 300, category: "Government", status: "upcoming", description: "An official government event for Lemi Kuraa Sub-city with formal seating, stage setup, and protocol-compliant decoration.", ticketPrice: 0, imageGradient: gradients[9] },
  ]
}

// ─── Seed Activities ───────────────────────────────────────────────────────────
export function getSeedActivities() {
  return [
    { id: "a1", user: "Kidane Tadesse", avatar: "KT", action: "submitted a booking for", target: "Wedding Reception", timestamp: "2026-06-05T00:00:00.000Z" },
    { id: "a2", user: "Enkutatash Team", avatar: "ET", action: "set up venue at", target: "Sheraton Addis", timestamp: "2026-06-04T22:00:00.000Z" },
    { id: "a3", user: "Meron Bekele", avatar: "MB", action: "confirmed booking for", target: "Corporate Summit", timestamp: "2026-06-04T20:00:00.000Z" },
    { id: "a4", user: "Yohannes Alemu", avatar: "YA", action: "sent a message about", target: "Concert Setup", timestamp: "2026-06-04T18:00:00.000Z" },
    { id: "a5", user: "Sara Girma", avatar: "SG", action: "booked catering for", target: "Meskel Festival", timestamp: "2026-06-04T16:00:00.000Z" },
    { id: "a6", user: "Enkutatash Team", avatar: "ET", action: "completed decoration for", target: "Diamond Club Symposium", timestamp: "2026-06-04T12:00:00.000Z" },
    { id: "a7", user: "Abebe Worku", avatar: "AW", action: "registered for", target: "Ethiopian New Year Gala", timestamp: "2026-06-03T00:00:00.000Z" },
    { id: "a8", user: "Helen Desta", avatar: "HD", action: "requested sound & light for", target: "Ethio Jazz Night", timestamp: "2026-06-02T12:00:00.000Z" },
  ]
}

// ─── Seed Site Content ─────────────────────────────────────────────────────────
export function getSeedSiteContent(): Record<string, unknown> {
  return {
    businessName: "Enkutatash",
    businessNameAmharic: "እንቁጣጣሽ ኤቨንት",
    tagline: "Premium Event Organizers in Addis Ababa",
    taglineAmharic: "በአዲስ አበባ ፕሪሚየም ዝግጅት አደራጆች",
    description: "Addis Ababa's premier event organizer. Crafting legendary experiences since 2022.",
    descriptionAmharic: "ከ2022 ዓ.ም ጀምሮ ያልተረሳ ትዝታዎችን እያደራጅን",
    foundedYear: "2022",
    email: "enkutatashevents@gmail.com",
    phones: ["+251 915 895 757", "+251 915 843 131", "+251 910 977 371"],
    phoneLinks: ["+251915895757", "+251915843131", "+251910977371"],
    address: "Ayat, Addis Ababa",
    addressAmharic: "አያት፣ አዲስ አበባ",
    workingHours: [
      { day: "Mon - Fri", hours: "8:00 AM - 6:00 PM" },
      { day: "Sat", hours: "9:00 AM - 2:00 PM" },
    ],
    socialLinks: [
      { platform: "Instagram", url: "https://www.instagram.com/enkutatashevents/" },
      { platform: "Facebook", url: "https://web.facebook.com/profile.php?id=61590503624575" },
      { platform: "YouTube", url: "https://www.youtube.com/@Enkutatashevents" },
      { platform: "Telegram", url: "https://t.me/httpenkutatashevent" },
      { platform: "WhatsApp", url: "https://whatsapp.com/channel/0029VbDBLNS6WaKf4RGzel3r" },
    ],

    // Hero Section
    heroTitle: "Where Every Event Becomes Legendary",
    heroTitleAmharic: "እንቁጣጣሽ ኤቨንት",
    heroSubtitle: "Enkutatash is Addis Ababa's premier event organizer. From breathtaking weddings to large-scale corporate events and cultural celebrations — we bring your vision to life with elegance, precision, and a touch of creativity.",
    heroBadge: "Premium Event Organizers in Addis Ababa",

    // About Section
    aboutTitle: "Crafting Unforgettable Moments Since 2022",
    aboutSubtitle: "ከ2022 ዓ.ም ጀምሮ ያልተረሳ ትዝታዎችን እያደራጅን",
    aboutDescription: "Named after the Ethiopian New Year, Enkutatash was founded with a simple belief: every event deserves to be extraordinary. Based in Addis Ababa, we transform ordinary occasions into legendary experiences with cultural understanding and world-class standards.",
    aboutHighlights: [
      "End-to-end event planning",
      "Award-winning design team",
      "Strong vendor network",
      "Dedicated project manager",
      "Full sound & light supply",
      "Catering & decoration",
    ],

    // Vision, Mission, Goals, Objectives
    vision: "To be the leading events management service provider for corporate events, delivering exceptional experiences and exceeding client expectations across Ethiopia.",
    visionAmharic: "ራዕያችን",
    mission: "To create memorable and impactful corporate events that engage and inspire attendees, transforming gatherings into powerful experiences through innovative design and meticulous planning.",
    missionAmharic: "ተልዕኳችን",
    goals: [
      { icon: "Heart", title: "Client Satisfaction", titleAmharic: "የደንበኛ እርካታ", gradient: "from-rose-500 to-pink-600" },
      { icon: "Sparkles", title: "Exceptional Experiences", titleAmharic: "ልዩ ልምዶች", gradient: "from-amber-500 to-orange-600" },
      { icon: "Shield", title: "Professionalism & Reliability", titleAmharic: "ሙያዊነትና አስተማማኝነት", gradient: "from-blue-500 to-indigo-600" },
      { icon: "TrendingUp", title: "Growth & Expansion", titleAmharic: "እድገትና ስፋት", gradient: "from-emerald-500 to-teal-600" },
      { icon: "Award", title: "Industry Leadership", titleAmharic: "የኢንዱስትሪ መሪነት", gradient: "from-violet-500 to-purple-600" },
    ],
    objectives: [
      { icon: "Target", title: "Tailored Planning", description: "Comprehensive planning tailored to corporate client needs" },
      { icon: "CheckCircle2", title: "Meticulous Detail", description: "Attention to detail in venue, logistics, catering & AV" },
      { icon: "Handshake", title: "Brand Alignment", description: "Events aligned with your brand identity and objectives" },
      { icon: "Megaphone", title: "Strategic Promotion", description: "Marketing strategies to attract your target audience" },
      { icon: "Lightbulb", title: "Technology-Driven", description: "Modern tools for streamlined, efficient delivery" },
      { icon: "Users", title: "Vendor Excellence", description: "Strong vendor relationships for reliable services" },
      { icon: "Rocket", title: "Innovation First", description: "Latest industry trends incorporated into every event" },
      { icon: "BarChart3", title: "Continuous Improvement", description: "Feedback-driven improvement for future events" },
    ],

    // Stats
    stats: [
      { value: "500+", label: "Events Organized", labelAmharic: "", icon: "CalendarDays" },
      { value: "50K+", label: "Happy Guests", labelAmharic: "", icon: "Users" },
      { value: "4+", label: "Years of Excellence", labelAmharic: "", icon: "Award" },
      { value: "4.9", label: "Average Rating", labelAmharic: "", icon: "Star" },
    ],

    // Services
    services: [
      { id: "s1", title: "Advert & Promotion", titleAmharic: "", description: "Strategic advertising and promotional campaigns to maximize your event's reach. We handle social media marketing, print materials, radio spots, and digital advertising to ensure your event gets the attention it deserves across Addis Ababa and beyond.", descriptionAmharic: "", icon: "Megaphone", gradient: "from-amber-500 to-orange-600", bgGlow: "bg-amber-500/10" },
      { id: "s2", title: "Event Organization", titleAmharic: "", description: "Full-service event planning and management from concept to completion. Whether it's a grand wedding, corporate conference, or cultural celebration, our experienced team coordinates every detail to deliver a seamless and memorable experience.", descriptionAmharic: "", icon: "PartyPopper", gradient: "from-emerald-500 to-teal-600", bgGlow: "bg-emerald-500/10" },
      { id: "s3", title: "Decoration", titleAmharic: "", description: "Stunning decorative designs tailored to your theme and vision. From elegant floral arrangements and balloon artistry to traditional Ethiopian motifs and modern aesthetics, our decoration team transforms any venue into a breathtaking setting.", descriptionAmharic: "", icon: "Palette", gradient: "from-rose-500 to-pink-600", bgGlow: "bg-rose-500/10" },
      { id: "s4", title: "Stage & Tent Rent", titleAmharic: "", description: "Professional stage setups and tent rentals for events of any scale. We provide high-quality tents, custom-built stages, podiums, and backdrop systems suitable for outdoor weddings, concerts, corporate events, and community gatherings.", descriptionAmharic: "", icon: "Tent", gradient: "from-violet-500 to-purple-600", bgGlow: "bg-violet-500/10" },
      { id: "s5", title: "Sound & Light Supply", titleAmharic: "", description: "State-of-the-art sound systems and professional lighting setups for events of all sizes. From intimate gatherings requiring subtle ambiance to large concerts demanding powerful PA systems and dynamic light shows, we deliver crystal-clear audio and stunning visual effects.", descriptionAmharic: "", icon: "Speaker", gradient: "from-cyan-500 to-sky-600", bgGlow: "bg-cyan-500/10" },
      { id: "s6", title: "Chair & Table Supply", titleAmharic: "", description: "A wide selection of chairs, tables, and furniture rentals to match any event style. From banquet-style round tables and elegant chiavari chairs to functional conference setups and traditional Ethiopian seating arrangements, we have your needs covered.", descriptionAmharic: "", icon: "Armchair", gradient: "from-indigo-500 to-blue-600", bgGlow: "bg-indigo-500/10" },
      { id: "s7", title: "Catering Supply", titleAmharic: "", description: "Delicious catering services featuring the best of Ethiopian and international cuisine. Our culinary team prepares everything from traditional injera platters and coffee ceremonies to continental menus, ensuring every guest is treated to an unforgettable dining experience.", descriptionAmharic: "", icon: "UtensilsCrossed", gradient: "from-orange-500 to-red-600", bgGlow: "bg-orange-500/10" },
      { id: "s8", title: "Kids Game Material Supply", titleAmharic: "", description: "Fun and safe entertainment options for children at your event. We supply bouncy castles, ball pits, face painting stations, game booths, and age-appropriate activities that keep young guests engaged and happy while adults enjoy the celebration.", descriptionAmharic: "", icon: "Gamepad2", gradient: "from-lime-500 to-green-600", bgGlow: "bg-lime-500/10" },
    ],

    // Testimonials
    testimonials: [
      { id: "t1", name: "Dr. Dereje", nameAmharic: "ዶ/ር ደረጄ", role: "Director General, Addis Ababa Science & Technology University", roleAmharic: "ዋና ዳይሬክተር፣ አዲስ አበባ ሳይንስ እና ቴክኖሎጂ ዩኒቨርስቲ", avatar: "ደ", quote: "Enkutatash delivered an outstanding experience for our university event. Their attention to detail, professionalism, and ability to manage large-scale academic gatherings is truly impressive. I highly recommend their services to any institution seeking excellence.", quoteAmharic: "", rating: 5, event: "University Event" },
      { id: "t2", name: "W/o Tsige Jimma", nameAmharic: "ወ/ሮ ፅጌ ጂማ", role: "Deputy Chief Executive, Lemi Kuraa Sub-city", roleAmharic: "ምክትል ስራ አስኪያጅ፣ ለሚ ኩራ ክ/ከተማ", avatar: "ፅ", quote: "We partnered with Enkutatash for our sub-city official events and the results were remarkable. Their team understands government protocols and delivers with precision. The decoration and stage setup were beyond our expectations — truly a trusted partner.", quoteAmharic: "", rating: 5, event: "Government Event" },
      { id: "t3", name: "Ato Midiksa Kebede", nameAmharic: "አቶ ሚዴቅሳ ከበደ", role: "Deputy Bureau Head, Addis Ababa Peace & Security Administration", roleAmharic: "ምክትል የቢሮ ሀላፊ፣ አዲስ አበባ ሰላምና ፀጥታ አስተዳደር", avatar: "ሚ", quote: "Enkutatash handled our bureau's official ceremony with exceptional professionalism. From sound and lighting to catering and seating arrangements, everything was perfectly coordinated. They are the most reliable event organizer in Addis Ababa.", quoteAmharic: "", rating: 5, event: "Official Ceremony" },
    ],

    // Portfolio Events
    portfolioEvents: [
      { id: "p1", title: "Cultural Festival", titleAmharic: "የባህል ፌስቲቫል", category: "Cultural", attendees: "1,000+", image: "/events/event-5.jpg", description: "A vibrant outdoor cultural celebration featuring traditional music, dance, and Ethiopian heritage under our signature tent setup.", descriptionAmharic: "", gradient: "from-emerald-400 via-teal-500 to-cyan-600" },
      { id: "p2", title: "Wedding Reception", titleAmharic: "የሰርግ ስብሰባ", category: "Wedding", attendees: "350+", image: "/events/event-2.jpg", description: "An elegant wedding reception with breathtaking floral backdrops, gold accents, and a sweetheart table setup designed to perfection.", descriptionAmharic: "", gradient: "from-rose-400 via-pink-500 to-fuchsia-600" },
      { id: "p3", title: "Live Concert", titleAmharic: "ቀጥታ ሙዚቃ", category: "Concert", attendees: "5,000+", image: "/events/event-4.jpg", description: "A spectacular live concert with full stage setup, professional sound systems, dynamic lighting, and traditional Ethiopian performances.", descriptionAmharic: "", gradient: "from-violet-400 via-purple-500 to-indigo-600" },
      { id: "p4", title: "Corporate Event", titleAmharic: "የኮርፖሬት ዝግጅት", category: "Corporate", attendees: "500+", image: "/events/event-6.jpg", description: "A premium corporate gathering with elegant white leather seating, marble-topped tables, and VIP lounge areas for distinguished guests.", descriptionAmharic: "", gradient: "from-amber-400 via-orange-500 to-red-500" },
      { id: "p5", title: "VIP Lounge Setup", titleAmharic: "ቪአይፒ ሎውንጅ", category: "Corporate", attendees: "200+", image: "/events/event-7.jpg", description: "Luxury VIP lounge with plush white leather armchairs, gold-framed marble tables, and an elegant atmosphere for exclusive gatherings.", descriptionAmharic: "", gradient: "from-cyan-400 via-blue-500 to-indigo-600" },
      { id: "p6", title: "Grand Wedding", titleAmharic: "ታላቅ ሰርግ", category: "Wedding", attendees: "800+", image: "/events/event-8.jpg", description: "A grand wedding ceremony in a multi-level venue with floral-patterned aisle, gold-framed VIP chairs, and tiered balcony seating.", descriptionAmharic: "", gradient: "from-rose-400 via-pink-500 to-fuchsia-600" },
      { id: "p7", title: "Formal Ceremony", titleAmharic: "ሥርዓተ ሰርግ", category: "Ceremony", attendees: "600+", image: "/events/event-9.jpg", description: "A formal ceremony in an elegant auditorium with ornate gold chairs, fresh floral arrangements, and a beautifully decorated grand venue.", descriptionAmharic: "", gradient: "from-lime-400 via-green-500 to-emerald-600" },
      { id: "p8", title: "Musical Performance", titleAmharic: "ሙዚቃዊ ትንታኔ", category: "Concert", attendees: "3,000+", image: "/events/event-3.jpg", description: "A captivating musical performance with dynamic blue stage lighting, decorative floral columns, and professional broadcast setup.", descriptionAmharic: "", gradient: "from-violet-400 via-purple-500 to-indigo-600" },
      { id: "p9", title: "Event Decoration", titleAmharic: "የዝግጅት ጌጣጌጥ", category: "Decoration", attendees: "Various", image: "/events/event-1.jpg", description: "Premium decorative lighting and gold candelabra fixtures that add elegance and warmth to any event setting.", descriptionAmharic: "", gradient: "from-amber-400 via-yellow-500 to-orange-500" },
      { id: "p10", title: "Ceremony Hall Setup", titleAmharic: "የሥርዓት አዳራሽ ዝጌጣጌጥ", category: "Ceremony", attendees: "600+", image: "/events/event-10.jpg", description: "A grand ceremony hall with blue-and-white draped curtains, glass podium, and floral-patterned aisle carpet for a prestigious formal event.", descriptionAmharic: "", gradient: "from-blue-400 via-indigo-500 to-violet-600" },
      { id: "p11", title: "Conference Hall Setup", titleAmharic: "የስብሰባ አዳራሽ ዝጌጣጌጥ", category: "Corporate", attendees: "800+", image: "/events/event-11.jpg", description: "A spacious conference hall with tiered seating, VIP gold-accented chairs, and marble-topped tables for a high-profile professional gathering.", descriptionAmharic: "", gradient: "from-slate-400 via-gray-500 to-zinc-600" },
      { id: "p12", title: "Elegant Celebration", titleAmharic: "ምሩር ስብሰባ", category: "Celebration", attendees: "300+", image: "/events/event-12.jpg", description: "An elegant celebration with ornate woven backdrop, vibrant floral arrangements, and traditional Ethiopian decorative elements for a cultural event.", descriptionAmharic: "", gradient: "from-emerald-400 via-green-500 to-teal-600" },
      { id: "p13", title: "Diamond Club Symposia", titleAmharic: "ዳያሞንድ ክለብ ሲምፖዚየም", category: "Symposium", attendees: "500+", image: "/events/event-13.jpg", description: "The Diamond Club Symposia 2025 with professional stage, branded backdrop, Ethiopian flags, and glass podium for a prestigious academic symposium.", descriptionAmharic: "", gradient: "from-amber-400 via-yellow-500 to-emerald-600" },
      { id: "p14", title: "Official Government Event", titleAmharic: "የመንግስት ዝግጅት", category: "Government", attendees: "400+", image: "/events/event-14.jpg", description: "A formal government event with blue curtain backdrop, green carpet stage, Amharic banner, and podium for an official ceremony.", descriptionAmharic: "", gradient: "from-blue-400 via-cyan-500 to-teal-600" },
      { id: "p15", title: "National Celebration", titleAmharic: "ብሔራዊ በዓል", category: "Cultural", attendees: "10,000+", image: "/events/event-15.jpg", description: "A massive public national celebration with thousands waving Ethiopian flags, large tent stage, and organized crowd in matching vests.", descriptionAmharic: "", gradient: "from-green-400 via-yellow-500 to-red-500" },
      { id: "p16", title: "Elegant Indoor Gala", titleAmharic: "ምሩር ውስጥ ጋላ", category: "Ceremony", attendees: "300+", image: "/events/event-16.jpg", description: "An elegant indoor gala with vibrant yellow floral-patterned green carpet aisle, blue and gold-framed VIP chairs, and multi-level balcony seating in a grand hall.", descriptionAmharic: "", gradient: "from-yellow-400 via-amber-500 to-orange-600" },
      { id: "p17", title: "Formal Auditorium Conference", titleAmharic: "የአዳራሽ ስብሰባ", category: "Corporate", attendees: "300+", image: "/events/event-17.jpg", description: "A formal conference in a multi-level auditorium with blue carpet, white polka dots, ornate gold chairs, marble-topped tables, and tiered balcony seating.", descriptionAmharic: "", gradient: "from-blue-400 via-indigo-500 to-violet-600" },
      { id: "p18", title: "Grand Stage Ceremony", titleAmharic: "ታላቅ የመድረክ ሥርዓት", category: "Ceremony", attendees: "100+", image: "/events/event-18.jpg", description: "A grand stage ceremony with blue and white draped curtains, glass podium, and a vibrant yellow-and-green floral-patterned carpet aisle in an elegant hall.", descriptionAmharic: "", gradient: "from-teal-400 via-cyan-500 to-blue-600" },
      { id: "p19", title: "Professional Conference Setup", titleAmharic: "ሙያዊ የስብሰባ ዝጌጣጌጥ", category: "Corporate", attendees: "300+", image: "/events/event-19.jpg", description: "A professional conference setup in a spacious multi-level venue with gold-accented VIP chairs, floral arrangements on marble tables, and tiered upper-level seating.", descriptionAmharic: "", gradient: "from-slate-400 via-blue-500 to-indigo-600" },
      { id: "p20", title: "Elegant Wedding Ceremony", titleAmharic: "ምሩር የሰርግ ሥርዓት", category: "Wedding", attendees: "150+", image: "/events/event-20.jpg", description: "An elegant wedding ceremony with golden circular-patterned backdrop, red and white floral arrangements, ornate wooden chairs, and chandelier-lit hall.", descriptionAmharic: "", gradient: "from-rose-400 via-pink-500 to-fuchsia-600" },
      { id: "p21", title: "Academic Symposium", titleAmharic: "የትምህርት ሲምፖዚየም", category: "Symposium", attendees: "200+", image: "/events/event-21.jpg", description: "An academic symposium with professional stage setup, branded backdrop with Ethiopian flags, transparent podium, and green carpet stage at Addis Ababa Science and Technology University.", descriptionAmharic: "", gradient: "from-emerald-400 via-green-500 to-teal-600" },
      { id: "p22", title: "Official Conference", titleAmharic: "የመንግስት ስብሰባ", category: "Government", attendees: "150+", image: "/events/event-22.jpg", description: "An official government conference with Amharic banner, blue curtain backdrop, green carpet stage, central podium, and gold-accented VIP seating.", descriptionAmharic: "", gradient: "from-blue-400 via-cyan-500 to-teal-600" },
      { id: "p23", title: "Patriotic Rally", titleAmharic: "አገር አፍቃሪ ሰልፍ", category: "Cultural", attendees: "2,000+", image: "/events/event-23.jpg", description: "A large-scale patriotic rally with thousands waving Ethiopian flags, blue tent stage, organized crowd in matching vests, and an outdoor grassy field venue.", descriptionAmharic: "", gradient: "from-green-400 via-yellow-500 to-red-500" },
      { id: "p24", title: "Corporate Floral Display", titleAmharic: "የኮርፖሬት የአበባ ውበት", category: "Decoration", attendees: "30+", image: "/events/event-24.jpg", description: "A stunning corporate floral centerpiece with red, pink, and orange roses arranged in a lavish bouquet, set in a modern office lobby with marble finishes.", descriptionAmharic: "", gradient: "from-rose-400 via-pink-500 to-red-600" },
      { id: "p25", title: "Intimate Wedding Setup", titleAmharic: "የቤተሰብ ሰርግ ዝጌጣጌጥ", category: "Wedding", attendees: "50+", image: "/events/event-25.jpg", description: "An intimate wedding setup with chrome circular-backrest chairs on a shaggy rug, white draped curtain backdrop adorned with hanging floral garlands.", descriptionAmharic: "", gradient: "from-pink-400 via-rose-500 to-red-500" },
      { id: "p26", title: "Cultural Decor Showcase", titleAmharic: "የባህል ጌጣጌጥ ማሳያ", category: "Decoration", attendees: "Various", image: "/events/event-26.jpg", description: "A rustic cultural decor display with peach and purple drapes, woven straw hats, ornate white chair, and traditional Ethiopian decorative elements against a stone wall.", descriptionAmharic: "", gradient: "from-purple-400 via-violet-500 to-indigo-600" },
      { id: "p27", title: "Event Furniture Collection", titleAmharic: "የዝግጅት ዕቃዎች ስብስብ", category: "Decoration", attendees: "Various", image: "/events/event-27.jpg", description: "An impressive collection of elegant event furniture including high-backed cream chairs with gold frames, ornate wooden chairs, and premium seating arrangements.", descriptionAmharic: "", gradient: "from-amber-400 via-yellow-500 to-orange-500" },
    ],

    // Venues
    venues: [
      "Sheraton Addis Grand Ballroom",
      "Hyatt Regency Addis Ababa",
      "Millennium Hall",
      "African Jazz Village",
      "Meskel Square",
      "Unity Park",
      "Addis Ababa University Main Hall",
      "ICT Park",
      "Lemi Kuraa Sub-city Hall",
      "National Palace Grounds",
      "Bole Millennium Hall",
      "Ghion Hotel",
      "Ras Hotel",
      "Hilton Addis Ababa",
      "Capital Hotel & Spa",
    ],

    // Team Members
    teamMembers: [
      { id: "tm1", name: "Kidane Tadesse", role: "Founder & CEO", avatar: "KT", gradient: "from-emerald-500 to-teal-600", bio: "Visionary leader with 10+ years in event management across Ethiopia." },
      { id: "tm2", name: "Meron Bekele", role: "Creative Director", avatar: "MB", gradient: "from-violet-500 to-purple-600", bio: "Award-winning designer specializing in Ethiopian cultural and modern fusion décor." },
      { id: "tm3", name: "Yohannes Alemu", role: "Operations Manager", avatar: "YA", gradient: "from-amber-500 to-orange-600", bio: "Logistics expert ensuring flawless execution of every event detail." },
      { id: "tm4", name: "Sara Girma", role: "Catering Director", avatar: "SG", gradient: "from-rose-500 to-pink-600", bio: "Culinary specialist blending traditional Ethiopian flavors with contemporary cuisine." },
    ],

    // Event Categories
    eventCategories: [
      "Wedding",
      "Corporate",
      "Cultural",
      "Concert",
      "Conference",
      "Symposium",
      "Government",
      "Social",
    ],
  }
}
