# MVP Plan v1: Chat Limit Enforcement System

## Executive Summary

**Product Vision**: Convert free users into paid subscribers through tiered chat access that provides clear value at each subscription level while maintaining a positive user experience.

**Target Go-Live Date**: 2 days from project start (Implementation: Day 1, Testing & Deployment: Day 2)

**Core Hypothesis Being Tested**: Users will upgrade to paid tiers when they encounter chat limits, provided the upgrade path is clear and the value proposition is compelling at each tier.

**Top 3 Must-Have Features**:
1. Per-tier usage tracking with automatic daily reset (Guest: 2 total, Free: 5/day, Premium: 10/day, Transformation: unlimited)
2. Real-time limit enforcement at API level with graceful error handling
3. Contextual upgrade prompts that guide users to the next tier

**#1 Risk & Mitigation**:
- **Risk**: Timezone-based reset logic causing false lockouts or premature resets
- **Mitigation**: Use UTC-only for MVP, store lastResetDate as ISO timestamp, implement idempotent reset logic that can be safely retried

---

## 1. MVP Charter

### Target Audience

**Primary Personas:**

1. **Guest User (Testing Phase)**
   - Pain Point: Wants to try the service without commitment
   - Behavior: Expects 1-2 interactions before deciding to sign up
   - Context: Mobile or desktop, likely first-time visitor
   - Need: Quick value demonstration without friction

2. **Free Tier User (Regular User)**
   - Pain Point: Needs daily guidance but budget-conscious
   - Behavior: Uses service 3-7 times per day, establishes routine
   - Context: Daily check-ins, specific problem-solving
   - Need: Predictable access that fits daily workflow

3. **Premium Tier User (Power User)**
   - Pain Point: Requires more frequent access but not constant
   - Behavior: Heavy usage during active projects/challenges
   - Context: Professional or personal development goals
   - Need: Sufficient headroom for intensive usage days

4. **Transformation Tier User (Committed User)**
   - Pain Point: Wants unlimited access without usage anxiety
   - Behavior: Integrates service deeply into life/work
   - Context: All-day access across multiple contexts
   - Need: Zero friction, unlimited exploration

### Problem Statement

Users currently have unlimited chat access regardless of subscription tier, preventing monetization while providing no incentive structure for upgrades or resource management controls.

### Value Proposition

**For Users**: Clear, predictable access limits that match their commitment level, with transparent upgrade paths that deliver immediate value increases (2.5x at each tier: 2 → 5 → 10 → unlimited).

**For Business**: Converts free users to paid subscribers by demonstrating value before imposing limits, creating natural upgrade moments without aggressive sales tactics.

**Differentiation**: Tier-appropriate limits (not artificially restrictive at free tier) with same-day value increase upon upgrade, no credit card required to test service.

### Success Metrics

1. **Functional Correctness**: 100% accurate limit enforcement across all tiers (0 false positives/negatives) within 72 hours post-launch
2. **User Experience**: Chat response time remains <2 seconds including limit checks (measured at p95)
3. **Conversion Funnel**: 15% of users who hit free tier limit view upgrade page within 7 days
4. **System Reliability**: 99.5% uptime for limit-checking logic (graceful degradation if DB unavailable)
5. **Data Integrity**: Daily reset executes successfully for 100% of users (verified via logs and spot checks)

### Must-Have Features Only

1. **Guest Usage Tracking (localStorage)**
   - Tracks 2-chat lifetime limit using browser localStorage
   - Shows signup prompt after 2nd chat with clear benefits
   - Survives page refreshes, resets only on localStorage clear
   - Directly enables: Guest-to-registered conversion

2. **Authenticated User Limit Enforcement (API-level)**
   - Checks subscription tier and daily usage before processing chat
   - Returns 429 status with tier-specific upgrade message when limit exceeded
   - Increments usage counter atomically after successful chat
   - Directly enables: Tier-based access control and monetization

3. **Automatic Daily Reset Logic**
   - Compares lastResetDate to current UTC date on each request
   - Resets dailyChatsUsed to 0 and updates lastResetDate if new day detected
   - Idempotent (safe to run multiple times)
   - Directly enables: Daily limit replenishment without cron jobs

4. **Database Schema Extensions**
   - Adds dailyChatsUsed (integer, default 0) to users table
   - Adds lastResetDate (timestamp, nullable) to users table
   - Migration ensures backward compatibility (existing users default to 0 usage)
   - Directly enables: Persistent usage tracking across sessions

5. **Frontend Upgrade Prompts**
   - Displays tier-appropriate modal when 429 error received
   - Shows current tier, limit reached, next tier benefits, upgrade CTA
   - Dismissible but returns on next limit-exceeded attempt
   - Directly enables: Clear conversion path at point of need

