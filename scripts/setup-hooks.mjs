#!/usr/bin/env node
/**
 * Connecta 2.0 - Git Hook Setup
 * Ensures the pre-push hook is installed and executable in .git/hooks/pre-push.
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

const hookContent = `#!/usr/bin/env bash
# Connecta 2.0 - Git Pre-Push Hook
# Automatically clears all data and users in the database when pushing changes.

echo ""
echo "=================================================================="
echo "  [GIT PRE-PUSH] TRIGGERED: CLEARING ALL DATABASE DATA & USERS"
echo "=================================================================="

REPO_ROOT="$(git rev-parse --show-toplevel)"
node "$REPO_ROOT/scripts/clear-database.mjs"

EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "❌ Failed to clear database. Aborting push." >&2
  exit 1
fi

echo "✓ Pre-push hook finished successfully. Proceeding with push."
echo ""
`

writeFileSync(prePushPath, hookContent, { encoding: 'utf8', mode: 0o755 })
try {
  chmodSync(prePushPath, 0o755)
} catch {
  // Ignore permission adjustments on non-posix systems
}

console.log('✓ Connecta git pre-push hook installed at .git/hooks/pre-push')
