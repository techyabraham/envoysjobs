# Assumptions

- The provided Figma export is treated as the visual source of truth; the web app reuses the exported components directly from the UI package.
- Authentication uses NextAuth credentials for the web app and JWT access/refresh tokens for the API; OAuth providers can be added later without changing the core flow.
- Phone OTP uses Twilio in production. Local development prints a random, short-lived code to the API terminal. Codes are hashed in storage and limited to five attempts.
- Password recovery uses single-use, one-hour reset links. Local development prints the link to the API terminal; production requires Resend.
- Uploads use local disk only in development and S3-compatible storage in production. Production upload requests fail if persistent storage is not configured.
- Monetization routes are feature-flagged via `NEXT_PUBLIC_ENABLE_BILLING` and are scaffolded for future billing integration.
- The demo database seed is development-only. Production admin bootstrap is a separate, one-time command that requires an explicitly supplied strong password.
