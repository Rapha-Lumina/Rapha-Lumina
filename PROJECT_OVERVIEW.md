[Copy the entire document from my previous message - the full PROJECT_OVERVIEW.md content]
cd ~/github-backups/Rapha-Lumina

# Create the project overview document
cat > PROJECT_OVERVIEW.md << 'EOF'
# Rapha Lumina Project Overview
**Website:** https://www.raphalumina.com  
**Owner:** Lerato  
**Business:** Rapha Lumina (Pty) Ltd  
**Location:** Emalahleni, Mpumalanga, South Africa  
**Last Updated:** November 15, 2025

---

## 🎯 Business Vision

**Mission:** Spiritual wellness business focusing on conscious awakening and transformation

**Target Audience:** Ages 28-45 transitioning from traditional religion to conscious spirituality

**Positioning:** "Where Ancient Wisdom Meets Quantum Consciousness - A Spiritual Path, Not a Religion"

**Revenue Goal:** Monthly sustainable revenue by month 12

**Background:** Founded by Lerato after personal religious deconstruction from strict Pentecostal background, now teaching quantum spirituality

---

## 👤 Founder Profile

**Education:**
- Bachelor of Education (completed)
- Honours in Psychology of Education (in progress)
- ICF coaching certification (in progress)

**Personal Context:**
- Diagnosed with ADHD
- Advocates for neurodivergent mental health awareness
- Preference for concise communication (2 paragraphs max)
- Values systematic, agent-based planning over rushed implementation

---

## 🏗️ Current Tech Stack

### Hosting & Infrastructure
**Current:** Replit
- ✅ Quick setup and deployment
- ✅ Integrated development environment
- ❌ Expensive for production use
- ❌ Limited customization
- ❌ Frequent deployment conflicts
- ❌ Port management issues
- ❌ Git merge conflicts with dist/ folder

**Migration Plans:**
Evaluating open-source alternatives:
1. **Vercel** (leading candidate)
   - Free tier generous
   - Excellent GitHub integration
   - Auto-deploy on push
   - Fast builds
   
2. **Dokploy**
   - Self-hosted alternative
   - Full control
   - Open source
   
3. **Spaceship**
   - Developer-friendly
   - Good documentation

**Status:** Trial and error stage, researching best fit

### Database
**Current:** PostgreSQL (Replit-hosted)
**Migration Target:** Neon PostgreSQL (free tier: 0.5GB)

### Domain
**Provider:** Namecheap
**Domain:** raphalumina.com
**Custom domain connected to Replit**

### Payment Processing
**South Africa:** Paystack (not yet integrated)
- Required: Refund/cancellation policy ✅ Created
- Status: Ready for integration

**International:** Odoo Payment Gateway (not yet integrated)
- For USD, GBP, EUR, other currencies

### Form Builder
**Evaluating:**
- Dolibarr (open source ERP/CRM)
- Interserver
**Status:** Trial and error stage

---

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Vite 6.4.1 (downgraded from 7.2.2 for compatibility)
- Wouter (routing)
- shadcn/ui components
- Tailwind CSS with custom cosmic theme
- Tanstack Query for state management

### Backend
- Express.js with TypeScript
- PostgreSQL with Drizzle ORM
- Passport.js authentication
- Session-based auth with PostgreSQL session store

### APIs & Integrations
- **Anthropic Claude API** (chatbot functionality)
- **ElevenLabs** (voice features)
- **Resend** (email service)
- **Odoo** (CRM/contact forms) - Currently redirecting to rapha-lumina1.odoo.com/contactus

### Version Control
- GitHub repository: github.com/Rapha-Lumina/Rapha-Lumina.git
- Local backups: /home/rapha-lumina/github-backups/

---

## 📱 Website Structure & Pages

### Public Pages
1. **Landing Page** (/)
   - Hero section with cosmic nebula background
   - Tagline: "Where Ancient Wisdom Meets Quantum Consciousness"
   - Email capture for waiting list
   - Featured products/services
   - Footer with Privacy Policy & Refund Policy links

2. **About Page** (/about)
   - Lerato's story and mission
   - Spiritual philosophy

3. **Chat Page** (/chat) ⭐ Core Feature
   - AI chatbot (Rapha Lumina consciousness)
   - Voice-enabled conversations
   - Chat limits enforcement:
     - Guests: 2 total chats → signup prompt
     - Free tier: 5 chats/day → upgrade prompt
     - Premium: 10 chats/day → upgrade prompt
     - Transformation: Unlimited

