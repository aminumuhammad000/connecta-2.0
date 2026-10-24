'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Wrench,
  Zap,
  Smartphone,
  Laptop,
  Hammer,
  Car,
  Paintbrush,
  Wind,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  Sparkles,
  Star,
  Users,
  BadgeCheck,
  FileSearch,
  ChevronDown,
  Award,
  Layers,
  HeartHandshake,
  Building2,
  Lock,
  ArrowDownRight,
  ArrowDown,
  ArrowUpRight,
  CornerDownRight,
  Check,
  ArrowUp,
  Phone,
  Mail,
  Globe,
} from 'lucide-react'

const DYNAMIC_PHRASES = [
  'solar & inverters',
  'broken phone screens',
  'emergency pipe leaks',
  'air conditioner fixes',
  'car engine diagnostics',
  'custom furniture & woodwork',
]

const TRADE_TABS = [
  { id: 'all', label: 'All Trades (8)' },
  { id: 'power', label: 'Electrical & Solar' },
  { id: 'devices', label: 'Phones & Gadgets' },
  { id: 'home', label: 'Woodwork & Home' },
  { id: 'cooling-plumbing', label: 'Cooling & Pipes' },
  { id: 'vehicles', label: 'Auto Diagnostics' },
]

const CATEGORIES = [
  {
    name: 'Electrical & Wiring',
    slug: 'electrical',
    group: 'power',
    image: '/images/services/electrician_working_on_electrical_panel.jpg',
    alt: 'Electrician working on an electrical distribution panel in Kano',
    desc: 'Fault finding, house wiring, inverter & solar installations, breaker repair',
    badge: 'High Demand',
    badgeColor: 'bg-[#D97706] text-white',
    speed: 'Avg 45 min arrival',
    themeBg: 'bg-[#1E1B4B]',
    accentColor: '#10B981',
    tags: ['Solar Sizing', 'Inverters', 'Breakers'],
  },
  {
    name: 'Phone & Tablet Repair',
    slug: 'phone-repair',
    group: 'devices',
    image: '/images/services/phone_repair_technician.jpg',
    alt: 'Technician repairing smartphone motherboard and screen',
    desc: 'Screens, battery replacements, charging ports, board micro-soldering',
    badge: 'Same Day',
    badgeColor: 'bg-[#10B981] text-white',
    speed: 'Under 1 hr repair',
    themeBg: 'bg-[#0A1020]',
    accentColor: '#4D78FF',
    tags: ['OLED Screens', 'TrueTone', 'Motherboards'],
  },
  {
    name: 'Carpentry & Woodwork',
    slug: 'carpentry',
    group: 'home',
    image: '/images/services/carpenter_working_in_nigeria.jpg',
    alt: 'Carpenter working on wooden construction in Nigeria',
    desc: 'Custom furniture, door fittings, roof woodwork, wardrobe framing',
    badge: 'Master Guild',
    badgeColor: 'bg-[#D97706] text-white',
    speed: 'Certified timber',
    themeBg: 'bg-[#2E1A47]',
    accentColor: '#F59E0B',
    tags: ['Custom Woodwork', 'Door Fitting', 'Roof Trusses'],
  },
  {
    name: 'AC & Refrigeration',
    slug: 'ac-cooling',
    group: 'cooling-plumbing',
    image: '/images/services/air_conditioner_repair_technician.jpg',
    alt: 'Technician inspecting and servicing air conditioner unit',
    desc: 'AC gas refill, compressor maintenance, duct cleaning, installation',
    badge: 'Seasonal Rush',
    badgeColor: 'bg-[#4D78FF] text-white',
    speed: 'Genuine gas top-up',
    themeBg: 'bg-[#0A2614]',
    accentColor: '#10B981',
    tags: ['Gas Top-Up', 'Compressors', 'Duct Flushing'],
  },
  {
    name: 'Computer & Laptop Repair',
    slug: 'computer-repair',
    group: 'devices',
    image: '/images/services/computer_repair_technician.jpg',
    alt: 'Technician repairing laptop hardware in workshop',
    desc: 'Hardware upgrades, OS reinstallation, screens & thermal paste fixes',
    badge: 'Bench Lab',
    badgeColor: 'bg-[#8B7CFF] text-white',
    speed: 'Hardware diagnostic',
    themeBg: 'bg-[#1E1B4B]',
    accentColor: '#8B7CFF',
    tags: ['Thermal Paste', 'NVMe SSDs', 'Diagnostics'],
  },
  {
    name: 'Auto Mechanics & Diagnostics',
    slug: 'auto-mechanic',
    group: 'vehicles',
    image: '/images/services/car_mechanic_repairing_engine.jpg',
    alt: 'Mechanic servicing car engine diagnostics in workshop',
    desc: 'Engine diagnostics, brake repairs, suspension, routine maintenance',
    badge: 'Mobile Service',
    badgeColor: 'bg-[#E67E00] text-white',
    speed: 'OBD2 scan included',
    themeBg: 'bg-[#0A1020]',
    accentColor: '#F59E0B',
    tags: ['OBD2 Scans', 'Brake Systems', 'Suspension'],
  },
  {
    name: 'Painting & Wall Finishing',
    slug: 'painting',
    group: 'home',
    image: '/images/services/house_painter_painting_wall.jpg',
    alt: 'Painter applying smooth coat to interior wall',
    desc: 'Interior and exterior painting, POP plastering, waterproofing',
    badge: 'Craft Precision',
    badgeColor: 'bg-[#10B981] text-white',
    speed: 'Clean site cleanup',
    themeBg: 'bg-[#2E1A47]',
    accentColor: '#10B981',
    tags: ['POP Plastering', 'Waterproofing', 'Interiors'],
  },
  {
    name: 'Plumbing & Pipe Maintenance',
    slug: 'plumbing',
    group: 'cooling-plumbing',
    image: '/images/services/cleaning_or_maintenance_technician.jpg',
    alt: 'Maintenance specialist working on piping equipment',
    desc: 'Water pipe leaks, borehole pumps, kitchen & bathroom installations',
    badge: 'Emergency Ready',
    badgeColor: 'bg-[#DC2626] text-white',
    speed: 'Pressure testing',
    themeBg: 'bg-[#0A2614]',
    accentColor: '#4D78FF',
    tags: ['Borehole Pumps', 'Pipe Leaks', 'Pressure Valves'],
  },
]

