# ─── Stage 1: Builder ─────────────────────────────────────
# Use Node 20 Alpine — lightweight Linux with Node
# Alpine = minimal Linux = smaller image size
FROM node:20-alpine AS builder

# Set working directory inside container
WORKDIR /app

# Copy monorepo root package files first
# Why? Docker caches layers — if package.json hasn't changed
# it reuses the cached npm install layer → faster builds
COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/server/package.json ./apps/server/

# Install ALL dependencies including devDependencies
# We need TypeScript compiler in build stage
RUN npm install

# Copy source code
COPY packages/types ./packages/types
COPY apps/server ./apps/server

# Compile TypeScript to JavaScript
# Output goes to apps/server/dist/

# 1. Build shared types first
RUN npm run build --workspace=packages/types

# 2. Then build server
RUN npm run build --workspace=apps/server
# ─── Stage 2: Production ──────────────────────────────────
# Fresh image — only production code, no build tools
# This keeps the final image small and secure
FROM node:20-alpine AS production

WORKDIR /app

# Copy only production dependencies manifest
COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/server/package.json ./apps/server/

# Install ONLY production dependencies
# --omit=dev skips TypeScript, nodemon etc
# Final image is much smaller
RUN npm install --omit=dev

# Copy compiled JavaScript from builder stage
COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages/types ./packages/types

# Expose port so Docker knows this container uses port 5000
EXPOSE 5000

# Start the compiled JavaScript server
# No ts-node in production — runs compiled JS directly
CMD ["node", "apps/server/dist/index.js"]