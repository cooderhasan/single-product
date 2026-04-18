#!/bin/sh
set -e

echo "🚀 Starting 360 Sehpa API..."

# Find prisma binary dynamically
PRISMA_BIN=$(find /app -name "prisma" -path "*/bin/prisma" 2>/dev/null | head -1)
if [ -z "$PRISMA_BIN" ]; then
  PRISMA_BIN=$(find /app -name "index.js" -path "*/prisma/build/index.js" 2>/dev/null | head -1)
  if [ -n "$PRISMA_BIN" ]; then
    PRISMA_BIN="node $PRISMA_BIN"
  fi
fi

# Run db push if prisma binary found
if [ -n "$PRISMA_BIN" ]; then
  echo "📦 Running database sync..."
  $PRISMA_BIN db push --schema=packages/database/prisma/schema.prisma --accept-data-loss || echo "⚠️ DB push skipped"
else
  echo "⚠️ Prisma binary not found, skipping db push"
fi

# Run seed - find tsx
TSX_BIN=$(find /app -name "tsx" -path "*/bin/tsx" 2>/dev/null | head -1)
if [ -n "$TSX_BIN" ] && [ -f "packages/database/prisma/seed.ts" ]; then
  echo "🌱 Running seed..."
  $TSX_BIN packages/database/prisma/seed.ts || echo "⚠️ Seed skipped"
else
  echo "⚠️ TSX binary or seed file not found, skipping seed"
fi

echo "✅ Starting API server..."
exec node apps/api/dist/main
