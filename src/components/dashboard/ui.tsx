'use client'

import React, { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import Link from 'next/link'
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { ConnectaLoader } from '@/components/brand/ConnectaLoader'

export const stagger = (index: number, step = 60): CSSProperties =>
  ({ ['--d' as string]: `${index * step}ms` }) as CSSProperties

/* -------------------------------------------------------------------------- */
/* Buttons                                                                     */
/* -------------------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'success' | 'warm' | 'dark' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

const buttonBase =
  'inline-flex items-center justify-center gap-1.5 rounded-[10px] font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure/30'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-azure text-white hover:bg-azure-600 shadow-[0_1px_2px_rgba(26,115,232,0.25)]',
  success: 'bg-success-ink text-white hover:bg-success-700 shadow-[0_1px_2px_rgba(4,120,87,0.25)]',
  warm: 'bg-warn text-ink hover:bg-warn-600 shadow-[0_1px_2px_rgba(245,158,11,0.3)]',
  dark: 'bg-ink text-white hover:bg-ink-2',
  secondary: 'bg-surface text-ink border border-line-strong hover:bg-sunken',
  ghost: 'text-ink-2 hover:bg-sunken hover:text-ink',
  danger: 'bg-danger text-white hover:bg-danger-ink',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
}

export function buttonClass(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = '') {
  return `${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${extra}`
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  href?: string
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  href,
  className = '',
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const cls = buttonClass(variant, size, className)
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} disabled={disabled || loading} {...rest}>
      {loading && <ConnectaLoader size={16} showTrack={false} mono />}
      {children}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                    */
/* -------------------------------------------------------------------------- */

export function Card({
  className = '',
  children,
  style,
  interactive = false,
}: {
  className?: string
  children: ReactNode
  style?: CSSProperties
  interactive?: boolean
}) {
  return (
    <div
      style={style}
      className={`bg-surface border border-line rounded-2xl ${interactive ? 'cn-lift' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 cn-rise">
      <div className="min-w-0">
        {eyebrow && <p className="text-[13px] text-muted mb-1.5">{eyebrow}</p>}
        <h1 className="text-[26px] sm:text-[28px] leading-tight font-medium tracking-[-0.02em] text-ink">{title}</h1>
        {description && <p className="text-sm text-muted mt-2 max-w-xl leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  )
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-4">
      <div>
        <h2 className="text-base font-medium text-ink tracking-[-0.01em]">{title}</h2>
        {description && <p className="text-[13px] text-muted mt-0.5">{description}</p>}
      </div>
      {action && <div className="shrink-0 whitespace-nowrap">{action}</div>}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Badges & notices                                                            */
/* -------------------------------------------------------------------------- */

type Tone = 'neutral' | 'azure' | 'success' | 'warn' | 'danger'

const badgeTones: Record<Tone, string> = {
  neutral: 'bg-sunken text-ink-2',
  azure: 'bg-azure-50 text-azure-600',
  success: 'bg-success-50 text-success-ink',
  warn: 'bg-warn-50 text-warn-ink',
  danger: 'bg-danger-50 text-danger-ink',
}

const dotTones: Record<Tone, string> = {
  neutral: 'bg-subtle',
  azure: 'bg-azure',
  success: 'bg-success',
  warn: 'bg-warn',
  danger: 'bg-danger',
}

export function Badge({
  tone = 'neutral',
  dot = false,
  children,
  className = '',
}: {
  tone?: Tone
  dot?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-xs font-medium whitespace-nowrap ${badgeTones[tone]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotTones[tone]}`} />}
      {children}
    </span>
  )
}

const noticeIcons = { success: CheckCircle2, danger: AlertCircle, azure: Info, warn: AlertCircle, neutral: Info }

