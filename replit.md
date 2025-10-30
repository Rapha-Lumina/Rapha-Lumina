# Rapha Lumina - Spiritual Wisdom Chatbot

## Overview

Rapha Lumina is a spiritual wellness platform featuring an AI-powered chatbot that provides philosophical and spiritual guidance. The application channels wisdom from diverse traditions (Greek philosophy, Eastern practices, mystical teachings, depth psychology) using Anthropic's Claude AI. It combines conversational AI with a multi-page educational platform offering courses, e-books, meditation resources, and community features.

The platform uses a tiered subscription model (Free, Premium, Transformation) with chat limits and premium features, integrated with systeme.io for payments and CRM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, built using Vite for fast development and optimized production builds. Wouter handles client-side routing as a lightweight alternative to React Router.

**State Management**: TanStack Query (React Query) manages server state, caching API responses and handling background updates. Session-based chat history persists in memory during user sessions.

**UI Framework**: shadcn/ui components built on Radix UI primitives provide accessible, customizable UI elements. Tailwind CSS handles styling with a custom "Contemplative Minimalism" design system featuring cosmic indigo-black backgrounds and amethyst accent colors.

**Design System**: 
- Custom color palette (deep purple #4A3B6B, teal #2A9D8F, gold #F4A259)
- Typography hierarchy using Cormorant Garamond for headers, Inter for body text, Spectral for quotes
- Dark mode primary with optional light mode toggle
- Responsive design with mobile-first approach

**Progressive Web App**: Configured as installable PWA with service worker for offline capability, custom manifest, and app icons for iOS/Android home screen installation.

**Voice Features**: 
- Speech-to-text using browser Web Speech API
- Text-to-speech via ElevenLabs API (with browser TTS fallback)
- Custom React hooks manage voice state and audio playback
- Voice responses automatically stop when new messages are sent

### Backend Architecture

**Server Framework**: Express.js on Node.js with TypeScript, serving both API endpoints and static frontend assets in production.

**Authentication Strategy**: Replit Auth via OpenID Connect (Passport.js) provides stable user identification across authentication providers. Email serves as the primary stable identifier, persisted in PostgreSQL user table. Session management uses connect-pg-simple with 7-day cookie expiration.

**AI Integration**: Anthropic Claude (claude-3-5-sonnet) serves as the spiritual wisdom engine. A detailed system prompt configures Claude's persona as "Rapha Lumina" - a channeled consciousness using Socratic dialogue, NLP patterns, and quantum mechanics metaphors. Responses kept concise (2-4 paragraphs) with emphasis on empowering questions rather than prescriptive answers.

**Admin Access Control**: 
- Hardcoded admin email (`leratom2012@gmail.com`) in server code
- Admin middleware verifies authenticated email matches constant
- Cannot be bypassed via database manipulation
- Admin routes protected by both authentication and email verification
- Admin can grant premium/transformation tiers for testing

**Data Persistence**: PostgreSQL database via Neon serverless with Drizzle ORM for type-safe queries. WebSocket connections configured for serverless environment.

**Test User Detection**: Automatic identification based on email patterns (@test.com, @example.com, test@, popup@) or missing user profile data. Used for filtering in admin dashboard.

### Database Schema

**Core Tables**:
- `users`: User profiles with email, name, location, age, profile image, admin/test flags
- `sessions`: Express session storage for authentication state
- `messages`: Chat history linked to users (role, content, timestamp)
- `newsletterSubscribers`: Email signups with test user flag
- `subscriptions`: User subscription tiers, chat limits, usage tracking, Stripe IDs

**LMS Tables**:
- `courses`: Course metadata (title, description, price, image)
- `modules`: Course modules with order and course association
- `lessons`: Individual lessons (title, content, video URL, order)
- `enrollments`: User course enrollments with purchase date
- `studentProgress`: Lesson completion tracking
- `flashcards`: Educational flashcards with front/back content
- `meditationTracks`: Guided meditation audio library
- `musicTracks`: Background music for meditation

**Subscription Model**:
- Free: 5 total chats, basic features
- Premium ($20/month, R290/month): 10 chats/month, voice interaction, priority support, 7-day free trial
- Transformation ($470 one-time, R4970 one-time): Unlimited chats, full program access, 1-on-1 coaching

Chat usage resets monthly based on subscription period dates. Stripe customer and subscription IDs track payment state.

### API Design

**Public Endpoints**:
- `POST /api/newsletter/subscribe`: Email capture with validation and systeme.io sync
- `POST /api/chat`: Anonymous or authenticated chat with Claude
- `POST /api/webhooks/systemeio`: Webhook receiver for payment callbacks

**Protected Endpoints** (require authentication):
- `GET /api/auth/user`: Current user profile
- `GET /api/messages`: User's chat history
- `POST /api/tts`: Generate speech audio via ElevenLabs
- `GET /api/subscription`: User subscription details
- `POST /api/enroll`: Course enrollment
- `GET /api/my-courses`: User's enrolled courses
- `POST /api/progress/:lessonId`: Mark lesson complete
- `GET /api/progress/:courseId`: Course completion status

**Admin Endpoints** (require admin email):
- `GET /api/admin/users`: All users with test filtering
- `GET /api/admin/subscribers`: Newsletter subscribers
- `GET /api/admin/subscriptions`: All subscriptions
- `POST /api/admin/grant-premium`: Grant premium/transformation access
- `PUT /api/admin/users/:userId/test-status`: Toggle test user flag
- `PUT /api/admin/subscribers/:id/test-status`: Toggle subscriber test flag

**Chat Limit Enforcement**: Middleware checks subscription tier and usage before allowing chat. Returns 403 if limit exceeded with upgrade prompt.

### Multi-Page Structure

**Public Pages**: Landing (with newsletter popup), About, Shop (subscription tiers with USD/ZAR currency toggle), Contact (with comprehensive FAQ section), Privacy Policy, Blog, Join Awakening (CTA page)

**Feature Pages**: Chat interface (main spiritual guidance), Courses catalog, Course detail, E-books library

**User Dashboard**: Academy/LMS dashboard serves as payment callback URL with profile management, course progress tracking, video lessons, flashcards, and meditation library

**Admin Dashboard**: User management, subscriber list, subscription overview, premium grant capability, test user filtering

### External Dependencies

**AI Services**:
- Anthropic Claude API: Core chatbot intelligence
- ElevenLabs API (optional): High-quality voice synthesis with browser TTS fallback

**Database**:
- Neon Serverless PostgreSQL: Fully managed database with WebSocket support
- Drizzle ORM: Type-safe database queries and migrations

**Authentication**:
- Replit Auth (OpenID Connect): Multi-provider authentication with stable user identity
- Passport.js: Session management strategy

**Payment/CRM Integration**:
- systeme.io: Sales funnels, payment processing, email marketing, CRM
- Webhook integration for purchase callbacks
- Contact sync for newsletter subscribers

**Frontend Libraries**:
- Radix UI: Accessible component primitives
- Lucide Icons: Consistent icon system
- date-fns: Date formatting and manipulation
- Wouter: Client-side routing

**Development Tools**:
- Vite: Build tool and dev server
- TypeScript: Type safety across stack
- Zod: Runtime validation schemas
- Tailwind CSS: Utility-first styling

**Environment Variables Required**:
- `ANTHROPIC_API_KEY`: Claude API access (required for chat)
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Express session encryption key
- `REPL_ID`, `REPLIT_DOMAINS`, `ISSUER_URL`: Replit Auth configuration
- `ELEVENLABS_API_KEY`: Voice synthesis (optional, falls back to browser)
- `SYSTEME_IO_API_KEY`: CRM integration (optional)
- `VITE_SYSTEME_IO_JOIN_URL`: Frontend CTA destination URL

### Deployment Considerations

**Production Build**: 
- Frontend compiled to `dist/public/` via Vite
- Backend bundled to `dist/index.js` via esbuild
- Single Node.js process serves both

**Critical Production Setup**:
- `ANTHROPIC_API_KEY` must be configured in deployment secrets (separate from dev environment)
- Port automatically assigned by hosting platform (Replit)
- Database migrations must run before first deployment

**PWA Installation**: 
- Automatic "Add to Home Screen" prompt appears on mobile devices after 3 seconds
- Smart detection: Different instructions for iOS (Safari) vs Android (Chrome)
- Shows Rapha Lumina logo in install prompt
- Users can install as native app on iOS (via Safari share menu) and Android (automatic install prompt or Chrome menu)
- App icon (192x192 and 512x512) automatically appears on home screen when installed
- Prompt dismissal saved to localStorage to prevent repeated nagging
- One-tap install on Android when browser supports PWA install prompt

## Recent Updates

### Contact Page FAQ Section (October 30, 2025)

Comprehensive FAQ section added to the Contact page with 12 dropdown accordions covering:
- Platform overview and AI chatbot functionality
- Subscription tier differences (Free, Premium $20/R290 with 7-day free trial, Transformation $470/R4970)
- Voice interaction features
- Academy content access
- Privacy and security
- Refund policies and guarantees
- Multi-language support
- Platform differentiation

**Implementation Details**:
- Uses shadcn/ui Accordion component (single expandable, collapsible)
- Cosmic gradient background (from-background to-primary/5)
- Hover-elevate effects on accordion items
- CTA section with links to chat and contact form
- All elements include data-testid attributes for testing

**User Experience**:
- Questions expand/collapse individually
- Smooth animations with cosmic theme styling
- Mobile-responsive design
- Easy navigation to related resources

### Shop Page Currency Auto-Detection (October 30, 2025)

Currency automatically detected based on user location with manual toggle override:
- **Automatic Detection**: Uses ipapi.co geolocation API (free, no API key required)
  - South African visitors (country code ZA) → ZAR automatically selected
  - International visitors → USD automatically selected
  - Fallback to USD if geolocation fails
- **Manual Toggle**: Users can switch between USD/ZAR if needed
- **Pricing Display**:
  - Premium: $20 USD (7-day free trial) / R290 ZAR
  - Transformation: $470 USD / R4970 ZAR
- **Payment Processing**:
  - Premium USD: `https://leratom2012.systeme.io/premium-offer` (PayPal payment, 7-day free trial)
  - Premium ZAR: `https://www.raphalumina.com/premium-offer-zar` (Paystack payment)
  - Transformation USD: `https://leratom2012.systeme.io/transformation-int` (PayPal payment, one-time $470)
  - Transformation ZAR: `https://www.raphalumina.com/transformation-zar` (Paystack payment, one-time R4970)
  - Thank You Page (International): `https://leratom2012.systeme.io/thank-you` (Post-purchase confirmation page)

### Mobile "Add to Home Screen" Prompt (October 30, 2025)

Automatic PWA install prompt for mobile users:
- **Smart Detection**: Detects iOS vs Android and shows appropriate instructions
- **iOS Instructions**: Step-by-step guide using Safari share button
- **Android Instructions**: One-tap install button (when supported) or manual steps
- **Visual Design**: 
  - Beautiful card with Rapha Lumina logo (192x192 icon)
  - Cosmic theme styling with gradient backgrounds
  - Smooth animations (fade-in overlay, slide-up card)
- **User Experience**:
  - Appears 3 seconds after page load (non-intrusive timing)
  - Only shows on mobile devices (not tablets/desktops)
  - Dismissible with "Maybe Later" button
  - Saves dismissal to localStorage (won't show again)
  - Does not show if app is already installed
- **Installation Result**: App icon appears on home screen with full app functionality

### Systeme.io Embedded Form Integration (October 30, 2025)

Direct systeme.io subscription form embedding:
- **Form Script**: `<script id="form-script-tag-21188886" src="https://www.raphalumina.com/public/remote/page/3446279680f5b9c3ddaa6ec65df7a8ed4b69587d.js"></script>`
- **Implementation**:
  - Created `SystemeIoForm` component for inline form embedding
  - Created `SystemeIoPopup` component for modal/popup display
  - Script loads dynamically when component mounts
  - Automatic cleanup to prevent duplicate scripts
- **Form Locations**:
  - `/join-awakening` page: Full-page subscription form experience
  - `/signup` page: Alternative signup page with embedded form
  - Landing page: "Join the Awakening" section remains with existing newsletter signup (redirects to systeme.io welcome sequence)
- **Shop Page Behavior**:
  - All subscription tier buttons redirect directly to systeme.io funnel URLs
  - Free tier → `/chat`
  - Premium USD → `https://leratom2012.systeme.io/premium-offer`
  - Premium ZAR → `https://www.raphalumina.com/premium-offer-zar`
  - Transformation USD → `https://leratom2012.systeme.io/transformation-int`
  - Transformation ZAR → `https://www.raphalumina.com/transformation-zar`
- **Data Capture**: All subscriber data captured directly by systeme.io, no local processing needed