6. **Error Handling & Fallbacks**
   - Returns user-friendly messages (no technical jargon)
   - Degrades gracefully if DB unavailable (allows chat with warning log)
   - Handles edge cases: new users, users without lastResetDate, timezone shifts
   - Directly enables: Reliable user experience under failure conditions

---

## 2. MVP Acceptance Criteria

### Feature 1: Guest Usage Tracking (localStorage)

**What "Done" Looks Like:**
- Guest user can complete 2 chats without account
- After 2nd chat completes, signup modal appears immediately
- Chat input is disabled with overlay showing signup prompt
- localStorage key `guestChatCount` accurately reflects 0, 1, or 2
- Clearing localStorage or using incognito resets count to 0

**Measurement/Verification:**
- Manual testing: Complete 2 chats as guest, verify modal appears
- DevTools check: Inspect localStorage for `guestChatCount` key
- Cross-browser test: Verify works in Chrome, Firefox, Safari

**Minimum Quality Threshold:**
- Modal appears within 500ms of 2nd chat completion
- No console errors during tracking
- Count persists across page refreshes

**User-Facing Success Condition:**
```gherkin
Given I am a guest user (not logged in)
When I complete my 2nd chat message
Then I see a modal with heading "You've used your 2 free chats!"
And the modal shows benefits: "Sign up for 5 daily chats"
And the chat input is disabled until I sign up or dismiss
And the localStorage shows guestChatCount = 2
```

---

### Feature 2: Authenticated User Limit Enforcement (API-level)

**What "Done" Looks Like:**
- API endpoint `/api/chat` checks authentication and tier before processing
- Returns 200 + chat response when user is within limit
- Returns 429 + JSON error when user exceeds daily limit
- Increments `dailyChatsUsed` by 1 only after successful chat generation
- Different tiers have different limits enforced (Free: 5, Premium: 10, Transformation: unlimited)

**Measurement/Verification:**
- API tests: Send 6 requests as free user, verify 6th returns 429
- Database check: Verify dailyChatsUsed increments correctly
- Load test: 100 concurrent requests maintain <2s response time

**Minimum Quality Threshold:**
- Limit check adds <100ms to request latency
- Atomic increment (no race conditions with concurrent requests)
- Error response includes tier, currentUsage, dailyLimit fields

**User-Facing Success Condition:**
```gherkin
Given I am a logged-in Free tier user
And I have used 4 chats today
When I send my 5th chat message
Then I receive a successful chat response
And my dailyChatsUsed increments to 5
When I send my 6th chat message
Then I receive a 429 error
And the error message says "Daily limit reached. Upgrade to Premium for 10 daily chats."
And my dailyChatsUsed remains at 5 (no increment on blocked request)
```

---

### Feature 3: Automatic Daily Reset Logic

