'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
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
  Hammer,
  Car,
  Wind,
  Paintbrush,
  HardHat,
  ArrowRight,
  Sparkles,
  Award,
  Briefcase,
  ChevronRight,
  ChevronDown,
  CornerDownRight,
  SlidersHorizontal,
  X,
  Menu,
  TrendingUp,
  Mail,
  Phone,
  ArrowUp,
  Navigation,
  Map as MapIcon,
  LayoutGrid,
  Crosshair,
} from 'lucide-react'
import { SectionBorderDivider } from '@/components/Connecta3DDecoration'
import { PublicProvider } from '@/lib/server/providers'
import GoogleProviderMap from '@/components/GoogleProviderMap'
import {
  calculateDistanceKm,
  formatDistance,
  getGoogleMapsDirectionsUrl,
  Coordinates,
  NIGERIAN_CITY_COORDINATES,
} from '@/lib/geo'

const CATEGORIES = [
  { slug: 'all', name: 'All Local Trades', icon: Sparkles },
  { slug: 'plumbing', name: 'Plumbing & Pipes', icon: Wrench },
  { slug: 'electrical', name: 'Electrical & Solar', icon: Zap },
  { slug: 'ac-cooling', name: 'AC & Refrigeration', icon: Wind },
  { slug: 'carpentry', name: 'Carpentry & Woodwork', icon: Hammer },
  { slug: 'generator-repair', name: 'Generator Overhaul', icon: Wrench },
  { slug: 'auto-mechanic', name: 'Auto Diagnostics', icon: Car },
  { slug: 'painting', name: 'Painting & Screeding', icon: Paintbrush },
  { slug: 'construction', name: 'Masonry & Tiling', icon: HardHat },
]

interface SearchSuggestion {
  text: string
  subtitle?: string
  category?: string
  type: 'popular' | 'trade' | 'specialist' | 'service'
}

const POPULAR_KANO_SUGGESTIONS: SearchSuggestion[] = [
  { text: 'Plumbing', subtitle: 'Pipes, borehole pumps & leakage repair', category: 'plumbing', type: 'popular' },
  { text: 'Solar & Inverter', subtitle: 'Panels, hybrid inverters & battery backup', category: 'electrical', type: 'popular' },
  { text: 'AC Servicing', subtitle: 'Cooling maintenance, gas refill & installations', category: 'ac-cooling', type: 'popular' },
  { text: 'Generator Overhaul', subtitle: 'Diesel & petrol plant repair & servicing', category: 'generator-repair', type: 'popular' },
  { text: 'Carpentry', subtitle: 'Furniture, roofing, doors & custom woodwork', category: 'carpentry', type: 'popular' },
]

const ALL_SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  ...POPULAR_KANO_SUGGESTIONS,
  { text: 'Plumbing & Pipes', subtitle: 'Certified plumbers across Kano', category: 'plumbing', type: 'trade' },
  { text: 'Electrical & Solar', subtitle: 'Wiring, solar setups & power troubleshooting', category: 'electrical', type: 'trade' },
  { text: 'AC & Refrigeration', subtitle: 'Cold chain, air conditioners & chillers', category: 'ac-cooling', type: 'trade' },
  { text: 'Carpentry & Woodwork', subtitle: 'Master artisans & roofers', category: 'carpentry', type: 'trade' },
  { text: 'Generator Overhaul', subtitle: 'Perkins, Mikano, Lister & petrol generator experts', category: 'generator-repair', type: 'trade' },
  { text: 'Auto Diagnostics', subtitle: 'Vehicle computer scans, ECU & auto mechanics', category: 'auto-mechanic', type: 'trade' },
  { text: 'Painting & Screeding', subtitle: 'Wall preparation, screeding & luxury paint', category: 'painting', type: 'trade' },
  { text: 'Masonry & Tiling', subtitle: 'Interlocking tiles, bricklaying & POP ceilings', category: 'construction', type: 'trade' },
  { text: 'Borehole Submersible Pumps', subtitle: 'High pressure pumps & tanks in Kano', category: 'plumbing', type: 'service' },
  { text: 'Phone & Micro-Soldering', subtitle: 'Screen repair & logic board micro-soldering', category: 'all', type: 'service' },
]

const CITIES = ['All Locations', 'Kano', 'Lagos', 'Abuja', 'Kaduna', 'Port Harcourt']

