'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarDays,
  Check,
  Copy,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Share2,
  ShieldCheck,
  Star,
} from 'lucide-react'
import type { PublicProvider } from '@/lib/server/providers'
import { getGoogleMapsDirectionsUrl } from '@/lib/geo'
import { PublicShell } from '@/components/site/PublicShell'
import { Avatar, Button, Card, Field, Modal, Notice, Stars, inputClass, stagger, textareaClass } from '@/components/dashboard/ui'

interface ProfileClientViewProps {
  provider: PublicProvider
  relatedProviders: PublicProvider[]
}

const naira = (minor: number) => `₦${Math.round(minor / 100).toLocaleString('en-NG')}`

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function monthYear(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

const BADGE_TONES = ['bg-azure-50 text-azure', 'bg-success-50 text-success-ink', 'bg-warn-50 text-warn-ink']

function ProviderPhoto({ provider, size }: { provider: PublicProvider; size: number }) {
  if (!provider.avatarUrl) return <Avatar name={provider.fullName} size={size} />
  return (
    <div className="relative rounded-full overflow-hidden bg-sunken shrink-0" style={{ width: size, height: size }}>
      <Image src={provider.avatarUrl} alt={provider.fullName} fill sizes={`${size}px`} className="object-cover" priority={size > 60} />
    </div>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  const labels = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']
  const shown = hover || value
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)} role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            onMouseEnter={() => setHover(n)}
            onClick={() => onChange(n)}
            className="p-0.5 cursor-pointer transition-transform duration-150 hover:scale-110"
          >
            <Star className={`w-7 h-7 transition-colors ${n <= shown ? 'fill-warn text-warn' : 'fill-line text-line'}`} />
          </button>
        ))}
      </div>
      <span className="text-sm text-muted">{labels[shown]}</span>
    </div>
  )
}

