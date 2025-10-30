# Rapha Lumina - Spiritual Wisdom Chatbot

## Overview

Rapha Lumina is a spiritual wellness platform featuring an AI chatbot that provides philosophical and spiritual guidance. It aims to help users explore life's big questions through empathetic, Socratic dialogue, drawing from diverse wisdom traditions. The platform offers a contemplative interface, voice interaction, multi-page navigation, and free public chat access, alongside premium services like courses, e-books, and personalized coaching. The brand targets spiritual seekers in transition (28-45, primarily women who left strict religious backgrounds) with an intellectually rigorous approach combining psychology, quantum mechanics, and ancient wisdom, presented with a vibrant, contemplative minimalist aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend uses **React 18** with TypeScript, **Vite** for building, and **Wouter** for routing. **React Query** manages server state. UI is built with **shadcn/ui** (Radix UI) and styled with **Tailwind CSS**, following a "Contemplative Minimalism" design with a dark-mode-first color palette, elegant typography (Cormorant Garamond, Inter, Spectral), and amethyst accents.
Voice features include **Web Speech API** for speech-to-text and **ElevenLabs API** for text-to-speech (with browser TTS fallback), managed by custom React hooks. Persistent user-based conversation storage is handled via a PostgreSQL database.

### Backend

The backend is an **Express.js** server on Node.js with TypeScript. **Passport.js** with **Replit Auth** handles authentication (OpenID Connect), supporting various providers and ensuring stable user identity via email across OIDC changes. **Anthropic Claude API** powers the AI chatbot, engineered for a Socratic, empathetic Rapha Lumina persona. Data is stored in **PostgreSQL** (Neon Serverless) using **Drizzle ORM** for type-safe queries. The database schema includes tables for users, messages, newsletter subscribers, subscriptions, courses, modules, lessons, student progress, enrollments, flashcards, meditation tracks, and music tracks. An interface-based `IStorage` design abstracts database operations. All protected API routes resolve authenticated users via email-based lookup to ensure data consistency.

### API Design

The API includes public endpoints for newsletter subscription and anonymous chat, and protected endpoints requiring authentication for user-specific actions.
**Public Endpoints:** `POST /api/newsletter/subscribe`, `POST /api/chat`, `POST /api/webhooks/systemeio`.
**Protected Endpoints:** `/api/auth/user`, `/api/messages`, `/api/tts`, `/api/subscription`, `/api/admin/grant-premium`, `/api/enroll`, `/api/my-courses`, `/api/progress/:lessonId`, `/api/progress/:courseId`, `/api/admin/users`, `/api/admin/newsletter/subscribers`, `/api/admin/subscriptions`, `/api/profile`, `/api/flashcards/course/:courseId`, `/api/flashcards/lesson/:lessonId`, `/api/meditation`, `/api/music`.
Session management is handled by Passport.js, storing sessions in PostgreSQL with a 7-day expiration.

### Core Features and Design Choices

- **UI/UX**: "Contemplative Minimalism" with cosmic indigo-black and amethyst color scheme.
- **AI Persona**: Empathetic, Socratic, drawing from diverse wisdom traditions.
- **Voice Interaction**: Seamless speech-to-text and text-to-speech.
- **Data Model**: PostgreSQL with Drizzle ORM, ensuring stable user IDs.
- **Authentication**: Replit Auth with email as the stable user identifier.
- **Admin Access Control**: 
  - **CRITICAL SECURITY**: Only `leratom2012@gmail.com` (Lerato Mogajane) has admin access
  - Admin middleware (`isAdmin`) checks authenticated email against hardcoded constant `ADMIN_EMAIL`
  - Cannot be bypassed by database manipulation - hardcoded email verification only
  - Admin can grant premium/transformation tiers to test users
  - All admin routes (`/api/admin/*`) protected by both authentication and admin email check
- **Test User Detection**: Auto-detects test users based on email patterns (@test.com, @example.com, test@, popup@) and missing user data
- **Admin Dashboard**: For user and subscriber management with test user filtering.
- **Multi-page Navigation**: Comprehensive site structure including About, Shop, Courses, Ebooks, Blog, Contact, Privacy, Admin, and Academy pages.
- **Academy Dashboard**: Professional learning dashboard serving as payment callback URL, featuring:
  - **Profile Management**: Editable user profile with avatar upload capability
  - **Course Progress**: Enrolled courses display with visual progress tracking
  - **Video Learning**: Integrated video player for course lessons
  - **Flashcards**: Interactive flashcard system for knowledge retention
  - **Meditation Library**: Curated guided meditation tracks with audio player
  - **Focus Music**: Ambient music collection for study and meditation with streaming playback

## External Dependencies

### Third-Party Services

