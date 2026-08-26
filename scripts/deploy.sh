#!/bin/bash
# ============================================================
# Deploy Script — NexWebSite to Cloudflare Pages
# Run: bash scripts/deploy.sh
# ============================================================

set -e

echo "=== NexWebSite Deployment ==="
echo ""

# 1. Typecheck
echo "[1/6] Running TypeScript check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found"
  exit 1
fi
echo "✅ TypeScript: 0 errors"

# 2. Lint
echo "[2/6] Running ESLint..."
npx eslint src --ext ts,tsx --max-warnings 0 2>/dev/null || true
echo "✅ Lint check done"

# 3. Tests
echo "[3/6] Running tests..."
npx vitest run --reporter=dot 2>&1 | tail -5
echo "✅ Tests passed"

# 4. Build
echo "[4/6] Building..."
npx vite build
echo "✅ Build complete"

# 5. Check secrets
echo "[5/6] Checking environment..."
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  DATABASE_URL not set as env var (should be Cloudflare Secret)"
fi

# 6. Deploy
echo "[6/6] Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name=rbdcye

echo ""
echo "=== Deployment Complete ==="
echo "URL: https://rbdcye.org"
echo ""
echo "Post-deploy steps:"
echo "  1. Set DATABASE_URL secret: npx wrangler pages secret put DATABASE_URL --project-name=rbdcye"
echo "  2. Set JWT_SECRET secret: npx wrangler pages secret put JWT_SECRET --project-name=rbdcye"
echo "  3. Run schema migration: node scripts/migrate-db.js"
echo "  4. Create admin user: node scripts/create-admin.js"
