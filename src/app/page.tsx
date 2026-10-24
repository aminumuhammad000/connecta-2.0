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
  Receipt,
  Star,
  Users,
  BadgeCheck,
  FileSearch,
} from 'lucide-react'

const CATEGORIES = [
  {
    name: 'Electrical & Wiring',
    slug: 'electrical',
    image: '/images/services/electrician_working_on_electrical_panel.jpg',
    alt: 'Electrician working on an electrical distribution panel',
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
    alt: 'Mechanic servicing car engine diagnostics',
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
    number: '1',
    title: 'Discover relevant professionals',
    desc: 'Search by trade or describe your issue. Filter verified technicians across Kano based on experience, location, and verified reviews.',
    icon: Search,
  },
  {
    number: '2',
    title: 'Compare information & quotes',
    desc: 'Review credentials, work photos, and itemized quotations detailing labor, materials, and turnaround time before agreeing.',
    icon: FileSearch,
  },
  {
    number: '3',
    title: 'Request service & book with confidence',
    desc: 'Confirm an appointment with guaranteed arrival tracking, documented change orders, and verified customer reviews.',
    icon: BadgeCheck,
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [city] = useState('Kano')

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FC] text-[#0A1020]">
      {/* City Launch Banner */}
      <div className="bg-[#0A1020] text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border-b border-slate-800">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/20 px-2.5 py-0.5 text-xs text-[#10B981] font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Launching in Kano
        </span>
        <span className="text-slate-300">
          Connecting verified artisans & technicians with homes and businesses across Kano.
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

            <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-full border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#4D78FF]" />
              <span>{city}, Nigeria</span>
            </div>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="#services"
              className="hidden sm:inline-block text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0A1020] transition-colors"
            >
              Find a Professional
            </Link>
            <Link
              href="#how-it-works"
              className="hidden sm:inline-block text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0A1020] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/provider/register"
              className="text-xs sm:text-sm font-medium text-[#4D78FF] hover:text-[#3b63e6] transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Become a Provider
            </Link>
            <Link
              href="/requests/new"
              className="inline-flex items-center justify-center rounded-xl bg-[#4D78FF] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#3b63e6] transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-medium text-[#4D78FF] border border-blue-200">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Verified Local Service Professionals</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0A1020] leading-[1.15]">
                Find the right professional.{' '}
                <span className="text-[#4D78FF]">Hire with greater confidence.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Connecta helps you discover local plumbers, electricians, repair technicians, and carpenters. Evaluate credentials, review authentic work evidence, and receive transparent quotations.
              </p>

              {/* Functional Search Box */}
              <div className="mt-8 bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you need help with? (e.g. electrical fault, phone screen, plumbing)"
                    className="w-full bg-transparent text-sm text-[#0A1020] placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <Link
                  href={`/requests/new?q=${encodeURIComponent(searchQuery)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4D78FF] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3b63e6] transition-colors shadow-sm shrink-0"
                >
                  <span>Request Quotes</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick trade filters */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Popular in Kano:</span>
                {['Solar Wiring', 'Phone Screen', 'Borehole Repair', 'AC Maintenance', 'Roof Carpentry'].map((tag) => (
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

        {/* Popular Services with Photography */}
        <section id="services" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1020]">
                Explore Supported Service Trades
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Browse qualified professionals equipped with tools and verified trade experience.
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

        {/* Featured Local Professionals */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1020]">
                Featured Kano Technicians & Artisans
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Real local specialists with verified identity and proven track records in Kano State.
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

        {/* How Connecta Works — 3 Simple Stages */}
        <section id="how-it-works" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-bold text-[#4D78FF] uppercase tracking-wider">
              Transparent & Simple
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1020] mt-1">
              How Connecta Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Our research-driven 3-stage customer journey designed around credibility, clear pricing, and accountability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {THREE_STAGES.map((st) => {
              const Icon = st.icon
              return (
                <div
                  key={st.number}
                  className="bg-white rounded-2xl p-8 border border-slate-200 flex flex-col items-start relative space-y-4"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-3xl font-black text-slate-200">
                      0{st.number}
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

        {/* Trust & Evidence Pillars */}
        <section className="py-16 bg-[#0A1020] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/20 px-3 py-1 text-xs font-semibold text-[#10B981]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Platform for Discovery & Accountability</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                  More than a directory. Built to solve trust and verification.
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Personal referrals are hard to verify and skilled artisans struggle to showcase their portfolio. Connecta bridges both sides with verifiable identity, itemized quotes, and before/after job evidence.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Government ID & trade checks</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Transparent line-item quotes</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Before & after work evidence</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Verified customer reviews only</span>
                  </div>
                </div>
              </div>

              <div className="relative h-80 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                <Image
                  src="/images/services/electrician_working_on_electrical_panel.jpg"
                  alt="Verified technician at work"
                  fill
                  className="object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1020] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Evidence-Driven Quality</span>
                  </div>
                  <div className="text-slate-300 mt-1">
                    Every completed job can record diagnostic snapshots and customer confirmation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Provider Acquisition CTA */}
        <section className="py-14 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-[#0A1020]">
                Are you a skilled technician or artisan in Kano?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Join Connecta to build your verified reputation, receive local customer requests, and grow your business.
              </p>
            </div>
            <Link
              href="/provider/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#4D78FF] px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#3b63e6] transition-colors shrink-0"
            >
              <Users className="w-4 h-4" />
              <span>Apply as a Provider</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-28 h-8">
                <Image
                  src="/brand/svg/connecta-logo.svg"
                  alt="Connecta Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500">
                Local Services Marketplace
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <Link href="/requests/new" className="hover:text-[#0A1020] transition-colors">
                Request Service
              </Link>
              <Link href="/provider/register" className="hover:text-[#0A1020] transition-colors">
                Become a Provider
              </Link>
              <Link href="/admin/verification" className="hover:text-[#0A1020] transition-colors">
                Verification Portal
              </Link>
              <Link href="/brand" className="hover:text-[#0A1020] transition-colors">
                Brand Guidelines
              </Link>
            </div>

            <p className="text-xs text-slate-400">
              © 2026 Connecta. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
