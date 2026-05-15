FROM node:20-slim AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps/api ./apps/api
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install

FROM base AS builder
COPY --from=deps /app /app
WORKDIR /app/apps/api
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/packages ./packages
EXPOSE 4000
CMD ["sh", "-c", "./apps/api/node_modules/.bin/prisma migrate deploy --schema=./apps/api/prisma/schema.prisma && node apps/api/dist/main.js"]
