# EnvoysJobs UI Audit vs Figma

Sources: `c:/src/envoysjobsnewui.zip` (ALL_PAGES_INDEX.md, COMPLETE_UI_GUIDE.md)

Total routes: 65
API wired routes: 17
UI-only routes: 48

## Route inventory and wiring status

| Route | Status |
| --- | --- |
| `/(admin)/admin/jobs/page.tsx` | UI only |
| `/(admin)/admin/login/page.tsx` | UI only |
| `/(admin)/admin/page.tsx` | UI only |
| `/(admin)/admin/reports/page.tsx` | UI only |
| `/(admin)/admin/users/page.tsx` | UI only |
| `/(admin)/admin/verifications/page.tsx` | UI only |
| `/(envoy)/envoy/applications/page.tsx` | UI only |
| `/(envoy)/envoy/availability/page.tsx` | API wired |
| `/(envoy)/envoy/dashboard/page.tsx` | UI only |
| `/(envoy)/envoy/earnings/page.tsx` | UI only |
| `/(envoy)/envoy/gigs/new/page.tsx` | UI only |
| `/(envoy)/envoy/gigs/page.tsx` | UI only |
| `/(envoy)/envoy/history/page.tsx` | UI only |
| `/(envoy)/envoy/jobs/[id]/page.tsx` | API wired |
| `/(envoy)/envoy/jobs/page.tsx` | UI only |
| `/(envoy)/envoy/notifications/page.tsx` | UI only |
| `/(envoy)/envoy/portfolio/page.tsx` | API wired |
| `/(envoy)/envoy/profile/edit/page.tsx` | API wired |
| `/(envoy)/envoy/profile/page.tsx` | API wired |
| `/(envoy)/envoy/reviews/page.tsx` | API wired |
| `/(envoy)/envoy/saved/page.tsx` | UI only |
| `/(envoy)/envoy/services/[id]/edit/page.tsx` | UI only |
| `/(envoy)/envoy/services/new/page.tsx` | UI only |
| `/(envoy)/envoy/services/page.tsx` | UI only |
| `/(envoy)/envoy/settings/page.tsx` | UI only |
| `/(envoy)/envoy/skills/page.tsx` | API wired |
| `/(hirer)/hirer/dashboard/page.tsx` | UI only |
| `/(hirer)/hirer/envoys/[id]/page.tsx` | API wired |
| `/(hirer)/hirer/jobs/[id]/applicants/page.tsx` | UI only |
| `/(hirer)/hirer/jobs/[id]/complete/page.tsx` | API wired |
| `/(hirer)/hirer/jobs/[id]/hire/page.tsx` | UI only |
| `/(hirer)/hirer/jobs/[id]/preview/page.tsx` | UI only |
| `/(hirer)/hirer/jobs/[id]/review/page.tsx` | API wired |
| `/(hirer)/hirer/jobs/new/page.tsx` | API wired |
| `/(hirer)/hirer/jobs/page.tsx` | UI only |
| `/(hirer)/hirer/notifications/page.tsx` | UI only |
| `/(hirer)/hirer/profile/page.tsx` | API wired |
| `/(hirer)/hirer/settings/page.tsx` | UI only |
| `/(hirer)/hirer/shortlist/page.tsx` | UI only |
| `/auth/forgot-password/page.tsx` | UI only |
| `/auth/login/page.tsx` | UI only |
| `/auth/otp/page.tsx` | UI only |
| `/auth/role/page.tsx` | UI only |
| `/auth/signup/page.tsx` | UI only |
| `/billing/history/page.tsx` | UI only |
| `/billing/page.tsx` | UI only |
| `/billing/wallet/page.tsx` | UI only |
| `/jobs/[id]/page.tsx` | API wired |
| `/jobs/filters/page.tsx` | UI only |
| `/jobs/location/page.tsx` | UI only |
| `/jobs/page.tsx` | UI only |
| `/jobs/recommended/page.tsx` | UI only |
| `/messages/[conversationId]/page.tsx` | UI only |
| `/messages/page.tsx` | UI only |
| `/notifications/preferences/page.tsx` | UI only |
| `/onboarding/envoy/page.tsx` | API wired |
| `/onboarding/hirer/page.tsx` | API wired |
| `/page.tsx` | UI only |
| `/pricing/boost/page.tsx` | UI only |
| `/pricing/featured/page.tsx` | UI only |
| `/pricing/page.tsx` | UI only |
| `/trust-safety/page.tsx` | API wired |
| `/verification/badge/page.tsx` | UI only |
| `/verification/page.tsx` | API wired |
| `/welcome/page.tsx` | UI only |

## Remaining work (priority-order from spec + Figma)

### High
- Auth flows: login/signup/otp/forgot/role are UI-only (need API wiring + error handling + redirects).
- Envoy dashboard modules (jobs/messages/services) still show mock or static data in UI components.
- Jobs discovery + details pages are mostly UI-only; apply/save flows need full API wiring.
- Messaging inbox + conversation view are UI-only; need WebSocket + REST wiring + attachments.
- Admin screens (users/jobs/reports/verifications) need API data + actions across all screens.
- Hirer manage jobs + applicants pages are UI-only; need API wiring, status transitions.

### Medium
- Envoy settings/notifications/saved/applications pages: wire to API + persistence.
- Verification status + uploads: hook to API + file storage; steward verification UI actions.
- Reviews & ratings: create/retrieve/aggregate across profiles.
- Gig lifecycle beyond apply (accept/reject/complete) + notifications.

### Low / placeholder (per spec)
- Monetization pages are placeholders (expected to remain UI-only).

