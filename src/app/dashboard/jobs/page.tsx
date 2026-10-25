'use client'

import React, { useState, useEffect, useMemo } from 'react'
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
  Loader2,
} from 'lucide-react'
import { formatMinorToNaira } from '@/lib/dashboard/data'

interface MarketplaceJob {
  id: string
  title: string
  category: string
  categorySlug: string
  customerName?: string
  clientName?: string
  customerCompany?: string
  clientCompany?: string
  city: string
  urgency: string
  budgetMinMinor: number
  budgetMaxMinor: number
  description: string
  requiredSkills: string[]
  proposalsCount: number
  createdAt?: string
}

export default function DashboardJobsPage() {
  const [jobs, setJobs] = useState<MarketplaceJob[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [activeQuotingJob, setActiveQuotingJob] = useState<MarketplaceJob | null>(null)
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false)
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

  const fetchJobs = async () => {
    try {
      const res = await fetch(`/api/dashboard/jobs?category=${selectedCategory}&q=${encodeURIComponent(searchQuery)}`)
      if (res.ok) {
        const body = await res.json()
        setJobs(body.data || [])
      }
    } catch (err) {
      console.error('Failed to load marketplace jobs:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [selectedCategory])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
  }

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeQuotingJob) return

    setIsSubmittingQuote(true)
    try {
      const res = await fetch(`/api/dashboard/jobs/${activeQuotingJob.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalText: `${lineItemDesc}: ${quoteNotes}`,
          quoteAmountMinor: Number(lineItemPrice) * 100,
        }),
      })

      if (res.ok) {
        setQuoteSuccessMsg(`Your verified proposal for "${activeQuotingJob.title}" has been submitted to the client!`)
        setActiveQuotingJob(null)
        await fetchJobs()
        setTimeout(() => setQuoteSuccessMsg(null), 4000)
      }
    } catch (err) {
      console.error('Quote submission error:', err)
    } finally {
      setIsSubmittingQuote(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-[#1A73E8] tracking-wider">
            Verified Trades &amp; Tech Opportunities
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight mt-1">
            Marketplace Job Briefs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Browse live briefs with locked budgets and submit itemized milestone quotes.
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

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, trade discipline, city, or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:border-[#4D78FF] focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-[#0A1020] hover:bg-[#4D78FF] text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-7 h-7 text-[#0C513F] animate-spin" />
          <span className="text-xs font-bold text-slate-500">Connecting to marketplace server...</span>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {jobs.map((job) => {
            const clientName = job.clientName || job.customerName || 'Verified Client'
            const companyName = job.clientCompany || job.customerCompany || 'Hiring Client Workspace'

            return (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-200">
                      {job.category}
                    </span>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Estimated Budget
                      </span>
                      <span className="text-base font-black text-[#0C513F]">
                        {formatMinorToNaira(job.budgetMaxMinor)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-[#0A1020] tracking-tight leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-1.5 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 font-medium">
                    <span className="font-bold text-slate-800">{clientName}</span> • {job.city}, Nigeria
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveQuotingJob(job)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                  >
                    <span>Send Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h3 className="text-base font-black text-[#0A1020]">No Job Briefs Match Your Search</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Try adjusting your trade filters or be the first to broadcast a new project brief to vetted local trades.
            </p>
          </div>
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#0C513F] text-white px-5 py-2.5 text-xs font-extrabold hover:bg-[#083b2e] shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post First Brief</span>
          </Link>
        </div>
      )}

      {/* Quote Submission Modal */}
      {activeQuotingJob && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-emerald-100 text-[#0C513F]">
                  Escrow-Protected Proposal
                </span>
                <h3 className="text-lg font-black text-[#0A1020] mt-1">
                  Quote on &ldquo;{activeQuotingJob.title}&rdquo;
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuotingJob(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Proposal Scope / Deliverable Title</label>
                <input
                  type="text"
                  value={lineItemDesc}
                  onChange={(e) => setLineItemDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#4D78FF]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Itemized Proposed Fee (NGN ₦)</label>
                <input
                  type="number"
                  value={lineItemPrice}
                  onChange={(e) => setLineItemPrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-black text-sm text-[#0C513F] focus:outline-none focus:border-[#4D78FF]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Specialist Notes &amp; Warranty Coverage</label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:border-[#4D78FF]"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Client must fund Escrow Vault before you mobilize to the site.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveQuotingJob(null)}
                  className="px-4 py-2 rounded-full text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuote}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#0C513F] hover:bg-[#083b2e] text-white font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSubmittingQuote ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isSubmittingQuote ? 'Submitting...' : 'Submit Proposal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
