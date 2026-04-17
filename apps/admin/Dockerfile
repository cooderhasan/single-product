# Admin Panel Dockerfile (Optimized Alpine)
FROM node:20-alpine AS builder

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy workspace package files
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/admin/package.json ./apps/admin/
COPY packages/database/package.json ./packages/database/

# Install dependencies - optimized
RUN npm install --legacy-peer-deps --loglevel warn && \
    npm cache clean --force

# Copy the rest of the source
COPY . .

# Build environment variables
ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN cd packages/database && npx prisma generate
RUN npx turbo run build --filter=@ecommerce/admin

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3042
ENV HOSTNAME="0.0.0.0"

# Security: Don't run as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy core files
COPY --from=builder /app/apps/admin/next.config.js ./apps/admin/
COPY --from=builder /app/apps/admin/package.json ./apps/admin/

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public

USER nextjs

EXPOSE 3042

CMD ["node", "apps/admin/server.js"]





