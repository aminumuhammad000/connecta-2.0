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
  role: 'provider' | 'customer'
  country: string
  city: string
  currency: string
  avatarUrl?: string
  businessName?: string
  headline?: string
  bio?: string
  primaryCategory?: string
  skills?: string[]
  hourlyRateMinor?: number
  ninNumber?: string
  companyName?: string
  clientIndustry?: string
  createdAt: string
  welcomeSparks: number
}

const DATA_DIR = resolve(process.cwd(), 'data')
const USERS_FILE = resolve(DATA_DIR, 'registered-users.json')

function ensureFileExists() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!existsSync(USERS_FILE)) {
    writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8')
  }
}

export function getAllUsers(): StoredUser[] {
  try {
    ensureFileExists()
    const content = readFileSync(USERS_FILE, 'utf-8')
    return JSON.parse(content) || []
  } catch {
    return []
  }
}

export function saveUser(user: StoredUser): void {
  ensureFileExists()
  const users = getAllUsers()
  const existingIdx = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase())
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...user }
  } else {
    users.push(user)
  }
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

export function findUserByEmail(email: string): StoredUser | null {
  const users = getAllUsers()
  return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) || null
}
