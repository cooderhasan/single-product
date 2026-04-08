# Web Frontend Dockerfile (Monorepo Compatible)
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
COPY apps/web/package.json ./apps/web/
# Note: Web might not need database package, but including it if Turbo needs it
# COPY packages/database/package.json ./packages/database/ 

RUN npm install
COPY . .

RUN npx turbo run build --filter=@ecommerce/web

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
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
