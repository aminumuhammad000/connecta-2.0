'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  Lock,
  PlusCircle,
  FileCheck,
} from 'lucide-react'
import {
  DASHBOARD_BOOKINGS,
  formatMinorToNaira,
  DashboardBooking,
} from '@/lib/dashboard/data'

export default function DashboardProjectsPage() {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all')
  const [bookings, setBookings] = useState<DashboardBooking[]>(DASHBOARD_BOOKINGS)
  const [releasedNotice, setReleasedNotice] = useState<string | null>(null)

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true
    return b.bookingStatus === filter
  })

  const handleReleaseNextMilestone = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b
        const updatedMilestones = b.milestones.map((m) => {
          if (m.status === 'current') return { ...m, status: 'completed' as const }
          if (m.status === 'pending') return { ...m, status: 'current' as const }
          return m
        })
        const allDone = updatedMilestones.every((m) => m.status === 'completed')
        return {
          ...b,
          progressPercentage: allDone ? 100 : Math.min(100, b.progressPercentage + 25),
          bookingStatus: allDone ? 'completed' : b.bookingStatus,
          milestones: updatedMilestones,
        }
      })
    )
    setReleasedNotice('Milestone inspection approved! ₦35,000 released from Escrow Vault to specialist.')
    setTimeout(() => setReleasedNotice(null), 4000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1A73E8] tracking-wider">
            Contracts &amp; Milestone Escrow
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight mt-1">
            Projects &amp; Work Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Monitor active work orders, itemized artisan proposals, and release milestone disbursements.
          </p>
        </div>

        <Link
          href="/requests/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#0C513F] hover:bg-[#083b2e] text-white px-5 py-2.5 text-xs font-extrabold shadow-sm hover:scale-102 active:scale-98 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Project</span>
        </Link>
      </div>

      {/* Release Feedback Toast */}
      {releasedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{releasedNotice}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {(['all', 'in_progress', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
              filter === tab
                ? 'bg-[#0A1020] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab === 'all'
              ? 'All Contracts'
              : tab === 'in_progress'
              ? 'In Progress (1)'
              : 'Completed (1)'}
          </button>
        ))}
      </div>

      {/* Contracts List */}
      <div className="space-y-6">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-6"
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    #{b.bookingNumber}
                  </span>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      b.bookingStatus === 'in_progress'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    {b.bookingStatus === 'in_progress' ? 'In Progress' : 'Completed & Verified'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {b.location}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-[#0A1020]">
                  {b.title}
                </h3>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Total Contract Value
                </div>
                <div className="text-2xl font-black text-emerald-700 tracking-tight">
                  {formatMinorToNaira(b.totalAmountMinor)}
                </div>
              </div>
            </div>

            {/* People & Roles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                  <Image
                    src={b.providerAvatar || '/images/services/nigerian_electrician_ibrahim.jpg'}
                    alt={b.providerName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Contractor</div>
                  <div className="font-extrabold text-[#0A1020] text-sm">{b.providerName}</div>
                  <div className="text-slate-500">{b.providerTitle}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                  <Image
                    src={b.clientAvatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'}
                    alt={b.clientName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Hiring Client</div>
                  <div className="font-extrabold text-[#0A1020] text-sm">{b.clientName}</div>
                  <div className="text-slate-500">{b.clientCompany || 'Verified Client'}</div>
                </div>
              </div>
            </div>

            {/* Milestone List & Action Bar */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
                <span>Contract Milestones</span>
                <span className="text-emerald-700">{b.progressPercentage}% Completed</span>
              </div>

              {/* Thin Sleek Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#0C513F] transition-all duration-500"
                  style={{ width: `${b.progressPercentage}%` }}
                />
              </div>

              <div className="space-y-2">
                {b.milestones.map((m, idx) => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                      m.status === 'completed'
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                        : m.status === 'current'
                        ? 'bg-amber-50/80 border-amber-300 text-amber-950 ring-2 ring-amber-400/20'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          m.status === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : m.status === 'current'
                            ? 'bg-amber-500 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {m.status === 'completed' ? '✓' : idx + 1}
                      </div>
                      <span className="font-semibold">{m.title}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-right">
                        {formatMinorToNaira(m.amountMinor)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.status === 'completed'
                            ? 'bg-emerald-200/80 text-emerald-900'
                            : m.status === 'current'
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {m.status === 'completed' ? 'Released' : m.status === 'current' ? 'Under Review' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
              <div className="text-xs text-slate-400 font-medium">
                Appointment Date: {b.appointmentDate}
              </div>

              <div className="flex items-center gap-3">
                {b.bookingStatus === 'in_progress' && (
                  <button
                    type="button"
                    onClick={() => handleReleaseNextMilestone(b.id)}
                    className="inline-flex items-center gap-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 text-xs font-extrabold shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Approve &amp; Release Next Milestone</span>
                  </button>
                )}
                <Link
                  href="/dashboard/support"
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Report an Issue
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
