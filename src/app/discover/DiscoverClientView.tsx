'use client'

import React, { useMemo, useState, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Car,
  Check,
  ChevronDown,
  Hammer,
  HardHat,
  LayoutGrid,
  Map as MapIcon,
  MapPin,
  Navigation,
  Paintbrush,
  Sparkles,
  Wind,
  Wrench,
  Zap,
} from 'lucide-react'
import type { PublicProvider } from '@/lib/server/providers'
import GoogleProviderMap from '@/components/GoogleProviderMap'
import AiServiceDiscoveryInput from '@/components/discovery/AiServiceDiscoveryInput'
import type { StructuredRequestAnalysis, MatchedProviderResult } from '@/lib/ai/discovery'
import { calculateDistanceKm, formatDistance, getGoogleMapsDirectionsUrl, type Coordinates, NIGERIAN_CITY_COORDINATES } from '@/lib/geo'
import { PublicShell } from '@/components/site/PublicShell'
import { IllustrationSearch } from '@/components/brand/illustrations'
import { Avatar, Badge, Button, Card, EmptyState, Segmented, Stars, stagger } from '@/components/dashboard/ui'

const CATEGORIES = [
  { slug: 'all', name: 'All trades', icon: Sparkles },
  { slug: 'plumbing', name: 'Plumbing', icon: Wrench },
  { slug: 'electrical', name: 'Electrical & solar', icon: Zap },
  { slug: 'ac-cooling', name: 'AC & cooling', icon: Wind },
  { slug: 'carpentry', name: 'Carpentry', icon: Hammer },
  { slug: 'generator-repair', name: 'Generators', icon: Wrench },
  { slug: 'auto-mechanic', name: 'Auto mechanic', icon: Car },
  { slug: 'painting', name: 'Painting', icon: Paintbrush },
  { slug: 'construction', name: 'Masonry & tiling', icon: HardHat },
]

type SortKey = 'rating' | 'reviews' | 'rate_asc' | 'rate_desc' | 'nearest'
type Ranked = PublicProvider & { matchScore?: number; matchReason?: string }

const noopSubscribe = () => () => {}

const naira = (minor: number) => `₦${Math.round(minor / 100).toLocaleString('en-NG')}`

const selectClass =
  'appearance-none h-9 pl-3 pr-8 rounded-[10px] border border-line bg-surface text-[13px] text-ink-2 hover:border-line-strong focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10 cursor-pointer transition-colors'

function matchesCategory(p: PublicProvider, slug: string) {
  return p.categorySlug === slug || p.category.toLowerCase().includes(slug.replace('-', ' '))
}

