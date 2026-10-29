'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutGrid,
  FolderKanban,
  Search,
  Wallet,
  HelpCircle,
  Menu,
  X,
  LogOut,
  Sparkles,
  Settings,
  Bell,
  ArrowRight,
  ChevronRight,
  CornerDownLeft,
} from 'lucide-react'
import { BrandStripe, ConnectaMark } from '@/components/brand/ConnectaLoader'
import { AnimatedNumber, Avatar, Skeleton } from '@/components/dashboard/ui'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface ServerUserData {
  id: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  role: 'customer' | 'provider'
  activeRole: 'customer' | 'provider'
  city: string
  currency: string
  avatarUrl?: string | null
  headline?: string
  companyName?: string
}

interface ServerWalletData {
  id: string
  balanceMinor: number
  escrowBalanceMinor: number
  sparksBalance: number
  currency: string
}

type Tone = 'azure' | 'success' | 'warn'

type NavItem = {
  label: string
  path: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | null
}

const TONES: Record<Tone, { active: string; icon: string; bar: string; badge: string; tile: string }> = {
  azure: { active: 'bg-azure-50 text-azure-600', icon: 'text-azure', bar: 'bg-azure', badge: 'bg-azure text-white', tile: 'bg-azure text-white' },
  success: { active: 'bg-success-50 text-success-ink', icon: 'text-success', bar: 'bg-success', badge: 'bg-success-ink text-white', tile: 'bg-success-ink text-white' },
  warn: { active: 'bg-warn-50 text-warn-ink', icon: 'text-warn', bar: 'bg-warn', badge: 'bg-warn text-ink', tile: 'bg-warn text-ink' },
}

const formatNaira = (n: number) => `₦${Math.round(n).toLocaleString('en-NG')}`

const COMMANDS: Array<{ label: string; description: string; path: string; icon: React.ComponentType<{ className?: string }>; tone: Tone }> = [
  { label: 'Overview', description: 'Balances and your active contract', path: '/dashboard', icon: LayoutGrid, tone: 'azure' },
  { label: 'Projects', description: 'Milestones, approvals and receipts', path: '/dashboard/projects', icon: FolderKanban, tone: 'azure' },
  { label: 'Find professionals', description: 'Electricians, plumbers, technicians and more', path: '/dashboard/jobs', icon: Search, tone: 'azure' },
  { label: 'Payment', description: 'Deposits, withdrawals and history', path: '/dashboard/payment', icon: Wallet, tone: 'success' },
  { label: 'AI assistant', description: 'Describe a problem, get matched', path: '/ai', icon: Sparkles, tone: 'warn' },
  { label: 'Settings', description: 'Profile and payout account', path: '/dashboard/settings', icon: Settings, tone: 'success' },
  { label: 'Help and support', description: 'FAQs and open an inquiry', path: '/dashboard/support', icon: HelpCircle, tone: 'warn' },
]

