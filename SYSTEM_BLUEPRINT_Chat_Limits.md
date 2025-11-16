# System Blueprint v1: Chat Limit Enforcement System

## Executive Summary

The Chat Limit Enforcement System implements a tiered access control mechanism for the Rapha Lumina spiritual guidance chatbot, designed to convert free users into paid subscribers through strategic usage limits. The architecture leverages the existing Node.js/Express backend with PostgreSQL database, adding minimal overhead while ensuring atomic operations, graceful degradation, and sub-2-second response times.

The system introduces a four-tier structure (Guest, Free, Premium, Transformation) with daily usage limits that reset at UTC midnight. The architecture is designed for backward compatibility, fail-open behavior, and race condition prevention through database-level atomic operations. The implementation requires updates to the database schema, API endpoint middleware, and frontend UI components, while maintaining complete separation between authenticated and guest user flows.

This blueprint enables parallel development: backend engineers can implement the limit enforcement logic while frontend developers build against the specified API contract. The system is designed to scale horizontally with proper indexing and caching strategies, while maintaining observability through structured logging.

---

## 1. Architecture Diagrams

### Context Diagram (C4 Level 1)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Rapha Lumina Platform                        │
│                                                                 │
│  ┌──────────────┐                           ┌───────────────┐  │
│  │   Browser    │◄─────────────────────────►│  Chat UI      │  │
│  │  (Guest/User)│    HTTPS/WebSocket        │  (React)      │  │
│  └──────────────┘                           └───────┬───────┘  │
│                                                     │          │
│                                                     ▼          │
│                                          ┌────────────────────┐│
│                                          │  Express API       ││
│                                          │  /api/chat         ││
│                                          │  (Limit Enforcer)  ││
│                                          └────────┬───────────┘│
│                                                   │            │
│                      ┌────────────────────────────┼───────┐    │
│                      ▼                            ▼       │    │
│              ┌───────────────┐          ┌─────────────┐  │    │
│              │  PostgreSQL   │          │  Anthropic  │  │    │
│              │  (Drizzle ORM)│          │  Claude API │  │    │
│              │               │          │             │  │    │
│              │ - users       │          └─────────────┘  │    │
│              │ - subscriptions│                          │    │
│              │ - messages    │                          │    │
│              └───────────────┘                          │    │
│                                                         │    │
│              ┌───────────────────────────────────────────┘    │
│              │ localStorage (Guest users only)                │
│              └────────────────────────────────────────────────┘
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

