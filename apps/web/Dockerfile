# Web Frontend Dockerfile
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only the packages needed for Web
COPY package.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

# Create placeholder package.json for other workspaces
RUN mkdir -p apps/api apps/admin && \
    echo '{"name":"@ecommerce/api","version":"1.0.0"}' > apps/api/package.json && \
    echo '{"name":"@ecommerce/admin","version":"1.0.0"}' > apps/admin/package.json

# Install dependencies - minimal flags to save disk space
RUN npm install --legacy-peer-deps --no-audit --no-fund && \
    npm cache clean --force

# Copy source
COPY . .

# Build environment variables
ARG DATABASE_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

RUN cd packages/database && npx prisma generate
RUN npx turbo run build --filter=@ecommerce/web

# Production image - only copy what's needed, leave build deps behind
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3040
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/next.config.js ./apps/web/
COPY --from=builder /app/apps/web/package.json ./apps/web/

COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3040

CMD ["node", "apps/web/server.js"]
