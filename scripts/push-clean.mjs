#!/usr/bin/env node
/**
 * Connecta 2.0 - Push Clean Script
 *
 * 1. Runs scripts/clear-database.mjs to wipe all users and data
 * 2. Stages and commits any changes to data/ (if modified)
 * 3. Executes `git push` to push to remote repository
 *
 * Usage:
 *   npm run push:clean
 *   node scripts/push-clean.mjs
 */

import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

console.log('\n--- Step 1: Clearing all database data and users ---')
execSync('node scripts/clear-database.mjs', { cwd: rootDir, stdio: 'inherit' })

console.log('\n--- Step 2: Checking git status for database changes ---')
const status = execSync('git status --porcelain data/', { cwd: rootDir, encoding: 'utf8' }).trim()

if (status) {
  console.log('Staging wiped database files...')
  execSync('git add data/', { cwd: rootDir, stdio: 'inherit' })
  try {
    execSync('git commit -m "chore: clear all database data and users prior to push"', { cwd: rootDir, stdio: 'inherit' })
    console.log('✓ Committed clean database state.')
  } catch (err) {
    // Nothing new to commit
  }
} else {
  console.log('✓ Database files were already clean.')
}

console.log('\n--- Step 3: Pushing changes to remote repository ---')
execSync('git push', { cwd: rootDir, stdio: 'inherit' })

console.log('\n✓ Successfully pushed clean database to remote!\n')
