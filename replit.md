# Rapha Lumina - Spiritual Wisdom Chatbot

## Overview
Rapha Lumina is a spiritual wellness platform featuring an AI-powered chatbot for philosophical and spiritual guidance, leveraging Anthropic's Claude AI. The platform combines conversational AI with a multi-page educational system offering courses, e-books, meditation resources, and community features. It includes a tiered subscription model (Free, Premium, Transformation) with direct signup, email verification, and integration with FlowyTeam CRM via Zapier.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
**Technology Stack**: React 18 with TypeScript, Vite, Wouter for routing, shadcn/ui (Radix UI) for components, and Tailwind CSS.
**Design System**: "Contemplative Minimalism" with a dark, cosmic aesthetic (indigo-black, amethyst accents), custom color palette, and specific typography (Cormorant Garamond, Inter, Spectral). Features a dark mode, responsive, mobile-first design.
**State Management**: TanStack Query for server state and caching; in-memory for session-based chat history.
**Voice Features**: Browser Web Speech API for speech-to-text, ElevenLabs API for text-to-speech (with browser TTS fallback).
**PWA**: Installable PWA with service worker for offline capabilities.
**Multi-Page Structure**: Includes public pages (Landing, About, Shop, Contact, Blog, Signup, Thank You), feature pages (Chat, Courses, Membership, Forum), user dashboard (Academy/LMS, profile, course progress), and admin dashboard.

### Backend
**Server Framework**: Express.js on Node.js with TypeScript.
**Authentication**: Email/password authentication using Passport Local Strategy with bcrypt. Users sign up directly, receive email verification, and log in. Includes forgot password flow and PostgreSQL-backed sessions (`connect-pg-simple`). Admin access is restricted by a hardcoded email.
**AI Integration**: Anthropic Claude (claude-3-5-sonnet) configured as "Rapha Lumina" persona for concise, empowering, Socratic responses.
**Data Persistence**: PostgreSQL via Neon serverless with Drizzle ORM.
**Email Service**: Resend API for transactional emails (verification, password reset).
**CRM Integration**: Zapier webhooks send verified user data to FlowyTeam CRM.

### Database Schema
**Core Tables**: `users`, `sessions`, `messages`, `newsletterSubscribers`, `subscriptions`, `blog_posts`, `forumPosts`, `forumReplies`, `forumLikes`.
**LMS Tables**: `courses`, `modules`, `lessons`, `enrollments`, `studentProgress`, `flashcards`, `meditationTracks`, `musicTracks`.
**User Fields**: Includes `id`, `email`, `password`, `firstName`, `lastName`, `address`, `dateOfBirth`, `emailVerified`, `isAdmin`, `createdAt`, `updatedAt`.
**Subscription Model**: Free (5 chats), Premium (10 chats, voice, priority support), Transformation (unlimited chats, full program access, coaching). Chat limits reset monthly.

### API Design
**Public Endpoints**: Newsletter subscription, signup, email verification, anonymous/authenticated chat.
**Protected Endpoints**: User profile, chat history, TTS generation, subscription details, course enrollment, lesson progress.
**Admin Endpoints**: User management, subscriber lists, subscription management, premium access grants, test user toggles.
**Chat Limit Enforcement**: Middleware checks subscription tier and usage.

### User Profile Management
Users can manage their profile via a dedicated settings page (`/profile`) with tabs for:
- **Personal Info**: Edit name, address, date of birth, upload profile picture.
- **Security**: Change password with current password verification.
- **Membership**: View current subscription tier, chat limits, and upgrade options.
- **Courses**: List enrolled courses with progress.
Avatar images are stored in `attached_assets/uploads/avatars/`.

## External Dependencies

**AI Services**:
- Anthropic Claude API: Core chatbot intelligence.
- ElevenLabs API: High-quality voice synthesis.

**Database**:
- Neon Serverless PostgreSQL: Fully managed database.
- Drizzle ORM: Type-safe query builder.

**Authentication**:
- Passport.js: Local Strategy for email/password authentication.
- Bcrypt: Password hashing.
- connect-pg-simple: PostgreSQL-backed session management.

**Email Service**:
- Resend: Transactional email service for verification and password reset emails.
- Email sender: `Rapha Lumina <support@raphalumina.com>`.

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

**Environment Variables**: `ANTHROPIC_API_KEY`, `DATABASE_URL`, `SESSION_SECRET`, `ELEVENLABS_API_KEY`, `RESEND_API_KEY`, `ZAPIER_WEBHOOK_URL`, `ODOO_URL`, `ODOO_DB`, `ODOO_USERNAME`, `ODOO_API_KEY`, `REPLIT_DOMAINS`, `BASE_URL`.

**Business Management**:
- Odoo ERP: Customer relationship management, subscription tracking, business analytics.
- XML-RPC: API communication protocol for Odoo integration.

## Recent Features & Updates

### Odoo ERP Integration (November 7, 2025)

Integrated Odoo business management system for comprehensive CRM, subscription tracking, and customer management:

**Core Capabilities**:
- **Automatic Customer Sync**: Verified users automatically synced to Odoo CRM as `res.partner` contacts upon email verification
- **Subscription Tracking**: User subscription tiers (Free, Premium, Transformation) automatically synced to Odoo customer records
- **Manual Sync Control**: Admin dashboard provides one-click bulk sync and individual user sync options
- **Real-time Updates**: Subscription changes (tier upgrades/downgrades) immediately sync to Odoo

**Technical Implementation**:
- **Service Module** (`server/odoo.ts`): XML-RPC client for Odoo API with authentication via API key
- **Customer Operations**: Create, update, and search partner records in Odoo
- **Graceful Degradation**: Works without configuration, logs informative warnings when disabled
- **Error Resilience**: Failed syncs don't interrupt user workflows (verification, subscription changes proceed)

**Admin Dashboard Features**:
- Visual connection status indicator (Connected/Not Configured)
- One-click "Sync All Users to Odoo" with real-time progress
- Detailed sync results showing successful/failed counts
- Configuration instructions with required environment variables

**Data Mapping to Odoo**:
- `name`: Full name (firstName + lastName) or email fallback
- `email`: User email (unique identifier)
- `street`: User address
- `customer_rank`: Set to 1 (marks as active customer)
- `comment`: Subscription tier + date of birth for reference

**Configuration**:
Set environment variables to enable:
- `ODOO_URL`: Odoo instance URL
- `ODOO_DB`: Database name
- `ODOO_USERNAME`: User email
- `ODOO_API_KEY`: API key from Odoo user preferences

**API Endpoints** (Admin only):
- `GET /api/admin/odoo/status` - Check configuration status
- `POST /api/admin/odoo/sync-user` - Sync specific user
- `POST /api/admin/odoo/sync-all-users` - Bulk sync all verified users