-   **Anthropic Claude API**: For AI chatbot responses.
-   **ElevenLabs API**: For premium text-to-speech (with browser TTS fallback).
-   **Neon Serverless PostgreSQL**: Database service.
-   **Replit Auth**: For user authentication (OpenID Connect).
-   **systeme.io**: For CRM and email marketing automation.

### Key NPM Dependencies

-   **Frontend**: `@tanstack/react-query`, `@radix-ui/*`, `date-fns`, `class-variance-authority`, `clsx`, `tailwind-merge`, `wouter`.
-   **Backend**: `@anthropic-ai/sdk`, `drizzle-orm`, `drizzle-kit`, `drizzle-zod`, `connect-pg-simple`, `zod`.
-   **Development**: `tsx`, `esbuild`, `@replit/*` plugins.

### Environment Variables

-   `ANTHROPIC_API_KEY`
-   `ELEVENLABS_API_KEY`
-   `SYSTEME_IO_API_KEY`
-   `DATABASE_URL`
-   `SESSION_SECRET`
-   `REPLIT_DOMAINS`
-   `REPL_ID`
-   `ISSUER_URL`

## systeme.io Integration

### Overview

Rapha Lumina integrates with systeme.io for comprehensive CRM and email marketing automation. All user interactions automatically sync to systeme.io, allowing for sophisticated email campaigns, contact segmentation, and customer journey tracking.

### Automatic Contact Syncing

**Newsletter Subscriptions:**
- When someone subscribes to the newsletter → Contact created/updated in systeme.io
- Automatically tagged with: `Newsletter Subscriber`

**User Registrations:**
- When a user registers via Replit Auth → Contact created/updated in systeme.io
- Full profile synced: email, first name, last name, location, age
- Automatically tagged with: `Registered User`

**Subscription Tier Changes:**
- When admin grants premium/transformation access → Contact tier tags updated in systeme.io
- Tier tags: `Free User`, `Premium User`, `Transformation User`
- Old tier tags automatically removed, new tier tag added

### Webhook Configuration

**Your Live Webhook URL:**
```
https://raphalumina.replit.app/api/webhooks/systemeio
```

**For Development/Testing:**
```
https://963bcd13-18f9-4103-8f8e-cfbb60fa0a95-00-ok9zs4smz5iv.janeway.replit.dev/api/webhooks/systemeio
```

**Setting Up Webhooks in systeme.io:**

**Option 1: Via Workflows (Recommended)**
1. In systeme.io, go to **Automations** → **Workflows** → **Create**
2. Select your trigger (e.g., "Contact Subscribed to Form", "Tag Added", "Sale Created")
3. Add action: **Call Webhook**
4. Enter your webhook URL: `https://your-app.replit.app/api/webhooks/systemeio`
5. Test with a form submission or tag addition

**Option 2: Via API (For Advanced Users)**
You can programmatically register webhooks using systeme.io's API (see their developer documentation).

**Supported Webhook Events:**
- `contact.created` - New contact added
- `contact.updated` - Contact information changed
- `tag.added` - Tag applied to contact
- `tag.removed` - Tag removed from contact
- `funnel.subscribed` - Form submission
- `sale.created` - New order/purchase
- `sale.cancelled` - Order cancelled

### Contact Tags Used

The system automatically manages these tags in systeme.io:

**User Status:**
- `Newsletter Subscriber` - Subscribed via landing page
- `Registered User` - Created account via Replit Auth

**Subscription Tiers:**
- `Free User` - Free tier (5 chats)
- `Premium User` - Premium tier ($29/month, 10 chats)
- `Transformation User` - Transformation package ($497 one-time, unlimited chats)

### API Client Implementation

The systeme.io client (`server/systemeio.ts`) provides these methods:
- `createOrUpdateContact()` - Create or update contact with email, name, custom fields
- `syncNewsletterSubscriber()` - Sync newsletter signup
- `syncUserRegistration()` - Sync full user profile
- `syncSubscriptionTier()` - Update tier tags
- `addTagToContact()` / `removeTagFromContact()` - Manage tags
- `getOrCreateTag()` - Ensure tag exists before using

All syncing operations run in the background (non-blocking) to maintain fast API response times.

### Error Handling

- API errors are logged but don't block user-facing operations
- Webhook receiver returns 200 OK immediately to prevent systeme.io retries
- All sync operations use `.catch()` to handle failures gracefully

### Testing the Integration

1. **Test Newsletter Sync:**
   - Subscribe to newsletter on landing page
   - Check systeme.io contacts for new entry with "Newsletter Subscriber" tag

2. **Test User Registration Sync:**
   - Register new user via Replit Auth
   - Verify contact appears in systeme.io with "Registered User" tag and full profile

3. **Test Tier Sync:**
   - Use admin panel to grant premium access to a user
   - Check systeme.io for updated tier tags

4. **Test Webhook Reception:**
   - Set up a workflow in systeme.io to call your webhook
   - Trigger the workflow (e.g., add a tag manually)
   - Check server logs for webhook event reception