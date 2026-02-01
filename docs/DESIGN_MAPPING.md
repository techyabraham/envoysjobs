# Design Mapping

| Figma Screen / Module | Route | Components |
| --- | --- | --- |
| Homepage | `/` | `@envoysjobs/ui` `Homepage`, `HeroSection`, `JobCard`, `ServiceCard`, `GigCard`, `StatsSection` |
| Login | `/auth/login` | `@envoysjobs/ui` `LoginPage` |
| Signup | `/auth/signup` | `@envoysjobs/ui` `SignupPage` |
| Dashboard Overview | `/envoy/dashboard`, `/hirer/dashboard` | `DashboardLayout`, `DashboardOverview` |
| Jobs Module | `/envoy/jobs`, `/hirer/jobs` | `JobsModule` (base styles), custom job cards |
| Services Module | `/envoy/dashboard` | `ServicesModule` |
| Gigs Module | `/envoy/dashboard` | `GigsModule` |
| Messaging | `/messages`, `/messages/[conversationId]` | `MessagingModule`, `ConversationView` |
| Profile | `/envoy/profile`, `/hirer/envoys/[id]` | `ProfilePage` + custom profile shells |
| Admin Dashboard | `/admin` | `AdminDashboard` |
