# Admin Panel Dockerfile (Monorepo Compatible)
FROM node:20-bookworm AS builder

ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL

# Full image already includes build tools (python3, make, g++, etc.)
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy workspace package files to maintain monorepo structure
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/admin/package.json ./apps/admin/
COPY packages/database/package.json ./packages/database/

# Install dependencies - cached layer
RUN npm install --legacy-peer-deps

# Now copy the rest of the source
COPY . .

# Set environment variables for build
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}


RUN npm run db:generate
RUN npx turbo run build --filter=@ecommerce/admin

# Production image
FROM node:20-bullseye AS runner
# Bullseye includes libssl1.1 natively, adding curl for healthchecks
RUN apt-get update && apt-get install -y openssl libssl1.1 ca-certificates curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3042

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# Copy the standalone output which includes node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public

USER nextjs

EXPOSE 3042

ENV HOSTNAME="0.0.0.0"

# Smart startup: finds server.js regardless of nesting and ensures correct module resolution
CMD ["sh", "-c", "if [ -f apps/admin/server.js ]; then node apps/admin/server.js; elif [ -f server.js ]; then node server.js; else SERVER_FILE=$(find . -name server.js | head -n 1); if [ -n \"$SERVER_FILE\" ]; then node \"$SERVER_FILE\"; else echo 'Error: server.js not found'; ls -R; exit 1; fi; fi"]




