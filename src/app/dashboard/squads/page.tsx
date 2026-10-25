'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Users,
  ShieldCheck,
  Star,
  CheckCircle2,
  PlusCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  Plus,
} from 'lucide-react'
import { DASHBOARD_SQUADS, DashboardSquad } from '@/lib/dashboard/data'

export default function DashboardSquadsPage() {
  const [squads, setSquads] = useState<DashboardSquad[]>(DASHBOARD_SQUADS)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newSquadName, setNewSquadName] = useState('')
  const [newSquadHeadline, setNewSquadHeadline] = useState('')
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSquadName.trim()) return

    const newSquad: DashboardSquad = {
      id: `sq-${Date.now()}`,
      name: newSquadName,
      slug: newSquadName.toLowerCase().replace(/\s+/g, '-'),
      headline: newSquadHeadline || 'Multi-Trade Collaborative Team',
      description: 'Collaborative team delivering comprehensive solutions across essential infrastructure and digital services.',
      leadProviderName: 'Ibrahim Aliyu',
      leadProviderAvatar: '/images/services/nigerian_electrician_ibrahim.jpg',
      rating: 5.0,
      completedJobsCount: 0,
      bannerGradient: 'from-[#0C513F] via-[#10B981] to-[#0A2614]',
      roles: [
        { roleTitle: 'Squad Lead', providerName: 'Ibrahim Aliyu', splitPercentage: 50, isLead: true },
        { roleTitle: 'Collaborating Partner', providerName: 'Open Partner Slot', splitPercentage: 50, isLead: false },
      ],
    }

    setSquads([newSquad, ...squads])
    setIsCreateModalOpen(false)
    setNewSquadName('')
    setNewSquadHeadline('')
    setSuccessToast(`Collabo Squad "${newSquad.name}" initialized! You can now invite partners and set split formulas.`)
    setTimeout(() => setSuccessToast(null), 4000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 tracking-wider">
            Automated Payment Split Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight mt-1">
            Collabo Squads Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Form cross-disciplinary teams, combine complementary trades, and take on high-ticket enterprise contracts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white px-5 py-2.5 text-xs font-extrabold shadow-sm hover:scale-102 active:scale-98 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Form New Squad</span>
        </button>
      </div>

      {/* Toast Notice */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Squad Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {squads.map((sq) => (
          <div
            key={sq.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Squad Header Bar */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                    <Image
                      src={sq.leadProviderAvatar}
                      alt={sq.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-black text-base sm:text-lg text-[#0A1020] leading-snug">
                      {sq.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <span>Lead: {sq.leadProviderName}</span>
                      <span>•</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {sq.rating} ({sq.completedJobsCount} jobs)
                      </span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-[#0C513F] shrink-0">
                  Active Squad
                </span>
              </div>

              <div className="text-xs font-bold text-[#0C513F] bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100/80">
                {sq.headline}
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {sq.description}
              </p>

              {/* Automated Splits Table */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Squad Roles</span>
                  <span>Automated Escrow Split</span>
                </div>

                <div className="space-y-1.5">
                  {sq.roles.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        <span className="font-extrabold text-[#0A1020]">{r.roleTitle}</span>
                        <span className="text-[11px] text-slate-400">({r.providerName})</span>
                      </div>
                      <span className="font-black text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                        {r.splitPercentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400 font-medium">
                Milestone releases split automatically
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0C513F] hover:underline"
              >
                <span>Manage Squad Roles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Squad Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            <div>
              <h3 className="text-xl font-black text-[#0A1020]">Form a Collabo Squad</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Combine trade, engineering, and digital skills into a single high-impact team profile.
              </p>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Squad Name</label>
                <input
                  type="text"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0C513F]"
                  placeholder="e.g. Lagos Commercial Solar & MEP Group"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Squad Headline &amp; Specialization</label>
                <input
                  type="text"
                  value={newSquadHeadline}
                  onChange={(e) => setNewSquadHeadline(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0C513F]"
                  placeholder="e.g. End-to-end solar inverters, plumbing piping & diagnostic monitoring"
                />
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 text-[11px] text-amber-900 font-medium space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-amber-600" />
                  <span>Fair Split Guarantee</span>
                </div>
                <p>
                  Connecta automatically deposits agreed percentages directly into each member’s wallet upon client milestone release.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#0A1020] text-white hover:bg-[#10B981] shadow-md cursor-pointer"
                >
                  Create Squad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
