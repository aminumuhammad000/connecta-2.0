#!/usr/bin/env node
/**
 * Connecta 2.0 - Safe Push Check & Team Anti-Overwrite Shield
 * Checks if remote repository has new commits before allowing push.
 */

import { execSync } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

console.log('\n==================================================================')
console.log('  [CONNECTA SHIELD] VALIDATING TEAM SYNC BEFORE PUSH...')
console.log('==================================================================\n')

try {
  // Fetch latest changes from remote silently
  execSync('git fetch origin --quiet', { cwd: rootDir, stdio: 'ignore' })
} catch (e) {
  // If offline or network issue, skip remote check
}

try {
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: rootDir, encoding: 'utf8' }).trim()

  // Check if remote tracking ref exists
  let remoteRefExists = false
  try {
    execSync(`git show-ref --quiet --verify refs/remotes/origin/${currentBranch}`, { cwd: rootDir, stdio: 'ignore' })
    remoteRefExists = true
  } catch {
    remoteRefExists = false
  }

  if (remoteRefExists) {
    const behindCount = parseInt(
      execSync(`git rev-list --count HEAD..origin/${currentBranch}`, { cwd: rootDir, encoding: 'utf8' }).trim(),
      10
    )

    if (behindCount > 0) {
      console.error(`❌ [PUSH BLOCKED]: Your branch is behind origin/${currentBranch} by ${behindCount} commit(s)!`)
      console.error(`   Teammates have pushed updates to GitHub that you do not have locally.\n`)
      console.error(`   👉 TO RESOLVE SAFELY, RUN:`)
      console.error(`       git pull origin ${currentBranch}\n`)
      console.error(`   Never force push. Pulling first prevents overwriting your team's code.`)
      console.error('==================================================================\n')
      process.exit(1)
    }
  }

  console.log(`✓ Local branch '${currentBranch}' is fully up to date with origin.`)
  console.log('✓ Shield check passed. Safe to push.\n==================================================================\n')
  process.exit(0)
} catch (err) {
  if (err.status === 1) process.exit(1)
  process.exit(0)
}
