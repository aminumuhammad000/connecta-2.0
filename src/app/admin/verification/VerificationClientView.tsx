'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Eye,
  Search,
  X,
} from 'lucide-react'

export interface CaseItem {
  id: string
  providerName: string
  trade: string
  city: string
  status: 'under_review' | 'approved' | 'rejected'
  submittedAt: string
  documentType: string
  rejectionReason?: string
}

const INITIAL_CASES: CaseItem[] = [
  {
    id: 'vc-101',
    providerName: 'Ibrahim Aliyu',
    trade: 'Electrical & Inverter Specialist',
    city: 'Kano (Nassarawa GRA)',
    status: 'under_review',
    submittedAt: '2026-10-24 14:30',
    documentType: 'National Identification Number (NIN) Slip',
  },
  {
    id: 'vc-102',
    providerName: 'Sani Garba & Sons',
    trade: 'Auto Mechanics & Diagnostics',
    city: 'Kano (Bompai Industrial)',
    status: 'under_review',
    submittedAt: '2026-10-24 16:15',
    documentType: 'CAC Certificate of Business Registration',
  },
  {
    id: 'vc-103',
    providerName: 'Balarabe Carpentry Works',
    trade: 'Master Carpenter & Furniture',
    city: 'Kano (Sabon Gari)',
    status: 'approved',
    submittedAt: '2026-10-23 11:20',
    documentType: 'Voter Identification Card',
  },
]

export default function VerificationClientView() {
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES)
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const normalizedSearch = searchQuery.trim().toLowerCase()
  const filteredCases = normalizedSearch
    ? cases.filter((caseItem) =>
        [
          caseItem.id,
          caseItem.providerName,
          caseItem.trade,
          caseItem.city,
          caseItem.documentType,
        ].some((value) => value.toLowerCase().includes(normalizedSearch))
      )
    : cases

  const handleApprove = (id: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'approved' } : c))
    )
    setSelectedCase(null)
  }

  const handleReject = (id: string) => {
    if (!rejectionReason.trim()) return
    setCases((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'rejected', rejectionReason } : c
      )
    )
    setSelectedCase(null)
    setRejectionReason('')
  }

  return (
    <div className="min-h-screen bg-[#F5F7FC] flex flex-col font-sans relative">
      {/* Halftone Dot Matrix Pattern */}
      <div
        className="fixed inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#0A2614 2px, transparent 2px)',
          backgroundSize: '24px 24px',
        }}
      />

      <header className="border-b border-slate-800 bg-[#0A1020] text-white py-4 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="relative w-32 h-8 block">
              <Image
                src="/brand/svg/connecta-logo-white.svg"
                alt="Connecta Logo"
                fill
                className="object-contain"
              />
            </Link>
            <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-400 font-mono">
              Admin Verification Queue
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/admin"
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition"
            >
              Back to Command Center
            </Link>
            <div className="w-8 h-8 rounded-full bg-[#0C513F] flex items-center justify-center font-bold text-white text-xs">
              AD
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto w-full px-6 py-8 flex-1">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#10B981]" />
              <span>Provider ID & Guild Credential Verification</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Review government IDs, CAC registrations, and trade certificates before granting the Kano Verified Artisan badge.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search provider name or ID..."
                aria-label="Search verification cases"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-9 pr-9 py-2 rounded-xl bg-white border border-slate-200 text-xs w-full focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Case List */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Provider / Business</th>
                  <th className="py-3 px-4">Trade Specialization</th>
                  <th className="py-3 px-4">Document Type</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {c.providerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{c.trade}</td>
                    <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{c.documentType}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{c.city}</td>
                    <td className="py-3.5 px-4">
                      {c.status === 'under_review' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                          <Clock className="w-3 h-3" /> Under Review
                        </span>
                      )}
                      {c.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Approved
                        </span>
                      )}
                      {c.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {c.submittedAt}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCase(c)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold inline-flex items-center gap-1 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredCases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <p className="text-sm font-semibold text-slate-700">No matching verification cases</p>
                      <p className="mt-1 text-xs text-slate-500">Try another name, ID, trade, location, or document.</p>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                      >
                        Clear search
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Inspection */}
        {selectedCase && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-slate-200 shadow-2xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">
                    Document Verification Inspection
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-500 block">Applicant</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedCase.providerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Trade</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedCase.trade}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Document Type</span>
                    <span className="font-bold text-emerald-800">
                      {selectedCase.documentType}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Current Status</span>
                    <span className="font-bold uppercase tracking-wider text-[11px]">
                      {selectedCase.status}
                    </span>
                  </div>
                </div>

                <div className="border border-dashed border-slate-200 rounded-2xl p-6 text-center bg-slate-50/50">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">
                    Document Attachment Preview
                  </p>
                  <p className="text-[11px] text-slate-500">
                    High-resolution scan submitted via provider onboarding portal.
                  </p>
                  <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    NIN Slip Verified with NIMC Gateway
                  </div>
                </div>
              </div>

              {selectedCase.status === 'under_review' && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Reason for Rejection (required only if rejecting)
                    </label>
                    <textarea
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="e.g. Image blurry or document expired. Please re-upload a clear government-issued ID."
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => handleReject(selectedCase.id)}
                      disabled={!rejectionReason.trim()}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>
                    <button
                      onClick={() => handleApprove(selectedCase.id)}
                      className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#0ea572] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Grant Badge</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
