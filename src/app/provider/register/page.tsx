'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  Wrench,
  MapPin,
  Sparkles,
} from 'lucide-react'

const TRADES = [
  'Plumbing & Pipefitting',
  'Electrical Installation & Wiring',
  'Phone & Tablet Repair',
  'Computer & Laptop Repair',
  'Auto Mechanics & Diagnostics',
  'Carpentry & Woodwork',
  'Painting & Finishing',
  'AC & Refrigeration',
]

export default function ProviderRegisterPage() {
  const [step, setStep] = useState(1)
  const [providerType, setProviderType] = useState<'individual' | 'business'>('individual')
  const [businessName, setBusinessName] = useState('')
  const [selectedTrade, setSelectedTrade] = useState(TRADES[0])
  const [headline, setHeadline] = useState('')
  const [bio, setBio] = useState('')
  const [experienceYears, setExperienceYears] = useState('3')
  const [serviceCity, setServiceCity] = useState('Kano')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white py-4 px-6 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative w-32 h-8 block">
            <Image
              src="/brand/svg/connecta-logo.svg"
              alt="Connecta Logo"
              fill
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>Kano Provider Onboarding</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-10 sm:py-14">
        {isSubmitted ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#10B981] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Application Submitted Successfully!
            </h1>
            <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
              Thank you for registering with Connecta. Your profile and verification documents have been queued for administrative review.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2 max-w-md mx-auto">
              <div className="font-semibold text-slate-800">What happens next:</div>
              <div>1. Identity & trade background verification (within 24–48 hours).</div>
              <div>2. You will receive an SMS and email notification upon approval.</div>
              <div>3. Once approved, your profile becomes publicly discoverable in Kano.</div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-[#1A73E8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1557b0] transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Step Header */}
            <div className="px-6 py-6 sm:px-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#1A73E8] uppercase tracking-wider">
                  Step {step} of 3
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                  {step === 1 && 'Professional Identity'}
                  {step === 2 && 'Trade & Experience'}
                  {step === 3 && 'Verification & Service Areas'}
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all ${
                      s === step ? 'w-8 bg-[#1A73E8]' : s < step ? 'w-2 bg-[#10B981]' : 'w-2 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Form Steps */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Provider Classification
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setProviderType('individual')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          providerType === 'individual'
                            ? 'border-[#1A73E8] bg-blue-50/50 text-[#1A73E8]'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-sm">Individual Artisan</div>
                        <div className="text-xs text-slate-500 mt-1">Solo technician or specialist</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setProviderType('business')}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          providerType === 'business'
                            ? 'border-[#1A73E8] bg-blue-50/50 text-[#1A73E8]'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="font-semibold text-sm">Registered Business</div>
                        <div className="text-xs text-slate-500 mt-1">Workshop, enterprise, or team</div>
                      </button>
                    </div>
                  </div>

                  {providerType === 'business' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Business / Workshop Name
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Kano Master Tech Services Ltd"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#1A73E8]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Master Inverter Technician & Residential Electrician"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#1A73E8]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Biography & Craft Experience
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      placeholder="Describe your training, certifications, tools, and the types of problems you solve best..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#1A73E8]"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Primary Trade Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {TRADES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setSelectedTrade(t)}
                          className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                            selectedTrade === t
                              ? 'border-[#1A73E8] bg-blue-50 text-[#1A73E8] font-semibold'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span>{t}</span>
                          {selectedTrade === t && <CheckCircle2 className="w-4 h-4 text-[#1A73E8]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Years of Hands-on Experience
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={experienceYears}
                      onChange={(e) => setExperienceYears(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#1A73E8]"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Service City
                    </label>
                    <input
                      type="text"
                      value={serviceCity}
                      onChange={(e) => setServiceCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#1A73E8]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Identity Verification Document (Govt ID / NIN / Voter Card)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-[#1A73E8] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
                      <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <div className="text-xs font-semibold text-slate-700">
                        Click to upload identity document
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        PNG, JPG, or PDF up to 10MB. Stored in private object storage.
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Your government ID is securely encrypted and only reviewed by authorized Connecta verification specialists. It is never displayed publicly.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1A73E8] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#1557b0] transition-colors"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#0ea572] transition-colors shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Verification Application</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
