export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://enkutatashevents.com"

export const ethiopianCities = [
  { name: "Addis Ababa", slug: "addis-ababa", region: "Addis Ababa", population: "5M+" },
  { name: "Adama", slug: "adama", region: "Oromia", population: "500K+" },
  { name: "Hawassa", slug: "hawassa", region: "Sidama", population: "400K+" },
  { name: "Bahir Dar", slug: "bahir-dar", region: "Amhara", population: "350K+" },
  { name: "Dire Dawa", slug: "dire-dawa", region: "Dire Dawa", population: "300K+" },
  { name: "Mekelle", slug: "mekelle", region: "Tigray", population: "400K+" },
  { name: "Gondar", slug: "gondar", region: "Amhara", population: "300K+" },
  { name: "Jimma", slug: "jimma", region: "Oromia", population: "200K+" },
  { name: "Bishoftu", slug: "bishoftu", region: "Oromia", population: "150K+" },
  { name: "Arba Minch", slug: "arba-minch", region: "Southwest Ethiopia", population: "150K+" },
  { name: "Shashamane", slug: "shashamane", region: "Oromia", population: "150K+" },
  { name: "Dessie", slug: "dessie", region: "Amhara", population: "200K+" },
  { name: "Harar", slug: "harar", region: "Harari", population: "150K+" },
  { name: "Dilla", slug: "dilla", region: "Sidama", population: "100K+" },
  { name: "Debre Birhan", slug: "debre-birhan", region: "Amhara", population: "100K+" },
  { name: "Nekemte", slug: "nekemte", region: "Oromia", population: "120K+" },
  { name: "Jigjiga", slug: "jigjiga", region: "Somali", population: "150K+" },
  { name: "Assosa", slug: "assosa", region: "Benishangul-Gumuz", population: "50K+" },
  { name: "Wolaita Sodo", slug: "wolaita-sodo", region: "Southwest Ethiopia", population: "150K+" },
]

export const EVENT_CATEGORIES = [
  "Wedding",
  "Corporate Event",
  "Conference",
  "Seminar",
  "Product Launch",
  "Graduation Ceremony",
  "Birthday Party",
  "Engagement Event",
  "Baby Shower",
  "Cultural Celebration",
  "Concert",
  "Outdoor Festival",
]

export function getCityBySlug(slug: string) {
  return ethiopianCities.find((c) => c.slug === slug)
}

// ─── Comprehensive Keyword Database ──────────────────────────────────────────

export interface KeywordGroup {
  category: string
  intent: "primary" | "secondary" | "long-tail" | "commercial" | "informational" | "local" | "brand"
  keywords: string[]
}

