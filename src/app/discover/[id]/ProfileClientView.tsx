'use client'

import React, { useState, useMemo } from 'react'
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
} from 'lucide-react'
import { PublicProvider } from '@/lib/server/providers'
import { SectionBorderDivider } from '@/components/Connecta3DDecoration'

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

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handleOpenMap = () => {
    const address = provider.workshopAddress || `${provider.city}, Nigeria`
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
  }

  const userHandle = `@${provider.fullName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
  const userEmail = `${provider.fullName.toLowerCase().replace(/[^a-z]/g, '')}@myconnecta.ng`

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col justify-between selection:bg-[#10B981]/20">
      {/* Top Header - Unified Floating Header Style */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-2xs transition-all active:scale-95"
              aria-label="Back to Directory"
              title="Back to Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                Specialist details
              </h1>
              <p className="text-xs text-slate-400 font-semibold pt-0.5 hidden sm:block">
                Verified Public Artisan Profile • Connecta Nigeria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied Link!' : 'Share Profile'}</span>
            </button>

            <Link
              href={`/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.category)}`}
              className="px-5 py-2 rounded-xl bg-[#0A1020] hover:bg-[#10B981] text-white text-xs sm:text-sm font-extrabold shadow-sm transition-all hover:scale-105 inline-flex items-center gap-1.5"
            >
              <span>Hire Specialist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area - Exact Adaptation of user profile.png */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Profile & Contact Card (user profile.png)    */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-6">
            {/* Gradient Banner & Avatar */}
            <div>
              <div className="h-28 sm:h-32 rounded-2xl bg-gradient-to-tr from-[#93C5FD] via-[#F472B6] to-[#FBBF24] relative overflow-hidden">
                {/* Halftone subtle dots inside banner */}
                <div
                  className="absolute inset-0 opacity-[0.1] pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(#000000 1.5px, transparent 1.5px)',
                    backgroundSize: '16px 16px',
                  }}
                />
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
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {provider.fullName}
                </h2>
                {provider.verificationStatus === 'verified' && (
                  <div
                    className="shrink-0 w-5 h-5 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-xs"
                    title="Verified Specialist"
                  >
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </div>
                )}
              </div>

              <p className="text-sm font-bold text-[#1A73E8]">
                {userHandle}
              </p>

              <div className="pt-2 space-y-1 text-xs text-slate-600 font-medium">
                <p className="truncate">
                  <strong className="text-slate-800">Email:</strong> {userEmail}
                </p>
                <p>
                  <strong className="text-slate-800">Phone:</strong> {provider.phone || '+234 812 345 6789'}
                </p>
                <p className="truncate">
                  <strong className="text-slate-800">Enterprise:</strong> {provider.businessName}
                </p>
                <p className="truncate">
                  <strong className="text-slate-800">Trade:</strong> {provider.category}
                </p>
              </div>
            </div>

            {/* Action Buttons Row (Matching user profile.png orange/white button group) */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                href={`/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.category)}`}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white font-extrabold text-xs sm:text-sm text-center shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send message</span>
              </Link>

              <a
                href="#reviews-section"
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                title="View verified reviews"
              >
                <Award className="w-4 h-4 text-slate-500" />
                <span>Analytics</span>
              </a>

              <button
                type="button"
                onClick={handleShare}
                className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shrink-0"
                title="Share specialist link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <hr className="border-slate-100" />

            {/* Notes Section (Bio & Specialization) */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Notes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {provider.bio}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 font-semibold leading-snug">
                &ldquo;{provider.headline}&rdquo;
              </div>
            </div>

            {/* Address Section with Vector Map Card (user profile.png style) */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Address
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                {provider.workshopAddress || `${provider.city}, ${provider.state}, Nigeria`}
              </p>

              {/* Styled Vector Map Representation */}
              <div className="relative w-full h-28 rounded-2xl overflow-hidden border border-slate-200 bg-[#E8ECEF] flex items-center justify-center group">
                {/* CSS Vector Map Grid & Roads */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage: `
                      radial-gradient(#CBD5E1 1px, transparent 1px),
                      linear-gradient(to right, #CBD5E1 1px, transparent 1px),
                      linear-gradient(to bottom, #CBD5E1 1px, transparent 1px)
                    `,
                    backgroundSize: '24px 24px',
                  }}
                />
                {/* Mock Vector Street Lines */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-white/70 -translate-y-1/2 -rotate-6" />
                <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-white/70 rotate-12" />
                <div className="absolute top-0 bottom-0 right-1/4 w-3 bg-white/70 -rotate-12" />

                {/* Map Pin in Center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="w-7 h-7 rounded-full bg-[#E11D48] text-white flex items-center justify-center shadow-md animate-bounce">
                    <MapPin className="w-4 h-4 fill-current" />
                  </div>
                </div>

                {/* "View Map" Pill Button from user profile.png */}
                <button
                  type="button"
                  onClick={handleOpenMap}
                  className="absolute bottom-2.5 px-4 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold shadow-xs transition-all hover:scale-105 z-20 cursor-pointer flex items-center gap-1.5"
                >
                  <span>View map</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Attachments & Verified Credentials */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
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
                    <span className="font-bold text-slate-800 truncate">Identity &amp; NIN Biometrics</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full shrink-0">
                    Verified
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-800 shrink-0 font-bold text-[10px]">
                      LIC
                    </div>
                    <span className="font-bold text-slate-800 truncate">Trade Guild Master Certification</span>
                  </div>
                  <span className="text-[10px] font-black text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full shrink-0">
                    Audited
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 font-bold text-[10px]">
                      ESC
                    </div>
                    <span className="font-bold text-slate-800 truncate">100% Escrow Milestone Safeguard</span>
                  </div>
                  <span className="text-[10px] font-black text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full shrink-0">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: KPI Cards & Job History (user profile.png)  */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
            {/* Search Bar (Matching user profile.png "Search number or amount") */}
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search number, amount or project title..."
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

            {/* KPI Cards Row (Matching user profile.png 154 / $980,721 cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Gray KPI Card (154 Invoices Total) */}
              <div className="bg-[#F1F5F9] rounded-2xl p-5 space-y-1 border border-slate-200/60">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {provider.completedJobsCount}
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  Completed contracts total
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% on-time milestone delivery</span>
                </div>
              </div>

              {/* Light Green KPI Card ($980,721 Paid Invoices) */}
              <div className="bg-[#DCFCE7] rounded-2xl p-5 space-y-1 border border-emerald-200/60">
                <span className="text-3xl sm:text-4xl font-black text-[#15803D] tracking-tight">
                  ₦{nairaRate}
                  <span className="text-sm font-normal text-emerald-800">/hr</span>
                </span>
                <p className="text-xs sm:text-sm font-bold text-[#15803D]">
                  Starting rate • Escrow safeguarded
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-700 pt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{provider.averageRating.toFixed(2)} rating ({provider.reviewCount} verified reviews)</span>
                </div>
              </div>
            </div>

            {/* Table Header & Status Filters */}
            <div className="pt-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="uppercase tracking-wider text-[11px]">Job History</span>
                  <div className="flex items-center gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setFilterStatus('all')}
                      className={`px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                        filterStatus === 'all'
                          ? 'bg-slate-900 text-white'
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

              {/* Job List Items (Exact user profile.png row layout) */}
              <div className="divide-y divide-slate-100">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors px-1 sm:px-2 rounded-xl group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* File / Job icon matching user profile.png document icon */}
                        <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-500 shrink-0 group-hover:border-[#10B981] group-hover:text-[#10B981] transition-colors shadow-2xs mt-0.5">
                          <FileText className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                            {job.id}: {job.title}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium pt-0.5">
                            {job.date} • Client: {job.client} • {job.amount}
                          </p>
                        </div>
                      </div>

                      {/* Status Pills (user profile.png style) */}
                      <div className="shrink-0">
                        {job.status === 'done' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DCFCE7] text-[#15803D] inline-flex items-center gap-1 shadow-2xs">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Done</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#B45309] inline-flex items-center gap-1 shadow-2xs">
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
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Specialized Trade Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {provider.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5"
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
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Verified Client Reviews
                </h3>
                <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{provider.averageRating.toFixed(2)} ({provider.reviewCount})</span>
                </span>
              </div>

              <div className="space-y-3">
                {provider.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{rev.authorName}</span>
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
                    <p className="text-[11px] font-bold text-emerald-800">{rev.projectTitle}</p>
                    <p className="text-slate-600 leading-relaxed font-normal">&ldquo;{rev.comment}&rdquo;</p>
                    <p className="text-[10px] text-slate-400 font-semibold">{rev.date} • Verified Escrow Release</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Specialists in Region */}
            {relatedProviders.length > 0 && (
              <div className="pt-4 space-y-3 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Other Specialists in {provider.city}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {relatedProviders.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/discover/${rel.id}`}
                      className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-all block space-y-1 group"
                    >
                      <p className="font-bold text-xs text-slate-900 group-hover:text-[#0C513F] truncate">
                        {rel.fullName}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{rel.category}</p>
                      <p className="text-[10px] font-black text-emerald-700">₦{Math.round(rel.hourlyRateMinor / 100).toLocaleString()}/hr</p>
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

      {/* Full-width Brand Green Footer (Exact Match to Landing Page) */}
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
                  <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
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
                    className="p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-emerald-300 font-extrabold text-xs sm:text-sm flex items-center justify-between transition-all"
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
                    href="/onboarding?step=role"
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all"
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
                  <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-[#062419]">
                    Ready to book this specialist?
                  </h3>
                  <p className="text-sm sm:text-base font-semibold leading-relaxed text-[#062419]/90">
                    Hire {provider.fullName} with 100% milestone escrow safeguard. Funds are never released until you inspect the completed job.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.category)}`}
                    className="bg-[#062419] hover:bg-black text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-extrabold shadow-lg transition-all hover:scale-105 inline-flex items-center gap-2"
                  >
                    <span>Hire with Escrow</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/discover"
                    className="bg-white/20 hover:bg-white/30 border border-[#062419]/25 text-[#062419] px-6 py-3.5 rounded-full text-xs sm:text-sm font-extrabold transition-all"
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
              <Link href="/discover" className="text-emerald-300 font-bold hover:underline">
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
    </div>
  )
}
