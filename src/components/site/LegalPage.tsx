'use client'

import React, { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { HelpCircle, Mail, MessageCircle, ShieldCheck } from 'lucide-react'
import { PublicShell } from '@/components/site/PublicShell'
import { Button, Card } from '@/components/dashboard/ui'

export type LegalBlock =
  | { kind: 'p'; content: ReactNode }
  | { kind: 'list'; items: Array<{ label?: string; content: ReactNode }> }
  | { kind: 'callout'; tone: 'success' | 'danger'; content: ReactNode }
  | { kind: 'grid'; items: Array<{ title: string; content: string }> }

export interface LegalSection {
  id: string
  title: string
  numbered?: boolean
  blocks: LegalBlock[]
}

export interface LegalContact {
  icon: 'mail' | 'help' | 'whatsapp'
  label: string
  value: string
  href: string
  note: string
}

const CONTACT_ICONS = { mail: Mail, help: HelpCircle, whatsapp: MessageCircle }
const CONTACT_TONES = ['bg-azure-50 text-azure', 'bg-warn-50 text-warn-ink', 'bg-success-50 text-success-ink']
const NUMBER_TONES = ['bg-azure-50 text-azure-600', 'bg-warn-50 text-warn-ink', 'bg-success-50 text-success-ink']

const SOCIALS = [
  { label: 'X', href: 'https://x.com/Connectainc' },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61587476974482',
  },
  { label: 'Instagram', href: 'https://www.instagram.com/connecta_inc' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@connecta_inc' },
]

function Block({ block }: { block: LegalBlock }) {
  switch (block.kind) {
    case 'p':
      return <p className="text-[15px] text-ink-2 leading-[1.75]">{block.content}</p>
    case 'list':
      return (
        <ul className="space-y-3">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 text-[15px] text-ink-2 leading-[1.75]">
              <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-subtle shrink-0" />
              <span>
                {item.label && <span className="font-medium text-ink">{item.label}: </span>}
                {item.content}
              </span>
            </li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <div
          className={`flex items-start gap-3 rounded-xl px-4 py-3.5 text-sm leading-relaxed ${
            block.tone === 'success' ? 'bg-success-50 text-success-ink' : 'bg-danger-50 text-danger-ink'
          }`}
        >
          <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{block.content}</span>
        </div>
      )
    case 'grid':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {block.items.map((item) => (
            <div key={item.title} className="rounded-xl border border-line p-4">
              <div className="text-sm font-medium text-ink">{item.title}</div>
              <p className="text-[13px] text-muted mt-1 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      )
  }
}

export function LegalPage({
  current,
  title,
  intro,
  updated,
  sections,
  contactTitle,
  contactIntro,
  contacts,
}: {
  current: 'terms' | 'privacy'
  title: string
  intro: string
  updated: string
  sections: LegalSection[]
  contactTitle: string
  contactIntro: string
  contacts: LegalContact[]
}) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-90px 0px -65% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sections])

  let n = 0
  const numbered = sections.map((s) => (s.numbered === false ? null : ++n))

  return (
    <PublicShell
      actions={
        <>
          <Button variant="ghost" size="sm" href="/login" className="max-sm:hidden">
            Sign in
          </Button>
          <Button size="sm" href="/register">
            Create account
          </Button>
        </>
      }
    >
      <header className="max-w-3xl cn-rise">
        <div className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-sunken border border-line">
          {(
            [
              { key: 'terms', label: 'Terms of Service', href: '/terms' },
              { key: 'privacy', label: 'Privacy Policy', href: '/privacy' },
            ] as const
          ).map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={current === tab.key ? 'page' : undefined}
              className={`h-8 px-3 rounded-lg text-[13px] font-medium inline-flex items-center transition-colors ${
                current === tab.key ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(17,24,39,0.08)]' : 'text-muted hover:text-ink'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <h1 className="mt-6 text-[32px] sm:text-[40px] leading-tight font-medium tracking-[-0.025em]">{title}</h1>
        <p className="mt-3 text-[16px] text-muted leading-relaxed">{intro}</p>
        <p className="mt-4 text-[13px] text-subtle">Last updated {updated} · Applies in Nigeria and across Africa</p>
      </header>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 items-start">
        <nav className="hidden lg:block sticky top-24" aria-label="On this page">
          <div className="text-xs text-subtle mb-3">On this page</div>
          <ul className="space-y-0.5 border-l border-line">
            {sections.map((s) => {
              const isActive = active === s.id
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className={`block -ml-px pl-4 py-1.5 border-l-2 text-[13px] transition-colors ${
                      isActive ? 'border-azure text-ink font-medium' : 'border-transparent text-muted hover:text-ink'
                    }`}
                  >
                    {s.title}
                  </a>
                </li>
              )
            })}
            <li>
              <a href="#contact" className="block -ml-px pl-4 py-1.5 border-l-2 border-transparent text-[13px] text-muted hover:text-ink">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        <div className="min-w-0 max-w-3xl space-y-4">
          {sections.map((s, i) => {
            const num = numbered[i]
            return (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <Card className="p-6 sm:p-8 cn-rise" style={{ ['--d' as string]: `${Math.min(i, 4) * 60}ms` }}>
                  <div className="flex items-center gap-3">
                    {num && (
                      <span
                        className={`w-7 h-7 rounded-lg text-[13px] font-medium tabular-nums flex items-center justify-center shrink-0 ${
                          NUMBER_TONES[(num - 1) % NUMBER_TONES.length]
                        }`}
                      >
                        {num}
                      </span>
                    )}
                    <h2 className="text-lg sm:text-xl font-medium tracking-[-0.01em]">{s.title}</h2>
                  </div>
                  <div className="mt-4 space-y-4">
                    {s.blocks.map((b, j) => (
                      <Block key={j} block={b} />
                    ))}
                  </div>
                </Card>
              </section>
            )
          })}

          <section id="contact" className="scroll-mt-24 pt-6">
            <h2 className="text-lg sm:text-xl font-medium tracking-[-0.01em]">{contactTitle}</h2>
            <p className="mt-2 text-[15px] text-muted leading-relaxed">{contactIntro}</p>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {contacts.map((c, i) => {
                const Icon = CONTACT_ICONS[c.icon]
                const external = c.href.startsWith('http')
                return (
                  <a
                    key={c.label}
                    href={c.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="block"
                  >
                    <Card interactive className="p-5 h-full">
                      <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${CONTACT_TONES[i % CONTACT_TONES.length]}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <div className="mt-4 text-xs text-muted">{c.label}</div>
                      <div className="text-sm text-ink mt-0.5 break-all">{c.value}</div>
                      <div className="text-xs text-subtle mt-1">{c.note}</div>
                    </Card>
                  </a>
                )
              })}
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-[13px] text-muted">
              <span className="mr-1">Follow Connecta</span>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-8 px-3 inline-flex items-center rounded-full border border-line hover:border-line-strong hover:text-ink transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PublicShell>
  )
}
