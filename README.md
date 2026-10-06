# EnvoysJobs

EnvoysJobs is a community-first opportunity platform built for RCCG The Envoys. This monorepo includes a Next.js web app, NestJS API, and a Prisma/PostgreSQL database.

## Quick start (local)

Requirements: Node.js 20, pnpm 9, and Docker Desktop (for PostgreSQL).

1. Install dependencies and create local environment files:

```powershell
pnpm install
Copy-Item .env.example .env
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env.local
```

2. Start PostgreSQL:

```powershell
docker compose up -d postgres
```

3. Apply database migrations, add demo data, and start the apps:

```powershell
pnpm --filter @envoysjobs/api prisma migrate dev
pnpm --filter @envoysjobs/api seed
pnpm dev
```

Open `http://localhost:3000`. The API and Swagger docs are at `http://localhost:4000` and `http://localhost:4000/docs`.

The demo seed is for local use only. It creates `envoy@envoysjobs.com` / `envoy1234` and `hirer@envoysjobs.com` / `hirer1234` accounts. OTP codes and password-reset links are printed to the API terminal when local providers are set to `console`.

## Member deals

Signed-in members can browse and share offers at `/deals`. New submissions are held for admin review before appearing in the directory. Owners can pause and reactivate approved offers; expired and not-yet-started offers are automatically excluded from browsing. Promo codes and seller contact details are visible only to signed-in users. Purchases, fulfillment, and redemption are arranged directly with the seller; the app does not process deal payments.

To run the production-style containers instead, create the root `.env` from `.env.example` and run:

```powershell
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

The API container applies migrations before it starts. Do not run the demo seed in production.

## Production configuration

Use PostgreSQL, set strong JWT and NextAuth secrets, set `MAIL_PROVIDER=resend` with `RESEND_API_KEY` and a verified `MAIL_FROM` sender, and configure Twilio (`SMS_PROVIDER=twilio`) for phone OTP delivery. Configure the S3-compatible storage variables for persistent uploads. The API refuses to start in production without an explicit `CORS_ORIGIN`, and production uploads fail clearly until persistent storage is configured.

The demo seed refuses to run when `NODE_ENV=production`. For the first production admin only, set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` of at least 16 characters in the API environment, then run `pnpm --filter @envoysjobs/api bootstrap-admin` once. The command refuses to run after any admin account exists.

## Monorepo layout

- `apps/web` - Next.js web app
- `apps/api` - NestJS API
- `packages/ui` - shared UI components and design tokens
- `packages/types` - shared DTOs and enums
- `packages/utils` - shared utilities
- `packages/config` - lint/format/tsconfig defaults

## Environment variables

See `apps/web/.env.example` and `apps/api/.env.example`.
