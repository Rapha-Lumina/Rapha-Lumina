# Payment & Access Control Implementation Guide
## Rapha Lumina Subscription System

This guide explains how to implement payment processing, access control, and CRM integration for your Rapha Lumina spiritual chatbot.

---

## 📊 **Subscription Tiers Overview**

| Tier | Price | Chat Limit | Features |
|------|-------|------------|----------|
| **Free Access** | $0 | 5 chats total | Basic spiritual guidance |
| **Premium Wisdom** | $29/month | 10 chats/month | Voice interaction + priority support |
| **Transformation Package** | $497 one-time | Unlimited | Full program + 1-on-1 coaching |

---

## 🗄️ **Database Schema** (Already Created!)

I've added these tables to your database:

### 1. **subscriptions** table
Tracks each user's subscription tier and usage:
- `tier`: "free" | "premium" | "transformation"
- `chatLimit`: "5" | "10" | "unlimited"
- `chatsUsed`: Number of chats used in current period
- `status`: "active" | "cancelled" | "expired"
- `stripeCustomerId`: Link to Stripe customer
- `stripeSubscriptionId`: Link to Stripe subscription
- `currentPeriodStart/End`: For monthly renewals

### 2. **chatUsage** table
Detailed logs of each chat session for analytics

---

## 💳 **Part 1: Setting Up Stripe Payments**

### Step 1: Install Stripe Integration

I found a Stripe blueprint for you! To install it, click this button:

```
[Install Stripe Integration]
```

Or I can install it for you by running the integration setup.

### Step 2: Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/
2. Create an account or log in
3. Go to **Developers → API Keys**
4. Copy your **Publishable Key** and **Secret Key**
5. In Replit, the Stripe integration will ask for these keys

### Step 3: Create Stripe Products & Prices

In your Stripe Dashboard:

1. **Products → Add Product**

**Product 1: Premium Wisdom**
- Name: "Premium Wisdom Monthly"
- Price: $29 USD
- Billing period: Monthly recurring
- Copy the **Price ID** (starts with `price_...`)

**Product 2: Transformation Package**
- Name: "Transformation Package"  
- Price: $497 USD
- Billing period: One-time payment
- Copy the **Price ID** (starts with `price_...`)

### Step 4: Configure Webhooks

Stripe needs to notify your app when payments succeed:

1. In Stripe Dashboard: **Developers → Webhooks**
2. Add endpoint: `https://[your-replit-app].replit.app/api/webhooks/stripe`
3. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Webhook Secret** (starts with `whsec_...`)

---

## 🎯 **Part 2: Access Control Logic**

### How It Works:

1. **New user signs up** → Automatically gets "Free" tier (5 chats)
2. **User clicks "Upgrade to Premium"** → Stripe Checkout → Payment → Webhook updates subscription
3. **User tries to chat** → System checks:
   - What tier do they have?
   - Have they exceeded their limit?
   - If yes → Show upgrade message
   - If no → Allow chat and increment `chatsUsed`

### Implementation Example:

```typescript
// In your chat API endpoint:
async function canUserChat(userId: string): Promise<boolean> {
  const subscription = await db.subscriptions.findOne({ userId });
  
  if (!subscription) {
    // Create free subscription for new users
    await db.subscriptions.create({
      userId,
      tier: "free",
      chatLimit: "5",
      chatsUsed: "0"
    });
    return true;
  }
  
  // Check if unlimited
  if (subscription.chatLimit === "unlimited") {
    return true;
  }
  
  // Check if under limit
  const used = parseInt(subscription.chatsUsed);
  const limit = parseInt(subscription.chatLimit);
  
  return used < limit;
}

// Increment chat usage after successful chat
async function incrementChatUsage(userId: string) {
  await db.subscriptions.update(userId, {
    chatsUsed: (parseInt(subscription.chatsUsed) + 1).toString()
  });
}
```

---

## 🔗 **Part 3: Connecting to HubSpot CRM**

