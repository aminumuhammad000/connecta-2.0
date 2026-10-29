'use client'

import React, { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Users,
  Briefcase,
  ShieldCheck,
  CreditCard,
  AlertTriangle,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Star,
  FileText,
  ChevronRight,
  ArrowUpRight,
  Eye,
  Lock,
  Unlock,
  Check,
  X,
  Menu,
  Sparkles,
  RefreshCw,
  LogOut,
  Building2,
  Wrench,
  DollarSign,
  TrendingUp,
  ExternalLink,
  SlidersHorizontal,
  Mail,
  ChevronDown,
  User,
  BadgeCheck,
  Phone,
  Edit3,
  Save,
} from 'lucide-react'
import AdminEmailHub, { EmailDispatchItem } from './AdminEmailHub'
import { Spinner } from '@/components/brand/ConnectaLoader'

interface AdminMetrics {
  totalUsers: number
  totalCustomers: number
  totalProviders: number
  totalJobs: number
  activeJobs: number
  totalContracts: number
  activeContracts: number
  completedContracts: number
  totalEscrowLockedMinor: number
  totalEscrowReleasedMinor: number
  totalPlatformFeeRevenueMinor: number
  pendingVerificationsCount: number
  openDisputesCount: number
}

interface UserItem {
  id: string
  fullName: string
  businessName: string
  email: string
  phone: string
  role: 'customer' | 'provider' | 'admin'
  city: string
  state: string
  trade: string
  verificationStatus: 'verified' | 'unverified'
  experienceYears: number
  averageRating: number
  completedJobs: number
  hourlyRateMinor: number
  joinedDate: string
  accountStatus: 'active' | 'suspended'
}

interface ServiceRequestItem {
  id: string
  customerId: string
  customerName: string
  customerCompany?: string
  title: string
  category: string
  categorySlug: string
  description: string
  urgency: 'emergency' | 'today' | 'scheduled' | 'flexible'
  serviceMode: 'onsite' | 'remote' | 'dropoff'
  city: string
  state: string
  budgetMinMinor: number
  budgetMaxMinor: number
  currency: string
  status: 'open' | 'matching' | 'quoted' | 'booked' | 'closed'
  requiredSkills: string[]
  proposalsCount: number
  createdAt: string
}

interface BookingContractItem {
  id: string
  bookingNumber: string
  customerId: string
  clientName: string
  clientCompany?: string
  providerId: string
  providerName: string
  providerTitle: string
  title: string
  category: string
  location: string
  totalAmountMinor: number
  currency: string
  escrowStatus: 'locked' | 'partially_released' | 'released'
  bookingStatus: 'pending' | 'in_progress' | 'completed' | 'disputed'
  progressPercentage: number
  appointmentDate: string
  milestones: Array<{
    id: string
    title: string
    amountMinor: number
    status: 'completed' | 'current' | 'pending'
  }>
  createdAt: string
}

interface VerificationCaseItem {
  id: string
  providerName: string
  businessName: string
  trade: string
  city: string
  status: 'under_review' | 'approved' | 'rejected'
  submittedAt: string
  documentType: string
  documentNumber: string
  yearsOfExperience: number
  rejectionReason?: string
}

interface DisputeItem {
  id: string
  disputeNumber: string
  bookingId: string
  bookingNumber: string
  bookingTitle: string
  amountMinor: number
  claimantName: string
  claimantRole: string
  respondentName: string
  respondentRole: string
  reason: string
  status: 'under_review' | 'mediation' | 'resolved'
  filedDate: string
  lastUpdate: string
  evidenceItems: number
  notes: string
}

export interface AdminProfileData {
  id: string
  fullName: string
  firstName?: string
  lastName?: string
  email: string
  phone: string
  whatsapp?: string
  role: string
  country: string
  city: string
  currency?: string
  avatarUrl?: string | null
  headline?: string
  bio?: string
  skills?: string[]
  companyName?: string
  welcomeSparks?: number
  accountStatus?: string
  createdAt?: string
  updatedAt?: string
  wallet?: {
    balanceMinor: number
    escrowBalanceMinor: number
    sparksBalance: number
    currency: string
  } | null
}

type TabType =
  | 'overview'
  | 'users'
  | 'jobs'
  | 'contracts'
  | 'verifications'
  | 'payments'
  | 'disputes'
  | 'settings'
  | 'email'

