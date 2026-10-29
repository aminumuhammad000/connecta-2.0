'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Mail, MessageCircle, Phone, Plus } from 'lucide-react'
import { DASHBOARD_FAQS } from '@/lib/dashboard/data'
import { ConnectaLoader } from '@/components/brand/ConnectaLoader'
import { IllustrationShield } from '@/components/brand/illustrations'
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Field,
  Modal,
  Notice,
  PageHeader,
  SectionHeader,
  inputClass,
  stagger,
  textareaClass,
} from '@/components/dashboard/ui'

interface ServerDisputeItem {
  id: string
  disputeNumber: string
  bookingTitle: string
  amountMinor: number
  reason: string
  status: string
  filedDate: string
  lastUpdate: string
  notes: string
}

const CONTACTS = [
  { icon: Mail, label: 'Email', value: 'support@myconnecta.ng', href: 'mailto:support@myconnecta.ng', tile: 'bg-azure-50 text-azure' },
  { icon: Phone, label: 'Call', value: '+234 812 345 6789', href: 'tel:+2348123456789', tile: 'bg-warn-50 text-warn-ink' },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/2348123456789', external: true, tile: 'bg-success-50 text-success-ink' },
]

export default function DashboardSupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [disputes, setDisputes] = useState<ServerDisputeItem[]>([])
  const [isLoadingDisputes, setIsLoadingDisputes] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [disputeTitle, setDisputeTitle] = useState('')
  const [disputeReason, setDisputeReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const fetchDisputes = async () => {
    try {
      const res = await fetch('/api/dashboard/support')
      if (res.ok) {
        const body = await res.json()
        setDisputes(body.data || [])
      }
    } catch (err) {
      console.error('Failed to load disputes:', err)
    } finally {
      setIsLoadingDisputes(false)
    }
  }

  useEffect(() => {
    fetchDisputes()
  }, [])

  const handleSubmitDispute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!disputeTitle.trim() || !disputeReason.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/dashboard/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingTitle: disputeTitle.trim(), reason: disputeReason.trim() }),
      })
      if (res.ok) {
        setIsModalOpen(false)
        setDisputeTitle('')
        setDisputeReason('')
        setNotice('Thanks. Our team will review this and reply within one working day.')
        await fetchDisputes()
        setTimeout(() => setNotice(null), 5000)
      }
    } catch (err) {
      console.error('Failed to submit dispute:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Help and support"
        title="How can we help?"
        description="Real people, seven days a week. Most questions are answered below."
        actions={
          <Button variant="warm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Report an issue
          </Button>
        }
      />

      {notice && (
        <Notice tone="success" onClose={() => setNotice(null)}>
          {notice}
        </Notice>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CONTACTS.map((c, idx) => {
          const Icon = c.icon
          return (
            <a
              key={c.label}
              href={c.href}
              target={c.external ? '_blank' : undefined}
              rel={c.external ? 'noopener noreferrer' : undefined}
              className="block cn-rise"
              style={stagger(idx + 1, 60)}
            >
              <Card interactive className="p-5 h-full">
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.tile}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <div className="text-xs text-muted mt-4">{c.label}</div>
                <div className="text-sm text-ink mt-0.5">{c.value}</div>
              </Card>
            </a>
          )
        })}
      </div>

      <section className="cn-rise" style={stagger(4, 60)}>
        <SectionHeader title="Your open issues" description="Anything you have reported, and where it stands." />
        <Card>
          {isLoadingDisputes ? (
            <div className="py-14 flex justify-center">
              <ConnectaLoader size={36} label="Checking your issues" />
            </div>
          ) : disputes.length > 0 ? (
            <ul className="divide-y divide-line">
              {disputes.map((d) => (
                <li key={d.id} className="px-6 py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs text-muted tabular-nums">{d.disputeNumber}</div>
                      <div className="text-sm font-medium text-ink mt-0.5">{d.bookingTitle}</div>
                    </div>
                    <Badge tone={d.status === 'resolved' ? 'success' : 'warn'} dot className="capitalize">
                      {d.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-[13px] text-ink-2 mt-2 leading-relaxed">{d.reason}</p>
                  <div className="text-xs text-subtle mt-2">
                    Opened {d.filedDate} · Updated {d.lastUpdate}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              illustration={<IllustrationShield />}
              title="All clear"
              description="You have no open issues. If something doesn't feel right with a job, tell us and we'll step in."
              className="py-10"
            />
          )}
        </Card>
      </section>

      <section className="cn-rise" style={stagger(5, 60)}>
        <SectionHeader title="Common questions" />
        <Card className="divide-y divide-line">
          {DASHBOARD_FAQS.map((faq, index) => {
            const isOpen = openFaq === index
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left cursor-pointer group"
                >
                  <span className="min-w-0">
                    <span className="block text-xs text-muted">{faq.tag}</span>
                    <span className="block text-sm text-ink mt-0.5 group-hover:text-warn-ink transition-colors">{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-subtle shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-ink' : ''}`}
                  />
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-muted leading-relaxed max-w-2xl">{faq.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </Card>
        <div className="flex items-center gap-3 text-[13px] text-muted mt-5 flex-wrap">
          <Link href="/terms" className="hover:text-ink transition-colors">
            Terms of service
          </Link>
          <span className="text-subtle">·</span>
          <Link href="/privacy" className="hover:text-ink transition-colors">
            Privacy policy
          </Link>
          <span className="text-subtle">·</span>
          <span>Mon to Sat, 8am to 8pm WAT</span>
        </div>
      </section>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Report an issue"
        description="Tell us what happened. A mediator will review the job record and reply."
      >
        <form onSubmit={handleSubmitDispute} className="space-y-5">
          <Field label="Which job?" htmlFor="d-title">
            <input
              id="d-title"
              type="text"
              placeholder="Job name or booking number, e.g. #CN-782419"
              value={disputeTitle}
              onChange={(e) => setDisputeTitle(e.target.value)}
              className={inputClass}
              required
            />
          </Field>
          <Field label="What went wrong?" htmlFor="d-reason">
            <textarea
              id="d-reason"
              rows={4}
              placeholder="Describe the problem, delay or quality concern"
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              className={textareaClass}
              required
            />
          </Field>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="warm" loading={isSubmitting}>
              {isSubmitting ? 'Sending' : 'Send report'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
