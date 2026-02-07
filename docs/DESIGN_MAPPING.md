# Design Mapping

This maps each Figma screen/module to the implemented route and primary components.

| Figma Screen / Module | Route | Components |
| --- | --- | --- |
| Landing | `/` | `@envoysjobs/ui` `Homepage`, `Header`, `HeroSection`, `JobCard`, `ServiceCard`, `GigCard`, `StatsSection`, `Footer` |
| Auth - Role | `/auth/role` | `PageShell` + role cards |
| Auth - Login | `/auth/login` | `@envoysjobs/ui` `LoginPage` + `LoginClient` |
| Auth - Signup | `/auth/signup` | `@envoysjobs/ui` `SignupPage` + `SignupClient` |
| Auth - OTP | `/auth/otp` | `@envoysjobs/ui` `OtpPage` |
| Auth - Forgot Password | `/auth/forgot-password` | `@envoysjobs/ui` `ForgotPasswordPage` |
| Envoy Onboarding | `/onboarding/envoy` | `EnvoyOnboardingForm`, `PageShell` |
| Hirer Onboarding | `/onboarding/hirer` | `HirerOnboardingForm`, `PageShell` |
| Envoy Dashboard | `/envoy/dashboard` | `DashboardShell`, `PageShell`, `DashboardOverview` |
| Envoy Jobs Feed | `/envoy/jobs` | `DashboardShell`, `PageShell`, job cards |
| Envoy Job Details | `/envoy/jobs/[id]` | `DashboardShell`, `PageShell`, job detail panel |
| Envoy Applications | `/envoy/applications` | `DashboardShell`, `PageShell` |
| Envoy Saved Jobs | `/envoy/saved` | `DashboardShell`, `PageShell` |
| Envoy Reviews | `/envoy/reviews` | `DashboardShell`, `PageShell` |
| Envoy Notifications | `/envoy/notifications` | `DashboardShell`, `PageShell` |
| Envoy Profile | `/envoy/profile` | `DashboardShell`, `PageShell` |
| Envoy Profile Edit | `/envoy/profile/edit` | `DashboardShell`, `PageShell` |
| Envoy Settings | `/envoy/settings` | `DashboardShell`, `PageShell` |
| Hirer Dashboard | `/hirer/dashboard` | `DashboardShell`, `PageShell`, `DashboardOverview` |
| Hirer Jobs List | `/hirer/jobs` | `DashboardShell`, `PageShell`, job cards |
| Hirer Job Create | `/hirer/jobs/new` | `DashboardShell`, `PageShell` |
| Hirer Job Preview | `/hirer/jobs/[id]/preview` | `DashboardShell`, `PageShell` |
| Hirer Job Applicants | `/hirer/jobs/[id]/applicants` | `DashboardShell`, `PageShell` |
| Hirer Hire Flow | `/hirer/jobs/[id]/hire` | `DashboardShell`, `PageShell` |
| Hirer Complete Job | `/hirer/jobs/[id]/complete` | `DashboardShell`, `PageShell` |
| Hirer Review Envoy | `/hirer/jobs/[id]/review` | `DashboardShell`, `PageShell` |
| Hirer View Envoy | `/hirer/envoys/[id]` | `DashboardShell`, `PageShell` |
| Hirer Notifications | `/hirer/notifications` | `DashboardShell`, `PageShell` |
| Messages Inbox | `/messages` | `PageShell`, `InboxList` |
| Messages Chat | `/messages/[conversationId]` | `PageShell`, `ConversationView` |
| Verification | `/verification` | `PageShell` + verification form |
| Trust & Safety | `/trust-safety` | `PageShell` + report form |
| Admin Dashboard | `/admin` | `PageShell` + stats cards |
| Admin Users | `/admin/users` | `PageShell` + user cards |
| Admin Jobs | `/admin/jobs` | `PageShell` + job cards |
| Admin Reports | `/admin/reports` | `PageShell` + report cards |
| Admin Verifications | `/admin/verifications` | `PageShell` + approval actions |
| Pricing | `/pricing` | `@envoysjobs/ui` `PricingPage` (feature-flagged) |
| Billing | `/billing` | `@envoysjobs/ui` `BillingPage` (feature-flagged) |
