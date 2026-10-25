'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  MapPin,
  Star,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Zap,
  Smartphone,
  Laptop,
  Hammer,
  Car,
  Wind,
  Code,
  ArrowRight,
  Filter,
  Sparkles,
  Award,
  ChevronRight,
  UserCheck,
  Phone,
  Mail,
  SlidersHorizontal,
  X,
  ExternalLink,
} from 'lucide-react'
import { PublicProvider } from '@/lib/server/providers'

const CATEGORIES = [
  { slug: 'all', name: 'All Services', icon: Sparkles },
  { slug: 'electrical', name: 'Solar & Electrical', icon: Zap },
  { slug: 'plumbing', name: 'Plumbing & Pipes', icon: Wrench },
  { slug: 'phone-repair', name: 'Phone Repairs', icon: Smartphone },
  { slug: 'computer-repair', name: 'Computer & Tech', icon: Laptop },
  { slug: 'auto-mechanic', name: 'Auto Mechanics', icon: Car },
  { slug: 'ac-cooling', name: 'AC & Cold Chain', icon: Wind },
  { slug: 'carpentry', name: 'Carpentry & Roofing', icon: Hammer },
  { slug: 'tech-software', name: 'Software & Web', icon: Code },
]

const CITIES = ['All Cities', 'Kano', 'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kaduna']

