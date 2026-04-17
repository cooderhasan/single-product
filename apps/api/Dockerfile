# API Dockerfile (Optimized Alpine)
FROM node:20-alpine AS runner

# Prisma needs openssl on Alpine
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy workspace package files
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/admin/package.json ./apps/admin/
COPY packages/database/package.json ./packages/database/

# Install dependencies - optimized layer
RUN npm install --legacy-peer-deps --loglevel warn && \
    npm cache clean --force

# Copy the rest of the source
COPY . .

# Generate Prisma Client and Build
RUN cd packages/database && npx prisma generate
RUN npx turbo run build --filter=@ecommerce/database
RUN npx turbo run build --filter=@ecommerce/api

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

# Automatically push database schema before starting the API
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --schema=packages/database/prisma/schema.prisma --accept-data-loss && node apps/api/dist/main"]