### What HubSpot Does:
- Stores customer emails and info
- Tracks customer journey (free → premium → transformation)
- Email marketing automation
- Customer support tickets

### Setup Steps:

1. **Create HubSpot Account**
   - Go to https://www.hubspot.com/
   - Sign up for free account

2. **Get HubSpot API Key**
   - In HubSpot: Settings → Integrations → Private Apps
   - Create new private app
   - Give it permissions: `crm.objects.contacts`
   - Copy the API key

3. **Set Up Integration in Replit**
   I found a HubSpot connector! You'll need to set it up:
   - Click the HubSpot integration setup button
   - Paste your API key
   - Configure what data to sync

### Data Sync Examples:

**When user subscribes to newsletter:**
```typescript
// Send to HubSpot
await hubspot.contacts.create({
  email: userEmail,
  properties: {
    subscription_tier: "free",
    newsletter_subscriber: "true",
    signup_date: new Date()
  }
});
```

**When user upgrades to Premium:**
```typescript
// Update in HubSpot
await hubspot.contacts.update(userEmail, {
  subscription_tier: "premium",
  subscription_price: "$29",
  upgrade_date: new Date()
});
```

---

## 🛠️ **Part 4: Complete Implementation Workflow**

### When User Clicks "Upgrade to Premium":

```typescript
// 1. Create Stripe Checkout Session
const session = await stripe.checkout.sessions.create({
  customer_email: user.email,
  mode: 'subscription', // or 'payment' for one-time
  line_items: [{
    price: 'price_PREMIUM_PRICE_ID', // From Stripe Dashboard
    quantity: 1
  }],
  success_url: `https://yourapp.com/success?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `https://yourapp.com/shop`
});

// 2. Redirect user to Stripe
window.location.href = session.url;
```

### When Payment Succeeds (Webhook):

```typescript
// Stripe webhook endpoint
app.post('/api/webhooks/stripe', async (req, res) => {
  const event = stripe.webhooks.constructEvent(
    req.body,
    req.headers['stripe-signature'],
    WEBHOOK_SECRET
  );

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Update user's subscription in database
    await db.subscriptions.update({
      where: { stripeCustomerId: session.customer },
      data: {
        tier: 'premium',
        chatLimit: '10',
        chatsUsed: '0',
        status: 'active',
        stripeSubscriptionId: session.subscription
      }
    });
    
    // Sync to HubSpot
    await hubspot.contacts.update(session.customer_email, {
      subscription_tier: 'premium'
    });
  }
  
  res.json({ received: true });
});
```

---

## 🚀 **Quick Start Checklist**

- [ ] Install Stripe integration in Replit
- [ ] Create Stripe account and get API keys
- [ ] Create products & prices in Stripe
- [ ] Set up Stripe webhooks
- [ ] Install HubSpot connector in Replit
- [ ] Create HubSpot account and get API key
- [ ] Configure HubSpot data sync
- [ ] Implement access control in chat endpoint
- [ ] Test with Stripe test mode
- [ ] Go live with real payments!

---

## 📝 **Next Steps**

Would you like me to:
1. ✅ Install the Stripe integration for you?
2. ✅ Install the HubSpot integration for you?
3. ✅ Create the API endpoints for subscription management?
4. ✅ Add access control to the chat interface?

Let me know and I'll implement it step by step!

---

## 💡 **Important Notes**

**Stripe Test Mode:**
- Use test credit card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

**Security:**
- Never expose Stripe Secret Key in frontend code
- Always verify webhooks with signature
- Store API keys in Replit Secrets

**Chat Limit Reset:**
- Premium (monthly): Reset `chatsUsed` to 0 on subscription renewal
- Use Stripe webhook: `invoice.payment_succeeded`

---

## 🔐 **Environment Variables Needed**

Add these to your Replit Secrets:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
HUBSPOT_API_KEY=...
```

---

Need help with any specific part? Just ask! 🙏