const NOTIFICATIONS = [
  { id: '1', title: 'Milestone paid out', desc: '₦180,000 for Inverter Mounting was released.', time: '12m', tone: 'bg-success' },
  { id: '2', title: 'New quote received', desc: 'Tunde Electrical quoted on Solar Installation.', time: '1h', tone: 'bg-azure' },
  { id: '3', title: 'Funds secured', desc: '₦450,000 held for Commercial Rewiring.', time: '3h', tone: 'bg-warn' },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser] = useState<ServerUserData | null>(null)
  const [wallet, setWallet] = useState<ServerWalletData | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const [commandIndex, setCommandIndex] = useState(0)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const [activeProjectsCount, setActiveProjectsCount] = useState(0)
  const [menuPath, setMenuPath] = useState(pathname)

  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setIsMobileMenuOpen(false)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    if (isNotificationsOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isNotificationsOpen])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false)
        setIsNotificationsOpen(false)
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    let cancelled = false
    async function syncServerData() {
      try {
        const res = await fetch('/api/dashboard/overview')
        if (res.ok) {
          const body = await res.json()
          if (!cancelled && body.data) {
            setUser(body.data.user || null)
            setWallet(body.data.wallet || null)
            setActiveProjectsCount(body.data.activeMilestonesCount || 0)
          }
        }
      } catch (err) {
        console.error('Failed to sync overview data:', err)
      } finally {
        if (!cancelled) setIsLoadingUser(false)
      }
    }
    syncServerData()
    return () => {
      cancelled = true
    }
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      router.push('/login')
    }
  }

  const navGroups: Array<{ label: string; tone: Tone; items: NavItem[] }> = [
    {
      label: 'Workspace',
      tone: 'azure',
      items: [
        { label: 'Overview', path: '/dashboard', icon: LayoutGrid },
        {
          label: 'Projects',
          path: '/dashboard/projects',
          icon: FolderKanban,
          badge: activeProjectsCount > 0 ? `${activeProjectsCount}` : null,
        },
        { label: 'Find professionals', path: '/dashboard/jobs', icon: Search },
      ],
    },
    {
      label: 'Money',
      tone: 'success',
      items: [{ label: 'Payment', path: '/dashboard/payment', icon: Wallet }],
    },
    {
      label: 'Assist',
      tone: 'warn',
      items: [{ label: 'AI assistant', path: '/ai', icon: Sparkles }],
    },
  ]

  const isActive = (path: string) =>
    path === '/dashboard' ? pathname === '/dashboard' : pathname === path || pathname.startsWith(`${path}/`)

  const allNav = [...navGroups.flatMap((g) => g.items), { label: 'Settings', path: '/dashboard/settings' }, { label: 'Support', path: '/dashboard/support' }]
  const currentSection = allNav.find((item) => isActive(item.path))?.label || 'Overview'
  const isAiPage = pathname === '/ai' || pathname.startsWith('/ai/')

  const filteredCommands = useMemo(
    () =>
      COMMANDS.filter(
        (item) =>
          item.label.toLowerCase().includes(commandQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(commandQuery.toLowerCase())
      ),
    [commandQuery]
  )

  const closePalette = () => {
    setIsCommandPaletteOpen(false)
    setCommandQuery('')
    setCommandIndex(0)
  }

  const runCommand = (path: string) => {
    closePalette()
    router.push(path)
  }

  const vaultMinor = wallet ? (wallet.escrowBalanceMinor > 0 ? wallet.escrowBalanceMinor : wallet.balanceMinor) : 0
  const displayName = user?.fullName || 'Connecta member'
  const displaySubtitle = user?.headline || user?.companyName || (user?.city ? `${user.city}, Nigeria` : 'Member')

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <BrandStripe className="h-[3px]" />
      <div className="h-[61px] px-5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <ConnectaMark size={22} />
          <span className="text-[17px] font-medium tracking-[-0.02em] text-ink">connecta</span>
        </Link>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden w-8 h-8 rounded-lg text-muted hover:bg-sunken flex items-center justify-center"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full h-9 flex items-center justify-between px-3 rounded-[10px] bg-sunken hover:bg-[#EDF0F4] text-[13px] text-muted transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            Search
          </span>
          <kbd className="text-[11px] font-sans px-1.5 h-5 inline-flex items-center rounded-md bg-surface border border-line text-subtle">
            ⌘K
          </kbd>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pt-5 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 pb-1.5 text-xs text-subtle">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.path)
                const Icon = item.icon
                const t = TONES[group.tone]
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`group relative flex items-center justify-between h-9 px-3 rounded-[10px] text-sm transition-colors duration-200 ${
                      active ? `${t.active} font-medium` : 'text-ink-2 hover:bg-sunken hover:text-ink'
                    }`}
                  >
                    {active && <span className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full ${t.bar} cn-fade`} />}
                    <span className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? t.icon : 'text-subtle group-hover:text-ink-2'}`} />
                      {item.label}
                    </span>
                    {item.badge && (
                      <span
                        className={`min-w-5 h-5 px-1.5 rounded-full text-[11px] font-medium inline-flex items-center justify-center ${
                          active ? t.badge : 'bg-sunken text-ink-2'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 space-y-2">
        <Link
          href="/dashboard/payment"
          className="block rounded-xl border border-line p-3.5 hover:border-line-strong transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success cn-live-dot" />
              Vault balance
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-subtle" />
          </div>
          <div className="mt-1.5 text-lg font-medium tracking-[-0.02em] text-success-ink">
            {isLoadingUser ? <Skeleton className="h-6 w-24" /> : <AnimatedNumber value={vaultMinor / 100} format={formatNaira} />}
          </div>
        </Link>

        <div className="flex items-center gap-2.5 px-1.5 py-1.5">
          {isLoadingUser ? (
            <>
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </>
          ) : (
            <Link href="/dashboard/settings" className="flex items-center gap-2.5 min-w-0 flex-1 group">
              <Avatar name={displayName} size={32} />
              <div className="min-w-0">
                <div className="text-[13px] font-medium text-ink truncate group-hover:text-azure-600 transition-colors">
                  {displayName}
                </div>
                <div className="text-xs text-muted truncate">{displaySubtitle}</div>
              </div>
            </Link>
          )}
          <div className="flex items-center">
            <Link
              href="/dashboard/settings"
              title="Settings"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isActive('/dashboard/settings') ? 'text-success-ink bg-success-50' : 'text-subtle hover:text-ink hover:bg-sunken'
              }`}
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-subtle hover:text-ink hover:bg-sunken transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-canvas text-ink flex font-sans antialiased selection:bg-azure/15">
      <aside className="hidden lg:block w-[248px] shrink-0 bg-surface border-r border-line sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[284px] max-w-[85vw] bg-surface shadow-2xl cn-slide-in">{sidebarContent}</div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 bg-canvas/85 backdrop-blur-md border-b border-line flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 -ml-1.5 rounded-lg text-ink-2 hover:bg-sunken flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/dashboard" className="lg:hidden">
              <ConnectaMark size={20} />
            </Link>
            <nav className="hidden sm:flex items-center gap-1.5 text-[13px] text-muted min-w-0">
              <Link href="/dashboard" className="hover:text-ink transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-subtle" />
              <span className="text-ink font-medium truncate">{currentSection}</span>
            </nav>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg text-muted hover:text-ink hover:bg-sunken flex items-center justify-center"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  isNotificationsOpen ? 'bg-sunken text-ink' : 'text-muted hover:text-ink hover:bg-sunken'
                }`}
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-azure ring-2 ring-canvas" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-[340px] max-w-[calc(100vw-2rem)] bg-surface rounded-2xl border border-line shadow-[0_20px_40px_-16px_rgba(17,24,39,0.22)] z-50 cn-pop origin-top-right overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-line">
                    <span className="text-sm font-medium text-ink">Notifications</span>
                    <span className="text-xs text-muted">{NOTIFICATIONS.length} new</span>
                  </div>
                  <ul className="py-1.5">
                    {NOTIFICATIONS.map((n) => (
                      <li key={n.id} className="px-4 py-2.5 flex gap-3 hover:bg-canvas transition-colors">
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.tone}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[13px] font-medium text-ink">{n.title}</span>
                            <span className="text-xs text-subtle">{n.time}</span>
                          </div>
                          <p className="text-[13px] text-muted mt-0.5 leading-snug">{n.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Link
              href="/dashboard/support"
              title="Help and support"
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                isActive('/dashboard/support') ? 'text-warn-ink bg-warn-50' : 'text-muted hover:text-ink hover:bg-sunken'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {isAiPage ? (
          <main className="flex-1 flex flex-col min-h-0 h-[calc(100vh-3.5rem)] overflow-hidden">{children}</main>
        ) : (
          <main key={pathname} className="flex-1 w-full max-w-[1120px] mx-auto px-5 sm:px-8 lg:px-12 py-8 lg:py-10 cn-fade">
            {children}
          </main>
        )}
      </div>

      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[12vh]">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={closePalette} />
          <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.3)] overflow-hidden cn-pop">
            <div className="flex items-center gap-3 px-4 h-14 border-b border-line">
              <Search className="w-4 h-4 text-subtle" />
              <input
                type="text"
                autoFocus
                placeholder="Where do you want to go?"
                value={commandQuery}
                onChange={(e) => {
                  setCommandQuery(e.target.value)
                  setCommandIndex(0)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault()
                    setCommandIndex((i) => Math.min(i + 1, filteredCommands.length - 1))
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault()
                    setCommandIndex((i) => Math.max(i - 1, 0))
                  } else if (e.key === 'Enter' && filteredCommands[commandIndex]) {
                    runCommand(filteredCommands[commandIndex].path)
                  }
                }}
                className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-subtle focus:outline-none"
              />
              <kbd className="text-[11px] px-1.5 h-5 inline-flex items-center rounded-md bg-sunken text-muted">esc</kbd>
            </div>

            <ul className="p-2 max-h-80 overflow-y-auto">
              {filteredCommands.length === 0 && (
                <li className="px-3 py-8 text-center text-sm text-muted">Nothing matches “{commandQuery}”</li>
              )}
              {filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon
                const selected = idx === commandIndex
                return (
                  <li key={cmd.path}>
                    <button
                      type="button"
                      onMouseEnter={() => setCommandIndex(idx)}
                      onClick={() => runCommand(cmd.path)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                        selected ? 'bg-sunken' : ''
                      }`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          selected ? TONES[cmd.tone].tile : 'bg-sunken text-muted'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-ink">{cmd.label}</span>
                        <span className="block text-xs text-muted truncate">{cmd.description}</span>
                      </span>
                      {selected && <CornerDownLeft className="w-3.5 h-3.5 text-subtle" />}
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="px-4 h-10 border-t border-line flex items-center gap-4 text-xs text-subtle">
              <span>↑↓ to move</span>
              <span>↵ to open</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