export default function ProfileClientView({ provider, relatedProviders }: ProfileClientViewProps) {
  const [reviews, setReviews] = useState(provider.reviews || [])
  const [ratingScore, setRatingScore] = useState(provider.averageRating || 5)
  const [ratingCount, setRatingCount] = useState(provider.reviewCount || provider.reviews?.length || 0)

  const [isShareOpen, setIsShareOpen] = useState(false)
  const shareUrl = `https://myconnecta.ng/discover/${provider.id}`
  const [canNativeShare] = useState(() => typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  const [copied, setCopied] = useState(false)

  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [ratingInput, setRatingInput] = useState(5)
  const [projectInput, setProjectInput] = useState('')
  const [commentInput, setCommentInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewPosted, setReviewPosted] = useState(false)

  const joined = monthYear(provider.joinedDate)

  const hireHref = `/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.categorySlug)}`
  const whatsappDigits = (provider.whatsapp || '').replace(/[^0-9]/g, '')
  const whatsappHref = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
        `Hello ${provider.fullName}, I found your profile on Connecta and would like to discuss a ${provider.category.toLowerCase()} job.`
      )}`
    : null
  const address = provider.workshopAddress || `${provider.city}, ${provider.state}, Nigeria`
  const mapQuery =
    provider.latitude && provider.longitude ? `${provider.latitude},${provider.longitude}` : encodeURIComponent(`${address}`)
  const directionsHref =
    provider.latitude && provider.longitude
      ? getGoogleMapsDirectionsUrl(provider.latitude, provider.longitude, provider.fullName)
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  const shareText = `${provider.fullName}, ${provider.category} in ${provider.city}. Rated ${ratingScore.toFixed(1)}/5 on Connecta.`
  const shareTargets = [
    { label: 'WhatsApp', href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`, tone: 'hover:bg-success-50 hover:text-success-ink' },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, tone: 'hover:bg-sunken' },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, tone: 'hover:bg-azure-50 hover:text-azure-600' },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, tone: 'hover:bg-azure-50 hover:text-azure-600' },
    { label: 'Telegram', href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, tone: 'hover:bg-azure-50 hover:text-azure-600' },
    { label: 'Email', href: `mailto:?subject=${encodeURIComponent(`${provider.fullName} on Connecta`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`, tone: 'hover:bg-warn-50 hover:text-warn-ink' },
  ]

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {}
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title: `${provider.fullName} on Connecta`, text: shareText, url: shareUrl })
    } catch {}
  }

  const openReview = () => {
    setReviewError(null)
    setReviewPosted(false)
    setIsReviewOpen(true)
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (commentInput.trim().length < 5) {
      setReviewError('Write at least a sentence about the work.')
      return
    }
    setIsSubmitting(true)
    setReviewError(null)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: provider.id,
          rating: ratingInput,
          projectTitle: projectInput.trim() || `${provider.category} job`,
          comment: commentInput.trim(),
        }),
      })
      const body = await res.json()
      if (res.status === 401) {
        setIsReviewOpen(false)
        setIsAuthOpen(true)
        return
      }
      if (!res.ok) throw new Error(body.error?.message || 'We could not post your review.')

      if (body.data) {
        setReviews((prev) => [body.data, ...prev])
        setRatingScore((prev) => (prev * ratingCount + ratingInput) / (ratingCount + 1))
        setRatingCount((c) => c + 1)
      }
      setReviewPosted(true)
      setTimeout(() => {
        setIsReviewOpen(false)
        setCommentInput('')
        setProjectInput('')
        setRatingInput(5)
      }, 1400)
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'We could not post your review.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stats = [
    { label: 'Rating', value: ratingScore.toFixed(1), sub: `${ratingCount} review${ratingCount === 1 ? '' : 's'}`, accent: 'bg-warn' },
    { label: 'Jobs completed', value: provider.completedJobsCount.toLocaleString('en-NG'), sub: 'On Connecta', accent: 'bg-success' },
    { label: 'Experience', value: `${provider.experienceYears} yrs`, sub: `On Connecta since ${joined.split(' ')[1] || joined}`, accent: 'bg-azure' },
  ]

  return (
    <PublicShell
      backHref="/discover"
      backLabel="Back to professionals"
      actions={
        <>
          <Button variant="ghost" size="sm" onClick={() => setIsShareOpen(true)}>
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button size="sm" href={hireHref}>
            Hire
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </>
      }
    >
      <Card className="overflow-hidden cn-rise">
        <div className="h-24 sm:h-28 bg-[linear-gradient(115deg,#EEF4FE_0%,#FFF7E8_55%,#ECFDF5_100%)]" />
        <div className="px-6 sm:px-8 pb-7">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 -mt-11">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 min-w-0">
              <div className="relative w-fit rounded-full ring-4 ring-surface">
                <ProviderPhoto provider={provider} size={88} />
                {provider.verificationStatus === 'verified' && (
                  <BadgeCheck className="absolute bottom-0.5 right-0.5 w-6 h-6 text-azure fill-white" aria-label="Verified" />
                )}
              </div>
              <div className="min-w-0 sm:pb-1">
                <h1 className="text-[26px] sm:text-[28px] leading-tight font-medium tracking-[-0.02em]">{provider.fullName}</h1>
                <p className="text-[15px] text-muted mt-0.5 truncate">{provider.businessName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:pb-1">
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-[10px] border border-line-strong bg-surface text-sm font-medium text-ink hover:bg-success-50 hover:border-success/40 hover:text-success-ink transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              )}
              <Button href={hireHref}>
                Request a quote
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="mt-5 text-[15px] text-ink-2 max-w-2xl leading-relaxed">{provider.headline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-subtle" />
              {provider.category}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-subtle" />
              {provider.city}, {provider.state}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-subtle" />
              Joined {joined}
            </span>
            <span className="inline-flex items-center gap-1.5 text-ink font-medium">
              From {naira(provider.hourlyRateMinor)}/hr
            </span>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <Card key={s.label} className="p-4 sm:p-5 cn-rise" style={stagger(i + 1, 70)}>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <span className={`w-1.5 h-1.5 rounded-full ${s.accent}`} />
              {s.label}
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-medium tracking-[-0.02em] tabular-nums">{s.value}</div>
            <div className="text-xs text-subtle mt-0.5 truncate">{s.sub}</div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 sm:p-7 cn-rise" style={stagger(4, 70)}>
            <h2 className="text-base font-medium">About</h2>
            <p className="mt-3 text-[15px] text-ink-2 leading-relaxed">{provider.bio}</p>
            {provider.skills.length > 0 && (
              <>
                <h3 className="mt-7 text-[13px] font-medium text-ink-2">Skills</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {provider.skills.map((skill) => (
                    <span key={skill} className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-sunken text-[13px] text-ink-2">
                      <Check className="w-3.5 h-3.5 text-success" />
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </Card>

          <Card className="cn-rise" style={stagger(5, 70)}>
            <div className="flex items-center justify-between gap-4 px-6 sm:px-7 py-5 border-b border-line">
              <div>
                <h2 className="text-base font-medium">Reviews</h2>
                <div className="mt-1 flex items-center gap-2 text-[13px] text-muted">
                  <Stars rating={ratingScore} />
                  <span>
                    from {ratingCount} client{ratingCount === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
              <Button variant="warm" size="sm" onClick={openReview}>
                <Star className="w-3.5 h-3.5" />
                Write a review
              </Button>
            </div>
            {reviews.length > 0 ? (
              <ul className="divide-y divide-line">
                {reviews.map((rev) => (
                  <li key={rev.id} className="px-6 sm:px-7 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar name={rev.authorName} size={34} />
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{rev.authorName}</div>
                          <div className="text-xs text-muted truncate">{rev.projectTitle}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0" aria-label={`${rev.rating} out of 5`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`w-3.5 h-3.5 ${n <= rev.rating ? 'fill-warn text-warn' : 'fill-line text-line'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-ink-2 leading-relaxed">{rev.comment}</p>
                    <div className="mt-2 text-xs text-subtle">{rev.date}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-7 py-10 text-center text-sm text-muted">No reviews yet. Hired {provider.fullName.split(' ')[0]}? Share how it went.</p>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden cn-rise" style={stagger(4, 70)}>
            <div className="h-48 bg-sunken">
              <iframe
                title={`${provider.fullName} location`}
                src={`https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`}
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <div className="text-xs text-muted">Workshop</div>
              <p className="mt-1 text-sm text-ink">{address}</p>
              <a
                href={directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-azure-600 hover:text-azure"
              >
                <Navigation className="w-3.5 h-3.5" />
                Get directions
              </a>
            </div>
          </Card>

          {provider.badges.length > 0 && (
            <Card className="p-5 cn-rise" style={stagger(5, 70)}>
              <h2 className="text-sm font-medium">Verified by Connecta</h2>
              <ul className="mt-4 space-y-3">
                {provider.badges.map((badge, i) => (
                  <li key={badge} className="flex items-center gap-3 text-sm text-ink-2">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${BADGE_TONES[i % BADGE_TONES.length]}`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                    {badge}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {(provider.phone || whatsappHref) && (
            <Card className="p-5 cn-rise" style={stagger(6, 70)}>
              <h2 className="text-sm font-medium">Contact</h2>
              <div className="mt-4 space-y-2.5 text-sm">
                {provider.phone && (
                  <a href={`tel:${provider.phone}`} className="flex items-center gap-2.5 text-ink-2 hover:text-ink">
                    <Phone className="w-4 h-4 text-subtle" />
                    {provider.phone}
                  </a>
                )}
                {whatsappHref && (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-ink-2 hover:text-success-ink">
                    <MessageCircle className="w-4 h-4 text-subtle" />
                    Message on WhatsApp
                  </a>
                )}
              </div>
              <p className="mt-4 pt-4 border-t border-line text-xs text-muted leading-relaxed">
                Book through Connecta to keep your payment protected until the job is done.
              </p>
            </Card>
          )}
        </div>
      </div>

      {relatedProviders.length > 0 && (
        <section className="mt-12">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-medium">More professionals near {provider.city}</h2>
              <p className="text-[13px] text-muted mt-0.5">Verified and reviewed by local clients.</p>
            </div>
            <Link
              href={`/discover?city=${encodeURIComponent(provider.city)}`}
              className="shrink-0 text-[13px] text-muted hover:text-ink inline-flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedProviders.map((rel, i) => (
              <Link key={rel.id} href={`/discover/${rel.id}`} className="group block cn-rise" style={stagger(i, 60)}>
                <Card interactive className="p-5 h-full">
                  <div className="flex items-center gap-3">
                    <ProviderPhoto provider={rel} size={44} />
                    <div className="min-w-0">
                      <div className="text-[15px] font-medium truncate group-hover:text-azure-600 transition-colors">{rel.fullName}</div>
                      <div className="text-[13px] text-muted truncate">{rel.category}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3.5 border-t border-line flex items-center justify-between text-[13px]">
                    <Stars rating={rel.averageRating} />
                    <span className="text-ink">{naira(rel.hourlyRateMinor)}/hr</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Modal open={isShareOpen} onClose={() => setIsShareOpen(false)} title="Share this profile" description="Know someone who needs a reliable pro?">
        <div className="space-y-5">
          <div className="flex items-center gap-3 rounded-xl border border-line p-3.5">
            <ProviderPhoto provider={provider} size={40} />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{provider.fullName}</div>
              <div className="text-xs text-muted truncate">
                {provider.category} · {provider.city}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <input readOnly value={shareUrl} aria-label="Profile link" className={`${inputClass} text-muted`} onFocus={(e) => e.target.select()} />
            <Button variant={copied ? 'success' : 'dark'} onClick={copyLink} className="shrink-0">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {shareTargets.map((t) => (
              <a
                key={t.label}
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`h-10 rounded-[10px] border border-line text-[13px] text-ink-2 inline-flex items-center justify-center gap-1.5 transition-colors ${t.tone}`}
              >
                {t.label === 'Email' && <Mail className="w-3.5 h-3.5" />}
                {t.label}
              </a>
            ))}
          </div>

          {canNativeShare && (
            <Button variant="secondary" onClick={nativeShare} className="w-full">
              <Share2 className="w-4 h-4" />
              More options
            </Button>
          )}
        </div>
      </Modal>

      <Modal
        open={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title={`Review ${provider.fullName.split(' ')[0]}`}
        description="Honest reviews help neighbours hire with confidence."
      >
        {reviewPosted ? (
          <div className="py-6 text-center cn-pop">
            <div className="w-12 h-12 mx-auto rounded-full bg-success-50 text-success-ink flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <p className="mt-3 text-[15px] font-medium">Thanks, your review is live.</p>
          </div>
        ) : (
          <form onSubmit={submitReview} className="space-y-5" noValidate>
            {reviewError && <Notice tone="danger">{reviewError}</Notice>}
            <StarPicker value={ratingInput} onChange={setRatingInput} />
            <Field label="What was the job?" htmlFor="rv-project">
              <input
                id="rv-project"
                type="text"
                value={projectInput}
                onChange={(e) => setProjectInput(e.target.value)}
                placeholder={`e.g. ${provider.skills[0] || provider.category}`}
                className={inputClass}
              />
            </Field>
            <Field label="Your review" htmlFor="rv-comment">
              <textarea
                id="rv-comment"
                rows={4}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Were they on time? How was the quality of the work?"
                className={textareaClass}
              />
            </Field>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setIsReviewOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="warm" loading={isSubmitting}>
                {isSubmitting ? 'Posting review' : 'Post review'}
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <Modal
        open={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        title="Sign in to leave a review"
        description="Reviews come from Connecta clients, so everyone can trust them."
      >
        <div className="flex flex-col gap-2">
          <Button href={`/login?redirect=/discover/${provider.id}`} className="w-full">
            Sign in
          </Button>
          <Button variant="secondary" href="/register" className="w-full">
            Create a free account
          </Button>
        </div>
      </Modal>
    </PublicShell>
  )
}