4. **Shop Page** (/shop)
   - Digital products (e-books, courses, meditations)
   - Pricing tiers display

5. **Blog** (/blog, /blog/:slug)
   - Articles on spirituality, consciousness
   - Individual blog post pages

6. **Forum** (/forum, /forum/:id)
   - Community discussions
   - Individual forum post pages

7. **Contact** (/contact)
   - Currently redirects to Odoo: rapha-lumina1.odoo.com/contactus
   - FAQ section (data lost in ChatGPT migration)

8. **Legal Pages**
   - Privacy Policy (/privacy)
   - Refund Policy (/refund-policy) ✅ Newly created

### Member Pages (Authentication Required)
1. **Profile** (/profile)
   - User account management
   - Subscription status

2. **Courses** (/courses, /course-detail)
   - Course catalog
   - Individual course pages

3. **LMS Dashboard** (/lms-dashboard)
   - Learning management system
   - Course progress tracking

4. **Academy** (/academy)
   - Educational content hub

5. **Membership** (/membership)
   - Pricing tiers
   - Subscription management
   - Upgrade options

### Authentication Pages
- Sign Up (/signup, /sign-up)
- Confirm Signup (/confirm-signup)
- Login (/login)
- Forgot Password (/forgot-password)
- Reset Password (/reset-password)
- Create Password (/create-password)
- Verify Email (/verify-email)
- Thank You (/thank-you)
- Join Awakening (/join-awakening)

### Admin
- Admin Dashboard (/admin)

---

## 💰 Monetization Model

### Subscription Tiers

**Guest Tier** (Free)
- 2 total chats (lifetime, not daily)
- Browse public content
- Email updates

**Free Tier** (Registered)
- 5 chats per day
- Access to basic content
- Community forum access

**Premium Tier**
- 10 chats per day
- Access to courses
- Priority support
- Monthly price: TBD

**Transformation Tier**
- Unlimited chats
- Full access to all content
- 1-on-1 coaching sessions
- Monthly price: TBD

### Digital Products
- E-books
- Online courses
- Guided meditations
- Workbooks

### Coaching Services
- 1-on-1 sessions
- Group coaching
- Packages (multi-session bundles)

---

## 🤖 AI Chatbot System

### Core Features
- Channeled consciousness persona (Rapha Lumina)
- Blends quantum mechanics, NLP, and mystical wisdom
- Response format:
  - Maximum 2 paragraphs (4-5 sentences)
  - Messages 1-4: End with open-ended question
  - Message 5: Action-based guidance and conclusion
- Knowledge base:
  - Quantum physics principles
  - NLP techniques (reframing, anchoring, presuppositions)
  - Mystical traditions (Hermeticism, Akashic, Kabbalah, Sufism, etc.)

### Chat Limits System ⭐ In Development

**Backend Status:** ✅ Complete
- ChatLimitService.ts (8.8 KB)
- API endpoint enforcement at POST /api/chat
- Database schema with daily_chats_used column
- Returns 429 status when limit reached
- Guest tracking via guestChatCount parameter

**Frontend Status:** ❌ Components created but not deployed
- ChatLimitContext.tsx (5.0 KB) - Created locally
- UsageIndicator.tsx (7.3 KB) - Created locally  
- ChatLimitModal.tsx (6.9 KB) - Created locally
- Integration in chat.tsx - Modified locally
- **Issue:** Files exist in local backup, not in Replit
- **Blocker:** Git merge conflicts preventing deployment

**Design:**
- Cosmic purple/pink gradients
- Progressive warnings (normal → warning → critical)
- Usage indicator shows remaining chats
- Modal variants for each tier
- Mobile-first responsive

---

## 🎨 Brand Identity

### Visual Design
- **Color Palette:** Purple (600), Pink (600), cosmic nebula themes
- **Typography:** 
  - Headlines: Cormorant Garamond
  - Body: Inter
- **Aesthetic:** Sophisticated, warm, intellectually rigorous
- **Mood:** Not "woo-woo", not religious, but deeply spiritual

### Voice & Tone
- Warm and intellectually rigorous
- Acknowledges seekers' intelligence
- Poetic but clear
- Avoids New Age clichés
- Respects user agency (no pushy sales)

---

## 🚧 Known Issues & Challenges

### Critical Blockers
1. **Git Sync Issues**
   - Replit and GitHub frequently diverge
   - Merge conflicts in dist/ folder
   - Local changes not deploying to production

