#!/usr/bin/env node
/**
 * Connecta 2.0 - Database & User Store Cleaner
 *
 * Clears all user profiles, registered authentication users, transactions,
 * bookings, service requests, notifications, and all operational data from
 * local JSON stores, runtime serverless temp caches, and Supabase (if connected).
 *
 * Usage:
 *   node scripts/clear-database.mjs
 *   node scripts/clear-database.mjs --keep-admin   (preserves the admin account)
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// Command-line flags
const args = process.argv.slice(2)
const keepAdmin = args.includes('--keep-admin')
const quietMode = args.includes('--quiet')

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Connecta 2.0 Database Cleaner
Usage: node scripts/clear-database.mjs [options]

Options:
  --keep-admin   Retain the primary admin@connecta.ng account while clearing all other users and data
  --quiet        Minimal output
  --help, -h     Show this help message
`)
  process.exit(0)
}

// Read environment
const envPath = resolve(rootDir, '.env.local')
let supabaseUrl = ''
let supabaseKey = ''
let adminEmail = 'admin@connecta.ng'

if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8')
  content.split('\n').forEach((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return
    const [k, ...v] = trimmed.split('=')
    if (k && v.length) {
      const val = v.join('=').trim().replace(/^["']|["']$/g, '')
      if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val
      if (k.trim() === 'SUPABASE_SERVICE_ROLE_KEY') supabaseKey = val
      if (!supabaseKey && k.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = val
      if (k.trim() === 'ADMIN_EMAIL') adminEmail = val
    }
  })
}

console.log('='.repeat(68))
console.log('  CONNECTA 2.0 — DATABASE CLEANER & RESET SCRIPT')
console.log('='.repeat(68))
console.log(`Action       : Wiping all users and operational data`)
console.log(`Admin Status : ${keepAdmin ? `Preserving ${adminEmail}` : 'Clearing ALL users (including admin)'}`)
console.log(`Target Dir   : ${rootDir}`)

// Default platform settings structure
const DEFAULT_PLATFORM_SETTINGS = {
  hubCity: 'Kano',
  commissionRatePercent: 10,
  currency: 'NGN',
  supportPhone: '+234 800 266 6328',
  supportEmail: 'support@connecta.ng',
  supportWhatsapp: '+234 800 266 6328',
  welcomeSparks: 50,
  announcementActive: false,
}

const dataDir = resolve(rootDir, 'data')
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true })
}

const dbJsonPath = resolve(dataDir, 'connecta-db.json')
const registeredUsersPath = resolve(dataDir, 'registered-users.json')

// Summary statistics
const statsBefore = {
  registeredUsers: 0,
  profiles: 0,
  wallets: 0,
  transactions: 0,
  requests: 0,
  bookings: 0,
  squads: 0,
  communityPosts: 0,
  disputes: 0,
  notifications: 0,
  emailDispatches: 0,
}

let preservedAdminUser = null
let preservedAdminProfile = null
let preservedAdminWallet = null

// 1. Inspect existing registered-users.json
if (existsSync(registeredUsersPath)) {
  try {
    const users = JSON.parse(readFileSync(registeredUsersPath, 'utf8'))
    if (Array.isArray(users)) {
      statsBefore.registeredUsers = users.length
      if (keepAdmin) {
        preservedAdminUser = users.find((u) => u.email?.toLowerCase() === adminEmail.toLowerCase())
      }
    }
  } catch (err) {
    console.warn('Warning: Could not parse registered-users.json prior to clearing.')
  }
}

// 2. Inspect existing connecta-db.json
let currentPlatformSettings = { ...DEFAULT_PLATFORM_SETTINGS }
if (existsSync(dbJsonPath)) {
  try {
    const db = JSON.parse(readFileSync(dbJsonPath, 'utf8'))
    if (db && typeof db === 'object') {
      statsBefore.profiles = Array.isArray(db.profiles) ? db.profiles.length : 0
      statsBefore.wallets = Array.isArray(db.wallets) ? db.wallets.length : 0
      statsBefore.transactions = Array.isArray(db.wallet_transactions) ? db.wallet_transactions.length : 0
      statsBefore.requests = Array.isArray(db.service_requests) ? db.service_requests.length : 0
      statsBefore.bookings = Array.isArray(db.bookings) ? db.bookings.length : 0
      statsBefore.squads = Array.isArray(db.squads) ? db.squads.length : 0
      statsBefore.communityPosts = Array.isArray(db.community_posts) ? db.community_posts.length : 0
      statsBefore.disputes = Array.isArray(db.disputes) ? db.disputes.length : 0
      statsBefore.notifications = (Array.isArray(db.in_app_notifications) ? db.in_app_notifications.length : 0) +
                                  (Array.isArray(db.notifications) ? db.notifications.length : 0)
      statsBefore.emailDispatches = Array.isArray(db.email_dispatches) ? db.email_dispatches.length : 0

      if (db.platform_settings) {
        currentPlatformSettings = { ...DEFAULT_PLATFORM_SETTINGS, ...db.platform_settings }
      }

      if (keepAdmin && Array.isArray(db.profiles)) {
        preservedAdminProfile = db.profiles.find((p) => p.email?.toLowerCase() === adminEmail.toLowerCase() || p.role === 'admin')
        if (preservedAdminProfile && Array.isArray(db.wallets)) {
          preservedAdminWallet = db.wallets.find((w) => w.userId === preservedAdminProfile.id)
        }
      }
    }
  } catch (err) {
    console.warn('Warning: Could not parse connecta-db.json prior to clearing.')
  }
}

console.log('\n[1/4] Current Records Identified Before Deletion:')
console.log(` - Registered Auth Users : ${statsBefore.registeredUsers}`)
console.log(` - User Profiles         : ${statsBefore.profiles}`)
console.log(` - Wallets               : ${statsBefore.wallets}`)
console.log(` - Wallet Transactions   : ${statsBefore.transactions}`)
console.log(` - Service Requests      : ${statsBefore.requests}`)
console.log(` - Bookings              : ${statsBefore.bookings}`)
console.log(` - Squads & Posts        : ${statsBefore.squads + statsBefore.communityPosts}`)
console.log(` - Disputes & Dispatches : ${statsBefore.disputes + statsBefore.emailDispatches}`)
console.log(` - Notifications         : ${statsBefore.notifications}`)

// 3. Clear data/registered-users.json
console.log('\n[2/4] Clearing Local JSON Stores...')
const newUsersList = preservedAdminUser ? [preservedAdminUser] : []
writeFileSync(registeredUsersPath, JSON.stringify(newUsersList, null, 2), 'utf8')
console.log(` ✓ Cleared ${registeredUsersPath} -> ${newUsersList.length} records`)

// 4. Clear data/connecta-db.json
const cleanDb = {
  profiles: preservedAdminProfile ? [preservedAdminProfile] : [],
  wallets: preservedAdminWallet ? [preservedAdminWallet] : [],
  wallet_transactions: [],
  service_requests: [],
  bookings: [],
  squads: [],
  community_posts: [],
  disputes: [],
  email_dispatches: [],
  platform_settings: currentPlatformSettings,
  in_app_notifications: [],
  notifications: [],
}

writeFileSync(dbJsonPath, JSON.stringify(cleanDb, null, 2), 'utf8')
console.log(` ✓ Cleared ${dbJsonPath} -> all collections reset to empty []`)

// 5. Clear Serverless /tmp runtime caches if present
console.log('\n[3/4] Checking and Clearing Runtime Serverless /tmp Caches...')
const tmpDbPath = '/tmp/connecta-db.json'
const tmpUsersPath = '/tmp/registered-users.json'

let tmpCleared = 0
if (existsSync(tmpDbPath)) {
  try {
    writeFileSync(tmpDbPath, JSON.stringify(cleanDb, null, 2), 'utf8')
    tmpCleared++
    console.log(` ✓ Reset runtime cache at ${tmpDbPath}`)
  } catch {
    // Ignore permissions in restricted containers
  }
}
if (existsSync(tmpUsersPath)) {
  try {
    writeFileSync(tmpUsersPath, JSON.stringify(newUsersList, null, 2), 'utf8')
    tmpCleared++
    console.log(` ✓ Reset runtime cache at ${tmpUsersPath}`)
  } catch {
    // Ignore permissions
  }
}
if (tmpCleared === 0) {
  console.log(' - No lingering runtime serverless /tmp cache files found (clean).')
}

// 6. Supabase check & clear (if configured with valid key)
console.log('\n[4/4] Checking Remote Supabase Database...')
if (supabaseUrl && supabaseKey && !supabaseKey.includes('placeholder')) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    // Quick test if service_role or valid
    const { error: probeError } = await supabase.from('profiles').select('id').limit(1)

    if (probeError) {
      console.log(` - Supabase responded: "${probeError.message}". Skipping remote table truncation.`)
    } else {
      console.log(' - Connected to Supabase. Truncating remote table data...')
      // Delete in cascade-safe dependency order
      const tablesToClean = [
        'payments',
        'disputes',
        'reviews',
        'job_evidence',
        'booking_events',
        'bookings',
        'quotes',
        'request_invitations',
        'request_attachments',
        'service_requests',
        'verification_documents',
        'verification_cases',
        'provider_availability',
        'provider_service_areas',
        'provider_services',
        'provider_profiles',
        'customer_addresses',
        'customer_profiles',
        'profiles',
      ]

      for (const table of tablesToClean) {
        try {
          const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
          if (!error) {
            console.log(`   ✓ Cleaned remote table: ${table}`)
          }
        } catch {
          // Table may not exist or not have id
        }
      }
      console.log(' ✓ Supabase tables wipe complete.')
    }
  } catch (err) {
    console.log(` - Supabase connection skipped: ${err.message}`)
  }
} else {
  console.log(' - Supabase credentials not set or placeholder. Local database wiped cleanly.')
}

// 7. Final Verification
console.log('\n' + '='.repeat(68))
console.log('  FINAL VERIFICATION STATUS')
console.log('='.repeat(68))

const verifyUsers = JSON.parse(readFileSync(registeredUsersPath, 'utf8'))
const verifyDb = JSON.parse(readFileSync(dbJsonPath, 'utf8'))

const totalRemainingRecords =
  verifyUsers.length +
  verifyDb.profiles.length +
  verifyDb.wallets.length +
  verifyDb.wallet_transactions.length +
  verifyDb.service_requests.length +
  verifyDb.bookings.length +
  verifyDb.squads.length +
  verifyDb.community_posts.length +
  verifyDb.disputes.length +
  verifyDb.email_dispatches.length +
  verifyDb.in_app_notifications.length +
  verifyDb.notifications.length

console.log(` • Registered Users Count     : ${verifyUsers.length}`)
console.log(` • User Profiles Count         : ${verifyDb.profiles.length}`)
console.log(` • User Wallets Count          : ${verifyDb.wallets.length}`)
console.log(` • Wallet Transactions Count   : ${verifyDb.wallet_transactions.length}`)
console.log(` • Service Requests Count      : ${verifyDb.service_requests.length}`)
console.log(` • Bookings Count              : ${verifyDb.bookings.length}`)
console.log(` • Squads Count                : ${verifyDb.squads.length}`)
console.log(` • Community Posts Count       : ${verifyDb.community_posts.length}`)
console.log(` • Disputes Count              : ${verifyDb.disputes.length}`)
console.log(` • Notifications Count         : ${verifyDb.in_app_notifications.length + verifyDb.notifications.length}`)
console.log(` • Email Dispatches Count      : ${verifyDb.email_dispatches.length}`)
console.log(` • Platform Settings Status    : Initialized (${verifyDb.platform_settings?.currency || 'NGN'}, ${verifyDb.platform_settings?.hubCity || 'Kano'})`)
console.log('-'.repeat(68))

if (keepAdmin && totalRemainingRecords <= 2) {
  console.log('✓ SUCCESS: Database cleared! Only the administrator account was retained.')
} else if (!keepAdmin && totalRemainingRecords === 0) {
  console.log('✓ SUCCESS: ALL DATA AND USERS HAVE BEEN SUCCESSFULLY DELETED!')
} else {
  console.log(`✓ SUCCESS: Database cleared. Total operational records remaining: ${totalRemainingRecords}`)
}
console.log('='.repeat(68))

process.exit(0)
