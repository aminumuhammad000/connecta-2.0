import fs from 'fs'
import path from 'path'

// =============================================================================
// TYPES & DATA STRUCTURES
// =============================================================================

export interface ServerUserProfile {
  id: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  whatsapp?: string
  password?: string
  role: 'customer' | 'provider' | 'admin'
  activeRole: 'customer' | 'provider' | 'admin'
  accountStatus: 'active' | 'suspended'
  country: string
  city: string
  currency: string
  avatarUrl?: string | null
  businessName?: string
  headline?: string
  trade?: string
  category?: string
  primaryCategory?: string
  bio?: string
  skills?: string[]
  hourlyRateMinor?: number
  workshopAddress?: string
  neighborhood?: string
  rating?: number
  reviewCount?: number
  completedJobs?: number
  badges?: string[]
  ninNumber?: string
  experienceYears?: number
  yearsExperience?: number
  companyName?: string
  companyBio?: string
  companySize?: string
  companyWebsite?: string
  clientIndustry?: string
  clientGoal?: string
  bankName?: string
  accountNumber?: string
  accountName?: string
  welcomeSparks?: number
  isFeatured?: boolean
  badges?: string[]
  language?: 'ha' | 'en'
  propertyType?: 'residential' | 'commercial'
  availability?: 'full_time' | 'part_time' | 'emergency'
  trustTier?: 'tier1' | 'tier2' | 'certified_master'
  verificationStatus?: 'unverified' | 'verified_tier1' | 'verified_tier2' | 'certified_master' | 'verified'
  onboardingCompleted?: boolean
  workshopGeoCoordinates?: { lat: number; lng: number }
  guildAssociation?: string
  guarantorContact?: string
  createdAt: string
  updatedAt: string
}

export interface ServerUserWallet {
  id: string
  userId: string
  balanceMinor: number
  escrowBalanceMinor: number
  sparksBalance: number
  currency: string
  updatedAt: string
}