External Dependencies:
- Anthropic Claude API (AI responses)
- Browser localStorage (Guest tracking)
```

### Container Diagram (C4 Level 2) - Chat Limit System

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React/TypeScript)                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Chat.tsx                                                 │  │
│  │  - Manages message state                                  │  │
│  │  - Handles guest usage tracking (localStorage)            │  │
│  │  - Displays upgrade prompts                               │  │
│  └────────────────────┬─────────────────────────────────────┘  │
│                       │ POST /api/chat                          │
│                       │ { content, history? }                   │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                Backend (Express/TypeScript)                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  routes.ts - /api/chat endpoint                          │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  1. Authentication Check                           │  │  │
│  │  │     isAuthenticated? → User flow : Guest flow      │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  2. Limit Check (NEW)                              │  │  │
│  │  │     - checkChatLimit(userId, tier)                 │  │  │
│  │  │     - Auto-reset if needed                         │  │  │
│  │  │     - Return limit status                          │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  3. Process Chat                                   │  │  │
│  │  │     - Call Anthropic API                           │  │  │
│  │  │     - Generate response                            │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  4. Increment Usage (NEW)                          │  │  │
│  │  │     - Atomic DB update                             │  │  │
│  │  │     - Only on success                              │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│  ┌──────────────────────▼───────────────────────────────────┐  │
│  │  chatLimitService.ts (NEW)                              │  │
│  │  - checkAndResetLimit(subscription): LimitStatus        │  │
│  │  - incrementChatUsage(subscriptionId): void             │  │
│  │  - shouldResetLimit(lastResetDate): boolean             │  │
│  │  - getTierConfig(tier): TierConfig                      │  │
│  └──────────────────────┬───────────────────────────────────┘  │
│                         │                                       │
│  ┌──────────────────────▼───────────────────────────────────┐  │
│  │  storage.ts - Enhanced with limit operations            │  │
│  │  - getUserSubscription(userId)                           │  │
│  │  - updateSubscriptionUsage(id, chatsUsed, resetDate)    │  │
│  │  - incrementChatUsageAtomic(subscriptionId)             │  │
│  │  - resetDailyUsage(subscriptionId, resetDate)           │  │
│  └──────────────────────┬───────────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PostgreSQL Database                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  subscriptions table (UPDATED)                          │  │
│  │  - id (PK)                                               │  │
│  │  - userId (FK)                                           │  │
│  │  - tier (enum: free, premium, transformation)            │  │
│  │  - chatLimit (varchar: "5", "10", "unlimited")           │  │
│  │  - chatsUsed (varchar → integer) [CHANGED]              │  │
│  │  - dailyChatsUsed (integer) [NEW]                       │  │
│  │  - lastResetDate (date) [NEW]                           │  │
│  │  - status, timestamps...                                 │  │
│  │                                                          │  │
│  │  INDEX: idx_subscriptions_user_id ON userId             │  │
│  │  INDEX: idx_subscriptions_last_reset ON lastResetDate   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema Changes

### Updated Subscriptions Table (Drizzle Schema)

**File: `/home/rapha-lumina/github-backups/Rapha-Lumina/shared/schema.ts`**

```typescript
// Add to imports
import { integer, date, index } from "drizzle-orm/pg-core";

// Updated subscriptions table (lines 91-108)
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  tier: varchar("tier", { enum: ["free", "premium", "transformation"] }).notNull().default("free"),
  chatLimit: varchar("chat_limit").notNull().default("5"), // "5", "10", or "unlimited"

  // DEPRECATED: Keep for backward compatibility, but use dailyChatsUsed instead
  chatsUsed: varchar("chats_used").notNull().default("0"),

  // NEW FIELDS for daily limit tracking
  dailyChatsUsed: integer("daily_chats_used").notNull().default(0),
  lastResetDate: date("last_reset_date").default(sql`CURRENT_DATE`),

  status: varchar("status", { enum: ["active", "cancelled", "expired"] }).notNull().default("active"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  odooExternalId: varchar("odoo_external_id"),
  odooRevision: timestamp("odoo_revision"),
  odooLastSyncAt: timestamp("odoo_last_sync_at"),
  odooSource: varchar("odoo_source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => [
  index("idx_subscriptions_user_id").on(table.userId),
  index("idx_subscriptions_last_reset").on(table.lastResetDate),
]);
```

### SQL Migration Script

**File: `/home/rapha-lumina/github-backups/Rapha-Lumina/migrations/001_add_daily_chat_limits.sql`**

```sql
-- Migration: Add daily chat limit tracking
-- Created: 2025-01-13
-- Description: Adds dailyChatsUsed and lastResetDate fields for daily limit enforcement

-- Add new columns
ALTER TABLE subscriptions
ADD COLUMN daily_chats_used INTEGER NOT NULL DEFAULT 0,
ADD COLUMN last_reset_date DATE DEFAULT CURRENT_DATE;

-- Create index for efficient reset queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_last_reset ON subscriptions(last_reset_date);

-- Backfill existing data: set lastResetDate to today and dailyChatsUsed to 0
UPDATE subscriptions
SET last_reset_date = CURRENT_DATE,
    daily_chats_used = 0
