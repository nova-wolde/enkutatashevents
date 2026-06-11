import { Language } from './store'

interface TranslationSet {
  brand: {
    name: string
    subtitle: string
  }
  navbar: {
    about: string
    vision: string
    services: string
    portfolio: string
    contact: string
    ownerLogin: string
    bookAnEvent: string
  }
  hero: {
    badge: string
    brandSubtitle: string
    headingLine1: string
    headingLine2: string
    subtitle: string
    bookYourEvent: string
    callUsNow: string
    trustedBy: string
    happyClients: string
  }
  stats: {
    eventsOrganized: string
    happyGuests: string
    yearsOfExcellence: string
    averageRating: string
  }
  about: {
    badge: string
    headingLine1: string
    headingLine2: string
    amharicSubheading: string
    description: string
    checklist: string[]
    getInTouch: string
    yearsPill: string
    eventsPill: string
  }
  vision: {
    badge: string
    headingLine1: string
    headingLine2: string
    ourVision: string
    visionSubtitle: string
    visionDescription: string
    ourMission: string
    missionSubtitle: string
    missionDescription: string
    goalsBadge: string
    goals: { title: string }[]
    objectivesBadge: string
    objectives: { title: string; description: string }[]
  }
  services: {
    badge: string
    headingLine1: string
    headingLine2: string
    description: string
    items: { title: string; description: string }[]
  }
  portfolio: {
    badge: string
    headingLine1: string
    headingLine2: string
    description: string
    scrollToExplore: string
    events: string
    guests: string
    planYourEvent: string
  }
  testimonials: {
    badge: string
    headingLine1: string
    headingLine2: string
    description: string
    universityEvent: string
    governmentEvent: string
    officialCeremony: string
    quotes: string[]
  }
  process: {
    badge: string
    headingLine1: string
    headingLine2: string
    steps: { title: string; description: string }[]
  }
  contact: {
    badge: string
    headingLine1: string
    headingLine2: string
    description: string
    callUs: string
    emailUs: string
    visitUs: string
    workingHours: string
    fullName: string
    email: string
    phoneNumber: string
    eventType: string
    tellUsAboutYourEvent: string
    sendMessage: string
    namePlaceholder: string
    emailPlaceholder: string
    phonePlaceholder: string
    eventTypePlaceholder: string
    messagePlaceholder: string
    privacyNote: string
    messageSent: string
    thankYouMessage: string
  }
  cta: {
    headingLine1: string
    headingLine2: string
    description: string
    bookFreeConsultation: string
    callUsNow: string
  }
  footer: {
    servicesTitle: string
    services: string[]
    companyTitle: string
    company: string[]
    contactTitle: string
    description: string
    privacyPolicy: string
    termsOfService: string
    copyright: string
  }
}

