# Admin Panel Dockerfile
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy only the packages needed for Admin
COPY package.json ./
COPY apps/admin/package.json ./apps/admin/
COPY packages/database/package.json ./packages/database/

# Create placeholder package.json for other workspaces
RUN mkdir -p apps/api apps/web && \
    echo '{"name":"@ecommerce/api","version":"1.0.0"}' > apps/api/package.json && \
    echo '{"name":"@ecommerce/web","version":"1.0.0"}' > apps/web/package.json

# Install dependencies
RUN npm install --legacy-peer-deps --loglevel warn && \
    npm cache clean --force

# Copy source
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

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/admin/next.config.js ./apps/admin/
COPY --from=builder /app/apps/admin/package.json ./apps/admin/

COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static

USER nextjs

EXPOSE 3042

CMD ["node", "apps/admin/server.js"]
