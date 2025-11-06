# Rapha Lumina - Spiritual Wisdom Chatbot

## Overview
Rapha Lumina is a spiritual wellness platform offering an AI-powered chatbot for philosophical and spiritual guidance, leveraging Anthropic's Claude AI. It integrates conversational AI with a multi-page educational platform featuring courses, e-books, meditation resources, and community features. The platform employs a tiered subscription model (Free, Premium, Transformation) with direct signup and email verification, integrating with FlowyTeam CRM via Zapier webhooks for customer relationship management.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
**Technology Stack**: React 18 with TypeScript, Vite, Wouter for routing, and shadcn/ui (Radix UI) for components, styled with Tailwind CSS.
**Design System**: "Contemplative Minimalism" with a dark, cosmic aesthetic (indigo-black, amethyst accents), custom color palette (deep purple, teal, gold), and specific typography (Cormorant Garamond, Inter, Spectral). Features a dark mode, responsive, mobile-first design.
**State Management**: TanStack Query for server state and caching; in-memory for session-based chat history.
**Voice Features**: Browser Web Speech API for speech-to-text, ElevenLabs API for text-to-speech (with browser TTS fallback).
**PWA**: Installable PWA with service worker for offline capabilities.
**Multi-Page Structure**: Includes public pages (Landing, About, Shop, Contact, Blog, Signup, Thank You), feature pages (Chat, Courses, Membership, Forum), user dashboard (Academy/LMS, profile, course progress), and admin dashboard.

### Backend
**Server Framework**: Express.js on Node.js with TypeScript.
**Authentication**: Email/password authentication using Passport Local Strategy with bcrypt. Users sign up directly on the website, receive email verification, and log in with credentials. Includes forgot password flow and PostgreSQL-backed sessions (`connect-pg-simple`). Admin access controlled by a hardcoded email.
**AI Integration**: Anthropic Claude (claude-3-5-sonnet) configured as "Rapha Lumina" persona for concise, empowering, Socratic responses.
**Data Persistence**: PostgreSQL via Neon serverless with Drizzle ORM.
**Email Service**: Resend API for transactional emails (verification, password reset).
**CRM Integration**: Zapier webhooks send verified user data to FlowyTeam CRM.

### Database Schema
**Core Tables**: `users`, `sessions`, `messages`, `newsletterSubscribers`, `subscriptions`, `blog_posts`, `forumPosts`, `forumReplies`, `forumLikes`.
**LMS Tables**: `courses`, `modules`, `lessons`, `enrollments`, `studentProgress`, `flashcards`, `meditationTracks`, `musicTracks`.
**User Fields**: `id`, `email`, `password`, `firstName`, `lastName`, `address`, `dateOfBirth`, `emailVerified`, `verificationToken`, `verificationTokenExpires`, `resetPasswordToken`, `resetPasswordExpires`, `isAdmin`, `isTestUser`, `createdAt`, `updatedAt`.
**Subscription Model**: Free (5 chats), Premium (10 chats, voice, priority support), Transformation (unlimited chats, full program access, coaching). Chat limits reset monthly.

### API Design
**Public Endpoints**: Newsletter subscription, signup, email verification, anonymous/authenticated chat.
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

**Email Service**:
- Resend: Transactional email service for verification and password reset emails.
- Email sender in development: `onboarding@resend.dev` (Resend's test domain)
- Production requires verified domain setup in Resend dashboard.

**CRM Integration**:
- FlowyTeam: CRM for customer management.
- Zapier: Webhook automation to sync verified users to FlowyTeam.

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

**Environment Variables**: `ANTHROPIC_API_KEY`, `DATABASE_URL`, `SESSION_SECRET`, `ELEVENLABS_API_KEY`, `RESEND_API_KEY`, `ZAPIER_WEBHOOK_URL` (optional).

## Recent Updates

### Direct Signup with Email Verification (November 6, 2025)

Implemented a complete direct signup system with email verification, replacing the previous external signup flow:

**Database Schema Changes**:
- Added `address` field to users table (varchar, nullable)
- Added `dateOfBirth` field (varchar, nullable, format: DD/MM/YYYY)
- Added `emailVerified` field (varchar, default "false", determines login access)
- Added `verificationToken` field (varchar, nullable, 32-byte hex string)
- Added `verificationTokenExpires` field (timestamp, nullable, 24-hour expiry)

**Signup Flow**:
1. User visits `/signup` page on the website
2. User fills out form: First Name, Last Name, Address, Date of Birth (DD/MM/YYYY), Email, Password
3. Password requirements: minimum 8 characters, one uppercase letter, one lowercase letter, one number
4. User submits form → account created with `emailVerified: "false"`
5. Verification email sent via Resend API with unique 24-hour token
6. User redirected to `/thank-you` page with instructions to check email
7. User clicks verification link in email → `/verify-email?token={token}` page
8. Backend verifies token, marks `emailVerified: "true"`, grants free tier subscription (5 chats/month)
9. Webhook sent to Zapier with user data (id, email, firstName, lastName, address, dateOfBirth, tier)
10. Zapier forwards data to FlowyTeam CRM for customer management
11. User can now log in at `/login` with email and password

**Security Features**:
- Bcrypt password hashing with 10 salt rounds
- Passport Local Strategy for authentication
- Session-based authentication with PostgreSQL storage (connect-pg-simple)
- Email verification required before login (checked in Passport strategy)
- Verification tokens: cryptographically secure (32-byte random), expire in 24 hours, single-use
- Password reset flow with time-limited tokens (1-hour expiry)
- Admin access restricted to hardcoded email (leratom2012@gmail.com)

**New Frontend Pages**:
- `/signup` - Complete signup form with all user information and password creation
- `/thank-you` - Post-signup confirmation with email check instructions
- `/verify-email` - Email verification handler (accepts token query parameter)
- `/login` - Email/password login form (blocks unverified users)
- `/forgot-password` - Password reset request form
- `/reset-password` - Token-validated password reset form

**Backend Routes**:
- `POST /api/signup` - Creates user account, generates verification token, sends verification email
- `GET /api/verify-email?token={token}` - Verifies email, grants free tier, sends Zapier webhook
- `POST /api/login` - Authenticates user (checks emailVerified === "true")
- `POST /api/logout` - Destroys session
- `POST /api/forgot-password` - Generates reset token, sends password reset email
- `POST /api/reset-password` - Validates token and updates password

**Email Templates**:
- Verification email: Welcome message with clickable verification button (24-hour expiry notice)
- Password reset email: Secure reset link with 1-hour expiry
- Both emails sent from: `Rapha Lumina <onboarding@resend.dev>` (development/testing)

**CRM Integration**:
- On email verification, sends webhook to `ZAPIER_WEBHOOK_URL` with event type `user_verified`
- Webhook payload includes: user id, email, firstName, lastName, address, dateOfBirth, verifiedAt timestamp, tier
- Zapier catches webhook and creates/updates contact in FlowyTeam CRM
- CRM sync happens automatically in background, doesn't block user experience

**Removed Features**:
- All systeme.io integration code removed (webhooks, API client, sync functions)
- External signup links removed
- create-password page flow replaced with direct password creation in signup

**Migration Notes**:
- Existing users created before this update will have `emailVerified: "false"` by default
- Admin can manually verify users or grant them verified status if needed
- No breaking changes to existing authenticated sessions