WHERE last_reset_date IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN subscriptions.daily_chats_used IS 'Number of chats used today, resets at UTC midnight';
COMMENT ON COLUMN subscriptions.last_reset_date IS 'Date of last daily usage reset (UTC), used to trigger auto-reset';
```

### Backward Compatibility Strategy

1. **Dual Field Support**: Keep `chatsUsed` (varchar) for backward compatibility, use `dailyChatsUsed` (integer) for new logic
2. **Default Values**: New fields have safe defaults (0 for usage, CURRENT_DATE for reset date)
3. **Non-Breaking**: Existing queries continue to work; new queries use new fields
4. **Migration Path**: Gradual transition; deprecate `chatsUsed` after 2-3 months

---

## 3. API Contract Specifications

### Updated `/api/chat` Endpoint

**Endpoint**: `POST /api/chat`

**Authentication**: Optional (supports both authenticated users and guests)

**Request Headers**:
```
Content-Type: application/json
Cookie: connect.sid=<session-id> (if authenticated)
```

**Request Body**:
```typescript
{
  content: string;           // Required: User's chat message
  history?: Message[];       // Optional: Conversation history (guests only)
}
```

**Success Response (200 OK)**:
```typescript
{
  userMessage: {
    id: string;
    userId?: string;         // Present for authenticated users
    sessionId?: string;      // Present for guests ("local")
    role: "user";
    content: string;
    timestamp: string;       // ISO 8601
  },
  assistantMessage: {
    id: string;
    userId?: string;
    sessionId?: string;
    role: "assistant";
    content: string;
    timestamp: string;
  },
  limitStatus?: {           // NEW: Present for authenticated users
    tier: "free" | "premium" | "transformation";
    dailyLimit: number | "unlimited";
    used: number;
    remaining: number | "unlimited";
    resetAt: string;        // ISO 8601 timestamp of next reset
    hasLimit: boolean;      // false for unlimited tier
  }
}
```

**Error Response (429 Too Many Requests)** - Limit Exceeded:
```typescript
{
  error: "chat_limit_exceeded";
  message: string;          // Human-readable error message
  limitStatus: {
    tier: "free" | "premium";
    dailyLimit: number;
    used: number;
    remaining: 0;
    resetAt: string;        // When limit resets
    hasLimit: true;
  },
  upgradePrompt: {
    title: string;          // Tier-specific upgrade message
    description: string;
    ctaText: string;        // "Upgrade to Premium" or "Go Unlimited"
    ctaUrl: string;         // Link to pricing page
    nextTier: "premium" | "transformation";
  }
}
```

**Error Response (503 Service Unavailable)** - Fail-Open Scenario:
```typescript
{
  error: "limit_check_failed";
  message: "Unable to verify usage limits. Chat allowed.";
  warning: "Your usage may not be tracked correctly.";
  assistantMessage: { /* normal response */ }
}
```

**Error Response (400 Bad Request)**:
```typescript
{
  error: "invalid_request";
  message: "Message content is required";
}
```

**Error Response (500 Internal Server Error)**:
```typescript
{
  error: "chat_processing_failed";
  message: string;          // Error description
}
```

### Status Code Summary

| Code | Scenario | Action |
|------|----------|--------|
| 200 | Success, chat processed | Display response + limit status |
| 429 | Limit exceeded | Show upgrade prompt |
| 503 | Limit check failed (DB down) | Allow chat with warning |
| 400 | Invalid request | Show error to user |
| 500 | AI API or processing error | Show generic error |

---

## 4. Sequence Diagrams

### Sequence 1: Guest User Chat Flow (No Account)

```
┌────────┐          ┌──────────┐          ┌─────────────┐
│ Browser│          │  Chat UI │          │ localStorage│
└───┬────┘          └────┬─────┘          └──────┬──────┘
    │                    │                       │
    │  [User types msg]  │                       │
    │ ──────────────────>│                       │
    │                    │                       │
    │                    │  Read "guestChatCount"│
    │                    │ ─────────────────────>│
    │                    │<──────────────────────│
    │                    │    count = 1          │
    │                    │                       │
    │                    │ [Check: count >= 2?]  │
    │                    │        NO             │
    │                    │                       │
    │                    │  POST /api/chat       │
    │                    │  { content, history } │
    │                    │ ──────────────────────┐
    │                    │                       │
    │                    │   [Server: No auth,   │
    │                    │    skip DB check,     │
    │                    │    call Anthropic]    │
    │                    │<──────────────────────┘
    │                    │  200 OK               │
    │                    │  { user/assistant msg }│
    │                    │                       │
    │                    │  Increment count = 2  │
    │                    │ ─────────────────────>│
    │                    │  Save to localStorage │
    │                    │                       │
    │  [Display response]│                       │
    │<───────────────────│                       │
    │                    │                       │
    │  [User types 3rd msg]                      │
    │ ──────────────────>│                       │
    │                    │  Read count = 2       │
    │                    │ ─────────────────────>│
    │                    │<──────────────────────│
    │                    │                       │
    │                    │ [Check: count >= 2?]  │
    │                    │        YES            │
    │                    │                       │
    │  [Show upgrade prompt modal]               │
    │<───────────────────│                       │
    │  "Sign up for 5 free chats daily"          │
    │                    │                       │
