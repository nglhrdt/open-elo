# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

WORKDIR /app/api

RUN yarn build

# Production stage
FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/api/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health-check || exit 1

CMD ["node", "dist/index.js"]