export function Notice({
  tone = 'success',
  children,
  onClose,
}: {
  tone?: Tone
  children: ReactNode
  onClose?: () => void
}) {
  const Icon = noticeIcons[tone]
  return (
    <div className={`cn-pop flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm ${badgeTones[tone]}`} role="status">
      <Icon className="w-4 h-4 mt-0.5 shrink-0" />
      <div className="flex-1 leading-relaxed">{children}</div>
      {onClose && (
        <button type="button" onClick={onClose} className="opacity-60 hover:opacity-100 cursor-pointer" aria-label="Dismiss">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                 */
/* -------------------------------------------------------------------------- */

export function EmptyState({
  illustration,
  title,
  description,
  action,
  className = '',
}: {
  illustration: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col items-center text-center px-6 py-12 cn-rise ${className}`}>
      <div className="mb-5">{illustration}</div>
      <h3 className="text-base font-medium text-ink">{title}</h3>
      {description && <p className="text-sm text-muted mt-1.5 max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Forms                                                                       */
/* -------------------------------------------------------------------------- */

export const inputClass =
  'w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line-strong text-sm text-ink placeholder:text-subtle transition-[border-color,box-shadow] duration-200 focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10 disabled:bg-sunken disabled:text-muted disabled:cursor-not-allowed'

export const textareaClass = inputClass.replace('h-10', 'min-h-24 py-2.5 leading-relaxed resize-none')

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className = '',
}: {
  label: string
  hint?: ReactNode
  htmlFor?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="block text-[13px] font-medium text-ink-2">
        {label}
      </label>
      {children}
      {hint && <div className="text-xs text-muted">{hint}</div>}
    </div>
  )
}

export function Segmented<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T
  onChange: (v: T) => void
  items: Array<{ value: T; label: string; icon?: React.ComponentType<{ className?: string }> }>
}) {
  return (
    <div className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-sunken border border-line" role="tablist">
      {items.map((item) => {
        const active = item.value === value
        const Icon = item.icon
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[13px] font-medium transition-all duration-200 cursor-pointer ${
              active ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(17,24,39,0.08)]' : 'text-muted hover:text-ink'
            }`}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                       */
/* -------------------------------------------------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={onClose} />
      <div
        className={`relative w-full ${size === 'lg' ? 'sm:max-w-xl' : 'sm:max-w-md'} bg-surface rounded-t-2xl sm:rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] cn-pop max-h-[92vh] flex flex-col`}
      >
        <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div>
            <h3 className="text-lg font-medium text-ink tracking-[-0.01em]">{title}</h3>
            {description && <p className="text-sm text-muted mt-1 leading-relaxed">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 -mr-2 -mt-1 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pb-6 overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-line flex items-center justify-end gap-2 bg-canvas/60 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Data display                                                                */
/* -------------------------------------------------------------------------- */

const avatarTones = ['bg-azure-50 text-azure-600', 'bg-warn-50 text-warn-ink', 'bg-success-50 text-success-ink', 'bg-sunken text-ink-2']

export function initialsOf(name?: string | null) {
  if (!name) return 'C'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function Avatar({ name, size = 36, className = '' }: { name?: string | null; size?: number; className?: string }) {
  const initials = initialsOf(name)
  const tone = avatarTones[(initials.charCodeAt(0) || 0) % avatarTones.length]
  return (
    <div
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.34) }}
      className={`rounded-full flex items-center justify-center font-medium shrink-0 ${tone} ${className}`}
    >
      {initials}
    </div>
  )
}

export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString('en-NG'),
  duration = 900,
}: {
  value: number
  format?: (n: number) => string
  duration?: number
}) {
  const [display, setDisplay] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const span = reduce ? 0 : duration
    const from = fromRef.current
    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = span === 0 ? 1 : Math.min(1, (now - start) / span)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (value - from) * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
      else fromRef.current = value
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return <span className="tabular-nums">{format(display)}</span>
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`cn-skeleton rounded-lg ${className}`} />
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] text-ink tabular-nums">
      <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" aria-hidden="true">
        <path
          d="M10 1.8l2.5 5.2 5.7.8-4.1 4 1 5.6L10 14.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8z"
          fill="#F59E0B"
        />
      </svg>
      {rating.toFixed(1)}
    </span>
  )
}
