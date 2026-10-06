# UI and API integration snapshot

Reconciled 2026-10-05 against the current source tree. The old 65-route, 17-wired, 48-UI-only counts were removed because they no longer matched the implementation.

The app currently has 73 `page.tsx` route files. The web tree includes API clients for jobs, applications, saved jobs, services, gigs, admin actions, notifications, and messaging. Auth, onboarding, envoy and hirer profile flows, verification, reports, and job lifecycle screens also call API endpoints directly or through shared clients.

This is a mixed integration state: several user and admin journeys persist data through the API, while other pages still present static content, placeholders, or feature-flagged billing views. A route file’s existence alone does not mean its complete user journey has been wired or reviewed. Use the page and API client sources as the current integration reference; this document no longer assigns a blanket status to every route.

## Setup and release status

- Local development has a documented PostgreSQL, migration, demo seed, and web/API startup path.
- Production deployment has a Render blueprint for the web app, API, and PostgreSQL. It prompts for email, SMS, and object-storage credentials.
- Production startup requires JWT, mail, SMS, and CORS configuration. The API readiness endpoint checks PostgreSQL.
- Monetization remains a placeholder and requires a payment provider before it can be enabled.
