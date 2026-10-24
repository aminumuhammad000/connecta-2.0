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
  Users
} from 'lucide-react'

const CATEGORIES = [
  {
    name: 'Plumbing & Pipefitting',
    slug: 'plumbing',
    icon: Wrench,
    desc: 'Boreholes, leaks, toilet & kitchen fittings, pipe laying',
    popularBadge: 'Popular',
  },
  {
    name: 'Electrical & Wiring',
    slug: 'electrical',
    icon: Zap,
    desc: 'Fault finding, house wiring, inverter/solar installation',
    popularBadge: 'High Demand',
  },
  {
    name: 'Phone & Tablet Repair',
    slug: 'phone-repair',
    icon: Smartphone,
    desc: 'Screens, batteries, charging ports, board repairs',
    popularBadge: 'Fast Turnaround',
  },
  {
    name: 'Computer & Laptop Repair',
    slug: 'computer-repair',
    icon: Laptop,
    desc: 'OS reinstall, thermal paste, hardware upgrades & displays',
  },
  {
    name: 'Carpentry & Woodwork',
    slug: 'carpentry',
    icon: Hammer,
    desc: 'Custom furniture, door fittings, roof woodwork & repairs',
  },
  {
    name: 'Auto Mechanics & Servicing',
    slug: 'auto-mechanic',
    icon: Car,
    desc: 'Engine diagnostics, brake service, suspension & routine care',
    popularBadge: 'Emergency Ready',
  },
  {
    name: 'Painting & Wall Finishing',
    slug: 'painting',
    icon: Paintbrush,
    desc: 'Interior/exterior painting, POP plastering, waterproofing',
  },
  {
    name: 'AC & Refrigeration',
    slug: 'ac-cooling',
    icon: Wind,
    desc: 'AC gas refill, compressor fixing, maintenance & servicing',
  },
]

const JOURNEY_STEPS = [
  {
    step: '01',
    title: 'Describe Your Issue',
    desc: 'Tell us what needs fixing, attach photos if possible, and set your urgency (emergency, today, or scheduled).',
    icon: Search,
  },
  {
    step: '02',
    title: 'Receive & Compare Quotes',
    desc: 'Verified local technicians respond with transparent quotations detailing labor, materials, and turnaround time.',
    icon: Receipt,
  },
  {
    step: '03',
    title: 'Book Confirmed Appointment',
    desc: 'Select the best provider. Track arrival, job progress, and any approved change orders in real-time.',
    icon: Clock,
  },
  {
    step: '04',
    title: 'Review & Build Trust',
    desc: 'Inspect completed work with photo evidence, pay securely in NGN, and leave a verified review to help the community.',
    icon: Star,
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('Kano')

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Launch Banner */}
      <div className="bg-[#111827] text-white px-4 py-2.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border-b border-gray-800">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#10B981]/20 px-2.5 py-0.5 text-xs text-[#10B981] font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Launching in Kano
        </span>
        <span className="text-gray-300">
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

            {/* City Selector */}
            <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>{selectedCity}, Nigeria</span>
            </div>
          </div>

          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="#categories"
              className="hidden sm:inline-block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Services
            </Link>
            <Link
              href="#how-it-works"
              className="hidden sm:inline-block text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/provider/register"
              className="text-xs sm:text-sm font-medium text-[#1A73E8] hover:text-[#1557b0] transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
            >
              Become a Provider
            </Link>
            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center rounded-lg bg-[#1A73E8] px-4 py-2 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-[#1557b0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A73E8] transition-colors"
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
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-medium text-[#1A73E8] border border-blue-200">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                <span>Verified Local Technicians & Artisans</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                Effortless service discovery for{' '}
                <span className="text-[#1A73E8]">craft & repair</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Connect with vetted plumbers, electricians, phone repairers, auto mechanics, and carpenters. Transparent quotes, confirmed appointments, and verified reviews.
              </p>

              {/* Service Request Search Bar */}
              <div className="mt-8 bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Describe your issue (e.g. leaking sink, AC not cooling, phone screen)..."
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1A73E8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1557b0] transition-colors shadow-sm shrink-0"
                >
                  <span>Request Quotes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Popular Category Chips */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Popular right now:</span>
                {['Plumbing', 'Electrical Wiring', 'iPhone Repair', 'Auto Diagnostics', 'Solar/Inverter'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Browse Service Categories
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Explore qualified trades in Kano and get matched with experienced professionals.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200 self-start">
              8 Available Trades
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <div
                  key={cat.slug}
                  className="group relative bg-white p-6 rounded-2xl border border-slate-200 hover:border-[#1A73E8] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1A73E8] group-hover:bg-[#1A73E8] group-hover:text-white flex items-center justify-center transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      {cat.popularBadge && (
                        <span className="text-[11px] font-semibold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {cat.popularBadge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-[#1A73E8] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1A73E8]">
                    <span>Request Quote</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* How It Works — User Journey */}
        <section id="how-it-works" className="py-16 sm:py-20 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                How Connecta Works
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                A transparent, step-by-step marketplace journey designed around trust, clear pricing, and accountability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {JOURNEY_STEPS.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="relative flex flex-col items-start space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-extrabold text-slate-300">
                        {item.step}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1A73E8] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Trust & Verification Section */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111827] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="max-w-2xl relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/20 px-3 py-1 text-xs font-semibold text-[#10B981]">
                <ShieldCheck className="w-4 h-4" />
                <span>Accountability First</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                Not just another artisan directory. An accountable platform.
              </h2>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Connecta verifies provider credentials, enforces itemized quote agreements, records before-and-after work evidence, and preserves fair dispute resolution so every job is delivered with peace of mind.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Government ID & trade checks</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Fixed, itemized quotations</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Photo evidence before & after</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-200">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>Verified customer reviews only</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Provider Call to Action */}
        <section className="py-12 bg-blue-50 border-t border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                Are you a skilled technician or artisan in Kano?
              </h3>
              <p className="text-sm text-slate-600">
                Join Connecta as a verified provider, receive real local job requests, and grow your reputation.
              </p>
            </div>
            <Link
              href="/provider/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1A73E8] px-6 py-3.5 text-sm font-semibold text-white shadow hover:bg-[#1557b0] transition-colors shrink-0"
            >
              <Users className="w-4 h-4" />
              <span>Apply as a Provider</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
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
                Trusted Local Services Marketplace
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
              <Link href="/docs" className="hover:text-slate-900 transition-colors">
                Architecture & Schema
              </Link>
              <Link href="/brand" className="hover:text-slate-900 transition-colors">
                Brand Guidelines
              </Link>
              <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-slate-900 transition-colors">
                Terms of Service
              </Link>
            </div>

            <p className="text-xs text-slate-400">
              © 2026 Connecta 2.0. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