export default function DiscoverClientView({
  initialProviders,
}: {
  initialProviders: PublicProvider[]
}) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('All Cities')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'rate_asc' | 'rate_desc'>('rating')
  const [hasAccount, setHasAccount] = useState(false)

  React.useEffect(() => {
    try {
      const hasCookie = document.cookie.split(';').some((c) => c.trim().startsWith('connecta_session='))
      const hasStoredUser = !!localStorage.getItem('connecta_remember_email')
      if (hasCookie || hasStoredUser) {
        setHasAccount(true)
      }
    } catch {
      // ignore
    }
  }, [])

  const filteredProviders = useMemo(() => {
    let result = [...initialProviders]

    if (search.trim()) {
      const q = search.toLowerCase().trim()
      result = result.filter(
        (p) =>
          p.fullName.toLowerCase().includes(q) ||
          p.businessName.toLowerCase().includes(q) ||
          p.headline.toLowerCase().includes(q) ||
          p.bio.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q))
      )
    }

    if (selectedCategory !== 'all') {
      result = result.filter(
        (p) =>
          p.categorySlug === selectedCategory ||
          p.category.toLowerCase().includes(selectedCategory.replace('-', ' '))
      )
    }

    if (selectedCity !== 'All Cities') {
      result = result.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase())
    }

    if (verifiedOnly) {
      result = result.filter((p) => p.verificationStatus === 'verified')
    }

    if (sortBy === 'rating') {
      result.sort((a, b) => b.averageRating - a.averageRating)
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => b.reviewCount - a.reviewCount)
    } else if (sortBy === 'rate_asc') {
      result.sort((a, b) => a.hourlyRateMinor - b.hourlyRateMinor)
    } else if (sortBy === 'rate_desc') {
      result.sort((a, b) => b.hourlyRateMinor - a.hourlyRateMinor)
    }

    return result
  }, [initialProviders, search, selectedCategory, selectedCity, verifiedOnly, sortBy])

  const formatNaira = (minorUnits: number) => {
    const naira = Math.round(minorUnits / 100)
    return `₦${naira.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col justify-between selection:bg-[#10B981]/20">
      {/* Top Navigation */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-36 h-8 sm:w-44 sm:h-10">
              <Image
                src="/brand/svg/connecta-logo.svg"
                alt="Connecta"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Quick nav links for non-registered users */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <Link href="/discover" className="text-emerald-800 font-extrabold">
              Discover
            </Link>
            <Link href="/#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">
              Trust &amp; Privacy
            </Link>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {hasAccount ? (
              <Link
                href="/dashboard"
                className="text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full bg-[#053F28] hover:bg-[#032a1b] text-white shadow-sm transition-all hover:scale-105 inline-flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/onboarding?step=role"
                  className="text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full bg-[#053F28] hover:bg-[#032a1b] text-white shadow-sm transition-all hover:scale-105"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Discover Container */}
      <main className="flex-1 pb-16">
        {/* Hero Search Section */}
        <section className="bg-gradient-to-b from-white via-emerald-50/25 to-[#F5F7FC] border-b border-slate-200/70 pt-8 sm:pt-12 pb-10 sm:pb-14 px-4">
          <div className="max-w-6xl mx-auto space-y-5 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Artisan Database</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>100% Milestone Escrow Safeguard</span>
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black text-[#0A1020] tracking-tight leading-tight">
                Discover Verified Service Providers in Nigeria
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
                Connect directly with vetted electricians, master plumbers, auto technicians, and phone engineers. Inspect qualifications, compare real transparent rates, and hire with escrow protection.
              </p>
            </div>

            {/* Master Search Bar */}
            <div className="pt-2 max-w-4xl">
              <div className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-white shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full flex items-center">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 shrink-0" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by trade (e.g. Solar, Inverter, Plumbing, iPhone screen) or name..."
                    className="w-full pl-12 pr-10 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* City Selector */}
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-3 py-3 rounded-xl sm:rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:bg-white"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c === 'All Cities' ? '📍 All Cities' : `📍 ${c}`}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      // Focus or refresh search
                    }}
                    className="px-5 py-3 rounded-xl sm:rounded-2xl bg-[#053F28] hover:bg-[#032a1b] text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all shrink-0 cursor-pointer"
                  >
                    Find Pros
                  </button>
                </div>
              </div>
            </div>

            {/* Non-Registered Visitor Callout Strip */}
            <div className="pt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Looking to hire without browsing?</span>
              <Link
                href="/requests/new"
                className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Post a free request brief</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span>•</span>
              <Link
                href="/onboarding?step=role&role=provider"
                className="text-slate-700 font-bold hover:underline"
              >
                Register as a Specialist
              </Link>
            </div>
          </div>
        </section>

        {/* Filter Badges & Directory Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
          {/* Category Horizontal Scrolling Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = selectedCategory === cat.slug
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#053F28] text-white shadow-sm'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{cat.name}</span>
                </button>
              )
            })}
          </div>

          {/* Sub-Filters and Count Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-900">
                {filteredProviders.length} Verified Specialist{filteredProviders.length === 1 ? '' : 's'} Found
              </span>
              {(selectedCategory !== 'all' || selectedCity !== 'All Cities' || search) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedCity('All Cities')
                    setSearch('')
                    setVerifiedOnly(false)
                  }}
                  className="text-[11px] font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Verified Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500"
                />
                <span>Guild Verified Only</span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="rate_asc">Rate: Low to High</option>
                  <option value="rate_desc">Rate: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Providers Grid */}
          {filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <article
                  key={provider.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    {/* Header: Avatar, Name & Location */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#053F28] to-[#10B981] flex items-center justify-center text-white font-black text-lg shadow-xs shrink-0 overflow-hidden">
                          {provider.avatarUrl ? (
                            <Image
                              src={provider.avatarUrl}
                              alt={provider.fullName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span>{provider.fullName.slice(0, 2).toUpperCase()}</span>
                          )}
                          {provider.verificationStatus === 'verified' && (
                            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            </div>
                          )}
                        </div>

                        <div>
                          <Link
                            href={`/discover/${provider.id}`}
                            className="font-black text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors block"
                          >
                            {provider.businessName}
                          </Link>
                          <div className="text-xs text-slate-500 font-medium">
                            {provider.fullName} • {provider.experienceYears}+ yrs exp
                          </div>
                        </div>
                      </div>

                      {/* City Badge */}
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{provider.city}</span>
                      </span>
                    </div>

                    {/* Headline & Category */}
                    <div className="space-y-1">
                      <div className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-extrabold uppercase">
                        {provider.category}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-slate-800 leading-snug line-clamp-2">
                        {provider.headline}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {provider.bio}
                      </p>
                    </div>

                    {/* Rating & Stats Strip */}
                    <div className="flex items-center justify-between text-xs py-2 border-y border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span className="font-black text-slate-900">{provider.averageRating.toFixed(2)}</span>
                        <span className="text-slate-400 font-medium">({provider.reviewCount})</span>
                      </div>
                      <div className="text-slate-500 font-semibold">
                        <strong className="text-slate-800">{provider.completedJobsCount}</strong> jobs completed
                      </div>
                    </div>

                    {/* Top Skills Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {provider.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {provider.skills.length > 3 && (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-50 text-slate-400">
                          +{provider.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Rate & Direct CTAs */}
                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Starting Rate
                      </div>
                      <div className="text-base font-black text-emerald-800">
                        {formatNaira(provider.hourlyRateMinor)}
                        <span className="text-xs text-slate-400 font-normal"> / hr</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/discover/${provider.id}`}
                        className="px-3.5 py-2 rounded-full border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 text-xs font-bold transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        href={`/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.category)}`}
                        className="px-4 py-2 rounded-full bg-[#053F28] hover:bg-[#032a1b] text-white text-xs font-extrabold shadow-sm transition-all hover:scale-105 inline-flex items-center gap-1"
                      >
                        <span>Hire</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900">No service providers matched your filters</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Try expanding your search query or reset the category/city filters to explore all available verified artisans.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedCity('All Cities')
                  setSearch('')
                  setVerifiedOnly(false)
                }}
                className="px-5 py-2.5 rounded-full bg-[#053F28] text-white text-xs font-extrabold"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Bottom Callout Banner for Non-Registered Visitors */}
          <section className="mt-12 bg-gradient-to-br from-[#062419] to-[#0A3D2A] rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Are you a skilled technician or tradesperson?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Join Connecta and Get Discovered by Paying Clients
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
                Showcase your certifications, get verified badges, and enjoy 100% guaranteed milestone payments with instant local bank payouts.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/onboarding?step=role&role=provider"
                className="px-6 py-3.5 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-extrabold shadow-md transition-all hover:scale-105"
              >
                Join as Specialist
              </Link>
              <Link
                href="/requests/new"
                className="px-5 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-extrabold transition-all"
              >
                Post a Job Brief
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer (Full with Social Links & Legal) */}
      <footer className="w-full bg-white border-t border-slate-200/80 pt-10 pb-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-1">
              <div className="relative w-36 h-8">
                <Image
                  src="/brand/svg/connecta-logo.svg"
                  alt="Connecta"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-slate-500">
                A verified marketplace linking skilled African professionals with clients worldwide.
              </p>
            </div>

            {/* Official Social Links */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://x.com/Connectainc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 text-xs font-bold transition-all"
                title="Twitter / X (@Connectainc)"
              >
                𝕏
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61587476974482"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 text-xs font-bold transition-all"
                title="Facebook"
              >
                fb
              </a>
              <a
                href="https://www.instagram.com/connecta_inc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 text-xs font-bold transition-all"
                title="Instagram"
              >
                ig
              </a>
              <a
                href="https://www.tiktok.com/@connecta_inc"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-800 text-xs font-bold transition-all"
                title="TikTok"
              >
                tk
              </a>
              <a
                href="https://wa.me/2348123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-emerald-700 text-xs font-bold transition-all"
                title="WhatsApp"
              >
                wa
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 Connecta Technologies Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/discover" className="text-emerald-700 font-bold hover:underline">
                Discover Directory
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-slate-800 hover:underline">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-slate-800 hover:underline">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
