'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
  Users,
  Search,
  PlusCircle,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import {
  CLIENT_METRICS,
  PROVIDER_METRICS,
  DASHBOARD_BOOKINGS,
  DASHBOARD_MARKETPLACE_JOBS,
  DASHBOARD_SQUADS,
  formatMinorToNaira,
} from '@/lib/dashboard/data'

export default function DashboardOverviewPage() {
  const [roleMode, setRoleMode] = useState<'client' | 'provider'>('client')
  const metrics = roleMode === 'client' ? CLIENT_METRICS : PROVIDER_METRICS
  const activeBooking = DASHBOARD_BOOKINGS[0]

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#10B981]/10 via-[#1A73E8]/8 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0C513F] tracking-wider">
                {roleMode === 'client' ? 'Verified Client Workspace' : 'Master Specialist Pro'}
              </span>
              <span className="text-xs text-slate-400 font-medium">•</span>
              <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {roleMode === 'client' ? 'Lagos, Nigeria' : 'Kano, Nigeria'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight">
              Welcome back, {roleMode === 'client' ? 'Tunde Bakare' : 'Ibrahim Aliyu'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl leading-relaxed">
              {roleMode === 'client'
                ? 'Your milestone escrow contracts are fully insured. Review active contractor milestones or post a new trade brief.'
                : 'You have 1 active in-flight contract with ₦480,000 locked in escrow. Your next milestone is ready for inspection.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {roleMode === 'client' ? (
              <>
                <Link
                  href="/requests/new"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0C513F] hover:bg-[#083b2e] text-white px-5 py-3 text-xs sm:text-sm font-extrabold shadow-md hover:scale-102 active:scale-98 transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Project Brief</span>
                </Link>
                <Link
                  href="/dashboard/wallet"
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-3 text-xs sm:text-sm font-bold shadow-xs hover:border-slate-400 transition-all"
                >
                  <span>Deposit Escrow</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/jobs"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white px-5 py-3 text-xs sm:text-sm font-extrabold shadow-md hover:scale-102 active:scale-98 transition-all"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Jobs</span>
                </Link>
                <Link
                  href="/dashboard/wallet"
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 px-4 py-3 text-xs sm:text-sm font-bold shadow-xs hover:border-slate-400 transition-all"
                >
                  <span>Payouts</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metrics.map((item, idx) => {
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {item.label}
                </span>
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                    item.color === 'emerald'
                      ? 'bg-emerald-100 text-[#0C513F]'
                      : item.color === 'blue'
                      ? 'bg-blue-100 text-[#1A73E8]'
                      : item.color === 'amber'
                      ? 'bg-amber-100 text-[#F59E0B]'
                      : 'bg-slate-100 text-[#0A1020]'
                  }`}
                >
                  {item.iconType === 'wallet' && <Wallet className="w-4 h-4" />}
                  {item.iconType === 'briefcase' && <Briefcase className="w-4 h-4" />}
                  {item.iconType === 'shield' && <ShieldCheck className="w-4 h-4" />}
                  {item.iconType === 'star' && <Star className="w-4 h-4" />}
                  {item.iconType === 'sparks' && <Sparkles className="w-4 h-4" />}
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-[#0A1020] tracking-tight">
                  {item.value}
                </div>
                <div className="text-[11px] font-medium text-slate-500 mt-0.5 truncate">
                  {item.subtext}
                </div>
              </div>

              {item.changePercent && (
                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>{item.changePercent}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Active Contract / Milestone Escrow Tracker Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Active Escrow Contract #{activeBooking.bookingNumber}
              </span>
              <span className="text-xs text-slate-400 font-medium">•</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                100% Escrow Protected
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-[#0A1020] tracking-tight">
              {activeBooking.title}
            </h2>
            <div className="text-xs text-slate-500 font-medium">
              Contractor: <span className="font-bold text-slate-800">{activeBooking.providerName}</span> ({activeBooking.providerTitle})
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Total Contract Locked
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-700 tracking-tight">
              {formatMinorToNaira(activeBooking.totalAmountMinor)}
            </div>
          </div>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
            <span>Milestone Progress (Stage 3 of 4)</span>
            <span className="text-[#0C513F]">{activeBooking.progressPercentage}% Complete</span>
          </div>

          {/* Progress Bar - Thin & sleek */}
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#0C513F] transition-all duration-500"
              style={{ width: `${activeBooking.progressPercentage}%` }}
            />
          </div>

          {/* Individual Milestones List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {activeBooking.milestones.map((m, idx) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                  m.status === 'completed'
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                    : m.status === 'current'
                    ? 'bg-amber-50/80 border-amber-300 text-amber-950 ring-2 ring-amber-400/20'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] ${
                      m.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : m.status === 'current'
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="font-semibold truncate">{m.title}</span>
                </div>
                <div className="font-black shrink-0 text-right">
                  {formatMinorToNaira(m.amountMinor)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Inspection scheduled for distribution board wiring.</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#0C513F] px-4 py-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <span>View Milestone Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 text-xs font-extrabold shadow-sm hover:scale-102 active:scale-98 transition-all"
            >
              <span>{roleMode === 'client' ? 'Inspect & Approve Milestone 3' : 'Submit Milestone Evidence'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Two-Column Section: Collabo Squads Snapshot + Live Marketplace Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Collabo Squads Highlight */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 tracking-wider">
                Signature Feature
              </span>
              <h3 className="text-lg font-black text-[#0A1020] tracking-tight mt-1">
                Collabo Squads
              </h3>
            </div>
            <Link
              href="/dashboard/squads"
              className="text-xs font-bold text-[#0C513F] hover:underline flex items-center gap-1"
            >
              <span>Explore Squads</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {DASHBOARD_SQUADS.map((squad) => (
              <div
                key={squad.id}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      <Image
                        src={squad.leadProviderAvatar}
                        alt={squad.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm text-[#0A1020]">
                        {squad.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Lead: {squad.leadProviderName} • {squad.rating} ★ ({squad.completedJobsCount} jobs)
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-[#0C513F]">
                    Verified
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {squad.roles.map((r, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                    >
                      {r.roleTitle} ({r.splitPercentage}%)
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Job Postings from Market */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 tracking-wider">
                Live Trade Briefs
              </span>
              <h3 className="text-lg font-black text-[#0A1020] tracking-tight mt-1">
                Marketplace Feed
              </h3>
            </div>
            <Link
              href="/dashboard/jobs"
              className="text-xs font-bold text-[#0C513F] hover:underline flex items-center gap-1"
            >
              <span>View All Briefs</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {DASHBOARD_MARKETPLACE_JOBS.slice(0, 2).map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {job.category}
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm text-[#0A1020] mt-1 line-clamp-1">
                      {job.title}
                    </h4>
                  </div>
                  <span className="text-xs font-black text-emerald-700 whitespace-nowrap shrink-0">
                    {formatMinorToNaira(job.budgetMaxMinor)}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 font-medium line-clamp-2">
                  {job.description}
                </p>

                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-medium border-t border-slate-100">
                  <span>{job.city}, Nigeria • {job.postedTimeAgo}</span>
                  <span className="font-bold text-[#0C513F]">{job.proposalsCount} proposals</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
