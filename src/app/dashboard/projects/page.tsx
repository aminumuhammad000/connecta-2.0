'use client'

import React, { useState, useEffect } from 'react'
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
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { formatMinorToNaira, DashboardBooking } from '@/lib/dashboard/data'

export default function DashboardProjectsPage() {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all')
  const [bookings, setBookings] = useState<DashboardBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [releasingId, setReleasingId] = useState<string | null>(null)
  const [releasedNotice, setReleasedNotice] = useState<string | null>(null)

  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/dashboard/projects?status=${filter}`)
      if (res.ok) {
        const body = await res.json()
        setBookings(body.data || [])
      }
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [filter])

  const handleReleaseNextMilestone = async (bookingId: string, milestoneId?: string) => {
    setReleasingId(bookingId)
    try {
      const targetBooking = bookings.find((b) => b.id === bookingId)
      const currentMilestone = milestoneId
        ? targetBooking?.milestones.find((m) => m.id === milestoneId)
        : targetBooking?.milestones.find((m) => m.status === 'current')

      if (!currentMilestone) return

      const res = await fetch(`/api/dashboard/projects/${bookingId}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: currentMilestone.id }),
      })

      if (res.ok) {
        setReleasedNotice(`Milestone inspection approved! ${formatMinorToNaira(currentMilestone.amountMinor)} released from Escrow Vault to specialist.`)
        await fetchProjects()
        setTimeout(() => setReleasedNotice(null), 4000)
      }
    } catch (err) {
      console.error('Failed to release milestone:', err)
    } finally {
      setReleasingId(null)
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true
    return b.bookingStatus === filter
  })

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
            {tab === 'all' ? 'All Contracts' : tab === 'in_progress' ? 'In Progress' : 'Completed'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-7 h-7 text-[#0C513F] animate-spin" />
          <span className="text-xs font-bold text-slate-500">Loading contracts from server...</span>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const nextMilestone = booking.milestones?.find((m) => m.status === 'current')

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5"
              >
                {/* Top Meta Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                        {booking.bookingNumber}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1A73E8]">
                        {booking.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">•</span>
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {booking.location}
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-[#0A1020] tracking-tight">
                      {booking.title}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Escrow Vault Amount
                    </span>
                    <span className="text-xl font-black text-[#0C513F]">
                      {formatMinorToNaira(booking.totalAmountMinor)}
                    </span>
                  </div>
                </div>

                {/* Parties (Client & Provider) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="w-8 h-8 rounded-full bg-[#0A1020] text-white font-black text-xs flex items-center justify-center shrink-0">
                      {booking.clientName?.slice(0, 2).toUpperCase() || 'CL'}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Hiring Client</span>
                      <span className="font-extrabold text-slate-900 truncate block">{booking.clientName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {booking.providerName?.slice(0, 2).toUpperCase() || 'SP'}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Assigned Contractor</span>
                      <span className="font-extrabold text-slate-900 truncate block">{booking.providerName}</span>
                    </div>
                  </div>
                </div>

                {/* Milestones Breakdown */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Deliverable Milestones</span>
                    <span className="text-[#0C513F] font-black">{booking.progressPercentage}% Completed</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#0C513F] transition-all duration-500"
                      style={{ width: `${booking.progressPercentage}%` }}
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    {booking.milestones?.map((m: any, idx: number) => (
                      <div
                        key={m.id || idx}
                        className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                          m.status === 'completed'
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                            : m.status === 'current'
                            ? 'bg-amber-50/70 border-amber-300 text-amber-950 ring-2 ring-amber-400/20'
                            : 'bg-slate-50 border-slate-200 text-slate-500'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] ${
                              m.status === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : m.status === 'current'
                                ? 'bg-amber-500 text-white animate-pulse'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {m.status === 'completed' ? '✓' : idx + 1}
                          </div>
                          <span className="font-semibold truncate">{m.title}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-black">{formatMinorToNaira(m.amountMinor)}</span>
                          {m.status === 'current' && (
                            <button
                              type="button"
                              onClick={() => handleReleaseNextMilestone(booking.id, m.id)}
                              disabled={releasingId === booking.id}
                              className="px-3 py-1 rounded-full bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-[11px] shadow-xs active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                            >
                              {releasingId === booking.id ? 'Releasing...' : 'Approve & Release'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Card Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Target Completion: {booking.appointmentDate}</span>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Escrow Verified</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-base font-black text-[#0A1020]">No Projects Found</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              You do not have any active or completed milestone contracts under this filter yet.
            </p>
          </div>
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#0C513F] text-white px-5 py-2.5 text-xs font-extrabold hover:bg-[#083b2e] shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Project Brief</span>
          </Link>
        </div>
      )}
    </div>
  )
}
