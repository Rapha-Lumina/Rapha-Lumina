# Project Brief: Chat Limit Enforcement System

## Working Name
Chat Usage Limits & Subscription Enforcement

## One-Sentence Value Prop
Implement tiered chat access to convert free users into paid subscribers while providing value at each level.

## Primary Audience
- Guests (no account): Testing the service
- Free tier users: Regular users wanting daily guidance
- Premium tier users: Power users needing more access
- Transformation tier: Committed users wanting unlimited access

## Core Problem to Solve
Currently all users have unlimited chat access regardless of subscription tier, preventing monetization and proper resource management.

## Key Outcomes (Success Metrics)
- Chat limits properly enforced per tier
- Daily reset functionality working correctly
- Clear upgrade prompts at each tier
- Zero impact on legitimate user experience
- Database accurately tracking usage

## MVP Scope (Must-Have Features)
1. **Guest Users (No Account)**
   - Limit: 2 chats total
   - Storage: Browser localStorage
   - Action: After 2 chats, show signup prompt with benefits
   - Message: "You've used your 2 free chats! Sign up for 5 daily chats."

2. **Free Tier Users**
   - Limit: 5 chats per day
   - Reset: Daily at midnight (user's timezone or UTC)
   - Action: After 5 chats, show upgrade prompt
   - Message: "Daily limit reached. Upgrade to Premium for 10 daily chats."

3. **Premium Tier Users**
   - Limit: 10 chats per day
   - Reset: Daily at midnight
   - Action: After 10 chats, show upgrade prompt
   - Message: "Daily limit reached. Upgrade to Transformation for unlimited chats."

4. **Transformation Tier Users**
   - Limit: Unlimited
   - No prompts or restrictions

5. **Database Schema Updates**
   - Add: dailyChatsUsed field
   - Add: lastResetDate field
   - Maintain backward compatibility

6. **API Endpoint Changes**
   - Check user authentication status
   - Retrieve subscription tier
   - Check daily usage against limit
   - Auto-reset if new day
   - Block if limit exceeded
   - Increment usage on successful chat
   - Return appropriate error messages

## Nice-to-Have (Out of Scope for MVP)
- Usage analytics dashboard
- Email notifications when limit reached
- Monthly usage reports
- Chat history export before limit
- Temporary limit increases for special occasions
- Admin override capability

## Constraints
- Must not break existing chat functionality
- Must work for both authenticated and guest users
- Database migration must be non-destructive
- Response time must stay under 2 seconds
- Clear error messages, not technical jargon
- Mobile-friendly limit notifications

## Technical Preferences
- Stack: Node.js/Express backend, React frontend
- Database: PostgreSQL with Drizzle ORM
- Current auth: Replit Auth system
- Must use existing subscription table structure
- Timezone handling: UTC for consistency

## Existing Assets
- Database schema: shared/schema.ts (subscriptions, chatUsage tables)
- API routes: server/routes.ts (/api/chat endpoint at line 794)
- Chat interface: client/src/pages/chat.tsx
- Subscription data already tracks tier and status

## Launch Deadline + Milestones
- Planning: Today (1-2 hours with agents)
- Implementation: Tomorrow (4-6 hours)
- Testing: Same day as implementation
- Deployment: After successful local testing
- Total: 2 days max

## Critical Success Factors
- Accurate daily reset logic (no false lockouts)
- Clear upgrade paths at each tier
- Graceful degradation if DB unavailable
- No breaking changes to existing users
