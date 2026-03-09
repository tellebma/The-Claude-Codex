# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Pre-compress static assets (Brotli + gzip)
FROM node:20-alpine AS compressor
RUN apk add --no-cache brotli gzip
WORKDIR /app
COPY --from=builder /app/out ./out
# Pre-compress all text-based assets with Brotli and gzip
# This enables nginx gzip_static to serve pre-compressed files
RUN find ./out -type f \( \
    -name "*.html" -o \
    -name "*.css" -o \
    -name "*.js" -o \
    -name "*.json" -o \
    -name "*.xml" -o \
    -name "*.svg" -o \
    -name "*.txt" \
  \) -exec sh -c ' \
    brotli -q 11 -o "{}.br" "{}" && \
    gzip -9 -k "{}" \
  ' \;

# Stage 4: Production
FROM nginx:1.27-alpine AS runner
LABEL maintainer="The Claude Codex Team"
LABEL description="The Claude Codex - Guide de reference pour maitriser Claude Code"

# Remove default nginx config and content
RUN rm -rf /etc/nginx/conf.d/default.conf /usr/share/nginx/html/*

# Copy custom nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy pre-compressed static output from Next.js build
COPY --from=compressor /app/out /usr/share/nginx/html

# Create required nginx directories and set permissions for non-root user
# These directories must exist for nginx to start, even with tmpfs mounts
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    mkdir -p /var/cache/nginx/client_temp \
             /var/cache/nginx/proxy_temp \
             /var/cache/nginx/fastcgi_temp \
             /var/cache/nginx/uwsgi_temp \
             /var/cache/nginx/scgi_temp && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /tmp/nginx.pid && \
    chown -R nginx:nginx /tmp/nginx.pid

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
