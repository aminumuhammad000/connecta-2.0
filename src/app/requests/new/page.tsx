'use client'

import React, { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  BadgeCheck,
  Car,
  Hammer,
  Laptop,
  MapPin,
  Paintbrush,
  ShieldCheck,
  Smartphone,
  Wind,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { PublicShell } from '@/components/site/PublicShell'
import { IllustrationProjects } from '@/components/brand/illustrations'
import { Avatar, Button, Card, Field, Notice, Skeleton, Stars, inputClass, textareaClass } from '@/components/dashboard/ui'
import { SERVICE_CATEGORIES, findCategory, guessCategory } from '@/lib/categories'

type Urgency = 'emergency' | 'today' | 'scheduled' | 'flexible'

interface RequestProvider {
  id: string
  fullName: string
  businessName: string
  category: string
  categorySlug: string
  city: string
  averageRating: number
  reviewCount: number
  avatarUrl?: string | null
  verificationStatus: 'verified' | 'unverified'
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  plumbing: Wrench,
  electrical: Zap,
  'ac-cooling': Wind,
  'auto-mechanic': Car,
  carpentry: Hammer,
  painting: Paintbrush,
  'phone-repair': Smartphone,
  'computer-repair': Laptop,
}

const URGENCY: Array<{ id: Urgency; label: string; sub: string }> = [
  { id: 'emergency', label: 'Emergency', sub: 'Right now' },
  { id: 'today', label: 'Today', sub: 'Within hours' },
  { id: 'scheduled', label: 'This week', sub: 'Pick a time' },
  { id: 'flexible', label: 'Flexible', sub: 'No rush' },
]

const MIN_DETAILS = 20

function NewRequestForm() {
  const params = useSearchParams()
  const q = params.get('q') || ''
  const providerIdParam = params.get('providerId') || ''

  const initialCategory = useMemo(
    () => findCategory(params.get('category')) || guessCategory(q) || SERVICE_CATEGORIES[0],
    [params, q]
  )

  const [categoryId, setCategoryId] = useState(initialCategory.id)
  const [title, setTitle] = useState(q.replace(/\.$/, ''))
  const [details, setDetails] = useState('')
  const [urgency, setUrgency] = useState<Urgency>('today')
  const [provider, setProvider] = useState<RequestProvider | null>(null)
  const [isLoadingProvider, setIsLoadingProvider] = useState(Boolean(providerIdParam))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!providerIdParam) return
    let cancelled = false
    fetch(`/api/providers/${encodeURIComponent(providerIdParam)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((body) => {
        if (cancelled || !body?.data) return
        const p: RequestProvider = body.data
        setProvider(p)
        if (!params.get('category')) {
          const cat = findCategory(p.categorySlug)
          if (cat) setCategoryId(cat.id)
        }
      })
      .catch(() => {})
      .finally(() => !cancelled && setIsLoadingProvider(false))
    return () => {
      cancelled = true
    }
  }, [providerIdParam, params])

  const firstName = provider?.fullName.split(' ').find((w) => !/^(engr|dr|mr|mrs|malam|alh|chief)\.?$/i.test(w)) || provider?.fullName

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (title.trim().length < 5) {
      setError('Give the job a short title, at least 5 characters.')
      return
    }
    if (details.trim().length < MIN_DETAILS) {
      setError(`Tell us a little more about the job, at least ${MIN_DETAILS} characters.`)
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          title: title.trim(),
          description: provider ? `${details.trim()}\n\nRequested professional: ${provider.fullName}` : details.trim(),
          urgency,
          serviceMode: 'onsite',
        }),
      })
      const body = await res.json()
      if (!res.ok) throw new Error(body.error?.message || 'We could not send your request.')
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'We could not send your request.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    const steps = [
      { dot: 'bg-azure', text: provider ? `${firstName} reviews your request.` : 'Verified professionals near you review it.' },
      { dot: 'bg-warn', text: 'You get a quote with clear stages and prices.' },
      { dot: 'bg-success', text: 'Your money stays protected until you approve the work.' },
    ]
    return (
      <Card className="max-w-xl mx-auto p-8 sm:p-10 text-center cn-rise">
        <div className="flex justify-center">
          <IllustrationProjects />
        </div>
        <h1 className="mt-4 text-[26px] font-medium tracking-[-0.02em]">Request sent</h1>
        <p className="mt-2 text-[15px] text-muted">
          {provider ? `${provider.fullName} has your job details.` : 'Your job is now visible to verified professionals.'}
        </p>
        <ol className="mt-8 space-y-3.5 text-left max-w-sm mx-auto">
          {steps.map((s, i) => (
            <li key={s.text} className="flex items-start gap-3 cn-rise" style={{ ['--d' as string]: `${200 + i * 90}ms` }}>
              <span className={`mt-0.5 w-5 h-5 rounded-full ${s.dot} text-white text-[11px] font-medium flex items-center justify-center shrink-0`}>
                {i + 1}
              </span>
              <span className="text-sm text-ink-2">{s.text}</span>
            </li>
          ))}
        </ol>
        <div className="mt-9 flex flex-col sm:flex-row gap-2 justify-center">
          <Button href="/dashboard">Go to dashboard</Button>
          <Button variant="secondary" href="/discover">
            Browse professionals
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="cn-rise">
        <p className="text-[13px] text-muted mb-1.5">New request</p>
        <h1 className="text-[28px] sm:text-[32px] leading-tight font-medium tracking-[-0.02em]">
          {provider ? `Request ${firstName}` : 'What do you need done?'}
        </h1>
        <p className="text-[15px] text-muted mt-2">
          {provider
            ? 'Describe the job and they will send you a quote.'
            : 'Describe the job and verified professionals near you will send quotes.'}
        </p>
      </div>

      {isLoadingProvider && (
        <Card className="mt-7 p-4 flex items-center gap-3.5">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </Card>
      )}

      {provider && (
        <Card className="mt-7 p-4 flex items-center gap-3.5 cn-pop">
          <div className="relative shrink-0">
            {provider.avatarUrl ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-sunken">
                <Image src={provider.avatarUrl} alt={provider.fullName} fill sizes="48px" className="object-cover" />
              </div>
            ) : (
              <Avatar name={provider.fullName} size={48} />
            )}
            {provider.verificationStatus === 'verified' && (
              <BadgeCheck className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] text-azure fill-white" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Link href={`/discover/${provider.id}`} className="block text-[15px] font-medium text-ink truncate hover:text-azure-600">
              {provider.fullName}
            </Link>
            <div className="flex items-center gap-2 text-[13px] text-muted mt-0.5 min-w-0">
              <span className="truncate">{provider.category}</span>
              <span className="text-subtle">·</span>
              <span className="inline-flex items-center gap-1 shrink-0">
                <MapPin className="w-3.5 h-3.5" />
                {provider.city}
              </span>
            </div>
          </div>
          <div className="hidden sm:block shrink-0">
            <Stars rating={provider.averageRating} />
          </div>
          <button
            type="button"
            onClick={() => setProvider(null)}
            title="Send to all matching professionals instead"
            aria-label="Remove this professional"
            className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center shrink-0 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
        <Card className="p-6 sm:p-7 space-y-6 cn-rise" style={{ ['--d' as string]: '80ms' }}>
          <div>
            <div className="text-[13px] font-medium text-ink-2 mb-2.5">Trade</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Trade">
              {SERVICE_CATEGORIES.map((cat) => {
                const Icon = ICONS[cat.slug] || Wrench
                const active = categoryId === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setCategoryId(cat.id)}
                    className={`h-11 px-3 rounded-[10px] border flex items-center gap-2 text-left text-[13px] transition-all duration-200 cursor-pointer ${
                      active
                        ? 'border-azure bg-azure-50 text-azure-600 font-medium ring-4 ring-azure/10'
                        : 'border-line text-ink-2 hover:border-line-strong hover:text-ink'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-azure' : 'text-subtle'}`} />
                    <span className="truncate">{cat.short}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <Field label="Job title" htmlFor="rq-title">
            <input
              id="rq-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kitchen sink is leaking"
              maxLength={120}
              className={inputClass}
              required
            />
          </Field>

          <Field
            label="Details"
            htmlFor="rq-details"
            hint={
              <span className="flex justify-between gap-3">
                <span>What&apos;s wrong, where it is, and anything they should bring.</span>
                <span className={`tabular-nums shrink-0 ${details.trim().length >= MIN_DETAILS ? 'text-success-ink' : ''}`}>
                  {Math.min(details.trim().length, MIN_DETAILS)}/{MIN_DETAILS}
                </span>
              </span>
            }
          >
            <textarea
              id="rq-details"
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="The pipe under the kitchen sink drips constantly. House is in Nassarawa GRA, Kano."
              maxLength={2000}
              className={textareaClass}
              required
            />
          </Field>

          <div>
            <div className="text-[13px] font-medium text-ink-2 mb-2.5">When do you need it?</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Urgency">
              {URGENCY.map((u) => {
                const active = urgency === u.id
                const tone =
                  u.id === 'emergency'
                    ? 'border-warn bg-warn-50 ring-4 ring-warn/15 [&>span:first-child]:text-warn-ink'
                    : 'border-azure bg-azure-50 ring-4 ring-azure/10 [&>span:first-child]:text-azure-600'
                return (
                  <button
                    key={u.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setUrgency(u.id)}
                    className={`h-14 px-3 rounded-[10px] border text-left transition-all duration-200 cursor-pointer ${
                      active ? tone : 'border-line hover:border-line-strong'
                    }`}
                  >
                    <span className="block text-[13px] font-medium text-ink">{u.label}</span>
                    <span className="block text-xs text-muted">{u.sub}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {error && (
          <Notice tone="danger" onClose={() => setError(null)}>
            {error}
          </Notice>
        )}

        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 cn-rise" style={{ ['--d' as string]: '160ms' }}>
          <p className="flex items-center gap-2 text-[13px] text-muted">
            <ShieldCheck className="w-4 h-4 text-success shrink-0" />
            You only pay when you approve the work.
          </p>
          <Button type="submit" loading={isSubmitting} className="!h-12 !px-6 !text-[15px]">
            {isSubmitting ? 'Sending request' : provider ? `Send to ${firstName}` : 'Send request'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default function NewServiceRequestPage() {
  return (
    <PublicShell backHref="/discover" backLabel="Back to professionals" width="max-w-4xl">
      <Suspense fallback={null}>
        <NewRequestForm />
      </Suspense>
    </PublicShell>
  )
}
