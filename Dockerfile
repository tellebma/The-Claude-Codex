# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --ignore-scripts

# Stage 2: Build
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Stage 3: Production — serve static files with `serve`
# Using serve instead of Nginx because Next.js static export
# generates RSC payloads (.txt files) that must be served as-is
# for proper i18n hydration. Nginx's try_files mishandles these.
FROM node:22-alpine AS runner
LABEL maintainer="The Claude Codex Team"
LABEL description="The Claude Codex - Guide de reference pour maitriser Claude Code"

RUN npm install -g http-server@14

WORKDIR /app
COPY --from=builder /app/out ./out

# Root index.html redirects to /fr/ (default locale)
# This replaces the redirect that would normally be in Nginx
RUN echo '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/fr/"><link rel="canonical" href="/fr/"></head><body></body></html>' > ./out/index.html

# Non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

CMD ["http-server", "out", "-p", "8080", "--gzip", "-c-1"]
