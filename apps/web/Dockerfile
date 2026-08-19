# ─── Stage 1: Builder ─────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY packages/types/package.json ./packages/types/
COPY apps/web/package.json ./apps/web/

# Install dependencies
RUN npm install

# Copy source
COPY packages/types ./packages/types
COPY apps/web ./apps/web

# Build React app for production
# Vite outputs to apps/web/dist/
RUN npm run build --workspace=apps/web

# ─── Stage 2: Nginx ───────────────────────────────────────
# Use nginx to serve the built React app
# nginx is a high-performance web server
# Much better than running Vite in production
FROM nginx:alpine AS production

# Copy built React files to nginx's serve directory
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

# Copy custom nginx config
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# nginx starts automatically — no CMD needed