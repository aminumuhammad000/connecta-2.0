import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

export interface StoredUser {
  id: string
  fullName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  whatsapp?: string
  password?: string
  role: 'provider' | 'customer' | 'admin'
  country: string
  city: string
  currency: string
  avatarUrl?: string | null
  businessName?: string
  headline?: string
  bio?: string
  primaryCategory?: string
  skills?: string[]
  hourlyRateMinor?: number
  ninNumber?: string
  workshopAddress?: string
  companyName?: string
  companyBio?: string
  companySize?: string
  companyWebsite?: string
  clientIndustry?: string
  clientGoal?: string
  createdAt: string
  welcomeSparks: number
}

declare global {
  // eslint-disable-next-line no-var
  var __connecta_users_cache: StoredUser[] | undefined
}

const isServerless = Boolean(
  process.env.NETLIFY ||
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  (typeof process.cwd === 'function' && process.cwd().startsWith('/var/task'))
)

const DATA_DIR = isServerless ? '/tmp' : resolve(process.cwd(), 'data')
const USERS_FILE = resolve(DATA_DIR, 'registered-users.json')
const SEED_FILE = resolve(process.cwd(), 'data', 'registered-users.json')

function ensureDirExists() {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true })
    }
  } catch (err) {
    // Graceful handling in read-only / restricted serverless environments
  }
}

export function getAllUsers(): StoredUser[] {
  if (globalThis.__connecta_users_cache && Array.isArray(globalThis.__connecta_users_cache)) {
    return globalThis.__connecta_users_cache
  }

  let users: StoredUser[] = []

  // Try reading from primary path (e.g. /tmp in serverless or local data/)
  try {
    if (existsSync(USERS_FILE)) {
      const content = readFileSync(USERS_FILE, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        users = parsed
      }
    }
  } catch {
    // Fallback to seed file or empty
  }

  // If empty and running in serverless, try loading bundled seed users
  if (users.length === 0 && isServerless) {
    try {
      if (existsSync(SEED_FILE)) {
        const content = readFileSync(SEED_FILE, 'utf-8')
        const parsed = JSON.parse(content)
        if (Array.isArray(parsed)) {
          users = parsed
        }
      }
    } catch {
      // Fallback
    }
  }

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@connecta.ng').toLowerCase().trim()
  if (!users.some((u) => u.email?.toLowerCase() === adminEmail)) {
    users.unshift({
      id: 'adm-001',
      fullName: 'Malam Aminu Danbatta',
      firstName: 'Malam Aminu',
      lastName: 'Danbatta',
      email: adminEmail,
      phone: '+2348030000001',
      whatsapp: '+2348030000001',
      password: process.env.ADMIN_PASSWORD || 'Connecta@Admin2026!',
      role: 'admin',
      country: 'Nigeria',
      city: 'Kano',
      currency: 'NGN',
      avatarUrl: '/brand/svg/connecta-icon.svg',
      businessName: 'Connecta Kano Administration',
      headline: 'Lead Platform Administrator & Escrow Supervisor',
      bio: 'Official administrator account for Connecta platform governance, trade artisan verification, and escrow administration.',
      companyName: 'Connecta Platform Administration',
      createdAt: '2026-01-01T00:00:00.000Z',
      welcomeSparks: 500,
    })
  }

  globalThis.__connecta_users_cache = users
  return users
}

export function saveUser(user: StoredUser): void {
  const users = getAllUsers().slice()
  const existingIdx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase())
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...user }
  } else {
    users.push(user)
  }

  // Always update global in-memory cache immediately
  globalThis.__connecta_users_cache = users

  // Attempt to persist to disk safely without throwing
  try {
    ensureDirExists()
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[user-store] Could not write users to disk, cached in memory:', err)
  }
}

export function findUserByEmail(email: string): StoredUser | null {
  const users = getAllUsers()
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null
}
