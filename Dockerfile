FROM oven/bun:1.4 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1.4 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* vars are inlined into the client bundle at build time.
ARG NEXT_PUBLIC_IMGBB_KEY
ENV NEXT_PUBLIC_IMGBB_KEY=$NEXT_PUBLIC_IMGBB_KEY
ENV NEXT_TELEMETRY_DISABLED=1
# Placeholder so module-level MongoClient can be constructed during build; real value comes at runtime.
ENV MONGODB_URI=mongodb://build-placeholder:27017/booknook
RUN bun run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
