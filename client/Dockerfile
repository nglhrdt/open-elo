# Build stage
FROM node:24-alpine AS build

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile

WORKDIR /app/client

RUN yarn build

FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
