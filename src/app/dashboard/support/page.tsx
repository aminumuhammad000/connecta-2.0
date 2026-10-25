'use client'

import React, { useState } from 'react'
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
} from 'lucide-react'
import { DASHBOARD_FAQS } from '@/lib/dashboard/data'

export default function DashboardSupportPage() {
  const [openFaq, setOpenFaq] = useState(0)
  const currentFaq = DASHBOARD_FAQS[openFaq]

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div>
        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0C513F] tracking-wider">
          Charter Rules &amp; Dispute Protection
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight mt-1">
          Support &amp; Escrow Charter FAQs
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Understand milestone release conditions, Collabo Squad split mechanisms, and arbitration rules.
        </p>
      </div>

      {/* Outer Card matching faqs.png from Landing Page */}
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
                  href="tel:+23480026663282"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+234 800 CONNECTA</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
