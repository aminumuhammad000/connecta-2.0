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
  Plus,
  LogOut,
  Sparkles,
  Settings,
  Bell,
  Command,
  ArrowRight,
  ChevronRight,
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

  const navItems = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Projects',
      path: '/dashboard/projects',
      icon: Briefcase,
      badge: activeProjectsCount > 0 ? `${activeProjectsCount}` : null,
    },
    {
      label: 'Find Professionals',
      path: '/dashboard/jobs',
      icon: Search,
      badge: '10+',
    },
    {
      label: 'Payment',
      path: '/dashboard/payment',
      icon: Wallet,
      badge: null,
    },
    {
      label: 'AI Specialist',
      path: '/ai',
      icon: Sparkles,
      badge: null,
    },
    {
      label: 'Settings',
      path: '/dashboard/settings',
      icon: Settings,
      badge: null,
    },
  ]

  const commandPaletteItems = [
    { label: 'Overview', description: 'Dashboard metrics and active contracts', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Projects & Contracts', description: 'Review deliverables and milestone payments', path: '/dashboard/projects', icon: Briefcase },
    { label: 'Find Service Professionals', description: 'Search vetted electricians, plumbers, and contractors', path: '/dashboard/jobs', icon: Search },
    { label: 'Payment', description: 'Protected vault balance, deposits, and settlement payouts', path: '/dashboard/payment', icon: Wallet },
    { label: 'AI Diagnostic Assistant', description: 'Describe technical issues to match vetted artisans', path: '/ai', icon: Sparkles },
    { label: 'Account & Payout Settings', description: 'Manage profile and Flutterwave settlement account', path: '/dashboard/settings', icon: Settings },
    { label: 'Support & FAQs', description: 'Escrow charter safeguards and dispute resolution', path: '/dashboard/support', icon: HelpCircle },
  ]

  const filteredCommands = commandPaletteItems.filter((item) =>
    item.label.toLowerCase().includes(commandQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(commandQuery.toLowerCase())
  )

  const notifications = [
    {
      id: '1',
      title: 'Milestone Disbursed',
      desc: '₦180,000 for Inverter Mounting released to provider',
      time: '12m ago',
    },
    {
      id: '2',
      title: 'New Proposal Received',
      desc: 'Tunde Electrical submitted quote on Solar Installation',
      time: '1h ago',
    },
    {
      id: '3',
      title: 'Vault Protected',
      desc: '₦450,000 funded in Escrow for Commercial Rewiring',
      time: '3h ago',
    },
  ]

  const currentSection = navItems.find((item) => item.path === pathname)?.label || 'Overview'

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-zinc-900 flex font-sans antialiased selection:bg-[#0C513F] selection:text-white">
      {/* Sleek Minimalist Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white border-r border-zinc-200/70 p-5 justify-between">
        <div className="space-y-6">
          {/* Brand */}
          <Link href="/dashboard" className="flex items-center gap-2.5 px-2">
            <div className="w-7 h-7 rounded-lg bg-[#0C513F] flex items-center justify-center p-1.5 shrink-0">
              <div className="relative w-4 h-4">
                <Image
                  src="/brand/connecta-header-icon.svg"
                  alt="Connecta"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-900">connecta</span>
              <span className="text-[10px] font-medium text-zinc-400">escrow</span>
            </div>
          </Link>

          {/* Quick Search Shortcut */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/60 text-xs text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-400" />
              <span className="font-normal">Search or jump to...</span>
            </div>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-400">
              ⌘K
            </kbd>
          </button>

          {/* Nav Links */}
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-zinc-900 text-white font-semibold'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* User Profile & Escrow Status */}
        <div className="space-y-3 pt-4 border-t border-zinc-100">
          <Link
            href="/dashboard/payment"
            className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100/80 transition-colors text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-zinc-600 font-medium">Vault Balance</span>
            </div>
            <span className="font-semibold text-zinc-900">
              {wallet ? formatNaira(wallet.escrowBalanceMinor > 0 ? wallet.escrowBalanceMinor : wallet.balanceMinor) : '₦0'}
            </span>
          </Link>

          <div className="flex items-center justify-between px-1">
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-2.5 min-w-0 group"
            >
              <div className="w-7 h-7 rounded-full bg-zinc-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-zinc-900 truncate group-hover:text-[#0C513F] transition-colors">
                  {userDisplayName}
                </div>
                <div className="text-[10px] text-zinc-400 truncate">
                  {userDisplaySubtitle}
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href="/dashboard/support"
                title="Help & Dispute Support"
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                title="Sign out"
                className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Minimalist Topbar */}
        <header className="sticky top-0 z-30 bg-[#FBFBFB]/90 backdrop-blur-md border-b border-zinc-200/60 h-14 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-zinc-600 hover:bg-zinc-200/60"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <span>Dashboard</span>
              <ChevronRight className="w-3 h-3 text-zinc-300" />
              <span className="text-zinc-900 font-semibold">{currentSection}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications Popover */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#0C513F]" />
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-zinc-200/80 p-4 space-y-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                    <span className="text-xs font-semibold text-zinc-900">Activity</span>
                    <span className="text-[10px] text-zinc-400">All saved</span>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2 rounded-xl bg-zinc-50 text-xs space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-900">{n.title}</span>
                          <span className="text-[10px] text-zinc-400">{n.time}</span>
                        </div>
                        <p className="text-zinc-500 text-[11px]">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Help & Support Action */}
            <Link
              href="/dashboard/support"
              title="Help & Support"
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-6 border-t border-zinc-200 space-y-4 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="font-bold text-sm text-zinc-900">Menu</span>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 rounded-full text-zinc-500 hover:bg-zinc-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.path
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium ${
                        isActive ? 'bg-zinc-900 text-white font-semibold' : 'text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600">
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

        {/* Main Viewport */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto">{children}</main>
      </div>

      {/* Global Command Palette Modal (⌘K) */}
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-xs flex items-start justify-center p-4 pt-20">
          <div className="bg-white rounded-2xl max-w-lg w-full p-3 shadow-2xl border border-zinc-200/80 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                autoFocus
                placeholder="Type a screen or command..."
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:bg-white transition-colors"
              />
            </div>

            <div className="space-y-0.5 max-h-64 overflow-y-auto">
              {filteredCommands.map((cmd) => {
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
                    className="w-full text-left p-2 rounded-xl hover:bg-zinc-100 flex items-center justify-between gap-3 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-900 truncate">
                          {cmd.label}
                        </div>
                        <div className="text-[11px] text-zinc-400 truncate">
                          {cmd.description}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-600 transition-colors shrink-0" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
