'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Wrench,
  Zap,
  Smartphone,
  Laptop,
  Car,
  Clock,
  MapPin,
  CheckCircle2,
  UploadCloud,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'

const CATEGORIES = [
  { id: 'c1010000-0000-0000-0000-000000000001', name: 'Plumbing & Leaks', icon: Wrench },
  { id: 'c1010000-0000-0000-0000-000000000002', name: 'Electrical & Inverter', icon: Zap },
  { id: 'c1010000-0000-0000-0000-000000000003', name: 'Phone Screen & Battery', icon: Smartphone },
  { id: 'c1010000-0000-0000-0000-000000000004', name: 'Computer Hardware/OS', icon: Laptop },
  { id: 'c1010000-0000-0000-0000-000000000006', name: 'Auto Mechanic & Brakes', icon: Car },
]

export default function NewServiceRequestPage() {
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].id)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [urgency, setUrgency] = useState<'emergency' | 'today' | 'scheduled' | 'flexible'>('today')
  const [isSubmitted, setIsSubmitted] = useState(false)

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
          <Link href="/" className="relative w-32 h-8 block">
            <Image
              src="/brand/svg/connecta-logo.svg"
              alt="Connecta Logo"
              fill
              className="object-contain"
            />
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            <MapPin className="w-3.5 h-3.5 text-[#1A73E8]" />
            <span>Kano State</span>
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
              Service Request Broadcasted!
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Your issue description has been dispatched to verified providers matching your trade and location in Kano.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1.5 max-w-sm mx-auto">
              <div className="font-semibold text-slate-800">Next Steps:</div>
              <div>• Providers will inspect your details and submit competitive quotes.</div>
              <div>• You will compare prices, ratings, and turnaround times before confirming.</div>
            </div>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-[#1A73E8] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1557b0] transition-colors"
            >
              Back to Marketplace
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Describe Your Issue & Request Quotes
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Verified local artisans will review your problem and submit transparent price estimates.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
                  1. Select Category
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
                        className={`p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all ${
                          isSelected
                            ? 'border-[#1A73E8] bg-blue-50/60 text-[#1A73E8]'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-semibold">{cat.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  2. Brief Summary of the Problem
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken water pipe leaking under kitchen cabinet"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#1A73E8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  3. Full Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain when the problem started, symptoms, appliance brand/model, and any prior attempts to fix it..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#1A73E8]"
                  required
                />
              </div>

              {/* Urgency */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
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
                      className={`p-3 rounded-xl border text-center transition-all ${
                        urgency === u.id
                          ? 'border-[#1A73E8] bg-blue-50 text-[#1A73E8] font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  5. Attach Diagnostic Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-[#1A73E8] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <div className="text-xs font-semibold text-slate-700">
                    Upload photos of the problem
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Helping technicians see the issue produces more accurate quotes.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#1A73E8] text-white font-semibold text-sm hover:bg-[#1557b0] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Broadcast Request to Kano Technicians</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
