# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Production stage
FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/health-check || exit 1

CMD ["node", "dist/index.js"]