const FEATURED_PROVIDERS = [
  {
    id: 'p1',
    name: 'Ibrahim Aliyu',
    business: 'Arewa Solar & Inverter Engineering',
    trade: 'Master Electrician & Solar Sizing',
    location: 'Nassarawa GRA, Kano',
    rating: 4.95,
    reviews: 48,
    jobs: 72,
    verified: true,
    experience: '8 yrs exp',
    avatar: '/images/services/electrician_working_on_electrical_panel.jpg',
    recentJob: '3.5kVA Inverter Installation in Bompai',
    cardBg: 'bg-[#1E1B4B]',
    accentPill: 'bg-[#10B981] text-white',
  },
  {
    id: 'p2',
    name: 'Garba Danbatta',
    business: 'Danbatta Phone & Display Lab',
    trade: 'Micro-soldering & Display Specialist',
    location: 'Sabon Gari, Kano',
    rating: 4.92,
    reviews: 64,
    jobs: 110,
    verified: true,
    experience: '10 yrs exp',
    avatar: '/images/services/phone_repair_technician.jpg',
    recentJob: 'iPhone 13 OLED & Battery Replacement',
    cardBg: 'bg-[#0A1020]',
    accentPill: 'bg-[#4D78FF] text-white',
  },
  {
    id: 'p3',
    name: 'Kabiru Sani',
    business: 'Sani Modern Woodwork & Furniture',
    trade: 'Cabinetry & Door Fitting Craftsman',
    location: 'Bompai, Kano',
    rating: 4.97,
    reviews: 52,
    jobs: 85,
    verified: true,
    experience: '12 yrs exp',
    avatar: '/images/services/carpenter_working_in_nigeria.jpg',
    recentJob: 'Solid Mahogany Office Desks',
    cardBg: 'bg-[#D97706]',
    accentPill: 'bg-[#0A1020] text-white',
  },
]

const WHO_CONNECTA_SERVES = [
  { title: 'Homeowners & Tenants', color: 'bg-[#0A1020] text-white' },
  { title: 'Business Owners & Offices', color: 'bg-[#2E1A47] text-white' },
  { title: 'Facility Managers', color: 'bg-[#4D78FF] text-white' },
  { title: 'Certified Electricians', color: 'bg-[#10B981] text-white' },
  { title: 'Phone & Device Techs', color: 'bg-[#F59E0B] text-white' },
  { title: 'Auto Mechanics & Diagnostics', color: 'bg-[#0A1020] text-white' },
  { title: 'Precision Carpenters', color: 'bg-[#8B7CFF] text-white' },
  { title: 'AC & Refrigeration Engineers', color: 'bg-[#10B981] text-white' },
  { title: 'Real Estate Landlords', color: 'bg-[#F59E0B] text-white' },
  { title: 'Borehole & Plumber Specialists', color: 'bg-[#4D78FF] text-white' },
  { title: 'Apprentices & Trade Guilds', color: 'bg-[#2E1A47] text-white' },
  { title: 'And Many More...', color: 'bg-[#064E3B] text-white' },
]

const TRUST_GUARANTEES = [
  { title: 'NIN Identity Verified', color: 'bg-[#10B981] text-white' },
  { title: 'CAC Business Registration', color: 'bg-[#2E1A47] text-white' },
  { title: 'Physical Workshop Inspection', color: 'bg-[#0A1020] text-white' },
  { title: 'Itemized Labor & Parts in Kobo', color: 'bg-[#F59E0B] text-white' },
  { title: '10MB Photo Evidence Protocol', color: 'bg-[#4D78FF] text-white' },
  { title: 'Zero Middleman Markups', color: 'bg-[#064E3B] text-white' },
  { title: 'Verified-Only Completed Reviews', color: 'bg-[#8B7CFF] text-white' },
  { title: 'Auditable Dispute Mediation', color: 'bg-[#10B981] text-white' },
  { title: 'Escrow Payment Safeguards', color: 'bg-[#D97706] text-white' },
]

const PROVIDER_BENEFITS = [
  { title: 'Zero Upfront Listing Fees', color: 'bg-[#10B981] text-white' },
  { title: 'Instant NGN Bank Payouts', color: 'bg-[#4D78FF] text-white' },
  { title: 'Direct Customer Leads', color: 'bg-[#F59E0B] text-white' },
  { title: 'Official Verified Artisan Badge', color: 'bg-[#2E1A47] text-white' },
  { title: 'In-App Photo Evidence Records', color: 'bg-[#0A1020] text-white' },
  { title: 'Trade Guild Recognition', color: 'bg-[#064E3B] text-white' },
  { title: 'Transparent Change Order Approvals', color: 'bg-[#8B7CFF] text-white' },
]