```

### Sequence 2: Authenticated User Chat Flow (Within Limit)

```
┌────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐  ┌──────────┐
│ Browser│  │  Chat UI │  │ Express API│  │  Storage │  │PostgreSQL│
└───┬────┘  └────┬─────┘  └─────┬──────┘  └────┬─────┘  └────┬─────┘
    │            │               │              │             │
    │  [User sends msg]          │              │             │
    │ ──────────>│               │              │             │
    │            │ POST /api/chat│              │             │
    │            │ {content}     │              │             │
    │            │──────────────>│              │             │
    │            │               │              │             │
    │            │               │ 1. Check auth (user.id)    │
    │            │               │              │             │
    │            │               │ 2. Get subscription         │
    │            │               │ getUserSubscription(userId) │
    │            │               │─────────────>│             │
    │            │               │              │ SELECT *    │
    │            │               │              │ FROM subs   │
    │            │               │              │ WHERE user..│
    │            │               │              │────────────>│
    │            │               │              │<────────────│
    │            │               │<─────────────│ {tier:free, │
    │            │               │  dailyLimit:5, used:3...}  │
    │            │               │              │             │
    │            │               │ 3. Check reset needed      │
    │            │               │ lastResetDate < today?     │
    │            │               │    YES → Reset usage       │
    │            │               │              │             │
    │            │               │ resetDailyUsage(subId)     │
    │            │               │─────────────>│             │
    │            │               │              │ UPDATE subs │
    │            │               │              │ SET daily_  │
    │            │               │              │ chats_used=0│
    │            │               │              │ last_reset= │
    │            │               │              │ CURRENT_DATE│
    │            │               │              │────────────>│
    │            │               │              │<────────────│
    │            │               │<─────────────│             │
    │            │               │              │             │
    │            │               │ 4. Check limit: used < 5?  │
    │            │               │         YES                │
    │            │               │              │             │
    │            │               │ 5. Call Anthropic API      │
    │            │               │ [Generate response]        │
    │            │               │              │             │
    │            │               │ 6. Increment usage (atomic)│
    │            │               │ incrementChatUsageAtomic() │
    │            │               │─────────────>│             │
    │            │               │              │ UPDATE subs │
    │            │               │              │ SET daily_  │
    │            │               │              │ chats_used= │
    │            │               │              │ daily_chats_│
    │            │               │              │ used + 1    │
    │            │               │              │ WHERE id=.. │
    │            │               │              │────────────>│
    │            │               │              │<────────────│
    │            │               │<─────────────│             │
    │            │               │              │             │
    │            │               │ 7. Save messages to DB     │
    │            │               │              │             │
    │            │ 200 OK        │              │             │
    │            │ {userMsg, assistantMsg,      │             │
    │            │  limitStatus: {used:4,       │             │
    │            │   remaining:1, tier:"free"}} │             │
    │            │<──────────────│              │             │
    │            │               │              │             │
    │ [Display] │                │              │             │
    │ [Show: "1 chat remaining"]│              │             │
    │<───────────│               │              │             │
