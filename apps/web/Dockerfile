# Web Frontend Dockerfile (Monorepo Compatible)
FROM node:20-bookworm AS builder

ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL

# Full image already includes build tools (python3, make, g++, etc.)
WORKDIR /app

# First copy everything to ensure all monorepo dependencies are resolved
COPY . .

# Set environment variables for build
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN npm install --legacy-peer-deps

RUN cd packages/database && npx prisma generate
RUN npx turbo run build --filter=@ecommerce/web

# Production image
FROM node:20-bullseye AS runner
# Bullseye includes libssl1.1 natively, adding curl for healthchecks
RUN apt-get update && apt-get install -y openssl libssl1.1 ca-certificates curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# COPY --from=builder /app/apps/web/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Next.js standalone output is located here when built in monorepo
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000
ENV HOSTNAME="0.0.0.0"

# In standalone mode, we run the server.js inside the app folder structure
CMD ["node", "apps/web/server.js"]
