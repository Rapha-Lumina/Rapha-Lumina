# Rapha Lumina - Spiritual Wisdom Chatbot

## Overview

Rapha Lumina is a spiritual wellness platform featuring an AI-powered chatbot that provides philosophical and spiritual guidance. The application channels wisdom from diverse traditions using Anthropic's Claude AI, combining conversational AI with a multi-page educational platform offering courses, e-books, meditation resources, and community features. The platform utilizes a tiered subscription model (Free, Premium, Transformation) with chat limits and premium features, integrated with systeme.io for payments and CRM, aiming to provide a comprehensive spiritual growth experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

**Technology Stack**: React 18 with TypeScript, Vite, Wouter for routing, and shadcn/ui (Radix UI) for components, styled with Tailwind CSS.
**Design System**: "Contemplative Minimalism" with cosmic indigo-black backgrounds, amethyst accents, custom color palette (deep purple, teal, gold), and specific typography (Cormorant Garamond, Inter, Spectral). Primarily dark mode, responsive, mobile-first design.
**State Management**: TanStack Query for server state and caching; in-memory for session-based chat history.
**Voice Features**: Browser Web Speech API for speech-to-text, ElevenLabs API for text-to-speech (with browser TTS fallback).
**PWA**: Installable PWA with service worker for offline capabilities and custom manifest.
**Multi-Page Structure**: Includes public pages (Landing, About, Shop, Contact, Blog), feature pages (Chat, Courses, E-books), user dashboard (Academy/LMS, profile, course progress), and admin dashboard.

### Backend

**Server Framework**: Express.js on Node.js with TypeScript.
**Authentication**: Replit Auth via OpenID Connect (Passport.js) for user identification, with email as the primary identifier. Session management uses `connect-pg-simple`.
**AI Integration**: Anthropic Claude (claude-3-5-sonnet) configured as "Rapha Lumina" persona, providing concise, empowering responses using Socratic dialogue and NLP.
**Admin Access Control**: Hardcoded admin email for secure access to administrative routes and functionalities (e.g., granting premium tiers).
**Data Persistence**: PostgreSQL via Neon serverless with Drizzle ORM.
**Test User Detection**: Automatic identification of test users based on email patterns or missing profile data for filtering in the admin dashboard.

### Database Schema

**Core Tables**: `users`, `sessions`, `messages`, `newsletterSubscribers`, `subscriptions`.
**LMS Tables**: `courses`, `modules`, `lessons`, `enrollments`, `studentProgress`, `flashcards`, `meditationTracks`, `musicTracks`.
**Subscription Model**: Free (5 chats), Premium ($20/month or R290/month for 10 chats, voice, priority support), Transformation ($470 one-time or R4970 one-time for unlimited chats, full program access, coaching). Chat limits reset monthly, tracked via Stripe IDs.

### API Design

**Public Endpoints**: Newsletter subscription, anonymous/authenticated chat, systeme.io webhooks.
**Protected Endpoints**: User profile, chat history, TTS generation, subscription details, course enrollment, lesson progress.
**Admin Endpoints**: User management, subscriber lists, subscription management, premium access grants, test user toggles.
**Chat Limit Enforcement**: Middleware checks subscription tier and usage before allowing chat, returning a 403 error if limits are exceeded.

## External Dependencies

**AI Services**:
- Anthropic Claude API: Core chatbot intelligence.
- ElevenLabs API: High-quality voice synthesis (optional, with browser TTS fallback).

**Database**:
- Neon Serverless PostgreSQL: Fully managed database.
- Drizzle ORM: Type-safe query builder.

**Authentication**:
- Replit Auth (OpenID Connect): Multi-provider authentication.
- Passport.js: Authentication middleware.

**Payment/CRM Integration**:
- systeme.io: Sales funnels, payment processing, email marketing, CRM, with webhook integration for purchase callbacks.

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

**Environment Variables**: `ANTHROPIC_API_KEY`, `DATABASE_URL`, `SESSION_SECRET`, `REPL_ID`, `REPLIT_DOMAINS`, `ISSUER_URL`, `ELEVENLABS_API_KEY`, `SYSTEME_IO_API_KEY`, `VITE_SYSTEME_IO_JOIN_URL`.

## Recent Updates

### Database-Backed Blog System with Slug-Based URLs (October 30, 2025)

Implemented a comprehensive blog system with database persistence and SEO-friendly slug-based URLs:
- **Database Schema**: Added `blog_posts` table with columns: id, slug (unique), title, excerpt, content, category, readTime, thumbnail, publishedAt, updatedAt
- **API Routes**: 
  - `GET /api/blog` - Returns all published blog posts
  - `GET /api/blog/slug/:slug` - Returns individual blog post by slug for SEO-friendly URLs
- **Blog Listing Page** (`/blog`): Fetches and displays all blog posts from database with fallback data, includes category filtering badges
- **Blog Detail Page** (`/blog/:slug`): Dynamic slug-based URLs (e.g., `/blog/begin-your-journey`), displays full article content with formatted markdown-style rendering
- **Featured Content**: "Begin Your Journey" blog post inserted into database, serves as main entry point for new users
- **Landing Page Integration**: "Begin Your Journey" button now links directly to `/blog/begin-your-journey` for seamless user journey
- **SEO Optimization**: Slug-based URLs improve search engine discoverability and social sharing
- **Content Format**: Blog posts support markdown-style formatting with headers (##), bold text (**), author attribution (—), and regular paragraphs

### Newsletter Popup Prevention for Authenticated Users (October 30, 2025)

Updated newsletter signup behavior to prevent systeme.io popup for authenticated users:
- **Landing Page**: Newsletter section and timed popup now hidden for authenticated users
- **Join Awakening Page**: Shows "Start Chatting" button (links to /chat) instead of "Join Now" for authenticated users
- **Signup Page**: Automatically redirects authenticated users to /chat page
- **Navigation**: Already correctly showing signup only for non-authenticated users
- **Result**: Authenticated users no longer see unwanted newsletter popups and have a cleaner, more relevant experience

### Awakening to Consciousness Course Image (October 30, 2025)

Added custom spiritual artwork for the flagship "Awakening to Consciousness" course:
- **Generated Image**: Ethereal spiritual awakening scene with lotus flower blooming in cosmic space, golden light rays emanating from consciousness center, mystical purple and indigo nebula background
- **Location**: `attached_assets/generated_images/Awakening_consciousness_spiritual_course_2d85b4fd.png`
- **Applied To**: First course (Beginner level) in Rapha Lumina Academy courses catalog
- **Visual Theme**: Peaceful meditation energy with sacred geometry patterns, third eye symbolism, enlightenment and transformation
- **Purpose**: Visually distinguishes the flagship course from generic stock photos, enhancing course appeal and brand identity