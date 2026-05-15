FROM node:20-slim AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml package.json turbo.json ./
COPY packages ./packages
COPY apps/web ./apps/web
RUN mkdir -p apps/api && printf '{"name":"@envoysjobs/api","version":"0.1.0","private":true}' > apps/api/package.json
RUN pnpm install

FROM base AS builder
COPY --from=deps /app /app
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_ENABLE_BILLING=false
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_ENABLE_BILLING=$NEXT_PUBLIC_ENABLE_BILLING
ENV SKIP_NEXT_LINT=true
ENV SKIP_NEXT_TYPECHECK=true
ENV NODE_OPTIONS=--max-old-space-size=2048
WORKDIR /app/apps/web
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/next.config.mjs ./apps/web/next.config.mjs
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/packages ./packages
EXPOSE 3000
CMD ["sh", "-c", "cd apps/web && ./node_modules/.bin/next start -p 3000"]
