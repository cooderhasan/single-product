# Web Frontend Dockerfile (Monorepo Compatible)
FROM node:20-bookworm AS builder

ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL

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

# Set environment variables for build (needed by Next.js)
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}


RUN npm run db:generate
RUN npx turbo run build --filter=@ecommerce/web

# Production image
FROM node:20-bullseye AS runner
# Bullseye natively supports Node 20, adding curl for healthchecks
RUN apt-get update && apt-get install -y openssl ca-certificates curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3040

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# Copy the standalone output which includes physically traced node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3040

ENV HOSTNAME="0.0.0.0"

# Now that tracing root is set, we can reliably run from the monorepo root
CMD ["node", "apps/web/server.js"]