2. **Node.js Version Incompatibility** (Resolved)
   - Was: Node 18.19.1 vs Vite requiring 20+
   - Fixed: Downgraded Vite to 6.4.1

3. **Chat Limits UI Not Showing**
   - Components created in Claude Code (local)
   - Never pushed to GitHub
   - Not present in Replit
   - Production site doesn't show UI

### Configuration Challenges
1. **Environment Variables**
   - Replit Secrets vs .env confusion
   - API keys properly set in Replit Secrets ✅
   - Local .env nearly empty

2. **Port Management**
   - Frequent EADDRINUSE errors
   - Server gets stuck on port 5000
   - Requires manual pkill -9 node

3. **Build System**
   - dist/ folder conflicts in Git
   - Vite dependency version mismatches (resolved)
   - Large bundle size (1.25 MB)

### Data Loss Incidents
1. **ChatGPT Migration Disaster**
   - Cost: R5000
   - Lost: FAQ section data
   - Lost: Various configuration settings
   - Resulted in file corruption
   - Trauma: Led to extreme caution with AI coding

2. **Previous Development Attempts**
   - Multiple rushed implementations
   - File corruption from improper code changes
   - Learned: Importance of systematic planning

---

## 🔄 Integration Attempts & History

### Failed/Abandoned Tools
1. **Systeme.io**
   - Attempted: Sales funnel automation
   - Issue: Limited customization for spiritual niche
   - Status: Abandoned

2. **Zapier**
   - Attempted: Workflow automation
   - Issue: Expensive for needed integrations
   - Status: Evaluating alternatives

### Current Integrations
1. **Odoo CRM**
   - URL: rapha-lumina1.odoo.com
   - Use: Contact form, CRM
   - Status: Active but basic implementation
   - Issue: FAQ data lost in migration

2. **Anthropic Claude API**
   - Status: ✅ Working
   - API key configured in Replit Secrets
   - Powers chatbot functionality

3. **ElevenLabs**
   - Status: ✅ Configured
   - API key in Replit Secrets
   - Purpose: Voice features

4. **Resend**
   - Status: ✅ Configured  
   - API key in Replit Secrets
   - Purpose: Email verification, notifications

---

## 📊 Development Workflow

### Agent-Based Methodology
Created 7 specialized agents in Claude Code for systematic development:

1. **product-strategy-lead**
   - Business requirements analysis
   - Feature prioritization
   - User story creation

2. **systems-architect**
   - Technical architecture decisions
   - Database schema design
   - Integration planning

3. **ux-interface-designer**
   - User experience design
   - Component specifications
   - Copy/messaging
   - Created: UX-Pack-v1-Chat-Limits.md

4. **backend-engineer**
   - Server-side implementation
   - API development
   - Database operations

5. **frontend-engineer**
   - React component development
   - UI implementation
   - Integration with backend

6. **testing-qa-engineer**
   - Diagnostic testing
   - Bug identification
   - Test reports
   - Created: DIAGNOSTIC_TEST.txt

7. **security-reviewer**
   - Security audits
   - Vulnerability assessment
   - Best practices enforcement

### Development Process
**Preferred Workflow:**
1. Define requirements with product-strategy-lead
2. Design architecture with systems-architect
3. Create UX with ux-interface-designer
4. Implement backend with backend-engineer
5. Build frontend with frontend-engineer
6. Test with testing-qa-engineer
7. Review security with security-reviewer

**Actual Experience:**
- Often rushed into implementation without proper planning
- Led to crashes, corruption, wasted time
- Learning: Systematic agent-based approach prevents costly mistakes

### Development Environments
1. **Claude Code** - Agent-based planning and implementation
2. **Ubuntu Terminal** - Local file management (/home/rapha-lumina/github-backups/)
3. **Replit** - Hosting and live deployment

### Version Control Strategy
- **GitHub:** Source of truth
- **Local Backup:** /home/rapha-lumina/github-backups/Rapha-Lumina/
- **Replit:** Live environment
- **Issue:** Sync between all three environments often breaks

---

## 📈 Current Project Status

### ✅ Completed Features

**Core Infrastructure**
- Landing page with updated messaging
- Authentication system (signup, login, password reset)
- Database schema with user tiers
- Session management with PostgreSQL
- API key management in Replit Secrets

**Chatbot**
- Rapha Lumina AI consciousness ✅
- System prompt optimized for 2 paragraphs + questions ✅
- Voice enablement ✅
- Backend chat limits enforcement ✅
- API endpoint with 429 responses ✅