const THREE_STAGES = [
  {
    number: '01',
    title: 'Describe Your Issue & Location',
    desc: 'Tell us what needs fixing in your home, vehicle, or device. Add photos and select your urgency—emergency dispatch, today, or scheduled.',
    cardBg: 'bg-[#1E1B4B]',
    accentColor: '#10B981',
    footerMeta: 'Instant Broadcast • Kano Metropolitan',
    icon: Search,
  },
  {
    number: '02',
    title: 'Compare Itemized Quotes',
    desc: 'Eligible local technicians in Kano review your issue and submit transparent line-item estimates detailing labor, materials, and time in kobo.',
    cardBg: 'bg-[#10B981]',
    accentColor: '#FFFFFF',
    footerMeta: 'Labor + Parts in Kobo • Certified Transparent',
    icon: FileSearch,
  },
  {
    number: '03',
    title: 'Verified Execution & Escrow',
    desc: 'Select the best quote. Track technician arrival, review before/after photo evidence, pay securely in NGN, and leave a verified review.',
    cardBg: 'bg-[#0A1020]',
    accentColor: '#4D78FF',
    footerMeta: 'Before & After Evidence • Verified Review',
    icon: BadgeCheck,
  },
]

const REVIEWS = [
  {
    quote:
      'My solar inverter went off unexpectedly during heavy rain. Ibrahim arrived in Nassarawa within an hour, diagnosed a blown balancer, and had our power back before sunset. Completely transparent pricing.',
    author: 'Amina Bello',
    neighborhood: 'Nassarawa GRA, Kano',
    service: 'Solar Inverter Troubleshooting',
    cardBg: 'bg-[#1E1B4B]',
    tagColor: 'bg-[#10B981] text-white',
    rating: 5,
  },
  {
    quote:
      'I had a cracked iPhone 14 Pro screen and was worried about fake replacement screens. Danbatta showed me the genuine OLED panel, transferred TrueTone, and finished in under 45 minutes.',
    author: 'Usman Farouk',
    neighborhood: 'Sabon Gari, Kano',
    service: 'Screen Replacement',
    cardBg: 'bg-[#0A1020]',
    tagColor: 'bg-[#4D78FF] text-white',
    rating: 5,
  },
  {
    quote:
      'Finding a reliable carpenter for custom office desks in Bompai was always a gamble until Connecta. Kabiru submitted an itemized quote for mahogany wood, delivered on time, and the finishing is top class.',
    author: 'Fatima Sanusi',
    neighborhood: 'Bompai Industrial, Kano',
    service: 'Custom Office Cabinetry',
    cardBg: 'bg-[#D97706]',
    tagColor: 'bg-[#0A1020] text-white',
    rating: 5,
  },
]

