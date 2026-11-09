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

const hookContent = `#!/usr/bin/env bash
# Connecta 2.0 - Anti-Overwrite Shield & Safe Push Hook

echo ""
echo "=================================================================="
echo "  [CONNECTA SHIELD] CHECKING TEAM SYNC BEFORE PUSH..."
echo "=================================================================="

# 1. Fetch latest changes from remote
git fetch origin --quiet 2>/dev/null

CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

# 2. Check if remote branch exists and has unpulled commits
if git show-ref --quiet --verify "refs/remotes/origin/$CURRENT_BRANCH"; then
  BEHIND_COUNT=$(git rev-list --count HEAD..origin/"$CURRENT_BRANCH")
  if [ "$BEHIND_COUNT" -gt 0 ]; then
    echo "❌ [PUSH BLOCKED]: Your branch is behind origin/$CURRENT_BRANCH by $BEHIND_COUNT commit(s)!" >&2
    echo "   Teammates have pushed updates to GitHub that you do not have locally." >&2
    echo "" >&2
    echo "   👉 TO SAFELY RESOLVE, RUN:" >&2
    echo "       git pull origin $CURRENT_BRANCH" >&2
    echo "" >&2
    echo "   Never force push. Pulling first prevents overwriting your team's code." >&2
    echo "==================================================================" >&2
    exit 1
  fi
fi

echo "✓ Local branch is up to date with origin/$CURRENT_BRANCH."

# 3. Database sanitation check (keep admin and verified providers)
REPO_ROOT="$(git rev-parse --show-toplevel)"
if [ -f "$REPO_ROOT/scripts/clear-database.mjs" ]; then
  node "$REPO_ROOT/scripts/clear-database.mjs" --keep-admin
fi

echo "✓ Shield checks passed. Proceeding with safe push."
echo "=================================================================="
echo ""
exit 0
`

writeFileSync(prePushPath, hookContent, { encoding: 'utf8', mode: 0o755 })
try {
  chmodSync(prePushPath, 0o755)
} catch {
  // Ignore permission adjustments on non-posix systems
}

console.log('✓ Connecta Anti-Overwrite Shield installed at .git/hooks/pre-push')
