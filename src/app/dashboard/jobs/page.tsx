'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Search, MapPin, ShieldCheck, BadgeCheck, ChevronDown, ArrowRight } from 'lucide-react'
import { formatMinorToNaira } from '@/lib/dashboard/data'
import { ConnectaLoader } from '@/components/brand/ConnectaLoader'
import { IllustrationSearch } from '@/components/brand/illustrations'
import {
  Avatar,
  Button,
  Card,
  EmptyState,
  Field,
  Modal,
  Notice,
  PageHeader,
  Stars,
  inputClass,
  stagger,
  textareaClass,
} from '@/components/dashboard/ui'

interface PublicProvider {
  id: string
  fullName: string
  businessName: string
  headline: string
  bio: string
  category: string
  categorySlug: string
  skills: string[]
  city: string
  state: string
  country: string
  hourlyRateMinor: number
  averageRating: number
  reviewCount: number
  completedJobsCount: number
  experienceYears: number
  verificationStatus: 'verified' | 'unverified'
  avatarUrl?: string | null
  phone?: string
  whatsapp?: string
  badges?: string[]
}

const TRADE_CATEGORIES = [
  { label: 'All trades', value: 'all' },
  { label: 'Electrical', value: 'Electrical & Wiring' },
  { label: 'Plumbing', value: 'Plumbing & Pipefitting' },
  { label: 'Air conditioning', value: 'Air Conditioning & Cooling' },
  { label: 'Generators', value: 'Generator Repair & Servicing' },
  { label: 'Carpentry', value: 'Carpentry & Woodwork' },
  { label: 'Phone repair', value: 'Phone & Tablet Repair' },
  { label: 'Auto mechanics', value: 'Auto Mechanics & Repair' },
]

const CITIES = ['All Cities', 'Lagos', 'Abuja', 'Kano', 'Port Harcourt', 'Ibadan']

