'use client'

import React, { useState, useEffect } from 'react'
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
  trade?: string
  bio?: string
  skills?: string[]
  companyName?: string
}

interface ServerWalletData {
  balanceMinor: number
  escrowBalanceMinor: number
  sparksBalance: number
  currency: string
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  // State
  const [user, setUser] = useState<ServerUserData | null>(null)
  const [wallet, setWallet] = useState<ServerWalletData | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [openJobsCount, setOpenJobsCount] = useState(0)
  const [activeProjectsCount, setActiveProjectsCount] = useState(0)

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard/overview')
      if (res.ok) {
        const body = await res.json()
        if (body.data) {
          const u = body.data.user
          setUser(u)
          setWallet(body.data.wallet)

          if (body.data.recentJobs) {
            setOpenJobsCount(body.data.recentJobs.length)
          }
          if (body.data.activeBooking) {
            setActiveProjectsCount(1)
          } else {
            setActiveProjectsCount(0)
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard layout data:', err)
    } finally {
      setIsLoadingUser(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const handleLogout = () => {
    document.cookie = 'connecta_session=; path=/; max-age=0'
    document.cookie = 'connecta_role=; path=/; max-age=0'
    router.push('/login')
  }

  // Format currency
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
      label: 'Help & FAQs',
      path: '/dashboard/support',
      icon: HelpCircle,
      badge: null,
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

          {/* Center Quick AI Search Trigger */}
          <Link
            href="/ai"
            className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100/80 border border-zinc-200/80 text-xs text-zinc-500 hover:text-zinc-800 transition-all w-72 lg:w-96 group shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0C513F] group-hover:scale-110 transition-transform" />
            <span className="flex-1 text-left font-medium">Ask AI to find trades or describe work...</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-400">
              AI
            </span>
          </Link>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3">
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

            {/* Action CTA Button */}
            <Link
              href="/requests/new"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0C513F] hover:bg-[#083b2e] text-white px-3.5 sm:px-4 py-2 text-xs font-semibold shadow-xs hover:shadow transition-all active:scale-98"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Post Request</span>
            </Link>

            {/* User Profile Avatar with Initials */}
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
              {user?.avatarUrl ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-zinc-200 shadow-2xs">
                  <Image src={user.avatarUrl} alt={userDisplayName} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  {userInitials}
                </div>
              )}

              <button
                type="button"
                onClick={handleLogout}
                title="Sign out of Connecta"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
          <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs space-y-2">
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
          </div>

          {/* Navigation Links */}
          <nav className="bg-white rounded-2xl p-2 border border-zinc-200/80 shadow-xs space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
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
                      className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all ${
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
    </div>
  )
}
