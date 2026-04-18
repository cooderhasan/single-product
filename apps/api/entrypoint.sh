#!/bin/sh
set -e

echo "Starting 360 Sehpa API..."

# Find prisma binary
PRISMA=$(find /app -name "prisma" -path "*/bin/prisma" 2>/dev/null | head -1)

if [ -n "$PRISMA" ]; then
  echo "Running db push..."
  $PRISMA db push --schema=packages/database/prisma/schema.prisma --accept-data-loss || echo "DB push skipped"
else
  echo "Prisma binary not found, skipping db push"
fi

# Find tsx and run seed
TSX=$(find /app -name "tsx" -path "*/bin/tsx" 2>/dev/null | head -1)

if [ -n "$TSX" ] && [ -f "packages/database/prisma/seed.ts" ]; then
  echo "Running seed..."
  $TSX packages/database/prisma/seed.ts || echo "Seed skipped"
else
  echo "TSX not found, skipping seed"
fi

echo "Starting server..."
exec node apps/api/dist/main
