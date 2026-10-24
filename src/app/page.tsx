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
} from 'lucide-react'

const DYNAMIC_PHRASES = [
  'solar & inverters',
  'broken phone screens',
  'emergency pipe leaks',
  'air conditioner fixes',
  'car engine diagnostics',
  'custom furniture & woodwork',
]

const CATEGORIES = [
  {
    name: 'Electrical & Wiring',
    slug: 'electrical',
    image: '/images/services/electrician_working_on_electrical_panel.jpg',
    alt: 'Electrician working on an electrical distribution panel in Kano',
    desc: 'Fault finding, house wiring, inverter & solar installations, breaker repair',
    badge: 'High Demand',
    speed: 'Avg 45 min arrival',
  },
  {
    name: 'Phone & Tablet Repair',
    slug: 'phone-repair',
    image: '/images/services/phone_repair_technician.jpg',
    alt: 'Technician repairing smartphone motherboard and screen',
    desc: 'Screens, battery replacements, charging ports, board micro-soldering',
    badge: 'Same Day',
    speed: 'Under 1 hr repair',
  },
  {
    name: 'Carpentry & Woodwork',
    slug: 'carpentry',
    image: '/images/services/carpenter_working_in_nigeria.jpg',
    alt: 'Carpenter working on wooden construction in Nigeria',
    desc: 'Custom furniture, door fittings, roof woodwork, wardrobe framing',
    speed: 'Certified timber',
  },
  {
    name: 'AC & Refrigeration',
    slug: 'ac-cooling',
    image: '/images/services/air_conditioner_repair_technician.jpg',
    alt: 'Technician inspecting and servicing air conditioner unit',
    desc: 'AC gas refill, compressor maintenance, duct cleaning, installation',
    badge: 'Seasonal Rush',
    speed: 'Genuine gas top-up',
  },
  {
    name: 'Computer & Laptop Repair',
    slug: 'computer-repair',
    image: '/images/services/computer_repair_technician.jpg',
    alt: 'Technician repairing laptop hardware in workshop',
    desc: 'Hardware upgrades, OS reinstallation, screens & thermal paste fixes',
    speed: 'Hardware diagnostic',
  },
  {
    name: 'Auto Mechanics & Diagnostics',
    slug: 'auto-mechanic',
    image: '/images/services/car_mechanic_repairing_engine.jpg',
    alt: 'Mechanic servicing car engine diagnostics in workshop',
    desc: 'Engine diagnostics, brake repairs, suspension, routine maintenance',
    badge: 'Mobile Service',
    speed: 'OBD2 scan included',
  },
  {
    name: 'Painting & Wall Finishing',
    slug: 'painting',
    image: '/images/services/house_painter_painting_wall.jpg',
    alt: 'Painter applying smooth coat to interior wall',
    desc: 'Interior and exterior painting, POP plastering, waterproofing',
    speed: 'Clean site cleanup',
  },
  {
    name: 'Plumbing & Pipe Maintenance',
    slug: 'plumbing',
    image: '/images/services/cleaning_or_maintenance_technician.jpg',
    alt: 'Maintenance specialist working on piping equipment',
    desc: 'Water pipe leaks, borehole pumps, kitchen & bathroom installations',
    badge: 'Emergency Ready',
    speed: 'Pressure testing',
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

const THREE_STAGES = [
  {
    number: '01',
    title: 'Describe Your Issue & Location',
    desc: 'Tell us what needs fixing in your home, vehicle, or device. Add photos and choose your urgency (emergency, today, or scheduled).',
    icon: Search,
  },
  {
    number: '02',
    title: 'Compare Verified Quotes',
    desc: 'Eligible local technicians in Kano review your problem and submit transparent line-item estimates detailing labor, parts, and duration.',
    icon: FileSearch,
  },
  {
    number: '03',
    title: 'Confirm Appointment & Track Work',
    desc: 'Select the best quote. Track technician arrival, review before/after photo evidence, pay in NGN, and leave a verified review.',
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
    rating: 5,
  },
  {
    quote:
      'I had a cracked iPhone 14 Pro screen and was worried about fake replacement screens. Danbatta showed me the genuine OLED panel, transferred TrueTone, and finished in under 45 minutes.',
    author: 'Usman Farouk',
    neighborhood: 'Sabon Gari, Kano',
    service: 'Screen Replacement',
    rating: 5,
  },
  {
    quote:
      'Finding a reliable carpenter for custom office desks in Bompai was always a gamble until Connecta. Kabiru submitted an itemized quote for mahogany wood, delivered on time, and the finishing is top class.',
    author: 'Fatima Sanusi',
    neighborhood: 'Bompai Industrial, Kano',
    service: 'Custom Office Cabinetry',
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
  const [city] = useState('Kano')
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [phraseIndex, setPhraseIndex] = useState(0)

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

            <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200">
              <MapPin className="w-3 h-3 text-[#4D78FF]" />
              <span>{city}, Nigeria</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-700">
            <Link
              href="#services"
              className="px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              Services
            </Link>
            <Link
              href="#vision-mission"
              className="px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              Vision & Mission
            </Link>
            <Link
              href="#who-connecta-serves"
              className="px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              Who It&apos;s For
            </Link>
            <Link
              href="#how-it-works"
              className="px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#faq"
              className="px-3 py-1.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              FAQ
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

      {/* Hero Section with Chowdeck-Style Large Text Motion & Alley Arrangements */}
      <main className="flex-1">
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
                    <ArrowRight className="w-4 h-4" />
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
                    className="px-3 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Chowdeck-Style Alley Arrangement (Dual Parallel Rows with Photos & Badges) */}
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
                      <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-[#0A1020]/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        {cat.badge}
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-800 shadow">
                      {cat.speed}
                    </div>
                  </div>

                  <div className="p-3 pt-4">
                    <h3 className="text-base font-extrabold text-[#0A1020] group-hover:text-[#4D78FF] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {cat.desc}
                    </p>
                    <Link
                      href={`/requests/new?category=${cat.slug}`}
                      className="mt-4 w-full py-2 rounded-xl bg-slate-50 group-hover:bg-[#4D78FF] group-hover:text-white text-slate-700 text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Get Instant Quotes</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Connecta Brand Character & Toolkit Showcase */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col justify-between">
              <div className="relative h-56 w-full bg-slate-50">
                <Image
                  src="/images/brand-illustrations/connecta-1.webp"
                  alt="Connecta Multi-Trade Certification & Emblem"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h4 className="text-sm font-extrabold text-[#0A1020]">Multi-Trade Standards</h4>
                <p className="text-xs text-slate-500 mt-1">Verified credentials across 8 technical artisan trades.</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col justify-between">
              <div className="relative h-56 w-full bg-slate-50">
                <Image
                  src="/images/brand-illustrations/connecta-2.webp"
                  alt="Heavy Duty Mobile Diagnostics Kit"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h4 className="text-sm font-extrabold text-[#0A1020]">Equipped for Every Job</h4>
                <p className="text-xs text-slate-500 mt-1">Specialized diagnostics, transparent parts, and documented change orders.</p>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col justify-between">
              <div className="relative h-56 w-full bg-slate-50">
                <Image
                  src="/images/brand-illustrations/connecta-3.webp"
                  alt="Vibrant Connecta Artisan and Customer Community"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h4 className="text-sm font-extrabold text-[#0A1020]">Community of Craft</h4>
                <p className="text-xs text-slate-500 mt-1">Connecting vetted technical professionals with verified customers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* VISION AND MISSION SECTION (EXACT LAYOUT FROM IMAGE IN ROOT)      */}
        {/* ================================================================= */}
        <section id="vision-mission" className="py-20 bg-[#F5F7FC] relative overflow-hidden border-y border-slate-200">
          {/* Halftone / Dot pattern from image */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#10B981 1.5px, transparent 1.5px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Core Purpose & Philosophy
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0A1020] tracking-tight mt-3">
                Vision & Mission
              </h2>
              <p className="text-sm text-slate-600 mt-2">
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

        {/* Popular Categories Grid (Full 8 Trades) */}
        <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
                Full Catalog
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A1020] mt-1">
                Explore Supported Service Trades
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Every trade is backed by verified identification, specialized toolkits, and transparent pricing.
              </p>
            </div>
            <Link
              href="/requests/new"
              className="text-xs font-bold text-[#4D78FF] hover:underline flex items-center gap-1 self-start"
            >
              <span>Broadcast a custom request</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className="group relative bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-[#4D78FF] hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {cat.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-[#0A1020]/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                      {cat.badge}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-[#0A1020] group-hover:text-[#4D78FF] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>

                  <Link
                    href={`/requests/new?category=${cat.slug}`}
                    className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#4D78FF]"
                  >
                    <span>Request Quotation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Local Kano Professionals */}
        <section className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
                Vetted Kano Artisans
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A1020] mt-1">
                Featured Verified Specialists
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Real local specialists with verified government identity, workshop locations, and proven track records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURED_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-[#F5F7FC] rounded-3xl p-6 sm:p-7 border border-slate-200 flex flex-col justify-between hover:shadow-xl transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md shrink-0">
                        <Image
                          src={provider.avatar}
                          alt={provider.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-base font-bold text-[#0A1020]">{provider.name}</h4>
                          {provider.verified && (
                            <BadgeCheck className="w-4 h-4 text-[#10B981]" />
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{provider.business}</div>
                        <div className="text-[11px] text-[#4D78FF] font-bold">{provider.trade}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Area:</span>
                        <span className="font-semibold text-slate-800">{provider.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Experience:</span>
                        <span className="font-semibold text-slate-800">{provider.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Recent:</span>
                        <span className="font-semibold text-[#4D78FF]">{provider.recentJob}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                        <span>{provider.rating.toFixed(2)}</span>
                        <span className="font-normal text-slate-500">({provider.reviews} reviews)</span>
                      </div>
                      <div className="text-slate-500">
                        <strong className="text-slate-800">{provider.jobs}</strong> completed
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/requests/new?providerId=${provider.id}`}
                    className="mt-6 w-full py-3 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white text-xs font-bold text-center transition-all shadow-md block"
                  >
                    Request Quotation
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Connecta Works — 3 Stages */}
        <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
              Transparent & Simple
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A1020] mt-1">
              How Connecta Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Our 3-stage customer journey designed around credibility, clear pricing, and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {THREE_STAGES.map((st) => {
              const Icon = st.icon
              return (
                <div
                  key={st.number}
                  className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col items-start relative space-y-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-4xl font-black text-slate-200">
                      {st.number}
                    </span>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#4D78FF] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[#0A1020]">{st.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Trust & Verification Section */}
        <section className="py-20 bg-[#0A1020] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/20 px-3.5 py-1 text-xs font-bold text-[#10B981]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The Connecta Verification Standard</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  How we protect customers and empower honest artisans.
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Anyone can post an ad online. Connecta ensures that every provider badge reflects actual verified credentials and verified performance history.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      1
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Identity & Business Checks</div>
                      <div className="text-xs text-slate-300">
                        Verification of National Identification Number (NIN), Voter Card, or CAC business certificate.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      2
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Transparent Itemized Quotations</div>
                      <div className="text-xs text-slate-300">
                        Detailed labor, replacement parts, and visit fee breakdowns calculated upfront in kobo minor units.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      3
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Before & After Photo Evidence</div>
                      <div className="text-xs text-slate-300">
                        Technicians upload work progress photos directly to the booking record for mutual accountability.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      4
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Verified-Only Customer Reviews</div>
                      <div className="text-xs text-slate-300">
                        Reviews can only be submitted after a verified booking is marked completed.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-96 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                <Image
                  src="/images/services/electrician_working_on_electrical_panel.jpg"
                  alt="Verified electrician performing electrical panel maintenance"
                  fill
                  className="object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1020] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs space-y-1.5">
                  <div className="font-bold text-white flex items-center gap-1.5 text-sm">
                    <BadgeCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Verified Artisan Badge</span>
                  </div>
                  <div className="text-slate-300 leading-relaxed">
                    Conferred only upon manual inspection of identity records, workshop location, and trade qualification.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kano Customer Reviews */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A1020] mt-1">
              What Kano Residents Say
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Authentic reviews tied directly to completed jobs and verified service bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    &ldquo;{r.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-[#0A1020]">{r.author}</div>
                  <div className="text-[11px] text-slate-500">{r.neighborhood}</div>
                  <div className="text-[11px] font-semibold text-[#4D78FF] mt-0.5">{r.service}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordions */}
        <section id="faq" className="py-20 bg-white border-y border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
                Common Questions
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A1020] mt-1">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Everything you need to know about discovering, quoting, and booking on Connecta.
              </p>
            </div>

            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index
                return (
                  <div key={index} className="py-5">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left gap-4 focus:outline-none"
                    >
                      <span className="text-sm sm:text-base font-bold text-[#0A1020]">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-[#4D78FF]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {faq.a}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Chowdeck-Style Provider CTA Banner */}
        <section className="py-20 bg-[#F5F7FC]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0A1020] text-white rounded-3xl p-8 sm:p-14 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
              <div className="space-y-4 max-w-xl text-center md:text-left z-10">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] bg-[#10B981]/20 px-3.5 py-1 rounded-full">
                  <Users className="w-3.5 h-3.5" /> For Skilled Technicians & Workshops
                </span>
                <h3 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Grow your trade business in Kano.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join hundreds of verified electricians, mechanics, plumbers, and technicians. Receive real customer requests, send professional quotations, and build a lasting reputation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0 z-10">
                <Link
                  href="/provider/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#4D78FF] hover:bg-[#3b63e6] px-8 py-4 text-xs sm:text-sm font-bold text-white shadow-xl transition-all hover:scale-105"
                >
                  <span>Apply as a Provider</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/admin/verification"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-4 text-xs sm:text-sm font-semibold text-white transition-colors"
                >
                  Admin Verification
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Comprehensive Footer */}
      <footer className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="md:col-span-2 space-y-4">
              <div className="relative w-32 h-8">
                <Image
                  src="/brand/svg/connecta-logo.svg"
                  alt="Connecta Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                Connecta is a trusted local services marketplace connecting homes and businesses with verified artisans and repair specialists across Kano and Nigeria.
              </p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-[#4D78FF]" />
                <span>Headquarters: Kano State, Nigeria</span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0A1020] uppercase tracking-wider">
                Services
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link href="/requests/new?category=electrical" className="hover:text-[#4D78FF]">Electrical & Wiring</Link></li>
                <li><Link href="/requests/new?category=plumbing" className="hover:text-[#4D78FF]">Plumbing & Boreholes</Link></li>
                <li><Link href="/requests/new?category=phone-repair" className="hover:text-[#4D78FF]">Phone & Tablet Repair</Link></li>
                <li><Link href="/requests/new?category=computer-repair" className="hover:text-[#4D78FF]">Computer & Laptop Repair</Link></li>
                <li><Link href="/requests/new?category=auto-mechanic" className="hover:text-[#4D78FF]">Auto Diagnostics</Link></li>
                <li><Link href="/requests/new?category=carpentry" className="hover:text-[#4D78FF]">Carpentry & Woodwork</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0A1020] uppercase tracking-wider">
                Platform & Trust
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link href="#vision-mission" className="hover:text-[#4D78FF]">Vision & Mission</Link></li>
                <li><Link href="#who-connecta-serves" className="hover:text-[#4D78FF]">Who It&apos;s For</Link></li>
                <li><Link href="#how-it-works" className="hover:text-[#4D78FF]">How It Works</Link></li>
                <li><Link href="#faq" className="hover:text-[#4D78FF]">Frequently Asked Questions</Link></li>
                <li><Link href="/admin/verification" className="hover:text-[#4D78FF]">Admin Portal</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#0A1020] uppercase tracking-wider">
                For Providers & Legal
              </h4>
              <ul className="space-y-2 text-xs text-slate-500">
                <li><Link href="/provider/register" className="hover:text-[#4D78FF]">Register as a Provider</Link></li>
                <li><Link href="/brand" className="hover:text-[#4D78FF]">Brand Guidelines</Link></li>
                <li><Link href="/docs" className="hover:text-[#4D78FF]">Architecture Docs</Link></li>
                <li><Link href="/privacy" className="hover:text-[#4D78FF]">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#4D78FF]">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 Connecta. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span>Primary Currency: NGN (₦)</span>
              <span>•</span>
              <span>Verified Local Marketplace</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
