import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getPublicProviderById,
  getAllPublicProviders,
  generateProviderSchema,
} from '@/lib/server/providers'
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowRight,
  ChevronRight,
  Phone,
  Mail,
  Share2,
  Lock,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  const providers = getAllPublicProviders()
  return providers.map((p) => ({ id: p.id }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const provider = getPublicProviderById(id)

  if (!provider) {
    return {
      title: 'Service Provider Profile | Connecta',
      description: 'Find verified artisans and technicians across Nigeria on Connecta.',
    }
  }

  const nairaRate = Math.round(provider.hourlyRateMinor / 100).toLocaleString()

  return {
    title: `${provider.businessName} - Verified ${provider.category} Specialist in ${provider.city} | Connecta`,
    description: `${provider.headline}. Hourly rate: ₦${nairaRate}/hr. Rated ${provider.averageRating}/5 based on ${provider.reviewCount} verified client reviews in ${provider.city}, Nigeria. 100% Escrow Safeguarded.`,
    keywords: [
      provider.fullName,
      provider.businessName,
      provider.category,
      `${provider.category} ${provider.city}`,
      ...provider.skills,
      'Connecta verified specialist',
    ],
    alternates: {
      canonical: `https://myconnecta.ng/discover/${provider.id}`,
    },
    openGraph: {
      title: `${provider.businessName} | Connecta Verified ${provider.category}`,
      description: provider.bio,
      url: `https://myconnecta.ng/discover/${provider.id}`,
      type: 'profile',
      images: [
        {
          url: provider.avatarUrl || 'https://myconnecta.ng/brand/social/connecta-social-avatar-512.png',
          width: 512,
          height: 512,
          alt: provider.businessName,
        },
      ],
    },
  }
}

export default async function ProviderProfilePage({ params }: PageProps) {
  const { id } = await params
  const provider = getPublicProviderById(id)

  if (!provider) {
    notFound()
  }

  const jsonLd = generateProviderSchema(provider)
  const nairaRate = Math.round(provider.hourlyRateMinor / 100).toLocaleString()

  // Get 3 other related specialists in the same category or city
  const allProviders = getAllPublicProviders()
  const relatedProviders = allProviders
    .filter((p) => p.id !== provider.id && (p.categorySlug === provider.categorySlug || p.city === provider.city))
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col justify-between selection:bg-[#10B981]/20">
      {/* Search Engine Structured Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Header */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-slate-200/70 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-36 h-8 sm:w-44 sm:h-10">
              <Image
                src="/brand/svg/connecta-logo.svg"
                alt="Connecta"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/discover"
              className="text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-900 transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition-colors hidden sm:inline"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding?step=role"
              className="text-xs sm:text-sm font-extrabold px-5 py-2.5 rounded-full bg-[#053F28] hover:bg-[#032a1b] text-white shadow-sm transition-all hover:scale-105"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {/* Breadcrumb & Hero Banner */}
        <section className="bg-gradient-to-b from-white via-emerald-50/20 to-[#F5F7FC] border-b border-slate-200/70 pt-6 sm:pt-8 pb-8 px-4">
          <div className="max-w-6xl mx-auto space-y-4">
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <Link href="/" className="hover:text-emerald-700">Home</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/discover" className="hover:text-emerald-700">Discover</Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">{provider.category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-emerald-800 font-bold truncate max-w-[200px]">{provider.businessName}</span>
            </nav>

            {/* Profile Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[#053F28] to-[#10B981] flex items-center justify-center text-white font-black text-3xl shadow-md shrink-0 overflow-hidden">
                  {provider.avatarUrl ? (
                    <Image
                      src={provider.avatarUrl}
                      alt={provider.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span>{provider.fullName.slice(0, 2).toUpperCase()}</span>
                  )}
                  {provider.verificationStatus === 'verified' && (
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0A1020] tracking-tight">
                      {provider.businessName}
                    </h1>
                    <span className="px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
                      {provider.category}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-600">
                    Lead Specialist: <strong className="text-slate-900">{provider.fullName}</strong>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-semibold pt-1">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{provider.city}, {provider.state}</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{provider.experienceYears}+ Years Practical Experience</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{provider.averageRating.toFixed(2)} ({provider.reviewCount} reviews)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Trust Badges */}
              <div className="flex flex-wrap md:flex-col gap-2 shrink-0 w-full md:w-auto">
                {provider.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Two-Column Details Layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Bio, Skills, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Headline & Bio */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Professional Overview
              </h2>
              <h3 className="text-base font-bold text-emerald-900 leading-snug">
                {provider.headline}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {provider.bio}
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Operating on Connecta since {new Date(provider.joinedDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
              </div>
            </section>

            {/* Core Skills & Specializations */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Verified Skills &amp; Services
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                All skills listed below have been vetted against verified trade qualifications and customer feedback:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {provider.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Verification & Safeguard Checklist */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-slate-900">
                Trust &amp; Identity Verification
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Identity &amp; NIN Verified</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    National Identification Number and biometric checks validated by Connecta Trust Desk.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                    <Award className="w-4 h-4 text-emerald-700" />
                    <span>Trade Guild Accredited</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verified practical apprenticeship or vocational qualification certificate in {provider.category}.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                    <Lock className="w-4 h-4 text-emerald-700" />
                    <span>100% Escrow Protected</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Funds remain securely locked until you inspect and approve milestones on-site.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Clean Dispute Record</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Zero unresolved arbitration complaints across {provider.completedJobsCount} completed jobs.
                  </p>
                </div>
              </div>
            </section>

            {/* Customer Reviews Section */}
            <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900">
                    Verified Client Reviews
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Feedback from authentic completed escrow contracts
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span className="text-xs font-black text-slate-900">{provider.averageRating.toFixed(2)}</span>
                  <span className="text-[11px] text-slate-500 font-bold">({provider.reviewCount})</span>
                </div>
              </div>

              {provider.reviews.length > 0 ? (
                <div className="space-y-4">
                  {provider.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-extrabold text-slate-900 text-sm">
                          {rev.authorName}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'text-amber-500 fill-amber-400'
                                  : 'text-slate-200 fill-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-800">
                        {rev.projectTitle}
                      </div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                      <div className="text-[10px] text-slate-400 font-semibold pt-1">
                        Completed: {rev.date} • Verified Escrow Release
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Reviews are currently being consolidated by the Connecta Trust Desk.
                </p>
              )}
            </section>
          </div>

          {/* Right Column: Pricing & Direct Hire Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md space-y-6 sticky top-24">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                  Standard Hourly Rate
                </span>
                <div className="text-3xl font-black text-emerald-800 tracking-tight">
                  ₦{nairaRate}
                  <span className="text-sm text-slate-400 font-normal"> / hr</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Milestone-based or fixed project quotes also available.
                </p>
              </div>

              {/* Direct Booking Actions */}
              <div className="space-y-3 pt-2">
                <Link
                  href={`/requests/new?providerId=${provider.id}&category=${encodeURIComponent(provider.category)}`}
                  className="w-full py-4 rounded-full bg-[#053F28] hover:bg-[#032a1b] text-white text-center font-extrabold text-sm shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span>Hire with Escrow Protection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href={`https://wa.me/2348123456789?text=Hi%20Connecta,%20I%20am%20interested%20in%20hiring%20${encodeURIComponent(provider.businessName)}%20(${provider.id})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-center font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inquire via Connecta Desk</span>
                </Link>
              </div>

              {/* Escrow Guarantee Pill */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-medium space-y-1.5">
                <div className="flex items-center gap-1.5 font-black text-emerald-800">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Connecta Payment Guarantee</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Your funds are locked in Escrow custody and never released until the job is completed, inspected, and approved by you.
                </p>
              </div>

              {/* Specialist Fast Facts */}
              <div className="space-y-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <strong className="text-slate-800">{provider.city}, Nigeria</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Completed Jobs</span>
                  <strong className="text-slate-800">{provider.completedJobsCount}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Average Rating</span>
                  <strong className="text-slate-800">{provider.averageRating.toFixed(2)} ★</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Response Time</span>
                  <strong className="text-emerald-700">&lt; 15 mins</strong>
                </div>
              </div>
            </div>

            {/* Similar Specialists Recommendation */}
            {relatedProviders.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900">
                  Other Specialists in {provider.city}
                </h3>
                <div className="space-y-3">
                  {relatedProviders.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/discover/${rel.id}`}
                      className="block p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors space-y-1 group"
                    >
                      <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700">
                        {rel.businessName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center justify-between">
                        <span>{rel.category}</span>
                        <span className="font-bold text-amber-600">★ {rel.averageRating.toFixed(2)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Connecta Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/discover" className="text-emerald-700 font-bold hover:underline">
              Discover All Providers
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-slate-800 hover:underline">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-800 hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
