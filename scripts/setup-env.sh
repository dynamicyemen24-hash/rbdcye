#!/bin/bash
# ============================================================
# Environment Setup Script
# Sets Cloudflare Pages secrets for production
# Run: bash scripts/setup-env.sh
# ============================================================

set -e

echo "=== NexWebSite Environment Setup ==="
echo ""
echo "This script sets secrets for Cloudflare Pages deployment."
echo "Make sure you have wrangler installed and authenticated."
echo ""

# Check if wrangler is available
if ! command -v npx &> /dev/null; then
  echo "❌ npx not found. Install Node.js first."
  exit 1
fi

PROJECT="rbdcye"

echo "Setting secrets for project: $PROJECT"
echo ""

# DATABASE_URL
echo "[1/3] Setting DATABASE_URL..."
echo "  Enter your Neon PostgreSQL connection string:"
echo "  Format: postgresql://user:pass@host/dbname?sslmode=require"
read -r -s DB_URL
if [ -n "$DB_URL" ]; then
  echo "$DB_URL" | npx wrangler pages secret put DATABASE_URL --project-name=$PROJECT
  echo "  ✅ DATABASE_URL set"
else
  echo "  ⏭️  Skipped"
fi

echo ""

# JWT_SECRET
echo "[2/3] Setting JWT_SECRET..."
JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 64 /dev/urandom | xxd -p | tr -d '\n' | head -c 64)
echo "  Generated JWT_SECRET: ${JWT_SECRET:0:8}...${JWT_SECRET: -8}"
echo "$JWT_SECRET" | npx wrangler pages secret put JWT_SECRET --project-name=$PROJECT
echo "  ✅ JWT_SECRET set"

echo ""

# CORS_ORIGIN
echo "[3/3] Setting CORS_ORIGIN..."
echo "  Enter allowed origins (comma-separated, default: https://rbdcye.org,http://localhost:5173):"
read -r CORS
CORS=${CORS:-"https://rbdcye.org,http://localhost:5173"}
echo "$CORS" | npx wrangler pages secret put CORS_ORIGIN --project-name=$PROJECT
echo "  ✅ CORS_ORIGIN set"

echo ""
echo "=== Environment Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Run migration: node scripts/migrate-db.js"
echo "  2. Create admin: node scripts/create-admin.js"
echo "  3. Deploy: bash scripts/deploy.sh"
