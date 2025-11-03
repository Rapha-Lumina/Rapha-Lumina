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