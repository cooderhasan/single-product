# API Dockerfile (Ultimate Bullseye Compatibility)
FROM node:20-bullseye AS runner

ARG DATABASE_URL
ARG REDIS_URL
ARG JWT_SECRET
ARG PAYTR_MERCHANT_ID
ARG PAYTR_MERCHANT_KEY
ARG PAYTR_MERCHANT_SALT
ARG FRONTEND_URL
ARG ADMIN_URL

# Install OpenSSL 1.1 and curl explicitly
RUN apt-get update && apt-get install -y openssl libssl1.1 ca-certificates curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy everything first
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV DATABASE_URL=${DATABASE_URL}
ENV REDIS_URL=${REDIS_URL}
ENV JWT_SECRET=${JWT_SECRET}
ENV PAYTR_MERCHANT_ID=${PAYTR_MERCHANT_ID}
ENV PAYTR_MERCHANT_KEY=${PAYTR_MERCHANT_KEY}
ENV PAYTR_MERCHANT_SALT=${PAYTR_MERCHANT_SALT}
ENV FRONTEND_URL=${FRONTEND_URL}
ENV ADMIN_URL=${ADMIN_URL}

# Install dependencies and build everything in one go
RUN npm install --legacy-peer-deps
RUN cd packages/database && npx prisma generate
RUN npx turbo run build --filter=@ecommerce/database
RUN npx turbo run build --filter=@ecommerce/api

ENV NODE_ENV=production
ENV PORT=3001

# Set ownership to non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nestjs && \
    chown -R nestjs:nodejs /app

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R nestjs:nodejs /app/uploads

USER nestjs
EXPOSE 3001

# Use npm workspaces for reliable startup across the monorepo structure
CMD ["npm", "run", "start:prod", "--workspace=@ecommerce/api"]