**What "Done" Looks Like:**
- On each API request, system checks if lastResetDate < current UTC date
- If true, sets dailyChatsUsed = 0 and lastResetDate = current UTC date
- Reset happens automatically (no cron job required)
- Reset is idempotent (running twice doesn't cause issues)
- Users in any timezone get reset at UTC midnight

**Measurement/Verification:**
- Time-travel test: Mock system date, verify reset triggers correctly
- Database audit: Query users where lastResetDate is yesterday, verify all show dailyChatsUsed = 0 after next request
- Log verification: Reset events logged with timestamp

**Minimum Quality Threshold:**
- Reset completes in <50ms
- Zero false resets (user should never lose count mid-day)
- Works correctly across daylight saving transitions

**User-Facing Success Condition:**
```gherkin
Given I am a Free tier user who used 5 chats yesterday
And my lastResetDate is "2025-11-12T00:00:00Z"
And today's UTC date is "2025-11-13"
When I send a chat message today
Then the system detects lastResetDate < current date
And resets my dailyChatsUsed to 0
And updates my lastResetDate to "2025-11-13T00:00:00Z"
And processes my chat successfully (I'm now at 1/5 for today)
```

---

### Feature 4: Database Schema Extensions

**What "Done" Looks Like:**
- Migration script adds `dailyChatsUsed` column (integer, default 0)
- Migration script adds `lastResetDate` column (timestamp, nullable)
- Existing user records have dailyChatsUsed = 0 after migration
- No data loss or corruption during migration
- Schema changes deployed to production without downtime

**Measurement/Verification:**
- Migration dry-run on copy of production DB
- Row count before/after migration matches exactly
- Query sample users to verify new columns exist with correct defaults
- Drizzle ORM types regenerate without errors

**Minimum Quality Threshold:**
- Migration completes in <5 seconds for 10,000 users
- Zero errors or warnings during migration
- Rollback script available and tested

**User-Facing Success Condition:**
```gherkin
Given the database has 1,000 existing users
When the migration script runs
Then all 1,000 users have dailyChatsUsed = 0
And all 1,000 users have lastResetDate = null
And no existing columns or data are modified
And the application can read/write to new columns immediately
```

---

### Feature 5: Frontend Upgrade Prompts

**What "Done" Looks Like:**
- Frontend intercepts 429 responses from chat API
- Modal displays with tier-specific messaging based on error response
- Modal shows: current tier, limit reached message, next tier benefits, upgrade button
- Modal is dismissible (X button or click outside)
- Modal reappears if user tries to chat again while over limit
- Upgrade button links to subscription page with tier pre-selected

**Measurement/Verification:**
- Manual test each tier: Free → Premium, Premium → Transformation
- Verify modal text matches tier (not hardcoded for single tier)
- Check mobile responsiveness on 3 device sizes
- Verify upgrade link has correct tier parameter

**Minimum Quality Threshold:**
- Modal appears within 500ms of API error response
- No layout shift or flashing
- Mobile-friendly (readable on 320px width)
- Accessible (keyboard navigation, ARIA labels)

**User-Facing Success Condition:**
```gherkin
Given I am a Premium tier user
And I have used 10 chats today (my daily limit)
When I try to send an 11th chat message
Then I see a modal with heading "Daily limit reached"
And the modal says "You've used all 10 Premium chats today"
And the modal shows "Upgrade to Transformation for unlimited chats"
And there's a button "Upgrade to Transformation"
When I click the upgrade button
Then I'm taken to /subscribe?tier=transformation
```

---

### Feature 6: Error Handling & Fallbacks

**What "Done" Looks Like:**
- If DB query fails, system logs error and allows chat (fail-open for MVP)
- User receives chat response with header warning: "Usage tracking temporarily unavailable"
- If user record missing lastResetDate, system initializes it to current date
- If dailyChatsUsed somehow negative, system resets to 0
- All error messages are user-friendly (no stack traces or SQL errors shown)

**Measurement/Verification:**
- Chaos test: Disconnect DB mid-request, verify graceful handling
- Edge case tests: null values, missing fields, corrupted data
- Error log review: All errors include context (userId, tier, action)

**Minimum Quality Threshold:**
- System never returns 500 to user (all errors handled)
- Degraded mode latency <3 seconds
- Error logs include actionable debugging info

**User-Facing Success Condition:**
```gherkin
Given I am a Free tier user
And the database is temporarily unavailable
When I send a chat message
Then I receive a chat response within 3 seconds
And I see a dismissible banner: "Usage tracking temporarily unavailable"
And my chat is not blocked (fail-open behavior)
And an error is logged on the server for investigation
```

---

## 3. MVP Roadmap (4-6 Weeks)

**Actual Timeline: 2 Days (Accelerated MVP)**

### Phase 1: Database Schema Updates
**Duration**: 2 hours
**Goal**: Extend database to support usage tracking

**Week 1 - Day 1 Morning (Hours 1-2)**

**Deliverables:**
- [ ] Create migration script for `dailyChatsUsed` and `lastResetDate` columns
- [ ] Test migration on local database copy
- [ ] Update `shared/schema.ts` with new fields in user/subscription table
- [ ] Regenerate Drizzle types
- [ ] Create rollback script

**Acceptance Gates:**
- Migration runs successfully on local DB
- Sample queries confirm columns exist with correct types
- No TypeScript errors after type regeneration

**Dependencies:** None (can start immediately)

**Risk Buffer:** +30 minutes for unexpected migration issues

**Decision Point:** If migration fails on local DB, investigate schema conflicts before proceeding to Phase 2

---

### Phase 2: Backend Logic & API Changes
**Duration**: 3 hours
**Goal**: Implement limit checking and reset logic at API level

**Week 1 - Day 1 Afternoon (Hours 3-5)**

**Deliverables:**
- [ ] Create utility function `checkAndResetDailyLimit(userId)`
  - Fetches user record with subscription tier
  - Compares lastResetDate to current UTC date
  - Resets if new day, returns current usage + tier limit
- [ ] Create utility function `getTierLimit(subscriptionTier)` (returns 5, 10, or Infinity)
- [ ] Modify `/api/chat` endpoint (line 794 in server/routes.ts):
  - Add authentication check (guest vs logged-in)
  - Call `checkAndResetDailyLimit` for logged-in users
  - Compare usage vs limit, return 429 if exceeded
  - Increment `dailyChatsUsed` after successful chat generation
- [ ] Add error response format: `{ error: true, tier, currentUsage, dailyLimit, message }`
- [ ] Add logging for limit-related events (reset, limit hit, errors)

**Acceptance Gates:**
- Postman/curl tests: Free user blocked at 6th request
- Database shows correct usage increments
- Reset logic works with mocked date changes
- Response time <2 seconds with limit checks

**Dependencies:** Phase 1 must be complete (database schema updated)

**Risk Buffer:** +45 minutes for edge case debugging

**Decision Point:** If reset logic shows timezone issues, document workaround for future enhancement but keep UTC-only for MVP

---

### Phase 3: Frontend UI & Notifications
**Duration**: 2 hours
**Goal**: Implement guest tracking and upgrade prompts

**Week 1 - Day 1 Evening (Hours 6-7)**

**Deliverables:**
- [ ] Implement localStorage tracking in `client/src/pages/chat.tsx`:
  - Initialize `guestChatCount` from localStorage on mount
  - Increment after each chat submission
  - Check if count ≥ 2, disable input and show signup modal
- [ ] Create `LimitReachedModal` component:
  - Accepts props: currentTier, dailyLimit, nextTier, upgradeUrl
  - Renders tier-specific messaging
  - Dismissible with X button
  - Links to subscription page with tier parameter
- [ ] Add API error interceptor:
  - Detects 429 responses from `/api/chat`
  - Extracts tier/limit data from error response
  - Shows `LimitReachedModal` with appropriate props
- [ ] Add guest signup modal for 2-chat limit

**Acceptance Gates:**
- Guest modal appears after 2 chats (tested manually)
- Authenticated user modal appears after tier limit (tested for each tier)
- Modals are mobile-responsive
- Upgrade links include correct tier parameter

**Dependencies:** Phase 2 must be complete (API returns proper 429 errors)

**Risk Buffer:** +30 minutes for UI polish and accessibility

**Decision Point:** If modal UX feels too aggressive, consider adding "Remind me tomorrow" option (but document as post-MVP)

---

### Phase 4: Testing & Edge Cases
**Duration**: 3 hours
**Goal**: Validate all scenarios and edge cases

**Week 1 - Day 2 (Hours 8-10)**

**Deliverables:**
- [ ] **Functional Tests:**
  - Test each tier (Guest, Free, Premium, Transformation) hits correct limit
  - Test daily reset logic (mock date changes)
  - Test guest localStorage across refresh/browser restart
  - Test upgrade flow (hit limit → click upgrade → lands on correct page)
- [ ] **Edge Case Tests:**
  - New user (no lastResetDate) → initializes correctly
  - User upgrades mid-day → new limit applies immediately
  - Concurrent requests → no race conditions in usage increment
  - DB unavailable → graceful degradation (fail-open)
  - Negative or corrupted dailyChatsUsed → resets to 0
- [ ] **Performance Tests:**
  - 100 concurrent API requests → all complete <2s
  - Check query performance on users table (index on lastResetDate if needed)
- [ ] **User Acceptance Testing:**
  - Walkthrough as each persona (Guest, Free, Premium, Transformation)
  - Verify error messages are clear and non-technical
  - Confirm upgrade CTAs are compelling

**Acceptance Gates:**
- Zero functional bugs in limit enforcement
- All error scenarios handled gracefully
- Performance metrics met (p95 <2s)
- User flows feel natural (not punishing)

**Dependencies:** All previous phases complete

**Risk Buffer:** +1 hour for bug fixes

**Decision Point:** If critical bugs found, defer deployment and allocate additional debugging time

---

### Deployment Checklist

**Pre-Deployment (30 minutes):**
- [ ] Run migration on staging database
- [ ] Smoke test all tiers on staging
- [ ] Review error logs for unexpected issues
- [ ] Prepare rollback plan (migration rollback + code revert)

**Deployment (15 minutes):**
- [ ] Deploy backend code
- [ ] Run migration on production database
- [ ] Deploy frontend code
- [ ] Verify health check endpoint

**Post-Deployment Monitoring (1 hour):**
- [ ] Watch error logs for 429 responses (should see legitimate limit hits)
- [ ] Monitor API response times (should remain <2s)
- [ ] Spot-check 5 users across tiers in database
- [ ] Test upgrade flow end-to-end in production

---

### Weekly Milestones Summary

| Phase | Duration | Milestone | Dependencies |
|-------|----------|-----------|--------------|
| Phase 1 | 2 hours | Database schema updated, types regenerated | None |
| Phase 2 | 3 hours | API limit enforcement working, tests passing | Phase 1 |
| Phase 3 | 2 hours | Frontend prompts implemented, mobile-friendly | Phase 2 |
| Phase 4 | 3 hours | All tests passing, edge cases handled | Phase 1-3 |
| Deploy | 2 hours | Live in production, monitoring active | Phase 1-4 |

**Total: 12 hours across 2 days**

---

## 4. Out-of-Scope

### Explicitly Deferred Features (With Rationale)

1. **Usage Analytics Dashboard**
   - **What**: Admin panel showing usage trends, tier distribution, limit-hit frequency
   - **Why Deferred**: MVP needs enforcement first; analytics are valuable for optimization later but not launch-blocking
   - **Phase 2 Candidate**: Yes (high value for pricing optimization)

2. **Email Notifications When Limit Reached**
   - **What**: Send email when user hits daily limit with upgrade offer
   - **Why Deferred**: In-app modal is sufficient for MVP; email adds infrastructure complexity (templates, delivery, unsubscribe)
   - **Phase 2 Candidate**: Yes (could improve conversion rates)

3. **Monthly Usage Reports**
   - **What**: Send users monthly summary of chat usage and patterns
   - **Why Deferred**: Requires data warehousing and report generation logic; no direct monetization impact
   - **Phase 2 Candidate**: Maybe (nice-to-have for engagement, but unclear ROI)

4. **Chat History Export Before Limit**
   - **What**: Allow users to download chat history when approaching limit
   - **Why Deferred**: Chat history export is separate feature; mixing with limits adds scope
   - **Phase 2 Candidate**: No (should be standalone feature available to all tiers)

5. **Temporary Limit Increases for Special Occasions**
   - **What**: Admins can grant +5 chats for a day (customer service use case)
   - **Why Deferred**: Edge case that complicates reset logic; workaround is manual tier upgrade
   - **Phase 2 Candidate**: Maybe (useful for customer retention, but low frequency need)

6. **Admin Override Capability**
   - **What**: Admin dashboard to manually reset user limits or grant unlimited access temporarily
   - **Why Deferred**: Can be handled via direct database updates for MVP; building admin UI adds weeks
   - **Phase 2 Candidate**: Yes (important for customer support at scale)

7. **Timezone-Based Resets (User's Local Timezone)**
   - **What**: Reset limits at midnight in user's timezone instead of UTC
   - **Why Deferred**: Adds significant complexity (timezone storage, DST handling, user preference UI); UTC is predictable and simpler
   - **Phase 2 Candidate**: Maybe (better UX but not critical; most users adapt to UTC)

8. **Proactive Limit Warnings**
   - **What**: Show banner when user has 1 chat remaining ("You're close to your daily limit")
   - **Why Deferred**: Adds UI clutter; hitting limit itself is the strongest conversion moment
   - **Phase 2 Candidate**: Yes (could reduce frustration for users who hit limit mid-conversation)

9. **Usage Rollover (Unused Chats Carry Over)**
   - **What**: If user uses 3/5 chats, carry over 2 to next day (up to 2x daily limit)
   - **Why Deferred**: Complicates reset logic and reduces upgrade pressure; behavior is non-standard
   - **Phase 2 Candidate**: No (undermines tier structure)

10. **Per-Conversation Limits (Instead of Per-Message)**
    - **What**: Limit 5 conversations (unlimited messages within each) instead of 5 individual chats
    - **Why Deferred**: Requires defining "conversation" boundaries; current per-message limit is simpler
    - **Phase 2 Candidate**: Maybe (could improve UX but requires product validation)

11. **Soft Launch / Beta Testing Group**
    - **What**: Roll out limits to 10% of users first, monitor before full launch
    - **Why Deferred**: 2-day timeline doesn't allow for staged rollout; MVP is low-risk enough to launch fully
    - **Phase 2 Candidate**: N/A (only relevant for this launch)

12. **A/B Testing Different Limit Tiers**
    - **What**: Test Free: 5 vs 7 chats to optimize conversion
    - **Why Deferred**: Requires A/B testing infrastructure and weeks of data collection
    - **Phase 2 Candidate**: Yes (valuable for pricing optimization after baseline established)

---

### Assumptions Being Made to Limit Scope

1. **UTC-Only Resets**: All users reset at UTC midnight regardless of location (no per-user timezone handling)
2. **No Rollback Requests**: Users who hit limits cannot request "just one more chat" via support (no exception flow)
3. **No Family/Team Accounts**: Each subscription is 1:1 with user; no shared limits across multiple users
4. **No Chat Priority Tiers**: All chats are equal; no concept of "lightweight" vs "heavy" chats consuming different amounts
5. **No Partial Month Upgrades**: User who upgrades mid-day gets new limit immediately (no pro-rating or waiting until next day)
6. **No Downgrade Limit Handling**: User who downgrades keeps current day's usage (if they used 8 chats as Premium then downgrade to Free, they're locked out until next reset)
7. **No Retry Logic for Failed Increments**: If usage increment fails due to DB error, user gets chat but usage isn't tracked (acceptable data loss for MVP)
8. **No Redis/Caching Layer**: All limit checks hit PostgreSQL directly (acceptable performance trade-off for MVP simplicity)
9. **No Rate Limiting**: This is usage limiting, not rate limiting; users can send 5 chats in 5 seconds if they want
10. **No Offline Support**: Guest localStorage tracking only works with internet connection; no offline queue

---

## 5. Risk Register

### Risk 1: Timezone-Based Daily Reset Logic Errors
**Likelihood**: Medium
**Impact**: High
**Description**: Reset logic could fail at DST transitions, leap seconds, or due to server clock drift, causing users to lose access prematurely or get double resets.

**Mitigation Strategy**:
- Use UTC exclusively for all date comparisons (eliminates DST issues)
- Store `lastResetDate` as ISO 8601 timestamp (e.g., "2025-11-13T00:00:00Z")
- Use date comparison only (truncate time to midnight UTC): `currentDate.toISOString().split('T')[0]`
- Make reset logic idempotent: if lastResetDate == currentDate, no-op
- Add comprehensive logging: log every reset event with before/after values
- Include unit tests with mocked dates covering: same day, next day, month rollover, year rollover

**Trigger Condition**: If >5% of users report incorrect reset timing in first 48 hours, halt new deployments and investigate

---

### Risk 2: Race Conditions in Usage Increment (Concurrent Requests)
**Likelihood**: Medium
**Impact**: Medium
**Description**: Two simultaneous chat requests from same user could both read dailyChatsUsed=4, both increment to 5, allowing 6 total chats instead of 5.

**Mitigation Strategy**:
- Use database-level atomic increment: `UPDATE users SET dailyChatsUsed = dailyChatsUsed + 1 WHERE id = ?` (not read-then-write)
- Add optimistic locking: include `WHERE dailyChatsUsed < [limit]` in UPDATE query, check affected rows
- If UPDATE affects 0 rows, user exceeded limit concurrently → return 429 error
- Add database index on userId for fast UPDATE performance
- Load test with 10 concurrent requests from same user to verify behavior
- Consider row-level locking (`SELECT FOR UPDATE`) if atomic increment insufficient

**Trigger Condition**: If usage tracking shows inconsistencies (users reporting wrong counts), implement row-level locking

---

### Risk 3: Guest localStorage Circumvention
**Likelihood**: High
**Impact**: Low
**Description**: Tech-savvy guests can clear localStorage or use incognito mode to reset their 2-chat limit indefinitely.

**Mitigation Strategy**:
- **Accept this risk for MVP**: Preventing all circumvention requires fingerprinting/IP tracking, which adds privacy concerns and complexity
- Focus on optimizing the *conversion flow* for legitimate users (make signup so compelling that circumvention isn't worth the effort)
- Monitor signup rates: if <5% of guests who hit limit sign up, revisit this approach
- Phase 2 options: IP-based tracking (with privacy disclosures), device fingerprinting, CAPTCHA after 2 chats
- Current approach optimizes for user experience over perfect enforcement

**Trigger Condition**: If abuse patterns emerge (e.g., 1000+ guest chats from single IP), implement IP-based soft limits in Phase 2

---

### Risk 4: Database Migration Causes Downtime or Data Loss
**Likelihood**: Low
**Impact**: High
**Description**: Adding columns to production users table could lock table, cause downtime, or corrupt existing data if migration script has bugs.

**Mitigation Strategy**:
- Test migration on exact copy of production database (same row count, data types)
- Use `ADD COLUMN IF NOT EXISTS` to make migration idempotent
- Set default values to eliminate need for UPDATE statements (faster migration)
- Run migration during low-traffic hours (if applicable)
- Prepare rollback script: `ALTER TABLE users DROP COLUMN dailyChatsUsed, DROP COLUMN lastResetDate`
- Use database connection pooling to minimize lock contention
- Monitor table lock duration: PostgreSQL `ADD COLUMN` with default is typically <1 second even for millions of rows
- Have manual rollback plan: revert code deployment, run rollback migration, restart services

**Trigger Condition**: If migration takes >10 seconds or causes errors, immediately roll back and investigate offline

---

### Risk 5: API Performance Degradation (Limit Checks Add Latency)
**Likelihood**: Low
**Impact**: Medium
**Description**: Adding limit checks (DB query + date comparison + increment) could push API response times above 2-second target, degrading user experience.

**Mitigation Strategy**:
- **Optimize queries**:
  - Add index on `users.id` (likely already exists as primary key)
  - Consider composite index on `(id, lastResetDate)` if query plans show full table scans
  - Use single query to fetch user + subscription tier (JOIN instead of 2 queries)
- **Measure first**: Profile API with limit checks in staging, identify bottlenecks
- **Set performance budgets**: Limit check must complete in <100ms (measured at p95)
- **Add caching (Phase 2)**: Cache user tier + limit in Redis with 1-hour TTL
- **Graceful degradation**: If DB query times out (>500ms), fail open (allow chat, log error)
- Load test with 100 concurrent users before production deployment

**Trigger Condition**: If p95 response time exceeds 2 seconds in production, implement Redis caching immediately

---

### Risk 6: Incorrect Tier Limit Mapping
**Likelihood**: Low
**Impact**: High
**Description**: Bug in `getTierLimit()` function could assign wrong limits (e.g., Free users get 10 chats, Premium users get 5), causing user frustration and support burden.

**Mitigation Strategy**:
- **Explicit constant definitions**:
  ```typescript
  const TIER_LIMITS = {
    guest: 2,
    free: 5,
    premium: 10,
    transformation: Infinity
  } as const;
  ```
- **Unit tests for every tier**: Assert Free → 5, Premium → 10, Transformation → Infinity
- **Manual verification**: Test each tier in staging with real subscription records
- **Add tier to API response**: Return `{ tier: "free", limit: 5, used: 3 }` so frontend can display accurate info
- **Code review**: Second engineer reviews tier mapping logic before merge

**Trigger Condition**: If any user reports incorrect limit for their tier, halt all upgrades and audit tier mapping immediately

---

### Risk 7: Upgrade Prompts Don't Convert Users (Product Risk)
**Likelihood**: Medium
**Impact**: Medium
**Description**: Core hypothesis could be wrong: users might churn instead of upgrade when hitting limits, resulting in zero revenue increase and user loss.

**Mitigation Strategy**:
- **Validate messaging before launch**: User test upgrade modal copy with 5 users from each tier
- **Make limits generous**: 5 chats/day for Free tier is genuinely useful (not artificially restrictive)
- **Optimize CTA clarity**: Button says "Upgrade to Premium - 10 chats/day" (not vague "Upgrade")
- **Add escape hatch**: Include "Remind me tomorrow" option to reduce churn (deferred to Phase 2 but keep in mind)
- **Monitor metrics closely**:
  - Track: limit-hit rate, upgrade-view rate, upgrade-complete rate, churn rate
  - Goal: 15% of limit-hit users view upgrade page within 7 days
  - If <5% view upgrade page, messaging is ineffective → revise copy
  - If >50% churn after hitting limit, limits are too restrictive → increase Free tier to 7 chats
- **Fast iteration**: Allocate 1 week post-launch for messaging tweaks based on data

**Trigger Condition**: If churn rate increases >20% in first week, immediately increase Free tier limit to 7 chats and revise modal copy

---

## Handoff Checklist for Systems Blueprint Architect

### Technical Constraints Discovered During Planning
- [ ] Database: PostgreSQL with Drizzle ORM (existing stack, no changes)
- [ ] Must maintain backward compatibility: existing users without new columns must work seamlessly
- [ ] Authentication: Replit Auth system (guest vs authenticated distinction already exists)
- [ ] API response time budget: <2 seconds including limit checks (p95 metric)
- [ ] Frontend: React (chat.tsx at client/src/pages/chat.tsx)
- [ ] Backend: Node.js/Express (routes.ts at server/routes.ts, line 794 for /api/chat endpoint)

### Integration Requirements
- [ ] `/api/chat` endpoint must integrate limit checking before processing chat logic
- [ ] Frontend must intercept 429 HTTP status codes and display modal
- [ ] Guest tracking uses browser localStorage (no backend integration required for guest flow)
- [ ] Subscription tier data already exists in database (subscriptions table) - fetch via JOIN on user query
- [ ] Error responses must follow format: `{ error: true, tier: string, currentUsage: number, dailyLimit: number, message: string }`

### Data/Security/Compliance Considerations
- [ ] **Data Privacy**: Guest localStorage tracking is client-side only (no PII stored)
- [ ] **GDPR Compliance**: Usage data (dailyChatsUsed, lastResetDate) is operational data tied to account, covered under existing ToS
- [ ] **Security**: No new authentication mechanism; relies on existing Replit Auth
- [ ] **Rate Limiting**: This is usage limiting, not DDoS protection; existing rate limiting (if any) remains separate concern
- [ ] **Data Retention**: Usage counts reset daily (no long-term storage required for MVP)
- [ ] **Audit Trail**: Log limit-hit events and reset events for debugging (no user-facing audit log required)

### Scale Expectations for MVP
- [ ] **User Volume**: Assume <10,000 total users, <1,000 concurrent during peak
- [ ] **Chat Volume**: ~500 chats/hour during peak (well within PostgreSQL capacity)
- [ ] **Database Reads**: 1 read per chat request (fetch user + tier + usage)
- [ ] **Database Writes**: 1 write per chat request (increment dailyChatsUsed)
- [ ] **Storage**: 2 new integer/timestamp columns = ~16 bytes per user (negligible storage impact)
- [ ] **Caching**: Not required for MVP; PostgreSQL can handle this load directly
- [ ] **Scalability Runway**: Current approach scales to ~50,000 users before needing Redis caching

### Critical Performance Requirements
- [ ] **API Latency**: p95 response time <2 seconds (including limit check overhead <100ms)
- [ ] **Database Query Performance**:
  - Fetch user + tier + usage: <50ms
  - Increment dailyChatsUsed: <20ms
  - Add index on `users.id` (likely already exists)
  - Consider composite index on `(id, lastResetDate)` if queries slow
- [ ] **Migration Performance**: Complete in <5 seconds for 10,000 users
- [ ] **Frontend Render**: Modal appears within 500ms of API error response
- [ ] **Graceful Degradation**: If DB unavailable, fail open (allow chat with logged warning) - response time <3 seconds in degraded mode

### Technical Decisions Requiring Architecture Input
1. **Atomic Increment Strategy**: Recommend `UPDATE users SET dailyChatsUsed = dailyChatsUsed + 1 WHERE id = ?` vs. `SELECT FOR UPDATE` approach (need Drizzle ORM pattern)
2. **Timezone Storage**: Confirm date comparison logic: `new Date().toISOString().split('T')[0]` for UTC date truncation (verify with Drizzle)
3. **Error Handling Pattern**: Confirm Express error handling middleware can return custom JSON format for 429 errors
4. **Migration Tool**: Confirm Drizzle migration workflow (generate, test, apply) aligns with 2-day timeline
5. **Guest Authentication Check**: Verify Replit Auth provides clean guest vs. authenticated distinction (middleware or manual check)

### Files to Modify (Confirmed Locations)
- [ ] `shared/schema.ts` - Add dailyChatsUsed, lastResetDate columns to user schema
- [ ] `server/routes.ts` - Modify /api/chat endpoint (line 794) with limit checks
- [ ] `client/src/pages/chat.tsx` - Add localStorage tracking + modal for limit errors
- [ ] Create new: `server/utils/chatLimits.ts` - Utility functions for limit logic
- [ ] Create new: `client/src/components/LimitReachedModal.tsx` - Upgrade prompt component
- [ ] Create new: `db/migrations/YYYYMMDD_add_chat_limits.sql` - Database migration script

### Deployment Dependencies
- [ ] No external service dependencies (no Redis, no email service, no cron jobs)
- [ ] Database migration must run before code deployment (schema must exist before app reads new columns)
- [ ] Frontend and backend can deploy simultaneously (frontend gracefully handles old API until backend deploys)
- [ ] Rollback plan: Revert code deployment → run rollback migration → restart services

---

## Appendix: Open Questions for Implementation Team

1. **Drizzle ORM Atomic Increment**: Does Drizzle support `UPDATE SET col = col + 1` natively, or do we need raw SQL?
2. **Replit Auth Middleware**: Is there existing middleware that provides `req.user` with guest flag, or do we manually check for null userId?
3. **Subscription Tier Field Name**: Confirm exact field name for tier in subscriptions table (e.g., `tier`, `plan`, `subscriptionType`)
4. **Existing Migration Tooling**: Is there Drizzle migration CLI set up, or do we manually write SQL migrations?
5. **Error Response Convention**: Does existing API use a standard error format, or should we create new convention for 429 errors?
6. **Frontend Modal Library**: Is there existing modal component to extend, or should we build from scratch with Radix/Headless UI?
7. **Logging Infrastructure**: What logging library is used (Winston, Pino, console.log)? Where should limit events be logged?

---

**Document Version**: 1.0
**Last Updated**: 2025-11-13
**Owner**: Product Strategy Lead
**Next Review**: After Phase 1 completion (Day 1, Hour 2)

