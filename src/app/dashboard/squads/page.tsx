'use client'

import React, { useState, useEffect } from 'react'
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
  Loader2,
} from 'lucide-react'

interface ServerSquadItem {
  id: string
  name: string
  tradeSpecialty: string
  hubCity: string
  description: string
  memberCount: number
  rating: number
  completedProjects: number
  revenueMinor: number
  openSlots: number
  tags: string[]
  members?: string[]
}

export default function DashboardSquadsPage() {
  const [squads, setSquads] = useState<ServerSquadItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newSquadName, setNewSquadName] = useState('')
  const [newSquadSpecialty, setNewSquadSpecialty] = useState('Solar & Industrial Electrical')
  const [newSquadDescription, setNewSquadDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const fetchSquads = async () => {
    try {
      const res = await fetch('/api/dashboard/squads')
      if (res.ok) {
        const body = await res.json()
        setSquads(body.data || [])
      }
    } catch (err) {
      console.error('Failed to load squads:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSquads()
  }, [])

  const handleCreateSquad = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSquadName.trim()) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/dashboard/squads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSquadName.trim(),
          tradeSpecialty: newSquadSpecialty,
          description: newSquadDescription.trim(),
        }),
      })

      if (res.ok) {
        setIsCreateModalOpen(false)
        setNewSquadName('')
        setNewSquadDescription('')
        setSuccessToast(`Collabo Squad "${newSquadName}" initialized on server! You can now bid together.`)
        await fetchSquads()
        setTimeout(() => setSuccessToast(null), 4000)
      }
    } catch (err) {
      console.error('Squad creation error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleJoinSquad = async (squadId: string) => {
    try {
      const res = await fetch('/api/dashboard/squads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'join', squadId }),
      })
      if (res.ok) {
        setSuccessToast('Successfully joined squad guild!')
        await fetchSquads()
        setTimeout(() => setSuccessToast(null), 3000)
      }
    } catch (err) {
      console.error('Join squad error:', err)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 tracking-wider">
            Automated Escrow Split Architecture
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
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-7 h-7 text-[#0C513F] animate-spin" />
          <span className="text-xs font-bold text-slate-500">Loading squads from server...</span>
        </div>
      ) : squads.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {squads.map((sq) => (
            <div
              key={sq.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-[#0C513F] border border-emerald-200">
                      {sq.tradeSpecialty}
                    </span>
                    <h3 className="text-lg font-black text-[#0A1020] tracking-tight">
                      {sq.name}
                    </h3>
                    <div className="text-xs text-slate-500 font-medium">
                      Hub: <span className="font-bold text-slate-800">{sq.hubCity}</span> • {sq.memberCount} Verified Trades
                    </div>
                  </div>

                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 shrink-0">
                    {sq.openSlots} Open Slots
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {sq.description}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sq.tags?.map((t, i) => (
                    <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Escrow Split</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleJoinSquad(sq.id)}
                  className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  <span>Join Squad</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-base font-black text-[#0A1020]">No Active Collabo Squads Yet</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Form the first verified multi-trade squad in your city to pool capabilities and bid on major contracts together.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white px-5 py-2.5 text-xs font-extrabold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Form First Squad</span>
          </button>
        </div>
      )}

      {/* Create Squad Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-[#0A1020]">Form Collabo Trade Squad</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Squad Name</label>
                <input
                  type="text"
                  placeholder="e.g. Northern Microgrid & Solar Guild"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold focus:outline-none focus:border-[#4D78FF]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Primary Trade Discipline</label>
                <select
                  value={newSquadSpecialty}
                  onChange={(e) => setNewSquadSpecialty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#4D78FF]"
                >
                  <option value="Solar & Industrial Electrical">Solar &amp; Industrial Electrical</option>
                  <option value="Plumbing, Borehole & Smart Pumps">Plumbing, Borehole &amp; Smart Pumps</option>
                  <option value="Finishes, Plaster & Precision Joinery">Finishes, Plaster &amp; Precision Joinery</option>
                  <option value="Full-Stack Web & Cloud Infrastructure">Full-Stack Web &amp; Cloud Infrastructure</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Mission &amp; Capabilities Summary</label>
                <textarea
                  rows={3}
                  placeholder="Describe your collaborative expertise and project focus..."
                  value={newSquadDescription}
                  onChange={(e) => setNewSquadDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#4D78FF]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? 'Initializing...' : 'Initialize Squad'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
