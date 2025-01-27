# Base stage with minimal dependencies
FROM node:20-alpine AS base

ENV NODE_ENV=production \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Install dependencies and chromium with necessary security flags
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache \
    openssl \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init \
    bash \
    chromium-chromedriver && \
    rm -rf /var/cache/apk/* /tmp/*

WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --only=production --ignore-scripts --cache /tmp/.npm && \
    rm -rf /tmp/.npm

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# public keys as build arguments
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in \
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

RUN npx prisma generate && \
    npm run build

# Production stage
FROM base AS runner

# Create non-root user with necessary permissions
RUN addgroup -S pptruser && \
    adduser -S -g pptruser pptruser && \
    mkdir -p /app/.next/cache && \
    chown -R pptruser:pptruser /app && \
    mkdir -p /home/pptruser/Downloads && \
    chown -R pptruser:pptruser /home/pptruser && \
    mkdir -p /var/cache/chrome && \
    chown -R pptruser:pptruser /var/cache/chrome

WORKDIR /app

# Copy only necessary files
COPY --from=builder --chown=pptruser:pptruser /app/.next/static ./.next/static
COPY --from=builder --chown=pptruser:pptruser /app/.next/standalone ./
COPY --from=builder --chown=pptruser:pptruser /app/node_modules ./node_modules
COPY --from=builder --chown=pptruser:pptruser /app/package.json ./package.json
COPY --from=builder --chown=pptruser:pptruser /app/prisma ./prisma

# Set secure permissions
RUN chmod -R 550 /app && \
    chmod -R 770 /app/.next/cache

# Switch to non-root user
USER pptruser

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["node", "server.js"]