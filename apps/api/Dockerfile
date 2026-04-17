# API Dockerfile
FROM node:20-alpine AS builder

RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy only the packages needed for API
COPY package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/

# Create placeholder package.json for other workspaces
RUN mkdir -p apps/web apps/admin && \
    echo '{"name":"@ecommerce/web","version":"1.0.0"}' > apps/web/package.json && \
    echo '{"name":"@ecommerce/admin","version":"1.0.0"}' > apps/admin/package.json

# Install dependencies - minimal flags to save disk space
RUN npm install --legacy-peer-deps --no-audit --no-fund --prefer-offline 2>/dev/null; \
    npm install --legacy-peer-deps --no-audit --no-fund && \
    npm cache clean --force

# Copy source
COPY . .

# Generate Prisma Client and Build
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN cd packages/database && npx prisma generate
RUN npx turbo run build --filter=@ecommerce/database
RUN npx turbo run build --filter=@ecommerce/api

# Remove dev dependencies to save space
RUN npm prune --production --legacy-peer-deps 2>/dev/null || true

ENV NODE_ENV=production
ENV PORT=3041

# Security: Don't run as root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    chown -R nestjs:nodejs /app

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

USER nestjs
EXPOSE 3041

CMD ["sh", "-c", "./node_modules/.bin/prisma db push --schema=packages/database/prisma/schema.prisma --accept-data-loss && node apps/api/dist/main"]
