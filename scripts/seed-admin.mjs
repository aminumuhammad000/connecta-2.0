#!/usr/bin/env node
/**
 * Connecta 2.0 - Admin Account Seeding Script
 * 
 * Creates and seeds the administrator account for Connecta Kano Administration.
 * Ensures the administrator account is present in:
 *  - data/registered-users.json (auth user-store)
 *  - data/connecta-db.json (server database profiles & wallet)
 *  - supabase/seed.sql (PostgreSQL profiles table fixture)
 *
 * Usage: node scripts/seed-admin.mjs
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// Read environment
const envPath = resolve(rootDir, '.env.local')
let adminEmail = 'admin@connecta.ng'
let adminPassword = 'Connecta@Admin2026!'

if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8')
  content.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const [k, ...v] = trimmed.split('=')
    if (k && v.length) {
      const val = v.join('=').trim().replace(/^["']|["']$/g, '')
      if (k.trim() === 'ADMIN_EMAIL') adminEmail = val
      if (k.trim() === 'ADMIN_PASSWORD') adminPassword = val
    }
  })
}

console.log('='.repeat(65))
console.log('  CONNECTA 2.0 — ADMINISTRATOR ACCOUNT SEEDER')
console.log('='.repeat(65))
console.log(`Admin Email    : ${adminEmail}`)
console.log(`Admin Password : ${'*'.repeat(adminPassword.length)} (${adminPassword})`)
console.log(`Role           : admin`)
console.log(`Location       : Kano, Nigeria`)

const ADMIN_ID = 'adm-001'
const ADMIN_UUID = 'a1010000-0000-0000-0000-000000000000'
const FULL_NAME = 'Malam Aminu Danbatta'
const FIRST_NAME = 'Malam Aminu'
const LAST_NAME = 'Danbatta'
const PHONE = '+2348030000001'

// Ensure data directory exists
const dataDir = resolve(rootDir, 'data')
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

// 1. Seed into data/registered-users.json
const registeredUsersPath = resolve(rootDir, 'data', 'registered-users.json')
let registeredUsers = []

if (existsSync(registeredUsersPath)) {
  try {
    registeredUsers = JSON.parse(readFileSync(registeredUsersPath, 'utf8'))
  } catch (err) {
    console.warn('Could not parse registered-users.json, starting fresh array.')
  }
}

const existingUserIndex = registeredUsers.findIndex(
  (u) => u.email?.toLowerCase() === adminEmail.toLowerCase()
)

const adminRegisteredRecord = {
  id: ADMIN_ID,
  fullName: FULL_NAME,
  firstName: FIRST_NAME,
  lastName: LAST_NAME,
  email: adminEmail.toLowerCase(),
  phone: PHONE,
  whatsapp: PHONE,
  password: adminPassword,
  role: 'admin',
  country: 'Nigeria',
  city: 'Kano',
  currency: 'NGN',
  avatarUrl: '/brand/svg/connecta-icon.svg',
  businessName: 'Connecta Kano Administration',
  headline: 'Lead Platform Administrator & Escrow Supervisor',
  bio: 'Official administrator account for Connecta platform governance, trade artisan verification, and escrow administration.',
  primaryCategory: 'Platform Administration',
  skills: ['Platform Administration', 'Escrow Oversight', 'Dispute Resolution'],
  companyName: 'Connecta Platform Administration',
  createdAt: '2026-01-01T00:00:00.000Z',
  welcomeSparks: 500,
}

if (existingUserIndex >= 0) {
  registeredUsers[existingUserIndex] = {
    ...registeredUsers[existingUserIndex],
    ...adminRegisteredRecord,
  }
  console.log(`✓ Updated existing administrator record in ${registeredUsersPath}`)
} else {
  registeredUsers.push(adminRegisteredRecord)
  console.log(`✓ Inserted new administrator record into ${registeredUsersPath}`)
}

writeFileSync(registeredUsersPath, JSON.stringify(registeredUsers, null, 2), 'utf8')

// 2. Seed into data/connecta-db.json
const dbPath = resolve(rootDir, 'data', 'connecta-db.json')
try {
  let db = {
    profiles: [],
    wallets: [],
    wallet_transactions: [],
    service_requests: [],
    bookings: [],
    squads: [],
    community_posts: [],
    disputes: [],
  }
  if (existsSync(dbPath)) {
    try {
      db = JSON.parse(readFileSync(dbPath, 'utf8'))
    } catch {
      // fallback
    }
  }
  if (!Array.isArray(db.profiles)) db.profiles = []
  if (!Array.isArray(db.wallets)) db.wallets = []

    const profileIndex = db.profiles.findIndex(
      (p) => p.email?.toLowerCase() === adminEmail.toLowerCase()
    )

    const adminProfileRecord = {
      id: ADMIN_ID,
      fullName: FULL_NAME,
      firstName: FIRST_NAME,
      lastName: LAST_NAME,
      email: adminEmail.toLowerCase(),
      phone: PHONE,
      whatsapp: PHONE,
      password: adminPassword,
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
      updatedAt: new Date().toISOString(),
    }

    if (profileIndex >= 0) {
      db.profiles[profileIndex] = {
        ...db.profiles[profileIndex],
        ...adminProfileRecord,
      }
      console.log(`✓ Updated administrator profile in ${dbPath}`)
    } else {
      db.profiles.push(adminProfileRecord)
      console.log(`✓ Inserted administrator profile into ${dbPath}`)
    }

    const walletIndex = db.wallets.findIndex((w) => w.userId === ADMIN_ID)
    const adminWallet = {
      id: 'wallet-adm-001',
      userId: ADMIN_ID,
      balanceMinor: 250000000, // 2,500,000 NGN administrative testing reserve
      escrowBalanceMinor: 0,
      sparksBalance: 500,
      currency: 'NGN',
      updatedAt: new Date().toISOString(),
    }

    if (walletIndex >= 0) {
      db.wallets[walletIndex] = {
        ...db.wallets[walletIndex],
        ...adminWallet,
      }
      console.log(`✓ Updated administrator wallet in ${dbPath}`)
    } else {
      db.wallets.push(adminWallet)
      console.log(`✓ Created administrator wallet in ${dbPath}`)
    }

    writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8')
} catch (err) {
  console.error(`Failed to update ${dbPath}:`, err)
}

// 3. Ensure admin profile is in supabase/seed.sql
const seedSqlPath = resolve(rootDir, 'supabase', 'seed.sql')
if (existsSync(seedSqlPath)) {
  let seedSql = readFileSync(seedSqlPath, 'utf8')
  if (!seedSql.includes(adminEmail)) {
    const adminSqlInsert = `('${ADMIN_UUID}', '${FULL_NAME}', '${FIRST_NAME}', '${LAST_NAME}', '${adminEmail.toLowerCase()}', '${PHONE}', '${PHONE}', ARRAY['admin'::user_role], 'Kano', 'Nigeria', '/brand/svg/connecta-icon.svg'),\n`
    seedSql = seedSql.replace(
      /INSERT INTO public\.profiles \([^\)]+\) VALUES\s*\n/,
      (match) => `${match}-- Platform Administrator\n${adminSqlInsert}`
    )
    writeFileSync(seedSqlPath, seedSql, 'utf8')
    console.log(`✓ Seeded administrator profile record into ${seedSqlPath}`)
  } else {
    console.log(`✓ Supabase seed file already contains ${adminEmail}`)
  }
}

console.log('='.repeat(65))
console.log('✓ Admin account seeded successfully!')
console.log('You can now log in at /admin/login using:')
console.log(`Email    : ${adminEmail}`)
console.log(`Password : ${adminPassword}`)
console.log('='.repeat(65))
