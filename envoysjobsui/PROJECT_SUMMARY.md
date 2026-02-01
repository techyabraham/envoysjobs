# EnvoysJobs - Complete UI System

## Overview
A production-ready, community-first opportunity platform built exclusively for RCCG The Envoys. The platform connects Envoys through jobs, services, and gigs in a trusted, honour-based ecosystem.

## Design System

### Typography
- **Headings**: Montserrat (Google Fonts)
- **Body/UI**: Inter (Google Fonts)
- Clear typographic hierarchy with excellent readability

### Color Palette
- **Deep Blue** (#1e3a8a): Trust, structure, navigation
- **Emerald Green** (#10b981): Actions and confirmations
- **Soft Gold** (#f59e0b): Honour, trust badges, "From Our Members"
- **Neutrals**: White and soft grays for backgrounds

### Design Philosophy
- Mobile-first, desktop-perfect
- Clean, modern, minimal
- Warm, human, community-centered
- Premium quality (Airbnb/LinkedIn/Upwork level)
- Strong hierarchy, generous white space
- Rounded cards, soft shadows

## Core UX Language

### Honor-Based Culture
- Dashboard greeting: "I honour you, {FirstName}"
- System confirmations: "You are amazing."
- Tone: conversational, respectful, encouraging (never corporate)

## Application Structure

### Public Pages
1. **Homepage**
   - Hero section with unified search
   - Job listings with "From Our Members" badges
   - Services directory with profile cards
   - Featured gigs
   - Community impact statistics

2. **Authentication**
   - Clean login flow
   - Two-step signup with skill selection
   - Profile setup wizard

### Dashboard (Role-Adaptive)
The dashboard adapts based on user activity, not fixed roles. One user can be:
- Job candidate
- Employer
- Service provider
- Gig worker

#### Dashboard Modules:
1. **Overview**
   - Personalized greeting
   - Profile completion progress
   - Quick action buttons
   - Performance stats
   - Next best action recommendations

2. **Jobs Module**
   - Tabs: Recommended, Applied, Saved, Interviews
   - Application tracking with status
   - Job cards with apply functionality

3. **Services Module**
   - My service listing
   - Enquiries management
   - Reviews and ratings
   - Visibility insights

4. **Gigs Module**
   - Tabs: Available, Applied, Posted, Ongoing, Completed
   - Quick opportunities
   - Urgency badges
   - Status tracking

5. **Messaging**
   - Real-time chat interface
   - Conversation list
   - Employer-controlled chat enablement
   - Read receipts

6. **Profile**
   - Editable profile information
   - Skills management
   - Experience timeline
   - Account statistics

### Admin Interface
- Pending reviews dashboard
- Job/service/user approval workflow
- Member verification
- Report management
- Activity logs
- Clear approval states (Pending, Approved, Rejected)

## Technical Architecture

### Frontend
- React with TypeScript
- Tailwind CSS v4
- Component-based architecture
- Fully responsive (mobile-first)

### Backend-Ready Design
Designed with backend integration in mind:
- NestJS (API)
- PostgreSQL (relational data)
- Redis (caching, notifications)
- Meilisearch (unified search)
- Socket.IO (real-time messaging)

All screens include:
- Loading states
- Empty states
- Status changes
- Real-time update placeholders

## Mobile Experience

### Bottom Navigation
- Home
- Jobs
- Services
- Gigs
- Messages
- Profile

### Features
- Thumb-friendly spacing
- Swipeable cards
- Unified search easily accessible
- Optimized layouts for small screens

## Component Library

### Core Components
- **Button**: Multiple variants (primary, success, accent, outline, ghost)
- **Card**: Hover effects, consistent styling
- **Badge**: Status indicators with variants
- **Input/TextArea**: Form controls with validation
- **LoadingState**: Spinner with message
- **EmptyState**: Helpful empty states with actions
- **Toast**: Success/error notifications

### Layout Components
- **Header**: Responsive navigation
- **Footer**: Links and social
- **DashboardLayout**: Sidebar + mobile bottom nav
- **DemoInstructions**: Helper for demo users

## Key Features

### 1. Unified Search
Global search bar for jobs, services, and gigs with filter chips

### 2. Trust Badges
- "From Our Members" badge in soft gold
- Verified member indicators
- Rating systems with stars

### 3. Real-time Features
- Messaging with read receipts
- Notification center
- Live status updates

### 4. Moderation System
- Admin review workflow
- Approval/rejection interface
- Report handling
- Activity tracking

### 5. Status Management
- Application statuses
- Service approval states
- Gig progress tracking
- Interview scheduling

## Demo Instructions

### Test Accounts
- **Regular User**: Use any email address
- **Admin**: admin@envoysjobs.com

### Navigation Flow
1. Start on homepage
2. Click "Get Started" to sign up
3. Complete profile setup
4. Explore dashboard modules
5. Try posting a job/service/gig
6. Test messaging interface
7. Check admin panel (if using admin account)

## Production Considerations

### Security
- All API calls should use authentication tokens
- Chat monitoring for community safety
- Member verification process
- Content moderation

### Performance
- Lazy loading for images
- Pagination for lists
- Caching for frequently accessed data
- Real-time updates via WebSockets

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

## File Structure

```
/src
  /app
    /components
      /homepage
        - Header.tsx
        - HeroSection.tsx
        - JobCard.tsx
        - ServiceCard.tsx
        - GigCard.tsx
        - StatsSection.tsx
        - Footer.tsx
        - Homepage.tsx
      /auth
        - LoginPage.tsx
        - SignupPage.tsx
      /dashboard
        - DashboardLayout.tsx
        - DashboardOverview.tsx
        - JobsModule.tsx
        - ServicesModule.tsx
        - GigsModule.tsx
        - MessagingModule.tsx
        - ProfilePage.tsx
      /admin
        - AdminDashboard.tsx
      - Button.tsx
      - Card.tsx
      - Badge.tsx
      - Input.tsx
      - LoadingState.tsx
      - Toast.tsx
      - DemoInstructions.tsx
    - App.tsx
  /styles
    - fonts.css
    - theme.css
    - tailwind.css
```

## Future Enhancements

1. **Notifications System**
   - Email notifications
   - Push notifications
   - In-app notification center

2. **Advanced Search**
   - Filters by location, salary, skills
   - Saved searches
   - Search history

3. **Video Profiles**
   - Video introductions for services
   - Interview scheduling with video calls

4. **Payment Integration**
   - Secure payment processing
   - Escrow for gigs
   - Invoice generation

5. **Analytics Dashboard**
   - User engagement metrics
   - Conversion tracking
   - Performance insights

6. **Community Features**
   - Forums/discussions
   - Success stories
   - Member spotlights

## Support & Community

Built with honour for RCCG The Envoys.

For questions or support:
- Email: hello@envoysjobs.com
- Built in 2026

---

**You are amazing.** 🌟
