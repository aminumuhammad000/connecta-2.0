'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Search,
  Users,
  Wallet,
  Rss,
  HelpCircle,
  Menu,
  X,
  RefreshCw,
  Bell,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  LogOut,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  // State
  const [activeRole, setActiveRole] = useState<'client' | 'provider'>('client')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)

  // Navigation Items
  const navItems = [
    {
      label: 'Overview',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: activeRole === 'client' ? 'Projects & Briefs' : 'Active Contracts',
      path: '/dashboard/projects',
      icon: Briefcase,
      badge: activeRole === 'client' ? '2' : '1',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      label: 'Marketplace Jobs',
      path: '/dashboard/jobs',
      icon: Search,
      badge: '4 Live',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Collabo Squads',
      path: '/dashboard/squads',
      icon: Users,
      badge: 'Squads',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      label: 'Escrow Wallet',
      path: '/dashboard/wallet',
      icon: Wallet,
      badge: '₦480k',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      label: 'Community Feed',
      path: '/dashboard/feed',
      icon: Rss,
      badge: null,
    },
    {
      label: 'Help & Charter FAQs',
      path: '/dashboard/support',
      icon: HelpCircle,
      badge: null,
    },
  ]

  const handleRoleToggle = () => {
    setIsSwitching(true)
    setTimeout(() => {
      setActiveRole((prev) => (prev === 'client' ? 'provider' : 'client'))
      setIsSwitching(false)
    }, 350)
  }

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col font-sans selection:bg-[#4D78FF] selection:text-white relative">
      {/* Signature Halftone Dot-Matrix Texture */}
      <div
        className="fixed inset-0 opacity-[0.045] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(#0A2614 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full bg-[#0C513F] flex items-center justify-center p-1.5 shadow-xs transition-transform group-hover:scale-105 shrink-0">
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
                <span className="font-black text-lg tracking-tight text-[#0A1020]">
                  connecta
                </span>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-emerald-100 text-[#0C513F] tracking-wider">
                  2.0
                </span>
              </div>
            </Link>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Role Switcher Pill */}
            <button
              type="button"
              onClick={handleRoleToggle}
              disabled={isSwitching}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98 bg-white border-slate-200 text-slate-800 hover:border-slate-300"
              title="Switch role view"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#0C513F] ${isSwitching ? 'animate-spin' : ''}`} />
              <span>
                {activeRole === 'client' ? 'Hiring Workspace' : 'Specialist Pro'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            </button>

            {/* AI Sparks Badge */}
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full text-xs font-extrabold text-amber-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{activeRole === 'client' ? '25 Sparks' : '10 Sparks'}</span>
            </div>

            {/* Escrow Balance Pill */}
            <Link
              href="/dashboard/wallet"
              className="hidden md:inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-[#0C513F] hover:bg-emerald-500/20 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>₦480,000 Escrow</span>
            </Link>

            {/* Action CTA Button */}
            {activeRole === 'client' ? (
              <Link
                href="/requests/new"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0C513F] hover:bg-[#083b2e] text-white px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Post Project</span>
              </Link>
            ) : (
              <Link
                href="/dashboard/jobs"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Find Jobs</span>
              </Link>
            )}

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-[#0A1020] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                {activeRole === 'client' ? 'TB' : 'IA'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Wrapper with Sticky Sidebar + Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6 relative z-10">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col w-64 shrink-0 space-y-4">
          {/* User Account Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                <Image
                  src={
                    activeRole === 'client'
                      ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
                      : '/images/services/nigerian_electrician_ibrahim.jpg'
                  }
                  alt="User"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-sm text-[#0A1020] truncate">
                  {activeRole === 'client' ? 'Tunde Bakare' : 'Ibrahim Aliyu'}
                </div>
                <div className="text-[11px] text-slate-500 font-medium truncate">
                  {activeRole === 'client' ? 'PayFlow Tech' : 'Master Solar Lead'}
                </div>
              </div>
            </div>

            {/* Quick Switch Button */}
            <button
              type="button"
              onClick={handleRoleToggle}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 text-[#0C513F] ${isSwitching ? 'animate-spin' : ''}`} />
              <span>Switch to {activeRole === 'client' ? 'Specialist View' : 'Client View'}</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="bg-white rounded-3xl p-3 border border-slate-200/90 shadow-sm space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0A1020] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#0A1020] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/20'
                          : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Escrow Guarantee Trust Banner */}
          <div className="bg-gradient-to-br from-[#0C513F] to-[#0A2614] rounded-3xl p-4 text-white space-y-2 shadow-md">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>Milestone Escrow Charter</span>
            </div>
            <p className="text-[11px] text-white/80 leading-relaxed font-medium">
              Every naira is held in a protected Nigerian escrow vault. Released solely upon completed inspections.
            </p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl p-6 border-t border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-extrabold text-base text-[#0A1020]">Dashboard Navigation</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-[#0C513F]">
                    {activeRole === 'client' ? 'Client' : 'Provider'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Role Switcher */}
              <button
                type="button"
                onClick={handleRoleToggle}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#0C513F] ${isSwitching ? 'animate-spin' : ''}`} />
                <span>Switch to {activeRole === 'client' ? 'Specialist View' : 'Client View'}</span>
              </button>

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
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#0A1020] text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-[#10B981]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            isActive
                              ? 'bg-white/20 text-white border-white/20'
                              : item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
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
