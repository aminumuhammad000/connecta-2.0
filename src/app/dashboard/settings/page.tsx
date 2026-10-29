'use client'

import React, { useState, useEffect } from 'react'
import { User, Landmark, ShieldCheck, ChevronDown } from 'lucide-react'
import { PageLoader } from '@/components/brand/ConnectaLoader'
import {
  Avatar,
  Badge,
  Button,
  Card,
  Field,
  Notice,
  PageHeader,
  Segmented,
  inputClass,
  stagger,
  textareaClass,
} from '@/components/dashboard/ui'

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

const NIGERIAN_CITIES = ['Lagos', 'Abuja (FCT)', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu', 'Benin City', 'Abeokuta', 'Kaduna', 'Calabar']

type Tab = 'profile' | 'payout'

function SelectInput({
  id,
  value,
  onChange,
  options,
  format = (o: string) => o,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  options: string[]
  format?: (o: string) => string
}) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} appearance-none pr-9 cursor-pointer`}>
        {options.map((o) => (
          <option key={o} value={o}>
            {format(o)}
          </option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
    </div>
  )
}

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
        body: JSON.stringify({ fullName, phone, whatsapp, city, headline, trade, bio, bankName, accountNumber, accountName }),
      })
      if (res.ok) {
        setSuccessMessage('Your changes are saved.')
        setTimeout(() => setSuccessMessage(null), 4000)
      }
    } catch (err) {
      console.error('Failed to save settings:', err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <PageLoader label="Loading your settings" />

  const cityOptions = NIGERIAN_CITIES.includes(city) ? NIGERIAN_CITIES : [city, ...NIGERIAN_CITIES]
  const bankOptions = NIGERIAN_BANKS.includes(bankName) ? NIGERIAN_BANKS : [bankName, ...NIGERIAN_BANKS]

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Settings" title="Your account" description="How you appear on contracts, and where we send your money." />

      {successMessage && (
        <Notice tone="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Notice>
      )}

      <Card className="p-5 sm:p-6 flex items-center gap-4 cn-rise" style={stagger(1, 80)}>
        <Avatar name={fullName} size={56} />
        <div className="min-w-0 flex-1">
          <div className="text-base font-medium text-ink truncate">{fullName || 'Your name'}</div>
          <div className="text-[13px] text-muted truncate">{headline || email}</div>
        </div>
        <Badge tone="success" dot className="hidden sm:inline-flex">
          Verified
        </Badge>
      </Card>

      <div className="cn-rise" style={stagger(2, 80)}>
        <Segmented<Tab>
          value={activeTab}
          onChange={setActiveTab}
          items={[
            { value: 'profile', label: 'Profile', icon: User },
            { value: 'payout', label: 'Payout account', icon: Landmark },
          ]}
        />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {activeTab === 'profile' && (
          <Card key="profile" className="cn-rise">
            <div className="px-6 py-5 border-b border-line">
              <h2 className="text-base font-medium text-ink">Profile</h2>
              <p className="text-[13px] text-muted mt-0.5">Shown on your contracts and quotes.</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Full name" htmlFor="s-name">
                <input id="s-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} required />
              </Field>
              <Field label="Email" htmlFor="s-email" hint="Contact support to change your email.">
                <input id="s-email" type="email" value={email} disabled className={inputClass} />
              </Field>
              <Field label="Phone" htmlFor="s-phone">
                <input id="s-phone" type="tel" placeholder="+234 801 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
              </Field>
              <Field label="WhatsApp" htmlFor="s-whatsapp">
                <input id="s-whatsapp" type="tel" placeholder="+234 801 234 5678" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={inputClass} />
              </Field>
              <Field label="City" htmlFor="s-city">
                <SelectInput id="s-city" value={city} onChange={setCity} options={cityOptions} format={(c) => `${c}, Nigeria`} />
              </Field>
              <Field label="Trade" htmlFor="s-trade">
                <input id="s-trade" type="text" placeholder="e.g. Solar installation" value={trade} onChange={(e) => setTrade(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Headline" htmlFor="s-headline" className="sm:col-span-2">
                <input
                  id="s-headline"
                  type="text"
                  placeholder="e.g. Certified solar technician"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label="About you" htmlFor="s-bio" className="sm:col-span-2">
                <textarea
                  id="s-bio"
                  rows={4}
                  placeholder="Your experience, the work you love doing, and any guarantees you offer"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className={textareaClass}
                />
              </Field>
            </div>
          </Card>
        )}

        {activeTab === 'payout' && (
          <Card key="payout" className="cn-rise">
            <div className="px-6 py-5 border-b border-line">
              <h2 className="text-base font-medium text-ink">Payout account</h2>
              <p className="text-[13px] text-muted mt-0.5">Withdrawals and released payments are sent here.</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Bank" htmlFor="s-bank">
                <SelectInput id="s-bank" value={bankName} onChange={setBankName} options={bankOptions} />
              </Field>
              <Field label="Account number" htmlFor="s-acct" hint="10-digit NUBAN">
                <input
                  id="s-acct"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                  className={`${inputClass} tracking-[0.12em] tabular-nums`}
                  required
                />
              </Field>
              <Field label="Account name" htmlFor="s-acct-name" hint="Exactly as it appears at your bank." className="sm:col-span-2">
                <input
                  id="s-acct-name"
                  type="text"
                  placeholder="e.g. Ibrahim Suleiman"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className={inputClass}
                  required
                />
              </Field>
              <div className="sm:col-span-2 flex items-start gap-3 rounded-xl bg-canvas border border-line p-4">
                <ShieldCheck className="w-5 h-5 text-success shrink-0" />
                <p className="text-[13px] text-ink-2 leading-relaxed">
                  Payouts travel through regulated Nigerian banking rails, verified end to end through NIBSS.
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-end">
          <Button type="submit" variant="success" loading={isSaving}>
            {isSaving ? 'Saving' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
