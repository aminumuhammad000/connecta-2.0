'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Plus, Search, Sparkles, Wallet } from 'lucide-react'
import { formatMinorToNaira } from '@/lib/dashboard/data'
import { PageLoader } from '@/components/brand/ConnectaLoader'
import { IllustrationDisconnected, IllustrationProjects, IllustrationWelcome } from '@/components/brand/illustrations'
import {
  AnimatedNumber,
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  SectionHeader,
  Stars,
  stagger,
} from '@/components/dashboard/ui'
import { MilestoneTimeline, ProgressBar, type MilestoneLike } from '@/components/dashboard/milestones'

interface ServerOverviewData {
  user: {
    id: string
    fullName: string
    firstName: string
    lastName: string
    email: string
    role: 'customer' | 'provider'
    activeRole: 'customer' | 'provider'
    city: string
    currency: string
    avatarUrl?: string | null
    headline?: string
    trade?: string
    bio?: string
    skills?: string[]
    companyName?: string
  }
  wallet: {
    balanceMinor: number
    escrowBalanceMinor: number
    sparksBalance: number
    currency: string
  }
  metrics: Array<{
    label: string
    value: string
    subtext: string
    iconType: string
    color: string
    changePercent?: string
  }>
  activeBooking: {
    bookingNumber: string
    category: string
    title: string
    totalAmountMinor: number
    providerName: string
    providerTitle: string
    clientName?: string
    progressPercentage: number
    milestones?: MilestoneLike[]
  } | null
  recentJobs: unknown[]
}

const FEATURED_PROS = [
  {
    name: 'Engr. Babatunde Alabi',
    trade: 'Electrical & wiring',
    headline: 'Licensed industrial and residential electrical contractor',
    rating: 4.9,
    reviews: 88,
    city: 'Ikeja, Lagos',
    rate: '₦12,000/hr',
  },
  {
    name: 'Ibrahim Suleiman',
    trade: 'Solar & power',
    headline: 'Certified solar PV and hybrid inverter installation engineer',
    rating: 5.0,
    reviews: 64,
    city: 'Garki, Abuja',
    rate: '₦15,000/hr',
  },
  {
    name: 'Emeka Okafor',
    trade: 'Plumbing',
    headline: 'PPR pipework and borehole submersible pump specialist',
    rating: 4.8,
    reviews: 52,
    city: 'Port Harcourt',
    rate: '₦10,000/hr',
  },
  {
    name: 'Malam Sanusi Danbatta',
    trade: 'Electronics repair',
    headline: 'Board-level diagnostics and component repair',
    rating: 4.9,
    reviews: 142,
    city: 'Kano City',
    rate: '₦8,500/hr',
  },
]

const QUICK_ACTIONS = [
  { href: '/dashboard/jobs', icon: Search, title: 'Find a professional', body: 'Browse verified pros near you', tile: 'bg-azure-50 text-azure', hover: 'group-hover:bg-azure group-hover:text-white' },
  { href: '/dashboard/payment', icon: Wallet, title: 'Add funds', body: 'Protect money for your next job', tile: 'bg-success-50 text-success-ink', hover: 'group-hover:bg-success-ink group-hover:text-white' },
  { href: '/ai', icon: Sparkles, title: 'Ask the assistant', body: 'Describe a problem, get matched', tile: 'bg-warn-50 text-warn-ink', hover: 'group-hover:bg-warn group-hover:text-ink' },
]