const FAQS = [
  {
    q: 'How does Connecta verify artisans and service providers?',
    a: 'Every verified provider undergoes a mandatory multi-step check: government-issued identification (NIN, Voter Card, or CAC business certificate), physical verification of trade experience or apprenticeship guarantors, and a review of past work before receiving the Verified Artisan Badge.',
  },
  {
    q: 'Is it free to request quotes on Connecta?',
    a: 'Yes, 100% free for customers. You can describe your issue, attach photos, and receive competitive quotations from local technicians with zero obligation to book.',
  },
  {
    q: 'How are prices determined? Will there be surprise costs?',
    a: 'Providers submit itemized quotes with clear breakdowns for labor, replacement materials, and visit fees in Nigerian Naira. If hidden damage is uncovered during work, the provider must submit a formal Change Order with photo evidence that you approve before any extra charge applies.',
  },
  {
    q: 'Which areas in Kano does Connecta currently cover?',
    a: 'Connecta is actively available across Kano Metropolitan, including Nassarawa GRA, Bompai, Sabon Gari, Fagge, Tarauni, Dala, Gwale, Hotoro, and surrounding residential and commercial districts.',
  },
  {
    q: 'How do I join Connecta as an artisan or workshop owner?',
    a: 'Simply click "Become a Provider", submit your trade details, experience, service areas, and upload your identification document. Our verification team reviews submissions within 24–48 hours.',
  },
  {
    q: 'What happens if a job is not completed satisfactorily?',
    a: 'Connecta incorporates a built-in dispute resolution process. Both customer and technician can submit photo evidence and notes to our support team for an auditable and fair review.',
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [selectedTradeTab, setSelectedTradeTab] = useState('all')

  const filteredCategories =
    selectedTradeTab === 'all'
      ? CATEGORIES
      : CATEGORIES.filter((c) => c.group === selectedTradeTab)

  // Chowdeck-style cycling text motion
  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % DYNAMIC_PHRASES.length)
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FC] text-[#0A1020] selection:bg-[#4D78FF] selection:text-white">
      {/* Chowdeck-style Floating Pill Header */}
      <div className="sticky top-4 z-50 px-4 sm:px-6">
        <header className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl border border-slate-200/90 rounded-full px-4 sm:px-6 py-2.5 shadow-lg shadow-black/5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link href="/" className="flex items-center">
              <div className="relative w-32 h-8">
                <Image
                  src="/brand/svg/connecta-logo.svg"
                  alt="Connecta Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2 text-[11px] font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="inline-flex items-center overflow-hidden rounded-xs w-4 h-3 border border-black/15 shadow-2xs shrink-0" aria-label="Nigeria Flag">
                <span className="w-1/3 h-full bg-[#008751]" />
                <span className="w-1/3 h-full bg-white" />
                <span className="w-1/3 h-full bg-[#008751]" />
              </span>
              <span>Nigeria</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <Link
              href="#services"
              className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-[#0A1020] transition-colors"
            >
              Services
            </Link>
            <Link
              href="#how-it-works"
              className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-[#0A1020] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#about"
              className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-[#0A1020] transition-colors"
            >
              About
            </Link>
            <Link
              href="#faq"
              className="px-3.5 py-1.5 rounded-full hover:bg-slate-100 hover:text-[#0A1020] transition-colors"
            >
              FAQs
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/provider/register"
              className="text-xs font-semibold text-slate-700 hover:text-[#4D78FF] transition-colors px-3 py-1.5 hidden sm:inline-block"
            >
              Become a Provider
            </Link>
            <Link
              href="/requests/new"
              className="inline-flex items-center justify-center rounded-full bg-[#4D78FF] hover:bg-[#3b63e6] px-4 sm:px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02]"
            >
              Request a Quote
            </Link>
          </div>
        </header>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section with Chowdeck-Style Large Text Motion & Alley Arrangements */}
        <section className="pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden relative">
          {/* Subtle Halftone Pattern */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#0A1020 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/90 px-4 py-1.5 text-xs font-bold text-[#4D78FF] border border-blue-200 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Verified Local Service Marketplace</span>
              </div>

              {/* Chowdeck-style Large Heading with Animated Text Motion */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0A1020] leading-[1.08]">
                Find trusted local pros for{' '}
                <span className="inline-block relative text-[#4D78FF] transition-all duration-300 underline decoration-[#F59E0B] decoration-wavy decoration-2">
                  {DYNAMIC_PHRASES[phraseIndex]}
                </span>
              </h1>

              <p className="text-base sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
                Discover vetted electricians, plumbers, repair technicians, and carpenters. Compare transparent line-item quotes and hire with confidence.
              </p>

              {/* Chowdeck-style Search Capsule */}
              <div className="pt-2 max-w-2xl mx-auto">
                <div className="bg-white p-2 sm:p-2.5 rounded-full shadow-2xl border border-slate-200/90 flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-3 pl-4">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What needs fixing? (e.g. inverter fault, screen, pipe leak)"
                      className="w-full bg-transparent text-sm text-[#0A1020] placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                  <Link
                    href={`/requests/new?q=${encodeURIComponent(searchQuery)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] px-6 py-3 text-xs sm:text-sm font-bold text-white transition-all hover:scale-[1.02] shrink-0 shadow-md"
                  >
                    <span>Request Quotes</span>
                    <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Trending in Kano:</span>
                {['Solar Installation', 'Screen Replacement', 'Borehole Servicing', 'AC Cleaning', 'Car Diagnostics'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/requests/new?q=${encodeURIComponent(tag)}`}
                    className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#0A1020] hover:text-white text-slate-700 border border-slate-200 transition-all shadow-xs font-semibold"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Chowdeck-Style Alley Arrangement with Vision/Mission Styling */}
            <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {CATEGORIES.slice(0, 4).map((cat, idx) => (
                <div
                  key={cat.slug}
                  className={`group bg-white rounded-3xl p-3 border border-slate-200 shadow-md hover:shadow-2xl hover:border-[#4D78FF] transition-all duration-300 transform ${
                    idx % 2 === 1 ? 'md:translate-y-4' : ''
                  }`}
                >
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100">
                    <Image
                      src={cat.image}
                      alt={cat.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {cat.badge && (
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-3 py-1 rounded-full shadow-md ${cat.badgeColor}`}>
                        {cat.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow">
                      {cat.speed}
                    </div>
                  </div>

                  <div className="p-3 pt-4">
                    <div className="flex items-center gap-1.5">
                      <CornerDownRight className="w-4 h-4 text-[#4D78FF] shrink-0 stroke-[2.5]" />
                      <h3 className="text-base font-extrabold text-[#0A1020] group-hover:text-[#4D78FF] transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {cat.desc}
                    </p>
                    <Link
                      href={`/requests/new?category=${cat.slug}`}
                      className="mt-4 w-full py-2.5 rounded-xl bg-slate-50 group-hover:bg-[#0A1020] group-hover:text-white text-slate-700 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Get Instant Quotes</span>
                      <CornerDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* BRAND CHARACTER & TOOLKIT SHOWCASE (ADAPTED TO VISION/MISSION)     */}
        {/* ================================================================= */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Electric Azure / Indigo */}
            <div className="bg-[#1E1B4B] text-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border border-white/10 group">
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />
              <div className="relative h-60 w-full bg-slate-900/50 overflow-hidden">
                <Image
                  src="/images/brand-illustrations/connecta-1.webp"
                  alt="Connecta Multi-Trade Certification & Emblem"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#10B981] text-white shadow-md">
                  Vetted Credentials
                </span>
              </div>
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-5 h-5 text-[#10B981] shrink-0 stroke-[2.5]" />
                    <h4 className="text-xl font-black tracking-tight">Multi-Trade Standards</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Verified credentials across 8 technical artisan trades. Rigorous ID vetting, workshop checks, and trade guild recognition.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>Connecta Standard</span>
                  <span className="text-[#10B981]">100% Vetted</span>
                </div>
              </div>
            </div>

            {/* Card 2: Warm Amber / Gold */}
            <div className="bg-[#D97706] text-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border border-white/10 group">
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />
              <div className="relative h-60 w-full bg-slate-900/50 overflow-hidden">
                <Image
                  src="/images/brand-illustrations/connecta-2.webp"
                  alt="Heavy Duty Mobile Diagnostics Kit"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#0A1020] text-white shadow-md border border-white/20">
                  Precision Equipment
                </span>
              </div>
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-5 h-5 text-amber-200 shrink-0 stroke-[2.5]" />
                    <h4 className="text-xl font-black tracking-tight">Equipped for Every Job</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
                    Specialized diagnostic tools, transparent component pricing, and documented change orders with zero guesswork.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-amber-100">
                  <span>Hardware Diagnostics</span>
                  <span>Zero Guesswork</span>
                </div>
              </div>
            </div>

            {/* Card 3: Deep Forest / Emerald */}
            <div className="bg-[#0A2614] text-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between border border-white/10 group">
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />
              <div className="relative h-60 w-full bg-slate-900/50 overflow-hidden">
                <Image
                  src="/images/brand-illustrations/connecta-3.webp"
                  alt="Vibrant Connecta Artisan and Customer Community"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-[#4D78FF] text-white shadow-md">
                  Vibrant Guild
                </span>
              </div>
              <div className="p-6 relative z-10 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-5 h-5 text-emerald-300 shrink-0 stroke-[2.5]" />
                    <h4 className="text-xl font-black tracking-tight">Community of Craft</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    Connecting vetted technical professionals with verified customers. Direct messaging, clear scheduling, and mutual accountability.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/20 flex items-center justify-between text-xs font-bold text-emerald-200">
                  <span>Artisans & Households</span>
                  <span>Mutual Trust</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* ABOUT (VISION AND MISSION & PHILOSOPHY SECTION)                   */}
        {/* ================================================================= */}
        <section id="about" className="py-20 bg-[#F5F7FC] relative overflow-hidden border-y border-slate-200">
          <span id="vision-mission" className="sr-only" />
          {/* Halftone / Dot pattern from image */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#10B981 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Core Purpose & Philosophy
              </span>
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                  ↓
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-[#0A1020] tracking-tight">
                  Vision & Mission
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                What drives Connecta across Kano and Northern Nigeria.
              </p>
            </div>

            {/* Distinct Cards with Angled Arrows (Exact Match from Root Image) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Vision Card (Amber / Gold from image) */}
              <div className="bg-[#E67E00] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CornerDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0 stroke-[2.5]" />
                    <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Vision<br />Statement
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed font-medium text-white/95">
                    To establish Northern Nigeria as a globally competitive hub of verified artisan talent and technical excellence, where rich cultural heritage, skilled trade mastery, and modern digital innovation power sustainable economic growth.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/90">
                  <span>Connecta 2.0 Ecosystem</span>
                  <span>Kano • Northern Nigeria</span>
                </div>
              </div>

              {/* Mission Card (Deep Royal Indigo / Navy from image) */}
              <div className="bg-[#2E1A47] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <CornerDownRight className="w-8 h-8 sm:w-10 sm:h-10 text-white shrink-0 stroke-[2.5]" />
                    <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Mission<br />Statement
                    </h3>
                  </div>
                  <p className="text-base sm:text-lg leading-relaxed font-medium text-white/95">
                    To empower Northern technicians, craftspeople, and service specialists through transparent digital discovery, hands-on collaboration, and direct customer connections—bridging traditional craftsmanship with cutting-edge tools to deliver effortless repairs.
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/90">
                  <span>Built for Artisans & Customers</span>
                  <span>100% Verified Quality</span>
                </div>
              </div>
            </div>

            {/* Core Objectives (Exact Cards from core objectives.png) */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#D97706] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                  <h4 className="text-lg font-bold">Cultivate Skill Excellence:</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Provide practical, itemized quoting tools and evidence logs that equip technicians with industry-standard technical and business capabilities.
                </p>
              </div>

              <div className="bg-[#10B981] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                  <h4 className="text-lg font-bold">Bridge Culture & Modernity:</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Preserve and celebrate Northern trade mastery by integrating traditional artisan reliability into modern digital commerce and mobile platforms.
                </p>
              </div>

              <div className="bg-[#1E1B4B] text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                  <h4 className="text-lg font-bold">Drive Sustainable Growth:</h4>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                  Establish transparent pricing in Naira, eliminating middlemen markups and directly connecting regional technicians with active paying households.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* WHO CONNECTA SERVES (EXACT LAYOUT FROM who to expect full section) */}
        {/* ================================================================= */}
        <section id="who-connecta-serves" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0A2614] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl">
              {/* Halftone / Pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />

              <div className="relative z-10 max-w-3xl space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center font-bold text-lg">
                    ↓
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                    Who Connecta Serves
                  </h2>
                </div>
                <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
                  Whether you are an emerging technician building your foundational business, an established master artisan expanding across Kano, or a property owner seeking top-tier service talent—Connecta is your platform to connect, grow, and get things fixed.
                </p>
              </div>

              {/* Colorful Pill Grid (Exact Match from Root Image) */}
              <div className="mt-10 flex flex-wrap gap-3 relative z-10">
                {WHO_CONNECTA_SERVES.map((pill, idx) => (
                  <span
                    key={idx}
                    className={`${pill.color} text-xs sm:text-sm font-bold px-4 py-2.5 rounded-full shadow-md transition-transform hover:scale-105 cursor-default`}
                  >
                    {pill.title}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SUPPORTED SERVICE TRADES (CHOWDECK-STYLE STAGGERED ALLEY)         */}
        {/* ================================================================= */}
        <section id="services" className="py-20 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                  ↓
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020]">
                  Explore Supported Trades
                </h2>
              </div>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
                Every trade is backed by verified identification, specialized toolkits, and transparent pricing in Nigerian Naira.
              </p>
            </div>
            <Link
              href="/requests/new"
              className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white px-6 py-3 text-xs sm:text-sm font-bold shadow-lg transition-all hover:scale-105 self-start"
            >
              <span>Broadcast Custom Request</span>
              <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>

          {/* Chowdeck-style Interactive Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 mb-8 scrollbar-none">
            {TRADE_TABS.map((tab) => {
              const isActive = selectedTradeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTradeTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap shadow-xs cursor-pointer ${
                    isActive
                      ? 'bg-[#0A1020] text-white shadow-md scale-[1.02]'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Chowdeck Dual-Staggered Alley Grid (Alternating Offsets & Tactile Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 items-start">
            {filteredCategories.map((cat, idx) => (
              <div
                key={cat.slug}
                className={`group bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/90 shadow-md hover:shadow-2xl hover:border-[#4D78FF] transition-all duration-300 transform flex flex-col justify-between ${
                  idx % 2 === 1 ? 'lg:translate-y-8' : ''
                }`}
              >
                <div>
                  {/* Image Container with Inner Border Radius & Zoom Effect */}
                  <div className="relative h-52 sm:h-56 w-full rounded-2xl overflow-hidden bg-slate-100">
                    <Image
                      src={cat.image}
                      alt={cat.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />

                    {/* Gradient Vignette for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />

                    {/* Top Floating Category Badge with Pulsing Dot */}
                    {cat.badge && (
                      <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 ${cat.badgeColor}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        <span>{cat.badge}</span>
                      </span>
                    )}

                    {/* Chowdeck-style Speed / Arrival Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-extrabold text-slate-900 shadow-md flex items-center gap-1 border border-white/60">
                      <Clock className="w-3 h-3 text-[#10B981]" />
                      <span>{cat.speed}</span>
                    </div>

                    {/* Bottom Floating Guarantee Snippets */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-white font-bold">
                      <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        ₦ Itemized Quote
                      </span>
                      <span className="bg-[#10B981]/90 backdrop-blur-md px-2 py-0.5 rounded-full text-white font-extrabold">
                        Vetted Pro
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Sub-specialty Tags */}
                  <div className="pt-4 px-1 pb-1 space-y-3">
                    <div className="flex items-center gap-1.5">
                      <CornerDownRight className="w-4 h-4 text-[#4D78FF] shrink-0 stroke-[2.5]" />
                      <h3 className="text-base font-extrabold text-[#0A1020] group-hover:text-[#4D78FF] transition-colors">
                        {cat.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {cat.desc}
                    </p>

                    {/* Sub-Specialty Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cat.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-[#4D78FF] transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA Full-Bleed Action */}
                <div className="pt-4 px-1 pb-1">
                  <Link
                    href={`/requests/new?category=${cat.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 group-hover:bg-[#0A1020] group-hover:text-white text-slate-800 text-xs font-extrabold transition-all flex items-center justify-between shadow-2xs group-hover:shadow-md"
                  >
                    <span>Get Instant Quotes</span>
                    <CornerDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* FEATURED VERIFIED SPECIALISTS (VISION/MISSION ADAPTATION)         */}
        {/* ================================================================= */}
        <section className="py-20 bg-white border-y border-slate-200 relative overflow-hidden">
          {/* Subtle Halftone Background */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#0A1020 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl mx-auto text-center mb-14 space-y-3">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Verified Local Professionals
              </span>
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                  ↓
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020]">
                  Featured Verified Specialists
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                Real local specialists with verified government identity, workshop locations, and proven track records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURED_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className={`${provider.cardBg} text-white rounded-3xl p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/10 group`}
                >
                  {/* Halftone / Dot pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                      backgroundSize: '18px 18px',
                    }}
                  />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg shrink-0">
                          <Image
                            src={provider.avatar}
                            alt={provider.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-lg font-black">{provider.name}</h4>
                            <BadgeCheck className="w-5 h-5 text-[#10B981]" />
                          </div>
                          <div className="text-xs text-white/80">{provider.business}</div>
                          <div className="text-xs font-bold text-[#10B981] mt-0.5">{provider.trade}</div>
                        </div>
                      </div>
                    </div>

                    {/* Skill / Spec Details Box */}
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Workshop Area:</span>
                        <span className="font-bold">{provider.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/60">Experience:</span>
                        <span className="font-bold">{provider.experience}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-white/10">
                        <span className="text-white/60">Recent Job:</span>
                        <span className="font-bold text-amber-200">{provider.recentJob}</span>
                      </div>
                    </div>

                    {/* Badges / Rating row */}
                    <div className="flex items-center justify-between text-xs font-bold text-white/90">
                      <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                        <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                        <span>{provider.rating.toFixed(2)}</span>
                        <span className="font-normal text-white/70">({provider.reviews} reviews)</span>
                      </div>
                      <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                        {provider.jobs} Completed
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
                    <Link
                      href={`/requests/new?providerId=${provider.id}`}
                      className="w-full py-3.5 rounded-full bg-white hover:bg-[#10B981] text-[#0A1020] hover:text-white text-xs font-extrabold text-center transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>Request Quotation</span>
                      <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* HOW CONNECTA WORKS (ADAPTED TO CORE OBJECTIVES CARDS LAYOUT)      */}
        {/* ================================================================= */}
        <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-3">
            <span className="text-xs font-bold text-[#4D78FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Clear 3-Stage Process
            </span>
            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                ↓
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020]">
                How Connecta Works
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600">
              Our 3-stage marketplace journey built around credibility, itemized quotes, and verified accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {THREE_STAGES.map((st) => {
              const Icon = st.icon
              return (
                <div
                  key={st.number}
                  className={`${st.cardBg} text-white rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/10 group`}
                >
                  {/* Halftone / Dot pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                      backgroundSize: '18px 18px',
                    }}
                  />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <span className="text-5xl font-black text-white/30 tracking-tight">
                        {st.number}
                      </span>
                      <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CornerDownRight className="w-6 h-6 text-white shrink-0 stroke-[2.5]" />
                        <h3 className="text-2xl font-extrabold tracking-tight">
                          {st.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
                        {st.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/80 relative z-10">
                    <span>{st.footerMeta}</span>
                    <CornerDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ================================================================= */}
        {/* TRUST & VERIFICATION (WHO CONNECTA SERVES STYLE GRAND CONTAINER)   */}
        {/* ================================================================= */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0A1E2E] text-white rounded-3xl p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl">
              {/* Halftone / Pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center font-bold text-lg shrink-0">
                      ↓
                    </div>
                    <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                      The Connecta Trust Standard
                    </h2>
                  </div>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                    Anyone can post an ad online. Connecta ensures that every provider badge reflects actual verified credentials, physical workshop audits, and verified performance history.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                      <div className="flex items-center gap-2">
                        <CornerDownRight className="w-4 h-4 text-[#10B981] stroke-[2.5]" />
                        <h4 className="text-sm font-bold text-white">ID & Business Checks</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Verification of National Identification Number (NIN), Voter Card, or CAC business certificate.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                      <div className="flex items-center gap-2">
                        <CornerDownRight className="w-4 h-4 text-[#F59E0B] stroke-[2.5]" />
                        <h4 className="text-sm font-bold text-white">Itemized Quotations</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Labor, replacement parts, and visit fees calculated upfront in kobo minor units with zero hidden fees.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                      <div className="flex items-center gap-2">
                        <CornerDownRight className="w-4 h-4 text-[#4D78FF] stroke-[2.5]" />
                        <h4 className="text-sm font-bold text-white">Photo Evidence Log</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Technicians upload before and after work photos directly to the booking for mutual protection.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                      <div className="flex items-center gap-2">
                        <CornerDownRight className="w-4 h-4 text-[#8B7CFF] stroke-[2.5]" />
                        <h4 className="text-sm font-bold text-white">Verified Reviews</h4>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Customer reviews can only be submitted after a verified booking is marked completed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                    <Image
                      src="/images/services/electrician_working_on_electrical_panel.jpg"
                      alt="Verified electrician performing electrical panel maintenance"
                      fill
                      className="object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E2E] via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1.5">
                      <div className="font-bold text-white flex items-center gap-1.5 text-sm">
                        <BadgeCheck className="w-5 h-5 text-[#10B981]" />
                        <span>Verified Artisan Seal</span>
                      </div>
                      <div className="text-slate-300 leading-relaxed">
                        Conferred only upon manual inspection of identity records, workshop location, and trade qualifications.
                      </div>
                    </div>
                  </div>

                  {/* Colorful Verification Pills */}
                  <div className="flex flex-wrap gap-2.5">
                    {TRUST_GUARANTEES.map((g, idx) => (
                      <span
                        key={idx}
                        className={`${g.color} text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md`}
                      >
                        {g.title}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* CUSTOMER REVIEWS (VISION/MISSION ADAPTATION)                       */}
        {/* ================================================================= */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl mx-auto text-center mb-14 space-y-3">
            <span className="text-xs font-bold text-[#4D78FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Verified Feedback
            </span>
            <div className="flex items-center justify-center gap-3">
              <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                ↓
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020]">
                Verified Customer Stories
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              Authentic reviews tied directly to completed jobs and verified service bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className={`${r.cardBg} text-white rounded-3xl p-8 sm:p-9 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-white/10 group`}
              >
                {/* Halftone dot texture */}
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                    backgroundSize: '18px 18px',
                  }}
                />

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(r.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                      ))}
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-sm ${r.tagColor}`}>
                      {r.service}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-white/95 leading-relaxed font-normal italic">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between text-xs font-bold text-white/90 relative z-10">
                  <div>
                    <div className="text-white text-sm font-extrabold">{r.author}</div>
                    <div className="text-white/70 font-normal">{r.neighborhood}</div>
                  </div>
                  <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* FREQUENTLY ASKED QUESTIONS (VISION/MISSION ADAPTATION)             */}
        {/* ================================================================= */}
        <section id="faq" className="py-20 bg-white border-y border-slate-200 relative overflow-hidden">
          {/* Subtle Halftone Background */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#0A1020 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-14 space-y-3">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Help & Answers
              </span>
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full border-2 border-[#0A1020] flex items-center justify-center font-bold text-lg shrink-0">
                  ↓
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0A1020]">
                  Frequently Asked Questions
                </h2>
              </div>
              <p className="text-sm text-slate-600">
                Everything you need to know about discovering, quoting, and booking on Connecta.
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index
                const qNumber = `Q0${index + 1}`
                return (
                  <div
                    key={index}
                    className={`rounded-2xl transition-all duration-300 border ${
                      isOpen
                        ? 'bg-[#F5F7FC] border-[#4D78FF] shadow-lg'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-5 sm:p-6 flex items-center justify-between text-left gap-4 focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#0A1020] text-white shrink-0">
                          {qNumber}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-[#0A1020]">
                          {faq.q}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-500 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-[#4D78FF]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-6 sm:px-6 pt-0">
                        <div className="pt-3 border-t border-slate-200/80 flex items-start gap-2.5">
                          <CornerDownRight className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5 stroke-[2.5]" />
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* PROVIDER CTA BANNER (WHO CONNECTA SERVES STYLE GRAND CONTAINER)    */}
        {/* ================================================================= */}
        <section className="py-20 bg-[#F5F7FC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0A2614] text-white rounded-3xl p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-2xl">
              {/* Halftone / Dot pattern */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
                  backgroundSize: '18px 18px',
                }}
              />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="space-y-5 max-w-xl text-center md:text-left">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center font-bold text-lg shrink-0">
                      ↓
                    </div>
                    <span className="text-xs font-bold text-[#10B981] bg-white/10 px-3.5 py-1 rounded-full border border-white/20">
                      For Skilled Technicians & Workshops
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                    Grow your trade business on Connecta.
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                    Join hundreds of verified electricians, mechanics, plumbers, and technicians. Receive real customer requests, send professional quotations, and build a lasting reputation.
                  </p>

                  {/* Provider Benefits Pills */}
                  <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start">
                    {PROVIDER_BENEFITS.map((b, idx) => (
                      <span
                        key={idx}
                        className={`${b.color} text-xs font-bold px-3 py-1.5 rounded-full shadow-md`}
                      >
                        {b.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 z-10">
                  <Link
                    href="/provider/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#4D78FF] hover:bg-[#3b63e6] px-8 py-4 text-xs sm:text-sm font-extrabold text-white shadow-xl transition-all hover:scale-105"
                  >
                    <span>Apply as a Provider</span>
                    <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                  <Link
                    href="/admin/verification"
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 text-xs sm:text-sm font-bold text-white transition-colors"
                  >
                    Admin Verification
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Comprehensive Polished Dark Footer (Vision/Mission & Chowdeck Style) */}
      <footer className="bg-[#0A1020] text-white pt-20 pb-12 relative overflow-hidden border-t border-slate-800">
        {/* Halftone / Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Top Pre-Footer Callout Card */}
          <div className="pb-16 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/20 px-3.5 py-1 text-xs font-bold text-[#10B981] border border-[#10B981]/30">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Kano Launch Hub • Expanding Across Northern Nigeria</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Everything fixed. <br />
                <span className="text-[#4D78FF]">Every artisan verified.</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Connecta brings accountability, itemized Naira pricing, and certified artisan talent directly to your doorstep with end-to-end escrow security.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/requests/new"
                className="inline-flex items-center gap-2 rounded-full bg-[#4D78FF] hover:bg-[#3b63e6] text-white px-7 py-4 text-xs sm:text-sm font-extrabold shadow-xl transition-all hover:scale-105"
              >
                <span>Request Free Quotation</span>
                <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
              <Link
                href="/provider/register"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-4 text-xs sm:text-sm font-bold transition-all"
              >
                <span>Join as an Artisan</span>
                <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>

          {/* Active Metro Coverage Badges */}
          <div className="py-10 border-b border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-[#4D78FF]" />
              <span>Active Service Coverage Across Kano Metropolitan:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Nassarawa GRA',
                'Bompai Industrial',
                'Sabon Gari Market',
                'Fagge Commercial',
                'Tarauni Residential',
                'Dala Historic',
                'Gwale District',
                'Hotoro Hub',
                'Kano Municipal',
                'Kano State Tech Corridor',
              ].map((loc) => (
                <span
                  key={loc}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 transition-colors cursor-default"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {/* 5-Column High-Contrast Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-14 border-b border-white/10">
            {/* Column 1: Brand & Headquarters */}
            <div className="md:col-span-2 space-y-5">
              <div className="relative w-36 h-9">
                <Image
                  src="/brand/svg/connecta-logo-white.svg"
                  alt="Connecta Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Connecta is Nigeria&apos;s trusted local services marketplace. Connecting homeowners, property managers, and businesses with verified artisans and technical repair specialists across Kano and beyond.
              </p>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Headquarters: Kano State, Nigeria</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#4D78FF] shrink-0" />
                  <a href="mailto:support@connecta.ng" className="hover:text-white transition-colors">
                    support@connecta.ng
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span>+234 800 CONNECTA (Toll-Free Support)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-bold text-slate-400">
                <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-emerald-400">
                  100% ID Vetted
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-blue-400">
                  Escrow Protected
                </span>
                <span className="bg-white/10 px-2.5 py-1 rounded-md border border-white/10 text-amber-400">
                  Integer Kobo Billing
                </span>
              </div>
            </div>

            {/* Column 2: Supported Trades */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Service Trades</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><Link href="/requests/new?category=electrical" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Electrical & Inverters</span></Link></li>
                <li><Link href="/requests/new?category=phone-repair" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Phone & Tablet Repair</span></Link></li>
                <li><Link href="/requests/new?category=ac-cooling" className="hover:text-white transition-colors flex items-center gap-1.5"><span>AC & Refrigeration</span></Link></li>
                <li><Link href="/requests/new?category=auto-mechanic" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Auto Mechanics</span></Link></li>
                <li><Link href="/requests/new?category=carpentry" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Woodwork & Cabinetry</span></Link></li>
                <li><Link href="/requests/new?category=plumbing" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Plumbing & Boreholes</span></Link></li>
                <li><Link href="/requests/new?category=computer-repair" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Computer Hardware</span></Link></li>
                <li><Link href="/requests/new?category=painting" className="hover:text-white transition-colors flex items-center gap-1.5"><span>Painting & Finishing</span></Link></li>
              </ul>
            </div>

            {/* Column 3: Platform & Trust */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#4D78FF]" />
                <span>Platform & Trust</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><Link href="#vision-mission" className="hover:text-white transition-colors">Vision & Mission</Link></li>
                <li><Link href="#who-connecta-serves" className="hover:text-white transition-colors">Who Connecta Serves</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works (3 Stages)</Link></li>
                <li><Link href="#services" className="hover:text-white transition-colors">Supported Catalog</Link></li>
                <li><Link href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
                <li><Link href="/requests/new" className="hover:text-white transition-colors">Broadcast a Custom Need</Link></li>
                <li><Link href="/admin/verification" className="hover:text-white transition-colors">Admin Verification Portal</Link></li>
              </ul>
            </div>

            {/* Column 4: Providers & Governance */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>For Artisans & Guilds</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li><Link href="/provider/register" className="hover:text-white transition-colors">Apply as a Provider</Link></li>
                <li><Link href="/provider/register" className="hover:text-white transition-colors">NIN & CAC Verification</Link></li>
                <li><Link href="/brand" className="hover:text-white transition-colors">Brand Identity Guidelines</Link></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">System Architecture</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/disputes" className="hover:text-white transition-colors">Dispute Resolution Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Chowdeck-Style Large Stylized Brand Watermark */}
          <div className="pt-8 pb-4 flex items-center justify-center select-none overflow-hidden">
            <span className="text-[12vw] font-black tracking-widest text-white/[0.04] leading-none pointer-events-none whitespace-nowrap uppercase">
              CONNECTA
            </span>
          </div>

          {/* Polished Bottom Status & Copyright Strip */}
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 Connecta Technologies Inc. All rights reserved.</p>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-slate-300">All Systems Operational</span>
              </span>
              <span>•</span>
              <span className="text-slate-300">Currency: NGN (₦)</span>
              <span>•</span>
              <span className="text-slate-300">Verified Marketplace</span>
            </div>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
