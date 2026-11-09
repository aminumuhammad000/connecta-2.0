#!/usr/bin/env node
/**
 * Connecta 2.0 - Git Hook Setup & Anti-Overwrite Shield
 * Automatically installs .git/hooks/pre-push to prevent teammates
 * from overwriting each other's work by verifying remote sync.
 */

import { writeFileSync, existsSync, chmodSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const hookDir = resolve(rootDir, '.git', 'hooks')
const prePushPath = resolve(hookDir, 'pre-push')

if (!existsSync(hookDir)) {
  console.log('No .git directory found. Skipping hook installation.')
  process.exit(0)
}

const hookContent = `#!/bin/sh
# Connecta 2.0 - Anti-Overwrite Shield (Executes Node script)
REPO_ROOT="$(git rev-parse --show-toplevel)"
node "$REPO_ROOT/scripts/safe-push-check.mjs"
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  exit $EXIT_CODE
fi
exit 0
`

writeFileSync(prePushPath, hookContent, { encoding: 'utf8', mode: 0o755 })
try {
  chmodSync(prePushPath, 0o755)
} catch {
  // Ignore permission adjustments on non-posix systems
}

console.log('✓ Connecta Anti-Overwrite Shield installed at .git/hooks/pre-push')