const naira = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardOverviewPage() {
  const [data, setData] = useState<ServerOverviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [today] = useState(() => new Date().toLocaleDateString('en-NG', { weekday: 'long', day: 'numeric', month: 'long' }))

  useEffect(() => {
    async function loadOverview() {
      try {
        const res = await fetch('/api/dashboard/overview')
        if (!res.ok) throw new Error('We could not load your dashboard right now.')
        const json = await res.json()
        setData(json.data)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Connection error')
      } finally {
        setIsLoading(false)
      }
    }
    loadOverview()
  }, [])

  if (isLoading) return <PageLoader label="Preparing your workspace" />

  if (error || !data) {
    return (
      <Card>
        <EmptyState
          illustration={<IllustrationDisconnected />}
          title="We lost the connection"
          description={error || 'Your workspace could not be reached. Check your network and try again.'}
          action={<Button onClick={() => window.location.reload()}>Try again</Button>}
        />
      </Card>
    )
  }

  const { user, wallet, metrics, activeBooking } = data
  const activeMilestones = metrics.find((m) => m.label.toLowerCase().includes('milestone'))?.value || '0'

  return (
    <div className="space-y-10">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 cn-rise">
        <div>
          <p className="text-[13px] text-muted mb-1.5" suppressHydrationWarning>
            {today}
            {user.city ? ` · ${user.city}` : ''}
          </p>
          <h1 className="text-[26px] sm:text-[30px] leading-tight font-medium tracking-[-0.02em] text-ink" suppressHydrationWarning>
            {greeting()}, {user.firstName || user.fullName}
          </h1>
          <p className="text-sm text-muted mt-2">Here is where your projects and money stand today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="success" href="/dashboard/payment">
            <Plus className="w-4 h-4" />
            Add funds
          </Button>
          <Button href="/dashboard/jobs">
            <Search className="w-4 h-4" />
            Find a professional
          </Button>
        </div>
      </header>

      <Card className="overflow-hidden cn-rise" style={stagger(1, 80)}>
        <div className="grid md:grid-cols-[1fr_auto] items-center">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 text-[13px] text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-success cn-live-dot" />
              Protected in your vault
            </div>
            <div className="mt-2 text-[38px] sm:text-[44px] leading-none font-medium tracking-[-0.03em] text-success-ink">
              <AnimatedNumber value={(wallet?.escrowBalanceMinor || 0) / 100} format={naira} />
            </div>
            <p className="text-[13px] text-muted mt-3 max-w-sm leading-relaxed">
              Held safely and released to a professional only after you approve their work.
            </p>

            <dl className="mt-7 grid grid-cols-3 gap-4 sm:gap-8 pt-6 border-t border-line">
              <div className="border-l-2 border-azure pl-3">
                <dt className="text-xs text-muted">Available</dt>
                <dd className="mt-1 text-base sm:text-lg font-medium text-ink tracking-[-0.01em]">
                  <AnimatedNumber value={(wallet?.balanceMinor || 0) / 100} format={naira} />
                </dd>
              </div>
              <div className="border-l-2 border-warn pl-3">
                <dt className="text-xs text-muted">Active milestones</dt>
                <dd className="mt-1 text-base sm:text-lg font-medium text-ink tabular-nums">{activeMilestones}</dd>
              </div>
              <div className="border-l-2 border-success pl-3">
                <dt className="text-xs text-muted">Trades covered</dt>
                <dd className="mt-1 text-base sm:text-lg font-medium text-ink">10+</dd>
              </div>
            </dl>
          </div>
          <div className="hidden md:flex items-center justify-center h-full px-10 bg-[linear-gradient(180deg,#FAFBFC,#F5F7FA)] border-l border-line self-stretch">
            <IllustrationWelcome className="w-64 h-32" />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {QUICK_ACTIONS.map((a, idx) => {
          const Icon = a.icon
          return (
            <Link key={a.href} href={a.href} className="group block cn-rise" style={stagger(idx + 2, 60)}>
              <Card interactive className="p-5 h-full">
                <div className="flex items-center justify-between">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200 ${a.tile} ${a.hover}`}>
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <ArrowRight className="w-4 h-4 text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-ink" />
                </div>
                <div className="mt-4 text-[15px] font-medium text-ink">{a.title}</div>
                <div className="text-[13px] text-muted mt-0.5">{a.body}</div>
              </Card>
            </Link>
          )
        })}
      </div>

      <section className="cn-rise" style={stagger(5, 80)}>
        <SectionHeader
          title="Active contract"
          description="Approve each stage when you are happy with the work."
          action={
            <Link href="/dashboard/projects" className="text-[13px] text-muted hover:text-ink inline-flex items-center gap-1 transition-colors">
              All projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />

        {activeBooking ? (
          <Card className="p-6 sm:p-7">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge>#{activeBooking.bookingNumber}</Badge>
                  <Badge tone="azure">{activeBooking.category}</Badge>
                </div>
                <h3 className="text-lg font-medium text-ink mt-3 tracking-[-0.01em]">{activeBooking.title}</h3>
                <div className="flex items-center gap-2 mt-2 text-[13px] text-muted">
                  <Avatar name={activeBooking.providerName} size={22} />
                  <span className="text-ink-2">{activeBooking.providerName}</span>
                  <span className="text-subtle">·</span>
                  <span className="truncate">{activeBooking.providerTitle}</span>
                </div>
              </div>
              <div className="sm:text-right shrink-0">
                <div className="text-xs text-muted">Contract value</div>
                <div className="text-xl font-medium text-ink tracking-[-0.02em] mt-0.5">
                  {formatMinorToNaira(activeBooking.totalAmountMinor)}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-muted">Progress</span>
                <span className="text-ink font-medium tabular-nums">{activeBooking.progressPercentage}%</span>
              </div>
              <ProgressBar value={activeBooking.progressPercentage} />
            </div>

            {activeBooking.milestones && activeBooking.milestones.length > 0 && (
              <div className="mt-6 pt-6 border-t border-line">
                <MilestoneTimeline
                  milestones={activeBooking.milestones}
                  renderAction={(m) =>
                    m.status === 'current' ? (
                      <Button size="sm" variant="success" href="/dashboard/projects">
                        Review
                      </Button>
                    ) : null
                  }
                />
              </div>
            )}
          </Card>
        ) : (
          <Card>
            <EmptyState
              illustration={<IllustrationProjects />}
              title="No active contracts yet"
              description="Hire a verified professional and your first milestone will show up here."
              action={<Button href="/dashboard/jobs">Find a professional</Button>}
            />
          </Card>
        )}
      </section>

      <section className="cn-rise" style={stagger(6, 80)}>
        <SectionHeader
          title="Recommended professionals"
          description="Verified, well reviewed and ready to start."
          action={
            <Link href="/dashboard/jobs" className="text-[13px] text-muted hover:text-ink inline-flex items-center gap-1 transition-colors">
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURED_PROS.map((pro, idx) => (
            <Link key={pro.name} href="/dashboard/jobs" className="group block cn-rise" style={stagger(idx + 7, 60)}>
              <Card interactive className="p-5 h-full">
                <div className="flex items-start gap-3.5">
                  <Avatar name={pro.name} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[15px] font-medium text-ink truncate">{pro.name}</h3>
                      <Stars rating={pro.rating} />
                    </div>
                    <p className="text-[13px] text-muted mt-0.5">{pro.trade}</p>
                  </div>
                </div>
                <p className="text-[13px] text-ink-2 mt-3.5 leading-relaxed line-clamp-2">{pro.headline}</p>
                <div className="mt-4 pt-3.5 border-t border-line flex items-center justify-between text-[13px]">
                  <span className="text-muted">
                    {pro.city} · <span className="text-ink">{pro.rate}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-azure-600 font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    Hire <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