export default function DiscoverClientView({ initialProviders }: { initialProviders: PublicProvider[] }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCity, setSelectedCity] = useState('All Locations')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState<SortKey>('rating')
  const [aiAnalysis, setAiAnalysis] = useState<StructuredRequestAnalysis | null>(null)
  const [aiMatches, setAiMatches] = useState<MatchedProviderResult[] | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [selectedMapProviderId, setSelectedMapProviderId] = useState<string | null>(null)
  const [maxRadiusKm, setMaxRadiusKm] = useState<number | null>(null)
  const hasAccount = useSyncExternalStore(
    noopSubscribe,
    () => document.cookie.split(';').some((c) => c.trim().startsWith('connecta_session=')),
    () => false
  )

  const cityFallback = () => NIGERIAN_CITY_COORDINATES[selectedCity === 'All Locations' ? 'Kano' : selectedCity] || NIGERIAN_CITY_COORDINATES.Kano

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation(cityFallback())
      setSortBy('nearest')
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setIsLocating(false)
        setSortBy('nearest')
      },
      () => {
        setIsLocating(false)
        setUserLocation(cityFallback())
        setSortBy('nearest')
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    )
  }

  const resetAll = () => {
    setAiMatches(null)
    setAiAnalysis(null)
    setSelectedCategory('all')
    setSelectedCity('All Locations')
    setVerifiedOnly(false)
    setUserLocation(null)
    setMaxRadiusKm(null)
    setSortBy('rating')
  }

  const clearAi = () => {
    setAiMatches(null)
    setAiAnalysis(null)
    setSelectedCategory('all')
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: initialProviders.length }
    for (const cat of CATEGORIES) {
      if (cat.slug !== 'all') counts[cat.slug] = initialProviders.filter((p) => matchesCategory(p, cat.slug)).length
    }
    return counts
  }, [initialProviders])

  const providers = useMemo<Ranked[]>(() => {
    let result: Ranked[] = aiMatches !== null ? (aiMatches as unknown as Ranked[]) : [...initialProviders]

    if (userLocation) {
      result = result.map((p) =>
        p.latitude && p.longitude ? { ...p, distanceKm: calculateDistanceKm(userLocation.lat, userLocation.lng, p.latitude, p.longitude) } : p
      )
      if (maxRadiusKm) result = result.filter((p) => p.distanceKm !== undefined && p.distanceKm <= maxRadiusKm)
    }
    if (selectedCategory !== 'all') result = result.filter((p) => matchesCategory(p, selectedCategory))
    if (selectedCity !== 'All Locations') result = result.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase())
    if (verifiedOnly) result = result.filter((p) => p.verificationStatus === 'verified')

    const sorted = [...result]
    if (sortBy === 'nearest' && userLocation) sorted.sort((a, b) => (a.distanceKm ?? 9999) - (b.distanceKm ?? 9999))
    else if (sortBy === 'rating' && aiMatches === null) sorted.sort((a, b) => b.averageRating - a.averageRating)
    else if (sortBy === 'reviews') sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    else if (sortBy === 'rate_asc') sorted.sort((a, b) => a.hourlyRateMinor - b.hourlyRateMinor)
    else if (sortBy === 'rate_desc') sorted.sort((a, b) => b.hourlyRateMinor - a.hourlyRateMinor)
    else if (aiMatches !== null) sorted.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    return sorted
  }, [initialProviders, aiMatches, selectedCategory, selectedCity, verifiedOnly, sortBy, userLocation, maxRadiusKm])

  const hasFilters = selectedCategory !== 'all' || selectedCity !== 'All Locations' || verifiedOnly || !!userLocation || aiMatches !== null

  return (
    <PublicShell
      width="max-w-7xl"
      actions={
        <>
          <Button variant="ghost" size="sm" href="/ai" className="max-sm:hidden">
            <Sparkles className="w-4 h-4 text-warn" />
            AI assistant
          </Button>
          {hasAccount ? (
            <Button size="sm" href="/dashboard">
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" href="/login" className="max-sm:hidden">
                Sign in
              </Button>
              <Button size="sm" href="/register">
                Get started
              </Button>
            </>
          )}
        </>
      }
    >
      <section className="text-center max-w-3xl mx-auto cn-rise">
        <p className="text-[13px] text-muted">{initialProviders.length} verified professionals across Nigeria</p>
        <h1 className="mt-2 text-[32px] sm:text-[42px] leading-[1.1] font-medium tracking-[-0.025em]">Find the right professional</h1>
        <p className="mt-3 text-[16px] text-muted">Describe the problem in your own words. We&apos;ll match you with verified pros nearby.</p>
      </section>

      <div className="mt-8 cn-rise" style={stagger(1, 80)}>
        <AiServiceDiscoveryInput
          onSearchResults={(list, analysis) => {
            setAiMatches(list)
            setAiAnalysis(analysis)
          }}
          onReset={clearAi}
          selectedCity={selectedCity}
          onChangeCity={setSelectedCity}
          userLocation={userLocation}
          onRequestLocation={handleRequestLocation}
          isLocating={isLocating}
          isAiActive={aiMatches !== null}
        />
      </div>

      {aiAnalysis && (
        <Card className="mt-8 p-5 sm:p-6 cn-pop">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <span className="w-10 h-10 rounded-xl bg-warn-50 text-warn-ink flex items-center justify-center shrink-0">
                <Sparkles className="w-[18px] h-[18px]" />
              </span>
              <div className="min-w-0">
                <div className="text-xs text-muted">
                  We understood · {providers.length} match{providers.length === 1 ? '' : 'es'}
                </div>
                <p className="mt-0.5 text-[15px] font-medium text-ink leading-snug">{aiAnalysis.normalizedSummary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone="azure">{aiAnalysis.category}</Badge>
                  {aiAnalysis.location && (
                    <Badge>
                      <MapPin className="w-3 h-3" />
                      {aiAnalysis.location}
                    </Badge>
                  )}
                  {aiAnalysis.budget && <Badge tone="success">{aiAnalysis.budget}</Badge>}
                  <Badge tone="warn" dot className="capitalize">
                    {aiAnalysis.urgency}
                  </Badge>
                  {aiAnalysis.requiredSkills?.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
                {aiAnalysis.followUpQuestion && (
                  <p className="mt-3 text-[13px] text-muted">
                    <span className="text-ink">Worth checking:</span> {aiAnalysis.followUpQuestion}
                  </p>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={clearAi} className="self-end sm:self-auto">
              Clear
            </Button>
          </div>
        </Card>
      )}

      <div className="mt-10 flex gap-2 overflow-x-auto pb-1 -mx-5 px-5 sm:mx-0 sm:px-0 [scrollbar-width:none] cn-rise" style={stagger(2, 80)}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const active = selectedCategory === cat.slug
          return (
            <button
              key={cat.slug}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              aria-pressed={active}
              className={`h-9 pl-3 pr-2.5 rounded-full border inline-flex items-center gap-2 text-[13px] whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
                active ? 'bg-azure border-azure text-white' : 'bg-surface border-line text-ink-2 hover:border-line-strong hover:text-ink'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-subtle'}`} />
              {cat.name}
              <span
                className={`min-w-5 h-5 px-1.5 rounded-full text-[11px] inline-flex items-center justify-center tabular-nums ${
                  active ? 'bg-white/20 text-white' : 'bg-sunken text-muted'
                }`}
              >
                {categoryCounts[cat.slug] ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-line">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-ink font-medium">
            {providers.length} professional{providers.length === 1 ? '' : 's'}
          </span>
          {userLocation && (
            <Badge tone="success" dot>
              Sorted by distance
            </Badge>
          )}
          {hasFilters && (
            <button type="button" onClick={resetAll} className="text-[13px] text-muted hover:text-ink underline underline-offset-2 cursor-pointer">
              Reset
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {userLocation && (
            <div className="relative">
              <select
                value={maxRadiusKm ?? ''}
                onChange={(e) => setMaxRadiusKm(e.target.value ? Number(e.target.value) : null)}
                aria-label="Maximum distance"
                className={selectClass}
              >
                <option value="">Any distance</option>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="25">Within 25 km</option>
                <option value="50">Within 50 km</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-subtle absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          <button
            type="button"
            onClick={() => setVerifiedOnly((v) => !v)}
            aria-pressed={verifiedOnly}
            className={`h-9 px-3 rounded-[10px] border text-[13px] inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              verifiedOnly ? 'border-success bg-success-50 text-success-ink' : 'border-line bg-surface text-ink-2 hover:border-line-strong'
            }`}
          >
            {verifiedOnly ? <Check className="w-3.5 h-3.5" /> : <BadgeCheck className="w-3.5 h-3.5 text-subtle" />}
            Verified only
          </button>

          <div className="relative">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} aria-label="Sort" className={selectClass}>
              {userLocation && <option value="nearest">Nearest first</option>}
              <option value="rating">{aiMatches ? 'Best match' : 'Highest rated'}</option>
              <option value="reviews">Most reviews</option>
              <option value="rate_asc">Lowest rate</option>
              <option value="rate_desc">Highest rate</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-subtle absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <Segmented<'grid' | 'map'>
            value={viewMode}
            onChange={setViewMode}
            items={[
              { value: 'grid', label: 'Grid', icon: LayoutGrid },
              { value: 'map', label: 'Map', icon: MapIcon },
            ]}
          />
        </div>
      </div>

      {viewMode === 'map' && (
        <div className="mt-6 rounded-2xl overflow-hidden border border-line cn-fade">
          <GoogleProviderMap
            providers={providers}
            userLocation={userLocation}
            selectedProviderId={selectedMapProviderId}
            onSelectProvider={(p) => setSelectedMapProviderId(p.id)}
            onRequestUserLocation={handleRequestLocation}
            isLocating={isLocating}
            city={selectedCity === 'All Locations' ? 'Kano' : selectedCity}
            className="h-[460px] sm:h-[520px]"
          />
        </div>
      )}

      {providers.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((p, idx) => {
            const selected = selectedMapProviderId === p.id
            return (
              <Card
                key={p.id}
                interactive
                className={`p-3 flex flex-col cn-rise ${selected ? '!border-azure ring-4 ring-azure/10' : ''}`}
                style={stagger(Math.min(idx, 8), 50)}
              >
                <Link href={`/discover/${p.id}`} className="group block" onClick={() => setSelectedMapProviderId(p.id)}>
                  <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-sunken">
                    {p.avatarUrl ? (
                      <Image
                        src={p.avatarUrl}
                        alt={p.fullName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[linear-gradient(115deg,#EEF4FE,#FFF7E8_55%,#ECFDF5)]">
                        <Avatar name={p.fullName} size={64} />
                      </div>
                    )}
                    {p.matchReason && (
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                        <span className="h-6 px-2 rounded-md bg-surface/95 backdrop-blur text-[11px] text-warn-ink inline-flex items-center gap-1 min-w-0">
                          <Sparkles className="w-3 h-3 shrink-0" />
                          <span className="truncate">{p.matchReason}</span>
                        </span>
                        {p.matchScore ? (
                          <span className="h-6 px-2 rounded-md bg-warn text-ink text-[11px] font-medium inline-flex items-center shrink-0">
                            {p.matchScore}%
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>
                </Link>

                <div className="px-2 pt-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/discover/${p.id}`}
                        className="flex items-center gap-1.5 text-[16px] font-medium text-ink hover:text-azure-600 transition-colors"
                      >
                        <span className="truncate">{p.fullName}</span>
                        {p.verificationStatus === 'verified' && <BadgeCheck className="w-4 h-4 text-azure shrink-0" aria-label="Verified" />}
                      </Link>
                      <p className="text-[13px] text-muted truncate">{p.category}</p>
                    </div>
                    <Stars rating={p.averageRating} />
                  </div>

                  <p className="mt-2.5 text-[13px] text-ink-2 leading-relaxed line-clamp-2">{p.headline || p.bio}</p>

                  <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                    {p.distanceKm !== undefined ? (
                      <span className="inline-flex items-center gap-1 text-success-ink">
                        <Navigation className="w-3 h-3" />
                        {formatDistance(p.distanceKm)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {p.city}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {p.completedJobsCount} jobs
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {p.experienceYears} yrs
                    </span>
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="pt-3.5 border-t border-line flex items-center justify-between gap-2">
                      <div className="text-[15px] font-medium text-ink tabular-nums">
                        {naira(p.hourlyRateMinor)}
                        <span className="text-xs text-muted font-normal">/hr</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {p.latitude && p.longitude && (
                          <a
                            href={getGoogleMapsDirectionsUrl(p.latitude, p.longitude, p.fullName)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Directions"
                            aria-label={`Directions to ${p.fullName}`}
                            className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center transition-colors"
                          >
                            <Navigation className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <Button variant="ghost" size="sm" href={`/discover/${p.id}`}>
                          Profile
                        </Button>
                        <Button size="sm" href={`/requests/new?providerId=${p.id}&category=${encodeURIComponent(p.categorySlug)}`}>
                          Hire
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="mt-6">
          <EmptyState
            illustration={<IllustrationSearch />}
            title="No one matches those filters"
            description="Try another trade, widen the distance, or clear your filters to see everyone."
            action={
              <Button variant="secondary" onClick={resetAll}>
                Clear filters
              </Button>
            }
          />
        </Card>
      )}

      <Card className="mt-14 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5 overflow-hidden relative">
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-success-50" aria-hidden="true" />
        <div className="relative">
          <h2 className="text-lg font-medium">Are you a skilled professional?</h2>
          <p className="text-sm text-muted mt-1">Join Connecta to get verified, reach new clients, and get paid safely.</p>
        </div>
        <Button variant="success" href="/register?role=provider" className="relative shrink-0">
          Join as a professional
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Card>
    </PublicShell>
  )
}