export interface ServerWalletTransaction {
  id: string
  userId: string
  title: string
  type: 'deposit' | 'escrow_lock' | 'escrow_release' | 'withdrawal' | 'sparks_grant' | 'admin_adjustment' | 'dispute_refund'
  amountMinor: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  reference: string
  date: string
  bankName?: string
  accountNumber?: string
  payoutReference?: string
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

export interface InAppNotification {
  id: string
  userId: string // 'all' or specific user ID
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'alert'
  createdAt: string
  readBy?: string[]
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
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

export interface ServerServiceRequest {
  id: string
  customerId: string
  customerName: string
  customerCompany?: string
  customerAvatar?: string
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

export interface ServerBookingContract {
  id: string
  bookingNumber: string
  requestId?: string
  customerId: string
  clientName: string
  clientCompany?: string
  clientAvatar?: string
  providerId: string
  providerName: string
  providerTitle: string
  providerAvatar?: string
  title: string
  category: string
  equipment?: string
  mediaUrl?: string
  visualAttachment?: any
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

export interface ServerSquad {
  id: string
  name: string
  tradeSpecialty: string
  hubCity: string
  description: string
  memberCount: number
  rating: number
  completedProjects: number
  revenueMinor: number
  openSlots: number
  tags: string[]
  members: string[] // user IDs
  createdAt: string
}

export interface ServerCommunityPost {
  id: string
  authorId: string
  authorName: string
  authorRole: 'specialist' | 'client' | 'admin'
  authorTitle: string
  authorAvatar?: string
  city: string
  content: string
  likesCount: number
  commentsCount: number
  tags: string[]
  createdAt: string
}

export interface ServerDispute {
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

export interface ServerEmailDispatch {
  id: string
  subject: string
  audienceType: 'all' | 'clients' | 'providers' | 'trade' | 'individual'
  targetTrade?: string
  recipientName?: string
  recipientEmail?: string
  recipientCount: number
  category: string
  message: string
  ctaText?: string
  ctaUrl?: string
  sentAt: string
  sentBy: string
  status: 'sent' | 'delivered'
}

export interface ServerNotification {
  id: string
  userId: string
  title: string
  desc: string
  category: 'milestone' | 'quote' | 'escrow' | 'payment' | 'security' | 'general'
  tone: 'azure' | 'success' | 'warn' | 'danger'
  read: boolean
  deleted?: boolean
  link?: string
  createdAt: string
  time?: string
export interface ServerWhatsAppSession {
  phone: string
  name: string
  language?: 'ha' | 'en'
  step: 'GREETING' | 'CATEGORY' | 'NEIGHBORHOOD' | 'SLOT' | 'DESCRIPTION' | 'MATCHED' | 'CHOOSE_LANGUAGE' | 'WAITING_DISPATCH'
  selectedCategory?: string
  subTrade?: string
  equipment?: string
  neighborhood?: string
  slot?: string
  description?: string
  lastActive: string
  requestId?: string
  bookingNumber?: string
  matchedArtisanId?: string
}

export interface ServerDatabaseSchema {
  profiles: ServerUserProfile[]
  wallets: ServerUserWallet[]
  wallet_transactions: ServerWalletTransaction[]
  service_requests: ServerServiceRequest[]
  bookings: ServerBookingContract[]
  squads: ServerSquad[]
  community_posts: ServerCommunityPost[]
  disputes: ServerDispute[]
  whatsapp_sessions?: ServerWhatsAppSession[]
  email_dispatches?: ServerEmailDispatch[]
  platform_settings?: PlatformSettings
  in_app_notifications?: InAppNotification[]
  notifications?: ServerNotification[]
}

// =============================================================================
// PERSISTENT STORAGE MANAGER
// =============================================================================

// =============================================================================
// PERSISTENT STORAGE MANAGER (SERVERLESS RESILIENT)
// =============================================================================

declare global {
  // eslint-disable-next-line no-var
  var __connecta_memory_db: ServerDatabaseSchema | undefined
}

const isServerless = Boolean(
  process.env.NETLIFY ||
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  (typeof process.cwd === 'function' && process.cwd().startsWith('/var/task'))
)
const DB_DIR = isServerless ? '/tmp' : path.resolve(process.cwd(), 'data')
const DB_FILE = path.join(DB_DIR, 'connecta-db.json')

function getInitialDatabase(): ServerDatabaseSchema {
  return {
    profiles: [],
    wallets: [],
    wallet_transactions: [],
    service_requests: [],
    bookings: [],
    squads: [],
    community_posts: [],
    disputes: [],
    whatsapp_sessions: [],
    email_dispatches: [],
    platform_settings: { ...DEFAULT_PLATFORM_SETTINGS },
    in_app_notifications: [],
    notifications: [],
  }
}

function getRegisteredUsersList(): any[] {
  try {
    const regPath = path.resolve(DB_DIR, 'registered-users.json')
    if (fs.existsSync(regPath)) {
      const raw = fs.readFileSync(regPath, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
    const fallbackPath = path.resolve(process.cwd(), 'data', 'registered-users.json')
    if (fs.existsSync(fallbackPath)) {
      const raw = fs.readFileSync(fallbackPath, 'utf-8')
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Graceful fallback
  }
  return []
}

export function readDatabase(): ServerDatabaseSchema {
  if (globalThis.__connecta_memory_db) {
    return globalThis.__connecta_memory_db
  }

  try {
    let parsed: Partial<ServerDatabaseSchema> = {}
    
    // Check main file
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8')
        parsed = JSON.parse(raw)
      } catch {
        // Fallback
      }
    } else {
      // Check if project data directory has a seed file
      let projectDataFile = path.resolve(process.cwd(), 'data', 'connecta-db.json')
      if (!fs.existsSync(projectDataFile)) {
        projectDataFile = path.resolve(process.cwd(), 'data', 'seed-connecta-db.json')
      }
      if (fs.existsSync(projectDataFile)) {
        try {
          const raw = fs.readFileSync(projectDataFile, 'utf-8')
          parsed = JSON.parse(raw)
        } catch {
          // Fallback
        }
      }
    }

    const db: ServerDatabaseSchema = {
      profiles: parsed.profiles || [],
      wallets: parsed.wallets || [],
      wallet_transactions: parsed.wallet_transactions || [],
      service_requests: parsed.service_requests || [],
      bookings: parsed.bookings || [],
      squads: parsed.squads || [],
      community_posts: parsed.community_posts || [],
      disputes: parsed.disputes || [],
      whatsapp_sessions: parsed.whatsapp_sessions || [],
      email_dispatches: parsed.email_dispatches || [],
      platform_settings: parsed.platform_settings || { ...DEFAULT_PLATFORM_SETTINGS },
      in_app_notifications: parsed.in_app_notifications || [],
      notifications: parsed.notifications || [],
    }

    // Sync from registered-users store if profiles are missing
    try {
      const usersList = getRegisteredUsersList()
      if (Array.isArray(usersList) && usersList.length > 0) {
        let dirty = false

        for (const u of usersList) {
          if (!db.profiles.some((p) => p.id === u.id || p.email.toLowerCase() === u.email.toLowerCase())) {
            const role = (u.role === 'admin' ? 'admin' : u.role === 'provider' ? 'provider' : 'customer') as 'customer' | 'provider' | 'admin'
            const newProfile: ServerUserProfile = {
              id: u.id,
              fullName: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || 'Connecta User',
              firstName: u.firstName || 'Connecta',
              lastName: u.lastName || 'Member',
              email: u.email,
              phone: u.phone || '+2348000000000',
              whatsapp: u.whatsapp || u.phone,
              password: u.password,
              role,
              activeRole: role,
              accountStatus: 'active',
              country: u.country || 'Nigeria',
              city: u.city || 'Kano',
              currency: u.currency || 'NGN',
              avatarUrl: u.avatarUrl || null,
              headline: u.headline || (role === 'admin' ? 'Platform Administrator' : role === 'provider' ? 'Certified Specialist' : 'Hiring Client'),
              bio: u.bio || '',
              skills: u.skills || [],
              hourlyRateMinor: u.hourlyRateMinor || 0,
              workshopAddress: u.workshopAddress,
              companyName: u.companyName || u.businessName,
              companyBio: u.companyBio,
              companySize: u.companySize,
              companyWebsite: u.companyWebsite,
              clientIndustry: u.clientIndustry,
              clientGoal: u.clientGoal,
              createdAt: u.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
            db.profiles.push(newProfile)
            dirty = true

            // Ensure wallet exists
            if (!db.wallets.some((w) => w.userId === u.id)) {
              const defaultSparks = role === 'provider' ? 10 : 25
              db.wallets.push({
                id: crypto.randomUUID(),
                userId: u.id,
                balanceMinor: 0,
                escrowBalanceMinor: 0,
                sparksBalance: u.welcomeSparks || defaultSparks,
                currency: u.currency || 'NGN',
                updatedAt: new Date().toISOString(),
              })
            }
          }
        }

        if (dirty) {
          writeDatabase(db)
        }
      }
    } catch (err) {
      console.error('Error importing registered users:', err)
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@connecta.ng').toLowerCase().trim()
    if (!db.profiles.some((p) => p.email?.toLowerCase() === adminEmail)) {
      db.profiles.unshift({
        id: 'adm-001',
        fullName: 'Malam Aminu Danbatta',
        firstName: 'Malam Aminu',
        lastName: 'Danbatta',
        email: adminEmail,
        phone: '+2348030000001',
        whatsapp: '+2348030000001',
        password: process.env.ADMIN_PASSWORD || 'Connecta@Admin2026!',
        role: 'admin',
        activeRole: 'admin',
        accountStatus: 'active',
        country: 'Nigeria',
        city: 'Kano',
        currency: 'NGN',
        avatarUrl: '/brand/svg/connecta-icon.svg',
        headline: 'Lead Platform Administrator & Escrow Supervisor',
        bio: 'Official administrator account for Connecta platform governance, trade artisan verification, and escrow administration.',
        skills: ['Platform Administration', 'Escrow Oversight', 'Dispute Resolution'],
        companyName: 'Connecta Platform Administration',
        welcomeSparks: 500,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      })
    }

    globalThis.__connecta_memory_db = db
    return db
  } catch (err) {
    console.error('Error reading server database:', err)
    const initial = getInitialDatabase()
    globalThis.__connecta_memory_db = initial
    return initial
  }
}

export function writeDatabase(db: ServerDatabaseSchema): void {
  // Always update global memory cache immediately
  globalThis.__connecta_memory_db = db

  try {
    if (!fs.existsSync(DB_DIR)) {
      try {
        fs.mkdirSync(DB_DIR, { recursive: true })
      } catch {
        // Directory create failed (read-only filesystem)
      }
    }

    try {
      const tempFile = `${DB_FILE}.tmp`
      fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8')
      fs.renameSync(tempFile, DB_FILE)
    } catch {
      // In read-only serverless environment, memory cache is maintained
    }
  } catch (err) {
    // Non-fatal error in serverless environment
  }
}

// =============================================================================
// SESSION & AUTH HELPERS
// =============================================================================

export const SESSION_COOKIE_NAME = 'connecta_session'

export async function getSessionUserId(): Promise<string | null> {
  try {
    const { cookies } = await import('next/headers')
    const cookieStore = await cookies()
    const session = cookieStore.get(SESSION_COOKIE_NAME)
    return session?.value || null
  } catch {
    return null
  }
}

export async function getActiveUser(): Promise<ServerUserProfile | null> {
  const db = readDatabase()
  const userId = await getSessionUserId()

  if (userId) {
    const user = db.profiles.find((p) => p.id === userId)
    if (user) return user
  }

  // If no cookie or user not found, use the most recently registered user
  if (db.profiles.length > 0) {
    return db.profiles[db.profiles.length - 1]
  }

  return null
}

// =============================================================================
// DATABASE OPERATIONS
// =============================================================================

export function findUserByEmail(email: string): ServerUserProfile | null {
  const db = readDatabase()
  return db.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase().trim()) || null
}

export function findUserById(id: string): ServerUserProfile | null {
  const db = readDatabase()
  return db.profiles.find((p) => p.id === id) || null
}

export function upsertUser(user: ServerUserProfile): void {
  const db = readDatabase()
  const idx = db.profiles.findIndex((p) => p.id === user.id)
  if (idx >= 0) {
    db.profiles[idx] = { ...db.profiles[idx], ...user, updatedAt: new Date().toISOString() }
  } else {
    db.profiles.push(user)
  }
  writeDatabase(db)
}

export function getOrCreateWallet(userId: string, defaultSparks = 25, currency = 'NGN'): ServerUserWallet {
  const db = readDatabase()
  let wallet = db.wallets.find((w) => w.userId === userId)
  if (!wallet) {
    wallet = {
      id: crypto.randomUUID(),
      userId,
      balanceMinor: 0,
      escrowBalanceMinor: 0,
      sparksBalance: defaultSparks,
      currency,
      updatedAt: new Date().toISOString(),
    }
    db.wallets.push(wallet)
    writeDatabase(db)
  }
  return wallet
}

export function updateWalletBalance(
  userId: string,
  balanceDeltaMinor: number,
  escrowDeltaMinor: number = 0
): ServerUserWallet | null {
  const db = readDatabase()
  const wallet = db.wallets.find((w) => w.userId === userId)
  if (!wallet) return null

  wallet.balanceMinor = Math.max(0, wallet.balanceMinor + balanceDeltaMinor)
  wallet.escrowBalanceMinor = Math.max(0, wallet.escrowBalanceMinor + escrowDeltaMinor)
  wallet.updatedAt = new Date().toISOString()
  writeDatabase(db)
  return wallet
}

export function addTransaction(tx: Omit<ServerWalletTransaction, 'id' | 'date'>): ServerWalletTransaction {
  const db = readDatabase()
  const newTx: ServerWalletTransaction = {
    ...tx,
    id: `TX-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString(),
  }
  db.wallet_transactions.unshift(newTx)
  writeDatabase(db)
  return newTx
}

export function getUserTransactions(userId: string): ServerWalletTransaction[] {
  const db = readDatabase()
  return db.wallet_transactions.filter((tx) => tx.userId === userId)
}

export function getServiceRequests(status?: string): ServerServiceRequest[] {
  const db = readDatabase()
  if (!status || status === 'all') return db.service_requests
  return db.service_requests.filter((r) => r.status === status)
}

export function addServiceRequest(req: ServerServiceRequest): ServerServiceRequest {
  const db = readDatabase()
  db.service_requests.unshift(req)
  writeDatabase(db)
  return req
}

export function getUserBookings(userId: string, role?: 'customer' | 'provider' | 'admin'): ServerBookingContract[] {
  const db = readDatabase()
  return db.bookings.filter((b) => {
    if (role === 'admin') return true
    if (role === 'provider') return b.providerId === userId
    if (role === 'customer') return b.customerId === userId
    return b.customerId === userId || b.providerId === userId
  })
}

export function addBooking(booking: ServerBookingContract): ServerBookingContract {
  const db = readDatabase()
  db.bookings.unshift(booking)
  writeDatabase(db)
  return booking
}

export function releaseMilestone(bookingId: string, milestoneId: string): boolean {
  const db = readDatabase()
  const booking = db.bookings.find((b) => b.id === bookingId)
  if (!booking) return false

  const milestone = booking.milestones.find((m) => m.id === milestoneId)
  if (!milestone || milestone.status === 'completed') return false

  milestone.status = 'completed'

  // Update progress
  const completedCount = booking.milestones.filter((m) => m.status === 'completed').length
  booking.progressPercentage = Math.round((completedCount / booking.milestones.length) * 100)

  // If next milestone exists, set to current
  const nextPending = booking.milestones.find((m) => m.status === 'pending')
  if (nextPending) {
    nextPending.status = 'current'
  }

  // Check if all completed
  if (completedCount === booking.milestones.length) {
    booking.bookingStatus = 'completed'
    booking.escrowStatus = 'released'
  } else {
    booking.escrowStatus = 'partially_released'
  }

  // Update wallets: deduct escrow from client, credit available balance to provider
  updateWalletBalance(booking.customerId, 0, -milestone.amountMinor)
  updateWalletBalance(booking.providerId, milestone.amountMinor, 0)

  // Record transactions
  addTransaction({
    userId: booking.customerId,
    title: `Escrow Released: ${milestone.title}`,
    type: 'escrow_release',
    amountMinor: milestone.amountMinor,
    currency: booking.currency,
    status: 'completed',
    reference: `REL-${milestone.id}`,
  })

  addTransaction({
    userId: booking.providerId,
    title: `Payout Received: ${milestone.title}`,
    type: 'deposit',
    amountMinor: milestone.amountMinor,
    currency: booking.currency,
    status: 'completed',
    reference: `PAY-${milestone.id}`,
  })

  writeDatabase(db)
  return true
}

export function getSquads(): ServerSquad[] {
  const db = readDatabase()
  return db.squads
}

export function addSquad(squad: ServerSquad): ServerSquad {
  const db = readDatabase()
  db.squads.unshift(squad)
  writeDatabase(db)
  return squad
}

export function joinSquad(squadId: string, userId: string): boolean {
  const db = readDatabase()
  const squad = db.squads.find((s) => s.id === squadId)
  if (!squad) return false
  if (!squad.members.includes(userId)) {
    squad.members.push(userId)
    squad.memberCount += 1
    if (squad.openSlots > 0) squad.openSlots -= 1
    writeDatabase(db)
  }
  return true
}

export function getCommunityPosts(): ServerCommunityPost[] {
  const db = readDatabase()
  return db.community_posts
}

export function addCommunityPost(post: ServerCommunityPost): ServerCommunityPost {
  const db = readDatabase()
  db.community_posts.unshift(post)
  writeDatabase(db)
  return post
}

export function getDisputes(userId?: string): ServerDispute[] {
  const db = readDatabase()
  if (!userId) return db.disputes
  return db.disputes.filter((d) => d.claimantName.includes(userId) || d.respondentName.includes(userId))
}

export function addDispute(dispute: ServerDispute): ServerDispute {
  const db = readDatabase()
  db.disputes.unshift(dispute)
  writeDatabase(db)
  return dispute
}

export function updateUserPassword(email: string, newPassword: string): boolean {
  const db = readDatabase()
  const cleanEmail = email.toLowerCase().trim()
  const user = db.profiles.find((p) => p.email.toLowerCase() === cleanEmail)
  if (!user) return false

  user.password = newPassword
  user.updatedAt = new Date().toISOString()
  writeDatabase(db)
  return true
}

// =============================================================================
// PLATFORM CONTROLS & ADMIN GOVERNANCE
// =============================================================================

export function getPlatformSettings(): PlatformSettings {
  const db = readDatabase()
  return db.platform_settings || { ...DEFAULT_PLATFORM_SETTINGS }
}

export function updatePlatformSettings(settings: Partial<PlatformSettings>): PlatformSettings {
  const db = readDatabase()
  db.platform_settings = {
    ...(db.platform_settings || DEFAULT_PLATFORM_SETTINGS),
    ...settings,
  }
  writeDatabase(db)
  return db.platform_settings
}

export function getInAppNotifications(userId?: string): InAppNotification[] {
  const db = readDatabase()
  const list = db.in_app_notifications || []
  if (!userId) return list
  return list.filter((n) => n.userId === 'all' || n.userId === userId)
}

export function addInAppNotification(notification: Omit<InAppNotification, 'id' | 'createdAt'>): InAppNotification {
  const db = readDatabase()
  if (!db.in_app_notifications) {
    db.in_app_notifications = []
  }
  const newNotif: InAppNotification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    readBy: [],
  }
  db.in_app_notifications.unshift(newNotif)
  writeDatabase(db)
  return newNotif
}

function formatFriendlyTime(isoString: string): string {
  try {
    const diffMs = Date.now() - new Date(isoString).getTime()
    if (isNaN(diffMs)) return 'Recently'
    const diffMins = Math.floor(diffMs / (1000 * 60))
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 30) return `${diffDays}d ago`
    return new Date(isoString).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
  } catch {
    return 'Recently'
  }
}

export function getNotifications(userId: string): ServerNotification[] {
  const db = readDatabase()
  if (!db.notifications) {
    db.notifications = []
  }

  // Scrub any legacy mock notifications
  if (db.notifications.some((n) => n.id.startsWith('notif-1793627936673-') || n.title.includes('Inverter Mounting') || n.desc.includes('Inverter Mounting') || n.desc.includes('Tunde Electrical'))) {
    db.notifications = db.notifications.filter(
      (n) => !n.id.startsWith('notif-1793627936673-') && !n.title.includes('Inverter Mounting') && !n.desc.includes('Inverter Mounting') && !n.desc.includes('Tunde Electrical')
    )
    writeDatabase(db)
  }

  const user = db.profiles.find((p) => p.id === userId)
  const wallet = db.wallets.find((w) => w.userId === userId)
  const transactions = db.wallet_transactions.filter((tx) => tx.userId === userId)
  const bookings = db.bookings.filter((b) => b.customerId === userId || b.providerId === userId)
  const requests = db.service_requests.filter((r) => r.customerId === userId)
  const disputes = db.disputes.filter(
    (d) => d.claimantName.includes(userId) || d.respondentName.includes(userId) || (user && d.claimantName === user.fullName)
  )
  const dispatches = (db.email_dispatches || []).filter(
    (disp) =>
      disp.audienceType === 'all' ||
      (disp.audienceType === 'clients' && user?.activeRole === 'customer') ||
      (disp.audienceType === 'providers' && user?.activeRole === 'provider') ||
      (disp.audienceType === 'trade' && disp.targetTrade === user?.trade)
  )

  const realEvents: ServerNotification[] = []

  // 1. Real Account Registration event
  if (user) {
    realEvents.push({
      id: `notif-reg-${user.id}`,
      userId,
      title: `Welcome to Connecta, ${user.firstName || user.fullName}!`,
      desc: `Your ${user.activeRole === 'provider' ? 'Trade Specialist' : 'Client'} account is active in ${user.city || 'Nigeria'}.`,
      category: 'general',
      tone: 'azure',
      read: false,
      link: user.activeRole === 'provider' ? '/dashboard/settings' : '/dashboard/jobs',
      createdAt: user.createdAt || new Date().toISOString(),
      time: formatFriendlyTime(user.createdAt || new Date().toISOString()),
    })
  }

  // 2. Real Wallet & Sparks event
  if (wallet && wallet.sparksBalance > 0) {
    realEvents.push({
      id: `notif-sparks-${wallet.id}`,
      userId,
      title: 'Sparks Balance Credited',
      desc: `${wallet.sparksBalance} Connecta Sparks available to connect with specialists and post jobs.`,
      category: 'payment',
      tone: 'success',
      read: false,
      link: '/dashboard/payment',
      createdAt: wallet.updatedAt || user?.createdAt || new Date().toISOString(),
      time: formatFriendlyTime(wallet.updatedAt || user?.createdAt || new Date().toISOString()),
    })
  }

  // 3. Real Wallet Transactions
  for (const tx of transactions) {
    const amtStr = `₦${Math.round(tx.amountMinor / 100).toLocaleString('en-NG')}`
    let title = tx.title || 'Transaction'
    let desc = `${amtStr} (${tx.status}) - Ref: ${tx.reference}`
    let tone: ServerNotification['tone'] = 'azure'
    let category: ServerNotification['category'] = 'payment'
    let link = '/dashboard/payment'

    if (tx.type === 'deposit') {
      title = 'Wallet Deposit Confirmed'
      desc = `${amtStr} funded into your Connecta wallet balance (Ref: ${tx.reference}).`
      tone = 'success'
      category = 'payment'
    } else if (tx.type === 'escrow_lock') {
      title = 'Funds Secured in Escrow'
      desc = `${amtStr} placed into Connecta Escrow Vault for project security.`
      tone = 'warn'
      category = 'escrow'
    } else if (tx.type === 'escrow_release') {
      title = 'Milestone Escrow Released'
      desc = `${amtStr} released from Escrow Vault.`
      tone = 'success'
      category = 'milestone'
      link = '/dashboard/projects'
    } else if (tx.type === 'withdrawal') {
      title = `Withdrawal ${tx.status === 'completed' ? 'Completed' : 'Pending'}`
      desc = `${amtStr} payout to registered bank account.`
      tone = tx.status === 'completed' ? 'success' : 'warn'
    } else if (tx.type === 'sparks_grant') {
      title = 'Sparks Bonus Credited'
      desc = `${tx.amountMinor} Sparks added to your account.`
      tone = 'success'
    }

    realEvents.push({
      id: `notif-tx-${tx.id}`,
      userId,
      title,
      desc,
      category,
      tone,
      read: false,
      link,
      createdAt: tx.date || new Date().toISOString(),
      time: formatFriendlyTime(tx.date || new Date().toISOString()),
    })
  }

  // 4. Real Bookings & Contracts
  for (const b of bookings) {
    const amtStr = `₦${Math.round(b.totalAmountMinor / 100).toLocaleString('en-NG')}`
    realEvents.push({
      id: `notif-booking-${b.id}`,
      userId,
      title: `Contract #${b.bookingNumber}: ${b.title}`,
      desc: `Status: ${b.bookingStatus.replace('_', ' ')}. Total contract value: ${amtStr} with escrow ${b.escrowStatus}.`,
      category: 'milestone',
      tone: b.bookingStatus === 'completed' ? 'success' : b.escrowStatus === 'locked' ? 'warn' : 'azure',
      read: false,
      link: '/dashboard/projects',
      createdAt: b.createdAt || new Date().toISOString(),
      time: formatFriendlyTime(b.createdAt || new Date().toISOString()),
    })
  }

  // 5. Real Service Requests
  for (const r of requests) {
    realEvents.push({
      id: `notif-req-${r.id}`,
      userId,
      title: `Service Request: ${r.title}`,
      desc: `Your request in ${r.city} is ${r.status} with ${r.proposalsCount || 0} quotes received.`,
      category: 'quote',
      tone: 'azure',
      read: false,
      link: '/dashboard/jobs',
      createdAt: r.createdAt || new Date().toISOString(),
      time: formatFriendlyTime(r.createdAt || new Date().toISOString()),
    })
  }

  // 6. Real Disputes
  for (const d of disputes) {
    realEvents.push({
      id: `notif-disp-${d.id}`,
      userId,
      title: `Support Dispute #${d.disputeNumber}`,
      desc: `Status: ${d.status.replace('_', ' ')} for "${d.bookingTitle}".`,
      category: 'security',
      tone: 'warn',
      read: false,
      link: '/dashboard/support',
      createdAt: d.filedDate || new Date().toISOString(),
      time: formatFriendlyTime(d.filedDate || new Date().toISOString()),
    })
  }

  // 7. Real Platform Notices
  for (const disp of dispatches) {
    const created = disp.sentAt.includes('T') ? disp.sentAt : new Date(disp.sentAt).toISOString()
    realEvents.push({
      id: `notif-email-${disp.id}`,
      userId,
      title: `Platform Notice: ${disp.subject}`,
      desc: disp.message,
      category: 'general',
      tone: 'azure',
      read: false,
      link: disp.ctaUrl || '/dashboard',
      createdAt: created,
      time: formatFriendlyTime(created),
    })
  }

  // Merge with existing notifications in DB
  let dirty = false
  for (const ev of realEvents) {
    const existing = db.notifications.find((n) => n.id === ev.id && n.userId === userId)
    if (!existing) {
      db.notifications.push(ev)
      dirty = true
    }
  }

  if (dirty) {
    writeDatabase(db)
  }

  // Return active (non-deleted) notifications for this user, sorted newest first
  return db.notifications
    .filter((n) => n.userId === userId && !n.deleted)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function addNotification(
  notif: Omit<ServerNotification, 'id' | 'createdAt'> & { id?: string; createdAt?: string }
): ServerNotification {
  const db = readDatabase()
  if (!db.notifications) {
    db.notifications = []
  }

  const newNotif: ServerNotification = {
    id: notif.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: notif.createdAt || new Date().toISOString(),
    userId: notif.userId,
    title: notif.title,
    desc: notif.desc,
    category: notif.category,
    tone: notif.tone,
    read: notif.read ?? false,
    deleted: false,
    link: notif.link,
    time: notif.time || 'Just now',
  }

  db.notifications.unshift(newNotif)
  writeDatabase(db)
  return newNotif
}

export function getPendingWithdrawals(): ServerWalletTransaction[] {
  const db = readDatabase()
  return db.wallet_transactions.filter((tx) => tx.type === 'withdrawal' && tx.status === 'pending')
}

export function approveWithdrawal(txId: string, payoutReference: string): boolean {
  const db = readDatabase()
  const tx = db.wallet_transactions.find((t) => t.id === txId)
  if (!tx || tx.type !== 'withdrawal') return false

  tx.status = 'completed'
  tx.payoutReference = payoutReference || `PAY-OUT-${Date.now().toString().slice(-6)}`
  tx.date = new Date().toISOString()
  writeDatabase(db)

  // Push an in-app notification to the user
  addInAppNotification({
    userId: tx.userId,
    title: 'Bank Withdrawal Approved',
    message: `Your withdrawal of ₦${Math.round(tx.amountMinor / 100).toLocaleString('en-NG')} has been processed to your bank (Ref: ${tx.payoutReference}).`,
    type: 'success',
  })

  return true
}

export function rejectWithdrawal(txId: string, reason: string): boolean {
  const db = readDatabase()
  const tx = db.wallet_transactions.find((t) => t.id === txId)
  if (!tx || tx.type !== 'withdrawal') return false

  tx.status = 'failed'
  writeDatabase(db)

  // Refund the amount back to user available wallet
  updateWalletBalance(tx.userId, tx.amountMinor, 0)

  // Add refund record
  addTransaction({
    userId: tx.userId,
    title: `Withdrawal Refund: ${reason || 'Bank payout rejected'}`,
    type: 'deposit',
    amountMinor: tx.amountMinor,
    currency: tx.currency || 'NGN',
    status: 'completed',
    reference: `REF-${Date.now().toString().slice(-8)}`,
  })

  // Push an in-app notification to the user
  addInAppNotification({
    userId: tx.userId,
    title: 'Withdrawal Unsuccessful — Funds Returned',
    message: `Your withdrawal of ₦${Math.round(tx.amountMinor / 100).toLocaleString('en-NG')} could not be processed (${reason}). The funds have been returned to your vault.`,
    type: 'warning',
  })

  return true
}

export function settleDisputeWithSplit(
  disputeId: string,
  providerPercent: number,
  clientPercent: number,
  resolutionNotes: string
): boolean {
  const db = readDatabase()
  const dispute = db.disputes.find((d) => d.id === disputeId)
  if (!dispute) return false

  const booking = db.bookings.find((b) => b.id === dispute.bookingId || b.bookingNumber === dispute.bookingNumber)
  const totalAmountMinor = dispute.amountMinor || (booking ? booking.totalAmountMinor : 0)

  const providerAmountMinor = Math.round((totalAmountMinor * providerPercent) / 100)
  const clientAmountMinor = totalAmountMinor - providerAmountMinor

  // If there is an associated booking with locked escrow
  if (booking) {
    booking.escrowStatus = 'released'
    booking.bookingStatus = clientPercent === 100 ? 'disputed' : 'completed'
    booking.progressPercentage = 100

    if (booking.milestones) {
      booking.milestones.forEach((m) => {
        m.status = 'completed'
      })
    }

    // Deduct total locked escrow from client's escrow balance
    updateWalletBalance(booking.customerId, 0, -totalAmountMinor)

    // Credit client refund if any
    if (clientAmountMinor > 0) {
      updateWalletBalance(booking.customerId, clientAmountMinor, 0)
      addTransaction({
        userId: booking.customerId,
        title: `Dispute Resolution Refund (${clientPercent}%) — ${dispute.disputeNumber}`,
        type: 'dispute_refund',
        amountMinor: clientAmountMinor,
        currency: booking.currency || 'NGN',
        status: 'completed',
        reference: `DISP-REF-${Date.now().toString().slice(-6)}`,
      })
      addInAppNotification({
        userId: booking.customerId,
        title: 'Dispute Resolved — Refund Credited',
        message: `Dispute ${dispute.disputeNumber} was resolved. ₦${Math.round(clientAmountMinor / 100).toLocaleString('en-NG')} (${clientPercent}%) has been credited to your available vault.`,
        type: 'info',
      })
    }

    // Credit provider payout if any
    if (providerAmountMinor > 0) {
      updateWalletBalance(booking.providerId, providerAmountMinor, 0)
      addTransaction({
        userId: booking.providerId,
        title: `Dispute Settlement Payout (${providerPercent}%) — ${dispute.disputeNumber}`,
        type: 'escrow_release',
        amountMinor: providerAmountMinor,
        currency: booking.currency || 'NGN',
        status: 'completed',
        reference: `DISP-PAY-${Date.now().toString().slice(-6)}`,
      })
      addInAppNotification({
        userId: booking.providerId,
        title: 'Dispute Settlement Credited',
        message: `Dispute ${dispute.disputeNumber} was resolved. ₦${Math.round(providerAmountMinor / 100).toLocaleString('en-NG')} (${providerPercent}%) has been credited to your payout balance.`,
        type: 'success',
      })
    }
  }

  dispute.status = 'resolved'
  dispute.notes += ` [Split Resolution: ${providerPercent}% Specialist / ${clientPercent}% Client]: ${resolutionNotes}`
  dispute.lastUpdate = new Date().toISOString().replace('T', ' ').slice(0, 16)
  writeDatabase(db)
  return true
}

export function adjustUserBalance(
  userId: string,
  balanceDeltaMinor: number,
  sparksDelta: number,
  reason: string
): boolean {
  const db = readDatabase()
  const wallet = db.wallets.find((w) => w.userId === userId)
  if (!wallet) return false

  wallet.balanceMinor = Math.max(0, wallet.balanceMinor + balanceDeltaMinor)
  wallet.sparksBalance = Math.max(0, wallet.sparksBalance + sparksDelta)
  wallet.updatedAt = new Date().toISOString()

  // Add ledger transaction
  if (balanceDeltaMinor !== 0) {
    db.wallet_transactions.unshift({
      id: `TX-ADJ-${Date.now().toString().slice(-6)}`,
      userId,
      title: `Admin Adjustment: ${reason || 'Manual ledger balance adjustment'}`,
      type: 'admin_adjustment',
      amountMinor: Math.abs(balanceDeltaMinor),
      currency: wallet.currency || 'NGN',
      status: 'completed',
      reference: `ADJ-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
    })
  }

  if (sparksDelta !== 0) {
    db.wallet_transactions.unshift({
      id: `TX-SPK-${Date.now().toString().slice(-6)}`,
      userId,
      title: `Sparks Reward Adjustment: ${reason || 'Promotional reward bonus'}`,
      type: 'sparks_grant',
      amountMinor: Math.abs(sparksDelta),
      currency: 'SPARK',
      status: 'completed',
      reference: `SPK-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
    })
  }

  writeDatabase(db)

  // Notify user
  addInAppNotification({
    userId,
    title: 'Vault Balance Adjusted',
    message: `Your account was adjusted by ${balanceDeltaMinor >= 0 ? '+' : '-'}₦${Math.round(Math.abs(balanceDeltaMinor) / 100).toLocaleString('en-NG')}${sparksDelta !== 0 ? ` and ${sparksDelta >= 0 ? '+' : ''}${sparksDelta} Sparks` : ''}. Reason: ${reason || 'Administrative adjustment'}`,
    type: balanceDeltaMinor >= 0 ? 'success' : 'info',
  })

  return true
}

export function toggleFeaturedProvider(providerId: string, isFeatured?: boolean): boolean {
  const db = readDatabase()
  const profile = db.profiles.find((p) => p.id === providerId)
  if (!profile) return false

  profile.isFeatured = typeof isFeatured === 'boolean' ? isFeatured : !profile.isFeatured
  profile.updatedAt = new Date().toISOString()
  writeDatabase(db)
  return true
}

export function moderateServiceRequest(
  requestId: string,
  status: ServerServiceRequest['status'],
  updates?: Partial<ServerServiceRequest>
): boolean {
  const db = readDatabase()
  const req = db.service_requests.find((r) => r.id === requestId)
  if (!req) return false

  req.status = status
  if (updates) {
    if (updates.title) req.title = updates.title
    if (updates.description) req.description = updates.description
    if (updates.budgetMinMinor) req.budgetMinMinor = updates.budgetMinMinor
    if (updates.budgetMaxMinor) req.budgetMaxMinor = updates.budgetMaxMinor
    if (updates.category) req.category = updates.category
  }
  writeDatabase(db)
  return true
}

export function markNotificationRead(firstArg: string, secondArg?: string): boolean {
  const db = readDatabase()
  let modified = false

  let userId = firstArg
  let notificationId = secondArg

  if (firstArg && firstArg.startsWith('notif-') && secondArg) {
    notificationId = firstArg
    userId = secondArg
  }

  if (db.in_app_notifications) {
    for (const n of db.in_app_notifications) {
      if (!notificationId || n.id === notificationId) {
        if (!n.readBy) n.readBy = []
        if (userId && !n.readBy.includes(userId)) {
          n.readBy.push(userId)
          modified = true
        }
      }
    }
  }

  if (db.notifications) {
    for (const n of db.notifications) {
      if ((!userId || n.userId === userId) && !n.deleted) {
        if (!notificationId || n.id === notificationId) {
          if (!n.read) {
            n.read = true
            modified = true
          }
        }
      }
    }
  }

  if (modified) {
    writeDatabase(db)
  }
  return modified
}

export function deleteNotification(userId: string, notificationId: string): boolean {
  const db = readDatabase()
  if (!db.notifications) return false

  let modified = false
  for (const n of db.notifications) {
    if (n.userId === userId && n.id === notificationId) {
      n.deleted = true
      modified = true
    }
  }

  if (modified) {
    writeDatabase(db)
    return true
  }
  return false
}

export function clearNotifications(userId: string, onlyRead = false): boolean {
  const db = readDatabase()
  if (!db.notifications) return false

  let modified = false
  for (const n of db.notifications) {
    if (n.userId === userId && !n.deleted) {
      if (!onlyRead || n.read) {
        n.deleted = true
        modified = true
      }
    }
  }

  if (modified) {
    writeDatabase(db)
    return true
  }
  return false
}

// =============================================================================
// WHATSAPP PERSISTENCE & INTAKE ORDER ENGINE
// =============================================================================

export function getWhatsAppSession(phone: string): ServerWhatsAppSession | null {
  const db = readDatabase()
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  return db.whatsapp_sessions?.find((s) => s.phone.replace(/[^0-9]/g, '') === cleanPhone) || null
}

export function saveWhatsAppSession(session: ServerWhatsAppSession): ServerWhatsAppSession {
  const db = readDatabase()
  if (!db.whatsapp_sessions) db.whatsapp_sessions = []
  const cleanPhone = session.phone.replace(/[^0-9]/g, '')
  const idx = db.whatsapp_sessions.findIndex((s) => s.phone.replace(/[^0-9]/g, '') === cleanPhone)
  const updated: ServerWhatsAppSession = {
    ...session,
    phone: cleanPhone,
    lastActive: new Date().toISOString(),
  }
  if (idx >= 0) {
    db.whatsapp_sessions[idx] = updated
  } else {
    db.whatsapp_sessions.push(updated)
  }
  writeDatabase(db)
  return updated
}

export function getOrCreateWhatsAppCustomer(phone: string, name = 'WhatsApp Customer'): ServerUserProfile {
  const db = readDatabase()
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  let user = db.profiles.find((p) => (p.whatsapp || p.phone || '').replace(/[^0-9]/g, '') === cleanPhone)
  if (!user) {
    user = {
      id: `usr_wa_${cleanPhone}`,
      fullName: name,
      firstName: name.split(' ')[0] || 'Customer',
      lastName: name.split(' ').slice(1).join(' ') || '',
      email: `${cleanPhone}@whatsapp.myconnecta.ng`,
      phone: `+${cleanPhone}`,
      whatsapp: `+${cleanPhone}`,
      role: 'customer',
      activeRole: 'customer',
      accountStatus: 'active',
      country: 'Nigeria',
      city: 'Kano',
      currency: 'NGN',
      headline: 'WhatsApp Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    db.profiles.push(user)
    getOrCreateWallet(user.id, 25, 'NGN')
    writeDatabase(db)
  }
  return user
}

export function findMatchingArtisans(
  category: string,
  neighborhood?: string,
  subTrade?: string,
  equipment?: string
): ServerUserProfile[] {
  const db = readDatabase()
  const providers = db.profiles.filter((p) => p.role === 'provider' && (p.city || '').toLowerCase() === 'kano')

  const lowerCat = (category || '').toLowerCase()
  const lowerSub = (subTrade || '').toLowerCase()
  const lowerEquip = (equipment || '').toLowerCase()
  const lowerHood = (neighborhood || '').toLowerCase()

  // Normalize canonical category across Hausa and English
  let canonicalCat = ''
  if (lowerCat.includes('solar') || lowerCat.includes('batir') || lowerCat.includes('inverter') || lowerCat.includes('inbata')) canonicalCat = 'solar'
  else if (lowerCat.includes('gen') || lowerCat.includes('inji') || lowerCat.includes('fetur') || lowerCat.includes('dizal') || lowerCat.includes('mikano')) canonicalCat = 'generator'
  else if (lowerCat.includes('ac') || lowerCat.includes('firiji') || lowerCat.includes('fridge') || lowerCat.includes('cooling') || lowerCat.includes('sanyi')) canonicalCat = 'ac'
  else if (lowerCat.includes('elec') || lowerCat.includes('waya') || lowerCat.includes('lantarki') || lowerCat.includes('wuta')) canonicalCat = 'electrical'
  else if (lowerCat.includes('plumb') || lowerCat.includes('famfo') || lowerCat.includes('ruwa') || lowerCat.includes('borehole') || lowerCat.includes('tanka')) canonicalCat = 'plumbing'

  // Score each artisan using the multi-factor matching formula
  const scored = providers.map((artisan) => {
    const trade = (artisan.trade || artisan.category || artisan.primaryCategory || '').toLowerCase()
    const headline = (artisan.headline || '').toLowerCase()
    const bio = (artisan.bio || '').toLowerCase()
    const skills = (artisan.skills || []).map((s) => s.toLowerCase()).join(' ')
    const artisanHood = (artisan.neighborhood || artisan.workshopAddress || '').toLowerCase()
    const artisanAllText = `${trade} ${headline} ${bio} ${skills}`

    // 1. Trade & Sub-trade Affinity (35%)
    let tradeAffinity = 0.0
    let isCategoryMatch = false

    if (canonicalCat === 'solar' && (trade.includes('solar') || trade.includes('inverter') || headline.includes('solar') || headline.includes('inverter'))) isCategoryMatch = true
    else if (canonicalCat === 'generator' && (trade.includes('gen') || trade.includes('diesel') || trade.includes('lister') || headline.includes('gen'))) isCategoryMatch = true
    else if (canonicalCat === 'ac' && (trade.includes('ac') || trade.includes('cooling') || trade.includes('refriger') || headline.includes('cooling'))) isCategoryMatch = true
    else if (canonicalCat === 'electrical' && (trade.includes('electr') || trade.includes('wiring') || headline.includes('electric') || headline.includes('wiring'))) isCategoryMatch = true
    else if (canonicalCat === 'plumbing' && (trade.includes('plumb') || trade.includes('water') || trade.includes('pipe') || trade.includes('famfo') || headline.includes('plumb'))) isCategoryMatch = true

    if (isCategoryMatch) {
      tradeAffinity = 0.70
      // Boost if artisan specialized in the exact sub-trade or equipment
      if (lowerSub && (skills.includes(lowerSub) || headline.includes(lowerSub) || bio.includes(lowerSub))) {
        tradeAffinity += 0.20
      }
      if (lowerEquip && (skills.includes(lowerEquip) || headline.includes(lowerEquip) || bio.includes(lowerEquip))) {
        tradeAffinity += 0.10
      }
    } else {
      tradeAffinity = 0.05 // Strict non-match penalty
    }

    // 2. Proximity & Kano Neighborhood Clustering (30%)
    let proximity = 0.30
    if (lowerHood && artisanHood) {
      const hoodClean = lowerHood.split(' ')[0]
      if (artisanHood.includes(hoodClean)) {
        proximity = 1.0 // Exact neighborhood match
      } else if (
        (lowerHood.includes('nassarawa') && artisanHood.includes('fagge')) ||
        (lowerHood.includes('tarauni') && artisanHood.includes('municipal')) ||
        (lowerHood.includes('dala') && artisanHood.includes('gwale'))
      ) {
        proximity = 0.75 // Neighboring cluster
      } else {
        proximity = 0.50 // Metropolitan Kano
      }
    }

    // 3. Availability & Active Status (20%)
    const availability = artisan.accountStatus === 'active' ? 1.0 : 0.4

    // 4. Reputation & Escrow Track Record (15%)
    const ratingScore = Math.min((artisan.rating || 4.8) / 5.0, 1.0)

    const finalScore =
      tradeAffinity * 0.35 +
      proximity * 0.30 +
      availability * 0.20 +
      ratingScore * 0.15

    return { artisan, score: finalScore }
  })

  // Sort by highest weighted match score
  scored.sort((a, b) => b.score - a.score)
  return scored.map((s) => s.artisan)
}

export function createWhatsAppOrder(params: {
  phone: string
  name: string
  category: string
  neighborhood: string
  description: string
  slot?: string
  subTrade?: string
  equipment?: string
  visualAttachment?: any
}): { serviceRequest: ServerServiceRequest; booking: ServerBookingContract; artisan: ServerUserProfile } {
  const customer = getOrCreateWhatsAppCustomer(params.phone, params.name)
  const matchedArtisans = findMatchingArtisans(
    params.category,
    params.neighborhood,
    params.subTrade,
    params.equipment
  )
  const artisan = matchedArtisans[0] || customer

  const trackingNum = Math.floor(1000 + Math.random() * 9000)
  const bookingNumber = `CN-KN-${trackingNum}`
  const requestId = `req_${Date.now()}`
  const bookingId = `book_${Date.now()}`

  const slotLabel = params.slot || 'Immediate'

  const serviceRequest: ServerServiceRequest = {
    id: requestId,
    customerId: customer.id,
    customerName: customer.fullName,
    title: `${params.category} Service in ${params.neighborhood} (${slotLabel})`,
    category: params.category,
    categorySlug: params.category.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    description: params.description,
    urgency: slotLabel.toLowerCase().includes('yanzu') || slotLabel.toLowerCase().includes('immediate') ? 'emergency' : 'today',
    serviceMode: 'onsite',
    city: 'Kano',
    state: 'Kano State',
    budgetMinMinor: 500000, // ₦5,000 diagnostic
    budgetMaxMinor: 2500000,
    currency: 'NGN',
    status: 'matching',
    requiredSkills: artisan.skills || [],
    proposalsCount: 1,
    createdAt: new Date().toISOString(),
  }

  const booking: ServerBookingContract = {
    id: bookingId,
    bookingNumber,
    requestId,
    customerId: customer.id,
    clientName: customer.fullName,
    providerId: artisan.id,
    providerName: artisan.fullName,
    providerTitle: artisan.headline || 'Certified Specialist',
    providerAvatar: artisan.avatarUrl || undefined,
    title: `${params.category} Diagnostic & Repair`,
    category: params.category,
    equipment: params.equipment || params.visualAttachment?.equipmentIdentified,
    mediaUrl: params.visualAttachment?.mediaUrl,
    visualAttachment: params.visualAttachment,
    location: `${params.neighborhood}, Kano`,
    totalAmountMinor: 500000, // ₦5,000 diagnostic callout fee in escrow
    currency: 'NGN',
    escrowStatus: 'locked',
    bookingStatus: 'pending',
    progressPercentage: 0,
    appointmentDate: slotLabel,
    milestones: [
      { id: 'm1', title: 'Onsite Diagnostics & Fault Isolation', amountMinor: 500000, status: 'current' },
      { id: 'm2', title: 'Repair Completion & Verification', amountMinor: 0, status: 'pending' },
    ],
    createdAt: new Date().toISOString(),
  }

  addServiceRequest(serviceRequest)
  addBooking(booking)

  saveWhatsAppSession({
    phone: params.phone,
    name: params.name,
    step: 'MATCHED',
    selectedCategory: params.category,
    neighborhood: params.neighborhood,
    description: params.description,
    lastActive: new Date().toISOString(),
    requestId,
    bookingNumber,
    matchedArtisanId: artisan.id,
  })

  return { serviceRequest, booking, artisan }
}

export function getBookingByNumber(bookingNumber: string): ServerBookingContract | null {
  const db = readDatabase()
  return db.bookings.find((b) => b.bookingNumber === bookingNumber) || null
}

export function updateBooking(bookingNumber: string, updates: Partial<ServerBookingContract>): ServerBookingContract | null {
  const db = readDatabase()
  const idx = db.bookings.findIndex((b) => b.bookingNumber === bookingNumber)
  if (idx >= 0) {
    db.bookings[idx] = { ...db.bookings[idx], ...updates }
    writeDatabase(db)
    return db.bookings[idx]
  }
  return null
}
>>>>>>> feature/kano-vernacular-escrow