```

### Sequence 3: Authenticated User - Limit Exceeded

```
┌────────┐  ┌──────────┐  ┌────────────┐  ┌──────────┐
│ Browser│  │  Chat UI │  │ Express API│  │PostgreSQL│
└───┬────┘  └────┬─────┘  └─────┬──────┘  └────┬─────┘
    │            │               │              │
    │  [User sends msg]          │              │
    │ ──────────>│ POST /api/chat│              │
    │            │──────────────>│              │
    │            │               │              │
    │            │               │ 1. Get subscription         │
    │            │               │ {tier:free, dailyLimit:5,   │
    │            │               │  dailyChatsUsed:5, ...}     │
    │            │               │              │
    │            │               │ 2. Check reset needed       │
    │            │               │ lastResetDate < today?      │
    │            │               │    NO (same day)            │
    │            │               │              │
    │            │               │ 3. Check limit: used >= 5?  │
    │            │               │         YES (EXCEEDED)      │
    │            │               │              │
    │            │               │ 4. Calculate resetAt        │
    │            │               │    tomorrow 00:00 UTC       │
    │            │               │              │
    │            │               │ 5. Build upgrade prompt     │
    │            │               │    tier=free → suggest      │
    │            │               │    "Upgrade to Premium"     │
    │            │               │              │
    │            │ 429 Too Many Requests        │
    │            │ {error:"chat_limit_exceeded",│
    │            │  limitStatus:{used:5,        │
    │            │   remaining:0, resetAt:...}, │
    │            │  upgradePrompt:{title:"...", │
    │            │   ctaUrl:"/pricing"}}        │
    │            │<──────────────│              │
    │            │               │              │
    │ [Display upgrade modal]    │              │
    │ "You've used all 5 chats"  │              │
    │ "Upgrade to Premium: 10/day"              │
    │ [CTA: "Upgrade Now"]       │              │
    │<───────────│               │              │
    │            │               │              │
    │  [User clicks "Upgrade"]   │              │
    │ ──────────>│ Navigate to   │              │
    │            │ /pricing      │              │
```

### Sequence 4: Daily Reset Logic Flow (Automated)

```
┌────────────┐          ┌──────────┐          ┌──────────┐
│ Express API│          │  Storage │          │PostgreSQL│
└─────┬──────┘          └────┬─────┘          └────┬─────┘
      │                      │                      │
      │ [Any /api/chat request]                     │
      │                      │                      │
      │ getUserSubscription(userId)                 │
      │─────────────────────>│                      │
      │                      │ SELECT *             │
      │                      │ FROM subscriptions   │
      │                      │ WHERE user_id = ...  │
      │                      │─────────────────────>│
      │                      │<─────────────────────│
      │<─────────────────────│ {lastResetDate:      │
      │  "2025-01-12", dailyChatsUsed: 5}           │
      │                      │                      │
      │ [Check reset condition]                     │
      │ shouldResetLimit(lastResetDate)             │
      │   today = "2025-01-13"                      │
      │   lastResetDate = "2025-01-12"              │
      │   today > lastResetDate → TRUE              │
      │                      │                      │
      │ resetDailyUsage(subscriptionId)             │
      │─────────────────────>│                      │
      │                      │ UPDATE subscriptions │
      │                      │ SET                  │
      │                      │   daily_chats_used=0,│
      │                      │   last_reset_date=   │
      │                      │   CURRENT_DATE,      │
      │                      │   updated_at=NOW()   │
      │                      │ WHERE id = ...       │
      │                      │─────────────────────>│
      │                      │<─────────────────────│
      │<─────────────────────│ {dailyChatsUsed: 0}  │
      │                      │                      │
      │ [Continue with limit check]                 │
      │ used=0, limit=5 → ALLOWED                   │
      │                      │                      │