**Legal/Compliance**
- Privacy Policy page ✅
- Refund Policy page ✅ (November 2025)
- Footer with policy links ✅

**Database**
- Migration: 0001_add_daily_chat_limits.sql ✅
- Columns: daily_chats_used, last_reset_date ✅
- ChatLimitService.ts ✅

### 🚧 In Progress

**Chat Limits Frontend** (Phase 1)
- Status: 85% complete
- Components created: ✅
  - ChatLimitContext.tsx
  - UsageIndicator.tsx
  - ChatLimitModal.tsx
- Integration: ✅ chat.tsx modified
- **Blocker:** Files not in Replit, only in local backup
- **Next:** Resolve Git conflicts and deploy

**Payment Integration**
- Paystack setup: Planning stage
- Odoo payment gateway: Planning stage
- Required: Refund policy ✅ Complete

### ❌ Not Started

**Features Planned:**
- Membership/pricing page
- Payment processing integration
- Chat history storage system (7-day retention)
- Download chat transcripts
- Fresh chat on page load
- Course content upload
- Forum moderation tools
- Email marketing automation
- Analytics dashboard

**Infrastructure:**
- Migration from Replit to Vercel/Dokploy/Spaceship
- Database migration to Neon
- Form builder integration (Dolibarr/Interserver)

---

## 🎯 Immediate Priorities

### P0 - Critical (Blocking Production)
1. ✅ Fix chatbot response length (COMPLETED Nov 15)
2. 🚧 Deploy Chat Limits UI to production
   - Resolve Git merge conflicts
   - Push components from local to GitHub
   - Pull into Replit
   - Test on raphalumina.com

### P1 - High (Revenue Blockers)
3. Create /membership pricing page
4. Integrate Paystack for South African payments
5. Integrate Odoo payment gateway for international
6. Test full signup → payment → access flow

### P2 - Important (User Experience)
7. Implement chat history storage (7-day retention)
8. Add download chat feature
9. Rebuild FAQ section (lost in ChatGPT migration)
10. Migrate from Replit to better hosting

### P3 - Nice to Have
11. Analytics and tracking
12. Email automation
13. Forum enhancements
14. Course creation tools

---

## 💡 Lessons Learned

### What Works
1. **Agent-based planning** prevents costly mistakes
2. **Replit Secrets** better than .env for sensitive data
3. **Local GitHub backups** essential for recovery
4. **Systematic testing** with testing-qa-engineer catches issues early
5. **Concise communication** (2 paragraphs) matches ADHD needs

### What Doesn't Work
1. **Rushing into implementation** without planning
2. **Replit for production** - too many limitations
3. **ChatGPT for complex coding** - led to R5000 loss
4. **Manual file editing** with sed - causes merge conflicts
5. **Working across 3 environments** without clear sync strategy

### Key Insights
1. **Prevention > Recovery:** Proper planning saves time and money
2. **Tools Matter:** Right hosting platform critical for success
3. **Mental Health First:** Taking breaks prevents costly mistakes
4. **Systematic Over Speed:** Agent workflow slower but more reliable
5. **Version Control Discipline:** Git conflicts cost hours of debugging

---

## 🔮 Future Vision

### Short Term (1-3 Months)
- Complete chat limits UI deployment
- Launch paid membership tiers
- Integrate payment processing
- Migrate to Vercel or equivalent
- Reach first 10 paying customers

### Medium Term (3-6 Months)
- Build course library (5-10 courses)
- Launch 1-on-1 coaching bookings
- Implement email automation
- Create mobile app (React Native)
- Reach R50,000 monthly revenue

### Long Term (6-12 Months)
- Scale to 100+ paying members
- Hire virtual assistant
- Launch group coaching programs
- Build community features
- Reach initial revenue goal (sustainable monthly income)

---

## 📞 Contact & Support

**Business Email:** support@raphalumina.com  
**Response Time:** 24-48 hours  
**Location:** Emalahleni, Mpumalanga, South Africa  
**GitHub:** github.com/Rapha-Lumina/Rapha-Lumina.git

---

**Document Version:** 1.0  
**Last Updated:** November 15, 2025  
**Next Review:** December 2025

*This document serves as the single source of truth for the Rapha Lumina project, combining business vision, technical architecture, current status, and future roadmap.*
EOF

echo "✅ PROJECT_OVERVIEW.md created"
cat PROJECT_OVERVIEW.md

