'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  Wrench,
  Zap,
  Smartphone,
  Laptop,
  Car,
  Hammer,
  Clock,
  MapPin,
  CheckCircle2,
  UploadCloud,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  X,
} from 'lucide-react'

const CATEGORIES = [
  { id: 'c1010000-0000-0000-0000-000000000001', name: 'Plumbing & Leaks', icon: Wrench, slug: 'plumbing' },
  { id: 'c1010000-0000-0000-0000-000000000002', name: 'Electrical & Inverter', icon: Zap, slug: 'electrical' },
  { id: 'c1010000-0000-0000-0000-000000000003', name: 'Phone Screen & Battery', icon: Smartphone, slug: 'phone-repair' },
  { id: 'c1010000-0000-0000-0000-000000000004', name: 'Computer Hardware/OS', icon: Laptop, slug: 'computer-repair' },
  { id: 'c1010000-0000-0000-0000-000000000006', name: 'Auto Mechanic & Brakes', icon: Car, slug: 'auto-mechanic' },
  { id: 'c1010000-0000-0000-0000-000000000005', name: 'Carpentry & Woodwork', icon: Hammer, slug: 'carpentry' },
]

const PROVIDERS_MAP: Record<string, { name: string; trade: string; avatar: string; location: string; defaultCat: string }> = {
  p1: {
    name: 'Ibrahim Aliyu',
    trade: 'Master Electrician & Solar Installer',
    avatar: '/images/services/nigerian_electrician_ibrahim.jpg',
    location: 'Kano / Lagos',
    defaultCat: 'c1010000-0000-0000-0000-000000000002',
  },
  p2: {
    name: 'Jonah Blessing',
    trade: 'Certified Plumber & Pipe Maintenance Lead',
    avatar: '/images/services/nigerian_plumber_jonah.jpg',
    location: 'Port Harcourt / Lagos',
    defaultCat: 'c1010000-0000-0000-0000-000000000001',
  },
  p3: {
    name: 'Kabiru Sani',
    trade: 'Master Carpenter & Architectural Joiner',
    avatar: '/images/services/nigerian_carpenter_kabiru.jpg',
    location: 'Abuja / Kano',
    defaultCat: 'c1010000-0000-0000-0000-000000000005',
  },
  p4: {
    name: 'Salamah Othman',
    trade: 'Device Diagnostics & Electronics Technician',
    avatar: '/images/services/nigerian_specialist_salamah.jpg',
    location: 'Lagos, Nigeria',
    defaultCat: 'c1010000-0000-0000-0000-000000000003',
  },
}

