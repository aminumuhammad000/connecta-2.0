import fs from 'fs'
import path from 'path'
import { cookies } from 'next/headers'

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
  role: 'customer' | 'provider'
  activeRole: 'customer' | 'provider'
  accountStatus: 'active' | 'suspended'
  country: string
  city: string
  currency: string
  avatarUrl?: string | null
  headline?: string
  bio?: string
  skills?: string[]
  hourlyRateMinor?: number
  workshopAddress?: string
  companyName?: string
  companyBio?: string
  companySize?: string
  companyWebsite?: string
  clientIndustry?: string
  clientGoal?: string
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
  type: 'deposit' | 'escrow_lock' | 'escrow_release' | 'withdrawal' | 'sparks_grant'
  amountMinor: number
  currency: string
  status: 'completed' | 'pending' | 'failed'
  reference: string
  date: string
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

export interface ServerDatabaseSchema {
  profiles: ServerUserProfile[]
  wallets: ServerUserWallet[]
  wallet_transactions: ServerWalletTransaction[]
  service_requests: ServerServiceRequest[]
  bookings: ServerBookingContract[]
  squads: ServerSquad[]
  community_posts: ServerCommunityPost[]
  disputes: ServerDispute[]
}

// =============================================================================
// PERSISTENT STORAGE MANAGER
// =============================================================================

const DB_DIR = path.resolve(process.cwd(), 'data')
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
  }
}

export function readDatabase(): ServerDatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true })
    }

    let parsed: Partial<ServerDatabaseSchema> = {}
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8')
      parsed = JSON.parse(raw)
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
    }

    // Sync from registered-users.json if profiles are missing
    const registeredUsersFile = path.join(DB_DIR, 'registered-users.json')
    if (fs.existsSync(registeredUsersFile)) {
      try {
        const rawUsers = fs.readFileSync(registeredUsersFile, 'utf-8')
        const usersList = JSON.parse(rawUsers) as any[]
        let dirty = false

        for (const u of usersList) {
          if (!db.profiles.some((p) => p.id === u.id || p.email.toLowerCase() === u.email.toLowerCase())) {
            const role = (u.role === 'provider' ? 'provider' : 'customer') as 'customer' | 'provider'
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
              headline: u.headline || (role === 'provider' ? 'Certified Specialist' : 'Hiring Client'),
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

              db.wallet_transactions.unshift({
                id: `TX-${Date.now().toString().slice(-6)}`,
                userId: u.id,
                title: 'Welcome AI Sparks Bonus',
                type: 'sparks_grant',
                amountMinor: u.welcomeSparks || defaultSparks,
                currency: 'SPARK',
                status: 'completed',
                reference: `REG-SPARK-${u.id.slice(0, 8)}`,
                date: u.createdAt || new Date().toISOString(),
              })
            }
          }
        }

        if (dirty) {
          writeDatabase(db)
        }
      } catch (err) {
        console.error('Error importing registered users:', err)
      }
    }

    return db
  } catch (err) {
    console.error('Error reading server database:', err)
    return getInitialDatabase()
  }
}

export function writeDatabase(db: ServerDatabaseSchema): void {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true })
    }
    const tempFile = `${DB_FILE}.tmp`
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8')
    fs.renameSync(tempFile, DB_FILE)
  } catch (err) {
    console.error('Error writing server database:', err)
  }
}

// =============================================================================
// SESSION & AUTH HELPERS
// =============================================================================

export const SESSION_COOKIE_NAME = 'connecta_session'

export async function getSessionUserId(): Promise<string | null> {
  try {
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

    // Record welcome bonus transaction
    db.wallet_transactions.unshift({
      id: `TX-${Date.now().toString().slice(-6)}`,
      userId,
      title: 'Welcome AI Sparks Bonus',
      type: 'sparks_grant',
      amountMinor: defaultSparks,
      currency: 'SPARK',
      status: 'completed',
      reference: `REG-SPARK-${Date.now()}`,
      date: new Date().toISOString(),
    })

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

export function getUserBookings(userId: string, role?: 'customer' | 'provider'): ServerBookingContract[] {
  const db = readDatabase()
  return db.bookings.filter((b) => {
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
