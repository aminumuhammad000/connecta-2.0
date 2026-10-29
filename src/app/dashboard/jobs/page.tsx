'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  MapPin,
  Star,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Check,
  ArrowRight,
  Plus,
  Loader2,
  X,
  Phone,
  MessageSquare,
  Wrench,
  Award,
} from 'lucide-react'
import { formatMinorToNaira } from '@/lib/dashboard/data'

interface PublicProvider {
  id: string
  fullName: string
  businessName: string
  headline: string
  bio: string
  category: string
  categorySlug: string
  skills: string[]
  city: string
  state: string
  country: string
  hourlyRateMinor: number
  averageRating: number
  reviewCount: number
  completedJobsCount: number
  experienceYears: number
  verificationStatus: 'verified' | 'unverified'
  avatarUrl?: string | null
  phone?: string
  whatsapp?: string
  badges?: string[]
}

const TRADE_CATEGORIES = [
  { label: 'All Trades', value: 'all' },
  { label: 'Electrical & Wiring', value: 'Electrical & Wiring' },
  { label: 'Plumbing & Pipefitting', value: 'Plumbing & Pipefitting' },
  { label: 'Air Conditioning & Cooling', value: 'Air Conditioning & Cooling' },
  { label: 'Generator & Power', value: 'Generator Repair & Servicing' },
  { label: 'Carpentry & Woodwork', value: 'Carpentry & Woodwork' },
  { label: 'Phone & Tech Repair', value: 'Phone & Tablet Repair' },
  { label: 'Auto Mechanics', value: 'Auto Mechanics & Repair' },
]

const CITIES = ['All Cities', 'Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan']

