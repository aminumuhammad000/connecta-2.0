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
  Search,
  PlusCircle,
  ChevronRight,
  AlertCircle,
  Loader2,
  Wrench,
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
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-7 h-7 text-[#0C513F] animate-spin" />
        <span className="text-xs font-medium text-zinc-500">Loading your workspace...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-zinc-200 text-center space-y-4">
        <AlertCircle className="w-9 h-9 text-rose-500 mx-auto" />
        <h3 className="text-sm font-semibold text-zinc-900">Dashboard Unavailable</h3>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">{error || 'Unable to retrieve workspace data.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-all"
        >
          Retry Connection
        </button>
      </div>
    )
  }

  const { user, wallet, metrics, activeBooking, recentJobs } = data

  return (
    <div className="space-y-6">
      {/* Quiet Welcome Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-zinc-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">
              <MapPin className="w-3.5 h-3.5 text-zinc-400" />
              {user.city ? `${user.city}, Nigeria` : 'Nigeria'}
            </span>
            <span className="text-zinc-300">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0C513F]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Protected Escrow Vault
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Welcome back, {user.fullName}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl font-normal leading-relaxed">
            Manage your active milestone contracts, discover verified artisans, or post a new service brief with guaranteed escrow protection.
          </p>
        </div>

        {/* Primary Header Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white px-4 py-2.5 text-xs font-semibold shadow-xs hover:shadow transition-all active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Request</span>
          </Link>

          <Link
            href="/ai"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200/80 px-3.5 py-2.5 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0C513F]" />
            <span>AI Search</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item, idx) => {
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/80 shadow-xs hover:border-zinc-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-500">
                  {item.label}
                </span>
                <div className="w-8 h-8 rounded-lg bg-zinc-50 border border-zinc-100 text-zinc-600 flex items-center justify-center">
                  {item.iconType === 'briefcase' && <Briefcase className="w-4 h-4 text-zinc-600" />}
                  {item.iconType === 'wallet' && <Wallet className="w-4 h-4 text-[#0C513F]" />}
                  {item.iconType === 'shield' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                  {item.iconType === 'star' && <Star className="w-4 h-4 text-amber-500" />}
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                  {item.value}
                </div>
                <div className="text-[11px] font-medium text-zinc-400 mt-0.5 truncate">
                  {item.subtext}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Active Contract / Milestone Tracker */}
      {activeBooking ? (
        <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0C513F] border border-emerald-200/60">
                  Active Contract #{activeBooking.bookingNumber}
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-xs text-zinc-500">
                  Artisan: <strong className="text-zinc-800">{activeBooking.providerName}</strong> ({activeBooking.providerTitle})
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-zinc-900 tracking-tight">
                {activeBooking.title}
              </h2>
            </div>

            <div className="sm:text-right shrink-0">
              <div className="text-[11px] font-medium text-zinc-400">Total in Escrow</div>
              <div className="text-lg sm:text-xl font-bold text-zinc-900">
                {formatMinorToNaira(activeBooking.totalAmountMinor)}
              </div>
            </div>
          </div>

          {/* Milestone Steps Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-zinc-600">Contract Milestones</span>
              <span className="font-semibold text-[#0C513F]">{activeBooking.progressPercentage}% Completed</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-zinc-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#0C513F] transition-all duration-500"
                style={{ width: `${activeBooking.progressPercentage}%` }}
              />
            </div>

            {/* Individual Milestones List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
              {activeBooking.milestones?.map((m: any, idx: number) => (
                <div
                  key={m.id || idx}
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                    m.status === 'completed'
                      ? 'bg-emerald-50/50 border-emerald-200/70 text-emerald-950'
                      : m.status === 'current'
                      ? 'bg-zinc-50 border-zinc-300 text-zinc-900'
                      : 'bg-white border-zinc-200/70 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                        m.status === 'completed'
                          ? 'bg-emerald-600 text-white'
                          : m.status === 'current'
                          ? 'bg-[#0C513F] text-white'
                          : 'bg-zinc-100 text-zinc-400'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span className="font-medium truncate">{m.title}</span>
                  </div>
                  <div className="font-semibold shrink-0 text-right">
                    {formatMinorToNaira(m.amountMinor)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100">
            <div className="text-xs text-zinc-500 flex items-center gap-1.5 font-normal">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Inspection scheduled for milestone delivery verification.</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard/projects"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/dashboard/projects"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white px-4 py-2 text-xs font-semibold shadow-xs transition-all"
              >
                <span>Inspect &amp; Release</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Card */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/80 shadow-xs text-center space-y-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200/80 text-[#0C513F] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-semibold text-zinc-900">
              No Active Contracts
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed font-normal">
              When you hire a specialist or start a project, your milestone agreement and escrow status will update here automatically.
            </p>
          </div>
          <div className="pt-1 flex items-center justify-center gap-2">
            <Link
              href="/requests/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white px-3.5 py-2 text-xs font-semibold shadow-xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Request</span>
            </Link>
            <Link
              href="/dashboard/jobs"
              className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200/80 px-3.5 py-2 text-xs font-medium transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Browse Jobs</span>
            </Link>
          </div>
        </div>
      )}

      {/* Marketplace Jobs & Right Column Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column: Live Marketplace Jobs */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
                Marketplace Job Briefs
              </h3>
              <p className="text-xs text-zinc-500 font-normal">
                Recent service requests posted by clients
              </p>
            </div>
            <Link
              href="/dashboard/jobs"
              className="text-xs font-semibold text-[#0C513F] hover:underline flex items-center gap-1 group"
            >
              <span>View all ({recentJobs?.length || 0})</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {recentJobs && recentJobs.length > 0 ? (
            <div className="space-y-2.5">
              {recentJobs.slice(0, 4).map((job: any) => (
                <Link
                  key={job.id}
                  href="/dashboard/jobs"
                  className="block p-3.5 rounded-xl border border-zinc-200/70 hover:border-zinc-300 hover:bg-zinc-50/50 transition-all space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                        {job.category}
                      </span>
                      <h4 className="font-semibold text-xs sm:text-sm text-zinc-900 group-hover:text-[#0C513F] transition-colors line-clamp-1">
                        {job.title}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-zinc-900 whitespace-nowrap shrink-0 px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200">
                      {formatMinorToNaira(job.budgetMaxMinor || 10000000)}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 font-normal line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-zinc-400 font-normal border-t border-zinc-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-zinc-400" />
                      {job.city || 'Kano'}, Nigeria
                    </span>
                    <span className="font-medium text-[#0C513F]">
                      {job.proposalsCount || 0} proposals
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center space-y-2 border border-dashed border-zinc-200 rounded-xl">
              <Search className="w-6 h-6 text-zinc-300 mx-auto" />
              <p className="text-xs text-zinc-500">No job briefs available at the moment.</p>
              <Link
                href="/requests/new"
                className="inline-block text-xs font-semibold text-[#0C513F] hover:underline"
              >
                + Post a Request
              </Link>
            </div>
          )}
        </div>

        {/* Side Column: AI Card & Shortcuts */}
        <div className="space-y-4">
          {/* AI Search Card */}
          <div className="bg-gradient-to-br from-emerald-50/60 to-white rounded-2xl p-5 border border-emerald-200/70 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0C513F] text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-zinc-900">AI Service Matcher</span>
            </div>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal">
              Describe your project, upload a photo of the defect, or talk to AI to match verified artisans instantly.
            </p>
            <Link
              href="/ai"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0C513F] hover:underline"
            >
              <span>Launch AI Search</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-zinc-900 tracking-tight">
              Quick Shortcuts
            </h3>
            <div className="space-y-1.5">
              <Link
                href="/discover"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-800 group-hover:text-[#0C513F]">
                      Browse Artisans
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Plumbers, electricians &amp; carpenters
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/dashboard/wallet"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0C513F] flex items-center justify-center shrink-0">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-800 group-hover:text-[#0C513F]">
                      Escrow Vault
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Balance: {formatMinorToNaira(wallet.balanceMinor)}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/dashboard/support"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-800 group-hover:text-[#0C513F]">
                      Resolution &amp; Charter
                    </div>
                    <div className="text-[10px] text-zinc-400">
                      Escrow dispute policy &amp; FAQs
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
