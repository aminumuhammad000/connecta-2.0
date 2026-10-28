'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Search,
  Wallet,
  HelpCircle,
  Menu,
  X,
  ShieldCheck,
  PlusCircle,
  LogOut,
  Sparkles,
  Settings,
  Bell,
  Command,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

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

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [user, setUser] = useState<ServerUserData | null>(null)
  const [wallet, setWallet] = useState<ServerWalletData | null>(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Command Palette & Notifications State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [commandQuery, setCommandQuery] = useState('')
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)

  // In-flight contract counts
  const [activeProjectsCount, setActiveProjectsCount] = useState(0)
  const [openJobsCount, setOpenJobsCount] = useState(0)

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false)
      }
    }
    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isNotificationsOpen])

  // Global Command Palette Shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false)
        setIsNotificationsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Sync state from server on mount
  const syncServerData = async () => {
    try {
      const res = await fetch('/api/dashboard/overview')
      if (res.ok) {
        const body = await res.json()
        if (body.data) {
          setUser(body.data.user || null)
          setWallet(body.data.wallet || null)
          setActiveProjectsCount(body.data.activeMilestonesCount || 0)
          setOpenJobsCount(body.data.openJobsCount || 0)
        }
      }
    } catch (err) {
      console.error('Failed to sync overview data:', err)
    } finally {
      setIsLoadingUser(false)
    }
  }

  useEffect(() => {
    syncServerData()
  }, [pathname])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch {
      router.push('/login')
    }
  }

  const formatNaira = (minor: number) => {
    const val = minor / 100
    if (val >= 1000) {
      return `₦${(val / 1000).toFixed(0)}k`
    }
    return `₦${val.toLocaleString('en-NG')}`
  }

  const userInitials = user
    ? `${user.firstName?.[0] || 'C'}${user.lastName?.[0] || 'U'}`.toUpperCase()
    : 'CU'

  const userDisplayName = user?.fullName || 'Connecta Member'
  const userDisplaySubtitle = user?.headline || user?.companyName || (user?.city ? `${user.city}, Nigeria` : 'Verified Member')

  // Navigation Items
  const navItems = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Projects & Contracts',
      path: '/dashboard/projects',
      icon: Briefcase,
      badge: activeProjectsCount > 0 ? `${activeProjectsCount} Active` : null,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
      label: 'AI Service Search',
      path: '/ai',
      icon: Sparkles,
      badge: 'AI Chat',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
      label: 'Marketplace Jobs',
      path: '/dashboard/jobs',
      icon: Search,
      badge: openJobsCount > 0 ? `${openJobsCount} Live` : null,
      badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
    },
    {
      label: 'Escrow Wallet',
      path: '/dashboard/wallet',
      icon: Wallet,
      badge: wallet ? formatNaira(wallet.escrowBalanceMinor > 0 ? wallet.escrowBalanceMinor : wallet.balanceMinor) : '₦0',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    },
    {
      label: 'Settings & Payouts',
      path: '/dashboard/settings',
      icon: Settings,
      badge: null,
    },
    {
      label: 'Help & FAQs',
      path: '/dashboard/support',
      icon: HelpCircle,
      badge: null,
    },
  ]

  // Command palette quick actions
  const commandPaletteItems = [
    { label: 'Overview', description: 'Main dashboard metrics and recent contracts', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects & Contracts', description: 'Review deliverables and release milestone payments', path: '/dashboard/projects', icon: Briefcase },
    { label: 'Marketplace Job Briefs', description: 'Browse verified client briefs and submit proposals', path: '/dashboard/jobs', icon: Search },
    { label: 'Escrow Wallet', description: 'Manage protected escrow vault and withdrawals', path: '/dashboard/wallet', icon: Wallet },
    { label: 'AI Service Search', description: 'Ask the AI diagnostic chat to locate vetted trades', path: '/ai', icon: Sparkles },
    { label: 'Account & Payout Settings', description: 'Set Nigerian bank account for automated payouts', path: '/dashboard/settings', icon: Settings },
    { label: 'Support & Escrow Charter', description: 'Review dispute resolution protocols and FAQs', path: '/dashboard/support', icon: HelpCircle },
    { label: 'Post New Job Request', description: 'Broadcast a verified trade brief to local artisans', path: '/requests/new', icon: PlusCircle },
  ]

  const filteredCommands = commandPaletteItems.filter((item) =>
    item.label.toLowerCase().includes(commandQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(commandQuery.toLowerCase())
  )

  const notifications = [
    {
      id: '1',
      title: 'Milestone Disbursed',
      desc: '₦180,000 for Inverter Mounting settled to provider',
      time: '12m ago',
      unread: true,
    },
    {
      id: '2',
      title: 'New Proposal Received',
      desc: 'Tunde Electrical quoted on Lekki Phase 1 Solar Project',
      time: '1h ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Escrow Vault Funded',
      desc: '₦450,000 locked safely for Commercial Conduit Rewiring',
      time: '3h ago',
      unread: false,
    },
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-zinc-900 flex flex-col font-sans selection:bg-[#0C513F] selection:text-white">
      {/* Top Clean Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-600 hover:bg-zinc-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-[#0C513F] flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105 shrink-0">
                <div className="relative w-4.5 h-4.5">
                  <Image
                    src="/brand/connecta-header-icon.svg"
                    alt="Connecta Icon"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-lg tracking-tight text-zinc-900">
                  connecta
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 tracking-wider">
                  2.0
                </span>
              </div>
            </Link>
          </div>

          {/* Center Quick Command Search Trigger */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 text-xs text-zinc-500 hover:text-zinc-800 transition-all w-72 lg:w-96 group shadow-2xs cursor-pointer text-left"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
            <span className="flex-1 font-medium">Search contracts, jobs, or jump to...</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-400">
              <Command className="w-2.5 h-2.5" /> K
            </span>
          </button>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Escrow Balance Pill */}
            <Link
              href="/dashboard/wallet"
              className="hidden sm:inline-flex items-center gap-2 bg-emerald-50/80 border border-emerald-200/70 px-3 py-1.5 rounded-full text-xs font-semibold text-[#0C513F] hover:bg-emerald-100/70 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>
                {wallet ? (wallet.escrowBalanceMinor > 0 ? formatNaira(wallet.escrowBalanceMinor) : '₦0') : '₦0'} in Escrow
              </span>
            </Link>

            {/* Notifications Popover Trigger */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                className="relative p-2 rounded-xl text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0C513F] ring-2 ring-white" />
              </button>

              {/* Minimal Notifications Drawer */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-4 space-y-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                    <span className="text-xs font-bold text-zinc-900">Escrow &amp; Contract Activity</span>
                    <span className="text-[10px] text-zinc-400 font-medium">All updates saved</span>
                  </div>

                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs transition-colors ${
                          n.unread ? 'bg-zinc-50/90 border border-zinc-200/60' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900">{n.title}</span>
                          <span className="text-[10px] text-zinc-400">{n.time}</span>
                        </div>
                        <p className="text-zinc-600 text-[11px] mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <Link
                      href="/dashboard/wallet"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-[#0C513F] font-semibold hover:underline"
                    >
                      View Escrow Ledger
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-zinc-400 hover:text-zinc-600 text-[11px]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action CTA Button */}
            <Link
              href="/requests/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold shadow-xs transition-all active:scale-98"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Post Request</span>
            </Link>

            {/* User Profile Avatar with Initials */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-200">
              <Link
                href="/dashboard/settings"
                title="Account Settings"
                className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 shadow-2xs flex items-center justify-center bg-zinc-900 text-white font-bold text-xs hover:opacity-90 transition-opacity"
              >
                {user?.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={userDisplayName} fill className="object-cover" />
                ) : (
                  userInitials
                )}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Sign out of Connecta"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Wrapper with Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 relative z-10">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 space-y-4">
          {/* User Account Snippet */}
          <Link
            href="/dashboard/settings"
            className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-2 hover:border-zinc-300 transition-colors block"
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shrink-0 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <Image src={user.avatarUrl} alt={userDisplayName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                    {userInitials}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-zinc-900 truncate">
                  {isLoadingUser ? 'Loading...' : userDisplayName}
                </div>
                <div className="text-[11px] text-zinc-500 font-medium truncate">
                  {userDisplaySubtitle}
                </div>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="bg-white rounded-2xl p-2 border border-zinc-200/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)] space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0C513F] text-white shadow-2xs font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/20'
                          : item.badgeColor || 'bg-zinc-100 text-zinc-600 border-zinc-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Escrow Charter Minimal Trust Card */}
          <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 text-zinc-700 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0C513F]">
              <ShieldCheck className="w-4 h-4 text-[#0C513F]" />
              <span>Escrow Charter</span>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Every payment is secured in a CBN-compliant escrow vault until you approve inspection.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-6 border-t border-zinc-200 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="font-bold text-sm text-zinc-900">Navigation</span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-zinc-500 hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.path
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-[#0C513F] text-white shadow-2xs font-semibold'
                          : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-white/20 text-white border-white/20'
                              : item.badgeColor || 'bg-zinc-100 text-zinc-600 border-zinc-200'
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
          </div>
        )}

        {/* Dynamic Route Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Global Command Palette Modal (⌘K) */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
          <div className="bg-white rounded-2xl max-w-xl w-full p-4 shadow-2xl border border-zinc-200/80 space-y-3 animate-in zoom-in-95 duration-150">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search screens, actions, contracts... (Esc to close)"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50/80 border border-zinc-200 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#0C513F] focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-1 max-h-72 overflow-y-auto">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd) => {
                  const Icon = cmd.icon
                  return (
                    <button
                      key={cmd.path}
                      type="button"
                      onClick={() => {
                        setIsCommandPaletteOpen(false)
                        setCommandQuery('')
                        router.push(cmd.path)
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-zinc-100 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-zinc-100 group-hover:bg-[#0C513F] group-hover:text-white text-zinc-600 flex items-center justify-center shrink-0 transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-zinc-900 group-hover:text-[#0C513F] transition-colors truncate">
                            {cmd.label}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate font-normal">
                            {cmd.description}
                          </div>
                        </div>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-600 transition-colors shrink-0" />
                    </button>
                  )
                })
              ) : (
                <div className="py-6 text-center text-xs text-zinc-400">
                  No matching screens or actions found.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 px-1">
              <span>Navigate with cursor or keys</span>
              <span>Press Esc to exit</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