export default function AdminClientView({
  initialData,
}: {
  initialData: {
    adminProfile?: AdminProfileData | null
    metrics: AdminMetrics
    users: UserItem[]
    serviceRequests: ServiceRequestItem[]
    bookings: BookingContractItem[]
    disputes: DisputeItem[]
    verificationCases: VerificationCaseItem[]
    emailDispatches?: EmailDispatchItem[]
  }
}) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Datasets in state
  const [metrics, setMetrics] = useState<AdminMetrics>(initialData.metrics)
  const [users, setUsers] = useState<UserItem[]>(initialData.users)
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestItem[]>(initialData.serviceRequests)
  const [bookings, setBookings] = useState<BookingContractItem[]>(initialData.bookings)
  const [verificationCases, setVerificationCases] = useState<VerificationCaseItem[]>(initialData.verificationCases)
  const [disputes, setDisputes] = useState<DisputeItem[]>(initialData.disputes)

  // Filters & Search
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'customer' | 'provider'>('all')

  const [jobSearch, setJobSearch] = useState('')
  const [jobTradeFilter, setJobTradeFilter] = useState('all')

  const [bookingFilter, setBookingFilter] = useState<'all' | 'locked' | 'released'>('all')

  // Modals state
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  const [selectedCase, setSelectedCase] = useState<VerificationCaseItem | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const [actionBooking, setActionBooking] = useState<{
    booking: BookingContractItem
    type: 'release' | 'refund'
  } | null>(null)

  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null)
  const [disputeResolutionText, setDisputeResolutionText] = useState('')

  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [emailDispatches, setEmailDispatches] = useState<EmailDispatchItem[]>(
    initialData.emailDispatches || []
  )
  const [preselectedEmailUser, setPreselectedEmailUser] = useState<UserItem | null>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [showAdminProfileModal, setShowAdminProfileModal] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Real Admin Profile from Server Database
  const [adminProfile, setAdminProfile] = useState<AdminProfileData | null>(
    initialData.adminProfile || null
  )

  const currentAdmin: AdminProfileData = adminProfile || initialData.adminProfile || {
    id: 'adm-001',
    fullName: 'Malam Aminu Danbatta',
    email: 'admin@connecta.ng',
    phone: '+2348030000001',
    whatsapp: '+2348030000001',
    role: 'admin',
    country: 'Nigeria',
    city: 'Kano',
    currency: 'NGN',
    avatarUrl: '/brand/svg/connecta-icon.svg',
    headline: 'Lead Platform Administrator & Escrow Supervisor',
    bio: 'Official administrator account for Connecta platform governance, trade artisan verification, and escrow administration.',
    companyName: 'Connecta Platform Administration',
    skills: ['Platform Administration', 'Escrow Oversight', 'Dispute Resolution'],
    welcomeSparks: 500,
    accountStatus: 'active',
    createdAt: '2026-01-01T00:00:00.000Z',
  }

  // Admin Profile Edit State
  const [isEditingAdminProfile, setIsEditingAdminProfile] = useState(false)
  const [editAdminForm, setEditAdminForm] = useState({
    fullName: currentAdmin.fullName,
    phone: currentAdmin.phone,
    whatsapp: currentAdmin.whatsapp || currentAdmin.phone,
    headline: currentAdmin.headline || '',
    bio: currentAdmin.bio || '',
    city: currentAdmin.city,
    country: currentAdmin.country,
  })
  const [isSavingAdminProfile, setIsSavingAdminProfile] = useState(false)
  const [adminProfileSuccessNotice, setAdminProfileSuccessNotice] = useState<string | null>(null)

  const getInitials = (name: string) => {
    if (!name) return 'AD'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  const handleOpenProfileModal = () => {
    setProfileMenuOpen(false)
    setEditAdminForm({
      fullName: currentAdmin.fullName,
      phone: currentAdmin.phone,
      whatsapp: currentAdmin.whatsapp || currentAdmin.phone,
      headline: currentAdmin.headline || '',
      bio: currentAdmin.bio || '',
      city: currentAdmin.city,
      country: currentAdmin.country,
    })
    setIsEditingAdminProfile(false)
    setAdminProfileSuccessNotice(null)
    setShowAdminProfileModal(true)
  }

  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingAdminProfile(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_admin_profile',
          payload: editAdminForm,
        }),
      })
      const json = await res.json()
      if (json.success && json.profile) {
        setAdminProfile((prev) => ({
          ...(prev || currentAdmin),
          ...json.profile,
        }))
        setAdminProfileSuccessNotice('Profile details saved to server database!')
        setIsEditingAdminProfile(false)
        setTimeout(() => setAdminProfileSuccessNotice(null), 3000)
      }
    } catch (err) {
      console.error('Failed to update admin profile', err)
    } finally {
      setIsSavingAdminProfile(false)
    }
  }

  // Inactivity tracking (2 hours / 7200 seconds of zero interaction)
  const INACTIVITY_LIMIT_SECONDS = 7200 // 2 hours
  const [inactivityModalOpen, setInactivityModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const lastActiveTimestampRef = useRef<number>(Date.now())
  const lastHeartbeatTimestampRef = useRef<number>(Date.now())

  // Seamless Session Keep-Alive while user is actively using the dashboard
  useEffect(() => {
    // Record user activity and refresh session automatically
    const recordActivity = () => {
      lastActiveTimestampRef.current = Date.now()
      // Send heartbeat to renew session every 2 minutes while active
      if (Date.now() - lastHeartbeatTimestampRef.current > 2 * 60 * 1000) {
        lastHeartbeatTimestampRef.current = Date.now()
        fetch('/api/admin/session', { method: 'POST' }).catch(() => {})
      }
    }

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    activityEvents.forEach((ev) => window.addEventListener(ev, recordActivity, { passive: true }))

    // Initial session touch on mount
    fetch('/api/admin/session', { method: 'POST' }).catch(() => {})

    // Check every minute: if active within the last 30 minutes, keep session alive
    const interval = setInterval(() => {
      const elapsedMs = Date.now() - lastActiveTimestampRef.current
      if (elapsedMs < 30 * 60 * 1000) {
        // User was recently active: keep session renewed
        if (Date.now() - lastHeartbeatTimestampRef.current > 2 * 60 * 1000) {
          lastHeartbeatTimestampRef.current = Date.now()
          fetch('/api/admin/session', { method: 'POST' }).catch(() => {})
        }
      } else if (elapsedMs >= INACTIVITY_LIMIT_SECONDS * 1000) {
        // True continuous 2-hour absence without any interaction
        clearInterval(interval)
        setInactivityModalOpen(true)
        fetch('/api/admin/logout', { method: 'POST' }).finally(() => {
          setTimeout(() => {
            window.location.href = '/admin/login?reason=inactivity'
          }, 2500)
        })
      }
    }, 60 * 1000)

    return () => {
      activityEvents.forEach((ev) => window.removeEventListener(ev, recordActivity))
      clearInterval(interval)
    }
  }, [])

  const handleAdminLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch (e) {
      // ignore
    }
    window.location.href = '/admin/login'
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Helper formatting
  const formatNaira = (minor: number) => {
    const val = Math.round(minor / 100)
    return `₦${val.toLocaleString('en-NG')}`
  }

  // Refresh data from API
  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/admin')
      const json = await res.json()
      if (json.success && json.data) {
        if (json.data.adminProfile) {
          setAdminProfile(json.data.adminProfile)
        }
        setMetrics(json.data.metrics)
        setUsers(json.data.users)
        setServiceRequests(json.data.serviceRequests)
        setBookings(json.data.bookings)
        setVerificationCases(json.data.verificationCases)
        setDisputes(json.data.disputes)
        if (json.data.emailDispatches) {
          setEmailDispatches(json.data.emailDispatches)
        }
      }
    } catch (e) {
      console.error('Refresh error', e)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Action handlers
  const handleToggleUserStatus = async (user: UserItem) => {
    const nextStatus = user.accountStatus === 'active' ? 'suspended' : 'active'
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, accountStatus: nextStatus } : u))
    )
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...selectedUser, accountStatus: nextStatus })
    }
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'toggle_user_status',
        payload: { userId: user.id, newStatus: nextStatus },
      }),
    })
  }

  const handleApproveCase = async (id: string) => {
    setVerificationCases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'approved' } : c))
    )
    setMetrics((m) => ({
      ...m,
      pendingVerificationsCount: Math.max(0, m.pendingVerificationsCount - 1),
    }))
    setSelectedCase(null)
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_verification',
        payload: { caseId: id, status: 'approved' },
      }),
    })
  }

  const handleRejectCase = async (id: string) => {
    if (!rejectionReason.trim()) return
    setVerificationCases((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: 'rejected', rejectionReason } : c
      )
    )
    setMetrics((m) => ({
      ...m,
      pendingVerificationsCount: Math.max(0, m.pendingVerificationsCount - 1),
    }))
    setSelectedCase(null)
    setRejectionReason('')
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_verification',
        payload: { caseId: id, status: 'rejected', rejectionReason },
      }),
    })
  }

  const handleEscrowAction = async () => {
    if (!actionBooking) return
    const { booking, type } = actionBooking

    if (type === 'release') {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? { ...b, escrowStatus: 'released', bookingStatus: 'completed', progressPercentage: 100 }
            : b
        )
      )
      setMetrics((m) => ({
        ...m,
        totalEscrowLockedMinor: Math.max(0, m.totalEscrowLockedMinor - booking.totalAmountMinor),
        totalEscrowReleasedMinor: m.totalEscrowReleasedMinor + booking.totalAmountMinor,
        activeContracts: Math.max(0, m.activeContracts - 1),
        completedContracts: m.completedContracts + 1,
      }))
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'force_escrow_release',
          payload: { bookingId: booking.id },
        }),
      })
    } else {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id
            ? { ...b, escrowStatus: 'released', bookingStatus: 'disputed' }
            : b
        )
      )
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'refund_escrow',
          payload: { bookingId: booking.id },
        }),
      })
    }
    setActionBooking(null)
  }

  const handleResolveDispute = async () => {
    if (!selectedDispute || !disputeResolutionText.trim()) return
    const id = selectedDispute.id
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'resolved' } : d))
    )
    setMetrics((m) => ({
      ...m,
      openDisputesCount: Math.max(0, m.openDisputesCount - 1),
    }))
    setSelectedDispute(null)
    setDisputeResolutionText('')
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'resolve_dispute',
        payload: { disputeId: id, resolution: disputeResolutionText },
      }),
    })
  }

  // Filtered queries
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter
      const q = userSearch.toLowerCase().trim()
      const matchesSearch =
        !q ||
        u.fullName.toLowerCase().includes(q) ||
        u.businessName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.trade.toLowerCase().includes(q)
      return matchesRole && matchesSearch
    })
  }, [users, userRoleFilter, userSearch])

  const filteredJobs = useMemo(() => {
    return serviceRequests.filter((j) => {
      const matchesTrade = jobTradeFilter === 'all' || j.categorySlug === jobTradeFilter
      const q = jobSearch.toLowerCase().trim()
      const matchesSearch =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.customerName.toLowerCase().includes(q) ||
        j.city.toLowerCase().includes(q)
      return matchesTrade && matchesSearch
    })
  }, [serviceRequests, jobTradeFilter, jobSearch])

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (bookingFilter === 'all') return true
      return b.escrowStatus === bookingFilter
    })
  }, [bookings, bookingFilter])

  return (
    <div className="min-h-screen bg-[#F5F7FC] text-[#0A1020] flex flex-col font-sans selection:bg-[#10B981]/20">
      {/* Unified Professional Floating Header - Exact Match to Landing Page Design */}
      <div className="sticky top-0 left-0 right-0 z-50 pt-2 sm:pt-4 px-2.5 sm:px-6">
        <header className="max-w-7xl mx-auto flex items-center justify-between gap-4 transition-all duration-300 rounded-full px-4 sm:px-6 py-2.5 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xs">
          {/* Left: Brand Logo Only */}
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#0C513F] flex items-center justify-center p-1.5 shadow-2xs transition-transform group-hover:scale-105 shrink-0">
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
            <span className="font-semibold text-base sm:text-lg tracking-tight text-slate-900 flex items-center">
              Connecta
            </span>
          </Link>

          {/* Right: Profile Trigger & Dropdown Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Active Session Status Badge */}
            <div
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-800 select-none"
              title="Administrator session is active"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">Live Admin</span>
            </div>

            {/* Mobile menu toggle for sidebar tabs */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Navigation Tabs"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 sm:gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200/80 transition-all cursor-pointer group"
                aria-expanded={profileMenuOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 rounded-full bg-[#0C513F] text-white flex items-center justify-center text-xs font-bold shadow-xs overflow-hidden relative">
                  {currentAdmin.avatarUrl ? (
                    <Image
                      src={currentAdmin.avatarUrl}
                      alt={currentAdmin.fullName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    getInitials(currentAdmin.fullName)
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {currentAdmin.fullName.split(' ')[0] || 'Admin'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                    profileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentAdmin.fullName}</p>
                    <p className="text-[11px] font-medium text-slate-500 truncate">{currentAdmin.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {currentAdmin.role === 'admin' ? 'Super Administrator' : currentAdmin.role}
                    </span>
                  </div>

                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Session</span>
                    </span>
                    <span className="font-semibold text-emerald-700">
                      Active
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleOpenProfileModal}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        setActiveTab('settings')
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Setting</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        setShowLogoutModal(true)
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* Main Admin Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 relative">
        {/* Layer 1: Connecta Signature Halftone Dot Matrix Pattern with subtle opacity */}
        <div
          className="fixed inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#0A2614 2px, transparent 2px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Navigation Sidebar */}
        <aside
          className={`${
            mobileMenuOpen ? 'block' : 'hidden'
          } lg:block w-full lg:w-64 shrink-0 space-y-2 relative z-20`}
        >
          <div className="bg-white rounded-3xl p-3 border border-slate-200/90 shadow-none space-y-1">
            <button
              type="button"
              onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#0A1020] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                <span>Command Overview</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('users'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#0A1020] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#4D78FF]" />
                <span>Users &amp; Artisans</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-slate-100 text-slate-700">
                {users.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('jobs'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'jobs'
                  ? 'bg-[#0A1020] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-[#F59E0B]" />
                <span>Service Requests</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-slate-100 text-slate-700">
                {serviceRequests.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('contracts'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'contracts'
                  ? 'bg-[#0A1020] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Escrow Contracts</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-emerald-100 text-emerald-800">
                {bookings.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('verifications'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'verifications'
                  ? 'bg-[#0A1020] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verifications Queue</span>
              </div>
              {metrics.pendingVerificationsCount > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-rose-500 text-white animate-pulse">
                  {metrics.pendingVerificationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('payments'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-[#0A1020] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-indigo-500" />
                <span>Financial Ledger</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('disputes'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'disputes'
                  ? 'bg-[#0A1020] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Dispute Resolution</span>
              </div>
              {metrics.openDisputesCount > 0 && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-amber-500 text-white">
                  {metrics.openDisputesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('email'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'email'
                  ? 'bg-[#0A1020] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className={`w-4 h-4 ${activeTab === 'email' ? 'text-[#10B981]' : 'text-emerald-500'}`} />
                <span>Send Email</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-emerald-100 text-emerald-800">
                Hub
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#0A1020] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4 text-slate-500" />
                <span>Platform Settings</span>
              </div>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 space-y-6 relative z-20">
          {/* ================================================================= */}
          {/* TAB: OVERVIEW */}
          {/* ================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full border border-[#0A1020] bg-white flex items-center justify-center font-bold text-xs text-[#0A1020]">
                      ↓
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                      Operations Dashboard
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0A1020] tracking-tight">
                    Connecta Admin Command Center
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Monitoring local services discoverability, verification queues, and milestone escrow security in Kano.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('verifications')}
                    className="px-4 py-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verifications ({metrics.pendingVerificationsCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contracts')}
                    className="px-4 py-2 rounded-full bg-[#0A1020] hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Escrow Vault</span>
                  </button>
                </div>
              </div>

              {/* 4 Primary Hero KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Total Users */}
                <div className="bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-3xl p-6 text-white shadow-none relative overflow-hidden group">
                  <div className="relative z-10 space-y-2">
                    <p className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider whitespace-nowrap">
                      Total Platform Users
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {metrics.totalUsers}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-blue-100 pt-1">
                      <span>{metrics.totalProviders} Artisans</span>
                      <span>•</span>
                      <span>{metrics.totalCustomers} Clients</span>
                    </div>
                  </div>
                  <Users className="w-20 h-20 text-white/10 absolute -bottom-2 -right-2 pointer-events-none group-hover:scale-110 transition-transform" />
                </div>

                {/* Service Requests */}
                <div className="bg-gradient-to-br from-[#B45309] to-[#F59E0B] rounded-3xl p-6 text-white shadow-none relative overflow-hidden group">
                  <div className="relative z-10 space-y-2">
                    <p className="text-[11px] font-semibold text-amber-100 uppercase tracking-wider whitespace-nowrap">
                      Service Requests
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {metrics.totalJobs}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-amber-100 pt-1">
                      <span className="font-bold text-white">{metrics.activeJobs} Active</span>
                      <span>in Kano &amp; Nigeria</span>
                    </div>
                  </div>
                  <Briefcase className="w-20 h-20 text-white/10 absolute -bottom-2 -right-2 pointer-events-none group-hover:scale-110 transition-transform" />
                </div>

                {/* Escrow Locked */}
                <div className="bg-gradient-to-br from-[#0C513F] to-[#10B981] rounded-3xl p-6 text-white shadow-none relative overflow-hidden group">
                  <div className="relative z-10 space-y-2">
                    <p className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider whitespace-nowrap">
                      Locked in Escrow Vault
                    </p>
                    <p className="text-xl sm:text-2xl font-bold tracking-tight">
                      {formatNaira(metrics.totalEscrowLockedMinor)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-emerald-100 pt-1">
                      <span>{metrics.activeContracts} Contracts Underway</span>
                    </div>
                  </div>
                  <ShieldCheck className="w-20 h-20 text-white/10 absolute -bottom-2 -right-2 pointer-events-none group-hover:scale-110 transition-transform" />
                </div>

                {/* Platform Revenue (5% Fee) */}
                <div className="bg-gradient-to-br from-[#0A1020] to-[#1E293B] rounded-3xl p-6 text-white shadow-none relative overflow-hidden group">
                  <div className="relative z-10 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider whitespace-nowrap">
                      Connecta Revenue (5%)
                    </p>
                    <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#10B981]">
                      {formatNaira(metrics.totalPlatformFeeRevenueMinor)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-300 pt-1">
                      <span>{formatNaira(metrics.totalEscrowReleasedMinor)} released</span>
                    </div>
                  </div>
                  <DollarSign className="w-20 h-20 text-white/10 absolute -bottom-2 -right-2 pointer-events-none group-hover:scale-110 transition-transform" />
                </div>
              </div>

              {/* 2-Column Overview Tables: Recent Jobs & Pending Verifications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Verification Alerts */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-none space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        Verification Requests
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('verifications')}
                      className="text-xs font-bold text-[#0C513F] hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {verificationCases.slice(0, 3).map((v) => (
                      <div
                        key={v.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <p className="font-semibold text-xs text-slate-900 truncate">
                            {v.providerName}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {v.trade} • {v.city}
                          </p>
                          <span className="text-[10px] font-bold text-slate-400">
                            {v.documentType}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelectedCase(v)}
                            className="px-3 py-1.5 rounded-full bg-[#0A1020] text-white text-[11px] font-bold hover:bg-[#10B981] transition-colors cursor-pointer"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Service Requests in Kano */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-none space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-amber-600" />
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                        Recent Local Service Requests
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('jobs')}
                      className="text-xs font-bold text-[#0C513F] hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {serviceRequests.slice(0, 3).map((j) => (
                      <div
                        key={j.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap bg-emerald-100 text-emerald-800 uppercase">
                              {j.category}
                            </span>
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                              {j.urgency}
                            </span>
                          </div>
                          <p className="font-bold text-xs text-slate-900 truncate">
                            {j.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Budget: <strong className="text-slate-800">{formatNaira(j.budgetMinMinor)} - {formatNaira(j.budgetMaxMinor)}</strong> • {j.city}
                          </p>
                        </div>

                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap bg-white border border-slate-200 text-slate-700 shrink-0">
                          {j.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: USERS & ARTISANS */}
          {/* ================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Users &amp; Service Providers
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Manage registered clients, verified trade artisans, and platform administrators.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      userRoleFilter === 'all'
                        ? 'bg-[#0A1020] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    All ({users.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('provider')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      userRoleFilter === 'provider'
                        ? 'bg-[#0A1020] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    Artisans ({users.filter((u) => u.role === 'provider').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('customer')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      userRoleFilter === 'customer'
                        ? 'bg-[#0A1020] text-white shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    Clients ({users.filter((u) => u.role === 'customer').length})
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="p-2 rounded-2xl bg-white border border-slate-200/90 shadow-none flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 ml-2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name, trade (e.g. Plumber, Electrician), email, or city..."
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none"
                />
                {userSearch && (
                  <button
                    type="button"
                    onClick={() => setUserSearch('')}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-none overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold text-[11px] whitespace-nowrap">
                      <tr>
                        <th className="py-3.5 px-5 whitespace-nowrap">Name &amp; Business</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Role / Trade</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">City</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Verification</th>
                        <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                        <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="font-semibold text-slate-900 text-xs">
                              {u.fullName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {u.email} • {u.phone}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-800 capitalize text-xs">
                              {u.role === 'provider' ? u.trade : 'Client'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1 text-slate-600">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{u.city}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                u.verificationStatus === 'verified'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {u.verificationStatus === 'verified' && (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              )}
                              <span>{u.verificationStatus.toUpperCase()}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                u.accountStatus === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {u.accountStatus.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setPreselectedEmailUser(u)
                                  setActiveTab('email')
                                }}
                                className="px-2.5 py-1 rounded-full border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1"
                                title={`Send email to ${u.fullName}`}
                              >
                                <Mail className="w-3 h-3 text-emerald-600" />
                                <span>Email</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedUser(u)}
                                className="px-3 py-1 rounded-full border border-slate-200 hover:border-slate-800 text-slate-700 text-[11px] font-medium transition-all cursor-pointer"
                              >
                                Details
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleUserStatus(u)}
                                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                                  u.accountStatus === 'active'
                                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                {u.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: JOBS / SERVICE REQUESTS */}
          {/* ================================================================= */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Service Requests &amp; Jobs
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Live homeowner and business job requests across Kano and Nigerian metropolitan areas.
                  </p>
                </div>

                {/* Trade Filter */}
                <select
                  value={jobTradeFilter}
                  onChange={(e) => setJobTradeFilter(e.target.value)}
                  className="px-3.5 py-2 rounded-full border border-slate-200 bg-white font-bold text-xs text-slate-700 cursor-pointer"
                >
                  <option value="all">All Local Trades</option>
                  <option value="plumbing">Plumbing &amp; Water Systems</option>
                  <option value="electrical">Electrical &amp; Solar</option>
                  <option value="ac-cooling">AC &amp; Refrigeration</option>
                  <option value="carpentry">Carpentry &amp; Woodwork</option>
                </select>
              </div>

              {/* Job Search */}
              <div className="p-2 rounded-2xl bg-white border border-slate-200/90 shadow-none flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 ml-2" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Search job title, customer, or location..."
                  className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none"
                />
              </div>

              {/* Jobs List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map((j) => (
                  <div
                    key={j.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-none space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap bg-[#10B981]/10 text-[#0C513F] uppercase tracking-wider">
                          {j.category}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                          {j.urgency}
                        </span>
                      </div>

                      <h3 className="font-semibold text-sm text-slate-900 leading-snug">
                        {j.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {j.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {j.requiredSkills.map((sk, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          Budget Escrow
                        </div>
                        <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                          {formatNaira(j.budgetMinMinor)} - {formatNaira(j.budgetMaxMinor)}
                        </div>
                      </div>

                      <span className="text-[10px] font-semibold px-3 py-1 rounded-full whitespace-nowrap bg-slate-100 text-slate-700">
                        {j.proposalsCount} Proposals
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: CONTRACTS & ESCROW VAULT */}
          {/* ================================================================= */}
          {activeTab === 'contracts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Active Contracts &amp; Escrow Vault
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Manage locked funds, monitor milestone fulfillment, and administer escrow releases or client refunds.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingFilter('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      bookingFilter === 'all'
                        ? 'bg-[#0A1020] text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    All ({bookings.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingFilter('locked')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      bookingFilter === 'locked'
                        ? 'bg-[#0A1020] text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    Escrow Locked ({bookings.filter((b) => b.escrowStatus === 'locked').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingFilter('released')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      bookingFilter === 'released'
                        ? 'bg-[#0A1020] text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    Released ({bookings.filter((b) => b.escrowStatus === 'released').length})
                  </button>
                </div>
              </div>

              {/* Contracts List */}
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-none space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                            {b.bookingNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase whitespace-nowrap ${
                              b.escrowStatus === 'locked'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            Escrow: {b.escrowStatus}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          {b.title}
                        </h3>
                      </div>

                      <div className="text-left sm:text-right">
                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                          Contract Value
                        </div>
                        <div className="text-base sm:text-lg font-bold text-[#0C513F]">
                          {formatNaira(b.totalAmountMinor)}
                        </div>
                      </div>
                    </div>

                    {/* Parties involved */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                        <span className="text-[10px] font-semibold uppercase text-slate-500 whitespace-nowrap block mb-0.5">
                          Client / Homeowner
                        </span>
                        <strong className="text-slate-900 font-bold block">{b.clientName}</strong>
                        <span className="text-slate-500 text-[11px]">{b.clientCompany || 'Residential'} • {b.location}</span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
                        <span className="text-[10px] font-semibold uppercase text-slate-500 whitespace-nowrap block mb-0.5">
                          Assigned Artisan
                        </span>
                        <strong className="text-slate-900 font-bold block">{b.providerName}</strong>
                        <span className="text-slate-500 text-[11px]">{b.providerTitle}</span>
                      </div>
                    </div>

                    {/* Milestones list */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Milestones Progress</span>
                        <span>{b.progressPercentage}% Completed</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#10B981] to-[#0C513F] transition-all"
                          style={{ width: `${b.progressPercentage}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        {b.milestones.map((m) => (
                          <div
                            key={m.id}
                            className={`p-2 rounded-xl text-[11px] font-medium border ${
                              m.status === 'completed'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                                : m.status === 'current'
                                ? 'bg-amber-50 border-amber-200 text-amber-900 font-bold'
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                          >
                            <div className="truncate">{m.title}</div>
                            <div className="font-bold text-[10px] mt-0.5">{formatNaira(m.amountMinor)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    {b.escrowStatus === 'locked' && (
                      <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setActionBooking({ booking: b, type: 'refund' })}
                          className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Refund to Client
                        </button>
                        <button
                          type="button"
                          onClick={() => setActionBooking({ booking: b, type: 'release' })}
                          className="px-5 py-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                        >
                          Release Escrow to Artisan
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: VERIFICATIONS QUEUE */}
          {/* ================================================================= */}
          {activeTab === 'verifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Artisan Verification Queue
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Inspect submitted National Identification Numbers (NIN), CAC certificates, and Trade Guild licenses.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-none divide-y divide-slate-100 overflow-hidden">
                {verificationCases.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <h4 className="font-bold text-sm text-slate-900">
                          {c.providerName}
                        </h4>
                        <span
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap uppercase ${
                            c.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">
                        <strong>{c.businessName}</strong> • {c.trade} • {c.city}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">{c.documentType}</span>
                        <span>•</span>
                        <span>ID: {c.documentNumber}</span>
                        <span>•</span>
                        <span>{c.yearsOfExperience}+ Years Experience</span>
                      </div>

                      {c.rejectionReason && (
                        <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg mt-1 font-semibold">
                          Reason: {c.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {c.status === 'under_review' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setSelectedCase(c)}
                            className="px-4 py-2 rounded-full border border-slate-200 hover:border-slate-800 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                          >
                            Inspect &amp; Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveCase(c.id)}
                            className="px-4 py-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">
                          Processed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: FINANCIAL LEDGER */}
          {/* ================================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Financial Ledger &amp; Platform Fees
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  100% Milestone Escrow Accounting in Nigerian Naira (NGN).
                </p>
              </div>

              {/* Financial KPI stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-none">
                  <span className="text-[11px] font-semibold uppercase text-slate-500 whitespace-nowrap">
                    Active Locked Escrow
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-[#0C513F] mt-1">
                    {formatNaira(metrics.totalEscrowLockedMinor)}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Safeguarded in Custody
                  </span>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-none">
                  <span className="text-[11px] font-semibold uppercase text-slate-500 whitespace-nowrap">
                    Total Released to Artisans
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-[#10B981] mt-1">
                    {formatNaira(metrics.totalEscrowReleasedMinor)}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Successful Milestone Payouts
                  </span>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-none">
                  <span className="text-[11px] font-semibold uppercase text-slate-500 whitespace-nowrap">
                    Platform Revenue (5%)
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-[#4D78FF] mt-1">
                    {formatNaira(metrics.totalPlatformFeeRevenueMinor)}
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Connecta Operations Fee
                  </span>
                </div>
              </div>

              {/* Ledger Summary */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-none space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">
                  Recent Milestone Transactions
                </h3>
                <div className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <div key={b.id} className="py-3.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{b.title}</div>
                        <div className="text-slate-400 text-[11px]">
                          {b.bookingNumber} • Client: {b.clientName} → Provider: {b.providerName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900">{formatNaira(b.totalAmountMinor)}</div>
                        <div className="text-[10px] text-emerald-600 font-bold uppercase">
                          Fee: {formatNaira(Math.round(b.totalAmountMinor * 0.05))} (5%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: DISPUTES */}
          {/* ================================================================= */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Dispute &amp; Mediation Center
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Connecta Trust Desk claims resolution for job quality, scheduling, and payment disagreements.
                </p>
              </div>

              <div className="space-y-4">
                {disputes.map((d) => (
                  <div
                    key={d.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-none space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-slate-500">{d.disputeNumber}</span>
                        <h4 className="font-semibold text-sm text-slate-900 mt-0.5">{d.bookingTitle}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap uppercase ${
                          d.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1.5">
                      <p className="text-slate-700">
                        <strong>Claimant:</strong> {d.claimantName} vs <strong>Respondent:</strong> {d.respondentName}
                      </p>
                      <p className="text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-200/70">
                        {d.reason}
                      </p>
                      <p className="text-[11px] text-slate-500 italic">
                        Desk Notes: {d.notes}
                      </p>
                    </div>

                    {d.status !== 'resolved' && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedDispute(d)}
                          className="px-4 py-2 rounded-full bg-[#0A1020] hover:bg-[#10B981] text-white text-xs font-semibold transition-all cursor-pointer"
                        >
                          Resolve Dispute
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: SETTINGS */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-none space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Platform Parameters
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Global marketplace configuration for Kano and Pan-African expansion.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Primary Hub City</label>
                  <input
                    type="text"
                    defaultValue="Kano, Nigeria"
                    disabled
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
                  />
                  <p className="text-[11px] text-slate-400">Initial strategic target market.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Platform Escrow Commission</label>
                  <input
                    type="text"
                    defaultValue="5.0% of Completed Contract Value"
                    disabled
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
                  />
                  <p className="text-[11px] text-slate-400">Automatically deducted upon milestone release.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Supported Currencies</label>
                  <input
                    type="text"
                    defaultValue="NGN (₦ Nigerian Naira)"
                    disabled
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Connecta Trust Desk Hotline</label>
                  <input
                    type="text"
                    defaultValue="+234 812 345 6789"
                    disabled
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 font-bold text-slate-700"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: EMAIL DISPATCH & BROADCAST HUB                              */}
          {/* ================================================================= */}
          {activeTab === 'email' && (
            <AdminEmailHub
              users={users}
              initialDispatches={emailDispatches}
              preselectedUser={preselectedEmailUser}
              onClearPreselectedUser={() => setPreselectedEmailUser(null)}
            />
          )}
        </main>
      </div>

      {/* ===================================================================== */}
      {/* MODAL: USER DETAILS */}
      {/* ===================================================================== */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-5 border border-slate-200/90 shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap text-slate-400">
                  User Details
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{selectedUser.fullName}</h3>
                <p className="text-xs text-slate-500">{selectedUser.businessName}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Role</span>
                <strong className="text-slate-900 capitalize">{selectedUser.role}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Trade</span>
                <strong className="text-slate-900">{selectedUser.trade}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">City</span>
                <strong className="text-slate-900">{selectedUser.city}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone</span>
                <strong className="text-slate-900">{selectedUser.phone}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Rating</span>
                <strong className="text-slate-900">★ {selectedUser.averageRating.toFixed(2)}</strong>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Jobs Done</span>
                <strong className="text-slate-900">{selectedUser.completedJobs} completed</strong>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  const target = selectedUser
                  setSelectedUser(null)
                  setPreselectedEmailUser(target)
                  setActiveTab('email')
                }}
                className="flex-1 py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleUserStatus(selectedUser)}
                className={`flex-1 py-3 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedUser.accountStatus === 'active'
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                }`}
              >
                {selectedUser.accountStatus === 'active' ? 'Suspend' : 'Activate'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-3 rounded-full bg-[#0A1020] hover:bg-slate-800 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: VERIFICATION INSPECT & REJECT */}
      {/* ===================================================================== */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 space-y-4 border border-slate-200/90 shadow-lg">
            <div className="flex items-start justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap text-rose-500">
                  Verification Rejection
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{selectedCase.providerName}</h3>
                <p className="text-xs text-slate-500">{selectedCase.documentType}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Reason for Rejection</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Blurred document photograph, NIN name mismatch, or expired trade license..."
                className="w-full p-3 rounded-2xl border border-slate-200 font-medium text-slate-800 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRejectCase(selectedCase.id)}
                disabled={!rejectionReason.trim()}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ESCROW ACTION CONFIRMATION */}
      {/* ===================================================================== */}
      {actionBooking && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center space-y-4 border border-slate-200/90 shadow-lg">
            <div
              className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                actionBooking.type === 'release'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-rose-100 text-rose-600'
              }`}
            >
              {actionBooking.type === 'release' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {actionBooking.type === 'release' ? 'Release Escrow Vault' : 'Refund Escrow to Client'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Confirm {actionBooking.type === 'release' ? 'payout of' : 'refund of'}{' '}
                <strong>{formatNaira(actionBooking.booking.totalAmountMinor)}</strong> for contract{' '}
                <strong>{actionBooking.booking.bookingNumber}</strong>?
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActionBooking(null)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEscrowAction}
                className={`flex-1 py-2.5 rounded-full text-white text-xs font-semibold transition-all cursor-pointer ${
                  actionBooking.type === 'release'
                    ? 'bg-[#10B981] hover:bg-[#059669]'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: DISPUTE RESOLUTION */}
      {/* ===================================================================== */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-7 space-y-4 border border-slate-200/90 shadow-lg">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap text-amber-600">
                Resolution Terms
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Resolve {selectedDispute.disputeNumber}
              </h3>
              <p className="text-xs text-slate-500">{selectedDispute.bookingTitle}</p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Resolution Summary</label>
              <textarea
                rows={3}
                value={disputeResolutionText}
                onChange={(e) => setDisputeResolutionText(e.target.value)}
                placeholder="Enter agreed settlement terms (e.g. 50% refund, or re-performance within 48 hours)..."
                className="w-full p-3 rounded-2xl border border-slate-200 font-medium text-slate-800 focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveDispute}
                disabled={!disputeResolutionText.trim()}
                className="flex-1 py-2.5 rounded-full bg-[#10B981] hover:bg-[#059669] disabled:opacity-40 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADMIN PROFILE (REAL SERVER DATABASE DATA)                      */}
      {/* ===================================================================== */}
      {showAdminProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 border border-slate-200/90 shadow-lg relative animate-in fade-in zoom-in-95 duration-150 my-8">
            <button
              type="button"
              onClick={() => {
                setShowAdminProfileModal(false)
                setIsEditingAdminProfile(false)
              }}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {adminProfileSuccessNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{adminProfileSuccessNotice}</span>
              </div>
            )}

            {!isEditingAdminProfile ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#0C513F] text-white flex items-center justify-center text-xl font-bold ring-4 ring-emerald-500/20 shadow-none overflow-hidden relative shrink-0">
                    {currentAdmin.avatarUrl ? (
                      <Image
                        src={currentAdmin.avatarUrl}
                        alt={currentAdmin.fullName}
                        fill
                        className="object-cover p-1"
                      />
                    ) : (
                      getInitials(currentAdmin.fullName)
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">{currentAdmin.fullName}</h3>
                      <BadgeCheck className="w-5 h-5 text-[#10B981]" />
                    </div>
                    <p className="text-xs font-semibold text-emerald-700">
                      {currentAdmin.headline || 'Lead Platform Administrator & Escrow Supervisor'}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{currentAdmin.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-500 block">Operations Hub</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {currentAdmin.city}, {currentAdmin.country}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Official Phone</span>
                    <span className="font-bold text-slate-900 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      {currentAdmin.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Security Clearance</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Level 4 Root Authority
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Organization</span>
                    <span className="font-bold text-slate-900 mt-0.5 block truncate">
                      {currentAdmin.companyName || 'Connecta Kano Administration'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sparks Balance</span>
                    <span className="font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {currentAdmin.wallet?.sparksBalance ?? currentAdmin.welcomeSparks ?? 500} Sparks
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Account Status</span>
                    <span className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1 capitalize">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {currentAdmin.accountStatus || 'active'}
                    </span>
                  </div>
                </div>

                {currentAdmin.bio && (
                  <div className="space-y-1">
                    <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Bio & Administrative Scope</h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                      {currentAdmin.bio}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Platform Responsibilities</h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {(currentAdmin.skills && currentAdmin.skills.length > 0
                      ? currentAdmin.skills
                      : ['Platform Administration', 'Escrow Oversight', 'Dispute Resolution']
                    ).map((skill, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditAdminForm({
                        fullName: currentAdmin.fullName,
                        phone: currentAdmin.phone,
                        whatsapp: currentAdmin.whatsapp || currentAdmin.phone,
                        headline: currentAdmin.headline || '',
                        bio: currentAdmin.bio || '',
                        city: currentAdmin.city,
                        country: currentAdmin.country,
                      })
                      setIsEditingAdminProfile(true)
                    }}
                    className="flex-1 py-2.5 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminProfileModal(false)}
                    className="flex-1 py-2.5 rounded-full bg-[#0A1020] hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveAdminProfile} className="space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900">Edit Administrator Profile</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Update administrator details in the server database</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editAdminForm.fullName}
                      onChange={(e) => setEditAdminForm({ ...editAdminForm, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Headline / Title</label>
                    <input
                      type="text"
                      value={editAdminForm.headline}
                      onChange={(e) => setEditAdminForm({ ...editAdminForm, headline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={editAdminForm.phone}
                        onChange={(e) => setEditAdminForm({ ...editAdminForm, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={editAdminForm.whatsapp}
                        onChange={(e) => setEditAdminForm({ ...editAdminForm, whatsapp: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">City</label>
                      <input
                        type="text"
                        value={editAdminForm.city}
                        onChange={(e) => setEditAdminForm({ ...editAdminForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Country</label>
                      <input
                        type="text"
                        value={editAdminForm.country}
                        onChange={(e) => setEditAdminForm({ ...editAdminForm, country: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Bio / Administrative Overview</label>
                    <textarea
                      rows={3}
                      value={editAdminForm.bio}
                      onChange={(e) => setEditAdminForm({ ...editAdminForm, bio: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditingAdminProfile(false)}
                    className="flex-1 py-2.5 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAdminProfile}
                    className="flex-1 py-2.5 rounded-full bg-[#0C513F] hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingAdminProfile ? 'Saving...' : 'Save to Database'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: SIGN OUT */}
      {/* ===================================================================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 text-center space-y-4 border border-slate-200/90 shadow-lg animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Sign Out of Admin Portal</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to exit the Connecta Admin Command Center? Your encrypted session token will be cleared.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdminLogout}
                disabled={isLoggingOut}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isLoggingOut ? (
                  <Spinner className="w-4 h-4 text-white" />
                ) : (
                  <span>Sign Out</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: INACTIVITY AUTO-LOCK (2 HOURS) */}
      {/* ===================================================================== */}
      {inactivityModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0A1020] border border-amber-500/40 rounded-3xl w-full max-w-md p-6 sm:p-8 text-center space-y-4 shadow-lg text-white">
            <div className="w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                Security Auto-Lock
              </span>
              <h3 className="text-xl font-black text-white">Session Timed Out</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                You have been inactive for <span className="text-white font-bold">2 hours</span>. For the safety of user escrows and platform administration, your session has been securely locked.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin/login?reason=inactivity"
                className="w-full py-3 px-4 rounded-full bg-[#0C513F] hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>Re-Authenticate to Resume</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
