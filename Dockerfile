# Single stage build for simpler deployment
FROM node:20-alpine

# Install build dependencies for native modules (bcrypt, etc.)
RUN apk add --no-cache python3 make g++ wget

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Set dummy DATABASE_URL for build-time schema validation
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

# Build the application
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Clean up build tools (keep wget for healthcheck)
RUN apk del python3 make g++ && \
    apk add --no-cache wget

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
