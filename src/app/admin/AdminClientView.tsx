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
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  ChevronRight,
  Eye,
  Check,
  X,
  Menu,
  Sparkles,
  RefreshCw,
  LogOut,
  Building2,
  DollarSign,
  TrendingUp,
  Mail,
  ChevronDown,
  User,
  BadgeCheck,
  Phone,
  Edit3,
  Save,
  Bell,
  KeyRound,
  Coins,
  Split,
  Send,
  FolderKanban,
  LayoutGrid,
  ArrowRight,
  ArrowUpRight,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react'
import AdminEmailHub, { EmailDispatchItem } from './AdminEmailHub'
import { BrandStripe, ConnectaMark, Spinner } from '@/components/brand/ConnectaLoader'
import { Avatar, Badge, Notice } from '@/components/dashboard/ui'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface AdminMetrics {
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

export interface UserItem {
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
  isFeatured?: boolean
  badges?: string[]
  ninNumber?: string
  wallet?: {
    balanceMinor: number
    escrowBalanceMinor: number
    sparksBalance: number
    currency: string
  } | null
}

export interface PlatformSettings {
  hubCity: string
  commissionRatePercent: number
  currency: string
  supportPhone: string
  supportEmail: string
  supportWhatsapp: string
  welcomeSparks: number
  systemAnnouncement?: string
  announcementActive?: boolean
}

export interface InAppNotificationItem {
  id: string
  userId: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'alert'
  createdAt: string
}

export interface PendingWithdrawalItem {
  id: string
  userId: string
  userName?: string
  userEmail?: string
  amountMinor: number
  currency: string
  bankName?: string
  accountNumber?: string
  date: string
  reference: string
  status: string
}

export interface ServiceRequestItem {
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
  status: 'open' | 'matching' | 'quoted' | 'booked' | 'closed' | 'cancelled'
  requiredSkills: string[]
  proposalsCount: number
  createdAt: string
}

export interface BookingContractItem {
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

export interface VerificationCaseItem {
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

export interface DisputeItem {
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
  | 'notifications'

type NavGroup = {
  label: string
  items: Array<{
    id: TabType
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string | number | null
    alert?: boolean
  }>
}

const formatNaira = (minor: number) => {
  const val = Math.round(minor / 100)
  return `₦${val.toLocaleString('en-NG')}`
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

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
    platformSettings?: PlatformSettings
    inAppNotifications?: InAppNotificationItem[]
    pendingWithdrawals?: PendingWithdrawalItem[]
  }
}) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Datasets
  const [metrics, setMetrics] = useState<AdminMetrics>(initialData.metrics)
  const [users, setUsers] = useState<UserItem[]>(initialData.users)
  const [serviceRequests, setServiceRequests] = useState<ServiceRequestItem[]>(initialData.serviceRequests)
  const [bookings, setBookings] = useState<BookingContractItem[]>(initialData.bookings)
  const [verificationCases, setVerificationCases] = useState<VerificationCaseItem[]>(initialData.verificationCases)
  const [disputes, setDisputes] = useState<DisputeItem[]>(initialData.disputes)
  const [emailDispatches, setEmailDispatches] = useState<EmailDispatchItem[]>(initialData.emailDispatches || [])
  const [inAppNotifications, setInAppNotifications] = useState<InAppNotificationItem[]>(initialData.inAppNotifications || [])
  const [pendingWithdrawals, setPendingWithdrawals] = useState<PendingWithdrawalItem[]>(initialData.pendingWithdrawals || [])

  // Filters
  const [navSearchQuery, setNavSearchQuery] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'customer' | 'provider'>('all')
  const [jobSearch, setJobSearch] = useState('')
  const [jobTradeFilter, setJobTradeFilter] = useState('all')
  const [bookingFilter, setBookingFilter] = useState<'all' | 'locked' | 'released'>('all')

  // Modals & Drawers state
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
  const [preselectedEmailUser, setPreselectedEmailUser] = useState<UserItem | null>(null)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [showAdminProfileModal, setShowAdminProfileModal] = useState(false)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  // Admin Profile state
  const [adminProfile, setAdminProfile] = useState<AdminProfileData | null>(initialData.adminProfile || null)

  // Platform Settings State
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(
    initialData.platformSettings || {
      hubCity: 'Kano, Nigeria',
      commissionRatePercent: 5.0,
      currency: 'NGN',
      supportPhone: '+234 812 345 6789',
      supportEmail: 'support@myconnecta.ng',
      supportWhatsapp: 'https://wa.me/2348123456789',
      welcomeSparks: 500,
      systemAnnouncement: 'Welcome to Connecta 2.0 — Verified artisans and NDIC-insured escrow custody across Nigeria.',
      announcementActive: true,
    }
  )
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [settingsNotice, setSettingsNotice] = useState<string | null>(null)

  // User Management Modals
  const [editingUser, setEditingUser] = useState<UserItem | null>(null)
  const [userEditForm, setUserEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Kano',
    trade: '',
    ninNumber: '',
    hourlyRateNaira: '15000',
    role: 'provider' as 'customer' | 'provider',
    verificationStatus: 'verified' as 'verified' | 'unverified',
  })
  const [isSavingUser, setIsSavingUser] = useState(false)

  const [adjustingWalletUser, setAdjustingWalletUser] = useState<UserItem | null>(null)
  const [walletAdjustDeltaNaira, setWalletAdjustDeltaNaira] = useState('0')
  const [walletAdjustSparks, setWalletAdjustSparks] = useState('0')
  const [walletAdjustReason, setWalletAdjustReason] = useState('')
  const [isAdjustingWallet, setIsAdjustingWallet] = useState(false)

  const [user360, setUser360] = useState<UserItem | null>(null)
  const [user360Tab, setUser360Tab] = useState<'profile' | 'contracts' | 'jobs' | 'disputes'>('profile')

  const [resettingUser, setResettingUser] = useState<UserItem | null>(null)
  const [newPasswordInput, setNewPasswordInput] = useState('')
  const [isResettingPassword, setIsResettingPassword] = useState(false)

  // Split Dispute Modal
  const [splitDispute, setSplitDispute] = useState<DisputeItem | null>(null)
  const [splitProviderPct, setSplitProviderPct] = useState(70)
  const [splitNotes, setSplitNotes] = useState('')
  const [isSubmittingSplit, setIsSubmittingSplit] = useState(false)

  // Job Moderation Modal
  const [editingJob, setEditingJob] = useState<ServiceRequestItem | null>(null)
  const [jobTitleInput, setJobTitleInput] = useState('')
  const [jobDescriptionInput, setJobDescriptionInput] = useState('')
  const [isSavingJob, setIsSavingJob] = useState(false)

  // Withdrawal Payout Action Modal
  const [actionWithdrawal, setActionWithdrawal] = useState<PendingWithdrawalItem | null>(null)
  const [payoutDecision, setPayoutDecision] = useState<'approve' | 'reject'>('approve')
  const [payoutRefInput, setPayoutRefInput] = useState('')
  const [payoutRejectReason, setPayoutRejectReason] = useState('')
  const [isProcessingPayout, setIsProcessingPayout] = useState(false)

  // In-App Notification Broadcaster Form
  const [newNotifAudience, setNewNotifAudience] = useState<'all' | 'clients' | 'providers' | string>('all')
  const [newNotifTitle, setNewNotifTitle] = useState('')
  const [newNotifMessage, setNewNotifMessage] = useState('')
  const [newNotifType, setNewNotifType] = useState<'info' | 'success' | 'warning' | 'alert'>('info')
  const [isSendingNotification, setIsSendingNotification] = useState(false)
  const [notifNotice, setNotifNotice] = useState<string | null>(null)

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
    avatarUrl: null,
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

  // Inactivity tracking (2 hours / 7200 seconds of zero interaction)
  const INACTIVITY_LIMIT_SECONDS = 7200
  const [inactivityModalOpen, setInactivityModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const lastActiveTimestampRef = useRef<number>(Date.now())
  const lastHeartbeatTimestampRef = useRef<number>(Date.now())

  useEffect(() => {
    const recordActivity = () => {
      lastActiveTimestampRef.current = Date.now()
      if (Date.now() - lastHeartbeatTimestampRef.current > 2 * 60 * 1000) {
        lastHeartbeatTimestampRef.current = Date.now()
        fetch('/api/admin/session', { method: 'POST' }).catch(() => {})
      }
    }

    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']
    activityEvents.forEach((ev) => window.addEventListener(ev, recordActivity, { passive: true }))
    fetch('/api/admin/session', { method: 'POST' }).catch(() => {})

    const interval = setInterval(() => {
      const elapsedMs = Date.now() - lastActiveTimestampRef.current
      if (elapsedMs < 30 * 60 * 1000) {
        if (Date.now() - lastHeartbeatTimestampRef.current > 2 * 60 * 1000) {
          lastHeartbeatTimestampRef.current = Date.now()
          fetch('/api/admin/session', { method: 'POST' }).catch(() => {})
        }
      } else if (elapsedMs >= INACTIVITY_LIMIT_SECONDS * 1000) {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Action handlers
  const handleAdminLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
    } catch {}
    window.location.href = '/admin/login'
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/admin')
      const json = await res.json()
      if (json.success && json.data) {
        if (json.data.adminProfile) setAdminProfile(json.data.adminProfile)
        setMetrics(json.data.metrics)
        setUsers(json.data.users)
        setServiceRequests(json.data.serviceRequests)
        setBookings(json.data.bookings)
        setVerificationCases(json.data.verificationCases)
        setDisputes(json.data.disputes)
        if (json.data.emailDispatches) setEmailDispatches(json.data.emailDispatches)
      }
    } catch (e) {
      console.error('Refresh error', e)
    } finally {
      setIsRefreshing(false)
    }
  }

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

  const handleToggleFeatured = async (user: UserItem) => {
    const nextFeatured = !user.isFeatured
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, isFeatured: nextFeatured } : u))
    )
    if (selectedUser?.id === user.id) {
      setSelectedUser({ ...selectedUser, isFeatured: nextFeatured })
    }
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'toggle_featured_provider',
        payload: { providerId: user.id, isFeatured: nextFeatured },
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

  const handleOpenEditUser = (user: UserItem) => {
    setEditingUser(user)
    setUserEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      city: user.city || 'Kano',
      trade: user.trade || '',
      ninNumber: user.ninNumber || '',
      hourlyRateNaira: user.hourlyRateMinor ? String(Math.round(user.hourlyRateMinor / 100)) : '15000',
      role: user.role === 'customer' ? 'customer' : 'provider',
      verificationStatus: user.verificationStatus || 'unverified',
    })
  }

  const handleSaveUserEdit = async () => {
    if (!editingUser) return
    setIsSavingUser(true)
    try {
      const hourlyRateMinor = Math.round((parseFloat(userEditForm.hourlyRateNaira) || 0) * 100)
      const updates = {
        fullName: userEditForm.fullName.trim(),
        email: userEditForm.email.trim(),
        phone: userEditForm.phone.trim(),
        city: userEditForm.city.trim(),
        trade: userEditForm.trade.trim(),
        ninNumber: userEditForm.ninNumber.trim(),
        hourlyRateMinor,
        role: userEditForm.role,
        verificationStatus: userEditForm.verificationStatus,
      }
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_user_profile',
          payload: { userId: editingUser.id, updates },
        }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...updates } : u))
        )
        setEditingUser(null)
      }
    } catch (err) {
      console.error('Failed to update user profile', err)
    } finally {
      setIsSavingUser(false)
    }
  }

  const handleOpenAdjustWallet = (user: UserItem) => {
    setAdjustingWalletUser(user)
    setWalletAdjustDeltaNaira('0')
    setWalletAdjustSparks('0')
    setWalletAdjustReason('')
  }

  const handleSaveWalletAdjustment = async () => {
    if (!adjustingWalletUser) return
    setIsAdjustingWallet(true)
    try {
      const deltaMinor = Math.round((parseFloat(walletAdjustDeltaNaira) || 0) * 100)
      const sparksDelta = parseInt(walletAdjustSparks, 10) || 0
      const reason = walletAdjustReason.trim() || 'Administrative manual adjustment'

      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'adjust_user_wallet',
          payload: {
            userId: adjustingWalletUser.id,
            balanceDeltaMinor: deltaMinor,
            sparksDelta,
            reason,
          },
        }),
      })
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === adjustingWalletUser.id) {
              const currentWallet = u.wallet || {
                balanceMinor: 0,
                escrowBalanceMinor: 0,
                sparksBalance: 0,
                currency: 'NGN',
              }
              return {
                ...u,
                wallet: {
                  ...currentWallet,
                  balanceMinor: Math.max(0, currentWallet.balanceMinor + deltaMinor),
                  sparksBalance: Math.max(0, currentWallet.sparksBalance + sparksDelta),
                },
              }
            }
            return u
          })
        )
        setAdjustingWalletUser(null)
      }
    } catch (err) {
      console.error('Failed to adjust user wallet', err)
    } finally {
      setIsAdjustingWallet(false)
    }
  }

  const handleOpenResetPassword = (user: UserItem) => {
    setResettingUser(user)
    setNewPasswordInput('')
  }

  const handleSavePasswordReset = async () => {
    if (!resettingUser || !newPasswordInput.trim()) return
    setIsResettingPassword(true)
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_user_password',
          payload: { userId: resettingUser.id, newPassword: newPasswordInput.trim() },
        }),
      })
      setResettingUser(null)
      setNewPasswordInput('')
    } catch (err) {
      console.error('Failed to reset password', err)
    } finally {
      setIsResettingPassword(false)
    }
  }

  const handleOpenUser360 = (user: UserItem) => {
    setUser360(user)
    setUser360Tab('profile')
  }

  const handleOpenJobEdit = (job: ServiceRequestItem) => {
    setEditingJob(job)
    setJobTitleInput(job.title)
    setJobDescriptionInput(job.description)
  }

  const handleModerateJob = async (status: 'open' | 'closed' | 'cancelled') => {
    if (!editingJob) return
    setIsSavingJob(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'moderate_job',
          payload: {
            requestId: editingJob.id,
            status,
            updates: {
              title: jobTitleInput || editingJob.title,
              description: jobDescriptionInput || editingJob.description,
            },
          },
        }),
      })
      if (res.ok) {
        setServiceRequests((prev) =>
          prev.map((j) =>
            j.id === editingJob.id
              ? {
                  ...j,
                  status,
                  title: jobTitleInput || j.title,
                  description: jobDescriptionInput || j.description,
                }
              : j
          )
        )
        setEditingJob(null)
      }
    } catch (err) {
      console.error('Failed to moderate job', err)
    } finally {
      setIsSavingJob(false)
    }
  }

  const handleProcessWithdrawal = async (decision: 'approve' | 'reject') => {
    if (!actionWithdrawal) return
    setIsProcessingPayout(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'process_withdrawal',
          payload: {
            txId: actionWithdrawal.id,
            decision,
            payoutReference: payoutRefInput.trim() || `CBN-${Date.now().toString().slice(-6)}`,
            reason: payoutRejectReason.trim(),
          },
        }),
      })
      if (res.ok) {
        setPendingWithdrawals((prev) => prev.filter((p) => p.id !== actionWithdrawal.id))
        setActionWithdrawal(null)
        setPayoutRefInput('')
        setPayoutRejectReason('')
      }
    } catch (err) {
      console.error('Failed to process payout', err)
    } finally {
      setIsProcessingPayout(false)
    }
  }

  const handleOpenSplitDispute = (dispute: DisputeItem) => {
    setSplitDispute(dispute)
    setSplitProviderPct(70)
    setSplitNotes(`Mediated settlement for ${dispute.disputeNumber}: 70% paid to specialist for procurement and labour, 30% refunded to client.`)
  }

  const handleSubmitSplitDispute = async () => {
    if (!splitDispute) return
    setIsSubmittingSplit(true)
    try {
      const providerPct = splitProviderPct
      const clientPct = 100 - splitProviderPct
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'settle_dispute_split',
          payload: {
            disputeId: splitDispute.id,
            providerPercent: providerPct,
            clientPercent: clientPct,
            resolutionNotes: splitNotes.trim(),
          },
        }),
      })
      if (res.ok) {
        setDisputes((prev) =>
          prev.map((d) =>
            d.id === splitDispute.id
              ? {
                  ...d,
                  status: 'resolved',
                  notes: `${d.notes} [Split Settlement: ${providerPct}% Specialist / ${clientPct}% Client]: ${splitNotes}`,
                }
              : d
          )
        )
        setMetrics((m) => ({
          ...m,
          openDisputesCount: Math.max(0, m.openDisputesCount - 1),
        }))
        setSplitDispute(null)
      }
    } catch (err) {
      console.error('Failed to settle split dispute', err)
    } finally {
      setIsSubmittingSplit(false)
    }
  }

  const handleSavePlatformSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingSettings(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_platform_settings',
          payload: platformSettings,
        }),
      })
      if (res.ok) {
        setSettingsNotice('Live platform parameters saved. All updates are now active on user dashboards.')
        setTimeout(() => setSettingsNotice(null), 5000)
      }
    } catch (err) {
      console.error('Failed to save settings', err)
    } finally {
      setIsSavingSettings(false)
    }
  }

  const handleBroadcastInAppNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNotifTitle.trim() || !newNotifMessage.trim()) return
    setIsSendingNotification(true)
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_in_app_notification',
          payload: {
            userId: newNotifAudience,
            title: newNotifTitle.trim(),
            message: newNotifMessage.trim(),
            type: newNotifType,
          },
        }),
      })
      if (res.ok) {
        const body = await res.json()
        if (body.notification) {
          setInAppNotifications((prev) => [body.notification, ...prev])
        }
        setNotifNotice('In-app alert broadcasted successfully to user dashboards.')
        setNewNotifTitle('')
        setNewNotifMessage('')
        setTimeout(() => setNotifNotice(null), 5000)
      }
    } catch (err) {
      console.error('Failed to broadcast notification', err)
    } finally {
      setIsSendingNotification(false)
    }
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
        setAdminProfileSuccessNotice('Profile saved to database.')
        setIsEditingAdminProfile(false)
        setTimeout(() => setAdminProfileSuccessNotice(null), 3000)
      }
    } catch (err) {
      console.error('Failed to update admin profile', err)
    } finally {
      setIsSavingAdminProfile(false)
    }
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

  // Navigation Groups modeled after user dashboard
  const navGroups: NavGroup[] = [
    {
      label: 'Workspace',
      items: [
        { id: 'overview', label: 'Command Overview', icon: LayoutGrid },
        { id: 'users', label: 'Users & Artisans', icon: Users, badge: users.length },
        { id: 'jobs', label: 'Service Requests', icon: Briefcase, badge: serviceRequests.length },
        { id: 'contracts', label: 'Escrow Contracts', icon: FolderKanban, badge: bookings.length },
      ],
    },
    {
      label: 'Compliance & Trust',
      items: [
        {
          id: 'verifications',
          label: 'Verifications',
          icon: ShieldCheck,
          badge: metrics.pendingVerificationsCount > 0 ? metrics.pendingVerificationsCount : null,
          alert: metrics.pendingVerificationsCount > 0,
        },
        {
          id: 'disputes',
          label: 'Disputes Desk',
          icon: AlertTriangle,
          badge: metrics.openDisputesCount > 0 ? metrics.openDisputesCount : null,
        },
      ],
    },
    {
      label: 'Finance',
      items: [
        {
          id: 'payments',
          label: 'Financial Ledger',
          icon: CreditCard,
          badge: pendingWithdrawals.length > 0 ? `${pendingWithdrawals.length} Payouts` : null,
          alert: pendingWithdrawals.length > 0,
        },
      ],
    },
    {
      label: 'Communications & System',
      items: [
        { id: 'notifications', label: 'In-App Alerts', icon: Bell, badge: inAppNotifications.length },
        { id: 'email', label: 'Broadcast Email', icon: Mail, badge: 'Hub' },
        { id: 'settings', label: 'Platform Settings', icon: Settings },
      ],
    },
  ]

  const allNavItems = navGroups.flatMap((g) => g.items)
  const currentNav = allNavItems.find((n) => n.id === activeTab) || allNavItems[0]

  // Filtered Nav Groups if search is active
  const filteredNavGroups = useMemo(() => {
    if (!navSearchQuery.trim()) return navGroups
    const q = navSearchQuery.toLowerCase()
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(q)),
      }))
      .filter((group) => group.items.length > 0)
  }, [navSearchQuery, navGroups])

  // Shared Sidebar Component
  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface">
      <BrandStripe className="h-[3px]" />
      
      {/* Brand Header */}
      <div className="h-[61px] px-5 flex items-center justify-between border-b border-line/60">
        <Link href="/admin" className="flex items-center gap-2.5">
          <ConnectaMark size={22} />
          <span className="text-[17px] font-medium tracking-[-0.02em] text-ink">connecta</span>
          <span className="px-1.5 py-0.5 rounded-[6px] bg-ink text-white text-[10px] font-semibold tracking-wider uppercase">
            Admin
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden w-8 h-8 rounded-lg text-muted hover:bg-sunken flex items-center justify-center cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Filter Bar */}
      <div className="px-3 pt-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            type="text"
            value={navSearchQuery}
            onChange={(e) => setNavSearchQuery(e.target.value)}
            placeholder="Quick tab jump..."
            className="w-full h-9 pl-8 pr-3 rounded-[10px] bg-sunken hover:bg-[#EDF0F4] text-[13px] text-ink placeholder:text-subtle transition-colors focus:bg-surface focus:ring-2 focus:ring-azure/20 focus:outline-none"
          />
          {navSearchQuery && (
            <button
              type="button"
              onClick={() => setNavSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-subtle hover:text-ink cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {filteredNavGroups.map((group) => (
          <div key={group.label}>
            <div className="px-3 pb-1.5 text-xs text-subtle font-medium">{group.label}</div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = activeTab === item.id
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id)
                      setMobileMenuOpen(false)
                    }}
                    className={`w-full group relative flex items-center justify-between h-9 px-3 rounded-[10px] text-sm transition-colors duration-200 cursor-pointer ${
                      active
                        ? 'bg-azure-50 text-azure-600 font-medium'
                        : 'text-ink-2 hover:bg-sunken hover:text-ink'
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-azure cn-fade" />
                    )}
                    <span className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${active ? 'text-azure' : 'text-subtle group-hover:text-ink-2'}`} />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && item.badge !== null && (
                      <span
                        className={`min-w-5 h-5 px-1.5 rounded-full text-[11px] font-medium inline-flex items-center justify-center ${
                          item.alert
                            ? 'bg-rose-500 text-white animate-pulse'
                            : active
                            ? 'bg-azure text-white'
                            : 'bg-sunken text-ink-2'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Sidebar Footer Widget: Escrow Custody & Admin Profile */}
      <div className="p-3 space-y-2 border-t border-line/60 bg-surface">
        <button
          type="button"
          onClick={() => setActiveTab('contracts')}
          className="w-full text-left rounded-xl border border-line p-3 hover:border-line-strong transition-colors cursor-pointer bg-canvas/60"
        >
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success cn-live-dot" />
              Locked in Escrow
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
          </div>
          <div className="mt-1 text-base font-semibold tracking-tight text-ink">
            {formatNaira(metrics.totalEscrowLockedMinor)}
          </div>
        </button>

        <div className="flex items-center gap-2.5 px-1.5 py-1">
          <button
            type="button"
            onClick={handleOpenProfileModal}
            className="flex items-center gap-2.5 min-w-0 flex-1 group text-left cursor-pointer"
          >
            <Avatar name={currentAdmin.fullName} size={32} />
            <div className="min-w-0">
              <div className="text-[13px] font-medium text-ink truncate group-hover:text-azure-600 transition-colors">
                {currentAdmin.fullName}
              </div>
              <div className="text-xs text-muted truncate">Lead Administrator</div>
            </div>
          </button>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              title="Platform Settings"
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'text-azure-600 bg-azure-50'
                  : 'text-subtle hover:text-ink hover:bg-sunken'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              title="Sign out"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-subtle hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
      {/* Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:block w-[248px] shrink-0 bg-surface border-r border-line sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-in Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[284px] max-w-[85vw] bg-surface shadow-2xl cn-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-30 h-14 bg-canvas/85 backdrop-blur-md border-b border-line flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden w-9 h-9 -ml-1.5 rounded-lg text-ink-2 hover:bg-sunken flex items-center justify-center cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/admin" className="lg:hidden flex items-center gap-1.5">
              <ConnectaMark size={20} />
              <span className="font-semibold text-sm tracking-tight text-ink">Connecta</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-1.5 text-[13px] text-muted min-w-0">
              <span className="hover:text-ink transition-colors cursor-pointer" onClick={() => setActiveTab('overview')}>
                Admin
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-subtle" />
              <span className="text-ink font-medium truncate">{currentNav.label}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live System Hub</span>
            </div>

            {/* Refresh Data Button */}
            <button
              type="button"
              onClick={refreshData}
              title="Refresh platform data"
              disabled={isRefreshing}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-ink hover:bg-sunken transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-azure' : ''}`} />
            </button>

            {/* In-App Alerts bell */}
            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              title="In-App Alerts"
              className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                activeTab === 'notifications' ? 'bg-sunken text-ink' : 'text-muted hover:text-ink hover:bg-sunken'
              }`}
            >
              <Bell className="w-4 h-4" />
              {inAppNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-azure ring-2 ring-canvas" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full hover:bg-sunken border border-line transition-all cursor-pointer"
              >
                <Avatar name={currentAdmin.fullName} size={26} />
                <span className="hidden sm:inline text-xs font-medium text-ink max-w-[100px] truncate">
                  {currentAdmin.fullName.split(' ')[0]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-subtle" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl shadow-[0_20px_40px_-16px_rgba(17,24,39,0.22)] border border-line py-1.5 z-50 cn-pop origin-top-right overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-line">
                    <p className="text-xs font-semibold text-ink truncate">{currentAdmin.fullName}</p>
                    <p className="text-[11px] text-muted truncate">{currentAdmin.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-azure-50 text-azure-600">
                      Super Administrator
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={handleOpenProfileModal}
                      className="w-full px-4 py-2 text-left text-xs text-ink hover:bg-sunken flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4 text-subtle" />
                      <span>Administrator Profile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        setActiveTab('settings')
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-ink hover:bg-sunken flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-subtle" />
                      <span>Platform Settings</span>
                    </button>
                  </div>

                  <div className="border-t border-line pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false)
                        setShowLogoutModal(true)
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* System Announcement Banner if active */}
        {platformSettings.announcementActive && platformSettings.systemAnnouncement && (
          <div className="bg-azure-50/90 border-b border-azure-100 px-5 sm:px-8 py-2 text-azure-900 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-azure shrink-0" />
              <span><strong>Live Announcement:</strong> {platformSettings.systemAnnouncement}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className="text-xs font-medium text-azure-600 hover:text-azure-900 underline shrink-0 cursor-pointer"
            >
              Configure Banner →
            </button>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 w-full max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-10 py-6 sm:py-8 cn-fade">
          {/* ================================================================= */}
          {/* TAB: COMMAND OVERVIEW                                             */}
          {/* ================================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-[13px] text-muted mb-1 font-medium">OPERATIONS COMMAND</p>
                  <h1 className="text-[26px] sm:text-[28px] leading-tight font-medium tracking-[-0.02em] text-ink">
                    Platform Command Center
                  </h1>
                  <p className="text-sm text-muted mt-1 leading-relaxed max-w-2xl">
                    Live oversight of verified artisans, customer requests, and NDIC-insured milestone escrow security across Nigeria.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab('verifications')}
                    className="h-9 px-3.5 rounded-[10px] bg-surface border border-line hover:bg-sunken text-ink text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verifications ({metrics.pendingVerificationsCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contracts')}
                    className="h-9 px-4 rounded-[10px] bg-ink hover:bg-ink-2 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4 text-emerald-400" />
                    <span>Escrow Vault</span>
                  </button>
                </div>
              </div>

              {/* 4 Primary Hero KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <div
                  onClick={() => setActiveTab('users')}
                  className="bg-surface rounded-2xl border border-line p-5 hover:border-line-strong transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted uppercase tracking-wider">
                      Platform Users
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-azure-50 text-azure-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mt-2.5">
                    {metrics.totalUsers}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted mt-2 pt-2 border-t border-line/60">
                    <span>{metrics.totalProviders} Artisans</span>
                    <span>{metrics.totalCustomers} Clients</span>
                  </div>
                </div>

                {/* Service Requests */}
                <div
                  onClick={() => setActiveTab('jobs')}
                  className="bg-surface rounded-2xl border border-line p-5 hover:border-line-strong transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted uppercase tracking-wider">
                      Service Requests
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-warn-50 text-warn-ink flex items-center justify-center">
                      <Briefcase className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight mt-2.5">
                    {metrics.totalJobs}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted mt-2 pt-2 border-t border-line/60">
                    <span className="text-emerald-700 font-medium">{metrics.activeJobs} Active</span>
                    <span>Nigeria</span>
                  </div>
                </div>

                {/* Escrow Locked */}
                <div
                  onClick={() => setActiveTab('contracts')}
                  className="bg-surface rounded-2xl border border-line p-5 hover:border-line-strong transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted uppercase tracking-wider">
                      Locked In Escrow
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-success-50 text-success-ink flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-semibold text-success-ink tracking-tight mt-2.5">
                    {formatNaira(metrics.totalEscrowLockedMinor)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted mt-2 pt-2 border-t border-line/60">
                    <span>{metrics.activeContracts} Ongoing Contracts</span>
                    <ArrowRight className="w-3.5 h-3.5 text-subtle group-hover:text-ink transition-colors" />
                  </div>
                </div>

                {/* Revenue (5%) */}
                <div
                  onClick={() => setActiveTab('payments')}
                  className="bg-surface rounded-2xl border border-line p-5 hover:border-line-strong transition-all cursor-pointer shadow-[0_1px_3px_rgba(0,0,0,0.03)] group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted uppercase tracking-wider">
                      Platform Fees (5%)
                    </span>
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Coins className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-semibold text-ink tracking-tight mt-2.5">
                    {formatNaira(metrics.totalPlatformFeeRevenueMinor)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted mt-2 pt-2 border-t border-line/60">
                    <span>{formatNaira(metrics.totalEscrowReleasedMinor)} Settled</span>
                    <ArrowRight className="w-3.5 h-3.5 text-subtle group-hover:text-ink transition-colors" />
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Pending Verifications & Recent Requests */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Verification Alerts */}
                <div className="bg-surface rounded-2xl border border-line p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-line">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-base font-medium text-ink">Artisan Verification Queue</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('verifications')}
                      className="text-xs font-medium text-azure-600 hover:text-azure-700 cursor-pointer"
                    >
                      View all ({verificationCases.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {verificationCases.slice(0, 3).map((v) => (
                      <div
                        key={v.id}
                        className="p-3.5 rounded-xl bg-canvas/70 border border-line flex items-center justify-between gap-3 hover:bg-sunken transition-colors"
                      >
                        <div className="space-y-0.5 min-w-0">
                          <p className="font-medium text-[13px] text-ink truncate">{v.providerName}</p>
                          <p className="text-xs text-muted truncate">
                            {v.trade} • {v.city}
                          </p>
                          <p className="text-[11px] text-subtle">{v.documentType} ({v.documentNumber})</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedCase(v)}
                          className="h-8 px-3 rounded-lg bg-surface border border-line text-ink hover:bg-sunken text-xs font-medium shrink-0 transition-colors cursor-pointer"
                        >
                          Review
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Service Requests */}
                <div className="bg-surface rounded-2xl border border-line p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-line">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-warn-ink" />
                      <h3 className="text-base font-medium text-ink">Recent Service Requests</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('jobs')}
                      className="text-xs font-medium text-azure-600 hover:text-azure-700 cursor-pointer"
                    >
                      View all ({serviceRequests.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {serviceRequests.slice(0, 3).map((j) => (
                      <div
                        key={j.id}
                        className="p-3.5 rounded-xl bg-canvas/70 border border-line flex items-center justify-between gap-3 hover:bg-sunken transition-colors"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge tone="azure">{j.category}</Badge>
                            <span className="text-[10px] font-medium text-warn-ink uppercase">{j.urgency}</span>
                          </div>
                          <p className="font-medium text-[13px] text-ink truncate">{j.title}</p>
                          <p className="text-xs text-muted">
                            Budget: <span className="font-medium text-ink">{formatNaira(j.budgetMinMinor)} - {formatNaira(j.budgetMaxMinor)}</span> • {j.city}
                          </p>
                        </div>
                        <Badge tone={j.status === 'open' ? 'success' : 'neutral'}>
                          {j.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: USERS & ARTISANS                                             */}
          {/* ================================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-[26px] leading-tight font-medium tracking-[-0.02em] text-ink">
                    Users &amp; Service Providers
                  </h1>
                  <p className="text-sm text-muted mt-1">
                    Manage registered clients, verified trade artisans, and administrative governance.
                  </p>
                </div>

                {/* Role Tabs */}
                <div className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-sunken border border-line">
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('all')}
                    className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      userRoleFilter === 'all'
                        ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(17,24,39,0.08)]'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    All ({users.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('provider')}
                    className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      userRoleFilter === 'provider'
                        ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(17,24,39,0.08)]'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    Artisans ({users.filter((u) => u.role === 'provider').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRoleFilter('customer')}
                    className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      userRoleFilter === 'customer'
                        ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(17,24,39,0.08)]'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    Clients ({users.filter((u) => u.role === 'customer').length})
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name, trade specialty, email, or city..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border border-line text-sm text-ink placeholder:text-subtle focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10 transition-all"
                />
              </div>

              {/* Users Table */}
              <div className="bg-surface rounded-2xl border border-line overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-sunken/60 border-b border-line text-subtle uppercase tracking-wider font-semibold text-[11px] whitespace-nowrap">
                      <tr>
                        <th className="py-3 px-5">Member &amp; Contact</th>
                        <th className="py-3 px-4">Role / Trade</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Verification</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/60 text-ink-2 font-normal">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-sunken/40 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-2.5">
                              <Avatar name={u.fullName} size={30} />
                              <div className="min-w-0">
                                <div className="font-medium text-ink text-[13px] truncate">{u.fullName}</div>
                                <div className="text-[11px] text-muted truncate">{u.email} • {u.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-ink capitalize text-xs">
                              {u.role === 'provider' ? u.trade : 'Client'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-muted">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-subtle" />
                              <span>{u.city}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge tone={u.verificationStatus === 'verified' ? 'success' : 'neutral'} dot>
                              {u.verificationStatus.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge tone={u.accountStatus === 'active' ? 'success' : 'danger'}>
                              {u.accountStatus.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {u.role === 'provider' && (
                                <button
                                  type="button"
                                  onClick={() => handleToggleFeatured(u)}
                                  className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1 border ${
                                    u.isFeatured
                                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                                      : 'border-line text-muted hover:bg-sunken hover:text-ink'
                                  }`}
                                  title={u.isFeatured ? 'Featured on User Overview' : 'Click to feature'}
                                >
                                  <Star className={`w-3 h-3 ${u.isFeatured ? 'fill-amber-400 text-amber-500' : 'text-subtle'}`} />
                                  <span>{u.isFeatured ? 'Featured' : 'Feature'}</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleOpenEditUser(u)}
                                className="h-7 px-2.5 rounded-lg border border-line hover:border-line-strong hover:bg-sunken text-ink text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                                title="Edit profile"
                              >
                                <Edit3 className="w-3 h-3 text-subtle" />
                                <span>Edit</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenAdjustWallet(u)}
                                className="h-7 px-2.5 rounded-lg border border-line hover:border-line-strong hover:bg-sunken text-ink text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                                title="Adjust vault balance"
                              >
                                <Coins className="w-3 h-3 text-emerald-600" />
                                <span>Vault</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenUser360(u)}
                                className="h-7 px-2.5 rounded-lg border border-line hover:border-line-strong hover:bg-sunken text-ink text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                                title="360 View"
                              >
                                <Eye className="w-3 h-3 text-subtle" />
                                <span>360°</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleUserStatus(u)}
                                className={`h-7 px-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                                  u.accountStatus === 'active'
                                    ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
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
          {/* TAB: SERVICE REQUESTS                                             */}
          {/* ================================================================= */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-[26px] leading-tight font-medium tracking-[-0.02em] text-ink">
                    Service Requests &amp; Jobs
                  </h1>
                  <p className="text-sm text-muted mt-1">
                    Live client job inquiries across Kano and Nigerian metropolitan hubs.
                  </p>
                </div>

                <select
                  value={jobTradeFilter}
                  onChange={(e) => setJobTradeFilter(e.target.value)}
                  className="h-9 px-3 rounded-xl border border-line bg-surface text-xs font-medium text-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-azure/20"
                >
                  <option value="all">All Trade Categories</option>
                  <option value="plumbing">Plumbing &amp; Pipes</option>
                  <option value="electrical">Electrical &amp; Solar</option>
                  <option value="ac-cooling">AC &amp; Refrigeration</option>
                  <option value="carpentry">Carpentry &amp; Woodwork</option>
                </select>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-subtle" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="Search job title, customer name, or location..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-surface border border-line text-sm text-ink placeholder:text-subtle focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10 transition-all"
                />
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map((j) => (
                  <div
                    key={j.id}
                    className="bg-surface rounded-2xl border border-line p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone="azure">{j.category}</Badge>
                        <Badge tone="warn">{j.urgency}</Badge>
                      </div>

                      <h3 className="font-medium text-base text-ink leading-snug">{j.title}</h3>
                      <p className="text-xs text-muted line-clamp-2 leading-relaxed">{j.description}</p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {j.requiredSkills.map((sk, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-sunken text-ink-2">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-line flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[11px] text-muted">Budget Escrow</div>
                        <div className="font-medium text-ink text-sm">
                          {formatNaira(j.budgetMinMinor)} - {formatNaira(j.budgetMaxMinor)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted">{j.proposalsCount} proposals</span>
                        <button
                          type="button"
                          onClick={() => handleOpenJobEdit(j)}
                          className="h-8 px-3 rounded-lg border border-line hover:bg-sunken text-ink text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-subtle" />
                          <span>Moderate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: CONTRACTS & ESCROW VAULT                                     */}
          {/* ================================================================= */}
          {activeTab === 'contracts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-[26px] leading-tight font-medium tracking-[-0.02em] text-ink">
                    Escrow Contracts &amp; Vault
                  </h1>
                  <p className="text-sm text-muted mt-1">
                    Manage locked funds, monitor milestone fulfillment, and administer escrow releases or refunds.
                  </p>
                </div>

                <div className="inline-flex items-center gap-0.5 p-1 rounded-xl bg-sunken border border-line">
                  <button
                    type="button"
                    onClick={() => setBookingFilter('all')}
                    className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      bookingFilter === 'all'
                        ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(17,24,39,0.08)]'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    All ({bookings.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingFilter('locked')}
                    className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      bookingFilter === 'locked'
                        ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(17,24,39,0.08)]'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    Locked ({bookings.filter((b) => b.escrowStatus === 'locked').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingFilter('released')}
                    className={`h-8 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      bookingFilter === 'released'
                        ? 'bg-surface text-ink shadow-[0_1px_3px_rgba(17,24,39,0.08)]'
                        : 'text-muted hover:text-ink'
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
                    className="bg-surface rounded-2xl border border-line p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted">{b.bookingNumber}</span>
                          <Badge tone={b.escrowStatus === 'locked' ? 'warn' : 'success'}>
                            Escrow: {b.escrowStatus}
                          </Badge>
                        </div>
                        <h3 className="text-base font-medium text-ink mt-1">{b.title}</h3>
                      </div>

                      <div className="sm:text-right">
                        <div className="text-xs text-muted">Contract Value</div>
                        <div className="text-lg font-semibold text-ink">{formatNaira(b.totalAmountMinor)}</div>
                      </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-canvas/70 border border-line">
                        <span className="text-subtle uppercase text-[10px] block font-medium mb-0.5">Customer / Client</span>
                        <div className="font-medium text-ink">{b.clientName}</div>
                        <div className="text-muted text-[11px]">{b.clientCompany || 'Residential'} • {b.location}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-canvas/70 border border-line">
                        <span className="text-subtle uppercase text-[10px] block font-medium mb-0.5">Assigned Specialist</span>
                        <div className="font-medium text-ink">{b.providerName}</div>
                        <div className="text-muted text-[11px]">{b.providerTitle}</div>
                      </div>
                    </div>

                    {/* Milestone Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-muted">
                        <span>Milestones Progress</span>
                        <span className="font-medium text-ink">{b.progressPercentage}% Completed</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-sunken overflow-hidden">
                        <div
                          className="h-full bg-azure transition-all duration-300"
                          style={{ width: `${b.progressPercentage}%` }}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        {b.milestones.map((m) => (
                          <div
                            key={m.id}
                            className={`p-2.5 rounded-lg text-xs border ${
                              m.status === 'completed'
                                ? 'bg-success-50/70 border-success/30 text-success-ink'
                                : m.status === 'current'
                                ? 'bg-azure-50/70 border-azure/30 text-azure-600'
                                : 'bg-sunken border-line text-muted'
                            }`}
                          >
                            <div className="font-medium truncate">{m.title}</div>
                            <div className="text-[11px] opacity-80 mt-0.5">{formatNaira(m.amountMinor)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    {b.escrowStatus === 'locked' && (
                      <div className="pt-2 flex justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setActionBooking({ booking: b, type: 'refund' })}
                          className="h-9 px-4 rounded-[10px] border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium transition-colors cursor-pointer"
                        >
                          Refund to Client
                        </button>
                        <button
                          type="button"
                          onClick={() => setActionBooking({ booking: b, type: 'release' })}
                          className="h-9 px-4 rounded-[10px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors cursor-pointer"
                        >
                          Release to Specialist
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: VERIFICATIONS QUEUE                                          */}
          {/* ================================================================= */}
          {activeTab === 'verifications' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[26px] leading-tight font-medium tracking-[-0.02em] text-ink">
                  Artisan Verification Queue
                </h1>
                <p className="text-sm text-muted mt-1">
                  Inspect submitted National Identification Numbers (NIN), CAC certificates, and Trade Guild licenses.
                </p>
              </div>

              <div className="bg-surface rounded-2xl border border-line divide-y divide-line overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                {verificationCases.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-sunken/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-base text-ink">{c.providerName}</h4>
                        <Badge tone={c.status === 'approved' ? 'success' : c.status === 'rejected' ? 'danger' : 'warn'}>
                          {c.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted">
                        <span className="font-medium text-ink">{c.businessName}</span> • {c.trade} • {c.city}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-subtle pt-0.5">
                        <span className="font-medium text-ink-2">{c.documentType}</span>
                        <span>•</span>
                        <span>ID: {c.documentNumber}</span>
                        <span>•</span>
                        <span>{c.yearsOfExperience}+ Years Experience</span>
                      </div>
                      {c.rejectionReason && (
                        <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg mt-1 font-medium">
                          Rejection Reason: {c.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {c.status === 'under_review' ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setSelectedCase(c)}
                            className="h-8 px-3 rounded-lg border border-line text-ink hover:bg-sunken text-xs font-medium transition-colors cursor-pointer"
                          >
                            Inspect &amp; Reject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveCase(c.id)}
                            className="h-8 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-muted font-medium">Processed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: FINANCIAL LEDGER & PAYOUTS                                   */}
          {/* ================================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[26px] leading-tight font-medium tracking-[-0.02em] text-ink">
                  Financial Ledger &amp; Payouts
                </h1>
                <p className="text-sm text-muted mt-1">
                  Milestone Escrow accounting and bank withdrawal processing in Nigerian Naira (NGN).
                </p>
              </div>

              {/* KPI Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-surface rounded-2xl border border-line p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <span className="text-xs text-muted uppercase font-medium">Active Locked Escrow</span>
                  <div className="text-2xl font-semibold text-ink mt-1.5">{formatNaira(metrics.totalEscrowLockedMinor)}</div>
                  <span className="text-xs text-muted mt-1 block">Safeguarded in Custody</span>
                </div>
                <div className="bg-surface rounded-2xl border border-line p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <span className="text-xs text-muted uppercase font-medium">Total Released to Artisans</span>
                  <div className="text-2xl font-semibold text-emerald-700 mt-1.5">{formatNaira(metrics.totalEscrowReleasedMinor)}</div>
                  <span className="text-xs text-muted mt-1 block">Completed Milestone Payouts</span>
                </div>
                <div className="bg-surface rounded-2xl border border-line p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                  <span className="text-xs text-muted uppercase font-medium">Connecta Platform Fee (5%)</span>
                  <div className="text-2xl font-semibold text-azure-600 mt-1.5">{formatNaira(metrics.totalPlatformFeeRevenueMinor)}</div>
                  <span className="text-xs text-muted mt-1 block">Retained Operations Revenue</span>
                </div>
              </div>

              {/* Pending Bank Payouts Queue */}
              <div className="bg-surface rounded-2xl border border-line p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-base text-ink flex items-center gap-2">
                      <span>Pending Bank Payouts Desk</span>
                      {pendingWithdrawals.length > 0 && (
                        <Badge tone="warn" dot>
                          {pendingWithdrawals.length} Action Needed
                        </Badge>
                      )}
                    </h3>
                    <p className="text-xs text-muted mt-0.5">
                      User bank withdrawals to Nigerian commercial accounts awaiting compliance clearance.
                    </p>
                  </div>
                </div>

                {pendingWithdrawals.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted bg-canvas/60 rounded-xl border border-line">
                    No pending bank withdrawal requests at this time. All payouts are settled.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-sunken/60 text-subtle uppercase tracking-wider text-[11px] font-semibold border-b border-line">
                        <tr>
                          <th className="py-3 px-4">User</th>
                          <th className="py-3 px-4">Bank &amp; Account</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line/60 text-ink">
                        {pendingWithdrawals.map((pw) => (
                          <tr key={pw.id} className="hover:bg-sunken/40">
                            <td className="py-3 px-4">
                              <div className="font-medium text-ink">{pw.userName}</div>
                              <div className="text-[11px] text-muted">{pw.userEmail}</div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="font-medium text-ink">{pw.bankName || 'Commercial Bank'}</div>
                              <div className="text-[11px] text-muted font-mono">{pw.accountNumber || '••••••••••'}</div>
                            </td>
                            <td className="py-3 px-4 font-semibold text-emerald-700">
                              {formatNaira(pw.amountMinor)}
                            </td>
                            <td className="py-3 px-4 text-xs text-muted">
                              {pw.date ? pw.date.slice(0, 10) : 'Recent'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionWithdrawal(pw)
                                    setPayoutDecision('approve')
                                    setPayoutRefInput(`NIP-${Date.now().toString().slice(-6)}`)
                                  }}
                                  className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActionWithdrawal(pw)
                                    setPayoutDecision('reject')
                                    setPayoutRejectReason('Account name mismatch with verified BVN')
                                  }}
                                  className="h-7 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-medium transition-colors cursor-pointer"
                                >
                                  Reject &amp; Refund
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recent Milestone Transactions */}
              <div className="bg-surface rounded-2xl border border-line p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="font-medium text-base text-ink">Recent Milestone Transactions</h3>
                <div className="divide-y divide-line/60">
                  {bookings.map((b) => (
                    <div key={b.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-ink">{b.title}</div>
                        <div className="text-muted text-[11px]">
                          {b.bookingNumber} • Client: {b.clientName} → Provider: {b.providerName}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-ink">{formatNaira(b.totalAmountMinor)}</div>
                        <div className="text-[11px] text-emerald-600 font-medium">
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
          {/* TAB: DISPUTES DESK                                                */}
          {/* ================================================================= */}
          {activeTab === 'disputes' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[26px] leading-tight font-medium tracking-[-0.02em] text-ink">
                  Dispute &amp; Mediation Center
                </h1>
                <p className="text-sm text-muted mt-1">
                  Connecta Trust Desk claims resolution for job quality, delays, and payment splits.
                </p>
              </div>

              <div className="space-y-4">
                {disputes.map((d) => (
                  <div
                    key={d.id}
                    className="bg-surface rounded-2xl border border-line p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-line">
                      <div>
                        <span className="text-xs text-muted font-medium">{d.disputeNumber}</span>
                        <h4 className="font-medium text-base text-ink mt-0.5">{d.bookingTitle}</h4>
                      </div>
                      <Badge tone={d.status === 'resolved' ? 'success' : 'warn'}>
                        {d.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="text-xs space-y-2">
                      <p className="text-ink-2">
                        <span className="font-medium text-ink">Claimant:</span> {d.claimantName} vs{' '}
                        <span className="font-medium text-ink">Respondent:</span> {d.respondentName}
                      </p>
                      <div className="p-3 rounded-xl bg-canvas/70 border border-line text-muted leading-relaxed">
                        {d.reason}
                      </div>
                      <p className="text-[11px] text-subtle italic">Desk Notes: {d.notes}</p>
                    </div>

                    {d.status !== 'resolved' && (
                      <div className="pt-2 flex justify-end items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenSplitDispute(d)}
                          className="h-9 px-4 rounded-[10px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Split className="w-3.5 h-3.5" />
                          <span>Settle Split Payout</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedDispute(d)}
                          className="h-9 px-4 rounded-[10px] bg-ink hover:bg-ink-2 text-white text-xs font-medium transition-colors cursor-pointer"
                        >
                          Resolve (Notes)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: PLATFORM SETTINGS                                            */}
          {/* ================================================================= */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSavePlatformSettings} className="bg-surface rounded-2xl border border-line p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-line">
                <div>
                  <h1 className="text-[26px] leading-tight font-medium tracking-[-0.02em] text-ink">
                    Platform Settings &amp; Governance
                  </h1>
                  <p className="text-sm text-muted mt-1">
                    Live system settings that immediately govern user dashboards, fees, hotlines, and announcements.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="h-10 px-5 rounded-[10px] bg-ink hover:bg-ink-2 text-white text-xs font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingSettings ? 'Saving...' : 'Save Live Settings'}</span>
                </button>
              </div>

              {settingsNotice && (
                <Notice tone="success" onClose={() => setSettingsNotice(null)}>
                  {settingsNotice}
                </Notice>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-ink-2">Primary Hub City</label>
                  <input
                    type="text"
                    value={platformSettings.hubCity}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, hubCity: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                  <p className="text-[11px] text-muted">Headquarters city displayed on platform branding.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-ink-2">Platform Escrow Commission (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="30"
                    value={platformSettings.commissionRatePercent}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, commissionRatePercent: parseFloat(e.target.value) || 0 })}
                    className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                  <p className="text-[11px] text-muted">Deducted from completed contracts upon milestone payout.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-ink-2">Support Desk Hotline (Phone)</label>
                  <input
                    type="text"
                    value={platformSettings.supportPhone}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, supportPhone: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                  <p className="text-[11px] text-muted">Displayed on User Dashboard Help &amp; Support page.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-ink-2">Official WhatsApp Direct Link</label>
                  <input
                    type="text"
                    value={platformSettings.supportWhatsapp}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, supportWhatsapp: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                  <p className="text-[11px] text-muted">Direct click-to-chat URL for client disputes.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-ink-2">Support Desk Email</label>
                  <input
                    type="email"
                    value={platformSettings.supportEmail}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                    className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                  <p className="text-[11px] text-muted">Public support inbox for customer complaints.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-ink-2">New User Welcome Sparks Bonus</label>
                  <input
                    type="number"
                    value={platformSettings.welcomeSparks}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, welcomeSparks: parseInt(e.target.value, 10) || 0 })}
                    className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                  <p className="text-[11px] text-muted">AI Sparks awarded to new accounts upon registration.</p>
                </div>
              </div>

              {/* Announcement Banner */}
              <div className="pt-4 border-t border-line space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm text-ink">Dashboard Broadcast Banner</h3>
                    <p className="text-xs text-muted">Shows an alert banner across the top of all user dashboards.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(platformSettings.announcementActive)}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, announcementActive: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-sunken border border-line peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-azure"></div>
                  </label>
                </div>

                <input
                  type="text"
                  value={platformSettings.systemAnnouncement || ''}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, systemAnnouncement: e.target.value })}
                  placeholder="e.g. Scheduled maintenance tonight at 11 PM or Special Eid promo active!"
                  className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                />
              </div>
            </form>
          )}

          {/* ================================================================= */}
          {/* TAB: IN-APP ALERTS & NOTIFICATIONS                                */}
          {/* ================================================================= */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-[26px] leading-tight font-medium tracking-[-0.02em] text-ink">
                  In-App Alerts Broadcaster
                </h1>
                <p className="text-sm text-muted mt-1">
                  Deliver instant alerts into user dashboard notification bell dropdowns and system headers.
                </p>
              </div>

              {notifNotice && (
                <Notice tone="success" onClose={() => setNotifNotice(null)}>
                  {notifNotice}
                </Notice>
              )}

              {/* Compose */}
              <form onSubmit={handleBroadcastInAppNotification} className="bg-surface rounded-2xl border border-line p-6 sm:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="font-medium text-base text-ink flex items-center gap-2">
                  <Bell className="w-4 h-4 text-warn" />
                  <span>Compose Live Broadcast</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-ink-2">Target Audience</label>
                    <select
                      value={newNotifAudience}
                      onChange={(e) => setNewNotifAudience(e.target.value)}
                      className="w-full h-10 px-3 rounded-[10px] bg-surface border border-line text-sm text-ink cursor-pointer focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                    >
                      <option value="all">Broadcast to All Users</option>
                      <option value="clients">All Registered Clients</option>
                      <option value="providers">All Verified Providers</option>
                      {users.slice(0, 15).map((u) => (
                        <option key={u.id} value={u.id}>
                          Individual: {u.fullName} ({u.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-medium text-ink-2">Notification Alert Tone</label>
                    <select
                      value={newNotifType}
                      onChange={(e) => setNewNotifType(e.target.value as any)}
                      className="w-full h-10 px-3 rounded-[10px] bg-surface border border-line text-sm text-ink cursor-pointer focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                    >
                      <option value="info">Info (Azure Blue dot)</option>
                      <option value="success">Success / Milestone Paid (Green dot)</option>
                      <option value="warning">Warning / Action Required (Amber dot)</option>
                      <option value="alert">Security Alert (Red dot)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="block text-xs font-medium text-ink-2">Notification Title</label>
                  <input
                    type="text"
                    required
                    value={newNotifTitle}
                    onChange={(e) => setNewNotifTitle(e.target.value)}
                    placeholder="e.g. Escrow Deposit Confirmed or New Booking Available"
                    className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="block text-xs font-medium text-ink-2">Message Body</label>
                  <textarea
                    required
                    rows={3}
                    value={newNotifMessage}
                    onChange={(e) => setNewNotifMessage(e.target.value)}
                    placeholder="Enter short notification text that will appear in the user's dashboard bell dropdown..."
                    className="w-full p-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10 resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSendingNotification}
                    className="h-10 px-5 rounded-[10px] bg-ink hover:bg-ink-2 text-white text-xs font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSendingNotification ? 'Dispatching...' : 'Dispatch Live Notification'}</span>
                  </button>
                </div>
              </form>

              {/* History */}
              <div className="bg-surface rounded-2xl border border-line p-6 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
                <h3 className="font-medium text-base text-ink">Broadcast History</h3>
                <div className="divide-y divide-line/60">
                  {inAppNotifications.map((notif) => (
                    <div key={notif.id} className="py-3 flex items-start gap-3 text-xs">
                      <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                        notif.type === 'warning' ? 'bg-warn' : notif.type === 'success' ? 'bg-success' : notif.type === 'alert' ? 'bg-rose-500' : 'bg-azure'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-ink text-[13px]">{notif.title}</span>
                          <span className="text-[11px] text-muted">{notif.createdAt ? notif.createdAt.slice(0, 16).replace('T', ' ') : 'Recent'}</span>
                        </div>
                        <p className="text-muted mt-0.5 leading-relaxed">{notif.message}</p>
                        <span className="text-[11px] text-subtle mt-1 block">Audience: {notif.userId === 'all' ? 'All Users' : notif.userId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB: EMAIL BROADCAST HUB                                          */}
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
      {/* MODAL: EDIT USER PROFILE & VERIFICATION                               */}
      {/* ===================================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setEditingUser(null)} />
          <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-ink">Edit Member Profile</h3>
                <p className="text-xs text-muted mt-0.5">{editingUser.fullName} ({editingUser.id})</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">Full Name</label>
                  <input
                    type="text"
                    value={userEditForm.fullName}
                    onChange={(e) => setUserEditForm({ ...userEditForm, fullName: e.target.value })}
                    className="w-full h-10 px-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">Email Address</label>
                  <input
                    type="email"
                    value={userEditForm.email}
                    onChange={(e) => setUserEditForm({ ...userEditForm, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">Phone Number</label>
                  <input
                    type="text"
                    value={userEditForm.phone}
                    onChange={(e) => setUserEditForm({ ...userEditForm, phone: e.target.value })}
                    className="w-full h-10 px-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">Operating City</label>
                  <input
                    type="text"
                    value={userEditForm.city}
                    onChange={(e) => setUserEditForm({ ...userEditForm, city: e.target.value })}
                    className="w-full h-10 px-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">Trade / Specialty</label>
                  <input
                    type="text"
                    value={userEditForm.trade}
                    onChange={(e) => setUserEditForm({ ...userEditForm, trade: e.target.value })}
                    className="w-full h-10 px-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">National ID (NIN)</label>
                  <input
                    type="text"
                    value={userEditForm.ninNumber}
                    onChange={(e) => setUserEditForm({ ...userEditForm, ninNumber: e.target.value })}
                    className="w-full h-10 px-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">Hourly Rate (₦)</label>
                  <input
                    type="number"
                    value={userEditForm.hourlyRateNaira}
                    onChange={(e) => setUserEditForm({ ...userEditForm, hourlyRateNaira: e.target.value })}
                    className="w-full h-10 px-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">Role</label>
                  <select
                    value={userEditForm.role}
                    onChange={(e) => setUserEditForm({ ...userEditForm, role: e.target.value as any })}
                    className="w-full h-10 px-2.5 rounded-[10px] bg-surface border border-line text-xs font-medium text-ink"
                  >
                    <option value="provider">Provider (Artisan)</option>
                    <option value="customer">Customer (Client)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">Verification</label>
                  <select
                    value={userEditForm.verificationStatus}
                    onChange={(e) => setUserEditForm({ ...userEditForm, verificationStatus: e.target.value as any })}
                    className="w-full h-10 px-2.5 rounded-[10px] bg-surface border border-line text-xs font-medium text-ink"
                  >
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUserEdit}
                disabled={isSavingUser}
                className="flex-1 h-10 rounded-[10px] bg-ink hover:bg-ink-2 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {isSavingUser ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: MANUAL WALLET ADJUSTMENT                                       */}
      {/* ===================================================================== */}
      {adjustingWalletUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setAdjustingWalletUser(null)} />
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-ink">Adjust Vault Balance &amp; Sparks</h3>
                <p className="text-xs text-muted mt-0.5">{adjustingWalletUser.fullName}</p>
              </div>
              <button
                type="button"
                onClick={() => setAdjustingWalletUser(null)}
                className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-canvas/70 rounded-xl p-3.5 border border-line text-xs space-y-1.5">
              <div className="flex justify-between text-muted">
                <span>Available Cash Balance:</span>
                <span className="font-semibold text-ink">{formatNaira(adjustingWalletUser.wallet?.balanceMinor || 0)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Escrow in Custody:</span>
                <span className="font-semibold text-emerald-700">{formatNaira(adjustingWalletUser.wallet?.escrowBalanceMinor || 0)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>AI Sparks Points:</span>
                <span className="font-semibold text-amber-600">{adjustingWalletUser.wallet?.sparksBalance || 0} Sparks</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-ink-2">Cash Adjustment (₦ Delta)</label>
                <input
                  type="number"
                  step="100"
                  value={walletAdjustDeltaNaira}
                  onChange={(e) => setWalletAdjustDeltaNaira(e.target.value)}
                  placeholder="e.g. 50000 to credit, or -25000 to debit"
                  className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-ink-2">AI Sparks Delta</label>
                <input
                  type="number"
                  step="10"
                  value={walletAdjustSparks}
                  onChange={(e) => setWalletAdjustSparks(e.target.value)}
                  placeholder="e.g. 200 to grant Sparks"
                  className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-ink-2">Audit Reason</label>
                <input
                  type="text"
                  required
                  value={walletAdjustReason}
                  onChange={(e) => setWalletAdjustReason(e.target.value)}
                  placeholder="e.g. Goodwill credit for project completion"
                  className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setAdjustingWalletUser(null)}
                className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveWalletAdjustment}
                disabled={isAdjustingWallet}
                className="flex-1 h-10 rounded-[10px] bg-ink hover:bg-ink-2 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {isAdjustingWallet ? 'Applying...' : 'Apply Ledger Adjustment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: RESET PASSWORD                                                 */}
      {/* ===================================================================== */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setResettingUser(null)} />
          <div className="relative w-full max-w-sm bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-4 text-center">
            <div className="w-10 h-10 rounded-full bg-azure-50 text-azure-600 mx-auto flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-medium text-ink">Reset Member Password</h3>
              <p className="text-xs text-muted mt-0.5">{resettingUser.fullName} ({resettingUser.email})</p>
            </div>

            <div className="text-left text-xs space-y-1">
              <label className="block text-xs font-medium text-ink-2">New Temporary Password</label>
              <input
                type="text"
                required
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                placeholder="Enter new temporary password"
                className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setResettingUser(null)}
                className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePasswordReset}
                disabled={isResettingPassword || !newPasswordInput.trim()}
                className="flex-1 h-10 rounded-[10px] bg-ink hover:bg-ink-2 text-white text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              >
                {isResettingPassword ? 'Updating...' : 'Set Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: USER 360° ACTIVITY DRAWER                                      */}
      {/* ===================================================================== */}
      {user360 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setUser360(null)} />
          <div className="relative w-full max-w-2xl bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-line pb-4">
              <div className="flex items-center gap-3">
                <Avatar name={user360.fullName} size={40} />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium text-ink">{user360.fullName}</h3>
                    <Badge tone="neutral">{user360.role.toUpperCase()}</Badge>
                    {user360.verificationStatus === 'verified' && (
                      <Badge tone="success" dot>VERIFIED</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5">{user360.email} • {user360.phone} • {user360.city}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUser360(null)}
                className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-line text-xs font-medium gap-4">
              <button
                type="button"
                onClick={() => setUser360Tab('profile')}
                className={`pb-2 transition-colors cursor-pointer border-b-2 ${
                  user360Tab === 'profile' ? 'border-azure text-azure font-medium' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                Profile &amp; Vault
              </button>
              <button
                type="button"
                onClick={() => setUser360Tab('contracts')}
                className={`pb-2 transition-colors cursor-pointer border-b-2 ${
                  user360Tab === 'contracts' ? 'border-azure text-azure font-medium' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                Contracts ({bookings.filter((b) => b.customerId === user360.id || b.providerId === user360.id).length})
              </button>
              <button
                type="button"
                onClick={() => setUser360Tab('jobs')}
                className={`pb-2 transition-colors cursor-pointer border-b-2 ${
                  user360Tab === 'jobs' ? 'border-azure text-azure font-medium' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                Requests ({serviceRequests.filter((r) => r.customerId === user360.id).length})
              </button>
              <button
                type="button"
                onClick={() => setUser360Tab('disputes')}
                className={`pb-2 transition-colors cursor-pointer border-b-2 ${
                  user360Tab === 'disputes' ? 'border-azure text-azure font-medium' : 'border-transparent text-muted hover:text-ink'
                }`}
              >
                Disputes ({disputes.filter((d) => d.claimantName.includes(user360.fullName) || d.respondentName.includes(user360.fullName)).length})
              </button>
            </div>

            {/* Content */}
            {user360Tab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-canvas/70 p-4 rounded-xl border border-line">
                  <div>
                    <span className="text-subtle text-[11px] block">Vault Balance</span>
                    <span className="text-sm font-semibold text-ink mt-0.5 block">
                      {formatNaira(user360.wallet?.balanceMinor || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-subtle text-[11px] block">Escrow In-Flight</span>
                    <span className="text-sm font-semibold text-emerald-700 mt-0.5 block">
                      {formatNaira(user360.wallet?.escrowBalanceMinor || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-subtle text-[11px] block">AI Sparks</span>
                    <span className="text-sm font-semibold text-amber-600 mt-0.5 block">
                      {user360.wallet?.sparksBalance || 0} SPK
                    </span>
                  </div>
                  <div>
                    <span className="text-subtle text-[11px] block">Status</span>
                    <span className={`text-xs font-semibold mt-0.5 block uppercase ${
                      user360.accountStatus === 'active' ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {user360.accountStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-surface rounded-xl border border-line">
                    <span className="text-subtle text-[11px]">Trade Specialty:</span>
                    <p className="font-medium text-ink mt-0.5">{user360.trade || 'General Services'}</p>
                  </div>
                  <div className="p-3 bg-surface rounded-xl border border-line">
                    <span className="text-subtle text-[11px]">National Identification (NIN):</span>
                    <p className="font-medium text-ink mt-0.5">{user360.ninNumber || 'Not submitted'}</p>
                  </div>
                  <div className="p-3 bg-surface rounded-xl border border-line">
                    <span className="text-subtle text-[11px]">Hourly Billing Rate:</span>
                    <p className="font-medium text-ink mt-0.5">
                      {user360.hourlyRateMinor ? `${formatNaira(user360.hourlyRateMinor)}/hr` : 'Default'}
                    </p>
                  </div>
                  <div className="p-3 bg-surface rounded-xl border border-line">
                    <span className="text-subtle text-[11px]">Dashboard Featured Pro:</span>
                    <p className="font-medium text-ink mt-0.5">
                      {user360.isFeatured ? '⭐️ Yes, featured on user overview' : 'No'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUser360(null)
                      handleOpenEditUser(user360)
                    }}
                    className="h-9 px-3.5 rounded-lg border border-line text-ink hover:bg-sunken text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-subtle" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUser360(null)
                      handleOpenAdjustWallet(user360)
                    }}
                    className="h-9 px-3.5 rounded-lg border border-line text-ink hover:bg-sunken text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Adjust Vault</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUser360(null)
                      handleOpenResetPassword(user360)
                    }}
                    className="h-9 px-3.5 rounded-lg border border-line text-ink hover:bg-sunken text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-azure" />
                    <span>Reset Password</span>
                  </button>
                </div>
              </div>
            )}

            {user360Tab === 'contracts' && (
              <div className="space-y-3 text-xs">
                {bookings.filter((b) => b.customerId === user360.id || b.providerId === user360.id).length === 0 ? (
                  <p className="text-muted py-8 text-center">No contracts found for this member.</p>
                ) : (
                  bookings
                    .filter((b) => b.customerId === user360.id || b.providerId === user360.id)
                    .map((b) => (
                      <div key={b.id} className="p-3 bg-canvas/70 rounded-xl border border-line flex items-center justify-between">
                        <div>
                          <div className="font-medium text-ink">{b.title}</div>
                          <div className="text-muted text-[11px] mt-0.5">
                            {b.bookingNumber} • Escrow: {b.escrowStatus} • Status: {b.bookingStatus}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-ink">{formatNaira(b.totalAmountMinor)}</div>
                          <div className="text-[11px] text-emerald-700">{b.progressPercentage}% done</div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {user360Tab === 'jobs' && (
              <div className="space-y-3 text-xs">
                {serviceRequests.filter((r) => r.customerId === user360.id).length === 0 ? (
                  <p className="text-muted py-8 text-center">No service requests posted by this member.</p>
                ) : (
                  serviceRequests
                    .filter((r) => r.customerId === user360.id)
                    .map((j) => (
                      <div key={j.id} className="p-3 bg-canvas/70 rounded-xl border border-line flex items-center justify-between">
                        <div>
                          <div className="font-medium text-ink">{j.title}</div>
                          <div className="text-muted text-[11px] mt-0.5">
                            {j.category} • Status: {j.status} • {j.proposalsCount} Quotes
                          </div>
                        </div>
                        <div className="text-right font-semibold text-ink">
                          {formatNaira(j.budgetMinMinor)} - {formatNaira(j.budgetMaxMinor)}
                        </div>
                      </div>
                    ))
                )}
              </div>
            )}

            {user360Tab === 'disputes' && (
              <div className="space-y-3 text-xs">
                {disputes.filter((d) => d.claimantName.includes(user360.fullName) || d.respondentName.includes(user360.fullName)).length === 0 ? (
                  <p className="text-muted py-8 text-center">No disputes on file for this member.</p>
                ) : (
                  disputes
                    .filter((d) => d.claimantName.includes(user360.fullName) || d.respondentName.includes(user360.fullName))
                    .map((d) => (
                      <div key={d.id} className="p-3 bg-canvas/70 rounded-xl border border-line space-y-1">
                        <div className="flex justify-between font-medium text-ink">
                          <span>{d.disputeNumber} — {d.bookingTitle}</span>
                          <span className="uppercase text-[10px] text-amber-700">{d.status}</span>
                        </div>
                        <p className="text-muted">{d.reason}</p>
                      </div>
                    ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: MODERATE SERVICE REQUEST                                       */}
      {/* ===================================================================== */}
      {editingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setEditingJob(null)} />
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-ink">Moderate Job Brief</h3>
                <p className="text-xs text-muted mt-0.5">{editingJob.id} • Client: {editingJob.customerName}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-ink-2">Request Title</label>
                <input
                  type="text"
                  value={jobTitleInput}
                  onChange={(e) => setJobTitleInput(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-ink-2">Description</label>
                <textarea
                  rows={3}
                  value={jobDescriptionInput}
                  onChange={(e) => setJobDescriptionInput(e.target.value)}
                  className="w-full p-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-medium text-ink-2">Moderation Action</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleModerateJob('open')}
                    className={`h-9 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      editingJob.status === 'open'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'border-line text-ink hover:bg-sunken'
                    }`}
                  >
                    Keep Open
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModerateJob('closed')}
                    className="h-9 rounded-lg text-xs font-medium border border-line text-ink hover:bg-sunken transition-colors cursor-pointer"
                  >
                    Close Job
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModerateJob('cancelled')}
                    className="h-9 rounded-lg text-xs font-medium border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    Spam / Cancel
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="w-full h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: DISPUTE CUSTOM SPLIT SETTLEMENT                                */}
      {/* ===================================================================== */}
      {splitDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setSplitDispute(null)} />
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-ink">Custom Split Settlement</h3>
                <p className="text-xs text-muted mt-0.5">{splitDispute.disputeNumber} ({formatNaira(splitDispute.amountMinor)})</p>
              </div>
              <button
                type="button"
                onClick={() => setSplitDispute(null)}
                className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between font-medium text-ink">
                  <span>Specialist Share: {splitProviderPct}%</span>
                  <span>Client Refund: {100 - splitProviderPct}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={splitProviderPct}
                  onChange={(e) => setSplitProviderPct(parseInt(e.target.value, 10))}
                  className="w-full accent-azure cursor-pointer"
                />
                <div className="grid grid-cols-2 gap-3 bg-canvas/70 p-3 rounded-xl border border-line">
                  <div>
                    <span className="text-[11px] text-muted block">PAYS TO SPECIALIST</span>
                    <span className="font-semibold text-emerald-700 text-sm mt-0.5 block">
                      {formatNaira(Math.round((splitDispute.amountMinor * splitProviderPct) / 100))}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-muted block">REFUNDS TO CLIENT</span>
                    <span className="font-semibold text-azure-600 text-sm mt-0.5 block">
                      {formatNaira(Math.round((splitDispute.amountMinor * (100 - splitProviderPct)) / 100))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-ink-2">Settlement Notes</label>
                <textarea
                  rows={3}
                  value={splitNotes}
                  onChange={(e) => setSplitNotes(e.target.value)}
                  className="w-full p-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10 resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setSplitDispute(null)}
                className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitSplitDispute}
                disabled={isSubmittingSplit}
                className="flex-1 h-10 rounded-[10px] bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                {isSubmittingSplit ? 'Settling...' : 'Execute Split Payout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: PROCESS BANK PAYOUT                                            */}
      {/* ===================================================================== */}
      {actionWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setActionWithdrawal(null)} />
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-ink">
                  {payoutDecision === 'approve' ? 'Approve Bank Payout' : 'Reject & Refund Withdrawal'}
                </h3>
                <p className="text-xs text-muted mt-0.5">{actionWithdrawal.reference} • {formatNaira(actionWithdrawal.amountMinor)}</p>
              </div>
              <button
                type="button"
                onClick={() => setActionWithdrawal(null)}
                className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-canvas/70 p-3.5 rounded-xl border border-line text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted">Beneficiary:</span>
                <span className="font-medium text-ink">{actionWithdrawal.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Destination Bank:</span>
                <span className="font-medium text-ink">{actionWithdrawal.bankName || 'Verified Bank'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Account Number:</span>
                <span className="font-mono font-medium text-ink">{actionWithdrawal.accountNumber || '••••'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Payout Sum:</span>
                <span className="font-semibold text-emerald-700">{formatNaira(actionWithdrawal.amountMinor)}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {payoutDecision === 'approve' ? (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">Bank Transfer / NIP Session Reference</label>
                  <input
                    type="text"
                    required
                    value={payoutRefInput}
                    onChange={(e) => setPayoutRefInput(e.target.value)}
                    placeholder="e.g. NIP-0902672401824190"
                    className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                  />
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-ink-2">Rejection Reason</label>
                  <textarea
                    rows={3}
                    required
                    value={payoutRejectReason}
                    onChange={(e) => setPayoutRejectReason(e.target.value)}
                    placeholder="Specify why withdrawal was rejected (e.g. Account name mismatch)..."
                    className="w-full p-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 resize-none"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2.5 pt-3 border-t border-line">
              <button
                type="button"
                onClick={() => setActionWithdrawal(null)}
                className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleProcessWithdrawal(payoutDecision)}
                disabled={isProcessingPayout}
                className={`flex-1 h-10 rounded-[10px] text-white text-xs font-medium transition-colors cursor-pointer ${
                  payoutDecision === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {isProcessingPayout ? 'Processing...' : payoutDecision === 'approve' ? 'Confirm Payout' : 'Reject & Refund'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: VERIFICATION INSPECT & REJECT                                  */}
      {/* ===================================================================== */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setSelectedCase(null)} />
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-ink">Reject Verification</h3>
                <p className="text-xs text-muted mt-0.5">{selectedCase.providerName} • {selectedCase.documentType}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-xs font-medium text-ink-2">Reason for Rejection</label>
              <textarea
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Blurred document photograph, NIN name mismatch, or expired trade license..."
                className="w-full p-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 resize-none"
              />
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleRejectCase(selectedCase.id)}
                disabled={!rejectionReason.trim()}
                className="flex-1 h-10 rounded-[10px] bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ESCROW ACTION CONFIRMATION                                     */}
      {/* ===================================================================== */}
      {actionBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setActionBooking(null)} />
          <div className="relative w-full max-w-sm bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-4 text-center">
            <div
              className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
                actionBooking.type === 'release' ? 'bg-success-50 text-success' : 'bg-rose-50 text-rose-600'
              }`}
            >
              {actionBooking.type === 'release' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>

            <div>
              <h3 className="text-base font-medium text-ink">
                {actionBooking.type === 'release' ? 'Release Escrow Vault' : 'Refund Escrow to Client'}
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Confirm {actionBooking.type === 'release' ? 'payout of' : 'refund of'}{' '}
                <span className="font-semibold text-ink">{formatNaira(actionBooking.booking.totalAmountMinor)}</span> for contract{' '}
                <span className="font-semibold text-ink">{actionBooking.booking.bookingNumber}</span>?
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setActionBooking(null)}
                className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEscrowAction}
                className={`flex-1 h-10 rounded-[10px] text-white text-xs font-medium transition-colors cursor-pointer ${
                  actionBooking.type === 'release' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: DISPUTE RESOLUTION                                             */}
      {/* ===================================================================== */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setSelectedDispute(null)} />
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-ink">Resolve {selectedDispute.disputeNumber}</h3>
                <p className="text-xs text-muted mt-0.5">{selectedDispute.bookingTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <label className="block text-xs font-medium text-ink-2">Resolution Terms &amp; Summary</label>
              <textarea
                rows={3}
                value={disputeResolutionText}
                onChange={(e) => setDisputeResolutionText(e.target.value)}
                placeholder="Enter agreed settlement terms..."
                className="w-full p-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10 resize-none"
              />
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => setSelectedDispute(null)}
                className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResolveDispute}
                disabled={!disputeResolutionText.trim()}
                className="flex-1 h-10 rounded-[10px] bg-ink hover:bg-ink-2 disabled:opacity-40 text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADMIN PROFILE (VIEW / EDIT)                                    */}
      {/* ===================================================================== */}
      {showAdminProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setShowAdminProfileModal(false)} />
          <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setShowAdminProfileModal(false)
                setIsEditingAdminProfile(false)
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-lg text-subtle hover:text-ink hover:bg-sunken flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {adminProfileSuccessNotice && (
              <Notice tone="success" onClose={() => setAdminProfileSuccessNotice(null)}>
                {adminProfileSuccessNotice}
              </Notice>
            )}

            {!isEditingAdminProfile ? (
              <>
                <div className="flex items-center gap-4">
                  <Avatar name={currentAdmin.fullName} size={54} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-medium text-ink">{currentAdmin.fullName}</h3>
                      <BadgeCheck className="w-4 h-4 text-azure" />
                    </div>
                    <p className="text-xs text-muted mt-0.5">{currentAdmin.headline || 'Lead Platform Administrator'}</p>
                    <p className="text-xs text-subtle">{currentAdmin.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-canvas/70 p-4 rounded-xl border border-line text-xs">
                  <div>
                    <span className="text-subtle block">Hub Location</span>
                    <span className="font-medium text-ink mt-0.5 block">{currentAdmin.city}, {currentAdmin.country}</span>
                  </div>
                  <div>
                    <span className="text-subtle block">Official Phone</span>
                    <span className="font-medium text-ink mt-0.5 block">{currentAdmin.phone}</span>
                  </div>
                  <div>
                    <span className="text-subtle block">Security Clearance</span>
                    <span className="font-medium text-azure mt-0.5 block">Level 4 Root Authority</span>
                  </div>
                  <div>
                    <span className="text-subtle block">Sparks Vault</span>
                    <span className="font-medium text-amber-600 mt-0.5 block">
                      {currentAdmin.wallet?.sparksBalance ?? currentAdmin.welcomeSparks ?? 500} Sparks
                    </span>
                  </div>
                </div>

                {currentAdmin.bio && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-ink-2">Administrative Scope</span>
                    <p className="text-xs text-muted leading-relaxed bg-canvas/70 p-3 rounded-xl border border-line">
                      {currentAdmin.bio}
                    </p>
                  </div>
                )}

                <div className="flex gap-2.5 pt-2">
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
                    className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdminProfileModal(false)}
                    className="flex-1 h-10 rounded-[10px] bg-ink hover:bg-ink-2 text-white text-xs font-medium cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSaveAdminProfile} className="space-y-4 text-xs">
                <div>
                  <h3 className="text-base font-medium text-ink">Edit Administrator Profile</h3>
                  <p className="text-xs text-muted mt-0.5">Update root authority record in database</p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-ink-2">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editAdminForm.fullName}
                      onChange={(e) => setEditAdminForm({ ...editAdminForm, fullName: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-ink-2">Headline / Role Title</label>
                    <input
                      type="text"
                      value={editAdminForm.headline}
                      onChange={(e) => setEditAdminForm({ ...editAdminForm, headline: e.target.value })}
                      className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-ink-2">Phone</label>
                      <input
                        type="text"
                        required
                        value={editAdminForm.phone}
                        onChange={(e) => setEditAdminForm({ ...editAdminForm, phone: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-ink-2">WhatsApp</label>
                      <input
                        type="text"
                        value={editAdminForm.whatsapp}
                        onChange={(e) => setEditAdminForm({ ...editAdminForm, whatsapp: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-ink-2">City</label>
                      <input
                        type="text"
                        value={editAdminForm.city}
                        onChange={(e) => setEditAdminForm({ ...editAdminForm, city: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-medium text-ink-2">Country</label>
                      <input
                        type="text"
                        value={editAdminForm.country}
                        onChange={(e) => setEditAdminForm({ ...editAdminForm, country: e.target.value })}
                        className="w-full h-10 px-3.5 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-ink-2">Administrative Bio</label>
                    <textarea
                      rows={3}
                      value={editAdminForm.bio}
                      onChange={(e) => setEditAdminForm({ ...editAdminForm, bio: e.target.value })}
                      className="w-full p-3 rounded-[10px] bg-surface border border-line text-sm text-ink focus:outline-none focus:border-azure focus:ring-4 focus:ring-azure/10 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => setIsEditingAdminProfile(false)}
                    className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingAdminProfile}
                    className="flex-1 h-10 rounded-[10px] bg-ink hover:bg-ink-2 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    {isSavingAdminProfile ? 'Saving...' : 'Save to Database'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: SIGN OUT CONFIRMATION                                          */}
      {/* ===================================================================== */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px] cn-fade" onClick={() => setShowLogoutModal(false)} />
          <div className="relative w-full max-w-sm bg-surface rounded-2xl shadow-[0_24px_48px_-12px_rgba(17,24,39,0.25)] border border-line cn-pop p-6 space-y-4 text-center">
            <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-medium text-ink">Sign Out of Admin Command</h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                Are you sure you want to exit? Your cryptographic session signature will be cleared.
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                disabled={isLoggingOut}
                className="flex-1 h-10 rounded-[10px] border border-line text-ink hover:bg-sunken text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAdminLogout}
                disabled={isLoggingOut}
                className="flex-1 h-10 rounded-[10px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isLoggingOut ? <Spinner className="w-4 h-4 text-white" /> : <span>Sign Out</span>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: INACTIVITY AUTO-LOCK (2 HOURS)                                 */}
      {/* ===================================================================== */}
      {inactivityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-md" />
          <div className="relative w-full max-w-md bg-surface rounded-2xl shadow-2xl border border-line cn-pop p-6 sm:p-8 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <Badge tone="warn" dot>SECURITY AUTO-LOCK</Badge>
              <h3 className="text-lg font-medium text-ink mt-2">Session Timed Out</h3>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                You have been inactive for <span className="font-semibold text-ink">2 hours</span>. For the safety of escrow funds and platform governance, your session has been securely locked.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/admin/login?reason=inactivity"
                className="w-full h-10 rounded-[10px] bg-ink hover:bg-ink-2 text-white text-xs font-medium inline-flex items-center justify-center gap-2 transition-colors"
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
