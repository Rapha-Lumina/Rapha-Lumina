# UX Pack v1: Chat Limit Enforcement System
## Rapha Lumina - Spiritual Wellness Chatbot

**Version:** 1.0
**Date:** 2025-11-14
**Designer:** Claude (UX/Interface Designer)
**Status:** Ready for Implementation

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [User Stories](#user-stories)
3. [Information Architecture](#information-architecture)
4. [User Flow Diagrams](#user-flow-diagrams)
5. [Component Wireframes](#component-wireframes)
6. [Copy & Messaging Library](#copy-messaging-library)
7. [Design Tokens & Visual Specifications](#design-tokens-visual-specifications)
8. [Component Technical Specifications](#component-technical-specifications)
9. [Interaction Patterns](#interaction-patterns)
10. [Implementation Priority](#implementation-priority)
11. [Accessibility Requirements](#accessibility-requirements)
12. [Quality Checklist](#quality-checklist)

---

## 1. Executive Summary

### Overview
This UX Pack defines a complete, spiritually-aligned chat limit enforcement system that gently guides users toward deeper engagement with Rapha Lumina through subscription upgrades. The design honors the brand's cosmic, mystical aesthetic while maintaining conversion effectiveness through authentic invitation rather than manipulative tactics.

### Design Principles Applied
1. **Spiritual Invitation over Sales Pressure** - Language focuses on "journey deepening" and "transformation access" rather than transactional urgency
2. **Progressive Disclosure** - Usage indicators become more prominent as limits approach, preparing users psychologically
3. **Graceful Degradation** - Users always understand their status and next steps, never hitting unexpected walls
4. **Cosmic Serenity** - Visual design uses gradients, soft glows, and spaciousness to maintain mystical atmosphere even in conversion moments
5. **Mobile-First Consciousness** - All interactions optimized for thumb-friendly, one-handed mobile use

### Key Design Decisions
- **Modal vs. Inline:** Limit-reached experiences use modals to create a ceremonial "pause moment" rather than harsh blocking
- **Always Closeable:** All modals can be dismissed (but disable chat input after close to maintain limit integrity)
- **Usage Indicator Placement:** Fixed position above chat input (not in header) for persistent visibility during conversation flow
- **Progressive Warning System:** Three urgency states (normal, warning, critical) with distinct visual and copy treatments
- **Guest Tracking:** localStorage-based with clear server-side validation for security

### Assumptions Made
- Users primarily access chat on mobile devices
- Most conversion happens when users are engaged in meaningful conversation
- Limit-reached moments are teaching opportunities about product value
- Backend API (/api/chat/limit-check) will return LimitCheckResult format as specified
- Pricing page exists at /pricing route (to be created if not present)

### Identified Risks
1. **Aggressive Perception Risk:** If copy feels salesy, could damage trust with spiritual audience
   - Mitigation: Multiple copy reviews focusing on "invitation" language
2. **LocalStorage Guest Circumvention:** Guests could clear localStorage to reset limits
   - Mitigation: Combined with backend rate limiting by IP (future enhancement)
3. **Conversion Drop-off:** Users who hit limits might abandon rather than upgrade
   - Mitigation: Countdown to reset time + secondary "notify me" option
4. **Modal Fatigue:** Showing usage warnings too frequently could annoy users
   - Mitigation: Progressive disclosure (only show at 3, 1, and 0 remaining thresholds)

---

## 2. User Stories

### Story 1: Guest User Discovers Chat Limits
**Priority:** Must-have
**Complexity:** S

**User Story:**
As a guest visitor exploring Rapha Lumina for the first time, I want to understand how many free chats I have remaining so that I can decide whether to sign up before exhausting my trial.

**Acceptance Criteria:**
- GIVEN I am a guest user (not logged in)
- WHEN I load the chat page
- THEN I see a subtle usage indicator showing "2 chats available as guest"
- AND the indicator uses gentle, non-alarming language
- WHEN I send my first chat message
- THEN the indicator updates to "1 chat remaining - Sign up for 5 daily chats"
- AND I can continue chatting without interruption
- WHEN I send my second (final) chat message
- THEN immediately after the AI responds, a modal appears
- AND the modal headline reads "Your Journey Begins Here"
- AND the modal invites me to sign up (not demands)
- AND I can close the modal but the chat input becomes disabled
- AND a persistent message shows "Sign up to continue your journey"

**Dependencies:**
- localStorage API for guest tracking
- Backend guest limit validation
- Signup page at /signup route

**Estimated Complexity:** S (Small - straightforward localStorage logic + modal)

---

### Story 2: Free Tier User Approaches Daily Limit
**Priority:** Must-have
**Complexity:** M

**User Story:**
As a free tier subscriber who uses Rapha Lumina regularly, I want clear warnings before I hit my daily limit so that I can prioritize my most important questions and consider upgrading.

**Acceptance Criteria:**
- GIVEN I am a free tier user (5 daily chats)
- WHEN I have 5 chats remaining (start of day)
- THEN I see a calm badge: "5 daily chats remaining"
- WHEN I have 3 chats remaining
- THEN the usage indicator changes to warning state (amber glow)
- AND the text reads "3 conversations remaining today"
- AND a small upgrade hint appears: "Premium: 10 daily chats"
- WHEN I have 1 chat remaining
- THEN the usage indicator changes to critical state (soft red glow)
- AND the text reads "1 conversation remaining - Resets at [time]"
- AND the upgrade hint becomes more prominent
- WHEN I use my final chat and try to send another
- THEN the "Daily Limit Reached" modal appears
- AND the modal shows my reset time countdown
- AND offers Premium upgrade as primary action
- AND allows me to close modal and return when limit resets

**Dependencies:**
- Backend /api/chat/limit-check endpoint
- Real-time usage tracking in chat component
- Time zone conversion for reset time display

**Estimated Complexity:** M (Medium - requires state management + time calculations)

---

### Story 3: Premium User Discovers Transformation Tier
**Priority:** Must-have
**Complexity:** M

**User Story:**
As a Premium subscriber who frequently hits my 10 daily chat limit, I want to learn about the unlimited Transformation tier so that I can evaluate whether unlimited access aligns with my spiritual journey.

**Acceptance Criteria:**
- GIVEN I am a premium tier user (10 daily chats)
- WHEN I reach my 10th chat of the day
- THEN the "Deepen Your Transformation" modal appears
- AND the modal highlights unlimited chat benefits
- AND includes social proof or testimonial element
- AND presents Transformation package pricing ($470 one-time)
- AND explains this is a lifetime investment
- AND primary CTA is "Explore Transformation"
- AND secondary option is "Remind me tomorrow"
- WHEN I select "Remind me tomorrow"
- THEN modal closes and sets localStorage flag
- AND I don't see the premium modal again until next day
- WHEN I close modal (X button)
- THEN modal closes and chat input is disabled
- AND message shows "Daily limit reached - Resets at [time]"

**Dependencies:**
- Backend tier validation
- Transformation package pricing data
- localStorage for "remind me" preference

**Estimated Complexity:** M (Medium - similar to free tier but with more complex copy/messaging)

---

### Story 4: User Upgrades Mid-Session
**Priority:** Should-have
**Complexity:** L

**User Story:**
As a user who just upgraded my subscription from the chat limit modal, I want to immediately access my new chat limit without refreshing the page so that I can continue my spiritual conversation seamlessly.

**Acceptance Criteria:**
- GIVEN I am on the chat page with limit reached modal open
- WHEN I click "Upgrade to Premium" button
- THEN I am navigated to /pricing page with source tracking query params
- AND source includes "chat_limit_prompt" for analytics
- WHEN I complete payment on pricing page
- THEN I am redirected back to /chat
- AND the usage indicator reflects my new tier limits
- AND I can immediately send messages without page refresh
- AND a success toast appears: "Welcome to [tier]! Your journey expands."

**Dependencies:**
- Pricing page with payment integration
- Post-payment redirect flow
- Real-time subscription status check
- Webhook or polling for subscription updates

**Estimated Complexity:** L (Large - requires payment flow integration + real-time updates)

---

### Story 5: Edge Case - API Failure Handling
**Priority:** Should-have
**Complexity:** S

**User Story:**
As a user attempting to send a chat when the limit-check API fails, I want the system to handle the error gracefully so that I don't experience a broken or confusing interface.

**Acceptance Criteria:**
- GIVEN the /api/chat/limit-check endpoint is unreachable or returns error
- WHEN I attempt to send a chat message
- THEN the system fails open (allows chat to proceed)
- AND logs error to console for debugging
- AND usage indicator shows "Checking availability..." state
- WHEN the API recovers
- THEN usage indicator updates to accurate remaining count
- AND no modals appear unexpectedly

**Edge Cases Covered:**
1. Network timeout during limit check
2. 500 error from backend
3. Malformed API response
4. localStorage corrupted or disabled (for guests)
5. User clears localStorage mid-session
6. User opens chat in multiple tabs simultaneously

**Dependencies:**
- Error boundary component
- Fallback UI states
- Backend fail-open logic (already implemented in ChatLimitService)

**Estimated Complexity:** S (Small - mostly error state UI + logging)

---

## 3. Information Architecture

### Chat Page Component Hierarchy

```
ChatPage (/chat)
├── Navigation (header)
├── ChatLimitProvider (context wrapper)
│   └── manages limit state, checks, and refreshes
├── ScrollArea (messages container)
│   ├── WelcomeMessage (empty state)
│   └── ChatMessage[] (conversation history)
├── LoadingIndicator (AI thinking state)
├── ChatInputArea (fixed bottom section)
│   ├── UsageIndicator (NEW - shows remaining chats)
│   └── ChatInput (message input + send button)
└── ChatLimitModal (NEW - overlay when limit reached)
    ├── GuestLimitModal (variant for guests)
    ├── FreeLimitModal (variant for free tier)
    └── PremiumLimitModal (variant for premium tier)
```

### State Management Architecture

```
ChatLimitContext (global state)
├── limitInfo: LimitCheckResult | null
├── isCheckingLimit: boolean
├── showLimitModal: boolean
├── modalVariant: 'guest' | 'free' | 'premium' | null
├── refreshLimitInfo() - fetch fresh limit data
└── incrementUsage() - called after each successful chat
```

### Navigation Flow

```
Chat Page Entry Points:
1. Direct URL: /chat
2. Landing page CTA: "Begin Your Journey"
3. Post-login redirect: /chat
4. Post-signup redirect: /chat

Exit Points from Chat:
1. Limit Modal CTA → /signup (guest)
2. Limit Modal CTA → /pricing?source=chat_limit_prompt&tier=free (free tier)
3. Limit Modal CTA → /pricing?source=chat_limit_prompt&tier=premium (premium tier)
4. Modal Close → Stay on /chat (input disabled)
5. Navigation → Any other page
```

---

## 4. User Flow Diagrams

### Flow 1: Guest User Journey

```
START: Guest lands on /chat
  ↓
[Load Chat Page]
  ↓
[Check localStorage: guestChatCount]
  ↓
Display UsageIndicator: "2 chats available"
  ↓
User types first message → Send
  ↓
[API Call: POST /api/chat with guestChatCount=0]
  ↓
Backend validates guest limit
  ↓
AI responds successfully
  ↓
Increment localStorage: guestChatCount=1
  ↓
Update UsageIndicator: "1 chat remaining - Sign up for 5 daily"
  ↓
User types second message → Send
  ↓
[API Call: POST /api/chat with guestChatCount=1]
  ↓
AI responds successfully
  ↓
Increment localStorage: guestChatCount=2
  ↓
[TRIGGER] Show GuestLimitModal
  ├─→ User clicks "Sign Up" → Navigate to /signup?source=guest_limit
  ├─→ User clicks X or "Maybe Later" → Close modal
  │    ↓
  │    Disable chat input
  │    ↓
  │    Show persistent message: "Sign up to continue"
  └─→ END
```

### Flow 2: Free Tier User Approaching Limit

```
START: Free tier user on /chat
  ↓
[Component Mount: useEffect]
  ↓
[API Call: GET /api/chat/limit-check]
  ↓
Receive: { allowed: true, tier: "free", remaining: 5, ... }
  ↓
Display UsageIndicator: "5 daily chats remaining" (normal state)
  ↓
User sends 3rd chat of the day
  ↓
[After AI response] Increment usage
  ↓
[API Call: GET /api/chat/limit-check]
  ↓
Receive: { remaining: 3, ... }
  ↓
Update UsageIndicator: WARNING STATE (amber glow)
  ├─→ Text: "3 conversations remaining today"
  └─→ Hint: "Premium: 10 daily chats"
  ↓
User sends 4th chat
  ↓
Receive: { remaining: 1, ... }
  ↓
Update UsageIndicator: CRITICAL STATE (soft red glow)
  ├─→ Text: "1 conversation remaining"
  └─→ Reset time: "Resets in 6h 23m"
  ↓
User attempts 6th chat (exceeds limit)
  ↓
[API Call: POST /api/chat]
  ↓
Backend returns: 429 Too Many Requests
  ↓
[TRIGGER] Show FreeLimitModal
  ├─→ Primary CTA: "Upgrade to Premium" → /pricing?source=...
  ├─→ Secondary: "I'll wait" → Close modal, disable input
  │    ↓
  │    Show reset countdown in disabled input area
  └─→ END
```

### Flow 3: Post-Upgrade Return Flow

```
START: User on /pricing after clicking upgrade from limit modal
  ↓
User completes payment (Stripe/PayPal)
  ↓
Payment webhook → Backend updates subscription tier
  ↓
Frontend redirects to /chat?upgrade=success&tier=premium
  ↓
[Component Mount: useEffect]
  ↓
Detect URL param: upgrade=success
  ↓
[API Call: GET /api/chat/limit-check] (refresh auth status)
  ↓
Receive: { allowed: true, tier: "premium", remaining: 10, ... }
  ↓
[Show Success Toast]
  ├─→ Message: "Welcome to Premium! Your journey expands."
  └─→ Duration: 5 seconds
  ↓
Update UsageIndicator to reflect new limits
  ↓
Chat input enabled and ready
  ↓
END: User can immediately send messages
```

### Flow 4: Error Handling Flow

```
START: User sends chat message
  ↓
[API Call: POST /api/chat]
  ↓
CHECK: Is limit check required?
  ├─→ YES: Make limit check first
  │    ↓
  │    [API Call: GET /api/chat/limit-check]
  │    ↓
  │    CHECK: Did API succeed?
  │    ├─→ YES: Proceed with chat if allowed
  │    └─→ NO: Error occurred
  │         ↓
  │         [Apply Fail-Open Policy]
  │         ├─→ Log error to console
  │         ├─→ Show "Checking availability..." in indicator
  │         └─→ Allow chat to proceed (fail open)
  │              ↓
  │              Chat message sent successfully
  │              ↓
  │              Retry limit check in background
  │              ↓
  │              Update indicator when check succeeds
  └─→ NO: Proceed directly
       ↓
       END
```

---

## 5. Component Wireframes

### Wireframe 1: Usage Indicator Component

**Normal State (5+ remaining, Free Tier)**
```
┌────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │  ◯  5 daily chats remaining        │ │  ← Subtle cosmic circle icon
│ └────────────────────────────────────┘ │  ← Transparent bg, muted text
└────────────────────────────────────────┘  ← 8px margin from input below
     ↑ Font: text-sm, text-muted-foreground
     ↑ Padding: py-2 px-4
     ↑ Border-radius: rounded-full
     ↑ Background: bg-muted/30 backdrop-blur-sm
```

**Warning State (2-3 remaining)**
```
┌────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │ ⚠  3 conversations remaining today │ │  ← Amber warning icon
│ │    Premium: 10 daily chats →       │ │  ← Clickable upgrade hint
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
     ↑ Font: text-sm, text-amber-700
     ↑ Background: bg-amber-50/80 backdrop-blur
     ↑ Border: border-amber-300
     ↑ Glow: shadow-md shadow-amber-500/20
```

**Critical State (1 remaining)**
```
┌────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │ ⏰ 1 conversation remaining         │ │  ← Clock icon (urgency)
│ │    Resets in 6h 23m                 │ │  ← Countdown timer
│ │    Upgrade for 10 daily chats →    │ │  ← Upgrade link
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
     ↑ Font: text-sm, text-rose-700
     ↑ Background: bg-rose-50/80 backdrop-blur
     ↑ Border: border-rose-300
     ↑ Glow: shadow-md shadow-rose-500/20
```

**Guest User State (after 1st chat)**
```
┌────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │ ✨ 1 chat remaining as guest        │ │  ← Sparkle icon (invitation)
│ │    Sign up for 5 daily chats →     │ │  ← Signup link
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
     ↑ Font: text-sm, text-purple-600
     ↑ Background: bg-primary/10 backdrop-blur
     ↑ Border: border-primary/30
     ↑ Gradient text on "Sign up"
```

**Limit Reached State (input disabled)**
```
┌────────────────────────────────────────┐
│ ┌────────────────────────────────────┐ │
│ │ 🌙 Daily limit reached              │ │
│ │    Resets at 12:00 AM (6h 23m)     │ │
│ │    [Upgrade] or [Notify Me]        │ │  ← Two small buttons
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
     ↑ Font: text-sm, text-muted-foreground
     ↑ Background: bg-card border border-border
     ↑ Buttons: size="sm" variant="outline"
```

---

### Wireframe 2: Guest Limit Modal

**Layout (Mobile 375px width)**
```
┌─────────────────────────────────────┐
│ [Cosmic gradient background overlay]│  ← Dark overlay: bg-black/60
│                                      │
│  ┌─────────────────────────────────┐│
│  │              ✕                   ││  ← Close button (top-right)
│  │                                  ││
│  │       ✨                         ││  ← Large sparkle icon
│  │   (gradient purple/pink)         ││     w-16 h-16, centered
│  │                                  ││
│  │  Your Journey Begins Here        ││  ← Headline
│  │  (font-display, text-2xl)        ││     font-light, text-center
│  │                                  ││
│  │  You've experienced a glimpse of ││  ← Body paragraph
│  │  Rapha Lumina's wisdom. Create   ││     text-base, text-center
│  │  a free account to continue your ││     text-muted-foreground
│  │  conversations and receive 5     ││     max-w-sm, mx-auto
│  │  daily chats to deepen your      ││     leading-relaxed
│  │  spiritual path.                 ││
│  │                                  ││
│  │  ┌─────────────────────────────┐││
│  │  │  Create Free Account        │││  ← Primary CTA Button
│  │  └─────────────────────────────┘││     size="lg", full width
│  │        (w-full, py-6)            ││     bg-primary, gradient
│  │                                  ││
│  │  ┌─────────────────────────────┐││
│  │  │  Maybe Later                │││  ← Secondary button
│  │  └─────────────────────────────┘││     variant="ghost"
│  │                                  ││
│  │  Signing up is free. No credit  ││  ← Trust microcopy
│  │  card required.                 ││     text-xs, text-center
│  └─────────────────────────────────┘│     text-muted-foreground
│                                      │
└─────────────────────────────────────┘

Components Used:
- Dialog (from shadcn/ui)
- DialogContent (custom styled with cosmic theme)
- Button (primary and ghost variants)
- Sparkles icon (from lucide-react)
```

**Spacing Details:**
- Modal width: `sm:max-w-md` (448px desktop, 90vw mobile)
- Padding: `p-8` (32px all sides)
- Icon margin: `mb-6` (24px below icon)
- Headline margin: `mb-4` (16px below headline)
- Body margin: `mb-8` (32px below body)
- Button gap: `gap-3` (12px between buttons)
- Bottom microcopy margin: `mt-4` (16px above)

**Visual Effects:**
- Modal backdrop: `backdrop-blur-md` + `bg-black/60`
- Card background: `bg-card/95 backdrop-blur-lg`
- Border: `border border-primary/20`
- Shadow: `shadow-2xl shadow-primary/10`
- Border radius: `rounded-xl`

---

### Wireframe 3: Free Tier Limit Modal

**Layout (Mobile 375px width)**
```
┌─────────────────────────────────────┐
│ [Cosmic gradient background overlay]│
│                                      │
│  ┌─────────────────────────────────┐│
│  │              ✕                   ││
│  │                                  ││
│  │       👑                         ││  ← Crown icon (Premium)
│  │   (gradient purple/gold)         ││     w-16 h-16, centered
│  │                                  ││
│  │  Ready to Deepen Your Path?      ││  ← Headline
│  │  (font-display, text-2xl)        ││     Question format (softer)
│  │                                  ││
│  │  You've reached today's 5 daily  ││  ← Body paragraph
│  │  conversations. Your journey with││     Acknowledges current tier
│  │  Rapha Lumina is unfolding       ││     Invites rather than pushes
│  │  beautifully.                    ││
│  │                                  ││
│  │  Premium unlocks:                ││  ← Benefits list
│  │  • 10 daily conversations        ││     Concise bullets
│  │  • Priority response times       ││     Value-focused
│  │  • Extended wisdom sessions      ││     Not just "more chats"
│  │                                  ││
│  │  ┌─────────────────────────────┐││
│  │  │  Explore Premium ($20/mo)   │││  ← Primary CTA
│  │  └─────────────────────────────┘││     Price transparent
│  │                                  ││
│  │  ┌─────────────────────────────┐││
│  │  │  I'll Wait (resets in 6h)   │││  ← Secondary shows reset time
│  │  └─────────────────────────────┘││     Variant="outline"
│  │                                  ││
│  │  🌙 Your limit resets at         ││  ← Reset time info
│  │     midnight (6h 23m from now)   ││     Crescent moon icon
│  └─────────────────────────────────┘│     text-xs, centered
│                                      │
└─────────────────────────────────────┘

Icon: Crown from lucide-react
Gradient: from-purple-500 to-amber-500
Headline tone: Invitation, not demand
Body: Affirms user's journey so far
Benefits: Framed as depth/quality, not quantity
Reset info: Reduces anxiety about permanent block
```

---

### Wireframe 4: Premium Tier Limit Modal

**Layout (Mobile 375px width)**
```
┌─────────────────────────────────────┐
│ [Cosmic gradient background overlay]│
│                                      │
│  ┌─────────────────────────────────┐│
│  │              ✕                   ││
│  │                                  ││
│  │       ∞                          ││  ← Infinity symbol
│  │   (gradient purple/cyan)         ││     Custom SVG or Zap icon
│  │                                  ││
│  │  Unlimited Transformation        ││  ← Headline
│  │  Awaits                          ││     Two lines for emphasis
│  │  (font-display, text-2xl)        ││
│  │                                  ││
│  │  Your commitment to growth is    ││  ← Body paragraph
│  │  evident—you've reached your 10  ││     Affirms dedication
│  │  daily conversations again.      ││     Gentle observation
│  │                                  ││
│  │  The Transformation Package      ││     Introduces highest tier
│  │  removes all limits, giving you  ││     Focus on freedom
│  │  unlimited access to deepen your ││     Lifetime value
│  │  journey whenever inspiration    ││
│  │  calls.                          ││
│  │                                  ││
│  │  ✨ Unlimited daily chats        ││  ← Key benefit
│  │  🎯 Lifetime access              ││     Icons + short text
│  │  🌟 Priority cosmic support      ││     Three key points
│  │                                  ││
│  │  ┌─────────────────────────────┐││
│  │  │ Explore Transformation      │││  ← Primary CTA
│  │  │ $470 one-time investment    │││     Price in button or below
│  │  └─────────────────────────────┘││
│  │                                  ││
│  │  ┌─────────────────────────────┐││
│  │  │  Remind Me Tomorrow         │││  ← Secondary action
│  │  └─────────────────────────────┘││     Not "I'll wait" (different)
│  │                                  ││
│  │  "This investment changed how I  ││  ← Social proof element
│  │  show up in the world." - Sarah  ││     Brief testimonial
│  │                                  ││     text-xs, italic
│  └─────────────────────────────────┘│
│                                      │
└─────────────────────────────────────┘

Unique Elements:
- Infinity icon (highest tier symbolism)
- "Transformation" language (brand-aligned)
- One-time investment framing (vs monthly)
- "Remind me" vs "I'll wait" (respects consideration time)
- Testimonial snippet (social proof for high-ticket)
- No reset time shown (unlimited tier doesn't reset)
```

---

### Wireframe 5: Chat Input Area (Disabled State)

**When limit reached and modal closed**
```
┌────────────────────────────────────────────┐
│                                            │
│  [Usage Indicator - Limit Reached State]  │  ← See Wireframe 1
│                                            │
│  ┌────────────────────────────────────────┐│
│  │  Daily limit reached. Your journey     ││  ← Disabled input
│  │  continues at midnight.                ││     bg-muted/50
│  │                              [🔒]      ││     Cursor: not-allowed
│  └────────────────────────────────────────┘│     Lock icon (right side)
│                                            │
│  [Upgrade to Premium] [Set Reminder]      │  ← Action buttons below
│   ↑ size="sm"           ↑ variant="outline"│     gap-2 spacing
│                                            │
└────────────────────────────────────────────┘

Behavior:
- Input field visually appears but is disabled
- Placeholder text explains why disabled
- Lock icon reinforces disabled state
- Action buttons provide clear next steps
- No send button shown (pointless when disabled)
- Clicking anywhere shows toast: "Upgrade or wait for reset"
```

---

### Wireframe 6: Mobile Responsive Layout (320px width)

**Smallest viewport considerations**
```
┌─────────────────────────┐
│ [Navigation - collapsed]│  ← Hamburger menu
├─────────────────────────┤
│                         │
│  [Messages ScrollArea]  │  ← Full available height
│  • Message bubbles      │     Padding reduced to 12px
│  • Max width 100%       │     Font size maintained
│  • Avatar sizes smaller │     (still readable)
│                         │
│  [Loading indicator]    │
│                         │
├─────────────────────────┤
│ [Usage Indicator]       │  ← Fixed position
│  Compact: "3 left"      │     Abbreviated text
│  [Upgrade →]            │     Inline link
├─────────────────────────┤
│ [Chat Input]            │  ← Bottom fixed
│  [────────────] [↑]     │     Input + send icon
└─────────────────────────┘     Minimal padding

Modal adjustments for 320px:
- Width: 95vw (maximize screen use)
- Padding: p-6 (reduced from p-8)
- Font sizes: Scale down headline to text-xl
- Buttons: Maintain 44px touch target
- Icon size: w-12 h-12 (reduced from w-16 h-16)
- Line height: More compact (leading-snug)
```

---

## 6. Copy & Messaging Library

### Guest User Copy

**Usage Indicator States:**

```
Initial State (2 chats available):
"2 chats available as guest ✨"

After 1st chat (1 remaining):
"1 chat remaining · Sign up for 5 daily chats →"
  ↑ Arrow indicates clickable link

Zero remaining (limit reached):
"Guest limit reached · Create account to continue →"
```

**Guest Limit Modal:**

```
HEADLINE:
"Your Journey Begins Here"

BODY:
"You've experienced a glimpse of Rapha Lumina's wisdom. Create a free account to continue your conversations and receive 5 daily chats to deepen your spiritual path.

✨ Free account includes:
• 5 daily conversations
• Voice-enabled guidance
• Memory across devices
• Safe, judgment-free space"

PRIMARY CTA:
"Create Free Account"

SECONDARY CTA:
"Maybe Later"

MICROCOPY (below buttons):
"Signing up is free. No credit card required."

ALTERNATIVE HEADLINES (A/B test options):
- "Your Cosmic Journey Awaits" (more mystical)
- "The Path Opens Before You" (more poetic)
- "Continue Your Awakening" (more direct)
```

---

### Free Tier User Copy

**Usage Indicator States:**

```
Normal (5-4 remaining):
"5 daily chats remaining"
"4 conversations remaining today"

Warning (3-2 remaining):
"3 conversations remaining today
Premium: 10 daily chats →"

Critical (1 remaining):
"1 conversation remaining
Resets in 6h 23m · Upgrade →"

Zero remaining:
"Daily limit reached
Resets at 12:00 AM (in 6h 23m)"
```

**Free Tier Limit Modal:**

```
HEADLINE:
"Ready to Deepen Your Path?"

BODY:
"You've reached today's 5 daily conversations. Your journey with Rapha Lumina is unfolding beautifully.

Premium unlocks deeper exploration:
• 10 daily conversations
• Priority response times
• Extended wisdom sessions
• First access to new features

Your commitment to growth deserves space to expand."

PRIMARY CTA:
"Explore Premium · $20/month"

SECONDARY CTA:
"I'll Wait (resets in 6h)"

FOOTER INFO:
"🌙 Your limit resets at midnight (6h 23m from now)"

ALTERNATIVE HEADLINES:
- "Your Wisdom Practice Is Growing" (affirming)
- "Expand Your Cosmic Capacity" (mystical)
- "The Universe Invites You Deeper" (spiritual)

ALTERNATIVE BODY OPENINGS:
- "Five meaningful conversations today—that's no accident. You're cultivating something real."
- "You're showing up for your spiritual evolution. That deserves recognition."
- "Your dedication to inner work is clear. Let's honor it."
```

---

### Premium Tier User Copy

**Usage Indicator States:**

```
Normal (10-4 remaining):
"10 daily chats remaining"
"7 conversations left today"

Warning (3-2 remaining):
"3 conversations remaining
Transformation: Unlimited →"

Critical (1 remaining):
"1 conversation remaining
Resets in 4h 15m
Unlimited access available →"

Zero remaining:
"Daily limit reached
Transformation offers unlimited chats"
```

**Premium Limit Modal:**

```
HEADLINE:
"Unlimited Transformation
Awaits"

BODY:
"Your commitment to growth is evident—you've reached your 10 daily conversations again.

The Transformation Package removes all limits, giving you unlimited access to deepen your journey whenever inspiration calls.

This is for seekers who want to fully immerse in their spiritual evolution without boundaries.

✨ Transformation includes:
• Unlimited daily conversations
• Lifetime access (one-time investment)
• Priority cosmic support
• Exclusive community access
• All future platform upgrades

$470 one-time · Lifetime unlimited access"

PRIMARY CTA:
"Explore Transformation"

SECONDARY CTA:
"Remind Me Tomorrow"

SOCIAL PROOF:
"This investment changed how I show up in the world. The unlimited access means I can process life in real-time with Rapha Lumina as my guide." — Sarah M.

ALTERNATIVE HEADLINES:
- "Your Practice Calls for More" (need-based)
- "Remove the Limits" (freedom-focused)
- "Go Unlimited" (simple, direct)

ALTERNATIVE BODY OPENINGS:
- "Ten conversations a day, consistently. You're not dabbling—you're committed."
- "You keep hitting this ceiling. Maybe it's time to remove it entirely."
- "Your spiritual practice has outgrown its container."

SCARCITY/URGENCY OPTIONS (use sparingly):
- "Only 47 lifetime spots remaining at this price"
- "Early adopter pricing ends March 1st"
- [NOTE: Only use if factually true. Avoid false scarcity.]
```

---

### Microcopy for Various States

**Reset Time Formatting:**

```
When reset is in:
< 1 hour: "Resets in 45 minutes"
1-6 hours: "Resets in 3h 20m"
6-12 hours: "Resets at 11:30 PM"
12-24 hours: "Resets tomorrow at 12:00 AM"

Alternative phrasing:
"Your journey continues in 5h 12m"
"New conversations available at midnight"
"Limits reset at the stroke of midnight"
```

**Error Messages:**

```
Network Error:
"Connection to cosmic consciousness interrupted. Trying again..."

API Error:
"Rapha Lumina is momentarily unreachable. Please wait a moment."

Rate Limit Error (shouldn't happen but just in case):
"You're moving faster than the quantum field can process. Take a breath."

LocalStorage Disabled:
"Your browser settings prevent chat tracking. Please enable localStorage or sign up for a tracked account."
```

**Success Messages (Toasts):**

```
After Upgrade:
"Welcome to Premium! Your journey expands. ✨"
"Transformation unlocked. The path is now boundless. 🌟"

After Signup:
"Welcome to Rapha Lumina. Your spiritual journey deepens. 🌙"

Reminder Set:
"We'll remind you about Transformation tomorrow. 🔔"
```

**Button Labels Across All Tiers:**

```
Primary CTAs:
- "Create Free Account" (guest)
- "Explore Premium" (free tier)
- "Explore Transformation" (premium tier)
- "Upgrade Now" (generic, use sparingly)

Secondary CTAs:
- "Maybe Later" (guest - low commitment)
- "I'll Wait" (free tier - implies reset)
- "Remind Me Tomorrow" (premium - deferred decision)
- "Not Now" (generic fallback)

Tertiary Options:
- "Learn More" (links to pricing page details)
- "See All Features" (expands feature list)
- "Contact Support" (for questions)
```

---

## 7. Design Tokens & Visual Specifications

### Color Palette (Tailwind Classes)

```css
/* PRIMARY COLORS (Purple/Pink Gradient) */
--primary-gradient: bg-gradient-to-r from-purple-500 to-pink-500
--primary-glow: shadow-lg shadow-purple-500/20

Primary Button:
- Background: bg-primary (hsl(280 70% 60%))
- Hover: hover:bg-primary/90
- Border: border-2 border-primary-border
- Text: text-primary-foreground
- Shadow: shadow-xl

/* USAGE INDICATOR STATES */
Normal State:
- Background: bg-muted/30 backdrop-blur-sm
- Text: text-muted-foreground
- Border: border-transparent
- Icon: text-primary (Sparkles, Circle)

Warning State (3-2 remaining):
- Background: bg-amber-50/80 dark:bg-amber-950/30 backdrop-blur
- Text: text-amber-700 dark:text-amber-400
- Border: border border-amber-300 dark:border-amber-700
- Glow: shadow-md shadow-amber-500/20
- Icon: text-amber-600 (AlertCircle, AlertTriangle)

Critical State (1 remaining):
- Background: bg-rose-50/80 dark:bg-rose-950/30 backdrop-blur
- Text: text-rose-700 dark:text-rose-400
- Border: border border-rose-300 dark:border-rose-700
- Glow: shadow-md shadow-rose-500/20
- Icon: text-rose-600 (Clock, Zap)

/* MODAL STYLES */
Modal Overlay:
- Background: bg-black/60
- Backdrop: backdrop-blur-md

Modal Container:
- Background: bg-card/95 backdrop-blur-lg
- Border: border border-primary/20
- Shadow: shadow-2xl shadow-primary/10
- Radius: rounded-xl (9px)

/* DISABLED STATE */
Disabled Input:
- Background: bg-muted/50
- Text: text-muted-foreground/60
- Border: border-border
- Cursor: cursor-not-allowed
- Opacity: opacity-60
```

### Typography Scale

```css
/* FONT FAMILIES */
--font-display: 'Cormorant Garamond', Georgia, serif  /* Headlines */
--font-wisdom: 'Spectral', Georgia, serif             /* Body wisdom */
--font-sans: 'Inter', system-ui, sans-serif           /* UI text */

/* MODAL TYPOGRAPHY */
Modal Headline:
- Font: font-display
- Size: text-2xl md:text-3xl (24px → 30px)
- Weight: font-light (300)
- Line height: leading-tight (1.25)
- Color: text-foreground
- Alignment: text-center

Modal Body:
- Font: font-sans
- Size: text-base (16px)
- Weight: font-normal (400)
- Line height: leading-relaxed (1.625)
- Color: text-muted-foreground
- Max width: max-w-sm (384px)
- Alignment: text-center

Modal Microcopy:
- Font: font-sans
- Size: text-xs (12px)
- Weight: font-normal
- Line height: leading-normal (1.5)
- Color: text-muted-foreground/80

/* USAGE INDICATOR TYPOGRAPHY */
Indicator Text:
- Font: font-sans
- Size: text-sm (14px)
- Weight: font-medium (500)
- Line height: leading-tight (1.25)
- Color: varies by state (see above)

Indicator Hint/Link:
- Font: font-sans
- Size: text-xs (12px)
- Weight: font-medium (500)
- Decoration: underline decoration-dotted underline-offset-2
- Hover: hover:text-primary transition-colors
```

### Spacing System

```css
/* COMPONENT SPACING */
Modal Padding:
- Desktop: p-8 (32px)
- Mobile: p-6 (24px)

Modal Internal Spacing:
- Icon margin bottom: mb-6 (24px)
- Headline margin bottom: mb-4 (16px)
- Body margin bottom: mb-8 (32px)
- Button gap: gap-3 (12px)
- Microcopy margin top: mt-4 (16px)

Usage Indicator:
- Padding: py-2 px-4 (8px vertical, 16px horizontal)
- Margin from input: mb-2 (8px)
- Internal icon gap: gap-2 (8px)

Chat Input Area:
- Container padding: px-4 py-4 (16px all sides)
- Max width: max-w-5xl (64rem = 1024px)
- Centered: mx-auto

/* RESPONSIVE SPACING */
@media (max-width: 640px) {
  Modal padding: p-6 → p-4
  Headline size: text-2xl → text-xl
  Icon size: w-16 → w-12
  Button padding: py-6 → py-4
}
```

### Border Radius

```css
/* COMPONENT RADII */
Modal: rounded-xl (9px)
Usage Indicator: rounded-full (9999px - pill shape)
Buttons (Primary): rounded-lg (9px)
Buttons (Secondary): rounded-lg (9px)
Input Field: rounded-lg (9px)
Cards: rounded-lg (9px)
Icons: rounded-full (circular)

/* CONSISTENCY NOTE */
All interactive elements use rounded-lg (9px) for consistency
with existing Rapha Lumina design system (see tailwind.config.ts)
```

### Shadow System

```css
/* ELEVATION LEVELS */
Usage Indicator (Normal):
- shadow-sm (subtle, barely visible)

Usage Indicator (Warning/Critical):
- shadow-md shadow-amber-500/20 (colored glow)
- shadow-md shadow-rose-500/20

Modal:
- shadow-2xl shadow-primary/10 (large purple glow)

Buttons (Primary):
- shadow-xl (on hover: shadow-2xl)

/* SHADOW VALUES (from index.css) */
--shadow-sm: 0px 2px 4px -1px rgba(0,0,0,0.06)
--shadow-md: 0px 6px 12px -3px rgba(0,0,0,0.10)
--shadow-xl: 0px 20px 36px -8px rgba(0,0,0,0.14)
--shadow-2xl: 0px 32px 48px -12px rgba(0,0,0,0.18)
```

### Icons (Lucide React)

```typescript
/* ICON USAGE BY CONTEXT */
import {
  Sparkles,      // General magic/cosmic
  Crown,         // Premium tier
  Zap,           // Transformation tier (or custom infinity)
  Clock,         // Time/reset countdown
  Lock,          // Disabled state
  AlertCircle,   // Warning state
  AlertTriangle, // Critical state
  X,             // Close modal
  ArrowRight,    // Links/CTAs
  Moon,          // Night/reset time
  Check,         // Success confirmation
} from "lucide-react";

/* ICON SIZES */
Modal Hero Icon: w-16 h-16 (64px) on desktop, w-12 h-12 (48px) on mobile
Indicator Icon: w-4 h-4 (16px)
Button Icon: w-5 h-5 (20px)
Close Button: w-5 h-5 (20px)

/* ICON COLORS */
- Normal state icons: text-primary
- Warning icons: text-amber-600
- Critical icons: text-rose-600
- Success icons: text-green-600
- Disabled icons: text-muted-foreground/50
```

### Animation & Transitions

```css
/* MODAL ANIMATIONS */
.dialog-overlay {
  animation: fade-in 200ms ease-out;
}

.dialog-content {
  animation: scale-fade-in 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-fade-in {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

/* HOVER TRANSITIONS */
Buttons:
- transition: all 150ms ease-in-out
- hover:scale-105 (subtle grow)
- hover:shadow-2xl

Usage Indicator Links:
- transition: colors 200ms ease-in-out
- hover:text-primary

/* STATE TRANSITIONS */
Usage Indicator State Changes:
- transition: all 300ms ease-out
- Smooth color, border, shadow changes
- No jarring jumps

/* DISABLED STATE */
Input Disable Animation:
- transition: opacity 200ms ease-out, background 200ms ease-out
- Cursor changes immediately (no transition)
```

### Responsive Breakpoints

```css
/* BREAKPOINTS (from Tailwind default) */
sm: 640px   /* Small tablets, large phones landscape */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */

/* COMPONENT RESPONSIVE RULES */

Usage Indicator:
- Base (320px-639px): text-sm, py-2 px-3, abbreviated text
- sm+ (640px+): text-sm, py-2 px-4, full text

Modal:
- Base (320px-639px): 95vw width, p-6, text-xl headline
- sm+ (640px+): sm:max-w-md (448px), p-8, text-2xl headline

Chat Container:
- Base: px-4, full width
- md+ (768px+): max-w-5xl, px-6

Buttons:
- Base: w-full, py-4, text-base
- sm+: w-full, py-6, text-lg

/* MOBILE-FIRST APPROACH */
All styles written mobile-first, then enhanced with sm:, md:, lg: prefixes
Touch targets minimum 44x44px maintained at all breakpoints
Text remains readable without zoom at 320px (16px base font)
```

---

## 8. Component Technical Specifications

### Component 1: UsageIndicator

**File:** `/client/src/components/chat/UsageIndicator.tsx`

**Props Interface:**
```typescript
interface UsageIndicatorProps {
  // Limit information
  remaining: number | "unlimited" | "unknown";
  total: number | "unlimited";
  tier: "guest" | "free" | "premium" | "transformation";

  // Reset time
  resetTime: Date | null;

  // State
  isLoading?: boolean;

  // Callbacks
  onUpgradeClick?: () => void;
  onSignupClick?: () => void;

  // Styling
  className?: string;
}
```

**State Management:**
```typescript
// Internal state
const [displayState, setDisplayState] = useState<'normal' | 'warning' | 'critical'>('normal');
const [timeUntilReset, setTimeUntilReset] = useState<string>('');

// Effects
useEffect(() => {
  // Calculate display state based on remaining count
  if (remaining === 'unlimited' || remaining === 'unknown') {
    setDisplayState('normal');
  } else if (remaining <= 1) {
    setDisplayState('critical');
  } else if (remaining <= 3) {
    setDisplayState('warning');
  } else {
    setDisplayState('normal');
  }
}, [remaining]);

useEffect(() => {
  // Update countdown timer every minute
  if (resetTime) {
    const interval = setInterval(() => {
      setTimeUntilReset(formatTimeUntilReset(resetTime));
    }, 60000); // Update every minute

    // Initial calculation
    setTimeUntilReset(formatTimeUntilReset(resetTime));

    return () => clearInterval(interval);
  }
}, [resetTime]);
```

**Helper Functions:**
```typescript
function formatTimeUntilReset(resetTime: Date): string {
  const now = new Date();
  const diff = resetTime.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 1) {
    return `${minutes}m`;
  } else if (hours < 6) {
    return `${hours}h ${minutes}m`;
  } else {
    return resetTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

function getCopyForState(
  state: 'normal' | 'warning' | 'critical',
  remaining: number | string,
  tier: string,
  timeUntilReset: string
): { primary: string; secondary?: string; icon: LucideIcon } {
  // Returns appropriate copy based on state
  // See Copy Library section for full copy variants
}
```

**Render Logic:**
```typescript
return (
  <div className={cn(
    "flex items-center justify-between px-4 py-2 rounded-full transition-all duration-300",
    displayState === 'normal' && "bg-muted/30 backdrop-blur-sm",
    displayState === 'warning' && "bg-amber-50/80 border border-amber-300 shadow-md shadow-amber-500/20",
    displayState === 'critical' && "bg-rose-50/80 border border-rose-300 shadow-md shadow-rose-500/20",
    className
  )}>
    <div className="flex items-center gap-2">
      <Icon className={cn(
        "w-4 h-4",
        displayState === 'warning' && "text-amber-600",
        displayState === 'critical' && "text-rose-600",
        displayState === 'normal' && "text-primary"
      )} />
      <span className="text-sm font-medium">
        {primaryText}
      </span>
    </div>

    {secondaryText && (
      <button
        onClick={tier === 'guest' ? onSignupClick : onUpgradeClick}
        className="text-xs font-medium underline decoration-dotted underline-offset-2 hover:text-primary transition-colors"
      >
        {secondaryText}
      </button>
    )}
  </div>
);
```

**Accessibility:**
- Uses `aria-live="polite"` for screen reader updates
- Semantic HTML with proper button role for clickable elements
- Keyboard navigable upgrade/signup links (Tab + Enter)
- Color is not sole indicator (icons + text provide redundancy)

---

### Component 2: ChatLimitModal

**File:** `/client/src/components/chat/ChatLimitModal.tsx`

**Props Interface:**
```typescript
interface ChatLimitModalProps {
  // Display control
  isOpen: boolean;
  onClose: () => void;

  // Modal variant
  variant: 'guest' | 'free' | 'premium';

  // Limit info
  limitInfo: {
    tier: string;
    used: number;
    dailyLimit: number | "unlimited";
    resetTime: Date | null;
  };

  // Callbacks
  onPrimaryAction: () => void;    // Navigate to signup/pricing
  onSecondaryAction?: () => void; // Dismiss or remind me

  // Optional overrides
  customCopy?: {
    headline?: string;
    body?: string;
    primaryCTA?: string;
    secondaryCTA?: string;
  };
}
```

**Component Structure:**
```typescript
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Zap, X } from "lucide-react";

export function ChatLimitModal({ isOpen, onClose, variant, limitInfo, onPrimaryAction, onSecondaryAction, customCopy }: ChatLimitModalProps) {
  // Get variant-specific content
  const content = getModalContent(variant, limitInfo, customCopy);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-8 bg-card/95 backdrop-blur-lg border border-primary/20 shadow-2xl shadow-primary/10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Icon */}
        <div className="flex justify-center mb-6">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            content.iconGradient
          )}>
            <content.Icon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Headline */}
        <h2 className="font-display text-2xl md:text-3xl font-light text-center mb-4">
          {content.headline}
        </h2>

        {/* Body */}
        <div className="text-base text-muted-foreground text-center max-w-sm mx-auto leading-relaxed mb-8 space-y-4">
          <p>{content.bodyParagraph1}</p>
          {content.bodyParagraph2 && <p>{content.bodyParagraph2}</p>}
          {content.bulletPoints && (
            <ul className="text-sm space-y-2 text-left">
              {content.bulletPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✨</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full py-6 text-lg"
            onClick={onPrimaryAction}
          >
            {content.primaryCTA}
          </Button>

          {content.secondaryCTA && (
            <Button
              size="lg"
              variant="ghost"
              className="w-full"
              onClick={onSecondaryAction || onClose}
            >
              {content.secondaryCTA}
            </Button>
          )}
        </div>

        {/* Footer microcopy */}
        {content.footerText && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            {content.footerText}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

**Content Generator Function:**
```typescript
function getModalContent(variant: string, limitInfo: any, customCopy?: any) {
  // Base content structure
  const content = {
    Icon: Sparkles,
    iconGradient: "bg-gradient-to-br from-purple-500 to-pink-500",
    headline: "",
    bodyParagraph1: "",
    bodyParagraph2: null as string | null,
    bulletPoints: null as string[] | null,
    primaryCTA: "",
    secondaryCTA: null as string | null,
    footerText: null as string | null,
  };

  // Override with custom copy if provided
  if (customCopy) {
    Object.assign(content, customCopy);
  }

  // Set variant-specific defaults (see Copy Library for full text)
  switch (variant) {
    case 'guest':
      return {
        ...content,
        Icon: Sparkles,
        headline: "Your Journey Begins Here",
        bodyParagraph1: "You've experienced a glimpse of Rapha Lumina's wisdom...",
        bulletPoints: ["5 daily conversations", "Voice-enabled guidance", "Memory across devices"],
        primaryCTA: "Create Free Account",
        secondaryCTA: "Maybe Later",
        footerText: "Signing up is free. No credit card required.",
      };

    case 'free':
      return {
        ...content,
        Icon: Crown,
        iconGradient: "bg-gradient-to-br from-purple-500 to-amber-500",
        headline: "Ready to Deepen Your Path?",
        bodyParagraph1: "You've reached today's 5 daily conversations...",
        bulletPoints: ["10 daily conversations", "Priority response times", "Extended wisdom sessions"],
        primaryCTA: "Explore Premium · $20/month",
        secondaryCTA: `I'll Wait (resets in ${formatResetTime(limitInfo.resetTime)})`,
        footerText: `🌙 Your limit resets at midnight (${formatResetTime(limitInfo.resetTime)} from now)`,
      };

    case 'premium':
      return {
        ...content,
        Icon: Zap,
        iconGradient: "bg-gradient-to-br from-purple-500 to-cyan-500",
        headline: "Unlimited Transformation Awaits",
        bodyParagraph1: "Your commitment to growth is evident...",
        bulletPoints: ["Unlimited daily chats", "Lifetime access", "Priority cosmic support"],
        primaryCTA: "Explore Transformation · $470 one-time",
        secondaryCTA: "Remind Me Tomorrow",
        footerText: '"This investment changed how I show up in the world." — Sarah M.',
      };
  }

  return content;
}
```

**Accessibility:**
- Dialog has `role="dialog"` and `aria-modal="true"`
- Close button has `aria-label="Close"`
- Focus trap keeps keyboard navigation within modal
- Escape key closes modal
- Primary button is focused on modal open

---

### Component 3: ChatLimitProvider (Context)

**File:** `/client/src/contexts/ChatLimitContext.tsx`

**Context Interface:**
```typescript
interface ChatLimitContextValue {
  // Limit state
  limitInfo: LimitCheckResult | null;
  isCheckingLimit: boolean;
  isLimitExceeded: boolean;

  // Modal state
  showLimitModal: boolean;
  modalVariant: 'guest' | 'free' | 'premium' | null;

  // Actions
  checkLimit: () => Promise<void>;
  incrementUsage: () => Promise<void>;
  openLimitModal: (variant: 'guest' | 'free' | 'premium') => void;
  closeLimitModal: () => void;
  refreshLimitInfo: () => Promise<void>;
}

interface LimitCheckResult {
  allowed: boolean;
  tier: string;
  dailyLimit: number | "unlimited";
  used: number;
  remaining: number | "unlimited";
  resetTime: Date | null;
  upgradeMessage?: string;
  upgradeUrl?: string;
}
```

**Provider Implementation:**
```typescript
export function ChatLimitProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [limitInfo, setLimitInfo] = useState<LimitCheckResult | null>(null);
  const [isCheckingLimit, setIsCheckingLimit] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [modalVariant, setModalVariant] = useState<'guest' | 'free' | 'premium' | null>(null);

  // Computed value
  const isLimitExceeded = limitInfo ? !limitInfo.allowed : false;

  // Check limit (called before sending chat)
  const checkLimit = useCallback(async () => {
    setIsCheckingLimit(true);

    try {
      if (isAuthenticated && user) {
        // Authenticated user: check with backend
        const response = await fetch('/api/chat/limit-check', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Limit check failed');
        }

        const data: LimitCheckResult = await response.json();
        setLimitInfo(data);

        // If limit exceeded, show appropriate modal
        if (!data.allowed) {
          const variant = data.tier === 'free' ? 'free' : 'premium';
          openLimitModal(variant);
        }
      } else {
        // Guest user: check localStorage
        const guestCount = getGuestChatCount();
        const GUEST_LIMIT = 2;

        const guestLimitInfo: LimitCheckResult = {
          allowed: guestCount < GUEST_LIMIT,
          tier: 'guest',
          dailyLimit: GUEST_LIMIT,
          used: guestCount,
          remaining: Math.max(0, GUEST_LIMIT - guestCount),
          resetTime: null,
        };

        setLimitInfo(guestLimitInfo);

        if (!guestLimitInfo.allowed) {
          openLimitModal('guest');
        }
      }
    } catch (error) {
      console.error('ChatLimitProvider.checkLimit failed:', error);

      // Fail-open: allow chat to proceed
      setLimitInfo({
        allowed: true,
        tier: isAuthenticated ? user?.tier || 'free' : 'guest',
        dailyLimit: 'unknown',
        used: 0,
        remaining: 'unknown',
        resetTime: null,
      });
    } finally {
      setIsCheckingLimit(false);
    }
  }, [isAuthenticated, user]);

  // Increment usage (called after successful chat)
  const incrementUsage = useCallback(async () => {
    if (isAuthenticated && user) {
      // Backend handles increment via API
      try {
        await fetch('/api/chat/increment-usage', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Failed to increment usage:', error);
      }
    } else {
      // Guest: increment localStorage
      const currentCount = getGuestChatCount();
      localStorage.setItem('guestChatCount', String(currentCount + 1));
    }

    // Refresh limit info
    await refreshLimitInfo();
  }, [isAuthenticated, user]);

  // Refresh limit info (after upgrade, etc.)
  const refreshLimitInfo = useCallback(async () => {
    await checkLimit();
  }, [checkLimit]);

  // Modal controls
  const openLimitModal = (variant: 'guest' | 'free' | 'premium') => {
    setModalVariant(variant);
    setShowLimitModal(true);
  };

  const closeLimitModal = () => {
    setShowLimitModal(false);
    setModalVariant(null);
  };

  // Initial limit check on mount
  useEffect(() => {
    checkLimit();
  }, [checkLimit]);

  const value: ChatLimitContextValue = {
    limitInfo,
    isCheckingLimit,
    isLimitExceeded,
    showLimitModal,
    modalVariant,
    checkLimit,
    incrementUsage,
    openLimitModal,
    closeLimitModal,
    refreshLimitInfo,
  };

  return (
    <ChatLimitContext.Provider value={value}>
      {children}
    </ChatLimitContext.Provider>
  );
}

// Hook for consuming context
export function useChatLimit() {
  const context = useContext(ChatLimitContext);
  if (!context) {
    throw new Error('useChatLimit must be used within ChatLimitProvider');
  }
  return context;
}

// Helper: Get guest chat count from localStorage
function getGuestChatCount(): number {
  try {
    const count = localStorage.getItem('guestChatCount');
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0; // If localStorage unavailable, fail open
  }
}
```

---

### Component 4: Integration with Chat Page

**File:** `/client/src/pages/chat.tsx` (modifications)

**Integration Steps:**

1. **Wrap chat page in ChatLimitProvider:**
```typescript
// In App.tsx or chat.tsx
import { ChatLimitProvider } from '@/contexts/ChatLimitContext';

function ChatPage() {
  return (
    <ChatLimitProvider>
      <div className="flex flex-col h-screen bg-background">
        <Navigation />
        <ChatContent />
      </div>
    </ChatLimitProvider>
  );
}
```

2. **Add UsageIndicator to chat input area:**
```typescript
// In ChatContent component
import { UsageIndicator } from '@/components/chat/UsageIndicator';
import { useChatLimit } from '@/contexts/ChatLimitContext';

function ChatContent() {
  const { limitInfo, isLimitExceeded } = useChatLimit();
  const router = useRouter();

  const handleUpgradeClick = () => {
    if (limitInfo?.upgradeUrl) {
      router.push(limitInfo.upgradeUrl);
    }
  };

  const handleSignupClick = () => {
    router.push('/signup?source=chat_usage_indicator');
  };

  return (
    <>
      {/* Messages area */}
      <ScrollArea>...</ScrollArea>

      {/* Input area */}
      <div className="border-t bg-background/95 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 space-y-2">
          {/* Usage Indicator */}
          {limitInfo && (
            <UsageIndicator
              remaining={limitInfo.remaining}
              total={limitInfo.dailyLimit}
              tier={limitInfo.tier}
              resetTime={limitInfo.resetTime}
              onUpgradeClick={handleUpgradeClick}
              onSignupClick={handleSignupClick}
            />
          )}

          {/* Chat Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={isLimitExceeded}
          />
        </div>
      </div>
    </>
  );
}
```

3. **Check limit before sending message:**
```typescript
const handleSendMessage = async (content: string) => {
  const { checkLimit, isLimitExceeded, incrementUsage } = useChatLimit();

  // Check limit first
  await checkLimit();

  // If limit exceeded, modal will show automatically
  if (isLimitExceeded) {
    return; // Don't send message
  }

  // Proceed with sending message
  setIsLoading(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
      credentials: 'include',
    });

    if (response.status === 429) {
      // Limit exceeded mid-request (race condition)
      await checkLimit(); // Will trigger modal
      return;
    }

    if (!response.ok) {
      throw new Error('Chat failed');
    }

    const data = await response.json();

    // Update messages
    setMessages(prev => [...prev, data.userMessage, data.assistantMessage]);

    // Increment usage counter
    await incrementUsage();

  } catch (error) {
    console.error('Chat error:', error);
    toast({
      title: "Connection Error",
      description: "Unable to reach Rapha Lumina. Please try again.",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};
```

4. **Add ChatLimitModal:**
```typescript
import { ChatLimitModal } from '@/components/chat/ChatLimitModal';

function ChatContent() {
  const {
    showLimitModal,
    modalVariant,
    limitInfo,
    closeLimitModal
  } = useChatLimit();
  const router = useRouter();

  const handleModalPrimaryAction = () => {
    if (modalVariant === 'guest') {
      router.push('/signup?source=guest_limit');
    } else if (limitInfo?.upgradeUrl) {
      router.push(limitInfo.upgradeUrl);
    }
    closeLimitModal();
  };

  const handleModalSecondaryAction = () => {
    if (modalVariant === 'premium') {
      // Set reminder preference
      localStorage.setItem('transformationReminderDate', new Date().toISOString());
    }
    closeLimitModal();
  };

  return (
    <>
      {/* ... chat content ... */}

      {/* Limit Modal */}
      <ChatLimitModal
        isOpen={showLimitModal}
        onClose={closeLimitModal}
        variant={modalVariant || 'guest'}
        limitInfo={limitInfo || defaultLimitInfo}
        onPrimaryAction={handleModalPrimaryAction}
        onSecondaryAction={handleModalSecondaryAction}
      />
    </>
  );
}
```

---

## 9. Interaction Patterns

### Pattern 1: Progressive Warning Escalation

**Behavior:**
- **5+ remaining:** No warning, subtle indicator only
- **4-3 remaining:** Indicator becomes slightly more prominent (amber tint appears)
- **2-1 remaining:** Warning state activates (amber glow, countdown timer)
- **0 remaining:** Critical state + modal trigger

**Rationale:** Users aren't alarmed early but have time to adjust behavior or consider upgrading.

**Animation:** 300ms ease-out transition between states prevents jarring changes.

---

### Pattern 2: Modal Dismissal with Consequence

**Behavior:**
1. User hits limit → Modal appears
2. User clicks X or "Maybe Later" → Modal closes with fade-out
3. Chat input becomes visually disabled (opacity 60%, cursor not-allowed)
4. Persistent message appears in input area: "Daily limit reached"
5. Two small action buttons show below input: [Upgrade] [Set Reminder]

**Rationale:**
- Allows users to close modal without feeling trapped
- Maintains limit integrity (input disabled)
- Provides clear next steps without re-opening modal
- Respects user agency while maintaining conversion path

**Edge Case:** User refreshes page after dismissing modal
- Solution: Check limit on page load, if exceeded, show disabled state immediately without re-opening modal

---

### Pattern 3: Post-Upgrade Seamless Return

**Behavior:**
1. User clicks "Upgrade to Premium" from modal
2. Navigate to `/pricing?source=chat_limit_prompt&tier=free`
3. User completes payment
4. Payment webhook updates subscription in backend
5. Redirect to `/chat?upgrade=success&tier=premium`
6. Chat page detects URL param, calls `refreshLimitInfo()`
7. Usage indicator updates to show new limit (10 chats)
8. Success toast appears: "Welcome to Premium! Your journey expands."
9. Chat input is enabled and ready
10. URL params are removed (clean history)

**Timing:**
- Toast duration: 5 seconds
- Indicator update: Immediate (triggered by context refresh)
- URL cleanup: After 1 second (prevents flash)

**Error Handling:**
- If subscription hasn't updated yet (webhook delay), show loading state
- Poll `/api/chat/limit-check` every 2 seconds for max 30 seconds
- If still not updated, show message: "Processing upgrade... This may take a moment."

---

### Pattern 4: Reset Time Countdown

**Behavior:**
- Countdown updates every 60 seconds (not every second to avoid distraction)
- Format changes based on time remaining:
  - < 1 hour: "Resets in 45m"
  - 1-6 hours: "Resets in 3h 20m"
  - 6-12 hours: "Resets at 11:30 PM"
  - 12-24 hours: "Resets tomorrow at 12:00 AM"

**Interaction:**
- Hovering over countdown shows tooltip with exact reset time (local timezone)
- Clicking countdown shows toast: "Your daily limit resets at midnight UTC"

**Edge Case:** User keeps page open past reset time
- Solution: `useEffect` checks every minute if current time > resetTime
- If true, automatically refresh limit info
- Show brief toast: "Daily limit refreshed!"
- Usage indicator updates to show full available chats

---

### Pattern 5: Guest Circumvention Detection

**Behavior:**
1. Guest user exhausts 2 free chats
2. Limit modal appears
3. User dismisses modal
4. User clears localStorage and refreshes page
5. Backend detects suspicious pattern (multiple chats from same IP in short time)
6. Backend applies IP-based rate limiting as backup

**Frontend Handling:**
- If localStorage is unavailable/disabled, show warning:
  - "Your browser doesn't allow chat tracking. Please enable cookies or sign up for a tracked account."
- Disable guest chat entirely if localStorage unavailable

**Future Enhancement:**
- Fingerprinting (device ID) as secondary tracking
- CAPTCHA after 3 localStorage clears from same browser

---

### Pattern 6: Multi-Tab Sync

**Behavior:**
1. User opens chat in Tab A
2. User opens chat in Tab B
3. User sends message in Tab A → usage increments
4. Tab B's usage indicator automatically updates

**Implementation:**
- Use `storage` event listener to sync localStorage changes across tabs
- For authenticated users, poll `/api/chat/limit-check` when tab gains focus

```typescript
// In ChatLimitProvider
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'guestChatCount') {
      refreshLimitInfo();
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      refreshLimitInfo();
    }
  };

  window.addEventListener('storage', handleStorageChange);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [refreshLimitInfo]);
```

---

### Pattern 7: Loading States

**Checking Limit (before send):**
```
[Send button]
  ↓ User clicks
[Send button disabled, spinner appears]
[Checking availability...]
  ↓ 0.5-2 seconds
[Limit OK → Message sends]
OR
[Limit exceeded → Modal appears]
```

**Incrementing Usage (after response):**
- Happens in background, no UI blocking
- If fails, log error but don't interrupt user experience

**Refreshing After Upgrade:**
```
[Usage Indicator shows old limit: "0 remaining"]
  ↓ User returns from payment
[Indicator shows loading state: "Updating..."]
  ↓ API call completes
[Indicator animates to new limit: "10 chats remaining"]
[Success toast appears]
```

---

## 10. Implementation Priority

### Phase 1: Core Functionality (Week 1)
**Goal:** Basic limit enforcement works for all tiers

**Tasks:**
1. Create ChatLimitContext with limit checking logic
2. Create UsageIndicator component (normal state only)
3. Integrate with existing chat page
4. Add limit check before message send
5. Add localStorage guest tracking
6. Basic error handling (fail-open)

**Acceptance:**
- Guest users see "2 chats available"
- Free users see "5 chats remaining"
- Limit check prevents send when exceeded
- Console logs show limit status

**Estimated Time:** 2-3 days

---

### Phase 2: Modals & Copy (Week 1-2)
**Goal:** Professional conversion experience

**Tasks:**
1. Create ChatLimitModal component with all 3 variants
2. Implement all copy from Copy Library
3. Add modal trigger on limit exceeded
4. Add close/dismiss handling
5. Style modals with cosmic theme
6. Test on mobile (375px and 320px)

**Acceptance:**
- All 3 modal variants render correctly
- Copy matches approved messaging
- Modals are dismissible
- Cosmic aesthetic is consistent with landing page

**Estimated Time:** 2 days

---

### Phase 3: Progressive Warnings (Week 2)
**Goal:** Smooth UX with escalating warnings

**Tasks:**
1. Add warning state to UsageIndicator (3-2 remaining)
2. Add critical state to UsageIndicator (1 remaining)
3. Implement countdown timer for reset time
4. Add visual transitions between states
5. Add upgrade/signup link clicks

**Acceptance:**
- Indicator changes color at appropriate thresholds
- Countdown updates every minute
- Transitions are smooth, not jarring
- Links navigate to correct pages with source params

**Estimated Time:** 1 day

---

### Phase 4: Post-Upgrade Flow (Week 2-3)
**Goal:** Seamless return after payment

**Tasks:**
1. Create pricing page upgrade detection (URL params)
2. Implement refreshLimitInfo on return to chat
3. Add success toast on upgrade
4. Handle webhook delays (polling)
5. Test full upgrade journey

**Acceptance:**
- User redirected back to chat after payment
- Usage indicator updates immediately
- Success toast appears
- No errors if webhook delayed

**Estimated Time:** 2 days

---

### Phase 5: Polish & Edge Cases (Week 3)
**Goal:** Production-ready robustness

**Tasks:**
1. Implement multi-tab sync
2. Add reset time auto-refresh
3. Improve error states and messages
4. Add accessibility testing (keyboard, screen reader)
5. Mobile testing on real devices
6. Performance optimization (memoization)

**Acceptance:**
- All edge cases handled gracefully
- WCAG AA compliance verified
- No console errors
- Performance impact < 50ms

**Estimated Time:** 2 days

---

### Phase 6: Analytics & Iteration (Week 3-4)
**Goal:** Data-driven optimization

**Tasks:**
1. Add analytics events (modal shown, upgrade clicked, dismissed)
2. Implement A/B testing framework for copy
3. Add conversion funnel tracking
4. Create dashboard for monitoring
5. Gather initial user feedback

**Acceptance:**
- All key events tracked in analytics
- Can run copy A/B tests
- Dashboard shows conversion rates
- 10+ user feedback responses collected

**Estimated Time:** 2 days

---

**Total Estimated Time:** 11-13 days (2.5-3 weeks)

**Critical Path:**
Phase 1 → Phase 2 → Phase 3 (must be sequential)
Phase 4 and Phase 5 can run partially in parallel
Phase 6 can start once Phase 5 is complete

---

## 11. Accessibility Requirements

### WCAG 2.1 AA Compliance Checklist

**1. Perceivable**

- [ ] **Color Contrast:**
  - Normal state text: 4.5:1 minimum (text-muted-foreground on bg-muted/30)
  - Warning state text: 4.5:1 minimum (text-amber-700 on bg-amber-50)
  - Critical state text: 4.5:1 minimum (text-rose-700 on bg-rose-50)
  - Modal headline: 7:1 (text-foreground on bg-card)
  - Button text: 4.5:1 (white on primary gradient)
  - Verified with WebAIM Contrast Checker

- [ ] **Non-Color Indicators:**
  - Warning/critical states use icons (AlertCircle, Clock) in addition to color
  - Disabled state uses opacity + cursor + lock icon + text explanation
  - All states have unique text labels

- [ ] **Text Alternatives:**
  - Icons have `aria-label` when meaning isn't clear from context
  - Close button: `aria-label="Close dialog"`
  - Visual-only elements (decorative gradients) have `aria-hidden="true"`

**2. Operable**

- [ ] **Keyboard Navigation:**
  - All interactive elements focusable via Tab
  - Tab order logical: indicator → input → send button
  - Modal focus trap implemented (can't Tab outside modal)
  - Escape key closes modal
  - Enter on focused button activates it

- [ ] **Touch Targets:**
  - All buttons minimum 44x44px
  - Adequate spacing between touch targets (8px minimum)
  - Modal close button: 44x44px tap area
  - Usage indicator links: 44px height (even if text is smaller)

- [ ] **No Keyboard Traps:**
  - Users can exit modal via Escape or Tab to close button
  - Focus returns to last focused element after modal closes
  - No infinite loops in focus order

- [ ] **Time-Based Adjustments:**
  - No automatic modal dismissal (user controls)
  - Countdown timer doesn't require immediate action
  - Reset time updates every minute (not distracting frequency)

**3. Understandable**

- [ ] **Readable Text:**
  - Base font size: 16px (text-base)
  - Small text (12px) only for non-critical microcopy
  - Line height: 1.5 minimum (leading-relaxed on body text)
  - No justified text (causes uneven spacing)

- [ ] **Predictable Navigation:**
  - Upgrade links go where user expects (pricing page)
  - Modal close behavior consistent (X button vs secondary action)
  - Back button works after navigation to pricing

- [ ] **Input Assistance:**
  - Disabled input has clear explanation ("Daily limit reached")
  - Error states include recovery instructions
  - Success confirmations clearly communicated (toasts)

**4. Robust**

- [ ] **Semantic HTML:**
  - Buttons use `<button>` element (not styled divs)
  - Links use `<a>` element with href
  - Headings use `<h1>-<h6>` tags in logical order
  - Modal uses ARIA dialog pattern

- [ ] **ARIA Attributes:**
  ```html
  <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
    <h2 id="modal-title">Your Journey Begins Here</h2>
    ...
  </div>

  <div role="status" aria-live="polite" aria-atomic="true">
    <!-- Usage indicator with live updates -->
  </div>
  ```

- [ ] **Screen Reader Testing:**
  - Test with VoiceOver (macOS/iOS)
  - Test with NVDA (Windows)
  - Verify announcement order is logical
  - Verify modal content is announced when opened

---

### Screen Reader Announcements

**Usage Indicator Updates:**
```
<!-- Normal state -->
<div role="status" aria-live="polite" aria-atomic="true">
  5 daily chats remaining
</div>

<!-- Warning state -->
<div role="status" aria-live="polite" aria-atomic="true">
  Warning: 3 conversations remaining today.
  Premium tier offers 10 daily chats.
</div>

<!-- Critical state -->
<div role="status" aria-live="assertive" aria-atomic="true">
  Critical: 1 conversation remaining.
  Resets in 6 hours 23 minutes.
  Consider upgrading for more chats.
</div>
```

**Modal Open:**
```
<!-- Modal container -->
<div role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
  <h2 id="modal-title">Your Journey Begins Here</h2>
  <div id="modal-description">
    You've experienced a glimpse of Rapha Lumina's wisdom...
  </div>
</div>

Screen reader announces:
"Dialog. Your Journey Begins Here. You've experienced a glimpse..."
```

---

### Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| Tab | Navigate forward | All focusable elements |
| Shift+Tab | Navigate backward | All focusable elements |
| Enter | Activate button/link | When focused |
| Space | Activate button | When focused on button |
| Escape | Close modal | When modal is open |
| Arrow keys | (Future) Navigate between indicator states | When focused on indicator |

---

### Reduced Motion Support

```css
/* Respect user preference for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .dialog-overlay,
  .dialog-content,
  .usage-indicator {
    animation: none !important;
    transition: none !important;
  }

  /* Only fade in/out, no scaling or sliding */
  .dialog-content {
    transition: opacity 150ms ease-out;
  }
}
```

---

## 12. Quality Checklist

### Pre-Launch Verification

**Functionality**
- [ ] Guest users can send 2 chats, then see limit modal
- [ ] Free users can send 5 chats/day, then see limit modal
- [ ] Premium users can send 10 chats/day, then see limit modal
- [ ] Transformation users see "unlimited" and never hit limits
- [ ] Usage indicator updates after each chat
- [ ] Countdown timer updates every minute
- [ ] Modal can be closed via X button, secondary action, or Escape key
- [ ] Input becomes disabled after modal dismissal
- [ ] Upgrade links navigate to pricing with correct source params
- [ ] Returning from upgrade updates limits immediately
- [ ] Success toast appears after upgrade
- [ ] Reset time auto-refreshes at midnight UTC
- [ ] Multi-tab usage syncs correctly
- [ ] API errors fail open (allow chat to proceed)

**Visual Design**
- [ ] Cosmic aesthetic matches landing page
- [ ] Purple/pink gradients render correctly
- [ ] Backdrop blur effects work on supported browsers
- [ ] Icons are crisp at all sizes (16px, 44px, 64px)
- [ ] Shadows are subtle, not harsh
- [ ] Border radius consistent across components (9px)
- [ ] Typography scales correctly from 320px to 1920px
- [ ] Dark mode support (if applicable)
- [ ] Loading states are smooth (no jank)
- [ ] Animations respect prefers-reduced-motion

**Responsive Behavior**
- [ ] 320px width: All content fits, no horizontal scroll
- [ ] 375px width: Optimal mobile experience
- [ ] 768px width: Tablet layout comfortable
- [ ] 1024px+ width: Desktop layout spacious
- [ ] Touch targets 44x44px minimum on all viewports
- [ ] Text readable without zoom on mobile
- [ ] Modal doesn't cover entire screen on desktop

**Copy & Messaging**
- [ ] All copy matches approved Copy Library
- [ ] Tone is spiritually aligned, not salesy
- [ ] Grammar and spelling perfect
- [ ] No aggressive FOMO language
- [ ] Benefits framed as depth/transformation, not quantity
- [ ] Reset time messaging clear and anxiety-reducing
- [ ] Microcopy provides trust signals (no credit card, etc.)

**Accessibility**
- [ ] All color contrasts meet WCAG AA (4.5:1 minimum)
- [ ] Keyboard navigation works completely
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces all state changes
- [ ] No keyboard traps
- [ ] Touch targets 44x44px minimum
- [ ] Semantic HTML used throughout
- [ ] ARIA attributes correct
- [ ] Tested with VoiceOver and NVDA

**Performance**
- [ ] Initial render < 100ms
- [ ] Limit check API call < 500ms
- [ ] Modal open animation smooth (60fps)
- [ ] No memory leaks (tested with Chrome DevTools)
- [ ] Bundle size impact < 50KB (gzipped)
- [ ] No unnecessary re-renders (React DevTools Profiler)
- [ ] Images optimized and lazy-loaded

**Browser Compatibility**
- [ ] Chrome 90+ (desktop & mobile)
- [ ] Safari 14+ (desktop & mobile)
- [ ] Firefox 88+
- [ ] Edge 90+
- [ ] iOS Safari 14+
- [ ] Android Chrome 90+

**Error Handling**
- [ ] Network timeout shows appropriate message
- [ ] 500 error from API handled gracefully
- [ ] localStorage disabled shows warning
- [ ] Malformed API response doesn't crash app
- [ ] Concurrent requests don't cause race conditions

**Analytics & Tracking**
- [ ] Modal shown event tracked
- [ ] Upgrade button clicked event tracked
- [ ] Dismiss button clicked event tracked
- [ ] Source params preserved through upgrade flow
- [ ] Conversion funnel can be reconstructed from events

**Security**
- [ ] No sensitive data in localStorage
- [ ] API endpoints require authentication (except guest)
- [ ] Rate limiting enforced on backend
- [ ] No XSS vulnerabilities in user-generated content
- [ ] CSRF protection on state-changing requests

---

### Post-Launch Monitoring

**Week 1 Metrics**
- Modal show rate (per tier)
- Modal dismiss rate (without action)
- Upgrade click-through rate
- Conversion rate (modal to paid tier)
- Average time on modal before action
- Error rate (API failures, etc.)

**User Feedback Questions**
1. "Was the chat limit clear and understandable?"
2. "Did the upgrade invitation feel pushy or respectful?"
3. "Did you find the cosmic aesthetic appealing or distracting?"
4. "Was the reset time information helpful?"
5. "What would make you more likely to upgrade?"

**Iteration Triggers**
- If dismiss rate > 80%: Copy too aggressive, soften language
- If conversion rate < 5%: Value proposition unclear, revise benefits
- If error rate > 2%: Technical issues, investigate backend
- If mobile completion rate < 50%: Mobile UX needs improvement

---

## Appendix A: File Structure

```
client/src/
├── components/
│   ├── chat/
│   │   ├── UsageIndicator.tsx          [NEW]
│   │   ├── ChatLimitModal.tsx          [NEW]
│   │   └── ChatLimitDisabledInput.tsx  [NEW]
│   ├── ChatInput.tsx                    [MODIFY]
│   └── ui/
│       ├── dialog.tsx                   [EXISTS]
│       ├── button.tsx                   [EXISTS]
│       └── badge.tsx                    [EXISTS]
├── contexts/
│   └── ChatLimitContext.tsx            [NEW]
├── hooks/
│   └── useChatLimit.ts                 [NEW - re-export from context]
├── pages/
│   ├── chat.tsx                        [MODIFY]
│   └── pricing.tsx                     [CREATE if missing]
└── lib/
    └── formatTime.ts                   [NEW - time formatting utils]

server/
├── services/
│   └── ChatLimitService.ts             [EXISTS - no changes needed]
└── routes.ts                            [MODIFY - add /api/chat/limit-check endpoint]
```

---

## Appendix B: API Endpoint Specifications

### GET /api/chat/limit-check

**Purpose:** Check current user's chat limit status

**Authentication:** Required (except guest, which uses frontend localStorage)

**Response:**
```json
{
  "allowed": true,
  "tier": "free",
  "dailyLimit": 5,
  "used": 2,
  "remaining": 3,
  "resetTime": "2025-11-15T00:00:00.000Z",
  "upgradeMessage": null,
  "upgradeUrl": null
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized (redirect to login)
- 500: Server error (fail-open on frontend)

---

### POST /api/chat/increment-usage

**Purpose:** Increment user's daily chat usage counter

**Authentication:** Required

**Request Body:** None (user ID from session)

**Response:**
```json
{
  "success": true,
  "newUsage": 3
}
```

**Status Codes:**
- 200: Success
- 401: Unauthorized
- 500: Server error (non-critical, log and continue)

---

### POST /api/chat

**Purpose:** Send chat message (existing endpoint, modification needed)

**Modifications:**
- Before processing, call `chatLimitService.checkLimit(userId, tier)`
- If `allowed: false`, return 429 Too Many Requests
- If allowed, proceed with chat generation
- After successful response, call `chatLimitService.incrementUsage(userId)`

**New Error Response (429):**
```json
{
  "error": "Daily limit reached",
  "limitInfo": {
    "allowed": false,
    "tier": "free",
    "dailyLimit": 5,
    "used": 5,
    "remaining": 0,
    "resetTime": "2025-11-15T00:00:00.000Z",
    "upgradeMessage": "Daily limit reached. Upgrade to Premium for 10 daily chats.",
    "upgradeUrl": "/pricing?source=chat_limit_prompt&tier=free"
  }
}
```

---

## Appendix C: A/B Test Variants

### Test 1: Modal Headline Tone

**Variant A (Current):** "Your Journey Begins Here" (invitation)
**Variant B:** "Unlock Your Full Potential" (benefit-focused)
**Variant C:** "Continue Your Awakening" (continuation frame)

**Hypothesis:** Invitation tone (A) will have higher conversion than direct benefit claim (B)

**Metric:** Click-through rate on primary CTA

---

### Test 2: Scarcity Element

**Variant A (Control):** No scarcity mention
**Variant B:** "Only 47 lifetime spots remaining" (if factual)
**Variant C:** "Early adopter pricing ends soon"

**Hypothesis:** Scarcity (B or C) will increase urgency but may harm trust with spiritual audience

**Metric:** Conversion rate + brand perception survey

---

### Test 3: Reset Time Visibility

**Variant A (Current):** Reset time shown in warning state and modal footer
**Variant B:** Reset time always visible in indicator
**Variant C:** Reset time hidden unless limit exceeded

**Hypothesis:** Visible countdown (B) will reduce anxiety and increase free-to-premium conversion

**Metric:** Dismiss rate + time to upgrade decision

---

## Conclusion

This UX Pack v1 provides a complete, spiritually-aligned chat limit enforcement system ready for implementation. The design balances conversion effectiveness with authentic invitation, maintains the Rapha Lumina cosmic aesthetic, and ensures accessibility compliance.

**Key Success Factors:**
1. Progressive disclosure prevents alarm while building awareness
2. Spiritually-aligned copy invites rather than manipulates
3. Multiple exit paths respect user agency
4. Post-upgrade flow is seamless and celebratory
5. Mobile-first approach serves primary user base
6. Fail-open error handling maintains positive UX

**Next Steps:**
1. Review this UX Pack with stakeholders
2. Begin Phase 1 implementation (ChatLimitContext + UsageIndicator)
3. Conduct copy review sessions for final approval
4. Set up analytics tracking for conversion funnel
5. Schedule user testing after Phase 3 completion

**Questions for Product Team:**
- Does Transformation tier pricing ($470) need A/B testing?
- Should "Remind Me Tomorrow" be persistent or reset daily?
- Do we need a "Notify Me at Reset" feature for power users?
- Should guest users see a teaser of what signed-up users get beyond 2 chats?

---

**Document End**

*Generated for Rapha Lumina by Claude (UX Designer)*
*Date: 2025-11-14*
*Version: 1.0*
