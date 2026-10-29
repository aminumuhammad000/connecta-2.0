'use client'

import React, { useEffect, useState, type ReactNode } from 'react'
import { Check } from 'lucide-react'
import { formatMinorToNaira } from '@/lib/dashboard/data'

export interface MilestoneLike {
  id: string
  title: string
  amountMinor: number
  status: 'completed' | 'current' | 'pending'
}

const STATUS_LABEL: Record<MilestoneLike['status'], string> = {
  completed: 'Paid out',
  current: 'In progress',
  pending: 'Upcoming',
}

export function ProgressBar({ value }: { value: number }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(Math.max(0, Math.min(100, value))))
    return () => cancelAnimationFrame(id)
  }, [value])

  return (
    <div className="h-1.5 w-full rounded-full bg-sunken overflow-hidden" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`h-full rounded-full transition-[width] duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${value >= 100 ? 'bg-success' : 'bg-azure'}`}
        style={{ width: `${shown}%` }}
      />
    </div>
  )
}

export function MilestoneTimeline({
  milestones,
  renderAction,
}: {
  milestones: MilestoneLike[]
  renderAction?: (m: MilestoneLike, index: number) => ReactNode
}) {
  return (
    <ol className="relative">
      {milestones.map((m, idx) => {
        const last = idx === milestones.length - 1
        return (
          <li key={m.id || idx} className="relative flex gap-3.5 pb-5 last:pb-0 cn-rise" style={{ ['--d' as string]: `${idx * 70}ms` }}>
            {!last && (
              <span
                className={`absolute left-[11px] top-7 bottom-1 w-px ${m.status === 'completed' ? 'bg-success/50' : 'bg-line'}`}
              />
            )}

            {m.status === 'completed' ? (
              <span className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
              </span>
            ) : m.status === 'current' ? (
              <span className="relative w-6 h-6 rounded-full border-2 border-azure bg-surface flex items-center justify-center shrink-0">
                <span className="w-2 h-2 rounded-full bg-azure" />
              </span>
            ) : (
              <span className="w-6 h-6 rounded-full border border-line-strong bg-surface text-[11px] text-subtle flex items-center justify-center shrink-0 tabular-nums">
                {idx + 1}
              </span>
            )}

            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <p className={`text-sm truncate ${m.status === 'pending' ? 'text-muted' : 'text-ink'}`}>{m.title}</p>
                <p
                  className={`text-xs mt-0.5 ${
                    m.status === 'completed' ? 'text-success-ink' : m.status === 'current' ? 'text-azure-600' : 'text-subtle'
                  }`}
                >
                  {STATUS_LABEL[m.status]}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-sm tabular-nums ${m.status === 'pending' ? 'text-muted' : 'text-ink font-medium'}`}>
                  {formatMinorToNaira(m.amountMinor)}
                </span>
                {renderAction?.(m, idx)}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
