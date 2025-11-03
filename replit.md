# Rapha Lumina - Spiritual Wisdom Chatbot

## Overview
Rapha Lumina is a spiritual wellness platform offering an AI-powered chatbot for philosophical and spiritual guidance, leveraging Anthropic's Claude AI. It integrates conversational AI with a multi-page educational platform featuring courses, e-books, meditation resources, and community features. The platform employs a tiered subscription model (Free, Premium, Transformation) managed via systeme.io for payments and CRM, aiming to provide a holistic spiritual growth experience.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
**Technology Stack**: React 18 with TypeScript, Vite, Wouter for routing, and shadcn/ui (Radix UI) for components, styled with Tailwind CSS.
**Design System**: "Contemplative Minimalism" with a dark, cosmic aesthetic (indigo-black, amethyst accents), custom color palette (deep purple, teal, gold), and specific typography (Cormorant Garamond, Inter, Spectral). Features a dark mode, responsive, mobile-first design.
**State Management**: TanStack Query for server state and caching; in-memory for session-based chat history.
**Voice Features**: Browser Web Speech API for speech-to-text, ElevenLabs API for text-to-speech (with browser TTS fallback).
**PWA**: Installable PWA with service worker for offline capabilities.
**Multi-Page Structure**: Includes public pages (Landing, About, Shop, Contact, Blog, Confirm Signup), feature pages (Chat, Courses, Membership, Forum), user dashboard (Academy/LMS, profile, course progress), and admin dashboard.

### Backend
**Server Framework**: Express.js on Node.js with TypeScript.
**Authentication**: Email/password authentication using Passport Local Strategy with bcrypt. Users sign up via systeme.io webhook, then create a password. Includes forgot password flow and PostgreSQL-backed sessions (`connect-pg-simple`). Admin access controlled by a hardcoded email.
**AI Integration**: Anthropic Claude (claude-3-5-sonnet) configured as "Rapha Lumina" persona for concise, empowering, Socratic responses.
**Data Persistence**: PostgreSQL via Neon serverless with Drizzle ORM.
**Test User Detection**: Automatic identification of test users for filtering in the admin dashboard.

### Database Schema
**Core Tables**: `users`, `sessions`, `messages`, `newsletterSubscribers`, `subscriptions`, `blog_posts`, `forumPosts`, `forumReplies`, `forumLikes`.
**LMS Tables**: `courses`, `modules`, `lessons`, `enrollments`, `studentProgress`, `flashcards`, `meditationTracks`, `musicTracks`.
**Subscription Model**: Free (5 chats), Premium (10 chats, voice, priority support), Transformation (unlimited chats, full program access, coaching). Chat limits reset monthly.

### API Design
**Public Endpoints**: Newsletter subscription, anonymous/authenticated chat, systeme.io webhooks.
**Protected Endpoints**: User profile, chat history, TTS generation, subscription details, course enrollment, lesson progress.
**Admin Endpoints**: User management, subscriber lists, subscription management, premium access grants, test user toggles.
**Chat Limit Enforcement**: Middleware checks subscription tier and usage.

## External Dependencies

**AI Services**:
- Anthropic Claude API: Core chatbot intelligence.
- ElevenLabs API: High-quality voice synthesis (optional, with browser TTS fallback).

**Database**:
- Neon Serverless PostgreSQL: Fully managed database.
- Drizzle ORM: Type-safe query builder.

**Authentication**:
- Passport.js: Local Strategy for email/password authentication.
- Bcrypt: Password hashing.
- connect-pg-simple: PostgreSQL-backed session management.

**Payment/CRM Integration**:
- systeme.io: Sales funnels, payment processing, email marketing, CRM, with webhook integration.

**Frontend Libraries**:
- Radix UI: Accessible component primitives.
- Lucide Icons: Icon system.
- date-fns: Date manipulation.
- Wouter: Client-side routing.

**Development Tools**:
- Vite: Build tool and dev server.
- TypeScript: Type safety.
- Zod: Runtime validation.
- Tailwind CSS: Utility-first styling.

**Environment Variables**: `ANTHROPIC_API_KEY`, `DATABASE_URL`, `SESSION_SECRET`, `ELEVENLABS_API_KEY`, `SYSTEME_IO_API_KEY`, `SYSTEME_IO_WEBHOOK_SECRET` (optional), `VITE_SYSTEME_IO_JOIN_URL`.

## Recent Updates

### Email/Password Authentication System (November 3, 2025)

Replaced social login (Replit Auth) with traditional email/password authentication for better user control and security:

**Database Schema Changes**:
- Added `password` field to users table (text, nullable, stores bcrypt hash)
- Added `resetToken` field (text, nullable, 32-byte hex string)
- Added `resetTokenExpires` field (timestamp, nullable, 1-hour expiry)

**Authentication Flow**:
1. User signs up via systeme.io (external site: `https://www.raphalumina.com/sign-up`)
2. systeme.io webhook (`POST /api/webhooks/systemeio` with type: "contact.created") creates user record in database without password
3. systeme.io sends confirmation email with "create password" link to user
4. User clicks link → `/create-password?email={email}` page
5. User creates password (minimum 8 characters, mixed case, number required) → stored as bcrypt hash
6. User logs in at `/login` with email/password credentials

**Security Features**:
- Bcrypt password hashing with 10 salt rounds
- Passport Local Strategy for authentication
- Session-based authentication with PostgreSQL storage (connect-pg-simple) or in-memory fallback for development
- Environment-based cookie security (secure: true in production, false in development)
- CSRF protection with sameSite: 'lax' cookie setting
- Password complexity requirements: minimum 8 characters, at least one uppercase letter, one lowercase letter, and one number
- Password reset flow with time-limited tokens (1-hour expiry)
- 32-byte cryptographically secure random reset tokens (crypto.randomBytes)
- Admin access restricted to hardcoded email (leratom2012@gmail.com)

**New Frontend Pages**:
- `/login` - Email/password login form with "Forgot password?" link
- `/create-password` - Initial password creation with email verification
- `/forgot-password` - Email submission to request password reset
- `/reset-password` - Token-validated password reset form

**Backend Routes**:
- `POST /api/create-password` - Creates password for user account (validates user exists, no existing password)
- `POST /api/login` - Authenticates user with email/password using Passport
- `POST /api/logout` - Destroys session and logs out user
- `POST /api/forgot-password` - Generates reset token and expiry (email placeholder logs to console)
- `POST /api/reset-password` - Validates token/expiry and updates password

**Removed Features**: All social login options (Google, GitHub, X, Apple) removed

**Webhook Configuration**: User must configure webhook in systeme.io dashboard:
- Settings → Webhooks → Add webhook URL: `https://raphalumina.com/api/webhooks/systemeio`
- Event type: "contact.created" (triggers user account creation)
- Optional: Set webhook secret in `SYSTEME_IO_WEBHOOK_SECRET` environment variable for validation