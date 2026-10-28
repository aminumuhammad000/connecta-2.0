'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Check,
  MapPin,
  PlusCircle,
  Loader2,
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
        setReleasedNotice(`Milestone inspection approved. ${formatMinorToNaira(currentMilestone.amountMinor)} released from Escrow Vault.`)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Projects &amp; Contracts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-normal">
            Track active milestone contracts, review deliverables, and approve escrow releases.
          </p>
        </div>

        <Link
          href="/requests/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white px-4 py-2.5 text-xs font-semibold shadow-xs transition-all active:scale-98 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Release Notice */}
      {releasedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{releasedNotice}</span>
        </div>
      )}

      {/* Minimal Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-3">
        {(['all', 'in_progress', 'completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filter === tab
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            {tab === 'all' ? 'All Contracts' : tab === 'in_progress' ? 'In Progress' : 'Completed'}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-[#0C513F] animate-spin" />
          <span className="text-xs font-medium text-zinc-400">Loading contracts...</span>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-xs space-y-4"
              >
                {/* Top Meta Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                        #{booking.bookingNumber}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                        {booking.category}
                      </span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        {booking.location}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                      {booking.title}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[11px] font-normal text-zinc-400 block">
                      Escrow Vault Amount
                    </span>
                    <span className="text-lg font-bold text-zinc-900">
                      {formatMinorToNaira(booking.totalAmountMinor)}
                    </span>
                  </div>
                </div>

                {/* Parties */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {booking.clientName?.slice(0, 2).toUpperCase() || 'CL'}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-zinc-400 font-medium block">Client</span>
                      <span className="font-semibold text-zinc-900 truncate block">{booking.clientName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                    <div className="w-7 h-7 rounded-lg bg-[#0C513F] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {booking.providerName?.slice(0, 2).toUpperCase() || 'SP'}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-zinc-400 font-medium block">Assigned Artisan</span>
                      <span className="font-semibold text-zinc-900 truncate block">{booking.providerName}</span>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-zinc-600">Milestone Deliverables</span>
                    <span className="text-[#0C513F] font-semibold">{booking.progressPercentage}% Completed</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#0C513F] transition-all duration-500"
                      style={{ width: `${booking.progressPercentage}%` }}
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {booking.milestones?.map((m: any, idx: number) => (
                      <div
                        key={m.id || idx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                          m.status === 'completed'
                            ? 'bg-emerald-50/40 border-emerald-200/60 text-zinc-900'
                            : m.status === 'current'
                            ? 'bg-zinc-50 border-zinc-300 text-zinc-900'
                            : 'bg-white border-zinc-200/60 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                              m.status === 'completed'
                                ? 'bg-emerald-600 text-white'
                                : m.status === 'current'
                                ? 'bg-[#0C513F] text-white'
                                : 'bg-zinc-100 text-zinc-400'
                            }`}
                          >
                            {m.status === 'completed' ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : idx + 1}
                          </div>
                          <span className="font-medium truncate">{m.title}</span>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-semibold">{formatMinorToNaira(m.amountMinor)}</span>
                          {m.status === 'current' && (
                            <button
                              type="button"
                              onClick={() => handleReleaseNextMilestone(booking.id, m.id)}
                              disabled={releasingId === booking.id}
                              className="px-2.5 py-1 rounded-lg bg-[#0C513F] hover:bg-[#083b2e] text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-60"
                            >
                              {releasingId === booking.id ? 'Releasing...' : 'Approve & Release'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                  <span>Target Date: {booking.appointmentDate}</span>
                  <div className="flex items-center gap-1 text-[#0C513F] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Protected in Escrow</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-2xl p-8 sm:p-10 text-center border border-zinc-200/80 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-400 flex items-center justify-center mx-auto">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-semibold text-zinc-900">No Projects Found</h3>
            <p className="text-xs text-zinc-500 font-normal leading-relaxed">
              You do not have any active or completed milestone contracts under this filter.
            </p>
          </div>
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0C513F] text-white px-4 py-2 text-xs font-semibold hover:bg-[#083b2e] shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post a Request</span>
          </Link>
        </div>
      )}
    </div>
  )
}
