# API Dockerfile (Ultimate Bullseye Compatibility)
FROM node:20-bullseye AS runner

ARG DATABASE_URL
ARG REDIS_URL
ARG JWT_SECRET
ARG PAYTR_MERCHANT_ID
ARG PAYTR_MERCHANT_KEY
ARG PAYTR_MERCHANT_SALT
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy workspace package files to maintain monorepo structure
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY apps/admin/package.json ./apps/admin/
COPY packages/database/package.json ./packages/database/

# Install dependencies - this layer will be cached unless a package.json changes
RUN npm ci --legacy-peer-deps --loglevel info

# Now copy the rest of the source
COPY . .

RUN npm run db:generate
RUN npx turbo run build --filter=@ecommerce/database
RUN npx turbo run build --filter=@ecommerce/api

ENV NODE_ENV=production
ENV PORT=3041

# Set ownership to non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nestjs && \
    chown -R nestjs:nodejs /app

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

USER nestjs
EXPOSE 3041

# Automatically push database schema before starting the API
CMD ["sh", "-c", "./node_modules/.bin/prisma db push --schema=packages/database/prisma/schema.prisma --accept-data-loss && node apps/api/dist/main"]
