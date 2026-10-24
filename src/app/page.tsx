'use client'

import React, { useState } from 'react'
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
  HelpCircle,
  Award,
  Layers,
  HeartHandshake,
  Check,
  Building2,
  PhoneCall,
  Lock,
} from 'lucide-react'

const CATEGORIES = [
  {
    name: 'Electrical & Wiring',
    slug: 'electrical',
    image: '/images/services/electrician_working_on_electrical_panel.jpg',
    alt: 'Electrician working on an electrical distribution panel in Kano',
    desc: 'Fault finding, house wiring, inverter & solar installations, breaker repair',
    badge: 'High Demand',
  },
  {
    name: 'Phone & Tablet Repair',
    slug: 'phone-repair',
    image: '/images/services/phone_repair_technician.jpg',
    alt: 'Technician repairing smartphone motherboard and screen',
    desc: 'Screens, battery replacements, charging ports, board micro-soldering',
    badge: 'Same Day',
  },
  {
    name: 'Carpentry & Woodwork',
    slug: 'carpentry',
    image: '/images/services/carpenter_working_in_nigeria.jpg',
    alt: 'Carpenter working on wooden construction in Nigeria',
    desc: 'Custom furniture, door fittings, roof woodwork, wardrobe framing',
  },
  {
    name: 'AC & Refrigeration',
    slug: 'ac-cooling',
    image: '/images/services/air_conditioner_repair_technician.jpg',
    alt: 'Technician inspecting and servicing air conditioner unit',
    desc: 'AC gas refill, compressor maintenance, duct cleaning, installation',
  },
  {
    name: 'Computer & Laptop Repair',
    slug: 'computer-repair',
    image: '/images/services/computer_repair_technician.jpg',
    alt: 'Technician repairing laptop hardware in workshop',
    desc: 'Hardware upgrades, OS reinstallation, screens & thermal paste fixes',
  },
  {
    name: 'Auto Mechanics & Diagnostics',
    slug: 'auto-mechanic',
    image: '/images/services/car_mechanic_repairing_engine.jpg',
    alt: 'Mechanic servicing car engine diagnostics in workshop',
    desc: 'Engine diagnostics, brake repairs, suspension, routine maintenance',
    badge: 'Mobile Service',
  },
  {
    name: 'Painting & Wall Finishing',
    slug: 'painting',
    image: '/images/services/house_painter_painting_wall.jpg',
    alt: 'Painter applying smooth coat to interior wall',
    desc: 'Interior and exterior painting, POP plastering, waterproofing',
  },
  {
    name: 'Plumbing & Pipe Maintenance',
    slug: 'plumbing',
    image: '/images/services/cleaning_or_maintenance_technician.jpg',
    alt: 'Maintenance specialist working on piping equipment',
    desc: 'Water pipe leaks, borehole pumps, kitchen & bathroom installations',
  },
]

const FEATURED_PROVIDERS = [
  {
    id: 'p1',
    name: 'Ibrahim Aliyu',
    business: 'Arewa Solar & Inverter Engineering',
    trade: 'Master Electrician & Solar Installer',
    location: 'Nassarawa GRA, Kano',
    rating: 4.95,
    reviews: 48,
    jobs: 72,
    verified: true,
    experience: '8 yrs exp',
    avatar: '/images/services/electrician_working_on_electrical_panel.jpg',
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
  },
]

