'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  Wallet,
  ShieldCheck,
  Star,
  Sparkles,
  ArrowUpRight,
  Clock,
  MapPin,
  CheckCircle2,
  Check,
  Search,
  Plus,
  ChevronRight,
  AlertCircle,
  Loader2,
  ArrowRight,
} from 'lucide-react'
import { formatMinorToNaira } from '@/lib/dashboard/data'

interface ServerOverviewData {
  user: {
    id: string
    fullName: string
    firstName: string
    lastName: string
    email: string
    role: 'customer' | 'provider'
    activeRole: 'customer' | 'provider'
    city: string
    currency: string
    avatarUrl?: string | null
    headline?: string
    trade?: string
    bio?: string
    skills?: string[]
    companyName?: string
  }
  wallet: {
    balanceMinor: number
    escrowBalanceMinor: number
    sparksBalance: number
    currency: string
  }
  metrics: Array<{
    label: string
    value: string
    subtext: string
    iconType: string
    color: string
    changePercent?: string
  }>
  activeBooking: any | null
  recentJobs: any[]
}

export default function DashboardOverviewPage() {
  const [data, setData] = useState<ServerOverviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOverview() {
      try {
        const res = await fetch('/api/dashboard/overview')
        if (!res.ok) {
          throw new Error('Failed to load dashboard overview data')
        }
        const json = await res.json()
        setData(json.data)
      } catch (err: any) {
        setError(err.message || 'Connection error')
      } finally {
        setIsLoading(false)
      }
    }
    loadOverview()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
        <span className="text-xs text-zinc-400">Loading overview...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center border border-zinc-200/80 rounded-2xl bg-white space-y-3">
        <AlertCircle className="w-6 h-6 text-rose-500 mx-auto" />
        <div className="text-xs font-semibold text-zinc-900">Dashboard Unavailable</div>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">{error || 'Unable to retrieve workspace data.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    )
  }

  const { user, wallet, metrics, activeBooking, recentJobs } = data

  const formatNaira = (minor: number) => {
    const val = minor / 100
    return `₦${val.toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200/60">
        <div>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Workspace • {user.city ? `${user.city}, Nigeria` : 'Nigeria'}
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            Good day, {user.firstName || user.fullName}
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-normal">
            Your active milestone contracts, verified artisan proposals, and protected escrow balance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/jobs"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Find Professionals</span>
          </Link>
          <Link
            href="/dashboard/payment"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 text-zinc-700 border border-zinc-200 text-xs font-medium transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-zinc-500" />
            <span>Payment</span>
          </Link>
        </div>
      </div>

      {/* Modern Minimalist Financial & Operational Strip */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-100">
          <div className="p-3 sm:p-4 space-y-1">
            <span className="text-[11px] font-medium text-zinc-400 block">Protected in Escrow</span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              {wallet ? formatNaira(wallet.escrowBalanceMinor) : '₦0'}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Secured in Vault
            </span>
          </div>

          <div className="p-3 sm:p-4 space-y-1">
            <span className="text-[11px] font-medium text-zinc-400 block">Available Balance</span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              {wallet ? formatNaira(wallet.balanceMinor) : '₦0'}
            </div>
            <Link href="/dashboard/payment" className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium inline-block">
              Withdraw or Top-up →
            </Link>
          </div>

          <div className="p-3 sm:p-4 space-y-1">
            <span className="text-[11px] font-medium text-zinc-400 block">Active Milestones</span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              {metrics.find((m) => m.label.toLowerCase().includes('milestone'))?.value || '2'}
            </div>
            <span className="text-[11px] text-zinc-500 font-medium">In execution</span>
          </div>

          <div className="p-3 sm:p-4 space-y-1">
            <span className="text-[11px] font-medium text-zinc-400 block">Verified Professionals</span>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">
              10+ Trades
            </div>
            <Link href="/dashboard/jobs" className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium inline-block">
              Find Professionals →
            </Link>
          </div>
        </div>
      </div>

      {/* Active Milestone Contracts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">In-Flight Contract</h2>
            <p className="text-xs text-zinc-500">Milestone deliverables guarded by Connecta escrow.</p>
          </div>
          <Link
            href="/dashboard/projects"
            className="text-xs text-zinc-600 hover:text-zinc-950 font-medium inline-flex items-center gap-1"
          >
            <span>All Contracts</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {activeBooking ? (
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 font-semibold">
                    #{activeBooking.bookingNumber}
                  </span>
                  <span className="text-xs text-zinc-400">•</span>
                  <span className="text-xs text-zinc-600 font-medium">{activeBooking.category}</span>
                </div>
                <h3 className="text-base font-bold text-zinc-900 mt-1">{activeBooking.title}</h3>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] text-zinc-400 font-medium block">Total Escrow Value</span>
                <span className="text-base font-bold text-zinc-900">
                  {formatMinorToNaira(activeBooking.totalAmountMinor)}
                </span>
              </div>
            </div>

            {/* Parties */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 block font-medium">Assigned Artisan</span>
                  <span className="font-semibold text-zinc-900">{activeBooking.providerName}</span>
                </div>
                <span className="text-[11px] text-zinc-500">{activeBooking.providerTitle}</span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50/70 border border-zinc-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-zinc-400 block font-medium">Progress</span>
                  <span className="font-semibold text-zinc-900">{activeBooking.progressPercentage}% Completed</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">Milestone Active</span>
              </div>
            </div>

            {/* Milestone List */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-zinc-700 block">Deliverables Roadmap</span>
              <div className="space-y-1.5">
                {activeBooking.milestones?.map((m: any, idx: number) => (
                  <div
                    key={m.id || idx}
                    className="p-3 rounded-xl border border-zinc-200/60 text-xs flex items-center justify-between gap-3 bg-white hover:bg-zinc-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                          m.status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : m.status === 'current'
                            ? 'bg-zinc-900 text-white'
                            : 'bg-zinc-100 text-zinc-400'
                        }`}
                      >
                        {m.status === 'completed' ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
                      </div>
                      <span className="font-medium text-zinc-900 truncate">{m.title}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-semibold text-zinc-900">{formatMinorToNaira(m.amountMinor)}</span>
                      {m.status === 'current' && (
                        <Link
                          href="/dashboard/projects"
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors"
                        >
                          Review &amp; Release
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-white border border-zinc-200/80 rounded-2xl space-y-2">
            <div className="text-xs font-semibold text-zinc-900">Zero In-Flight Contracts</div>
            <p className="text-xs text-zinc-400">Hire a verified specialist to initiate an escrow agreement.</p>
          </div>
        )}
      </div>

      {/* Featured Verified Professionals Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Featured Service Professionals</h2>
            <p className="text-xs text-zinc-500">Vetted electricians, plumbers, and engineers ready for milestone escrow contracts.</p>
          </div>
          <Link
            href="/dashboard/jobs"
            className="text-xs text-zinc-600 hover:text-zinc-950 font-medium inline-flex items-center gap-1"
          >
            <span>Browse All Professionals</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            {
              name: 'Engr. Babatunde Alabi',
              trade: 'Electrical & Wiring',
              headline: 'Licensed Industrial & Residential Electrical Contractor',
              rating: '4.9',
              reviews: 88,
              city: 'Ikeja, Lagos',
              rate: '₦12,000/hr',
            },
            {
              name: 'Ibrahim Suleiman',
              trade: 'Solar & Renewable Power',
              headline: 'Certified Solar PV & Hybrid Inverter Installation Engineer',
              rating: '5.0',
              reviews: 64,
              city: 'Garki, Abuja',
              rate: '₦15,000/hr',
            },
            {
              name: 'Emeka Okafor',
              trade: 'Plumbing & Pipefitting',
              headline: 'PPR Pipe & Borehole Submersible Pump Specialist',
              rating: '4.8',
              reviews: 52,
              city: 'Port Harcourt',
              rate: '₦10,000/hr',
            },
            {
              name: 'Malam Sanusi Danbatta',
              trade: 'Electronics & Micro-Soldering',
              headline: 'Master Board Level Diagnostics & Component Repair Lab',
              rating: '4.9',
              reviews: 142,
              city: 'Kano City',
              rate: '₦8,500/hr',
            },
          ].map((pro, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 transition-colors flex flex-col justify-between space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium">
                    {pro.trade}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-zinc-900">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{pro.rating}</span>
                    <span className="text-zinc-400 font-normal">({pro.reviews})</span>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 leading-snug">{pro.name}</h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{pro.headline}</p>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                <span className="text-zinc-500 font-medium">{pro.city} • {pro.rate}</span>
                <Link
                  href="/dashboard/jobs"
                  className="text-zinc-900 font-medium hover:underline inline-flex items-center gap-1"
                >
                  <span>Hire Specialist</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
