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
  X,
  FileText,
  Printer,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { formatMinorToNaira, DashboardBooking } from '@/lib/dashboard/data'

interface MilestoneItem {
  id: string
  title: string
  amountMinor: number
  status: 'completed' | 'current' | 'pending'
}

export default function DashboardProjectsPage() {
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all')
  const [bookings, setBookings] = useState<DashboardBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [releasingId, setReleasingId] = useState<string | null>(null)
  const [releasedNotice, setReleasedNotice] = useState<string | null>(null)

  // Confirmation & Receipt Modals
  const [confirmingMilestone, setConfirmingMilestone] = useState<{
    booking: DashboardBooking
    milestone: MilestoneItem
  } | null>(null)

  const [viewingReceipt, setViewingReceipt] = useState<{
    booking: DashboardBooking
    milestone: MilestoneItem
  } | null>(null)

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

  const handleExecuteRelease = async () => {
    if (!confirmingMilestone) return
    const { booking, milestone } = confirmingMilestone

    setReleasingId(booking.id)
    try {
      const res = await fetch(`/api/dashboard/projects/${booking.id}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: milestone.id }),
      })

      if (res.ok) {
        setReleasedNotice(
          `Milestone approved. ${formatMinorToNaira(milestone.amountMinor)} released from Vault to ${booking.providerName}.`
        )
        setConfirmingMilestone(null)
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
      <div className="pb-2 border-b border-zinc-200/60">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
          Milestone Agreements
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Projects &amp; Contracts
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-normal">
          Track active milestone contracts, review deliverables, and approve payment releases.
        </p>
      </div>

      {/* Release Notice */}
      {releasedNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
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
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
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
                className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4"
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
                      Protected Vault Amount
                    </span>
                    <span className="text-base sm:text-lg font-bold text-zinc-900">
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

                          {m.status === 'completed' && (
                            <button
                              type="button"
                              onClick={() => setViewingReceipt({ booking, milestone: m })}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-medium transition-colors cursor-pointer"
                              title="View Settlement Receipt"
                            >
                              <FileText className="w-3 h-3 text-zinc-500" />
                              <span>Receipt</span>
                            </button>
                          )}

                          {m.status === 'current' && (
                            <button
                              type="button"
                              onClick={() => setConfirmingMilestone({ booking, milestone: m })}
                              disabled={releasingId === booking.id}
                              className="px-2.5 py-1 rounded-lg bg-[#0C513F] hover:bg-[#083b2e] text-white font-medium text-xs transition-colors cursor-pointer disabled:opacity-60"
                            >
                              Approve &amp; Release
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
                    <span>Protected in Vault</span>
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
            href="/dashboard/jobs"
            className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 text-white px-4 py-2 text-xs font-medium hover:bg-zinc-800 transition-colors shadow-xs"
          >
            <span>Browse Professionals</span>
          </Link>
        </div>
      )}

      {/* Safeguard Release Confirmation Modal */}
      {confirmingMilestone && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200/80">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  Safeguard Authorization
                </span>
                <h3 className="text-base font-bold text-zinc-900 mt-1.5">
                  Authorize Milestone Release
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConfirmingMilestone(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 space-y-1">
                <div className="text-zinc-400 font-medium">Deliverable Item</div>
                <div className="font-semibold text-zinc-900">{confirmingMilestone.milestone.title}</div>
                <div className="text-sm font-bold text-[#0C513F] pt-0.5">
                  {formatMinorToNaira(confirmingMilestone.milestone.amountMinor)}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-semibold text-zinc-700">Pre-Release Inspection Checklist:</div>
                <div className="space-y-1.5 text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Specialist on-site deliverable verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Workmanship aligns with agreed contract scope</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Once confirmed, funds will be released immediately to <strong>{confirmingMilestone.booking.providerName}</strong>&apos;s available balance and cannot be reversed.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => setConfirmingMilestone(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteRelease}
                disabled={releasingId === confirmingMilestone.booking.id}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {releasingId === confirmingMilestone.booking.id ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Releasing...</span>
                  </>
                ) : (
                  <span>Confirm &amp; Release Funds</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimalist Printable Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-zinc-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0C513F] text-white font-bold text-xs flex items-center justify-center">
                  C
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Settlement Receipt</h3>
                  <p className="text-[11px] text-zinc-400">Connecta Official Audit Record</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs border border-zinc-200/80 rounded-xl p-4 bg-zinc-50/40">
              <div className="grid grid-cols-2 gap-3 pb-3 border-b border-zinc-200/60">
                <div>
                  <span className="text-[10px] text-zinc-400 font-medium block">Receipt Number</span>
                  <span className="font-semibold text-zinc-900">
                    CN-RCPT-{viewingReceipt.booking.bookingNumber}-{viewingReceipt.milestone.id.slice(0, 4).toUpperCase()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 font-medium block">Status</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Released &amp; Settled
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-zinc-400 font-medium block">Client</span>
                  <span className="font-semibold text-zinc-900">{viewingReceipt.booking.clientName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-400 font-medium block">Artisan Specialist</span>
                  <span className="font-semibold text-zinc-900">{viewingReceipt.booking.providerName}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-200/60 space-y-2">
                <div className="flex justify-between text-zinc-600">
                  <span>Deliverable:</span>
                  <span className="font-medium text-zinc-900">{viewingReceipt.milestone.title}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Gross Amount Disbursed:</span>
                  <span className="font-medium text-zinc-900">{formatMinorToNaira(viewingReceipt.milestone.amountMinor)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Connecta Platform Fee:</span>
                  <span className="font-medium text-zinc-900">₦0 (Covered by Client Tier)</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm text-zinc-900">
                  <span>Net Paid to Specialist:</span>
                  <span className="text-[#0C513F]">{formatMinorToNaira(viewingReceipt.milestone.amountMinor)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-zinc-400">Official Settlement Ledger • Lagos, Nigeria</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingReceipt(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