function NewServiceRequestContent() {
  const searchParams = useSearchParams()
  const qParam = searchParams.get('q') || ''
  const catParam = searchParams.get('category') || ''
  const providerIdParam = searchParams.get('providerId') || ''

  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].id)
  const [title, setTitle] = useState(qParam)
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<'emergency' | 'today' | 'scheduled' | 'flexible'>('today')
  const [providerId, setProviderId] = useState(providerIdParam)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Initialize and react to query parameters
  useEffect(() => {
    if (qParam && !title) {
      setTitle(qParam)
    }

    // Auto-match category from category slug
    if (catParam) {
      const matched = CATEGORIES.find(
        (c) => c.slug.toLowerCase() === catParam.toLowerCase() || c.id === catParam
      )
      if (matched) {
        setSelectedCat(matched.id)
      }
    }

    // Auto-match provider and set relevant default category
    if (providerIdParam && PROVIDERS_MAP[providerIdParam]) {
      setProviderId(providerIdParam)
      const prov = PROVIDERS_MAP[providerIdParam]
      if (prov.defaultCat) {
        setSelectedCat(prov.defaultCat)
      }
    }

    // Infer category from qParam if available and category wasn't explicit
    if (qParam && !catParam) {
      const qLower = qParam.toLowerCase()
      if (qLower.includes('plumb') || qLower.includes('pipe') || qLower.includes('leak') || qLower.includes('borehole')) {
        setSelectedCat('c1010000-0000-0000-0000-000000000001')
      } else if (qLower.includes('electric') || qLower.includes('solar') || qLower.includes('inverter') || qLower.includes('wire') || qLower.includes('wiring')) {
        setSelectedCat('c1010000-0000-0000-0000-000000000002')
      } else if (qLower.includes('phone') || qLower.includes('screen') || qLower.includes('gadget') || qLower.includes('tablet')) {
        setSelectedCat('c1010000-0000-0000-0000-000000000003')
      } else if (qLower.includes('computer') || qLower.includes('laptop') || qLower.includes('software') || qLower.includes('react') || qLower.includes('dev') || qLower.includes('web') || qLower.includes('ui/ux') || qLower.includes('design')) {
        setSelectedCat('c1010000-0000-0000-0000-000000000004')
      } else if (qLower.includes('auto') || qLower.includes('mechanic') || qLower.includes('car') || qLower.includes('brake')) {
        setSelectedCat('c1010000-0000-0000-0000-000000000006')
      } else if (qLower.includes('carpenter') || qLower.includes('wood') || qLower.includes('furniture')) {
        setSelectedCat('c1010000-0000-0000-0000-000000000005')
      }
    }
  }, [qParam, catParam, providerIdParam])

  const selectedProvider = providerId ? PROVIDERS_MAP[providerId] : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: selectedCat,
          title,
          description,
          urgency,
          providerId: providerId || undefined,
          serviceMode: 'onsite',
        }),
      })
    } catch {
      // In offline/simulated mode continue
    }
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header className="border-b border-slate-200 bg-white py-4 px-6 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-[#0C513F] flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105 shrink-0">
              <div className="relative w-4.5 h-4.5">
                <Image
                  src="/brand/connecta-header-icon.svg"
                  alt="Connecta Icon"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#0A1020]">
              connecta
            </span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Nigeria &amp; Pan-Africa</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10">
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {selectedProvider
                ? `Direct Request Sent to ${selectedProvider.name}!`
                : 'Service Request Broadcasted!'}
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {selectedProvider
                ? `${selectedProvider.name} has received your direct job brief and will review your specifications to provide a milestone quote.`
                : 'Your project brief has been dispatched to fit-ranked verified providers matching your trade and location.'}
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1.5 max-w-sm mx-auto">
              <div className="font-semibold text-slate-800">What Happens Next:</div>
              <div>• {selectedProvider ? 'The specialist reviews your brief and issues a milestone estimate.' : 'Specialists review your requirements and submit verified quotes.'}</div>
              <div>• 100% milestone funds remain in escrow and are released only when you approve completed work.</div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-[#0C513F] hover:bg-[#083b2e] px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              Back to Marketplace
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
            {/* Direct Provider Selected Banner */}
            {selectedProvider && (
              <div className="p-4 rounded-2xl bg-[#0A2614] text-white flex items-center justify-between gap-4 border border-emerald-500/20 shadow-md">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/20">
                    <Image
                      src={selectedProvider.avatar}
                      alt={selectedProvider.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        Direct Booking
                      </span>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="font-extrabold text-sm sm:text-base text-white truncate">
                      {selectedProvider.name}
                    </div>
                    <div className="text-xs text-emerald-100/80 truncate">
                      {selectedProvider.trade} • {selectedProvider.location}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setProviderId('')}
                  className="text-xs font-semibold text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full shrink-0 transition-colors flex items-center gap-1"
                  title="Switch to open broadcast"
                >
                  <X className="w-3 h-3" />
                  <span>Broadcast Instead</span>
                </button>
              </div>
            )}

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedProvider
                  ? `Request a Quote from ${selectedProvider.name}`
                  : 'Describe What You Need & Get Matched'}
              </h1>
              <p className="text-sm text-slate-600 mt-1 font-medium">
                {selectedProvider
                  ? 'Submit your project details directly. Backed by Connecta milestone escrow protection.'
                  : 'Tell Connecta what your project needs. Verified African professionals will review and submit transparent quotes.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5">
                  1. Select Trade / Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon
                    const isSelected = selectedCat === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCat(cat.id)}
                        className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#0C513F] bg-emerald-50/80 text-[#0C513F] font-bold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <Icon className="w-5 h-5 shrink-0" />
                        <span className="text-xs">{cat.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Brief Summary of the Work
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solar inverter battery installation, Leaking pipe repair, UI/UX redesign..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0C513F] focus:ring-2 focus:ring-[#0C513F]/15 font-medium text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  3. Full Project Requirements
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain deliverables, timeline, appliance brand/model, existing setup, or project specifications..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0C513F] focus:ring-2 focus:ring-[#0C513F]/15 font-medium text-slate-900 leading-relaxed"
                  required
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  4. Urgency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-medium">
                  {[
                    { id: 'emergency', label: 'Emergency (ASAP)' },
                    { id: 'today', label: 'Today' },
                    { id: 'scheduled', label: 'Scheduled Date' },
                    { id: 'flexible', label: 'Flexible' },
                  ].map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setUrgency(u.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        urgency === u.id
                          ? 'border-[#0C513F] bg-emerald-50 text-[#0C513F] font-black shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                  5. Attach Diagnostic Photos / Project Files (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-[#0C513F] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-xs font-bold text-slate-700">
                    Upload photos or project brief files
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Providing clear details produces faster and more accurate proposals.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#0C513F] text-white font-extrabold text-sm hover:bg-[#083b2e] transition-all flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                <span>
                  {selectedProvider
                    ? `Submit Direct Request to ${selectedProvider.name}`
                    : 'Broadcast Request to Verified Specialists'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default function NewServiceRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
      <NewServiceRequestContent />
    </Suspense>
  )
}
