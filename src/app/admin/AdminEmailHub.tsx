'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  Mail,
  Send,
  Users,
  Building2,
  Wrench,
  SlidersHorizontal,
  UserCheck,
  Search,
  CheckCircle2,
  X,
  Eye,
  RefreshCw,
} from 'lucide-react'

export interface UserItem {
  id: string
  fullName: string
  businessName: string
  email: string
  phone: string
  role: 'customer' | 'provider' | 'admin'
  city: string
  state: string
  trade: string
  verificationStatus: 'verified' | 'unverified'
  experienceYears: number
  averageRating: number
  completedJobs: number
  hourlyRateMinor: number
  joinedDate: string
  accountStatus: 'active' | 'suspended'
}

export interface EmailDispatchItem {
  id: string
  subject: string
  audienceType: 'all' | 'clients' | 'providers' | 'trade' | 'individual'
  targetTrade?: string
  recipientName?: string
  recipientEmail?: string
  recipientCount: number
  category: string
  message: string
  ctaText?: string
  ctaUrl?: string
  sentAt: string
  sentBy: string
  status: 'sent' | 'delivered'
}

interface AdminEmailHubProps {
  users: UserItem[]
  initialDispatches?: EmailDispatchItem[]
  preselectedUser?: UserItem | null
  onClearPreselectedUser?: () => void
}

const SERVICE_TRADE_OPTIONS = [
  { id: 'Plumbing', label: 'Plumbers & Pipefitters', keyword: 'plumb' },
  { id: 'Electrical', label: 'Electricians & Solar Installers', keyword: 'elect' },
  { id: 'Carpentry', label: 'Carpenters & Joinery Artisans', keyword: 'carpent' },
  { id: 'AC & Refrigeration', label: 'AC & Cooling Technicians', keyword: 'ac' },
  { id: 'Handyman', label: 'General Handyman & Maintenance', keyword: 'handyman' },
  { id: 'Painting', label: 'Painters & Wall Decorators', keyword: 'paint' },
  { id: 'Generator Repair', label: 'Generator Technicians', keyword: 'generator' },
  { id: 'Welding', label: 'Welders & Metal Fabricators', keyword: 'weld' },
  { id: 'Auto Mechanics', label: 'Auto Mechanics & Auto Electricians', keyword: 'auto' },
  { id: 'Cleaning', label: 'Deep Cleaning & Fumigators', keyword: 'clean' },
  { id: 'Solar & Inverter', label: 'Solar Power & Battery Specialists', keyword: 'solar' },
]

const EMAIL_TEMPLATES = [
  {
    label: 'Artisan Safety & Escrow Rules',
    category: 'Service Notice',
    subject: 'Milestone Escrow Protection & On-Site Guidelines for Kano Trades',
    message: `Dear {{name}},\n\nAs part of our commitment to safety, reliable service delivery, and fair compensation, all service providers in Kano are reminded to ensure work milestones are logged and confirmed inside the Connecta platform prior to completing installations.\n\nAll payments are safeguarded through the Connecta Escrow Vault. If you encounter any material delays or require additional parts approval, please submit a variation request directly from your dashboard.\n\nThank you for maintaining high craft standards across Kano.`,
    ctaText: 'Open Provider Dashboard',
    ctaUrl: '/dashboard',
  },
  {
    label: 'Client Verified Quality Guarantee',
    category: 'Announcement',
    subject: 'New Verified Specialist Guarantee: Fast Local Help in Kano',
    message: `Dear {{name}},\n\nFinding verified plumbers, master electricians, and skilled carpenters in Kano is now faster and more transparent.\n\nWith our 100% Escrow Guarantee, your funds are only released to technicians after you verify and inspect the completed repairs. Enjoy peace of mind with background-checked professionals near your neighbourhood.`,
    ctaText: 'Explore Verified Services',
    ctaUrl: '/discover',
  },
  {
    label: 'NIN & Guild Verification Notice',
    category: 'Security & Verification',
    subject: 'Action Required: Submit Your NIN & Trade License for Priority Listing',
    message: `Dear {{name}},\n\nTo maintain our verified badge and receive top placement in customer search results across Kano, please upload your National Identification Number (NIN) slip or Trade Guild Master License.\n\nVerified specialists receive up to 4x more customer bookings and faster escrow payouts.`,
    ctaText: 'Complete Verification',
    ctaUrl: '/admin/verification',
  },
]

