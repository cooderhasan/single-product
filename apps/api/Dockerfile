# API Dockerfile (Monorepo Compatible)
FROM node:20-bookworm-slim AS builder
RUN apt-get update && apt-get install -y openssl python3 build-essential
WORKDIR /app

# First copy everything to ensure all monorepo dependencies are resolved
COPY . .

RUN npm install

# Generate database client
RUN cd packages/database && npx prisma generate

# Build database package first (CRITICAL for types)
RUN npx turbo run build --filter=@ecommerce/database

# Build specific package using direct Nest build for better error capture
RUN cd apps/api && npx nest build || (echo "NEST BUILD FAILED" && exit 1)

# Production image
FROM node:20-bookworm-slim AS runner
# Install shared libraries required by Prisma
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nestjs

# Copy built application and required monorepo packages
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/packages/database ./packages/database
COPY --from=builder --chown=nestjs:nodejs /app/apps/api/package.json ./

# Create uploads directory with correct permissions
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

USER nestjs
EXPOSE 3001
CMD ["node", "dist/main"]
