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
  AlertTriangle,
} from 'lucide-react'

interface CaseItem {
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

export default function AdminVerificationDashboard() {
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES)
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

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
            <Link
              href="/admin"
              className="text-xs bg-[#10B981]/20 text-[#10B981] font-extrabold px-3 py-1 rounded-full border border-[#10B981]/30 hover:bg-[#10B981]/30 transition-all inline-flex items-center gap-1.5"
            >
              <span>← Command Center</span>
            </Link>
          </div>
          <div className="text-xs text-slate-300">
            Role: <span className="font-bold text-white">Verification Officer (Kano Hub)</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Provider Verification Applications
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review submitted government identification and credentials before granting marketplace discoverability.
          </p>
        </div>

        {/* Verification Cases Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {cases.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {item.providerName}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        item.status === 'approved'
                          ? 'bg-emerald-50 text-[#10B981]'
                          : item.status === 'rejected'
                          ? 'bg-red-50 text-red-600'
                          : 'bg-amber-50 text-[#F59E0B]'
                      }`}
                    >
                      {item.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Trade: <span className="font-medium text-slate-800">{item.trade}</span> · {item.city}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{item.documentType}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>Submitted {item.submittedAt}</span>
                  </div>
                  {item.rejectionReason && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg mt-1">
                      Reason: {item.rejectionReason}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => setSelectedCase(item)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review Case</span>
                  </button>
                  {item.status === 'under_review' && (
                    <>
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#10B981] text-xs font-semibold text-white hover:bg-[#0ea572] flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for reviewing a specific case */}
        {selectedCase && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Review Verification Case
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedCase.providerName} · {selectedCase.trade}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
                >
                  ✕
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div><strong>Document:</strong> {selectedCase.documentType}</div>
                <div><strong>Location:</strong> {selectedCase.city}</div>
                <div><strong>Status:</strong> {selectedCase.status}</div>
                <div className="pt-2 text-[11px] text-slate-500">
                  Document ID: <code>doc_secure_storage_{selectedCase.id}.pdf</code> (Restricted private access)
                </div>
              </div>

              {selectedCase.status === 'under_review' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Rejection Reason (Required if rejecting)
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
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>
                    <button
                      onClick={() => handleApprove(selectedCase.id)}
                      className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#0ea572] text-white text-xs font-semibold flex items-center gap-1.5"
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
