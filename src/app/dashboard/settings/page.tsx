'use client'

import React, { useState, useEffect } from 'react'
import {
  User,
  Building,
  CheckCircle2,
  ShieldCheck,
  Save,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  AlertCircle,
} from 'lucide-react'

const NIGERIAN_BANKS = [
  'Guaranty Trust Bank (GTBank)',
  'Zenith Bank',
  'Access Bank',
  'First Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Kuda Microfinance Bank',
  'OPay (PayCom)',
  'Moniepoint Microfinance Bank',
  'Stanbic IBTC Bank',
  'First City Monument Bank (FCMB)',
  'Sterling Bank',
  'Fidelity Bank',
  'Union Bank of Nigeria',
  'Wema Bank / ALAT',
]

const NIGERIAN_CITIES = [
  'Lagos',
  'Abuja (FCT)',
  'Port Harcourt',
  'Ibadan',
  'Kano',
  'Enugu',
  'Benin City',
  'Abeokuta',
  'Kaduna',
  'Calabar',
]

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'payout'>('profile')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [city, setCity] = useState('Lagos')
  const [headline, setHeadline] = useState('')
  const [trade, setTrade] = useState('')
  const [bio, setBio] = useState('')
  const [bankName, setBankName] = useState(NIGERIAN_BANKS[0])
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/dashboard/settings')
        if (res.ok) {
          const body = await res.json()
          const p = body.data?.profile
          if (p) {
            setFullName(p.fullName || '')
            setEmail(p.email || '')
            setPhone(p.phone || '')
            setWhatsapp(p.whatsapp || '')
            setCity(p.city || 'Lagos')
            setHeadline(p.headline || '')
            setTrade(p.trade || 'Solar & Electrical')
            setBio(p.bio || '')
            setBankName(p.bankName || NIGERIAN_BANKS[0])
            setAccountNumber(p.accountNumber || '')
            setAccountName(p.accountName || p.fullName || '')
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    try {
      const res = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          phone,
          whatsapp,
          city,
          headline,
          trade,
          bio,
          bankName,
          accountNumber,
          accountName,
        }),
      })

      if (res.ok) {
        setSuccessMessage('Your settings have been saved successfully.')
        setTimeout(() => setSuccessMessage(null), 4000)
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-zinc-200/60">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
          Account &amp; Settlement
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mt-1">
          Settings &amp; Payout Account
        </h1>
        <p className="text-xs text-zinc-500 mt-0.5 font-normal">
          Manage your trade identity, contact channels, and Nigerian bank account for milestone settlements.
        </p>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile &amp; Contact</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payout')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'payout'
              ? 'bg-zinc-900 text-white font-semibold'
              : 'text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Payout Bank Account</span>
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-6 h-6 text-[#0C513F] animate-spin" />
          <span className="text-xs text-zinc-400">Loading settings...</span>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Personal &amp; Trade Identity</h3>
                  <p className="text-xs text-zinc-500">Details displayed on project contracts and proposals.</p>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Member
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-900 font-normal focus:outline-none focus:border-[#0C513F]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500 font-normal cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700">Phone Number (Calling)</label>
                  <input
                    type="tel"
                    placeholder="+234 801 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-900 font-normal focus:outline-none focus:border-[#0C513F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700">WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+234 801 234 5678"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-900 font-normal focus:outline-none focus:border-[#0C513F]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700">Operating City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-900 font-normal focus:outline-none focus:border-[#0C513F] bg-white"
                  >
                    {NIGERIAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}, Nigeria
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700">Primary Trade Discipline</label>
                  <input
                    type="text"
                    placeholder="e.g. Solar Energy &amp; Inverter Installation"
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-900 font-normal focus:outline-none focus:border-[#0C513F]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-medium text-zinc-700">Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Certified Solar Technician &amp; Clean Energy Contractor"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-900 font-normal focus:outline-none focus:border-[#0C513F]"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-medium text-zinc-700">Bio &amp; Service Experience</label>
                <textarea
                  rows={3}
                  placeholder="Describe your trade background, years of practice, and client warranties..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-900 font-normal focus:outline-none focus:border-[#0C513F]"
                />
              </div>
            </div>
          )}

          {activeTab === 'payout' && (
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-5">
              <div className="pb-3 border-b border-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-900">Nigerian Bank Account (Flutterwave)</h3>
                <p className="text-xs text-zinc-500">
                  Approved milestone payouts and wallet withdrawals will disburse directly to this account.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700">Bank Name</label>
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-900 font-normal focus:outline-none focus:border-[#0C513F] bg-white"
                  >
                    {NIGERIAN_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-medium text-zinc-700">NUBAN Account Number (10 Digits)</label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="0123456789"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-900 font-semibold focus:outline-none focus:border-[#0C513F]"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="font-medium text-zinc-700">Account Holder Name (as registered with CBN/NIBSS)</label>
                <input
                  type="text"
                  placeholder="e.g. Ibrahim Suleiman / Suleiman Solar Engineering Ltd"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-900 font-normal focus:outline-none focus:border-[#0C513F]"
                  required
                />
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-zinc-600 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-medium text-zinc-900">Protected Settlement Rails</div>
                  <div>
                    Funds are disbursed via regulated Nigerian banking channels with end-to-end NIBSS verification.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