const translations: Record<Language, TranslationSet> = {
  en: {
    brand: {
      name: 'Enkutatash',
      subtitle: 'Enkutatash Event',
    },
    navbar: {
      about: 'About',
      vision: 'Vision',
      services: 'Services',
      portfolio: 'Portfolio',
      contact: 'Contact',
      ownerLogin: 'Owner Login',
      bookAnEvent: 'Book an Event',
    },
    hero: {
      badge: 'Premium Event Organizers in Addis Ababa',
      brandSubtitle: 'Enkutatash Event',
      headingLine1: 'Where Every Event',
      headingLine2: 'Becomes Legendary',
      subtitle: "Enkutatash is Addis Ababa's premier event organizer. From breathtaking weddings to large-scale corporate events and cultural celebrations — we bring your vision to life with elegance, precision, and a touch of magic.",
      bookYourEvent: 'Book Your Event',
      callUsNow: 'Call Us Now',
      trustedBy: 'Trusted by',
      happyClients: 'happy clients',
    },
    stats: {
      eventsOrganized: 'Events Organized',
      happyGuests: 'Happy Guests',
      yearsOfExcellence: 'Years of Excellence',
      averageRating: 'Average Rating',
    },
    about: {
      badge: 'About Us',
      headingLine1: 'Crafting Unforgettable',
      headingLine2: ' Moments Since 2022',
      amharicSubheading: 'ከ2022 ዓ.ም ጀምሮ ያልተረሳ ትዝታዎችን እያደራጅን',
      description: 'Named after the Ethiopian New Year, Enkutatash was founded with a simple belief: every event deserves to be extraordinary. Based in Addis Ababa, we transform ordinary occasions into legendary experiences with cultural understanding and world-class standards.',
      checklist: [
        'End-to-end event planning',
        'Award-winning design team',
        'Strong vendor network',
        'Dedicated project manager',
        'Full sound & light supply',
        'Catering & decoration',
      ],
      getInTouch: 'Get in Touch',
      yearsPill: '4+ Yrs',
      eventsPill: '500+ Events',
    },
    vision: {
      badge: 'Vision & Mission',
      headingLine1: 'Driven by Purpose,',
      headingLine2: ' Defined by Excellence',
      ourVision: 'Our Vision',
      visionSubtitle: 'Our Vision',
      visionDescription: 'To be the leading events management service provider for corporate events, delivering exceptional experiences and exceeding client expectations across Ethiopia.',
      ourMission: 'Our Mission',
      missionSubtitle: 'Our Mission',
      missionDescription: 'To create memorable and impactful corporate events that engage and inspire attendees, transforming gatherings into powerful experiences through innovative design and meticulous planning.',
      goalsBadge: 'Goals',
      goals: [
        { title: 'Client Satisfaction' },
        { title: 'Exceptional Experiences' },
        { title: 'Professionalism & Reliability' },
        { title: 'Growth & Expansion' },
        { title: 'Industry Leadership' },
      ],
      objectivesBadge: 'Objectives',
      objectives: [
        { title: 'Tailored Planning', description: 'Comprehensive planning tailored to corporate client needs' },
        { title: 'Meticulous Detail', description: 'Attention to detail in venue, logistics, catering & AV' },
        { title: 'Brand Alignment', description: 'Events aligned with your brand identity and objectives' },
        { title: 'Strategic Promotion', description: 'Marketing strategies to attract your target audience' },
        { title: 'Technology-Driven', description: 'Modern tools for streamlined, efficient delivery' },
        { title: 'Vendor Excellence', description: 'Strong vendor relationships for reliable services' },
        { title: 'Innovation First', description: 'Latest industry trends incorporated into every event' },
        { title: 'Continuous Improvement', description: 'Feedback-driven improvement for future events' },
      ],
    },
    services: {
      badge: 'Our Services',
      headingLine1: 'Whatever the occasion,',
      headingLine2: ' we make it extraordinary',
      description: 'From intimate gatherings to grand spectacles, our team delivers world-class event experiences tailored to your vision.',
      items: [
        {
          title: 'Advert & Promotion',
          description: "Strategic advertising and promotional campaigns to maximize your event's reach. We handle social media marketing, print materials, radio spots, and digital advertising to ensure your event gets the attention it deserves across Addis Ababa and beyond.",
        },
        {
          title: 'Event Organization',
          description: "Full-service event planning and management from concept to completion. Whether it's a grand wedding, corporate conference, or cultural celebration, our experienced team coordinates every detail to deliver a seamless and memorable experience.",
        },
        {
          title: 'Decoration',
          description: 'Stunning decorative designs tailored to your theme and vision. From elegant floral arrangements and balloon artistry to traditional Ethiopian motifs and modern aesthetics, our decoration team transforms any venue into a breathtaking setting.',
        },
        {
          title: 'Stage & Tent Rent',
          description: 'Professional stage setups and tent rentals for events of any scale. We provide high-quality tents, custom-built stages, podiums, and backdrop systems suitable for outdoor weddings, concerts, corporate events, and community gatherings.',
        },
        {
          title: 'Sound & Light Supply',
          description: 'State-of-the-art sound systems and professional lighting setups for events of all sizes. From intimate gatherings requiring subtle ambiance to large concerts demanding powerful PA systems and dynamic light shows, we deliver crystal-clear audio and stunning visual effects.',
        },
        {
          title: 'Chair & Table Supply',
          description: 'A wide selection of chairs, tables, and furniture rentals to match any event style. From banquet-style round tables and elegant chiavari chairs to functional conference setups and traditional Ethiopian seating arrangements, we have your needs covered.',
        },
        {
          title: 'Catering Supply',
          description: 'Delicious catering services featuring the best of Ethiopian and international cuisine. Our culinary team prepares everything from traditional injera platters and coffee ceremonies to continental menus, ensuring every guest is treated to an unforgettable dining experience.',
        },
        {
          title: 'Kids Game Material Supply',
          description: 'Fun and safe entertainment options for children at your event. We supply bouncy castles, ball pits, face painting stations, game booths, and age-appropriate activities that keep young guests engaged and happy while adults enjoy the celebration.',
        },
      ],
    },
    portfolio: {
      badge: 'Our Portfolio',
      headingLine1: 'Events that',
      headingLine2: ' speak for themselves',
      description: 'A glimpse into some of our most memorable events — each one a unique story of creativity and flawless execution.',
      scrollToExplore: 'Scroll to explore',
      events: 'events',
      guests: 'guests',
      planYourEvent: 'Plan Your Event With Us',
    },
    testimonials: {
      badge: 'Testimonials',
      headingLine1: 'What our clients',
      headingLine2: ' say about us',
      description: "Don't just take our word for it — hear from the people who have experienced the Enkutatash difference.",
      universityEvent: 'University Event',
      governmentEvent: 'Government Event',
      officialCeremony: 'Official Ceremony',
      quotes: [
        'Enkutatash delivered an outstanding experience for our university event. Their attention to detail, professionalism, and ability to manage large-scale academic gatherings is truly impressive. I highly recommend their services to any institution seeking excellence.',
        'We partnered with Enkutatash for our sub-city official events and the results were remarkable. Their team understands government protocols and delivers with precision. The decoration and stage setup were beyond our expectations — truly a trusted partner.',
        "Enkutatash handled our bureau's official ceremony with exceptional professionalism. From sound and lighting to catering and seating arrangements, everything was perfectly coordinated. They are the most reliable event organizer in Addis Ababa.",
      ],
    },
    process: {
      badge: 'How It Works',
      headingLine1: 'From vision to reality',
      headingLine2: ' in 4 steps',
      steps: [
        { title: 'Consultation', description: 'We start with a detailed conversation to understand your vision, budget, and expectations. This helps us tailor every detail to your needs.' },
        { title: 'Design & Planning', description: 'Our creative team develops a comprehensive plan including mood boards, timelines, vendor selections, and budget breakdowns for your approval.' },
        { title: 'Coordination', description: 'We coordinate with all vendors, manage logistics, and handle every detail behind the scenes so you can focus on what matters most.' },
        { title: 'The Big Day', description: 'Our team is on-site from setup to teardown, ensuring everything runs flawlessly. You just show up and enjoy your extraordinary event.' },
      ],
    },
    contact: {
      badge: 'Get in Touch',
      headingLine1: "Let's create something",
      headingLine2: ' extraordinary',
      description: "Ready to bring your event vision to life? Reach out to us and let's start planning. Every great event begins with a conversation.",
      callUs: 'Call Us',
      emailUs: 'Email Us',
      visitUs: 'Visit Us',
      workingHours: 'Working Hours',
      fullName: 'Full Name',
      email: 'Email',
      phoneNumber: 'Phone Number',
      eventType: 'Event Type',
      tellUsAboutYourEvent: 'Tell Us About Your Event',
      sendMessage: 'Send Message',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'you@email.com',
      phonePlaceholder: '+251 ...',
      eventTypePlaceholder: 'Wedding, Corporate, etc.',
      messagePlaceholder: 'Share your vision — date, venue preferences, number of guests, special requirements...',
      privacyNote: 'We typically respond within 24 hours. Your information is kept confidential.',
      messageSent: 'Message Sent!',
      thankYouMessage: "Thank you for reaching out. We'll get back to you within 24 hours.",
    },
    cta: {
      headingLine1: 'Your Next Event Deserves',
      headingLine2: 'the Enkutatash Touch',
      description: 'Let us transform your vision into an unforgettable experience. Book a free consultation today and discover why hundreds of clients trust us.',
      bookFreeConsultation: 'Book a Free Consultation',
      callUsNow: 'Call Us Now',
    },
    footer: {
      servicesTitle: 'Services',
      services: ['Advert & Promotion', 'Event Organization', 'Decoration', 'Stage & Tent', 'Sound & Light', 'Chair & Table', 'Catering', 'Kids Games'],
      companyTitle: 'Company',
      company: ['About Us', 'Portfolio', 'Testimonials', 'Contact'],
      contactTitle: 'Contact',
      description: "Addis Ababa's premier event organizer. Crafting legendary experiences since 2018.",
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      copyright: '© 2026 Enkutatash Event. All rights reserved.',
    },
  },
  am: {
    brand: {
      name: 'እንቁጣጣሽ',
      subtitle: 'እንቁጣጣሽ ኤቨንት',
    },
    navbar: {
      about: 'ስለ እኛ',
      vision: 'ራዕይ',
      services: 'አገልግሎቶች',
      portfolio: 'ስራዎቻችን',
      contact: 'ያግኙን',
      ownerLogin: 'ባለቤት መግቢያ',
      bookAnEvent: 'ዝግጅት ያስይዙ',
    },
    hero: {
      badge: 'በአዲስ አበባ ውስጥ ከሚገኙ ቀዳሚ የዝግጅት ድርጅቶች',
      brandSubtitle: 'እንቁጣጣሽ ኤቨንት',
      headingLine1: 'እያንዳንዱ ዝግጅት',
      headingLine2: 'ታሪካዊ ይሆናል',
      subtitle: 'እንቁጣጣሽ በአዲስ አበባ ውስጥ ከሚገኝ ቀዳሚ የዝግጅት ድርጅት ነው። ከአስደናቂ ሰርጎች እስከ ሰፊ የኮርፖሬት ዝግጅቶች እና የባህል ስብሰባዎች — ራዕይዎን በውበት፣ ትክክለኛነት እና በተለየ ስሜት እናስፈጻሚዎች ነን።',
      bookYourEvent: 'ዝግጅትዎን ያስይዙ',
      callUsNow: 'ይደውሉልን',
      trustedBy: 'የሚያመሱ',
      happyClients: 'እርካታ ያላቸው ደንበኞች',
    },
    stats: {
      eventsOrganized: 'የተደራጁ ዝግጅቶች',
      happyGuests: 'እርካታ ያላቸው እንግዶች',
      yearsOfExcellence: 'የልህቀት ዓመታት',
      averageRating: 'አማካይ ደረጃ',
    },
    about: {
      badge: 'ስለ እኛ',
      headingLine1: 'ከ2022 ዓ.ም ጀምሮ',
      headingLine2: ' ያልተረሳ ትዝታዎችን እያደራጅን',
      amharicSubheading: 'Crafting Unforgettable Moments Since 2022',
      description: 'በኢትዮጵያ አዲስ ዓመት ስም የተሰየመ እንቁጣጣሽ፣ በቀላሉ በሚቀበለው እምነት ተመስርቷል፡ እያንዳንዱ ዝግጅት ልዩ መሆን ይገባዋል። በአዲስ አበባ የተመሰረተን ድርጅት፣ መዘናኛ ዝግጅቶችን በባህል ግንዛቤ እና በዓለም አቀፍ መስፈርት ወደ ታሪካዊ ልምዶች እንቀይራለን።',
      checklist: [
        'የሙሉ ዝግጅት አቀማመጥ',
        'ሽልማት አሸናፊ የዲዛይን ቡድን',
        'ጠንካራ የአቅራቢ አውታረ መረብ',
        'ተወሳሽ የፕሮጀክት አስተዳዳሪ',
        'ሙሉ የድምፅ እና ብርሃን አቅርቦት',
        'አበሃሮ እና ጌጣጌጥ',
      ],
      getInTouch: 'ያግኙን',
      yearsPill: '4+ ዓም',
      eventsPill: '500+ ዝግጅቶች',
    },
    vision: {
      badge: 'ራዕይና ተልዕኮ',
      headingLine1: 'በዓላማ የሚመራ፣',
      headingLine2: ' በልህቀት የሚተረጎም',
      ourVision: 'ራዕያችን',
      visionSubtitle: 'ራዕያችን',
      visionDescription: 'ለኮርፖሬት ዝግጅቶች ቀዳሚ የዝግጅት አስተዳደር አገልግሎት መስጫ ሆነን፣ ልዩ ልምዶችን በማቅረብ እና በኢትዮጵያ አቀፍ ደረጃ የደንበኞች ምላሾችን እየበለጠ ማለት የእኛ ግብ ነው።',
      ourMission: 'ተልዕኳችን',
      missionSubtitle: 'ተልዕኳችን',
      missionDescription: 'ማስታወሻ እና ተጽዕኖ ፈጣሪ የኮርፖሬት ዝግጅቶችን ለመፍጠር፣ ተሳታፊዎችን ለማነሳሳት እና ለማበረታታት፣ ስብሰባዎችን በአዲስ ዲዛይን እና በዝርዝር አቀማመጥ ወደ ኃይለኛ ልምዶች መቀየር።',
      goalsBadge: 'ግቦቻችን',
      goals: [
        { title: 'የደንበኛ እርካታ' },
        { title: 'ልዩ ልምዶች' },
        { title: 'ሙያዊነትና አስተማማኝነት' },
        { title: 'እድገትና ስፋት' },
        { title: 'የኢንዱስትሪ መሪነት' },
      ],
      objectivesBadge: 'የስራ ዓላማዎች',
      objectives: [
        { title: 'የተመቻቸ አቀማመጥ', description: 'ለኮርፖሬት ደንበኞች ፍላጎት የተመቻቸ ሙሉ አቀማመጥ' },
        { title: 'ዝርዝር ትኩረት', description: 'በመድረስ፣ አቅርቦት፣ አበሃሮ እና AV ዝርዝር ትኩረት' },
        { title: 'የስራ ስም አሰላለፍ', description: 'ዝግጅቶች ከስራ ስምዎ እና ዓላማ ጋር የተስተካከሉ' },
        { title: 'ስትራቴጂያዊ ማስተዋወቂያ', description: 'ዒላማ ታዳሚዎን ለመሳብ የግብይት ስትራቴጂዎች' },
        { title: 'በቴክኖሎጂ የሚመራ', description: 'ለቀልጣፋ እና ውጤታማ አቅርቦት ዘመናዊ መሳሪያዎች' },
        { title: 'የአቅራቢ ብቃት', description: 'ለአስተማማኝ አገልግሎት ጠንካራ የአቅራቢ ግንኙነቶች' },
        { title: 'ፈጠራ ቅድሚያ', description: 'የቅርብ ጊዜ የኢንዱስትሪ አዝማሚያዎች በእያንዳንዱ ዝግጅት ውስጥ' },
        { title: 'የተከታታይ ማሻሻያ', description: 'ለወደፊት ዝግጅቶች ከግብረ መልስ የሚመነጨው ማሻሻያ' },
      ],
    },
    services: {
      badge: 'አገልግሎቶቻችን',
      headingLine1: 'የትኛውም ዓይነት ዝግጅት ቢሆንም፣',
      headingLine2: ' ልዩ እናደርገዋለን',
      description: 'ከቅርብ ስብሰባዎች እስከ ታላላቅ ትእይንቶች፣ ቡድናችን ለራዕይዎ የተመቻቸ ዓለም አቀፍ የዝግጅት ልምዶችን ያቀርባል።',
      items: [
        {
          title: 'ማስተዋወቂያ እና ማስፋፊያ',
          description: 'ዝግጅትዎ ስፋት እንዲያገኝ የስትራቴጂ ማስተዋወቂያ እና ማስፋፊያ ዘመቻዎች። የማህበራዊ ሚዲያ ግብይት፣ የህትመት ቁሳቁሶች፣ የራዲዮ ስርጭት እና ዲጂታል ማስተዋወቂያ በአዲስ አበባ እና በዙሪያው ዝግጅትዎ ትኩረት እንዲያገኝ እንደኛን አድርገን እንደሚቀበሉ እንወቅ።',
        },
        {
          title: 'የዝግጅት ድርጅት',
          description: 'ከሃሳብ እስከ ማጠናቀቅ ሙሉ አገልግሎት የዝግጅት አቀማመጥ እና አስተዳደር። ታላቅ ሰርግ፣ የኮርፖሬት ስብሰባ ወይም የባህል ልምድ ቢሆንም፣ ልምድ ያለው ቡድናችን ለትክክለኛ እና ማስታወሻ ልምድ እያንዳንዱን ዝርዝር ያስተባብራል።',
        },
        {
          title: 'ጌጣጌጥ',
          description: 'ለቴማ እና ራዕይዎ የተመቻቸ አስደናቂ የጌጣጌጥ ዲዛይኖች። ከሀብታዊ የአበባ ውቅር እና ከፊኛ ኪነት እስከ ባህላዊ የኢትዮጵያ ንድፎች እና ዘመናዊ አስደሳችነት፣ የጌጣጌጥ ቡድናችን ማንኛውንም ቦታ ወደ አስደናቂ ሁኔታ ይቀይራል።',
        },
        {
          title: 'የመድረክ እና ድንኳን ኪራይ',
          description: 'ለማንኛውም መጠን ዝግጅቶች ሙያዊ የመድረክ አቀማመጥ እና የድንኳን ኪራይ። ለውጪ ሰርጎች፣ ለሙዚቃ ትእይንቶች፣ ለኮርፖሬት ዝግጅቶች እና ለማህበረሰብ ስብሰባዎች ተገቢ ከፍተኛ ጥራት ያላቸው ድንኳኖች፣ ብጁ መድረኮች እና የጀርባ ስርዓቶች እንሰጣለን።',
        },
        {
          title: 'የድምፅ እና ብርሃን አቅርቦት',
          description: 'ለሁሉም መጠን ዝግጅቶች ዘመናዊ የድምፅ ስርዓቶች እና ሙያዊ የብርሃን አቀማመጥ። ከቅርብ ስብሰባዎች ለቀልጣፋ ስሜት እስከ ትላልቅ ሙዚቃ ትእይንቶች ለኃይለኛ PA ስርዓቶች እና ተለዋዋጭ የብርሃን ትእይንቶች፣ ንፅህ ድምፅ እና አስደናቂ ብርሃን ልትከተሉ እንደሚችሉ እንወቅ።',
        },
        {
          title: 'የወንበር እና ጠረጴዛ አቅርቦት',
          description: 'ለማንኛውም ዝግጅት ዓይነት የሚመች ሰፊ የወንበር፣ ጠረጴዛ እና የቤት ዕቃ ኪራይ ምርጫ። ከባንኪት ዘይቤ ክብ ጠረጴዛዎች እና ከሀብታዊ ቺያቫሪ ወንበሮች እስከ ተግባራዊ የስብሰባ አቀማመጥ እና ባህላዊ የኢትዮጵያ የወንበር ዝርዝር፣ ፍላጎትዎን አግኝተናል።',
        },
        {
          title: 'የአበሃሮ አቅርቦት',
          description: 'ከምርጥ የኢትዮጵያ እና ዓለም አቀፍ ምግብ አዘገጃጀት የተሞላ አስደሳች የአበሃሮ አገልግሎቶች። የአበሃሮ ቡድናችን ከባህላዊ የእንጀራ ዲስኮች እና የቡና ስርዓት እስከ ኮንቲኔንታል ምናዛዎች ሁሉንም ያዘጋጃል፣ እያንዳንዱ እንግድ ያልተረሳ የምግብ ልምድ እንዲያገኝ በማድረግ።',
        },
        {
          title: 'የልጆች መጫወቻ ቁሳቁስ አቅርቦት',
          description: 'በዝግጅትዎ ለልጆች አሳታፊ እና ደህንነቱ የተጠበቀ መዝናኛ አማራጮች። የባሎን ቤት፣ የኳስ ጉድጓድ፣ የፊት ስዕል ጣቢያ፣ የጨዋታ ቦርዳዎች እና የዕይታ ዕድሜ የሆኑ ተግባራት እንሰጣለን — ወላጆች ሲደሰቱ ልጆችም ደስተኞች እንዲሆኑ።',
        },
      ],
    },
    portfolio: {
      badge: 'የስራዎቻችን',
      headingLine1: 'ስራዎቻችን',
      headingLine2: ' ለራሳቸው ይናገራሉ',
      description: 'ከታላላቅ ስራዎቻችን ውስጥ አንዳንዶቹ — እያንዳንዱ የፈጠራ እና ፍጹም አፈጻጸም ልዩ ታሪክ።',
      scrollToExplore: 'ለማሰስ',
      events: 'ዝግጅቶች',
      guests: 'እንግዶች',
      planYourEvent: 'ዝግጅትዎን ከእኛ ጋር ያቅዱ',
    },
    testimonials: {
      badge: 'የደንበኞች ምስክርነት',
      headingLine1: 'ደንበኞቻችን',
      headingLine2: ' ስለ እኛ የሚሉት',
      description: 'በእኛ ቃል ብቻ አይደለም — የእንቁጣጣሽን ልዩነት ከተሞከሩ ሰዎች ይስሙ።',
      universityEvent: 'የዩኒቨርሲቲ ዝግጅት',
      governmentEvent: 'የመንግስት ዝግጅት',
      officialCeremony: 'የሥርዓት ስብሰባ',
      quotes: [
        'እንቁጣጣሽ ለዩኒቨርሲቲ ዝግጅታችን አስደናቂ ልምድ አቅርቧል። ዝርዝር ትኩረታቸው፣ ሙያዊነታቸው እና ትልቅ መጠን ያለው የትምህርት ስብሰባዎችን ለማስተዳደር ያላቸው አቅም በእርግጥ አስደናቂ ነው። ለልህቀት ለሚፈልግ ማንኛውም ተቋም አገልግሎታቸውን ከልብ እመክራለሁ።',
        'ለክ/ከተማችን የመንግስት ዝግጅቶች ከእንቁጣጣሽ ጋር ተቀናጅተናል እና ውጤቱ ትክክለኛ ነበር። ቡድናቸው የመንግስት ስርዓቶችን ይረዳል እና በትክክል ያቀርባል። ጌጣጌጥ እና የመድረክ አቀማመጥ ከጠበቅነው በላይ ነበር — በእርግጥ የሚታመን ተባባሪ።',
        'እንቁጣጣሽ የቢሮአችንን ሥርዓተ ሰርግ በልዩ ሙያዊነት አስተይዟል። ከድምፅ እና ብርሃን እስከ አበሃሮ እና የወንበር ዝርዝር፣ ሁሉም በፍጹም ተቀናጅቶ ነበር። በአዲስ አበባ ውስጥ ከሚገኙ በጣም አስተማማኝ የዝግጅት ድርጅቶች ናቸው።',
      ],
    },
    process: {
      badge: 'እንዴት እንደሚሰራ',
      headingLine1: 'ከራዕይ ወደ እውነት',
      headingLine2: ' በ4 ደረጃዎች',
      steps: [
        { title: 'ምክክር', description: 'ራዕይዎን፣ በጀትዎን እና ግምቶችዎን ለመረዳት ዝርዝር ውይይት እንጀምራለን። ይህ እያንዳንዱን ዝርዝር ለፍላጎትዎ እንድናመቻች ይረዳል።' },
        { title: 'ዲዛይን እና አቀማመጥ', description: 'ፈጣሪ ቡድናችን ሞድ ቦርድ፣ ጊዜ መስመር፣ አቅራቢ ምርጫ እና የበጀት ዝርዝር የያዘ ሙሉ እቅድ ያዘጋጃል።' },
        { title: 'ማቀናጀል', description: 'ከሁሉም አቅራቢዎች ጋር እንቀናጀል፣ አቅርቦቶችን እንደበናል፣ እና ከጀርባ በኩል እያንዳንዱን ዝርዝር እንደኛን አድርገን ስለሚያስፈልግ እንዲያተኮሩ እናስችላለን።' },
        { title: 'ታላቁ ቀን', description: 'ቡድናችን ከአቀማመጥ እስከ መፍታት ቦታው ላይ ነው፣ ሁሉም በፍጹም እንዲሄድ ለማረጋገጥ። እርስዎ መታየት እና ያልተለመደ ዝግጅትዎን መደሰት ብቻ ነው።' },
      ],
    },
    contact: {
      badge: 'ያግኙን',
      headingLine1: 'የልዩ',
      headingLine2: ' ነገር እንፍጠር',
      description: 'የዝግጅት ራዕይዎን ወደ ሕይወት ለማምጣት ዝግጁ ነዎት? ያግኙን እና እንድንጀምር እቅድ። እያንዳንዱ ታላቅ ዝግጅት ከውይይት ይጀምራል።',
      callUs: 'ይደውሉልን',
      emailUs: 'ኢሜይል ይላኩልን',
      visitUs: 'ይጠቁሙን',
      workingHours: 'የስራ ሰዓት',
      fullName: 'ሙሉ ስም',
      email: 'ኢሜይል',
      phoneNumber: 'የስልክ ቁጥር',
      eventType: 'የዝግጅት ዓይነት',
      tellUsAboutYourEvent: 'ስለ ዝግጅትዎ ይንገሩን',
      sendMessage: 'መልዕክት ይላኩ',
      namePlaceholder: 'ስምዎ',
      emailPlaceholder: 'you@email.com',
      phonePlaceholder: '+251 ...',
      eventTypePlaceholder: 'ሰርግ፣ ኮርፖሬት፣ ወዘተ',
      messagePlaceholder: 'ራዕይዎን ያካፍሉ — ቀን፣ የቦታ ምርጫ፣ የእንግድ ቁጥር፣ ልዩ ፍላጎቶች...',
      privacyNote: 'በተለምዶ በ24 ሰዓታት ውስጥ እንመልሳለን። መረጃዎ በሚስጥር ይጠበቃል።',
      messageSent: 'መልዕክት ተልኳል!',
      thankYouMessage: 'ለመጠቅምዎ እናመሰግናለን። በ24 ሰዓታት ውስጥ እንመልስዎታለን።',
    },
    cta: {
      headingLine1: 'የሚቀጥለው ዝግጅትዎ',
      headingLine2: 'የእንቁጣጣሽን ንክኪ ይጠብቃል',
      description: 'ራዕይዎን ወደ ያልተረሳ ልምድ እንለውጥልዎታለን። ዛሬ ነፃ ምክክር ያስይዙ እና መቶዎች ደንበኞች ለምን እንደሚያምኑበት ይወቁ።',
      bookFreeConsultation: 'ነፃ ምክክር ያስይዙ',
      callUsNow: 'ይደውሉልን',
    },
    footer: {
      servicesTitle: 'አገልግሎቶች',
      services: ['ማስተዋወቂያ እና ማስፋፊያ', 'የዝግጅት ድርጅት', 'ጌጣጌጥ', 'መድረክ እና ድንኳን', 'ድምፅ እና ብርሃን', 'ወንበር እና ጠረጴዛ', 'አበሃሮ', 'የልጆች ጨዋታ'],
      companyTitle: 'ድርጅት',
      company: ['ስለ እኛ', 'ስራዎቻችን', 'የደንበኞች ምስክርነት', 'ያግኙን'],
      contactTitle: 'ያግኙን',
      description: 'በአዲስ አበባ ውስጥ ቀዳሚ የዝግጅት ድርጅት። ከ2018 ጀምሮ ታሪካዊ ልምዶችን እያደራጅን።',
      privacyPolicy: 'የግላዊነት ፖሊሲ',
      termsOfService: 'የአገልግሎት ውል',
      copyright: '© 2026 እንቁጣጣሽ ኤቨንት። ሁሉም መብት የተጠበቀ ነው።',
    },
  },
}

export { translations }
export type { TranslationSet }
