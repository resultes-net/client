FROM node:23.11-bookworm-slim AS npm-dependencies

WORKDIR /app

# Install Java for `openapischema-generator-cli`.
RUN apt-get update
RUN apt-get install -y openjdk-17-jre-headless

COPY package.json package-lock.json ./

RUN npm ci


FROM npm-dependencies AS openapi-schema

COPY openapi-schema openapi-schema

RUN npm run api:gen-model


FROM openapi-schema AS npm-build

COPY .svelte-kit .svelte-kit
COPY src src

COPY postcss.config.cjs svelte.config.js tailwind.config.ts tsconfig.json vite.config.ts .env.production ./

RUN npm run build


FROM node:23.11-bookworm-slim

COPY package.json package-lock.json ./

COPY --from=npm-build /app/build build

RUN npm ci --include=prod

ENTRYPOINT ["node", "build"]
