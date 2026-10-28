'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  MessageSquare,
  CornerDownRight,
  ExternalLink,
  Mail,
  Phone,
  FileCheck,
  AlertCircle,
  Plus,
  Loader2,
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
        setNotice('Arbitration inquiry submitted to Connecta Escrow Mediation Desk!')
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
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0C513F] tracking-wider">
            Charter Rules &amp; Dispute Protection
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight mt-1">
            Support &amp; Escrow Charter FAQs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Understand milestone release conditions, escrow safeguards, and arbitration rules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white px-5 py-2.5 text-xs font-extrabold shadow-sm hover:scale-102 active:scale-98 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Open Arbitration Inquiry</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Active Disputes & Mediation Status Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#0A1020]">
              Active Arbitration &amp; Dispute Tickets
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time audit trail of formal claims safeguarded by Connecta Escrow Desk.
            </p>
          </div>
        </div>

        {isLoadingDisputes ? (
          <div className="py-6 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-[#0C513F] animate-spin" />
            <span className="text-xs text-slate-500">Checking dispute ledger...</span>
          </div>
        ) : disputes.length > 0 ? (
          <div className="space-y-3">
            {disputes.map((d) => (
              <div
                key={d.id}
                className="p-4 rounded-2xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="font-extrabold text-[#0A1020]">
                    {d.disputeNumber} • {d.bookingTitle}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                    {d.status}
                  </span>
                </div>
                <p className="text-slate-600 font-medium">{d.reason}</p>
                <div className="text-[10px] text-slate-400">
                  Filed: {d.filedDate} • Status: {d.lastUpdate}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0C513F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-xs text-[#0C513F]">All Clear — Zero Active Disputes</div>
              <div className="text-[11px] text-emerald-800/80 font-medium">
                Your escrow milestone payments and trade interactions are in complete compliance.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Outer Card matching faqs from Landing Page */}
      <div className="border-2 border-[#0A1020] rounded-3xl p-6 sm:p-8 lg:p-12 bg-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column: FAQs List */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl sm:text-5xl font-black text-[#0A2614] tracking-tight">
                FAQs.
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                Select a topic below to review our verified protocols and safety guidelines.
              </p>
            </div>

            <div className="space-y-3" role="tablist">
              {DASHBOARD_FAQS.map((faq, index) => {
                const isActive = openFaq === index
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setOpenFaq(index)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 flex items-center justify-between gap-4 cursor-pointer ${
                      isActive
                        ? 'bg-[#0C513F] text-white border-[#0C513F] shadow-lg scale-[1.01]'
                        : 'bg-slate-50/80 hover:bg-slate-100 text-slate-800 border-slate-200/80'
                    }`}
                  >
                    <div className="space-y-1">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-100/80 text-[#0C513F]'
                        }`}
                      >
                        {faq.tag}
                      </span>
                      <h3
                        className={`text-xs sm:text-sm font-bold leading-snug ${
                          isActive ? 'text-white' : 'text-[#0A1020]'
                        }`}
                      >
                        {faq.q}
                      </h3>
                    </div>

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        isActive
                          ? 'bg-white/20 text-white rotate-90'
                          : 'bg-white text-slate-400 border border-slate-200'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Column: Prominent Expanded Detail Card */}
          <div className="bg-[#F5F7FC] border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-3 py-1 rounded-full bg-[#10B981] text-white shadow-xs">
                {currentFaq.tag}
              </span>
              <span className="text-xs text-slate-400 font-bold">•</span>
              <span className="text-xs font-bold text-slate-500">Official Charter Policy</span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-black text-[#0A1020] leading-snug">
                {currentFaq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {currentFaq.a}
              </p>
            </div>

            {/* Support Actions Box */}
            <div className="pt-6 border-t border-slate-200/80 space-y-3">
              <div className="text-xs font-extrabold text-[#0A1020]">
                Need dedicated trade arbitration or dispute mediation?
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Our Nigerian mediation specialists operate 7 days a week to review job photographic logs and inspection certificates.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="mailto:support@myconnecta.ng"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>support@myconnecta.ng</span>
                </a>
                <a
                  href="tel:+2348123456789"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+234 812 345 6789</span>
                </a>
                <a
                  href="https://wa.me/2348123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3 text-[11px] font-bold text-slate-500">
                <Link href="/terms" className="hover:text-slate-800 hover:underline">
                  Terms of Service
                </Link>
                <span>•</span>
                <Link href="/privacy" className="hover:text-slate-800 hover:underline">
                  Privacy Policy
                </Link>
                <span>•</span>
                <span className="text-emerald-700">Hours: Mon – Sat 8AM – 8PM WAT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0A1020]">Submit Arbitration Inquiry</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitDispute} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Project Title / Booking Reference</label>
                <input
                  type="text"
                  placeholder="e.g. Solar Inverter Installation or #CN-782419"
                  value={disputeTitle}
                  onChange={(e) => setDisputeTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-[#4D78FF]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Reason / Nature of Mediation</label>
                <textarea
                  rows={4}
                  placeholder="Describe the discrepancy, inspection fault, or delay..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#4D78FF]"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#0A1020] hover:bg-[#4D78FF] text-white font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-60"
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
