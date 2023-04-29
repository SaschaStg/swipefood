#syntax=docker/dockerfile:1

# Build Angular
FROM node:18-alpine AS build

WORKDIR /build

RUN --mount=source=package.json,target=package.json --mount=source=package-lock.json,target=package-lock.json \
    npm ci

COPY --link . .

RUN npm run build

FROM nginx:stable-alpine AS final

COPY --link nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --link --from=build /build/dist/frontend /app

HEALTHCHECK --interval=1m --timeout=3s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1