const THREE_STAGES = [
  {
    number: '01',
    title: 'Describe Your Issue & Location',
    desc: 'Tell us what needs fixing in your home, vehicle, or device. Add photos and choose your timing (emergency, today, or scheduled).',
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FC] text-[#0A1020]">
      {/* Kano Launch Banner */}
      <div className="bg-[#0A1020] text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/20 px-2.5 py-0.5 text-xs text-[#10B981] font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Launching in Kano
        </span>
        <span className="text-slate-300">
          Connecting verified artisans & technicians with homes and businesses across Kano State.
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-36 h-9">
                <Image
                  src="/brand/svg/connecta-logo.svg"
                  alt="Connecta Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-full border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#4D78FF]" />
              <span>{city}, Nigeria</span>
            </div>
          </div>

          <nav className="flex items-center gap-3 sm:gap-5">
            <Link
              href="#services"
              className="hidden md:inline-block text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0A1020] transition-colors"
            >
              Services
            </Link>
            <Link
              href="#how-it-works"
              className="hidden md:inline-block text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0A1020] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#about"
              className="hidden sm:inline-block text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0A1020] transition-colors"
            >
              About
            </Link>
            <Link
              href="#verification"
              className="hidden lg:inline-block text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0A1020] transition-colors"
            >
              Trust & Verification
            </Link>
            <Link
              href="#faq"
              className="hidden lg:inline-block text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0A1020] transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/provider/register"
              className="text-xs sm:text-sm font-medium text-[#4D78FF] hover:text-[#3b63e6] transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Become a Provider
            </Link>
            <Link
              href="/requests/new"
              className="inline-flex items-center justify-center rounded-xl bg-[#4D78FF] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#3b63e6] transition-colors"
            >
              Request a Quote
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#4D78FF] border border-blue-200">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Verified Local Service Professionals in Kano</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A1020] leading-[1.15]">
                Find the right professional.{' '}
                <span className="text-[#4D78FF]">Hire with greater confidence.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Connecta is a trust-and-matching marketplace connecting you with verified electricians, plumbers, repair technicians, and carpenters. Evaluate credentials, review authentic work evidence, and receive transparent quotations.
              </p>

              {/* Functional Search Box */}
              <div className="mt-8 bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Describe your issue (e.g. electrical fault, phone screen, leaking pipe)..."
                    className="w-full bg-transparent text-sm text-[#0A1020] placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <Link
                  href={`/requests/new?q=${encodeURIComponent(searchQuery)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4D78FF] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3b63e6] transition-colors shadow-sm shrink-0"
                >
                  <span>Find Technicians</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick trade filters */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Popular in Kano:</span>
                {['Solar & Inverter', 'iPhone Screen', 'Borehole Submersible', 'AC Gas Refill', 'Furniture Making'].map((tag) => (
                  <Link
                    key={tag}
                    href={`/requests/new?q=${encodeURIComponent(tag)}`}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Popular Services with Real Photography */}
        <section id="services" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
                Browse Trades
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1020] mt-1">
                Explore Supported Service Trades
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Browse qualified local specialists equipped with proper tools and verified trade experience.
              </p>
            </div>
            <Link
              href="/requests/new"
              className="text-xs font-semibold text-[#4D78FF] hover:underline flex items-center gap-1 self-start"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.slug}
                className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-[#4D78FF] hover:shadow-xl transition-all duration-200 flex flex-col"
              >
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {cat.badge && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold text-white bg-[#0A1020]/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/20">
                      {cat.badge}
                    </span>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#0A1020] group-hover:text-[#4D78FF] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>

                  <Link
                    href={`/requests/new?category=${cat.slug}`}
                    className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#4D78FF]"
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
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
                Vetted Artisans
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1020] mt-1">
                Featured Kano Technicians & Artisans
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Real local specialists with verified government identity, workshop locations, and proven track records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURED_PROVIDERS.map((provider) => (
                <div
                  key={provider.id}
                  className="bg-[#F5F7FC] rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                        <Image
                          src={provider.avatar}
                          alt={provider.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-[#0A1020]">{provider.name}</h4>
                          {provider.verified && (
                            <BadgeCheck className="w-4 h-4 text-[#10B981]" />
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{provider.business}</div>
                        <div className="text-[11px] text-[#4D78FF] font-medium">{provider.trade}</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{provider.location}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-700">{provider.experience}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                        <span>{provider.rating.toFixed(2)}</span>
                        <span className="font-normal text-slate-500">({provider.reviews} reviews)</span>
                      </div>
                      <div className="text-slate-500">
                        <strong className="text-slate-800">{provider.jobs}</strong> jobs completed
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/requests/new?providerId=${provider.id}`}
                    className="mt-5 w-full py-2.5 rounded-xl bg-white border border-slate-200 hover:border-[#4D78FF] text-[#0A1020] hover:text-[#4D78FF] text-xs font-semibold text-center transition-colors shadow-sm block"
                  >
                    Request Service
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Connecta Works */}
        <section id="how-it-works" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
              Transparent & Simple
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1020] mt-1">
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
                  className="bg-white rounded-2xl p-8 border border-slate-200 flex flex-col items-start relative space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-3xl font-black text-slate-200">
                      {st.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#4D78FF] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#0A1020]">{st.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ABOUT CONNECTA SECTION (NEW) */}
        <section id="about" className="py-16 sm:py-24 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-semibold text-[#4D78FF] border border-blue-200">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>About Connecta</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A1020] leading-snug">
                  Built to solve trust, verification, and discovery in local services.
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  We started Connecta with a clear observation in Kano: homeowners and businesses struggle to find reliable artisans during breakdowns, while skilled technicians with genuine expertise lack modern tools to showcase their work and build a verifiable reputation.
                </p>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Connecta is not a generic directory or job board. It is a full-cycle service platform that enforces identity verification, transparent line-item quotes in Naira, arrival tracking, and verified customer reviews.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="p-4 rounded-xl bg-[#F5F7FC] border border-slate-200">
                    <div className="text-2xl font-black text-[#4D78FF]">8</div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">Core Trades</div>
                    <div className="text-[11px] text-slate-500">Supported in Kano</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F7FC] border border-slate-200">
                    <div className="text-2xl font-black text-[#10B981]">100%</div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">ID Verified</div>
                    <div className="text-[11px] text-slate-500">Government credential check</div>
                  </div>
                  <div className="p-4 rounded-xl bg-[#F5F7FC] border border-slate-200">
                    <div className="text-2xl font-black text-[#0A1020]">0</div>
                    <div className="text-xs font-semibold text-slate-800 mt-1">Hidden Fees</div>
                    <div className="text-[11px] text-slate-500">Transparent itemized quotes</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <div className="p-6 rounded-2xl bg-[#F5F7FC] border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-[#0A1020]">
                    <HeartHandshake className="w-5 h-5 text-[#4D78FF]" />
                    <span>Clarity Over Cleverness</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We present things plainly. Pricing, scopes of work, and technician qualifications are always stated clearly with no fine print.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#F5F7FC] border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-[#0A1020]">
                    <Award className="w-5 h-5 text-[#10B981]" />
                    <span>Craft in the Details</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We respect skilled craftsmanship. Our platform allows technicians to document their work with before-and-after evidence and build real digital equity in their trade.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#F5F7FC] border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2.5 font-bold text-sm text-[#0A1020]">
                    <Lock className="w-5 h-5 text-[#8B7CFF]" />
                    <span>Customer & Provider Protection</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Private customer addresses and provider identity documents are protected behind strict security layers and only shared when a job is officially confirmed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST & VERIFICATION SECTION */}
        <section id="verification" className="py-16 sm:py-20 bg-[#0A1020] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/20 px-3 py-1 text-xs font-semibold text-[#10B981]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The Connecta Verification Standard</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                  How we protect customers and empower honest artisans.
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Anyone can post an ad online. Connecta ensures that every provider badge reflects actual verified credentials and verified performance history.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      1
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Identity & Business Checks</div>
                      <div className="text-xs text-slate-300">
                        Verification of National Identification Number (NIN), Voter Card, or CAC registration.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      2
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Transparent Itemized Quotations</div>
                      <div className="text-xs text-slate-300">
                        Detailed labor, replacement parts, and visit fee breakdowns calculated upfront in kobo minor units.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      3
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Before & After Photo Evidence</div>
                      <div className="text-xs text-slate-300">
                        Technicians upload work progress photos directly to the booking record for mutual accountability.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
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

              <div className="relative h-96 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
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

        {/* CUSTOMER REVIEWS / TESTIMONIALS */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
              Verified Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1020] mt-1">
              What Kano Residents Say About Connecta
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Authentic reviews tied directly to completed jobs and verified service bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-5"
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

        {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <section id="faq" className="py-16 sm:py-20 bg-white border-y border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
                Common Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1020] mt-1">
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

        {/* PROVIDER CALL TO ACTION */}
        <section className="py-16 bg-[#F5F7FC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#0A1020] to-[#1e293b] text-white rounded-3xl p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#10B981] bg-[#10B981]/20 px-3 py-1 rounded-full">
                  <Users className="w-3.5 h-3.5" /> For Skilled Technicians & Workshops
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Grow your trade business in Kano.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Join hundreds of verified electricians, mechanics, plumbers, and technicians. Receive real customer requests, send professional quotations, and build a lasting reputation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
                <Link
                  href="/provider/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#4D78FF] px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-lg hover:bg-[#3b63e6] transition-colors"
                >
                  <span>Apply as a Provider</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/admin/verification"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-3.5 text-xs sm:text-sm font-medium text-white transition-colors"
                >
                  Admin Verification
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Comprehensive Footer */}
      <footer className="bg-white border-t border-slate-200 py-14">
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
                <li><Link href="#about" className="hover:text-[#4D78FF]">About Connecta</Link></li>
                <li><Link href="#how-it-works" className="hover:text-[#4D78FF]">How It Works</Link></li>
                <li><Link href="#verification" className="hover:text-[#4D78FF]">Verification Standards</Link></li>
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
              <span>Kano Launch Edition</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
