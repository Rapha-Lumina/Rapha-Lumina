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
**Multi-Page Structure**: Includes public pages (Landing, About, Shop, Contact, Blog, Confirm Signup), feature pages (Chat, Courses, Membership), user dashboard (Academy/LMS, profile, course progress), admin dashboard, and Community Forum. Shop page includes eBooks section and "Coming Soon" area for future physical products.

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
- **Featured Image**: Beautiful contemplative sunset image (`/attached_assets/image_1761840686623.png`) showing person in prayer/meditation pose with hands together, representing peaceful spiritual awakening
- **Landing Page Integration**: "Begin Your Journey" button now links directly to `/blog/begin-your-journey` for seamless user journey
- **SEO Optimization**: Slug-based URLs improve search engine discoverability and social sharing
- **Content Format**: Blog posts support markdown-style formatting with headers (##), bold text (**), author attribution (—), and regular paragraphs

### Newsletter Section Visibility (October 30, 2025)

Newsletter section now appears for all users to match mobile experience:
- **Landing Page**: "Join the Awakening" newsletter section now visible for all users (authenticated and non-authenticated)
- **Systeme.io Script**: Popup script now loads for all users to enable newsletter signup functionality
- **Desktop/Mobile Parity**: Desktop version now matches the preferred mobile layout
- **Timed Popup**: Still only appears for non-authenticated users (10-second delay)
- **Join Awakening Page**: Shows "Start Chatting" button for authenticated users, "Join Now" for non-authenticated
- **Signup Page**: Automatically redirects authenticated users to /chat page

### Awakening to Consciousness Course Image (October 30, 2025)

Added custom spiritual imagery for the flagship "Awakening to Consciousness" course:
- **Course Image**: Beautiful sunset image with hands reaching toward the light, symbolizing awakening and consciousness expansion
- **Location**: `attached_assets/image_1761840836558.png`
- **Database Path**: `/attached_assets/image_1761840836558.png`
- **Applied To**: First course (Beginner level) in Rapha Lumina Academy courses catalog
- **Visual Theme**: Reaching toward divine light, spiritual awakening, consciousness expansion, golden sunset symbolism
- **Purpose**: Visually represents the journey from darkness to light, the core theme of awakening to consciousness

### Courses Page Hero Image (October 30, 2025)

Added inspiring background image to the Rapha Lumina Academy courses page:
- **Hero Background**: Beautiful sunset image with hands reaching toward divine light (`/attached_assets/image_1761842537823.png`)
- **Implementation**: Background image with 20% opacity and dark gradient overlay for text readability
- **Location**: Hero section at top of `/courses` page
- **Visual Impact**: Creates an inspiring, spiritual atmosphere while maintaining clean UI and text legibility
- **Purpose**: Reinforces the platform's spiritual mission and creates visual consistency with course imagery

### Page Reorganization: Shop, Membership, and eBooks (October 31, 2025)

Restructured navigation and pages to better align with product strategy:
- **Shop Page** (`/shop`): Now serves dual purpose with "Coming Soon" section for future physical products (clothes, nootropics, spiritual tools) and complete eBooks library section with all 5 eBooks and bundle offer
- **Membership Page** (`/membership`): New dedicated page for subscription tiers (Free, Premium, Transformation) with currency toggle (USD/ZAR), replaced previous /ebooks route
- **Navigation Update**: "eBooks" navigation item replaced with "Membership" item, linking to /membership
- **eBooks Integration**: All eBook content (5 books, bundle offer, topics, pricing) now displayed on Shop page under "Wisdom Library" section
- **Coming Soon Section**: Shop page hero announces upcoming physical products with newsletter signup prompt
- **Cross-linking**: eBooks section links to Membership page for Transformation Package (includes all eBooks)
- **Route Changes**: `/ebooks` route removed, replaced with `/membership` route
- **Purpose**: Clearer separation between subscription memberships and product purchases, while preparing for physical product launch

### Community Forum Implementation (October 31, 2025)

Implemented a comprehensive community forum feature accessible to all authenticated users:
- **Database Schema**: Three tables - `forumPosts` (title, content, category, likeCount, replyCount, isPinned), `forumReplies` (postId, content, likeCount), `forumLikes` (userId, postId/replyId references)
- **Categories**: general, meditation, philosophy, guidance, community
- **API Routes**: All protected with isAuthenticated middleware, using Zod validation (insertForumPostSchema, insertForumReplySchema, insertForumLikeSchema)
- **Forum Listing** (`/forum`): Displays all posts with category filters, create post dialog, like/reply counts, sorted by pinned then date
- **Post Detail** (`/forum/:id`): Full post with replies, like buttons for posts and replies, reply form
- **Like System**: Toggle functionality with proper database synchronization (decrements count before deleting like record)
- **Frontend Guards**: Queries enabled only when authenticated, mutations check authentication and postId before API calls
- **Navigation**: Added "Forum" link to main navigation with Users icon
- **Access Level**: Available to all authenticated users as part of free tier benefits

### Systeme.io Direct Links Integration (November 3, 2025)

Switched from popup-based forms to direct links for systeme.io signup and newsletter:
- **Sign Up URL**: `https://www.raphalumina.com/sign-up` - All "Sign up" buttons now use direct navigation
- **Join Now URL**: `https://www.raphalumina.com/join-now` - All "Join Now" newsletter buttons use direct navigation
- **Implementation**: Removed popup script loading from Navigation component, replaced all popup classes with direct `href` links
- **Button Targets**: All external systeme.io links open in new tabs with `target="_blank"` and `rel="noopener noreferrer"` for security
- **Affected Pages**: Landing, Shop, Signup, Join Awakening, Navigation (desktop/mobile)
- **Benefits**: Consistent behavior across development and production environments, simpler implementation, better reliability