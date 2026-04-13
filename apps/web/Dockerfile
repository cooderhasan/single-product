# Web Frontend Dockerfile (Monorepo Compatible)
FROM node:20-bookworm AS builder
# Full image already includes build tools (python3, make, g++, etc.)
WORKDIR /app

# First copy everything to ensure all monorepo dependencies are resolved
COPY . .

RUN npm install --legacy-peer-deps

RUN cd packages/database && npx prisma generate
RUN npx turbo run build --filter=@ecommerce/web

# Production image
FROM node:20-bookworm AS runner
# Full image already includes openssl, ca-certificates, and curl
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