export const keywordDatabase: KeywordGroup[] = [
  {
    category: "Wedding Planning",
    intent: "primary",
    keywords: [
      "wedding planner Ethiopia",
      "wedding organizer Addis Ababa",
      "Ethiopian wedding planner",
      "best wedding planner Ethiopia",
      "wedding decoration Addis Ababa",
    ],
  },
  {
    category: "Wedding Planning",
    intent: "long-tail",
    keywords: [
      "affordable wedding planner in Addis Ababa",
      "Ethiopian traditional wedding organizer",
      "best wedding decoration in Addis Ababa",
      "wedding planner for outdoor wedding Ethiopia",
      "full service wedding planner Addis Ababa",
      "luxury wedding planner Ethiopia",
      "wedding venue decoration Addis Ababa",
    ],
  },
  {
    category: "Corporate Events",
    intent: "primary",
    keywords: [
      "corporate event organizer Ethiopia",
      "event management company Addis Ababa",
      "corporate event planning Ethiopia",
      "conference organizer Addis Ababa",
      "seminar planner Ethiopia",
    ],
  },
  {
    category: "Corporate Events",
    intent: "long-tail",
    keywords: [
      "corporate event management company in Addis Ababa",
      "product launch event planner Ethiopia",
      "company anniversary event organizer Addis Ababa",
      "team building event planner Ethiopia",
      "corporate retreat organizer Addis Ababa",
      "conference venue decoration Ethiopia",
    ],
  },
  {
    category: "Decoration & Styling",
    intent: "primary",
    keywords: [
      "event decoration Addis Ababa",
      "party decoration Ethiopia",
      "stage decoration Addis Ababa",
      "venue styling Ethiopia",
      "wedding decoration ideas Ethiopia",
    ],
  },
  {
    category: "Decoration & Styling",
    intent: "long-tail",
    keywords: [
      "flower decoration for wedding Addis Ababa",
      "Ethiopian traditional stage decoration",
      "balloon decoration for birthday Addis Ababa",
      "conference stage decoration Ethiopia",
      "luxury event decoration Addis Ababa",
      "birthday party decoration near me Ethiopia",
    ],
  },
  {
    category: "Event Equipment",
    intent: "primary",
    keywords: [
      "event equipment rental Addis Ababa",
      "stage rental Ethiopia",
      "tent rental Addis Ababa",
      "sound system rental Addis Ababa",
      "chair rental for events Ethiopia",
    ],
  },
  {
    category: "Event Equipment",
    intent: "long-tail",
    keywords: [
      "party tent rental Addis Ababa",
      "outdoor wedding tent rental Ethiopia",
      "PA system rental Addis Ababa",
      "banquet chair rental Ethiopia",
      "LED screen rental Addis Ababa",
      "lighting system for event rental Addis Ababa",
      "staging equipment rental Ethiopia",
    ],
  },
  {
    category: "Catering",
    intent: "primary",
    keywords: [
      "event catering Addis Ababa",
      "wedding catering Ethiopia",
      "Ethiopian food catering",
      "coffee ceremony catering",
      "catering service for corporate events Addis Ababa",
    ],
  },
  {
    category: "Catering",
    intent: "long-tail",
    keywords: [
      "traditional Ethiopian catering for wedding",
      "international menu catering Addis Ababa",
      "buffet catering service Ethiopia",
      "corporate lunch catering Addis Ababa",
      "Ethiopian coffee ceremony for event",
    ],
  },
  {
    category: "Entertainment",
    intent: "primary",
    keywords: [
      "kids party entertainment Addis Ababa",
      "bouncy castle rental Ethiopia",
      "event entertainment Ethiopia",
      "children's party organizer Addis Ababa",
    ],
  },
  {
    category: "Entertainment",
    intent: "long-tail",
    keywords: [
      "ball pit rental for kids party Addis Ababa",
      "face painting for events Ethiopia",
      "inflatable rental for birthday party Addis Ababa",
      "kids game booth rental Ethiopia",
      "live band for wedding Addis Ababa",
    ],
  },
  {
    category: "Birthday & Social Events",
    intent: "primary",
    keywords: [
      "birthday party planner Addis Ababa",
      "engagement party organizer Ethiopia",
      "baby shower planner Addis Ababa",
      "graduation party organizer Ethiopia",
    ],
  },
  {
    category: "Birthday & Social Events",
    intent: "long-tail",
    keywords: [
      "kids birthday party organizer Addis Ababa",
      "surprise birthday planner Ethiopia",
      "engagement decoration ideas Addis Ababa",
      "baby shower decoration Ethiopia",
      "18th birthday party planner Addis Ababa",
    ],
  },
  {
    category: "Informational",
    intent: "informational",
    keywords: [
      "how to plan a wedding in Ethiopia",
      "Ethiopian wedding traditions and customs",
      "how to choose a wedding planner in Addis Ababa",
      "event planning checklist Ethiopia",
      "cost of wedding in Addis Ababa 2026",
      "Ethiopian coffee ceremony guide for events",
      "best wedding venues in Addis Ababa",
      "corporate event planning tips Ethiopia",
    ],
  },
  {
    category: "Commercial",
    intent: "commercial",
    keywords: [
      "hire wedding planner Addis Ababa",
      "book event organizer Ethiopia",
      "rent stage and tent Addis Ababa",
      "catering quotes Addis Ababa",
      "event decoration packages Ethiopia",
      "best event company in Addis Ababa",
      "affordable event planner near me",
    ],
  },
  {
    category: "Brand",
    intent: "brand",
    keywords: [
      "enkutatashevents",
      "enkutatashevents.com",
      "Enkutatash Events",
      "Enkutatash wedding planner",
      "Enkutatash event organizer Addis Ababa",
    ],
  },
]

// ─── 100 Blog Post Ideas ────────────────────────────────────────────────────

