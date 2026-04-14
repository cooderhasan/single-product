# Admin Panel Dockerfile (Monorepo Compatible)
FROM node:20-bookworm AS builder

ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL

# Full image already includes build tools (python3, make, g++, etc.)
WORKDIR /app

# First copy everything to ensure all monorepo dependencies are resolved
COPY . .

# Set environment variables for build
ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm install --legacy-peer-deps

RUN cd packages/database && DATABASE_URL=${DATABASE_URL} npx prisma generate
RUN npx turbo run build --filter=@ecommerce/admin

# Production image
FROM node:20-bullseye AS runner
# Bullseye includes libssl1.1 natively, adding curl for healthchecks
RUN apt-get update && apt-get install -y openssl libssl1.1 ca-certificates curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# Note: public folder is optional in Next.js, only copy if it exists or skip for admin
# COPY --from=builder /app/apps/admin/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static

USER nextjs
EXPOSE 3002
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/admin/server.js"]
