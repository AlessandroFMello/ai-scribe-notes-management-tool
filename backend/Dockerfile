# Backend Dockerfile for AI Scribe Notes Management Tool

FROM node:18-slim AS builder

# Install OpenSSL for Prisma compatibility
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-slim AS production

# Install OpenSSL for Prisma compatibility
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and Prisma schema
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# Install production dependencies and runtime dependencies
RUN npm ci --only=production && \
    npm install tsx prisma @prisma/client --save-dev && \
    npx prisma generate

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x ./start.sh

# Create uploads directory
RUN mkdir -p ./uploads

# Install postgresql-client for pg_isready
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["./start.sh"]

