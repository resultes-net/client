FROM node:23.11-bookworm-slim

COPY package.json package-lock.json ./

COPY --from=client-npm-build /app/build build

RUN npm ci --include=prod

ENTRYPOINT ["node", "build"]