```

---

## 5. Data Models

### TypeScript Interfaces

**File: `/home/rapha-lumina/github-backups/Rapha-Lumina/shared/types.ts` (new file)**

```typescript
// ===== Tier Configuration =====
export type SubscriptionTier = "free" | "premium" | "transformation";

export interface TierConfig {
  tier: SubscriptionTier;
  dailyLimit: number | "unlimited";
  displayName: string;
  price?: string;
}

export const TIER_CONFIGS: Record<SubscriptionTier, TierConfig> = {
  free: {
    tier: "free",
    dailyLimit: 5,
    displayName: "Free",
    price: "$0",
  },
  premium: {
    tier: "premium",
    dailyLimit: 10,
    displayName: "Premium",
    price: "$19/month",
  },
  transformation: {
    tier: "transformation",
    dailyLimit: "unlimited",
    displayName: "Transformation",
    price: "$49/month",
  },
};

// Guest tier (no account)
export const GUEST_TIER_CONFIG = {
  tier: "guest" as const,
  totalLimit: 2,
  displayName: "Guest",
};

// ===== Limit Status =====
export interface LimitStatus {
  tier: SubscriptionTier;
  dailyLimit: number | "unlimited";
  used: number;
  remaining: number | "unlimited";
  resetAt: string; // ISO 8601 timestamp
  hasLimit: boolean; // false for unlimited tier
}

// ===== Upgrade Prompt =====
export interface UpgradePrompt {
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  nextTier: "premium" | "transformation";
}

export const UPGRADE_PROMPTS: Record<SubscriptionTier | "guest", UpgradePrompt> = {
  guest: {
    title: "Sign up for more conversations",
    description: "Create a free account to get 5 daily chats with Rapha Lumina.",
    ctaText: "Sign Up Free",
    ctaUrl: "/signup",
    nextTier: "premium",
  },
  free: {
    title: "Upgrade to Premium",
    description: "Get 10 daily chats and priority support for just $19/month.",
    ctaText: "Upgrade to Premium",
    ctaUrl: "/pricing?tier=premium",
    nextTier: "premium",
  },
  premium: {
    title: "Go Unlimited with Transformation",
    description: "Unlimited chats, advanced features, and personalized guidance for $49/month.",
    ctaText: "Upgrade to Transformation",
    ctaUrl: "/pricing?tier=transformation",
    nextTier: "transformation",
  },
  transformation: {
    title: "You have unlimited access",
    description: "You're on the Transformation tier with unlimited chats.",
    ctaText: "Manage Subscription",
    ctaUrl: "/account/subscription",
    nextTier: "transformation",
  },
};

// ===== API Response Types =====
export interface ChatSuccessResponse {
  userMessage: {
    id: string;
    userId?: string;
    sessionId?: string;
    role: "user";
    content: string;
    timestamp: string;
  };
  assistantMessage: {
    id: string;
    userId?: string;
    sessionId?: string;
    role: "assistant";
    content: string;
    timestamp: string;
  };
  limitStatus?: LimitStatus;
}

export interface ChatLimitExceededError {
  error: "chat_limit_exceeded";
  message: string;
  limitStatus: LimitStatus;
  upgradePrompt: UpgradePrompt;
}

export interface ChatFailOpenError {
  error: "limit_check_failed";
  message: string;
  warning: string;
  assistantMessage: any; // Normal response included
}

