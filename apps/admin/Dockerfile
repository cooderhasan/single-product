# Admin Panel Dockerfile (Monorepo Compatible)
FROM node:20-bookworm AS builder
# Full image already includes build tools (python3, make, g++, etc.)
WORKDIR /app

# First copy everything to ensure all monorepo dependencies are resolved
COPY . .

RUN npm install --legacy-peer-deps

RUN cd packages/database && npx prisma generate
RUN npx turbo run build --filter=@ecommerce/admin

# Production image
FROM node:20-bookworm-slim AS runner
# Install shared libraries required by Prisma (with retry)
RUN apt-get update && (apt-get install -y openssl ca-certificates || (sleep 5 && apt-get install -y openssl ca-certificates)) && rm -rf /var/lib/apt/lists/*
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
