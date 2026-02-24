# Multi-stage Dockerfile for SvelteKit
# Development stage for docker-compose
# Production stage for Kamal deployment

# ============================================
# Development Stage
# ============================================
FROM node:lts AS development

WORKDIR /app

# Install pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files (pnpm-lock.yaml will be generated if missing)
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies (generates pnpm-lock.yaml if missing)
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install; \
    fi

# Copy source code
COPY . .

CMD ["pnpm", "dev"]

# ============================================
# Production Build Stage
# ============================================
FROM node:lts AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Install dependencies (use lock file if available, otherwise generate it)
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile; \
    else \
      pnpm install; \
    fi

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# ============================================
# Production Runtime Stage
# ============================================
FROM node:lts-slim AS production

# Set working directory
WORKDIR /app

# Copy package files (lock file optional)
COPY package.json ./
COPY pnpm-lock.yaml* ./

# Install production dependencies only
RUN if [ -f pnpm-lock.yaml ]; then \
      pnpm install --frozen-lockfile --prod; \
    else \
      pnpm install --prod; \
    fi

# Copy built application from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./
# Copy static files if they exist
COPY --from=builder /app/static ./static 2>/dev/null || true
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma 2>/dev/null || true

# Expose production port
EXPOSE 5173

# Set environment to production
ENV NODE_ENV=production
ENV PORT=5173
ENV HOST=0.0.0.0

# Start the production server
# adapter-node creates build/index.js as the entry point
CMD ["node", "build"]