// ===== Updated Subscription Type =====
export interface SubscriptionWithLimits {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  chatLimit: string; // "5", "10", "unlimited" (deprecated, use tierConfig)
  chatsUsed: string; // deprecated
  dailyChatsUsed: number; // NEW: current daily usage
  lastResetDate: string | null; // NEW: date of last reset (YYYY-MM-DD)
  status: "active" | "cancelled" | "expired";
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### Guest User LocalStorage Schema

```typescript
// Stored in localStorage with key: "raphaLumina_guestUsage"
interface GuestUsageData {
  chatCount: number;         // Total chats used (max 2)
  firstChatAt: string;        // ISO timestamp of first chat
  lastChatAt: string;         // ISO timestamp of last chat
  version: 1;                 // Schema version for future migrations
}
```

---

## 6. Implementation Guidance

### Critical Files to Modify

#### A. Database Schema (`shared/schema.ts`)

**Changes Required**:
1. Add imports: `integer, date, index` from `drizzle-orm/pg-core`
2. Add fields to `subscriptions` table (lines 91-108):
   - `dailyChatsUsed: integer("daily_chats_used").notNull().default(0)`
   - `lastResetDate: date("last_reset_date").default(sql\`CURRENT_DATE\`)`
3. Add indexes for performance in table definition callback

#### B. Storage Layer (`server/storage.ts`)

**New Methods to Add**:

```typescript
// Add to IStorage interface
resetDailyUsage(subscriptionId: string): Promise<Subscription>;
incrementChatUsageAtomic(subscriptionId: string): Promise<void>;

// Add to DatabaseStorage class
async resetDailyUsage(subscriptionId: string): Promise<Subscription> {
  const [updated] = await db
    .update(subscriptions)
    .set({
      dailyChatsUsed: 0,
      lastResetDate: sql`CURRENT_DATE`,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, subscriptionId))
    .returning();
  return updated;
}

async incrementChatUsageAtomic(subscriptionId: string): Promise<void> {
  await db
    .update(subscriptions)
    .set({
      dailyChatsUsed: sql`${subscriptions.dailyChatsUsed} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.id, subscriptionId));
}
```

#### C. Chat Limit Service (NEW FILE: `server/chatLimitService.ts`)

```typescript
import { storage } from "./storage";
import {
  type SubscriptionTier,
  type LimitStatus,
  type UpgradePrompt,
  TIER_CONFIGS,
  UPGRADE_PROMPTS
} from "../shared/types";

export interface LimitCheckResult {
  allowed: boolean;
  limitStatus: LimitStatus;
  upgradePrompt?: UpgradePrompt;
}

export class ChatLimitService {
  /**
   * Check if user can send a chat message and return limit status
   * Automatically resets usage if a new day has started
   */
  async checkChatLimit(userId: string): Promise<LimitCheckResult> {
    // Get user's subscription
    let subscription = await storage.getUserSubscription(userId);

    // If no subscription exists, create free tier subscription
    if (!subscription) {
      subscription = await storage.createSubscription({
        userId,
        tier: "free",
        chatLimit: "5",
        chatsUsed: "0",
        status: "active",
      });
    }

    const tier = subscription.tier as SubscriptionTier;
    const tierConfig = TIER_CONFIGS[tier];

    // Check if reset is needed
    if (this.shouldResetLimit(subscription.lastResetDate)) {
      subscription = await storage.resetDailyUsage(subscription.id);
    }

    // Unlimited tier always allowed
    if (tierConfig.dailyLimit === "unlimited") {
      return {
        allowed: true,
        limitStatus: {
          tier,
          dailyLimit: "unlimited",
          used: subscription.dailyChatsUsed ?? 0,
          remaining: "unlimited",
          resetAt: this.getNextResetTime(),
          hasLimit: false,
        },
      };
    }

    // Check if limit exceeded
    const used = subscription.dailyChatsUsed ?? 0;
    const dailyLimit = tierConfig.dailyLimit as number;
    const remaining = Math.max(0, dailyLimit - used);
    const allowed = used < dailyLimit;

    const limitStatus: LimitStatus = {
      tier,
      dailyLimit,
      used,
      remaining,
      resetAt: this.getNextResetTime(),
      hasLimit: true,
    };

    return {
      allowed,
      limitStatus,
      upgradePrompt: allowed ? undefined : UPGRADE_PROMPTS[tier],
    };
  }

  /**
   * Increment chat usage count (call only after successful chat)
   */
  async incrementUsage(subscriptionId: string): Promise<void> {
    await storage.incrementChatUsageAtomic(subscriptionId);
  }

