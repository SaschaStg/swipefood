#syntax=docker/dockerfile:1

FROM node:lts-alpine AS base

FROM base AS build

WORKDIR /build
RUN --mount=source=package.json,target=package.json --mount=source=package-lock.json,target=package-lock.json \
    npm ci

COPY . .

RUN npm run build:migrations

FROM base AS prod_base
ENV NODE_ENV production

FROM prod_base AS dependencies

WORKDIR /deps
RUN --mount=source=package.json,target=package.json --mount=source=package-lock.json,target=package-lock.json \
    npm ci

FROM prod_base AS final

WORKDIR /app
COPY --from=build --link /build/dist-migrations ./dist-migrations
COPY --from=dependencies --link /deps/node_modules ./node_modules

CMD ["node", "node_modules/typeorm/cli.js" , "migration:run", "-d", "./dist-migrations/typeorm.config.js"]