export const blogPosts = [
  {
    title: "The Ultimate Wedding Planning Checklist for Ethiopian Couples",
    keyword: "wedding planning checklist Ethiopia",
    category: "Wedding",
    outline: [
      "Introduction: Why a checklist matters",
      "12 months before: Venue, budget, guest list",
      "6 months before: Vendors, catering, decoration theme",
      "3 months before: Attire, invitations, music",
      "1 month before: Final fittings, seating, timeline",
      "1 week before: Rehearsal, confirmations, packing",
      "Wedding day: Timeline and coordination tips",
    ],
  },
  {
    title: "Top 10 Wedding Venues in Addis Ababa for Your Dream Wedding",
    keyword: "best wedding venues in Addis Ababa",
    category: "Wedding",
    outline: [
      "Introduction: Choosing the right venue",
      "Sheraton Addis Grand Ballroom",
      "Hyatt Regency Addis Ababa",
      "Millennium Hall",
      "Skylight Hotel",
      "Elily Hotel",
      "Ethiopian Skies Hotel",
      "Bole International Hotel",
      "Capital Hotel and Spa",
      "Ramada Addis",
      "Best Western Plus Addis",
      "Tips for selecting your venue",
    ],
  },
  {
    title: "How to Plan a Corporate Event in Ethiopia: A Complete Guide",
    keyword: "corporate event planning Ethiopia",
    category: "Corporate Events",
    outline: [
      "Introduction: Importance of professional event planning",
      "Setting objectives and KPIs",
      "Budget planning for corporate events",
      "Venue selection for conferences and seminars",
      "Audio visual and technology requirements",
      "Catering for corporate guests",
      "Timeline and project management",
      "Post-event evaluation and follow-up",
    ],
  },
  {
    title: "Ethiopian Wedding Traditions: A Complete Guide for Modern Couples",
    keyword: "Ethiopian wedding traditions",
    category: "Wedding",
    outline: [
      "Introduction: The richness of Ethiopian wedding culture",
      "Pre-wedding ceremonies: Telba and Kosh Kosh",
      "The wedding day: Traditional and modern elements",
      "The coffee ceremony at weddings",
      "Traditional attire: Habesha Kemis and Netela",
      "Music and dance: Eskista and cultural performances",
      "Wedding feast: Traditional Ethiopian dishes",
      "Modern Ethiopian wedding trends",
    ],
  },
  {
    title: "Event Decoration Trends in Ethiopia for 2026",
    keyword: "event decoration trends Ethiopia 2026",
    category: "Decoration",
    outline: [
      "Introduction: Evolving decoration styles",
      "Sustainable and eco-friendly decorations",
      "Minimalist Ethiopian themes",
      "Bold color palettes and floral designs",
      "Lighting trends: LED walls and smart lighting",
      "Balloon artistry and installations",
      "Traditional meets modern: Fusion decor",
      "Budget-friendly decoration ideas",
    ],
  },
  {
    title: "How Much Does a Wedding Cost in Addis Ababa in 2026?",
    keyword: "cost of wedding in Addis Ababa 2026",
    category: "Wedding",
    outline: [
      "Introduction: Average wedding costs breakdown",
      "Venue rental costs",
      "Catering costs per guest",
      "Decoration packages and pricing",
      "Photography and videography",
      "Music and entertainment",
      "Wedding planner fees",
      "Sample budgets for small, medium, and large weddings",
      "Money-saving tips",
    ],
  },
  {
    title: "Tent Rental Guide for Outdoor Events in Ethiopia",
    keyword: "tent rental guide Ethiopia",
    category: "Equipment Rental",
    outline: [
      "Introduction: Why tents matter for outdoor events",
      "Types of tents: Frame vs pole tents",
      "Tent sizes and capacity guide",
      "Weather considerations in Ethiopia",
      "Tent accessories: Flooring, lighting, walls",
      "Setup timeline and logistics",
      "Cost of tent rental in Addis Ababa",
      "Choosing the right rental company",
    ],
  },
  {
    title: "The Complete Guide to Ethiopian Coffee Ceremony at Events",
    keyword: "Ethiopian coffee ceremony event guide",
    category: "Catering",
    outline: [
      "Introduction: The cultural significance of coffee",
      "What is an Ethiopian coffee ceremony?",
      "Equipment needed: Jebena, cups, tray",
      "Step-by-step ceremony process",
      "When to include coffee ceremony at events",
      "Coffee ceremony for weddings",
      "Coffee ceremony for corporate events",
      "Hiring professional coffee ceremony servers",
    ],
  },
  {
    title: "Kids Birthday Party Ideas in Addis Ababa: Venues, Themes & Entertainment",
    keyword: "kids birthday party Addis Ababa",
    category: "Entertainment",
    outline: [
      "Introduction: Making kids parties memorable",
      "Popular birthday themes for kids",
      "Best indoor party venues in Addis Ababa",
      "Outdoor party locations",
      "Entertainment options: Bouncy castles, face painting",
      "Catering for kids: What to serve",
      "Party favor ideas",
      "Budget-friendly kids party tips",
    ],
  },
  {
    title: "How to Choose the Best Event Decorator in Addis Ababa",
    keyword: "choose event decorator Addis Ababa",
    category: "Decoration",
    outline: [
      "Introduction: Why decoration matters",
      "Questions to ask before hiring",
      "Reviewing portfolios and past work",
      "Understanding decoration packages",
      "Comparing quotes and value",
      "Checking references and reviews",
      "Red flags to watch for",
      "Why Enkutatash Events stands out",
    ],
  },
  {
    title: "Sound System Guide for Events in Addis Ababa: What You Need to Know",
    keyword: "sound system for events Addis Ababa",
    category: "Equipment Rental",
    outline: [
      "Introduction: Audio quality impacts event success",
      "Types of PA systems for different venues",
      "Indoor vs outdoor sound considerations",
      "Microphone types and usage",
      "Speaker placement best practices",
      "Sound engineering: Why professional matters",
      "Common audio mistakes at events",
      "Sound system rental costs in Addis Ababa",
    ],
  },
  {
    title: "Stage Lighting Guide for Ethiopian Events: Weddings, Concerts & Corporate",
    keyword: "stage lighting for events Ethiopia",
    category: "Equipment Rental",
    outline: [
      "Introduction: Lighting transforms any event",
      "Types of stage lighting: PAR, LED, moving heads",
      "Uplighting and ambiance creation",
      "Concert lighting vs wedding lighting",
      "Lighting for corporate presentations",
      "LED video walls and screens",
      "Lighting on a budget",
      "Working with professional lighting technicians",
    ],
  },
  {
    title: "Planning a Product Launch Event in Ethiopia: Step by Step",
    keyword: "product launch event planner Ethiopia",
    category: "Corporate Events",
    outline: [
      "Introduction: Product launches as marketing tools",
      "Setting launch objectives",
      "Venue selection for product launches",
      "Audio visual and presentation setup",
      "Audience engagement strategies",
      "Catering and hospitality",
      "Media and press coverage",
      "Post-event follow-up and measurement",
    ],
  },
  {
    title: "Traditional Ethiopian Wedding Attire: Guide for Brides and Grooms",
    keyword: "traditional Ethiopian wedding attire",
    category: "Wedding",
    outline: [
      "Introduction: The beauty of Habesha fashion",
      "Bridal attire: Kemis, Netela, and jewelry",
      "Groom's attire: Gabi, Netela, and Jodhpurs",
      "Bridesmaids and groomsmen coordination",
      "Where to buy or rent in Addis Ababa",
      "Modern adaptations of traditional wear",
      "Accessories: Jewelry, crowns, and shoes",
    ],
  },
  {
    title: "How to Plan an Engagement Party in Addis Ababa",
    keyword: "engagement party planner Addis Ababa",
    category: "Social Events",
    outline: [
      "Introduction: Celebrating your engagement",
      "Engagement party traditions in Ethiopia",
      "Choosing a date and venue",
      "Guest list and invitations",
      "Decoration themes for engagement parties",
      "Catering and drinks",
      "Photography and memories",
      "Budget planning tips",
    ],
  },
  {
    title: "Conference and Seminar Planning in Ethiopia: A Corporate Guide",
    keyword: "conference planning Ethiopia",
    category: "Corporate Events",
    outline: [
      "Introduction: Professional conference management",
      "Venue selection for conferences",
      "Registration and attendee management",
      "Stage setup and AV requirements",
      "Catering for large conferences",
      "Speaker management and scheduling",
      "Breakout sessions and networking",
      "Conference branding and materials",
    ],
  },
  {
    title: "Baby Shower Ideas and Decoration in Addis Ababa",
    keyword: "baby shower decoration Addis Ababa",
    category: "Social Events",
    outline: [
      "Introduction: Celebrating new life",
      "Popular baby shower themes",
      "Venue options in Addis Ababa",
      "Decoration ideas and color schemes",
      "Games and activities for guests",
      "Catering for baby showers",
      "Party favors and takeaways",
      "Hiring a baby shower planner",
    ],
  },
  {
    title: "The Best Ethiopian Music Bands for Weddings and Events",
    keyword: "Ethiopian music band for wedding",
    category: "Entertainment",
    outline: [
      "Introduction: Music sets the mood",
      "Traditional Ethiopian music bands",
      "Modern bands and DJs for events",
      "How to choose the right band",
      "Budget considerations for live music",
      "Sound and stage requirements",
      "Popular Ethiopian wedding songs",
    ],
  },
  {
    title: "Event Catering in Addis Ababa: Ethiopian and International Menus",
    keyword: "event catering Addis Ababa",
    category: "Catering",
    outline: [
      "Introduction: Catering makes or breaks an event",
      "Ethiopian cuisine for events: Injera, Tibs, Doro Wat",
      "International menu options",
      "Buffet vs plated vs family style",
      "Dietary accommodation: Vegan, gluten-free, halal",
      "Coffee ceremony addition",
      "Catering costs per person in Addis Ababa",
      "Choosing the right caterer",
    ],
  },
  {
    title: "Graduation Ceremony Planning in Ethiopia: A Complete Guide",
    keyword: "graduation ceremony planner Ethiopia",
    category: "Social Events",
    outline: [
      "Introduction: Celebrating academic achievement",
      "Venue selection for graduation ceremonies",
      "Stage setup and decoration",
      "Program flow and timing",
      "Photography and videography",
      "Catering for graduation receptions",
      "Invitations and guest management",
      "Budget-friendly graduation planning",
    ],
  },
]

