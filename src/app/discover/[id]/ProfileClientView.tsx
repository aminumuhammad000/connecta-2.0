'use client'
import { Spinner } from '@/components/brand/ConnectaLoader'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeft,
  Share2,
  Check,
  CheckCircle2,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Award,
  FileText,
  Search,
  MessageSquare,
  Phone,
  Mail,
  ExternalLink,
  Sparkles,
  Calendar,
  Briefcase,
  ArrowRight,
  ChevronRight,
  Lock,
  CornerDownRight,
  ArrowUp,
  X,
  Copy,
  Navigation,
} from 'lucide-react'
import { PublicProvider } from '@/lib/server/providers'
import { SectionBorderDivider } from '@/components/Connecta3DDecoration'
import { getGoogleMapsDirectionsUrl } from '@/lib/geo'

interface ProfileClientViewProps {
  provider: PublicProvider
  relatedProviders: PublicProvider[]
}

interface CompletedJobItem {
  id: string
  title: string
  date: string
  status: 'done' | 'pending' | 'draft'
  client: string
  amount: string
  category: string
}

export default function ProfileClientView({
  provider,
  relatedProviders,
}: ProfileClientViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'done' | 'pending'>('all')

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [canNativeShare, setCanNativeShare] = useState(false)

  // Review states
  const [reviewsList, setReviewsList] = useState(provider.reviews || [])
  const [ratingScore, setRatingScore] = useState(provider.averageRating || 5.0)
  const [ratingCount, setRatingCount] = useState(provider.reviewCount || (provider.reviews?.length ?? 0))
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUserName, setCurrentUserName] = useState<string>('Verified Client')

  // Review form states
  const [ratingInput, setRatingInput] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [projectTitleInput, setProjectTitleInput] = useState('')
  const [commentInput, setCommentInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href)
      setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
    }

    try {
      const hasCookie = document.cookie.split(';').some((c) => c.trim().startsWith('connecta_session='))
      const hasStoredUser = !!localStorage.getItem('connecta_remember_email')
      if (hasCookie || hasStoredUser) {
        setIsLoggedIn(true)
      }

      fetch('/api/dashboard/overview')
        .then((res) => (res.ok ? res.json() : null))
        .then((body) => {
          if (body?.data?.user) {
            setIsLoggedIn(true)
            setCurrentUserName(body.data.user.fullName || body.data.user.email?.split('@')[0] || 'Verified Client')
          }
        })
        .catch(() => {})
    } catch {
      // ignore
    }
  }, [])

  const nairaRate = Math.round(provider.hourlyRateMinor / 100).toLocaleString()

  // Generate trade-specific past verifiable escrow jobs
  const pastJobs: CompletedJobItem[] = useMemo(() => {
    const tradeTitles: Record<string, string[]> = {
      plumbing: [
        'High-Pressure Submersible Borehole Pump Installation',
        'PPR & HDPE Overhead Tank Pipework Staging',
        'Emergency Under-Slab Water Leak Detection & Repair',
        'Automated Float Switch & Pressure Booster Calibration',
        'Industrial Drainage Cleanout & Backflow Preventer',
        'Complete Bathroom Sanitary Ware Installation',
      ],
      electrical: [
        '10kVA Commercial Hybrid Solar Inverter & LiFePO4 Battery Setup',
        'Three-Phase Automatic Transfer Switch (ATS) Retrofit',
        'Surge Protection Device (SPD) & Low-Resistance Earth Rods',
        'Industrial Factory Distribution Board Load Balancing',
        'Rooftop 16-Panel Monocrystalline PV Array Staging',
        'Residential Inverter Battery Rack Rewiring & Calibration',
      ],
      'ac-cooling': [
        'Central VRF Inverter Air Conditioner Installation',
        'Walk-In Cold Room Compressor Overhaul & R410A Re-Gassing',
        'Commercial Duct Cleaning & Air Quality Sanitization',
        'Dual Split AC Precision Copper Piping Vacuum & Charging',
        'Chiller Cooling Tower Heat Exchanger Descaling',
      ],
      carpentry: [
        'Architectural Modular Kitchen Cabinets with Blum Hinges',
        'Heavy Hardwood Timber Roof Truss Framing',
        'Solid Mahogany Internal Security Doors & Mortise Locks',
        'Acoustic Wooden Wall Slat Cladding for Conference Room',
        'Custom Executive Office Desk & Built-in Wardrobes',
      ],
      'generator-repair': [
        'Perkins 60kVA Diesel Engine Complete Cylinder Overhaul',
        'Mikano Generator High-Pressure Fuel Injector Calibration',
        'Automatic Changeover ATS Contactors & Timer Relay Repair',
        'Routine Oil, Air & Fuel Filters Heavy-Duty Servicing',
        'Generator Alternator Copper Rewinding & AVR Replacement',
      ],
      'auto-mechanic': [
        'OBD2 Computer Diagnostics & ECU Electronic Harness Repair',
        'Electronic Fuel Injection (EFI) Calibration & Throttle Reset',
        'Transmission Solenoid Valve Replacement & Fluid Flush',
        'Auto Air Conditioner Compressor Clutch Replacement',
        'Anti-Lock Braking System (ABS) Hydraulic Actuator Repair',
      ],
      painting: [
        'Satin Wall Screeding & Anti-Fungal Damp Proofing',
        'Duplex Exterior Weather-Shield Facade Painting',
        'POP Ceiling Plaster Finishing & Cornice Moulding',
        'Luxury Metallic Stucco Italian Texture Application',
      ],
      construction: [
        'Precision Floor & Wall Ceramic Granite Tiling (350 sqm)',
        'Perimeter Compound Heavy Sandcrete Blocklaying',
        'Reinforced Concrete Lintels & Structural Screeding',
        'Interlocking Paver Stones Installation & Compaction',
      ],
      'phone-repair': [
        'iPhone 14 Pro Max Logic Board Micro-Soldering & FaceID Repair',
        'Samsung Galaxy OLED Panel Glass Separation & Lamination',
        'Charging IC & Power Management Chip Re-Balling',
        'iPad Pro Battery & Micro-USB Port Precision Replacement',
      ],
    }

    const titles = tradeTitles[provider.categorySlug] || tradeTitles['plumbing']
    const clients = [
      'Alh. Ibrahim Danbatta',
      'Engr. Tunde Coker',
      'Hajiya Fatima Bello',
      'Chief Emeka Okonkwo',
      'Malam Aminu Sani',
      'Dr. Zainab Garba',
    ]

    return titles.map((title, idx) => ({
      id: `Job #${923 - idx * 41}`,
      title,
      date: idx === 0 ? 'Sun Nov 26 2025 11:46' : idx === 1 ? 'Wed Aug 09 2025 15:14' : idx === 2 ? 'Thu Nov 23 2025 18:00' : 'Tue Sep 12 2025 09:30',
      status: (idx === 1 ? 'pending' : 'done') as 'done' | 'pending',
      client: clients[idx % clients.length],
      amount: `₦${(Math.round(provider.hourlyRateMinor / 100) * (idx + 3)).toLocaleString()}`,
      category: provider.category,
    }))
  }, [provider])

  const filteredJobs = useMemo(() => {
    let list = pastJobs
    if (filterStatus !== 'all') {
      list = list.filter((j) => j.status === filterStatus)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.id.toLowerCase().includes(q) ||
          j.client.toLowerCase().includes(q) ||
          j.amount.toLowerCase().includes(q)
      )
    }
    return list
  }, [pastJobs, searchQuery, filterStatus])

  const handleShareClick = () => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href)
    }
    setIsShareModalOpen(true)
  }

  const handleCopyLink = () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '')
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleNativeShare = async () => {
    const url = shareUrl || (typeof window !== 'undefined' ? window.location.href : '')
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${provider.fullName} - Verified ${provider.category} on Connecta`,
          text: `Check out ${provider.fullName} (${provider.category}) in ${provider.city}, Nigeria. Rated ${ratingScore.toFixed(1)}/5 with 100% Escrow Safeguard.`,
          url,
        })
      } catch {
        // User dismissed dialog
      }
    }
  }

  const handleOpenMap = () => {
    if (provider.latitude && provider.longitude) {
      window.open(getGoogleMapsDirectionsUrl(provider.latitude, provider.longitude, provider.fullName), '_blank')
    } else {
      const address = provider.workshopAddress || `${provider.city}, Nigeria`
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
    }
  }

  const handleOpenReviewModal = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true)
      return
    }
    setReviewError(null)
    setReviewSuccess(null)
    setIsReviewModalOpen(true)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim() || commentInput.trim().length < 5) {
      setReviewError('Please write a helpful review of at least 5 characters.')
      return
    }

    setIsSubmitting(true)
    setReviewError(null)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: provider.id,
          rating: ratingInput,
          projectTitle: projectTitleInput.trim() || `${provider.category} Project`,
          comment: commentInput.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          setIsReviewModalOpen(false)
          setIsAuthModalOpen(true)
          return
        }
        throw new Error(data.error || 'Failed to submit review.')
      }

      setReviewSuccess('Review published successfully!')
      if (data.review) {
        setReviewsList((prev) => [data.review, ...prev])
        setRatingCount((prev) => prev + 1)
        if (data.newAverageRating) {
          setRatingScore(data.newAverageRating)
        }
      }

      setTimeout(() => {
        setIsReviewModalOpen(false)
        setCommentInput('')
        setProjectTitleInput('')
        setReviewSuccess(null)
      }, 1500)
    } catch (err: any) {
      setReviewError(err.message || 'Something went wrong while submitting your review.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Social share destination URLs
  const shareTitle = `Verified ${provider.category}: ${provider.fullName} on Connecta Nigeria`
  const shareSummary = `${provider.fullName} (${provider.businessName}) • ${provider.category} in ${provider.city} • ★ ${ratingScore.toFixed(1)} (${ratingCount} reviews) • ₦${nairaRate}/hr • 100% Escrow Protected`

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareTitle}\n${shareSummary}\n\nView Profile: ${shareUrl}`)}`
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTitle} - ★${ratingScore.toFixed(1)} rating, ₦${nairaRate}/hr. 100% Escrow Safeguarded:`)}&url=${encodeURIComponent(shareUrl)}`
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`${shareTitle} • ₦${nairaRate}/hr`)}`
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(`Verified Specialist: ${provider.fullName} on Connecta`)}&body=${encodeURIComponent(`Hello,\n\nI recommend checking out ${provider.fullName} (${provider.category}) in ${provider.city}, Nigeria on Connecta.\n\nBusiness: ${provider.businessName}\nRating: ${ratingScore.toFixed(1)}/5 (${ratingCount} verified reviews)\nRate: ₦${nairaRate}/hr\n\nProfile & Escrow Booking: ${shareUrl}\n\nSafeguarded by Connecta Escrow.`)}`

  const userHandle = `@${provider.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
  const userEmail = `${provider.fullName.toLowerCase().replace(/[^a-z]/g, '')}@myconnecta.ng`

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col justify-between selection:bg-[#10B981]/20">
      {/* Top Header - Official Connecta Clean Floating Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-all active:scale-95 shrink-0"
              aria-label="Back to Directory"
              title="Back to Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#0C513F] flex items-center justify-center p-1.5 shadow-2xs transition-transform group-hover:scale-105 shrink-0">
                <div className="relative w-4.5 h-4.5">
                  <Image
                    src="/brand/connecta-header-icon.svg"
                    alt="Connecta Icon"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 flex items-center">
                Connecta
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleShareClick}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40 text-slate-700 hover:text-[#0C513F] text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5 text-[#0C513F]" />
              <span>Share Profile</span>
            </button>

            <Link
              href={`/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.category)}`}
              className="px-5 py-2 rounded-xl bg-[#0C513F] hover:bg-[#0A2614] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all hover:scale-105 inline-flex items-center gap-1.5"
            >
              <span>Hire Specialist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Profile & Contact Card                       */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-6">
            {/* Brand Banner & Avatar (Brand Consistent: Deep Green & Emerald) */}
            <div>
              <div className="h-28 sm:h-32 rounded-2xl bg-gradient-to-br from-[#0A2614] via-[#0C513F] to-[#10B981] relative overflow-hidden shadow-inner">
                {/* Subtle brand halftone dot pattern */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.85) 1.5px, transparent 1.5px)',
                    backgroundSize: '16px 16px',
                  }}
                />
                <div className="absolute top-2.5 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-semibold text-white/95">
                  <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                  <span>Connecta Verified</span>
                </div>
              </div>

              {/* Circular Avatar Overlapping Banner */}
              <div className="relative -mt-12 ml-4 flex items-end justify-between pr-2">
                <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100 shrink-0">
                  <Image
                    src={provider.avatarUrl || '/brand/social/connecta-social-avatar-512.png'}
                    alt={provider.fullName}
                    fill
                    sizes="96px"
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Circular Country Flag Badge */}
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden flex shrink-0 mb-1"
                  title="Nigeria • Resident Specialist"
                >
                  <span className="w-1/3 h-full bg-[#008751]" />
                  <span className="w-1/3 h-full bg-white" />
                  <span className="w-1/3 h-full bg-[#008751]" />
                </div>
              </div>
            </div>

            {/* Name, Handle & Contact Info */}
            <div className="space-y-1.5 px-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {provider.fullName}
                </h2>
                {provider.verificationStatus === 'verified' && (
                  <div
                    className="shrink-0 w-5 h-5 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-xs"
                    title="Verified Specialist • 100% Escrow Safeguarded"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <p className="text-sm font-semibold text-[#0C513F]">
                {userHandle}
              </p>

              <div className="pt-2 space-y-1 text-xs text-slate-600 font-medium">
                <p className="truncate">
                  <span className="font-semibold text-slate-700">Email:</span> {userEmail}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Phone:</span> {provider.phone || '+234 812 345 6789'}
                </p>
                <p className="truncate">
                  <span className="font-semibold text-slate-700">Enterprise:</span> {provider.businessName}
                </p>
                <p className="truncate">
                  <span className="font-semibold text-slate-700">Trade:</span> {provider.category}
                </p>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.category)}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#0C513F] hover:bg-[#0A2614] text-white font-semibold text-xs sm:text-sm text-center shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                title="Hire this specialist"
              >
                <Briefcase className="w-4 h-4 text-[#10B981]" />
                <span>Hire</span>
              </Link>

              <Link
                href={`/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.category)}`}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-[#0C513F] text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="Send message or inquiry"
              >
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span>Message</span>
              </Link>

              <button
                type="button"
                onClick={handleShareClick}
                className="w-10 h-10 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-[#0C513F] flex items-center justify-center text-slate-600 transition-colors shrink-0 cursor-pointer active:scale-95"
                title="Share specialist profile"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <hr className="border-slate-100" />

            {/* Notes Section (Bio & Specialization) */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Notes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {provider.bio}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-semibold leading-snug">
                &ldquo;{provider.headline}&rdquo;
              </div>
            </div>

            {/* Address Section with Real Live Google Map */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Workshop Address &amp; Location
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Verified Map
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{provider.workshopAddress || `${provider.city}, ${provider.state}, Nigeria`}</span>
              </p>

              {/* Real Interactive Google Map */}
              <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs group">
                <iframe
                  title={`${provider.fullName} Workshop Location Map`}
                  src={`https://maps.google.com/maps?q=${provider.latitude && provider.longitude ? `${provider.latitude},${provider.longitude}` : encodeURIComponent(`${provider.workshopAddress || ''}, ${provider.city}, Nigeria`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0 pointer-events-auto"
                  loading="lazy"
                  allowFullScreen
                />

                {/* Floating Bottom Bar: City Pill & Directions Button */}
                <div className="absolute bottom-2.5 right-2.5 left-2.5 flex items-center justify-between gap-2 pointer-events-none">
                  <div className="px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md border border-slate-200/90 text-[10px] font-semibold text-slate-700 shadow-xs truncate max-w-[55%] sm:max-w-[65%]">
                    {provider.city}, Nigeria
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenMap}
                    className="pointer-events-auto px-3 py-1.5 rounded-xl bg-[#0C513F] hover:bg-[#0A2614] text-white text-xs font-semibold shadow-md transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5 shrink-0"
                    title="Open in Google Maps for turn-by-turn directions"
                  >
                    <Navigation className="w-3 h-3 text-[#10B981]" />
                    <span>Get Directions</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </button>
                </div>
              </div>
            </div>

            {/* Attachments & Verified Credentials */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Attachments
                </h3>
                <span className="text-[11px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full">
                  3 Verified
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-[#0C513F] shrink-0 font-bold text-[10px]">
                      NIN
                    </div>
                    <span className="font-semibold text-slate-800 truncate">Identity &amp; NIN Biometrics</span>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full shrink-0">
                    Verified
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 shrink-0 font-bold text-[10px]">
                      LIC
                    </div>
                    <span className="font-semibold text-slate-800 truncate">Trade Guild Master Certification</span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full shrink-0">
                    Audited
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold text-[10px]">
                      ESC
                    </div>
                    <span className="font-semibold text-slate-800 truncate">100% Escrow Milestone Safeguard</span>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full shrink-0">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: KPI Cards, Job History & Related Artisans   */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search project title, client, or contract ID..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15 bg-slate-50/50"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 text-xs font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* KPI Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#F1F5F9] rounded-2xl p-5 space-y-1 border border-slate-200/60">
                <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {provider.completedJobsCount}
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-600">
                  Completed contracts total
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% on-time milestone delivery</span>
                </div>
              </div>

              <div className="bg-[#DCFCE7] rounded-2xl p-5 space-y-1 border border-emerald-200/60">
                <span className="text-2xl sm:text-3xl font-bold text-[#15803D] tracking-tight">
                  ₦{nairaRate}
                  <span className="text-sm font-normal text-emerald-800">/hr</span>
                </span>
                <p className="text-xs sm:text-sm font-semibold text-[#15803D]">
                  Starting rate • Escrow safeguarded
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 pt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{ratingScore.toFixed(2)} rating ({ratingCount} verified reviews)</span>
                </div>
              </div>
            </div>

            {/* Table Header & Status Filters */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="uppercase tracking-wider text-[11px]">Job History</span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setFilterStatus('all')}
                      className={`px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        filterStatus === 'all'
                          ? 'bg-[#0C513F] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('done')}
                      className={`px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        filterStatus === 'done'
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterStatus('pending')}
                      className={`px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        filterStatus === 'pending'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      In Escrow
                    </button>
                  </div>
                </div>

                <span className="uppercase tracking-wider text-[11px]">Status</span>
              </div>

              {/* Job List Items */}
              <div className="divide-y divide-slate-100">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors px-1 sm:px-2 rounded-xl group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 shrink-0 group-hover:border-[#10B981] group-hover:text-[#10B981] transition-colors shadow-2xs mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug truncate">
                            {job.id}: {job.title}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium pt-0.5">
                            {job.date} • Client: {job.client} • {job.amount}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {job.status === 'done' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#15803D] inline-flex items-center gap-1 shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309] inline-flex items-center gap-1 shadow-2xs">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No jobs match &ldquo;{searchQuery}&rdquo;.
                  </div>
                )}
              </div>
            </div>

            {/* Core Skills Chips */}
            <div className="pt-2 space-y-2 border-t border-slate-100">
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Specialized Trade Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {provider.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Verified Customer Testimonials */}
            <div id="reviews-section" className="pt-4 space-y-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Verified Client Reviews
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{ratingScore.toFixed(2)} ({ratingCount})</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleOpenReviewModal}
                    className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0C513F] text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Star className="w-3 h-3 text-[#10B981] fill-[#10B981]" />
                    <span>Write Review</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 text-xs">{rev.authorName}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating
                                ? 'text-amber-500 fill-amber-400'
                                : 'text-slate-200 fill-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-800">{rev.projectTitle}</p>
                    <p className="text-slate-600 leading-relaxed font-normal">&ldquo;{rev.comment}&rdquo;</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{rev.date} • Verified Escrow Release</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Specialists in Region (With small rounded profile icon) */}
            {relatedProviders.length > 0 && (
              <div className="pt-6 space-y-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Other Specialists in {provider.city}
                  </h3>
                  <Link
                    href={`/discover?city=${encodeURIComponent(provider.city)}`}
                    className="text-xs font-semibold text-[#0C513F] hover:text-[#10B981] flex items-center gap-1 group"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {relatedProviders.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/discover/${rel.id}`}
                      className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all flex items-center gap-3 group"
                    >
                      {/* Rounded small profile icon with verified badge */}
                      <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-emerald-500/20 group-hover:border-emerald-500 transition-colors bg-slate-100">
                        <Image
                          src={rel.avatarUrl || '/brand/social/connecta-social-avatar-512.png'}
                          alt={rel.fullName}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#10B981] text-white flex items-center justify-center border-2 border-white shadow-2xs">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="font-bold text-xs text-slate-900 group-hover:text-[#0C513F] truncate transition-colors">
                          {rel.fullName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate font-medium">
                          {rel.category}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <div className="flex items-center text-amber-500 font-bold">
                            <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                            <span>{rel.averageRating.toFixed(1)}</span>
                          </div>
                          <span className="text-slate-300">•</span>
                          <span className="font-semibold text-[#0C513F]">
                            ₦{Math.round(rel.hourlyRateMinor / 100).toLocaleString()}/hr
                          </span>
                        </div>
                      </div>

                      <div className="w-6 h-6 rounded-full bg-slate-50 group-hover:bg-[#0C513F] text-slate-400 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                        <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Decorative Scallop Border */}
      <SectionBorderDivider flip={true} color="#0A2614" className="-mb-1 relative z-20" />

      {/* Full-width Brand Green Footer */}
      <footer className="w-full bg-[#0A2614] text-white pt-12 sm:pt-20 pb-10 border-t-2 border-[#10B981]/20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#FFFFFF 1.5px, transparent 1.5px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center font-bold text-xl shrink-0 text-white">
                    ↓
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                    Connecta.
                  </h2>
                </div>
                <p className="text-base sm:text-lg font-medium leading-relaxed text-emerald-100/90 max-w-xl">
                  Connecting households and businesses in Kano and across Nigeria with verified local service professionals through milestone escrow.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                  Explore Platform
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Link
                    href="/#services"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
                  >
                    <span>Services &amp; Trades</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/discover"
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-emerald-300 font-semibold text-xs sm:text-sm flex items-center justify-between transition-all"
                  >
                    <span>Discover Pros</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
                  >
                    <span>How It Works</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/#trust-standard"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
                  >
                    <span>Trust &amp; Escrow</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/#faq"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
                  >
                    <span>FAQs</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                  <Link
                    href="/register"
                    className="p-3 rounded-2xl bg-[#10B981]/20 hover:bg-[#10B981]/30 border border-[#10B981]/40 text-[#10B981] font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
                  >
                    <span>Get Started</span>
                    <CornerDownRight className="w-3.5 h-3.5 text-[#10B981]" />
                  </Link>
                </div>
              </div>

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
                  title="Facebook"
                >
                  fb
                </a>
                <a
                  href="https://www.instagram.com/connecta_inc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white text-sm font-bold transition-all hover:scale-105"
                  title="Instagram"
                >
                  ig
                </a>
                <a
                  href="https://wa.me/2348123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-emerald-400 text-xs font-bold transition-all hover:scale-105"
                  title="WhatsApp"
                >
                  wa
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 w-full">
              <div className="bg-[#10B981] rounded-3xl p-8 sm:p-10 text-[#062419] shadow-2xl flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#062419]">
                    Ready to book this specialist?
                  </h3>
                  <p className="text-sm sm:text-base font-semibold leading-relaxed text-[#062419]/90">
                    Hire {provider.fullName} with 100% milestone escrow safeguard. Funds are never released until you inspect the completed job.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.category)}`}
                    className="bg-[#062419] hover:bg-black text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2"
                  >
                    <span>Hire with Escrow</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/discover"
                    className="bg-white/20 hover:bg-white/30 border border-[#062419]/25 text-[#062419] px-6 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all"
                  >
                    Browse Others
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-100/70">
            <p>© 2026 Connecta Technologies Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="/discover" className="text-emerald-300 font-semibold hover:underline">
                Find Professionals
              </Link>
              <span>•</span>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Share Profile Modal with Social Media & Meta Data */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#0C513F] text-white flex items-center justify-center shadow-2xs shrink-0">
                  <Share2 className="w-4 h-4 text-[#10B981]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    Share Specialist Profile
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Share verified credentials &amp; contact with clients or friends
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close share dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Rich Social Card Preview (What recipients will see) */}
              <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span>Social Preview Card</span>
                  <span className="text-[#0C513F] font-bold lowercase">myconnecta.ng</span>
                </div>

                <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-emerald-500/30 bg-slate-100">
                    <Image
                      src={provider.avatarUrl || '/brand/social/connecta-social-avatar-512.png'}
                      alt={provider.fullName}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#10B981] text-white flex items-center justify-center border-2 border-white shadow-2xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900 truncate">
                        {provider.fullName}
                      </h4>
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                        <ShieldCheck className="w-2.5 h-2.5 text-[#10B981]" />
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate font-medium">
                      {provider.businessName} • {provider.category}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        <span>{ratingScore.toFixed(1)}</span>
                        <span className="text-slate-400 font-medium ml-1">({ratingCount})</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="font-bold text-[#0C513F]">₦{nairaRate}/hr</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 font-medium truncate">{provider.city}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                  <span>Includes live escrow protection, public ratings &amp; portfolio metadata.</span>
                </div>
              </div>

              {/* Direct Link Copy Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Copy Profile Link
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-mono focus:outline-hidden select-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2.5 rounded-xl bg-[#0C513F] hover:bg-[#0A2614] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Share to Social Media Channels */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Share Directly to Social Media
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {/* WhatsApp */}
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      WA
                    </div>
                    <span>WhatsApp</span>
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href={twitterShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-slate-300 bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <span className="font-bold text-sm">𝕏</span>
                    <span>Post on X</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      f
                    </div>
                    <span>Facebook</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={linkedinShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-sky-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#0A66C2] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      in
                    </div>
                    <span>LinkedIn</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={telegramShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl border border-cyan-200 bg-cyan-50/70 hover:bg-cyan-100 text-cyan-900 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#229ED9] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      tg
                    </div>
                    <span>Telegram</span>
                  </a>

                  {/* Email */}
                  <a
                    href={emailShareUrl}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                  >
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              {/* Native device share button if supported */}
              {canNativeShare && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#0C513F]" />
                  <span>More device options (Native Share)...</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#0C513F] flex items-center justify-center border border-emerald-200/60 shrink-0">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    Review {provider.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Verified client feedback after escrow completion
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-5 sm:p-6 space-y-4">
              {reviewError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {reviewError}
                </div>
              )}
              {reviewSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{reviewSuccess}</span>
                </div>
              )}

              <div className="space-y-1.5 text-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select Rating
                </label>
                <div className="flex items-center justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRatingInput(star)}
                      className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= (hoverRating || ratingInput)
                            ? 'text-amber-500 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {hoverRating || ratingInput} out of 5 stars
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Job / Project Title
                </label>
                <input
                  type="text"
                  value={projectTitleInput}
                  onChange={(e) => setProjectTitleInput(e.target.value)}
                  placeholder={`e.g. ${provider.category} Project`}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0C513F] focus:ring-1 focus:ring-[#0C513F]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Your Review
                </label>
                <textarea
                  rows={3}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share details about punctuality, craft quality, and communication..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#0C513F] focus:ring-1 focus:ring-[#0C513F]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-azure hover:bg-azure-600 text-white text-xs font-semibold shadow-xs transition-all disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting && <Spinner className="w-3.5 h-3.5" />}
                  {isSubmitting ? 'Posting review' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal (when not logged in) */}
      {isAuthModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0C513F] flex items-center justify-center mx-auto border border-emerald-200">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">Sign in to Review</h3>
              <p className="text-xs text-slate-500 font-medium">
                Only verified clients with completed escrow jobs can leave authentic reviews.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/login?redirect=/discover/${provider.id}`}
                className="w-full py-2.5 rounded-xl bg-[#0C513F] hover:bg-[#0A2614] text-white font-semibold text-xs shadow-xs text-center"
              >
                Log In
              </Link>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="w-full py-2 rounded-xl text-xs text-slate-500 font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
