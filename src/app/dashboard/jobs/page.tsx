'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
  X,
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
        setQuoteSuccessMsg(`Your verified proposal for "${activeQuotingJob.title}" has been submitted to the client.`)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200/60">
        <div>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
            Verified Opportunities
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
            Marketplace Job Briefs
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5 font-normal">
            Browse verified client briefs with locked budgets and submit itemized milestone quotes.
          </p>
        </div>

        <Link
          href="/requests/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white px-3.5 py-2 text-xs font-medium transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post New Brief</span>
        </Link>
      </div>

      {/* Quote Success Banner */}
      {quoteSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{quoteSuccessMsg}</span>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, trade discipline, city, or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50/70 border border-zinc-200 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0C513F] focus:bg-white transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-[#0C513F] text-white text-xs font-medium transition-colors shrink-0 cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-100">
          {categories.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setSelectedCategory(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                selectedCategory === c.value
                  ? 'bg-zinc-900 text-white font-medium'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900 font-normal'
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
          <Loader2 className="w-6 h-6 text-[#0C513F] animate-spin" />
          <span className="text-xs text-zinc-500 font-medium">Loading marketplace jobs...</span>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const clientName = job.clientName || job.customerName || 'Verified Client'

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-zinc-300 transition-colors flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-700">
                      {job.category}
                    </span>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider block">
                        Estimated Budget
                      </span>
                      <span className="text-sm font-semibold text-zinc-900">
                        {formatMinorToNaira(job.budgetMaxMinor)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-zinc-900 leading-snug">
                      {job.title}
                    </h3>
                    <p className="text-xs text-zinc-600 font-normal mt-1.5 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {job.requiredSkills && job.requiredSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {job.requiredSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-zinc-50 border border-zinc-200/70 text-zinc-600 font-normal"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <div className="text-xs text-zinc-500">
                    <span className="font-medium text-zinc-900">{clientName}</span> • {job.city}, Nigeria
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveQuotingJob(job)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-[#0C513F] text-white text-xs font-medium transition-colors cursor-pointer"
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
        <div className="bg-white rounded-2xl p-12 text-center border border-zinc-200/80 space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto">
            <Search className="w-5 h-5" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-sm font-semibold text-zinc-900">No Job Briefs Match Your Search</h3>
            <p className="text-xs text-zinc-500 font-normal leading-relaxed">
              Try adjusting your trade filters or broadcast a new project brief to vetted local trades.
            </p>
          </div>
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0C513F] text-white px-4 py-2 text-xs font-semibold hover:bg-[#093e30] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post First Brief</span>
          </Link>
        </div>
      )}

      {/* Quote Submission Modal */}
      {activeQuotingJob && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-xl border border-zinc-200/80">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  Escrow-Protected Proposal
                </span>
                <h3 className="text-base font-semibold text-zinc-900 mt-1.5">
                  Quote on &ldquo;{activeQuotingJob.title}&rdquo;
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveQuotingJob(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Proposal Scope / Deliverable Title</label>
                <input
                  type="text"
                  value={lineItemDesc}
                  onChange={(e) => setLineItemDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 font-normal text-zinc-900 focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Itemized Proposed Fee (NGN ₦)</label>
                <input
                  type="number"
                  value={lineItemPrice}
                  onChange={(e) => setLineItemPrice(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 font-semibold text-sm text-[#0C513F] focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-zinc-700">Specialist Notes &amp; Warranty Coverage</label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 font-normal text-zinc-900 focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-600 text-xs flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Client must fund Escrow Vault before you mobilize to the site.</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setActiveQuotingJob(null)}
                  className="px-3.5 py-2 rounded-xl text-zinc-600 font-medium hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuote}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0C513F] hover:bg-[#093e30] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmittingQuote ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
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
