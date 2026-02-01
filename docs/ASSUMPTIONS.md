# Assumptions

- The provided Figma export is treated as the visual source of truth; the web app reuses the exported components directly from the UI package.
- Authentication uses NextAuth credentials for the web app and JWT access/refresh tokens for the API; OAuth providers can be added later without changing the core flow.
- OTP flows are represented as a required step UI and backed by a simple verification record in the API; SMS delivery is out of scope for this MVP.
- File uploads default to MinIO locally and S3-compatible storage in production, with file-type and size enforcement at the API layer.
- Monetization routes are feature-flagged via `NEXT_PUBLIC_ENABLE_BILLING` and are scaffolded for future billing integration.
- Admin approvals and steward verification actions are tracked in audit logs with a default `system` actor when run in dev.