  /**
   * Check if daily usage should be reset based on last reset date
   */
  private shouldResetLimit(lastResetDate: string | null): boolean {
    if (!lastResetDate) return true;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD in UTC
    return lastResetDate < today;
  }

  /**
   * Calculate next reset time (midnight UTC tomorrow)
   */
  private getNextResetTime(): string {
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    return tomorrow.toISOString();
  }
}

export const chatLimitService = new ChatLimitService();
```

#### D. API Routes (`server/routes.ts`)

**Modify `/api/chat` endpoint** - Add limit checking before processing chat, increment usage after success, handle 429 responses.

#### E. Frontend Chat UI (`client/src/pages/chat.tsx`)

**Key Changes**:
1. Guest limit tracking with localStorage
2. Pre-flight limit check before sending
3. Handle 429 responses with upgrade modals
4. Display remaining chats counter

---

## 7. Scalability & Performance Considerations

### Database Indexing

```sql
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_last_reset ON subscriptions(last_reset_date);
```

### Query Optimization

**Performance**: ~10-15ms total DB time (3 queries, all indexed)

### Performance SLA

**Target**: < 2s end-to-end response time

**Breakdown**:
- Client → Server: 50ms
- Limit Check: 15ms
- Anthropic API: 1500ms
- Message Persistence: 50ms
- Server → Client: 50ms
- **Total**: ~1665ms ✓

---

## 8. Implementation Backlog

### Phase 1: Core Infrastructure (8-10 hours)

**Backend Tasks**:
- [ ] Task 1.1: Run SQL migration (30 min)
- [ ] Task 1.2: Update Drizzle schema (20 min)
- [ ] Task 1.3: Create TypeScript types (30 min)
- [ ] Task 1.4: Add storage methods (45 min)
- [ ] Task 1.5: Create ChatLimitService (1.5 hrs)
- [ ] Task 1.6: Update /api/chat endpoint (2 hrs)

**Frontend Tasks**:
- [ ] Task 1.7: Add guest usage tracking (1 hr)
- [ ] Task 1.8: Handle 429 responses (1.5 hrs)
- [ ] Task 1.9: Display remaining chats (30 min)

### Phase 2: Testing & Polish (7 hours)

- [ ] Task 2.1: Unit tests for ChatLimitService (2 hrs)
- [ ] Task 2.2: Integration tests for /api/chat (2 hrs)
- [ ] Task 2.3: Manual QA testing (2 hrs)
- [ ] Task 2.4: Add structured logging (1 hr)

---

## 9. Open Questions

1. **Reset Timing**: Confirm UTC midnight is acceptable?
2. **Fail-Open vs Fail-Closed**: Allow chat if DB unavailable?
3. **Guest Limit Enforcement**: Accept localStorage limitation?
4. **Upgrade Prompt Design**: Modal vs banner vs toast?
5. **Existing User Migration**: Default all to "free" tier?
6. **Transformation Tier Tracking**: Track usage for analytics?
7. **Admin Override**: Support bonus chats capability?
8. **Upgrade Analytics**: Track conversion sources?

---

## 10. Deployment Checklist

**Pre-Deployment**:
- [ ] Run database migration on staging
- [ ] Verify indexes created
- [ ] Test all flows on staging
- [ ] Load test: 100 concurrent users
- [ ] Review fail-open behavior

**Deployment Steps**:
1. Deploy database migration
2. Deploy backend code
3. Deploy frontend code
4. Monitor for 1 hour post-deploy

**Rollback Plan**:
- Database migration is additive (safe)
- Rollback backend to previous version
- Rollback frontend to previous version

---

## Summary

This System Blueprint provides a complete specification for implementing the Chat Limit Enforcement System with:

- **Backward Compatibility**: No breaking changes
- **Performance**: Sub-2-second response times
- **Reliability**: Fail-open behavior
- **Scalability**: Stateless design, atomic operations
- **Observability**: Structured logging

**Implementation Timeline**: 8-10 hours for Phase 1, 7 hours for Phase 2.
