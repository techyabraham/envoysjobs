# EnvoysJobs

EnvoysJobs is a community-first opportunity platform built for RCCG The Envoys. This monorepo includes a Next.js web app, NestJS API, and a Prisma/PostgreSQL database.

## Quick start (local)

1. Copy env files:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
```

2. Install dependencies:

```bash
pnpm install
```

3. Start services locally:

```bash
pnpm dev
```

Alternatively, run everything with Docker:

```bash
docker compose up --build
```

## Scripts

- `pnpm dev` - run all apps
- `pnpm build` - build all apps
- `pnpm lint` - lint all apps
- `pnpm typecheck` - typecheck all apps
- `pnpm test` - run tests

## API Docs

Swagger is available at `http://localhost:4000/docs` when the API is running.

## Prisma

```bash
pnpm --filter @envoysjobs/api prisma migrate dev
pnpm --filter @envoysjobs/api seed
```

## Monorepo layout

- `apps/web` - Next.js web app
- `apps/api` - NestJS API
- `packages/ui` - shared UI components and design tokens
- `packages/types` - shared DTOs and enums
- `packages/utils` - shared utilities
- `packages/config` - lint/format/tsconfig defaults

## Environment variables

See `apps/web/.env.example` and `apps/api/.env.example`.
