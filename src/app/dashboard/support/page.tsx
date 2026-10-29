'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Mail,
  Phone,
  FileCheck,
  AlertCircle,
  Plus,
  Loader2,
  X,
} from 'lucide-react'
import { DASHBOARD_FAQS } from '@/lib/dashboard/data'

interface ServerDisputeItem {
  id: string
  disputeNumber: string
  bookingTitle: string
  amountMinor: number
  reason: string
  status: string
  filedDate: string
  lastUpdate: string
  notes: string
}

export default function DashboardSupportPage() {
  const [openFaq, setOpenFaq] = useState(0)
  const [disputes, setDisputes] = useState<ServerDisputeItem[]>([])
  const [isLoadingDisputes, setIsLoadingDisputes] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [disputeTitle, setDisputeTitle] = useState('')
  const [disputeReason, setDisputeReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const currentFaq = DASHBOARD_FAQS[openFaq]

  const fetchDisputes = async () => {
    try {
      const res = await fetch('/api/dashboard/support')
      if (res.ok) {
        const body = await res.json()
        setDisputes(body.data || [])
      }
    } catch (err) {
      console.error('Failed to load disputes:', err)
    } finally {
      setIsLoadingDisputes(false)
    }
  }

  useEffect(() => {
    fetchDisputes()
  }, [])

  const handleSubmitDispute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!disputeTitle.trim() || !disputeReason.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/dashboard/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingTitle: disputeTitle.trim(),
          reason: disputeReason.trim(),
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        setDisputeTitle('')
        setDisputeReason('')
        setNotice('Arbitration inquiry submitted to Connecta Mediation Desk.')
        await fetchDisputes()
        setTimeout(() => setNotice(null), 4000)
      }
    } catch (err) {
      console.error('Failed to submit dispute:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200/60">
        <div>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Platform Protection &amp; FAQs
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            Support &amp; Platform Charter
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-normal">
            Milestone release conditions, dispute resolution protocols, and arbitration rules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 text-xs font-medium transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Open Inquiry</span>
        </button>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Active Disputes & Mediation Status Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">
            Active Arbitration &amp; Dispute Tickets
          </h3>
          <p className="text-xs text-zinc-500 font-normal">
            Real-time audit trail of formal claims safeguarded by Connecta Mediation Desk.
          </p>
        </div>

        {isLoadingDisputes ? (
          <div className="py-6 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-[#0C513F] animate-spin" />
            <span className="text-xs text-zinc-500">Checking dispute ledger...</span>
          </div>
        ) : disputes.length > 0 ? (
          <div className="space-y-3">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-zinc-900">
                    {d.disputeNumber} • {d.bookingTitle}
                  </div>
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200/70">
                    {d.status}
                  </span>
                </div>
                <p className="text-zinc-600">{d.reason}</p>
                <div className="text-[11px] text-zinc-400">
                  Filed: {d.filedDate} • Status: {d.lastUpdate}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-xs text-zinc-900">All Clear — Zero Active Disputes</div>
              <div className="text-xs text-zinc-500 font-normal">
                Your milestone payments and trade interactions are in complete compliance.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Minimalist FAQs Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: FAQs List */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-zinc-500 font-normal mt-1">
                Select a topic below to review verified charter rules and safeguards.
              </p>
            </div>

            <div className="space-y-2" role="tablist">
              {DASHBOARD_FAQS.map((faq, index) => {
                const isActive = openFaq === index
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setOpenFaq(index)}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-colors flex items-center justify-between gap-4 cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                        : 'bg-zinc-50/70 hover:bg-zinc-100 text-zinc-800 border-zinc-200/70'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                          isActive
                            ? 'bg-white/15 text-white'
                            : 'bg-zinc-200/70 text-zinc-700'
                        }`}
                      >
                        {faq.tag}
                      </span>
                      <h3
                        className={`text-xs font-semibold leading-snug truncate ${
                          isActive ? 'text-white' : 'text-zinc-900'
                        }`}
                      >
                        {faq.q}
                      </h3>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? 'text-white translate-x-0.5' : 'text-zinc-400'
                      }`}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column: Detail Panel */}
          <div className="bg-zinc-50/70 border border-zinc-200/80 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-[#0C513F] text-white">
                {currentFaq.tag}
              </span>
              <span className="text-xs text-zinc-300 font-bold">•</span>
              <span className="text-xs font-medium text-zinc-500">Official Charter Policy</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-semibold text-zinc-900 leading-snug">
                {currentFaq.q}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal">
                {currentFaq.a}
              </p>
            </div>

            {/* Support Actions Box */}
            <div className="pt-5 border-t border-zinc-200/70 space-y-3">
              <div className="text-xs font-semibold text-zinc-900">
                Need dedicated trade arbitration or dispute mediation?
              </div>
              <p className="text-xs text-zinc-500 font-normal">
                Our Nigerian mediation specialists operate 7 days a week to review job photographic logs and inspection certificates.
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <a
                  href="mailto:support@myconnecta.ng"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-[#0C513F] text-white text-xs font-medium transition-colors shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>support@myconnecta.ng</span>
                </a>
                <a
                  href="tel:+2348123456789"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 text-xs font-medium transition-colors shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+234 812 345 6789</span>
                </a>
                <a
                  href="https://wa.me/2348123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-medium transition-colors shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>

              <div className="pt-3 border-t border-zinc-200/60 flex items-center gap-3 text-[11px] font-medium text-zinc-500">
                <Link href="/terms" className="hover:text-zinc-900 hover:underline">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-zinc-900 hover:underline">
                  Privacy Policy
                </Link>
                <span>•</span>
                <span className="text-zinc-400">Hours: Mon – Sat 8AM – 8PM WAT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-zinc-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="text-base font-semibold text-zinc-900">Submit Arbitration Inquiry</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDispute} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Project Title / Booking Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Solar Inverter Installation or #CN-782419"
                  value={disputeTitle}
                  onChange={(e) => setDisputeTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 font-normal text-zinc-900 focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Reason / Nature of Mediation</label>
                <textarea
                  rows={4}
                  placeholder="Describe the discrepancy, inspection fault, or delay..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 font-normal text-zinc-900 focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-zinc-600 font-medium hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#0C513F] hover:bg-[#093e30] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Submitting...' : 'File Claim'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
