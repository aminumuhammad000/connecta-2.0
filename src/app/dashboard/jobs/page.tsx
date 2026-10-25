'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  MapPin,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowRight,
  ShieldCheck,
  Send,
  Plus,
} from 'lucide-react'
import {
  DASHBOARD_MARKETPLACE_JOBS,
  formatMinorToNaira,
  DashboardMarketplaceJob,
} from '@/lib/dashboard/data'

export default function DashboardJobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all')
  const [activeQuotingJob, setActiveQuotingJob] = useState<DashboardMarketplaceJob | null>(null)
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState<string | null>(null)

  // Quote Form State
  const [lineItemDesc, setLineItemDesc] = useState('Primary Trade & Sizing Labor')
  const [lineItemPrice, setLineItemPrice] = useState('350000')
  const [quoteNotes, setQuoteNotes] = useState('Includes 1-year workmanship warranty and on-site testing.')

  const categories = [
    { label: 'All Trades', value: 'all' },
    { label: 'Solar & Electrical', value: 'electrical' },
    { label: 'Plumbing & Pumps', value: 'plumbing' },
    { label: 'Software & Cloud', value: 'computer-repair' },
    { label: 'Carpentry & Joinery', value: 'carpentry' },
  ]

  const filteredJobs = useMemo(() => {
    return DASHBOARD_MARKETPLACE_JOBS.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory =
        selectedCategory === 'all' || job.categorySlug === selectedCategory

      const matchesUrgency =
        selectedUrgency === 'all' || job.urgency === selectedUrgency

      return matchesSearch && matchesCategory && matchesUrgency
    })
  }, [searchQuery, selectedCategory, selectedUrgency])

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeQuotingJob) return

    setQuoteSuccessMsg(`Your verified proposal for "${activeQuotingJob.title}" has been submitted to ${activeQuotingJob.clientName}!`)
    setActiveQuotingJob(null)
    setTimeout(() => setQuoteSuccessMsg(null), 4000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1A73E8] tracking-wider">
            Verified African Trades &amp; Tech Opportunities
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight mt-1">
            Marketplace Job Briefs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Browse active briefs with locked budgets and submit itemized milestone quotes.
          </p>
        </div>

        <Link
          href="/requests/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#0C513F] hover:bg-[#083b2e] text-white px-5 py-2.5 text-xs font-extrabold shadow-sm hover:scale-102 active:scale-98 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Brief</span>
        </Link>
      </div>

      {/* Quote Success Banner */}
      {quoteSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-sm animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{quoteSuccessMsg}</span>
        </div>
      )}

      {/* Search & Filters Controls */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by trade, skill (e.g. Solar, Borehole, React, Joinery), or city..."
            className="w-full bg-[#F5F7FC] border border-slate-200/90 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0C513F] focus:bg-white transition-all font-medium placeholder:text-slate-400"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                selectedCategory === c.value
                  ? 'bg-[#0C513F] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.map((job) => {
          const urgencyBadge =
            job.urgency === 'emergency'
              ? 'bg-rose-100 text-rose-800 border-rose-200'
              : job.urgency === 'today'
              ? 'bg-amber-100 text-amber-800 border-amber-200'
              : 'bg-blue-100 text-blue-800 border-blue-200'

          return (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {job.category}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${urgencyBadge}`}
                    >
                      {job.urgency}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {job.postedTimeAgo}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-[#0A1020] leading-snug">
                  {job.title}
                </h3>

                <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                {/* Skills Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">
                      Budget Range
                    </div>
                    <div className="text-sm font-black text-emerald-700">
                      {formatMinorToNaira(job.budgetMinMinor)} - {formatMinorToNaira(job.budgetMaxMinor)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Location</div>
                    <div className="font-extrabold text-slate-700 flex items-center gap-1 justify-end">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.city}, NG</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveQuotingJob(job)}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white text-xs font-extrabold shadow-xs hover:scale-101 active:scale-99 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Itemized Proposal</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quote Proposal Modal */}
      {activeQuotingJob && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-[#0C513F]">
                Itemized Proposal
              </span>
              <h3 className="text-lg font-black text-[#0A1020]">
                Submit Quote for: {activeQuotingJob.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Client: {activeQuotingJob.clientName} ({activeQuotingJob.clientCompany})
              </p>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700">Milestone Deliverable Item</label>
                <input
                  type="text"
                  value={lineItemDesc}
                  onChange={(e) => setLineItemDesc(e.target.value)}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Proposed Fee (NGN)</label>
                <div className="relative mt-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">₦</span>
                  <input
                    type="number"
                    value={lineItemPrice}
                    onChange={(e) => setLineItemPrice(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-extrabold text-slate-900 focus:outline-none focus:border-[#0C513F]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Proposal Terms &amp; Scope</label>
                <textarea
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  rows={3}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#0C513F]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQuotingJob(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#0C513F] text-white hover:bg-[#083b2e] shadow-md cursor-pointer"
                >
                  Transmit Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