export default function DashboardProfessionalsPage() {
  const [providers, setProviders] = useState<PublicProvider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('All Cities')

  const [hiring, setHiring] = useState<PublicProvider | null>(null)
  const [projectTitle, setProjectTitle] = useState('')
  const [projectScope, setProjectScope] = useState('')
  const [amountNaira, setAmountNaira] = useState('150000')
  const [isSubmittingHire, setIsSubmittingHire] = useState(false)
  const [hireNotice, setHireNotice] = useState<string | null>(null)

  const fetchProviders = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.append('q', searchQuery.trim())
      if (selectedCity !== 'All Cities') params.append('city', selectedCity)

      const res = await fetch(`/api/providers?${params.toString()}`)
      if (res.ok) {
        const body = await res.json()
        let list: PublicProvider[] = body.data?.providers || []
        if (selectedCategory !== 'all') {
          list = list.filter((p) => p.category.toLowerCase().includes(selectedCategory.toLowerCase()))
        }
        setProviders(list)
      }
    } catch (err) {
      console.error('Failed to load professionals:', err)
    } finally {
      setIsLoading(false)
    }
    // searchQuery is read on submit only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedCity])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProviders()
  }

  const openHire = (pro: PublicProvider) => {
    setHiring(pro)
    setProjectTitle(`${pro.category} job`)
    setProjectScope('')
  }

  const handleHireSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!hiring) return
    setIsSubmittingHire(true)
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle || `${hiring.category} Service Order`,
          categoryId: hiring.category,
          description: `${projectScope} (Assigned to specialist: ${hiring.fullName})`,
          urgency: 'scheduled',
          serviceMode: 'at_location',
          budgetMinMinor: Number(amountNaira) * 100,
          budgetMaxMinor: Number(amountNaira) * 100,
        }),
      })
      if (res.ok) {
        setHireNotice(
          `Request sent to ${hiring.fullName}. ₦${Number(amountNaira).toLocaleString('en-NG')} will be protected once they accept.`
        )
        setHiring(null)
        setTimeout(() => setHireNotice(null), 6000)
      }
    } catch (err) {
      console.error('Hire error:', err)
    } finally {
      setIsSubmittingHire(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Find professionals"
        title="Who do you need today?"
        description="Every professional here is identity-verified and reviewed by real customers."
      />

      {hireNotice && (
        <Notice tone="success" onClose={() => setHireNotice(null)}>
          {hireNotice}
        </Notice>
      )}

      <div className="space-y-4 cn-rise" style={stagger(1, 80)}>
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search a trade, skill or name"
              className={`${inputClass} h-11 pl-10`}
              aria-label="Search professionals"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 sm:flex-none">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className={`${inputClass} h-11 pl-9 pr-9 appearance-none sm:w-44 cursor-pointer`}
                aria-label="City"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city === 'All Cities' ? 'All cities' : city}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
            </div>
            <Button type="submit" className="h-11">
              Search
            </Button>
          </div>
        </form>

        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none]">
          {TRADE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.value
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => setSelectedCategory(cat.value)}
                className={`h-8 px-3.5 rounded-full text-[13px] whitespace-nowrap border transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-azure text-white border-azure'
                    : 'bg-surface text-ink-2 border-line hover:border-line-strong hover:text-ink'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <ConnectaLoader size={40} label="Finding verified professionals" />
        </div>
      ) : providers.length > 0 ? (
        <div className="space-y-3">
          <p className="text-[13px] text-muted">
            {providers.length} professional{providers.length === 1 ? '' : 's'} available
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {providers.map((pro, idx) => (
              <Card key={pro.id} interactive className="p-5 sm:p-6 flex flex-col cn-rise" style={stagger(idx, 50)}>
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    {pro.avatarUrl ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-sunken">
                        <Image src={pro.avatarUrl} alt={pro.fullName} fill className="object-cover" />
                      </div>
                    ) : (
                      <Avatar name={pro.fullName} size={48} />
                    )}
                    {pro.verificationStatus === 'verified' && (
                      <BadgeCheck className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] text-azure fill-white" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-medium text-ink truncate">{pro.fullName}</h3>
                        <p className="text-[13px] text-muted truncate">{pro.businessName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <Stars rating={pro.averageRating} />
                        <div className="text-xs text-subtle mt-0.5">{pro.reviewCount} reviews</div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-ink-2 mt-4 leading-relaxed">{pro.headline}</p>
                {pro.bio && <p className="text-[13px] text-muted mt-1.5 line-clamp-2 leading-relaxed">{pro.bio}</p>}

                {pro.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {pro.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="h-6 px-2 inline-flex items-center rounded-md bg-sunken text-xs text-ink-2">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto pt-5">
                  <div className="pt-4 border-t border-line flex items-center justify-between gap-3">
                    <div className="text-[13px] text-muted min-w-0 truncate">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {pro.city}
                      </span>
                      <span className="mx-1.5 text-subtle">·</span>
                      <span className="text-ink">
                        {pro.hourlyRateMinor > 0 ? `${formatMinorToNaira(pro.hourlyRateMinor)}/hr` : 'Quote on request'}
                      </span>
                    </div>
                    <Button size="sm" onClick={() => openHire(pro)}>
                      Hire
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <EmptyState
            illustration={<IllustrationSearch />}
            title="No one matches yet"
            description="Try another trade or city. New professionals are verified every week."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedCity('All Cities')
                  setSearchQuery('')
                }}
              >
                Clear filters
              </Button>
            }
          />
        </Card>
      )}

      <Modal
        open={!!hiring}
        onClose={() => setHiring(null)}
        title={hiring ? `Hire ${hiring.fullName}` : 'Hire'}
        description="Describe the job. Your money stays protected until you approve the work."
        size="lg"
      >
        {hiring && (
          <form onSubmit={handleHireSubmit} className="space-y-5">
            <Field label="Job title" htmlFor="hire-title">
              <input
                id="hire-title"
                type="text"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                placeholder="e.g. 5kVA inverter installation"
                className={inputClass}
                required
              />
            </Field>
            <Field label="What needs doing?" htmlFor="hire-scope">
              <textarea
                id="hire-scope"
                rows={3}
                value={projectScope}
                onChange={(e) => setProjectScope(e.target.value)}
                placeholder="Location, what's wrong, and what a finished job looks like"
                className={textareaClass}
                required
              />
            </Field>
            <Field label="Budget" htmlFor="hire-amount" hint="You can split this into stages after the professional accepts.">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">₦</span>
                <input
                  id="hire-amount"
                  type="number"
                  min={1}
                  value={amountNaira}
                  onChange={(e) => setAmountNaira(e.target.value)}
                  className={`${inputClass} pl-8 text-base font-medium tabular-nums`}
                  required
                />
              </div>
            </Field>

            <div className="flex items-start gap-3 rounded-xl bg-success-50/60 border border-success/15 p-4">
              <ShieldCheck className="w-5 h-5 text-success shrink-0" />
              <p className="text-[13px] text-ink-2 leading-relaxed">
                Funds sit safely in your Connecta vault. {hiring.fullName.split(' ')[0]} is paid only after you inspect and approve each stage.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setHiring(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="success" loading={isSubmittingHire}>
                {isSubmittingHire ? 'Sending request' : 'Send request'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
