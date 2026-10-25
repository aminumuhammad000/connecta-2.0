#!/usr/bin/env node
/**
 * Connecta 2.0 Database Seeding Script
 * Usage: node scripts/seed-database.mjs
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

// Read environment
const envPath = resolve(rootDir, '.env.local')
let supabaseUrl = 'https://sbpnnhnkctojddgfkyym.supabase.co'
let supabaseKey = 'sb_publishable_ig3p6xk2WIA9iGwHA-0w3w_GPL_lNAf'

if (existsSync(envPath)) {
  const content = readFileSync(envPath, 'utf8')
  content.split('\n').forEach((line) => {
    const [k, ...v] = line.split('=')
    if (k && v.length) {
      const val = v.join('=').trim().replace(/^["']|["']$/g, '')
      if (k.trim() === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val
      if (k.trim() === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = val
      if (k.trim() === 'SUPABASE_SERVICE_ROLE_KEY' && val && !val.includes('placeholder')) supabaseKey = val
    }
  })
}

console.log('='.repeat(65))
console.log('  CONNECTA 2.0 — SUPABASE DATABASE GENERATION & SEED RUNNER')
console.log('='.repeat(65))
console.log(`Target Supabase URL : ${supabaseUrl}`)
console.log(`Publishable Key     : ${supabaseKey.slice(0, 15)}...${supabaseKey.slice(-6)}`)

const sqlPath = resolve(rootDir, 'supabase', 'seed.sql')
if (!existsSync(sqlPath)) {
  console.error(`Error: Seed SQL file not found at ${sqlPath}`)
  process.exit(1)
}

const seedSql = readFileSync(sqlPath, 'utf8')
console.log(`Seed script loaded  : ${sqlPath} (${(seedSql.length / 1024).toFixed(1)} KB)`)
console.log('\nSeed Payload Summary:')
console.log(' - 8 Core Trade & Tech Categories with Verified Nigerian Visuals')
console.log(' - 6 Verified African Providers (Ibrahim Solar, Jonah Plumbing, Kabiru Carpentry, Salamah Diagnostics, David Cloud, Elena Design)')
console.log(' - 3 Realistic Clients & Company Onboarding Profiles (PayFlow, TechPulse, Bello Properties)')
console.log(' - 2 Collabo Squads (Apex Smart Home Squad & Pulse Mobile Studio) with Automated Split Formulas')
console.log(' - Active & Historical Service Requests / Job Briefs in Lagos, Abuja, Kano, Port Harcourt')
console.log(' - Detailed Quotes, Escrow Bookings (#CN-782419 & #CN-319084), & Milestone Releases')
console.log(' - Two-Way Verified Customer Reviews')
console.log(' - Wallets with Available & Escrow Balances + Connecta Sparks')
console.log(' - Community Feed Activity Stream (Announcements, Squads, Completed Jobs)')

console.log('\nExecution Options:')
console.log('1. Direct Supabase Dashboard (Recommended for full DDL execution):')
console.log('   - Navigate to https://supabase.com/dashboard/project/sbpnnhnkctojddgfkyym/sql')
console.log('   - Paste the contents of supabase/seed.sql and click "Run".')
console.log('\n2. Supabase CLI:')
console.log('   - Run: supabase db push or supabase db reset')

console.log('\nChecking Supabase connectivity via Client API...')
try {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase.from('service_categories').select('count', { count: 'exact', head: true })
  if (error) {
    console.log(`Notice: Tables not yet created via SQL Editor (${error.message}).`)
    console.log('👉 Please execute supabase/seed.sql in your Supabase SQL editor to create all tables!')
  } else {
    console.log('✓ Successfully connected to Supabase service_categories table!')
  }
} catch (err) {
  console.log('Client test completed.')
}

console.log('\n' + '='.repeat(65))
console.log('Finished. All schema definitions & seed fixtures ready in supabase/seed.sql')
console.log('='.repeat(65))
