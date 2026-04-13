# API Dockerfile (Ultimate Bullseye Compatibility)
FROM node:20-bullseye AS runner

# Install OpenSSL 1.1 explicitly as required by Prisma on this environment
RUN apt-get update && apt-get install -y openssl libssl1.1 ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy everything first
COPY . .

# Install dependencies and build everything in one go
RUN npm install --legacy-peer-deps
RUN cd packages/database && npx prisma generate
RUN npx turbo run build --filter=@ecommerce/database
RUN npx turbo run build --filter=@ecommerce/api

# Standard environment setup
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

# Execute directly from the absolute build path
CMD ["node", "apps/api/dist/main"]