export const faqData = [
  {
    question: "What services does Enkutatash Events offer?",
    answer:
      "Enkutatash Events offers 8 comprehensive event services in Addis Ababa and across Ethiopia: event organization and planning, decoration, stage and tent rental, sound and lighting supply, chair and table supply, catering, advert and promotion, and kids entertainment and game material supply.",
  },
  {
    question: "How much does it cost to hire an event organizer in Addis Ababa?",
    answer:
      "The cost depends on the type, size, and complexity of your event. We offer customized packages for weddings, corporate events, concerts, and private parties. Contact us for a free consultation and quote tailored to your specific needs and budget.",
  },
  {
    question: "Do you cover cities outside Addis Ababa?",
    answer:
      "Yes! We provide event services across all major Ethiopian cities including Adama, Hawassa, Bahir Dar, Dire Dawa, Mekelle, Gondar, Jimma, Bishoftu, and more. Contact us to discuss your location and we will arrange our team to serve you.",
  },
  {
    question: "How far in advance should I book an event organizer?",
    answer:
      "For large events like weddings and corporate conferences, we recommend booking 3 to 6 months in advance. For smaller events like birthday parties and baby showers, 2 to 4 weeks is usually sufficient. However, we can accommodate last-minute requests depending on availability.",
  },
  {
    question: "What wedding planning packages do you offer?",
    answer:
      "We offer partial and full wedding planning packages. Our full-service package includes venue selection, decoration, catering, sound and lighting, photography coordination, and on-site management. Our partial package allows you to customize which services you need.",
  },
  {
    question: "Do you provide tent and stage rental for outdoor events?",
    answer:
      "Yes, we provide high-quality tents ranging from 50 to 10,000+ guest capacity, along with custom-built stages, podiums, and backdrop systems for outdoor events, weddings, concerts, and community gatherings.",
  },
  {
    question: "What catering options are available for events?",
    answer:
      "We offer both Ethiopian traditional cuisine (injera, tibs, doro wat, kitfo) and international menu options. We also provide Ethiopian coffee ceremony setup, custom menu planning, and full-service waitstaff. All dietary requirements can be accommodated.",
  },
  {
    question: "Do you offer kids entertainment for birthday parties?",
    answer:
      "Yes, we provide complete kids entertainment including bouncy castles, ball pits, face painting, game booths, and supervised play areas. Our services are perfect for birthday parties, school events, and family celebrations.",
  },
  {
    question: "What sound and lighting equipment do you rent?",
    answer:
      "We rent professional PA systems for all venue sizes, dynamic stage and effect lighting, DJ equipment and monitoring, LED video walls and projectors. Our team includes experienced sound engineers for on-site support.",
  },
  {
    question: "How can I get a quote for my event?",
    answer:
      "You can contact us through our website form, call us at +251 910 977 371, or email enkutatashevents@gmail.com. We will schedule a free consultation to discuss your event requirements and provide a detailed quote.",
  },
  {
    question: "Do you provide decoration for corporate events and conferences?",
    answer:
      "Absolutely. We provide full decoration services for corporate events including stage decoration, venue styling, floral arrangements, branding integration, and theme-based decoration for conferences, seminars, product launches, and company events.",
  },
  {
    question: "Can you handle event photography and videography?",
    answer:
      "While our primary services are planning, decoration, and equipment rental, we partner with professional photographers and videographers in Addis Ababa. We can coordinate photography and videography services as part of your event package.",
  },
]