export default function AdminEmailHub({
  users,
  initialDispatches = [],
  preselectedUser = null,
  onClearPreselectedUser,
}: AdminEmailHubProps) {
  const [emailDispatches, setEmailDispatches] = useState<EmailDispatchItem[]>(initialDispatches)
  const [emailAudience, setEmailAudience] = useState<'all' | 'clients' | 'providers' | 'trade' | 'individual'>(
    preselectedUser ? 'individual' : 'all'
  )
  const [targetTrade, setTargetTrade] = useState('Plumbing')
  const [selectedEmailUser, setSelectedEmailUser] = useState<UserItem | null>(preselectedUser)
  const [userEmailSearch, setUserEmailSearch] = useState('')
  const [emailSubject, setEmailSubject] = useState('')
  const [emailCategory, setEmailCategory] = useState('Announcement')
  const [emailMessage, setEmailMessage] = useState('')
  const [emailCtaText, setEmailCtaText] = useState('')
  const [emailCtaUrl, setEmailCtaUrl] = useState('')
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null)
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const [selectedSentEmail, setSelectedSentEmail] = useState<EmailDispatchItem | null>(null)

  // Filtered users for individual recipient selection
  const userRecipientOptions = useMemo(() => {
    if (!userEmailSearch.trim()) return users
    const q = userEmailSearch.toLowerCase().trim()
    return users.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.trade.toLowerCase().includes(q)
    )
  }, [users, userEmailSearch])

  // Dynamic recipient calculation
  const calculatedRecipientsCount = useMemo(() => {
    if (emailAudience === 'individual') {
      return selectedEmailUser ? 1 : 0
    }
    if (emailAudience === 'clients') {
      return users.filter((u) => u.role === 'customer').length
    }
    if (emailAudience === 'providers') {
      return users.filter((u) => u.role === 'provider').length
    }
    if (emailAudience === 'trade') {
      const selected = SERVICE_TRADE_OPTIONS.find((t) => t.id === targetTrade)
      const kw = (selected?.keyword || targetTrade).toLowerCase()
      const matches = users.filter(
        (u) =>
          u.role === 'provider' &&
          (u.trade.toLowerCase().includes(kw) || u.city.toLowerCase().includes(kw))
      ).length
      return matches > 0 ? matches : 6
    }
    return users.length
  }, [emailAudience, selectedEmailUser, users, targetTrade])

  const handleSendEmail = async () => {
    if (!emailSubject.trim()) {
      alert('Please enter an email subject line.')
      return
    }
    if (!emailMessage.trim()) {
      alert('Please enter your email message body.')
      return
    }
    if (emailAudience === 'individual' && !selectedEmailUser) {
      alert('Please select an individual user recipient.')
      return
    }

    setIsSendingEmail(true)
    setEmailSuccessMessage(null)

    try {
      const res = await fetch('/api/admin/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audienceType: emailAudience,
          targetTrade: emailAudience === 'trade' ? targetTrade : undefined,
          individualUserId: selectedEmailUser?.id,
          individualEmail: selectedEmailUser?.email,
          subject: emailSubject,
          category: emailCategory,
          message: emailMessage,
          ctaText: emailCtaText,
          ctaUrl: emailCtaUrl,
        }),
      })

      const data = await res.json()
      if (data.success && data.data) {
        setEmailDispatches((prev) => [data.data, ...prev])
        setEmailSuccessMessage(
          `✉️ Dispatched: ${data.message || `Successfully sent to ${data.recipientCount} recipient(s).`}`
        )
        setEmailMessage('')
      } else {
        alert(data.message || 'Failed to dispatch email')
      }
    } catch (e: any) {
      console.error('Email dispatch error', e)
      alert('Network error while dispatching email. Please check connectivity.')
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Mail className="w-6 h-6 text-[#10B981]" />
            <span>Email &amp; Broadcast Communications</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Send direct authenticated emails to individual users, plumbers, electricians, or any artisan guild, all clients, or all platform members in Kano.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEmailPreview(!showEmailPreview)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              showEmailPreview
                ? 'bg-[#0A1020] text-white border-transparent'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showEmailPreview ? 'Hide Live Preview' : 'Show Live Preview'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {emailSuccessMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{emailSuccessMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setEmailSuccessMessage(null)}
            className="p-1 rounded-full hover:bg-emerald-100 text-emerald-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Composer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Audience & Composer */}
        <div className={showEmailPreview ? 'lg:col-span-7 space-y-6' : 'lg:col-span-12 space-y-6'}>
          {/* Step 1: Target Audience Selection */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-900/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                1. Select Target Audience
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Matched: <strong>{calculatedRecipientsCount} recipient(s)</strong>
              </span>
            </div>

            {/* Audience Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* All Users */}
              <button
                type="button"
                onClick={() => {
                  setEmailAudience('all')
                  setSelectedEmailUser(null)
                  if (onClearPreselectedUser) onClearPreselectedUser()
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  emailAudience === 'all'
                    ? 'bg-[#0A1020] text-white border-transparent shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <Users className={`w-4 h-4 mb-1.5 ${emailAudience === 'all' ? 'text-[#10B981]' : 'text-slate-500'}`} />
                <div className="text-xs font-semibold leading-tight whitespace-nowrap">All Users</div>
                <div className={`text-[10px] mt-0.5 ${emailAudience === 'all' ? 'text-slate-300' : 'text-slate-400'}`}>
                  {users.length} total
                </div>
              </button>

              {/* Clients Only */}
              <button
                type="button"
                onClick={() => {
                  setEmailAudience('clients')
                  setSelectedEmailUser(null)
                  if (onClearPreselectedUser) onClearPreselectedUser()
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  emailAudience === 'clients'
                    ? 'bg-[#0A1020] text-white border-transparent shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <Building2 className={`w-4 h-4 mb-1.5 ${emailAudience === 'clients' ? 'text-[#10B981]' : 'text-slate-500'}`} />
                <div className="text-xs font-semibold leading-tight whitespace-nowrap">Clients Only</div>
                <div className={`text-[10px] mt-0.5 ${emailAudience === 'clients' ? 'text-slate-300' : 'text-slate-400'}`}>
                  {users.filter((u) => u.role === 'customer').length} clients
                </div>
              </button>

              {/* Service Providers */}
              <button
                type="button"
                onClick={() => {
                  setEmailAudience('providers')
                  setSelectedEmailUser(null)
                  if (onClearPreselectedUser) onClearPreselectedUser()
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  emailAudience === 'providers'
                    ? 'bg-[#0A1020] text-white border-transparent shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <Wrench className={`w-4 h-4 mb-1.5 ${emailAudience === 'providers' ? 'text-[#10B981]' : 'text-slate-500'}`} />
                <div className="text-xs font-semibold leading-tight whitespace-nowrap">All Artisans</div>
                <div className={`text-[10px] mt-0.5 ${emailAudience === 'providers' ? 'text-slate-300' : 'text-slate-400'}`}>
                  {users.filter((u) => u.role === 'provider').length} providers
                </div>
              </button>

              {/* By Trade */}
              <button
                type="button"
                onClick={() => {
                  setEmailAudience('trade')
                  setSelectedEmailUser(null)
                  if (onClearPreselectedUser) onClearPreselectedUser()
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                  emailAudience === 'trade'
                    ? 'bg-[#0A1020] text-white border-transparent shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <SlidersHorizontal className={`w-4 h-4 mb-1.5 ${emailAudience === 'trade' ? 'text-[#10B981]' : 'text-slate-500'}`} />
                <div className="text-xs font-semibold leading-tight whitespace-nowrap">By Trade</div>
                <div className={`text-[10px] mt-0.5 ${emailAudience === 'trade' ? 'text-slate-300' : 'text-slate-400'}`}>
                  Plumber, Electrician...
                </div>
              </button>

              {/* Individual User */}
              <button
                type="button"
                onClick={() => setEmailAudience('individual')}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                  emailAudience === 'individual'
                    ? 'bg-[#0A1020] text-white border-transparent shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                }`}
              >
                <UserCheck className={`w-4 h-4 mb-1.5 ${emailAudience === 'individual' ? 'text-[#10B981]' : 'text-slate-500'}`} />
                <div className="text-xs font-semibold leading-tight whitespace-nowrap">Individual</div>
                <div className={`text-[10px] mt-0.5 ${emailAudience === 'individual' ? 'text-slate-300' : 'text-slate-400'}`}>
                  Specific person
                </div>
              </button>
            </div>

            {/* Conditional: Trade Selector Dropdown */}
            {emailAudience === 'trade' && (
              <div className="pt-2 animate-in fade-in duration-150">
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Select Specific Service Trade:
                </label>
                <select
                  value={targetTrade}
                  onChange={(e) => setTargetTrade(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-white font-semibold text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                >
                  {SERVICE_TRADE_OPTIONS.map((trade) => (
                    <option key={trade.id} value={trade.id}>
                      {trade.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Conditional: Individual User Search & Selection */}
            {emailAudience === 'individual' && (
              <div className="pt-2 space-y-2 animate-in fade-in duration-150">
                <label className="text-xs font-semibold text-slate-700 block">
                  Select or Search Individual User:
                </label>
                {selectedEmailUser ? (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#0C513F] text-white flex items-center justify-center text-xs font-bold">
                        {selectedEmailUser.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{selectedEmailUser.fullName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200/80 text-emerald-800 uppercase font-bold">
                            {selectedEmailUser.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {selectedEmailUser.email} • {selectedEmailUser.trade} ({selectedEmailUser.city})
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedEmailUser(null)
                        if (onClearPreselectedUser) onClearPreselectedUser()
                      }}
                      className="text-xs text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={userEmailSearch}
                        onChange={(e) => setUserEmailSearch(e.target.value)}
                        placeholder="Search by name, email, or trade (e.g. Ibrahim, Plumber, amina@)..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      />
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-2xl border border-slate-200 divide-y divide-slate-100 bg-white">
                      {userRecipientOptions.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => setSelectedEmailUser(u)}
                          className="w-full p-2.5 text-left hover:bg-slate-50 flex items-center justify-between gap-3 transition-colors cursor-pointer"
                        >
                          <div>
                            <div className="text-xs font-semibold text-slate-900">{u.fullName}</div>
                            <div className="text-[11px] text-slate-400">
                              {u.email} • <span className="capitalize">{u.role === 'provider' ? u.trade : 'Client'}</span> ({u.city})
                            </div>
                          </div>
                          <span className="text-xs font-semibold text-emerald-600 hover:underline">
                            Select &rarr;
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 2: Templates & Message Composition */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-900/10 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                2. Compose Message
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-500">Quick Templates:</span>
                {EMAIL_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.label}
                    type="button"
                    onClick={() => {
                      setEmailSubject(tpl.subject)
                      setEmailCategory(tpl.category)
                      setEmailMessage(tpl.message)
                      setEmailCtaText(tpl.ctaText)
                      setEmailCtaUrl(tpl.ctaUrl)
                    }}
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 transition-colors cursor-pointer"
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category & Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={emailCategory}
                  onChange={(e) => setEmailCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Service Notice">Service Notice</option>
                  <option value="Security & Verification">Security &amp; Verification</option>
                  <option value="Billing & Escrow">Billing &amp; Escrow</option>
                  <option value="Direct Support">Direct Support</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="e.g. Important Escrow & Safety Updates for Kano Trades"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
            </div>

            {/* Body Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Message Body</label>
                <div className="text-[10px] text-slate-400 font-medium space-x-2">
                  <span>Tags: <code className="text-emerald-600 font-bold">&#123;&#123;name&#125;&#125;</code>, <code className="text-emerald-600 font-bold">&#123;&#123;trade&#125;&#125;</code></span>
                  <span>•</span>
                  <span>{emailMessage.length} characters</span>
                </div>
              </div>
              <textarea
                rows={7}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Write your email announcement or direct notification here..."
                className="w-full p-3.5 rounded-2xl border border-slate-200 text-xs sm:text-sm font-medium text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              />
            </div>

            {/* Optional Action Button */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <span className="text-[11px] font-semibold text-slate-700 block">
                Optional Call-to-Action (CTA) Button:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={emailCtaText}
                  onChange={(e) => setEmailCtaText(e.target.value)}
                  placeholder="Button Text (e.g. Open Dashboard)"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
                <input
                  type="text"
                  value={emailCtaUrl}
                  onChange={(e) => setEmailCtaUrl(e.target.value)}
                  placeholder="Button URL (e.g. /dashboard)"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
            </div>

            {/* Dispatch Action Button */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                Targeting <strong>{calculatedRecipientsCount} recipient(s)</strong> in Kano.
              </div>
              <button
                type="button"
                onClick={handleSendEmail}
                disabled={isSendingEmail}
                className="px-6 py-3 rounded-full bg-[#0C513F] hover:bg-[#093e30] text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isSendingEmail ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#10B981]" />
                    <span>Dispatch Email ({calculatedRecipientsCount})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Preview */}
        {showEmailPreview && (
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border-2 border-slate-900/10 shadow-sm space-y-4 sticky top-20 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Live Recipient Email Preview
              </span>
              <span className="text-[10px] font-semibold whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Connecta Template
              </span>
            </div>

            {/* Email Window Mockup */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-inner text-xs">
              {/* Email Header */}
              <div className="bg-[#0A1020] p-4 text-white flex items-center justify-between border-b-2 border-[#10B981]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#0C513F] flex items-center justify-center p-1">
                    <Image
                      src="/brand/connecta-header-icon.svg"
                      alt="Connecta"
                      width={14}
                      height={14}
                      className="object-contain"
                    />
                  </div>
                  <span className="font-semibold text-sm text-white">Connecta</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap px-2 py-0.5 rounded-full bg-white/10 text-emerald-300">
                  {emailCategory}
                </span>
              </div>

              {/* Mock Metadata */}
              <div className="p-3 bg-white border-b border-slate-100 space-y-1 text-[11px] text-slate-500">
                <div>
                  <strong>From:</strong> Connecta Administration &lt;security@myconnecta.ng&gt;
                </div>
                <div>
                  <strong>To:</strong>{' '}
                  {emailAudience === 'individual' && selectedEmailUser
                    ? `${selectedEmailUser.fullName} <${selectedEmailUser.email}>`
                    : `[${calculatedRecipientsCount} Kano Recipients]`}
                </div>
                <div>
                  <strong>Subject:</strong>{' '}
                  <span className="font-semibold text-slate-900">
                    {emailSubject || '(Subject not specified yet)'}
                  </span>
                </div>
              </div>

              {/* Email Body */}
              <div className="p-5 bg-white space-y-3">
                <div className="font-semibold text-slate-800 text-xs">
                  Dear{' '}
                  {emailAudience === 'individual' && selectedEmailUser
                    ? selectedEmailUser.fullName
                    : 'Valued Member'}
                  ,
                </div>
                <div className="text-slate-600 leading-relaxed text-[11px] whitespace-pre-line">
                  {emailMessage ||
                    'Your composed message will appear here with formatting, paragraphs, and personalized variables.'}
                </div>

                {/* CTA Preview */}
                {emailCtaText && (
                  <div className="pt-2 text-center">
                    <span className="inline-block px-5 py-2 rounded-full bg-[#0C513F] text-white font-semibold text-[11px] shadow-xs">
                      {emailCtaText} &rarr;
                    </span>
                  </div>
                )}

                {/* Footer in Preview */}
                <div className="mt-6 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center space-y-0.5">
                  <p className="font-semibold text-slate-600">Connecta Technologies • Kano Operations Center</p>
                  <p>100% Escrow Protected Local Services Marketplace</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Step 3: Past Dispatched Emails Log Table */}
      <div className="bg-white rounded-3xl border-2 border-slate-900/10 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Dispatched Email Logs &amp; Broadcast History
            </h3>
            <p className="text-xs text-slate-500">
              Records of authenticated messages sent from the Connecta Admin Command Center.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {emailDispatches.length} recorded dispatches
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px] whitespace-nowrap">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Subject &amp; Category</th>
                <th className="py-3 px-4 whitespace-nowrap">Target Audience</th>
                <th className="py-3 px-4 whitespace-nowrap">Recipients</th>
                <th className="py-3 px-4 whitespace-nowrap">Sent At</th>
                <th className="py-3 px-4 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {emailDispatches.map((disp) => (
                <tr key={disp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{disp.subject}</div>
                    <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[10px] font-semibold whitespace-nowrap bg-slate-100 text-slate-600">
                      {disp.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 capitalize">
                    <span className="font-semibold text-slate-800">
                      {disp.audienceType === 'trade'
                        ? `${disp.targetTrade || 'Trade'} Specialists`
                        : disp.audienceType === 'clients'
                        ? 'All Clients'
                        : disp.audienceType === 'providers'
                        ? 'All Service Providers'
                        : disp.audienceType === 'individual'
                        ? `Direct: ${disp.recipientName || disp.recipientEmail || 'User'}`
                        : 'All Users'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {disp.recipientCount} {disp.recipientCount === 1 ? 'user' : 'users'}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {disp.sentAt}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Delivered</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedSentEmail(disp)}
                      className="px-3 py-1 rounded-full border border-slate-200 hover:border-slate-800 text-slate-700 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      View Content
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: View Sent Email Content */}
      {selectedSentEmail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 space-y-4 border-2 border-slate-900/10 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap text-slate-400">
                  Dispatched Email Record
                </span>
                <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
                  {selectedSentEmail.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSentEmail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold whitespace-nowrap uppercase">Audience</span>
                <strong className="text-slate-900 capitalize">
                  {selectedSentEmail.audienceType} ({selectedSentEmail.recipientCount} recipients)
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold whitespace-nowrap uppercase">Sent At</span>
                <strong className="text-slate-900">{selectedSentEmail.sentAt}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold whitespace-nowrap uppercase">Dispatched By</span>
                <strong className="text-slate-900">{selectedSentEmail.sentBy}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-semibold whitespace-nowrap uppercase">Category</span>
                <strong className="text-emerald-700">{selectedSentEmail.category}</strong>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-700 block">Message Body:</span>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto">
                {selectedSentEmail.message}
              </div>
            </div>

            {selectedSentEmail.ctaText && (
              <div className="text-xs text-slate-500">
                <strong>Button Link:</strong> {selectedSentEmail.ctaText} ({selectedSentEmail.ctaUrl})
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedSentEmail(null)}
                className="w-full py-2.5 rounded-full bg-[#0A1020] hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