export default function DiscoverClientView({
  initialProviders,
}: {
  initialProviders: PublicProvider[]
}) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('All Locations')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'rate_asc' | 'rate_desc' | 'nearest'>('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [selectedMapProviderId, setSelectedMapProviderId] = useState<string | null>(null)
  const [maxRadiusKm, setMaxRadiusKm] = useState<number | null>(null)
  const [hasAccount, setHasAccount] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleRequestLocation = () => {
    if (typeof window === 'undefined') return

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.')
      const fallback = NIGERIAN_CITY_COORDINATES[selectedCity === 'All Locations' ? 'Kano' : selectedCity] || NIGERIAN_CITY_COORDINATES['Kano']
      setUserLocation(fallback)
      setSortBy('nearest')
      return
    }

    setIsLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: Coordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        setUserLocation(coords)
        setIsLocating(false)
        setSortBy('nearest')
      },
      (err) => {
        console.warn('[Geolocation] GPS error or denied:', err.message)
        setIsLocating(false)
        const fallback = NIGERIAN_CITY_COORDINATES[selectedCity === 'All Locations' ? 'Kano' : selectedCity] || NIGERIAN_CITY_COORDINATES['Kano']
        setUserLocation(fallback)
        setSortBy('nearest')
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    )
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialProviders.length }
    for (const cat of CATEGORIES) {
      if (cat.slug === 'all') continue
      counts[cat.slug] = initialProviders.filter(
        (p) =>
          p.categorySlug === cat.slug ||
          p.category.toLowerCase().includes(cat.slug.replace('-', ' '))
      ).length
    }
    return counts
  }, [initialProviders])

  const dynamicSuggestions = useMemo(() => {
    const list: SearchSuggestion[] = []
    for (const p of initialProviders) {
      if (p.businessName) {
        list.push({
          text: p.businessName,
          subtitle: `${p.category} • ${p.city}`,
          category: p.categorySlug,
          type: 'specialist',
        })
      }
      if (p.fullName) {
        list.push({
          text: p.fullName,
          subtitle: `${p.headline} (${p.city})`,
          category: p.categorySlug,
          type: 'specialist',
        })
      }
      if (p.skills && p.skills.length > 0) {
        for (const skill of p.skills.slice(0, 2)) {
          list.push({
            text: skill,
            subtitle: `Specialty under ${p.category}`,
            category: p.categorySlug,
            type: 'service',
          })
        }
      }
    }
    return list
  }, [initialProviders])

  const activeSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return POPULAR_KANO_SUGGESTIONS
    }

    const pool = [...ALL_SEARCH_SUGGESTIONS, ...dynamicSuggestions]
    const seen = new Set<string>()
    const startsWith: SearchSuggestion[] = []
    const contains: SearchSuggestion[] = []

    for (const item of pool) {
      const key = item.text.toLowerCase()
      if (seen.has(key)) continue

      if (key.startsWith(query)) {
        seen.add(key)
        startsWith.push(item)
      } else if (
        key.includes(query) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(query))
      ) {
        seen.add(key)
        contains.push(item)
      }
    }

    return [...startsWith, ...contains].slice(0, 6)
  }, [search, dynamicSuggestions])

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setSearch(suggestion.text)
    if (suggestion.category && suggestion.category !== 'all') {
      setSelectedCategory(suggestion.category)
    }
    setIsSuggestionsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSuggestionsOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setIsSuggestionsOpen(true)
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < activeSuggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : activeSuggestions.length - 1))
    } else if (e.key === 'Enter') {
      if (isSuggestionsOpen && highlightedIndex >= 0 && highlightedIndex < activeSuggestions.length) {
        e.preventDefault()
        handleSelectSuggestion(activeSuggestions[highlightedIndex])
      } else {
        setIsSuggestionsOpen(false)
      }
    } else if (e.key === 'Escape') {
      setIsSuggestionsOpen(false)
      setHighlightedIndex(-1)
    }
  }

  React.useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileNavOpen])

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

    // Calculate distance if user location is active
    if (userLocation) {
      result = result.map((p) => {
        if (p.latitude && p.longitude) {
          const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude)
          return { ...p, distanceKm: dist }
        }
        return p
      })
    }

    // Filter by max distance radius if chosen
    if (userLocation && maxRadiusKm) {
      result = result.filter((p) => p.distanceKm !== undefined && p.distanceKm <= maxRadiusKm)
    }

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

    if (selectedCity !== 'All Locations') {
      result = result.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase())
    }

    if (verifiedOnly) {
      result = result.filter((p) => p.verificationStatus === 'verified')
    }

    if (sortBy === 'nearest' && userLocation) {
      result.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.averageRating - a.averageRating)
    } else if (sortBy === 'reviews') {
      result.sort((a, b) => b.reviewCount - a.reviewCount)
    } else if (sortBy === 'rate_asc') {
      result.sort((a, b) => a.hourlyRateMinor - b.hourlyRateMinor)
    } else if (sortBy === 'rate_desc') {
      result.sort((a, b) => b.hourlyRateMinor - a.hourlyRateMinor)
    }

    return result
  }, [initialProviders, search, selectedCategory, selectedCity, verifiedOnly, sortBy, userLocation, maxRadiusKm])

  const formatNaira = (minorUnits: number) => {
    const naira = Math.round(minorUnits / 100)
    return `₦${naira.toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col justify-between selection:bg-[#10B981]/20 relative">
      {/* Signature Full-Page Halftone Dot Matrix Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.09] z-0"
        style={{
          backgroundImage: 'radial-gradient(#0A2614 2px, transparent 2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Unified Professional Floating Header - Exact Match to Landing Page */}
      <div className="fixed top-0 left-0 right-0 z-50 pt-2 sm:pt-4 px-2.5 sm:px-6 pointer-events-none">
        <header
          className={`pointer-events-auto max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4 transition-all duration-300 rounded-full px-3.5 sm:px-6 py-2 sm:py-2.5 ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_10px_30px_rgb(0,0,0,0.08)]'
              : 'bg-white/85 backdrop-blur-md border border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)]'
          }`}
        >
          {/* Left: Brand Logo & Minimal Region */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0C513F] flex items-center justify-center p-1.5 shadow-2xs transition-transform group-hover:scale-105 shrink-0">
                <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5">
                  <Image
                    src="/brand/connecta-header-icon.svg"
                    alt="Connecta Icon"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <span className="font-extrabold text-sm sm:text-lg tracking-tight text-[#0A1020]">
                connecta
              </span>
            </Link>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer px-2 py-1 rounded-full hover:bg-slate-100/70">
              <span className="text-sm leading-none">🇳🇬</span>
              <span className="font-extrabold text-slate-800">NG</span>
              <ChevronDown className="w-3 h-3 text-slate-400 stroke-[2.5]" />
            </div>
          </div>

          {/* Center Navigation: Clean, borderless links with subtle hover pills */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-semibold text-slate-600">
            <Link
              href="/discover"
              className="px-3.5 py-1.5 rounded-full text-[#0C513F] font-black bg-slate-100/90 shadow-2xs transition-all"
            >
              Discover
            </Link>
            <Link
              href="/#how-it-works"
              className="px-3.5 py-1.5 rounded-full hover:text-[#0C513F] hover:bg-slate-100/80 transition-all"
            >
              How It Works
            </Link>
            <Link
              href="/#featured-specialists"
              className="px-3.5 py-1.5 rounded-full hover:text-[#0C513F] hover:bg-slate-100/80 transition-all"
            >
              Specialists
            </Link>
            <Link
              href="/#about"
              className="px-3.5 py-1.5 rounded-full hover:text-[#0C513F] hover:bg-slate-100/80 transition-all"
            >
              About
            </Link>
          </nav>

          {/* Right Action: Clean single primary CTA on desktop, only hamburger menu on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {hasAccount ? (
              <Link
                href="/dashboard"
                className="hidden md:inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-extrabold text-white bg-[#0C513F] hover:bg-[#083b2e] px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-xs hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#0A1020] px-3.5 py-1.5 rounded-full hover:bg-slate-100/80 transition-colors"
                >
                  Sign In
                </Link>

                <Link
                  href="/onboarding?step=role"
                  className="hidden md:inline-flex items-center text-xs sm:text-sm font-extrabold text-white bg-[#0C513F] hover:bg-[#083b2e] px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full transition-all shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile Menu Button - Sole right element on mobile */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="md:hidden w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </header>

        {/* Backdrop for Mobile Drawer */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden pointer-events-auto transition-opacity duration-200"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile Dropdown Menu Card */}
        {mobileNavOpen && (
          <div className="pointer-events-auto md:hidden relative z-50 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:max-w-md mx-auto bg-white/98 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-4 sm:p-5 flex flex-col gap-1.5 text-sm font-semibold text-slate-800 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center justify-between pb-2.5 mb-1 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Quick Navigation</span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/discover"
              onClick={() => setMobileNavOpen(false)}
              className="px-4 py-3 rounded-2xl bg-emerald-50 text-emerald-950 transition-colors flex items-center justify-between group"
            >
              <span className="font-extrabold text-[#0C513F]">Discover Specialists</span>
              <ChevronRight className="w-4 h-4 text-[#10B981] transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileNavOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-900 transition-colors flex items-center justify-between group"
            >
              <span className="font-bold text-slate-900 group-hover:text-emerald-900">How It Works</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/#featured-specialists"
              onClick={() => setMobileNavOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-900 transition-colors flex items-center justify-between group"
            >
              <span className="font-bold text-slate-900 group-hover:text-emerald-900">Specialists</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileNavOpen(false)}
              className="px-4 py-3 rounded-2xl hover:bg-emerald-50 hover:text-emerald-900 transition-colors flex items-center justify-between group"
            >
              <span className="font-bold text-slate-900 group-hover:text-emerald-900">About Connecta</span>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <div className="pt-3 mt-1 border-t border-slate-100 flex flex-col gap-2">
              {hasAccount ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileNavOpen(false)}
                  className="w-full text-center py-3 rounded-full font-black text-white bg-[#0C513F] hover:bg-[#083b2e] text-xs sm:text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-1.5"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/onboarding?step=role"
                    onClick={() => setMobileNavOpen(false)}
                    className="w-full text-center py-3 rounded-full font-black text-white bg-[#0C513F] hover:bg-[#083b2e] text-xs sm:text-sm transition-all shadow-md active:scale-98"
                  >
                    Register
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileNavOpen(false)}
                    className="w-full text-center py-2.5 rounded-full font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs sm:text-sm transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-400 font-semibold">
              100% Escrow Protected • Nigeria &amp; Pan-Africa
            </div>
          </div>
        )}
      </div>

      {/* Main Discover Container */}
      <main className="relative z-10 flex-1 pt-20 sm:pt-24 pb-16">
        {/* Hero Search Section - Signature Landing Page Aesthetic with Google Search Suggestions */}
        <section className="relative py-8 sm:py-10 bg-transparent border-b border-slate-200/80">
          {/* Background effects container with overflow-hidden */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Ambient Aurora Glows */}
            <div className="absolute -top-16 left-1/4 -translate-x-1/2 w-[380px] sm:w-[500px] h-[280px] sm:h-[350px] bg-[#1A73E8]/10 rounded-full blur-[100px]" />
            <div className="absolute top-1/3 right-1/4 translate-x-1/3 w-[400px] sm:w-[520px] h-[300px] sm:h-[380px] bg-[#10B981]/12 rounded-full blur-[110px]" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[440px] sm:w-[600px] h-[220px] sm:h-[280px] bg-[#F59E0B]/10 rounded-full blur-[90px]" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-30 text-center">
            <h1 className="sr-only">Discover Verified Local Service Professionals in Kano</h1>

            {/* Master Search Capsule with Google Search-Style Suggestions Dropdown */}
            <div ref={searchContainerRef} className="relative max-w-3xl mx-auto text-left">
              <div className="bg-white transition-all duration-200 shadow-xl hover:shadow-2xl border-2 border-slate-900/10 focus-within:border-[#10B981] focus-within:ring-4 focus-within:ring-[#10B981]/15 p-2 sm:p-2.5 pl-4 rounded-2xl sm:rounded-full flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative flex-1 w-full flex items-center min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-[#0A2614] mr-2.5 border border-slate-200/80 shadow-xs">
                    <Search className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setIsSuggestionsOpen(true)
                      setHighlightedIndex(-1)
                    }}
                    onFocus={() => setIsSuggestionsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search by trade (e.g. Plumber in Kano, Solar, AC Repair, Carpenter) or name..."
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#0A1020] placeholder:text-slate-400 focus:outline-none truncate"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('')
                        setIsSuggestionsOpen(false)
                        searchInputRef.current?.focus()
                      }}
                      className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs font-bold shrink-0 transition-colors mr-2 cursor-pointer"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  {/* City Selector with Real MapPin SVG Icon */}
                  <div className="relative flex items-center w-full sm:w-auto">
                    <MapPin className="absolute left-3 w-4 h-4 text-[#10B981] pointer-events-none shrink-0" />
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full sm:w-auto pl-9 pr-8 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/30 cursor-pointer appearance-none transition-colors"
                      aria-label="Filter by location"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 w-3.5 h-3.5 text-slate-400 pointer-events-none shrink-0" />
                  </div>

                  {/* Near Me GPS Button */}
                  <button
                    type="button"
                    onClick={handleRequestLocation}
                    disabled={isLocating}
                    className={`h-10 px-3.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                      userLocation
                        ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                    title={userLocation ? 'GPS active (showing nearest to you)' : 'Detect my location to find nearest artisans'}
                  >
                    <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-600' : userLocation ? 'text-blue-600 fill-blue-600' : 'text-slate-500'}`} />
                    <span className="hidden sm:inline">{isLocating ? 'Locating...' : userLocation ? 'Near Me' : 'Near Me'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsSuggestionsOpen(false)}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0 cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Google Search-Style Suggestions Dropdown */}
              {isSuggestionsOpen && activeSuggestions.length > 0 && (
                <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      {search.trim() ? (
                        <>
                          <Search className="w-3.5 h-3.5 text-[#10B981]" />
                          Search Suggestions
                        </>
                      ) : (
                        <>
                          <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                          Popular in Kano
                        </>
                      )}
                    </span>
                    <span className="hidden sm:inline text-[10px] font-normal text-slate-400">
                      ↑↓ to navigate • ↵ to select • esc to close
                    </span>
                  </div>

                  <ul className="py-1 max-h-72 overflow-y-auto">
                    {activeSuggestions.map((item, idx) => {
                      const isHighlighted = highlightedIndex === idx
                      return (
                        <li key={`${item.text}-${idx}`}>
                          <button
                            type="button"
                            onClick={() => handleSelectSuggestion(item)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors cursor-pointer group ${
                              isHighlighted ? 'bg-emerald-50/90 text-emerald-950' : 'hover:bg-slate-50 text-[#0A1020]'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 pr-3">
                              <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                  isHighlighted
                                    ? 'bg-[#10B981] text-white'
                                    : 'bg-slate-100 text-slate-500 group-hover:bg-[#10B981]/15 group-hover:text-[#0C513F]'
                                }`}
                              >
                                {item.type === 'popular' ? (
                                  <TrendingUp className="w-3.5 h-3.5" />
                                ) : (
                                  <Search className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs sm:text-sm font-bold truncate">
                                  {item.text}
                                </p>
                                {item.subtitle && (
                                  <p className="text-[11px] text-slate-400 font-medium truncate">
                                    {item.subtitle}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                                  isHighlighted
                                    ? 'bg-emerald-200 text-emerald-900'
                                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                                }`}
                              >
                                {item.type === 'popular'
                                  ? 'Popular in Kano'
                                  : item.type === 'trade'
                                  ? 'Trade'
                                  : item.type === 'specialist'
                                  ? 'Verified Pro'
                                  : 'Service'}
                              </span>
                              <ArrowRight
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isHighlighted
                                    ? 'text-[#10B981] translate-x-0.5'
                                    : 'text-slate-300 group-hover:text-slate-500'
                                }`}
                              />
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>

                  {search.trim() && (
                    <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <button
                        type="button"
                        onClick={() => setIsSuggestionsOpen(false)}
                        className="font-bold text-[#0C513F] hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <Search className="w-3.5 h-3.5" />
                        Search for &ldquo;{search}&rdquo; in {selectedCity}
                      </button>
                      <span className="text-[10px] text-slate-400 font-medium">Press ↵</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Filter Badges & Directory Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          {/* Category Filter Pills - Modern & Professional */}
          <div className="bg-white rounded-2xl border border-slate-100/90 shadow-2xs p-3.5 sm:p-4">
            <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                <h3 className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight">
                  Explore Local Trades
                </h3>
                <span className="text-xs font-medium text-slate-400">
                  • {CATEGORIES.length - 1} Specializations
                </span>
              </div>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs font-semibold text-[#10B981] hover:text-[#0C513F] transition-colors cursor-pointer"
                >
                  View All
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                const isActive = selectedCategory === cat.slug
                const count = categoryCounts[cat.slug] ?? 0
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0C513F] text-white shadow-xs'
                        : 'bg-slate-50/80 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#10B981]' : 'text-slate-400'}`} />
                    <span className="whitespace-nowrap">{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/70 text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Sub-Filters and Count Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-black text-slate-900">
                {filteredProviders.length} Verified Specialist{filteredProviders.length === 1 ? '' : 's'} Found
              </span>

              {userLocation && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-[11px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span>Proximity Active</span>
                </span>
              )}

              {(selectedCategory !== 'all' || selectedCity !== 'All Locations' || search || userLocation) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedCity('All Locations')
                    setSearch('')
                    setVerifiedOnly(false)
                    setUserLocation(null)
                    setMaxRadiusKm(null)
                    setSortBy('rating')
                  }}
                  className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Max Distance Radius Filter (when GPS is active) */}
              {userLocation && (
                <div className="flex items-center gap-1.5 text-xs">
                  <Navigation className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <select
                    value={maxRadiusKm || ''}
                    onChange={(e) => setMaxRadiusKm(e.target.value ? Number(e.target.value) : null)}
                    className="px-2.5 py-1.5 rounded-full border border-blue-200 bg-blue-50/70 font-bold text-blue-900 text-xs focus:outline-none cursor-pointer"
                    aria-label="Filter by maximum distance"
                  >
                    <option value="">Any Distance</option>
                    <option value="5">Within 5 km</option>
                    <option value="10">Within 10 km</option>
                    <option value="25">Within 25 km</option>
                    <option value="50">Within 50 km</option>
                  </select>
                </div>
              )}

              {/* Verified Only Toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="w-4 h-4 rounded-sm text-[#10B981] focus:ring-[#10B981]"
                />
                <span>Guild &amp; NIN Verified</span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 rounded-full border border-slate-200 bg-white font-bold text-slate-700 focus:outline-none cursor-pointer"
                >
                  {userLocation && <option value="nearest">Nearest First</option>}
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="rate_asc">Rate: Low to High</option>
                  <option value="rate_desc">Rate: High to Low</option>
                </select>
              </div>

              {/* View Mode Toggle: Grid vs Interactive Google Map */}
              <div className="flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-[#0C513F] text-white shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Interactive Google Map View"
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Panel (When Map view is toggled) */}
          {viewMode === 'map' && (
            <div className="space-y-3 animate-in fade-in duration-300">
              <GoogleProviderMap
                providers={filteredProviders}
                userLocation={userLocation}
                selectedProviderId={selectedMapProviderId}
                onSelectProvider={(p) => setSelectedMapProviderId(p.id)}
                onRequestUserLocation={handleRequestLocation}
                isLocating={isLocating}
                city={selectedCity === 'All Locations' ? 'Kano' : selectedCity}
                className="h-[460px] sm:h-[520px]"
              />
            </div>
          )}

          {/* Providers Grid - Exact Adaptation of usercard.png Style */}
          {filteredProviders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProviders.map((provider) => (
                <article
                  key={provider.id}
                  onClick={() => setSelectedMapProviderId(provider.id)}
                  className={`bg-white rounded-[24px] p-3.5 sm:p-4 border transition-all duration-300 flex flex-col justify-between group ${
                    selectedMapProviderId === provider.id
                      ? 'border-[#0C513F] ring-2 ring-[#10B981]/30 shadow-md'
                      : 'border-slate-100 hover:border-slate-200 shadow-2xs hover:shadow-md'
                  }`}
                >
                  <div>
                    {/* Top Portrait Photo Container */}
                    <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={provider.avatarUrl || '/brand/social/connecta-social-avatar-512.png'}
                        alt={provider.fullName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Signature Circular Country Flag Badge */}
                      <div
                        className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full border-2 border-white shadow-2xs overflow-hidden flex shrink-0 z-10"
                        title={`${provider.country || 'Nigeria'} • Verified Resident Specialist`}
                      >
                        <span className="w-1/3 h-full bg-[#008751]" />
                        <span className="w-1/3 h-full bg-white" />
                        <span className="w-1/3 h-full bg-[#008751]" />
                      </div>
                    </div>

                    {/* Information Section */}
                    <div className="pt-3.5 px-1 space-y-1.5">
                      {/* Name with Verified Scallop Badge */}
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <Link
                            href={`/discover/${provider.id}`}
                            className="font-bold text-slate-900 text-lg tracking-tight leading-tight hover:text-[#0C513F] transition-colors truncate block"
                          >
                            {provider.fullName}
                          </Link>
                          {provider.verificationStatus === 'verified' && (
                            <div
                              className="shrink-0 w-4.5 h-4.5 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-2xs"
                              title="Verified Specialist"
                            >
                              <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Specialization / Role Subtitle */}
                        <p className="text-xs sm:text-[13px] font-medium text-slate-500 pt-0.5">
                          {provider.category}
                        </p>
                      </div>

                      {/* Business & Location Line with Nearest Distance Badge */}
                      <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                        <span className="truncate">{provider.businessName}</span>
                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {provider.distanceKm !== undefined ? (
                            <span
                              className="flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100"
                              title={`Distance from your location: ${provider.distanceKm} km`}
                            >
                              <Navigation className="w-3 h-3 text-blue-600" />
                              <span>{formatDistance(provider.distanceKm)}</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-slate-400">
                              <MapPin className="w-3 h-3" />
                              <span>{provider.city}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Trimmed Bio Snippet */}
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-1">
                        {provider.headline || provider.bio}
                      </p>

                      {/* Stats Strip with Clean Icons */}
                      <div className="flex items-center gap-4 pt-2.5 text-xs sm:text-sm border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-slate-600" title={`${provider.reviewCount} reviews`}>
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                          <span className="font-semibold text-slate-800">{provider.averageRating.toFixed(1)}</span>
                          <span className="text-[11px] text-slate-400 font-normal">({provider.reviewCount})</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-600" title={`${provider.completedJobsCount} jobs completed`}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="font-semibold text-slate-800">{provider.completedJobsCount}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-600" title={`${provider.experienceYears}+ years experience`}>
                          <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="font-medium text-slate-600">{provider.experienceYears}y</span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {provider.skills.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-50 text-slate-600 border border-slate-100"
                          >
                            {skill}
                          </span>
                        ))}
                        {provider.skills.length > 3 && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md text-slate-400">
                            +{provider.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom: Rate & Action Buttons */}
                  <div className="pt-3 mt-2.5 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-1" title="Hourly rate">
                      <span className="text-base sm:text-lg font-bold text-[#0C513F] tracking-tight">
                        {formatNaira(provider.hourlyRateMinor)}
                      </span>
                      <span className="text-xs font-normal text-slate-400">/hr</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      {provider.latitude && provider.longitude && (
                        <a
                          href={getGoogleMapsDirectionsUrl(provider.latitude, provider.longitude, provider.fullName)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-all shadow-2xs flex items-center justify-center shrink-0"
                          title="Open turn-by-turn directions in Google Maps"
                        >
                          <Navigation className="w-3.5 h-3.5 text-slate-500" />
                        </a>
                      )}
                      <Link
                        href={`/discover/${provider.id}`}
                        className="px-3 sm:px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs sm:text-[13px] font-semibold transition-all shadow-2xs"
                      >
                        Profile
                      </Link>
                      <Link
                        href={`/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.category)}`}
                        className="px-3 sm:px-3.5 py-2 rounded-xl bg-[#0A1020] hover:bg-[#10B981] text-white text-xs sm:text-[13px] font-semibold shadow-2xs transition-all hover:scale-[1.02] inline-flex items-center gap-1"
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
                  setSelectedCity('All Locations')
                  setSearch('')
                  setVerifiedOnly(false)
                }}
                className="px-5 py-2.5 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white text-xs font-extrabold transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Organic Decorative Section Border (Matching Landing Page) */}
      <SectionBorderDivider flip={true} color="#0A2614" className="-mb-1 relative z-20" />

      {/* ================================================================= */}
      {/* SIMPLIFIED GREEN FOOTER (EXACT MATCH TO LANDING PAGE FOOTER)       */}
      {/* ================================================================= */}
      <footer className="w-full bg-[#0A2614] text-white pt-12 sm:pt-20 pb-10 border-t-2 border-[#10B981]/20 relative overflow-hidden">
        {/* Halftone / Dot pattern extending full-width */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Connecta Brand & Navigation */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-xl shrink-0 text-white">
                    ↓
                  </div>
                  <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                    Connecta.
                  </h2>
                </div>
                <p className="text-base sm:text-lg font-medium leading-relaxed text-emerald-100/90 max-w-xl">
                  Connecting households and businesses in Kano and across Nigeria with verified local service professionals — plumbers, electricians, AC technicians, carpenters, and painters — through milestone escrow.
                </p>
              </div>

              {/* Quick Navigation Links arranged cleanly like a footer */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                  Explore Platform
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Link
                    href="/#services"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>Services &amp; Trades</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/discover"
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-emerald-300 font-extrabold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>Discover Pros</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>How It Works</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/#trust-standard"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>Trust &amp; Escrow</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/#faq"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>FAQs</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/onboarding?step=role"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all hover:scale-[1.02]"
                  >
                    <span>Get Started</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                </div>
              </div>

              {/* Social Channels & Contact Pill */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5">
                <a
                  href="https://x.com/Connectainc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-sm font-bold transition-all hover:scale-105"
                  title="Twitter / X (@Connectainc)"
                >
                  𝕏
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61587476974482"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-sm font-bold transition-all hover:scale-105"
                  title="Facebook (@Connecta)"
                >
                  fb
                </a>
                <a
                  href="https://www.instagram.com/connecta_inc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-sm font-bold transition-all hover:scale-105"
                  title="Instagram (@connecta_inc)"
                >
                  ig
                </a>
                <a
                  href="https://www.tiktok.com/@connecta_inc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-105"
                  title="TikTok (@connecta_inc)"
                >
                  tk
                </a>
                <a
                  href="https://wa.me/2348123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-emerald-400 text-xs font-bold transition-all hover:scale-105"
                  title="WhatsApp (+234 812 345 6789)"
                >
                  wa
                </a>
                <a
                  href="mailto:support@myconnecta.ng"
                  className="text-xs font-bold text-emerald-200 bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>support@myconnecta.ng</span>
                </a>
                <a
                  href="tel:+2348123456789"
                  className="text-xs font-bold text-emerald-200 bg-white/10 hover:bg-white/20 border border-white/15 px-3.5 py-2 rounded-full transition-colors flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>+234 812 345 6789</span>
                </a>
              </div>
            </div>

            {/* Right Column: Saturated Emerald Callout Card */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-[#10B981] rounded-3xl p-8 sm:p-10 text-[#062419] shadow-2xl min-h-[380px] sm:min-h-[420px] flex flex-col justify-between relative">
                {/* Deep Green 12-Point Starburst */}
                <div className="text-[#062419]">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l1.9 3.9 4.3-.6.5 4.3 4 1.7-1.8 3.9 1.8 3.9-4 1.7-.5 4.3-4.3-.6L12 22l-1.9-3.9-4.3.6-.5-4.3-4-1.7 1.8-3.9-1.8-3.9 4-1.7.5-4.3 4.3.6z" />
                  </svg>
                </div>

                {/* Main Callout Copy */}
                <div className="space-y-4 my-auto py-4">
                  <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#062419]">
                    Ready to hire or offer services?
                  </h3>
                  <p className="text-base sm:text-lg font-semibold leading-relaxed text-[#062419]/90">
                    Post a project brief in under a minute or create your specialist profile. 100% milestone escrow protection with instant local payouts.
                  </p>
                </div>

                {/* Action Buttons inside Card */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/requests/new"
                    className="bg-[#062419] hover:bg-black text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2"
                  >
                    <span>Post a Request</span>
                    <CornerDownRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                  <Link
                    href="/onboarding?step=role&role=provider"
                    className="bg-white/20 hover:bg-white/30 border border-[#062419]/25 text-[#062419] px-6 py-3.5 rounded-full text-xs sm:text-sm font-extrabold transition-all"
                  >
                    Join as Specialist
                  </Link>
                </div>

                {/* Card Bottom Meta Strip */}
                <div className="mt-8 pt-6 border-t border-[#062419]/20 flex items-center justify-between text-xs font-bold text-[#062419]/80">
                  <span>100% Escrow Secured</span>
                  <span>myconnecta.ng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Status & Copyright Strip */}
          <div className="mt-16 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/70">
            <div className="flex flex-wrap items-center gap-3">
              <p>© 2026 Connecta Technologies Ltd. All rights reserved.</p>
              <span>•</span>
              <Link href="/discover" className="hover:text-white underline-offset-4 hover:underline transition-colors font-bold text-emerald-300">
                Discover
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-white underline-offset-4 hover:underline transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white underline-offset-4 hover:underline transition-colors">
                Terms of Service
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                <span>Verified Marketplace</span>
              </span>
              <span>•</span>
              <span>Nigeria &amp; Pan-Africa</span>
            </div>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full border border-white/20 transition-all hover:scale-105 cursor-pointer"
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
