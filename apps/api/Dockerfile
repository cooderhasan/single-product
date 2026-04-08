# API Dockerfile (Monorepo Compatible)
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First copy root config
COPY package.json package-lock.json* ./

# Copy all packages/apps package.jsons for dependency resolution
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/

RUN npm install

# Copy source code
COPY . .

# Generate database client first
RUN npx turbo run db:generate --filter=@ecommerce/api

# Build specific package
RUN npx turbo run build --filter=@ecommerce/api

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy built application from monorepo path
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./

USER nestjs
EXPOSE 3001
CMD ["node", "dist/main"]