export default function DashboardProfessionalsPage() {
  const [providers, setProviders] = useState<PublicProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('All Cities')

  // Direct Hire Modal State
  const [activeHiringProvider, setActiveHiringProvider] = useState<PublicProvider | null>(null)
  const [projectTitle, setProjectTitle] = useState('')
  const [projectScope, setProjectScope] = useState('')
  const [escrowAmountNaira, setEscrowAmountNaira] = useState('150000')
  const [isSubmittingHire, setIsSubmittingHire] = useState(false)
  const [hireSuccessNotice, setHireSuccessNotice] = useState<string | null>(null)

  const fetchProviders = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.append('q', searchQuery.trim())
      if (selectedCity !== 'All Cities') params.append('city', selectedCity)

      const res = await fetch(`/api/providers?${params.toString()}`)
      if (res.ok) {
        const body = await res.json()
        let list: PublicProvider[] = body.data?.providers || []

        if (selectedCategory !== 'all') {
          list = list.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()))
        }

        setProviders(list)
      }
    } catch (err) {
      console.error('Failed to load professionals:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [selectedCategory, selectedCity])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProviders()
  }

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeHiringProvider) return

    setIsSubmittingHire(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle || `${activeHiringProvider.category} Service Order`,
          categoryId: activeHiringProvider.category,
          description: `${projectScope} (Assigned to specialist: ${activeHiringProvider.fullName})`,
          urgency: 'scheduled',
          serviceMode: 'at_location',
          budgetMinMinor: Number(escrowAmountNaira) * 100,
          budgetMaxMinor: Number(escrowAmountNaira) * 100,
        }),
      })

      if (res.ok) {
        setHireSuccessNotice(
          `Escrow milestone agreement initiated with ${activeHiringProvider.fullName}! Protected funds: ₦${Number(escrowAmountNaira).toLocaleString('en-NG')}.`
        )
        setActiveHiringProvider(null)
        setProjectTitle('')
        setProjectScope('')
        setTimeout(() => setHireSuccessNotice(null), 6000)
      }
    } catch (err) {
      console.error('Hire error:', err)
    } finally {
      setIsSubmittingHire(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200/60">
        <div>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Verified Tradespeople &amp; Contractors
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            Find Service Professionals
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-normal">
            Hire vetted electricians, plumbers, solar engineers, and technicians with CBN escrow-backed payment protection.
          </p>
        </div>

        <Link
          href="/requests/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 text-xs font-medium transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Custom Brief</span>
        </Link>
      </div>

      {/* Success Alert */}
      {hireSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{hireSuccessNotice}</span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by trade (electrician, solar, plumber), skill, or name..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-zinc-900 bg-white"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shrink-0 cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-100">
          {TRADE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                selectedCategory === cat.value
                  ? 'bg-zinc-900 text-white font-medium'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 font-normal'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Professionals Directory Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-zinc-600 animate-spin" />
          <span className="text-xs text-zinc-400 font-medium">Locating verified professionals...</span>
        </div>
      ) : providers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((pro) => {
            const initials = pro.fullName
              ? pro.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'PR'

            return (
              <div
                key={pro.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-zinc-300 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Profile Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/80 flex items-center justify-center shrink-0">
                        {pro.avatarUrl ? (
                          <Image src={pro.avatarUrl} alt={pro.fullName} fill className="object-cover" />
                        ) : (
                          <span className="text-xs font-bold text-zinc-800">{initials}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-zinc-900 truncate">{pro.fullName}</h3>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        </div>
                        <div className="text-xs text-zinc-500 truncate font-medium">{pro.businessName}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs font-bold text-zinc-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{pro.averageRating.toFixed(1)}</span>
                        <span className="text-zinc-400 font-normal">({pro.reviewCount})</span>
                      </div>
                      <span className="text-[11px] text-zinc-400 block font-normal">
                        {pro.completedJobsCount} jobs completed
                      </span>
                    </div>
                  </div>

                  {/* Headline & Bio */}
                  <div>
                    <div className="text-xs font-medium text-zinc-800 leading-snug">{pro.headline}</div>
                    <p className="text-xs text-zinc-500 font-normal mt-1 line-clamp-2 leading-relaxed">
                      {pro.bio}
                    </p>
                  </div>

                  {/* Skills Pills */}
                  {pro.skills && pro.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {pro.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200/60 text-zinc-600 font-normal"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Info & Actions */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{pro.city}, Nigeria</span>
                    <span className="text-zinc-300">•</span>
                    <span className="font-semibold text-zinc-900">
                      {pro.hourlyRateMinor > 0 ? `${formatMinorToNaira(pro.hourlyRateMinor)}/hr` : 'Custom Quote'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveHiringProvider(pro)
                      setProjectTitle(`${pro.category} Engagement`)
                      setProjectScope(`Engage ${pro.fullName} for professional trade services.`)
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-[#0C513F] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
                  >
                    <span>Hire Specialist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200/80 space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-semibold text-zinc-900">No Professionals Found</h3>
            <p className="text-xs text-zinc-500 font-normal leading-relaxed">
              Try adjusting your trade category or city filters to locate vetted specialists.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all')
              setSelectedCity('All Cities')
              setSearchQuery('')
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Direct Engagement & Escrow Deposit Modal */}
      {activeHiringProvider && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-zinc-200/80">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  Direct Escrow Contract
                </span>
                <h3 className="text-base font-semibold text-zinc-900 mt-1.5">
                  Hire &amp; Protect Milestone Funds with {activeHiringProvider.fullName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveHiringProvider(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleHireSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Project / Engagement Title</label>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. 5KVA Solar Inverter Installation & Earthing"
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 font-normal text-zinc-900 focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Scope of Work &amp; Deliverables</label>
                <textarea
                  rows={3}
                  value={projectScope}
                  onChange={(e) => setProjectScope(e.target.value)}
                  placeholder="Describe the job specifications, physical site location, and expected deliverables..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 font-normal text-zinc-900 focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Escrow Milestone Amount (NGN ₦)</label>
                <input
                  type="number"
                  value={escrowAmountNaira}
                  onChange={(e) => setEscrowAmountNaira(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 font-semibold text-sm text-[#0C513F] focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-600 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-medium text-zinc-900">Protected in Connecta Escrow Vault</div>
                  <div>
                    Your funds are held securely until you personally inspect and approve the completed job. The specialist will not receive payment until you authorize milestone release.
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setActiveHiringProvider(null)}
                  className="px-3.5 py-2 rounded-xl text-zinc-600 font-medium hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingHire}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmittingHire ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  <span>{isSubmittingHire ? 'Securing Agreement...' : 'Confirm & Lock Escrow'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
