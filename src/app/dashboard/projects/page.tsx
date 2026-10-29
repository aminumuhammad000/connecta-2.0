'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Check, FileText, MapPin, Printer, ShieldCheck, CalendarDays } from 'lucide-react'
import { formatMinorToNaira, DashboardBooking } from '@/lib/dashboard/data'
import { ConnectaLoader, ConnectaMark } from '@/components/brand/ConnectaLoader'
import { IllustrationProjects } from '@/components/brand/illustrations'
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  Modal,
  Notice,
  PageHeader,
  Segmented,
  stagger,
} from '@/components/dashboard/ui'
import { MilestoneTimeline, ProgressBar, type MilestoneLike } from '@/components/dashboard/milestones'

type Filter = 'all' | 'in_progress' | 'completed'

export default function DashboardProjectsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [bookings, setBookings] = useState<DashboardBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [releasingId, setReleasingId] = useState<string | null>(null)
  const [releasedNotice, setReleasedNotice] = useState<string | null>(null)
  const [confirming, setConfirming] = useState<{ booking: DashboardBooking; milestone: MilestoneLike } | null>(null)
  const [receipt, setReceipt] = useState<{ booking: DashboardBooking; milestone: MilestoneLike } | null>(null)

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(`/api/dashboard/projects?status=${filter}`)
      if (res.ok) {
        const body = await res.json()
        setBookings(body.data || [])
      }
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const handleExecuteRelease = async () => {
    if (!confirming) return
    const { booking, milestone } = confirming
    setReleasingId(booking.id)
    try {
      const res = await fetch(`/api/dashboard/projects/${booking.id}/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId: milestone.id }),
      })
      if (res.ok) {
        setReleasedNotice(`${formatMinorToNaira(milestone.amountMinor)} has been released to ${booking.providerName}.`)
        setConfirming(null)
        await fetchProjects()
        setTimeout(() => setReleasedNotice(null), 5000)
      }
    } catch (err) {
      console.error('Failed to release milestone:', err)
    } finally {
      setReleasingId(null)
    }
  }

  const filteredBookings = bookings.filter((b) => filter === 'all' || b.bookingStatus === filter)

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Projects"
        title="Your contracts"
        description="Follow each job stage by stage. Money moves only when you approve."
      />

      {releasedNotice && (
        <Notice tone="success" onClose={() => setReleasedNotice(null)}>
          {releasedNotice}
        </Notice>
      )}

      <div className="cn-rise" style={stagger(1, 80)}>
        <Segmented<Filter>
          value={filter}
          onChange={(v) => {
            setIsLoading(true)
            setFilter(v)
          }}
          items={[
            { value: 'all', label: 'All' },
            { value: 'in_progress', label: 'In progress' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <ConnectaLoader size={40} label="Loading your contracts" />
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking, idx) => {
            const done = booking.bookingStatus === 'completed'
            return (
              <Card key={booking.id} className="p-6 sm:p-7 cn-rise" style={stagger(idx + 2, 70)}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge>#{booking.bookingNumber}</Badge>
                      <Badge tone="azure">{booking.category}</Badge>
                      <Badge tone={done ? 'success' : 'warn'} dot>
                        {done ? 'Completed' : 'In progress'}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-medium text-ink mt-3 tracking-[-0.01em]">{booking.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-[13px] text-muted flex-wrap">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {booking.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {booking.appointmentDate}
                      </span>
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-xs text-muted">Contract value</div>
                    <div className="text-xl font-medium text-ink tracking-[-0.02em] mt-0.5">
                      {formatMinorToNaira(booking.totalAmountMinor)}
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { role: 'Client', name: booking.clientName },
                    { role: 'Professional', name: booking.providerName },
                  ].map((p) => (
                    <div key={p.role} className="flex items-center gap-3 rounded-xl bg-canvas border border-line px-3.5 py-3">
                      <Avatar name={p.name} size={32} />
                      <div className="min-w-0">
                        <div className="text-xs text-muted">{p.role}</div>
                        <div className="text-sm text-ink truncate">{p.name}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-muted">Progress</span>
                    <span className="text-ink font-medium tabular-nums">{booking.progressPercentage}%</span>
                  </div>
                  <ProgressBar value={booking.progressPercentage} />
                </div>

                {booking.milestones?.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-line">
                    <MilestoneTimeline
                      milestones={booking.milestones}
                      renderAction={(m) =>
                        m.status === 'completed' ? (
                          <Button size="sm" variant="ghost" onClick={() => setReceipt({ booking, milestone: m })}>
                            <FileText className="w-3.5 h-3.5" />
                            Receipt
                          </Button>
                        ) : m.status === 'current' ? (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => setConfirming({ booking, milestone: m })}
                            disabled={releasingId === booking.id}
                          >
                            Approve
                          </Button>
                        ) : null
                      }
                    />
                  </div>
                )}

                <div className="mt-6 pt-4 border-t border-line flex items-center gap-1.5 text-xs text-muted">
                  <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  Funds are protected until you approve each stage.
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <EmptyState
            illustration={<IllustrationProjects />}
            title={filter === 'completed' ? 'Nothing completed yet' : 'No contracts here'}
            description={
              filter === 'completed'
                ? 'Finished jobs will appear here with their receipts.'
                : 'When you hire a professional, the contract and its stages appear here.'
            }
            action={<Button href="/dashboard/jobs">Find a professional</Button>}
          />
        </Card>
      )}

      <Modal
        open={!!confirming}
        onClose={() => setConfirming(null)}
        title="Approve this stage?"
        description="Release payment once you are satisfied with the work."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirming(null)}>
              Not yet
            </Button>
            <Button variant="success" onClick={handleExecuteRelease} loading={!!confirming && releasingId === confirming.booking.id}>
              {confirming && releasingId === confirming.booking.id ? 'Releasing' : 'Approve and release'}
            </Button>
          </>
        }
      >
        {confirming && (
          <div className="space-y-5">
            <div className="rounded-xl bg-canvas border border-line p-4">
              <div className="text-xs text-muted">{confirming.milestone.title}</div>
              <div className="text-2xl font-medium text-success-ink tracking-[-0.02em] mt-1">
                {formatMinorToNaira(confirming.milestone.amountMinor)}
              </div>
              <div className="text-[13px] text-muted mt-1">to {confirming.booking.providerName}</div>
            </div>
            <ul className="space-y-2.5 text-sm text-ink-2">
              {['You have checked the work on site', 'It matches what you agreed'].map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-success-50 text-success-ink flex items-center justify-center">
                    <Check className="w-3 h-3" strokeWidth={2.5} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
            <Notice tone="warn">Released payments go straight to the professional and cannot be reversed.</Notice>
          </div>
        )}
      </Modal>

      <Modal
        open={!!receipt}
        onClose={() => setReceipt(null)}
        title="Payment receipt"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="dark" onClick={() => setReceipt(null)}>
              Done
            </Button>
          </>
        }
      >
        {receipt && (
          <div className="rounded-xl border border-line overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-canvas border-b border-line">
              <div className="flex items-center gap-2.5">
                <ConnectaMark size={22} />
                <div>
                  <div className="text-sm font-medium text-ink">Connecta</div>
                  <div className="text-xs text-muted">Official payment record</div>
                </div>
              </div>
              <Badge tone="success" dot>
                Settled
              </Badge>
            </div>
            <dl className="px-5 py-4 grid grid-cols-2 gap-4 text-sm border-b border-line">
              <div>
                <dt className="text-xs text-muted">Receipt no.</dt>
                <dd className="text-ink mt-0.5 tabular-nums">
                  CN-{receipt.booking.bookingNumber}-{receipt.milestone.id.slice(0, 4).toUpperCase()}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-xs text-muted">Stage</dt>
                <dd className="text-ink mt-0.5">{receipt.milestone.title}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Client</dt>
                <dd className="text-ink mt-0.5">{receipt.booking.clientName}</dd>
              </div>
              <div className="text-right">
                <dt className="text-xs text-muted">Professional</dt>
                <dd className="text-ink mt-0.5">{receipt.booking.providerName}</dd>
              </div>
            </dl>
            <dl className="px-5 py-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Amount released</dt>
                <dd className="text-ink tabular-nums">{formatMinorToNaira(receipt.milestone.amountMinor)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Platform fee</dt>
                <dd className="text-ink">₦0</dd>
              </div>
              <div className="flex justify-between pt-3 mt-1 border-t border-line text-base">
                <dt className="text-ink font-medium">Paid to professional</dt>
                <dd className="text-ink font-medium tabular-nums">{formatMinorToNaira(receipt.milestone.amountMinor)}</dd>
              </div>
            </dl>
          </div>
        )}
      </Modal>
    </div>
  )
}
