# Systeme.io Integration Guide for Rapha Lumina

## Overview
This guide contains all URLs and setup instructions for integrating Rapha Lumina with systeme.io sales funnels.

---

## 1. WEBHOOK URL (For Systeme.io Dashboard)

### Live Production Webhook
```
https://raphalumina.replit.app/api/webhooks/systemeio
```

### Development/Testing Webhook
```
https://963bcd13-18f9-4103-8f8e-cfbb60fa0a95-00-ok9zs4smz5iv.janeway.replit.dev/api/webhooks/systemeio
```

---

## 2. BUTTON URLS TO CONFIGURE

### Newsletter "Join Now" Button (Landing Page)
**Current Behavior**: After successful newsletter signup, redirects to systeme.io funnel after 1.5 seconds

**File**: `client/src/pages/landing.tsx` (Line 100)

**Current URL** (TO UPDATE):
```javascript
window.location.href = "https://yourname.systeme.io/your-funnel-name";
```

**Replace with your actual funnel URL**, for example:
```javascript
window.location.href = "https://raphalumina.systeme.io/welcome-sequence";
```

---

### Shop Page - "Start Free" Button
**Current Behavior**: Redirects to `/chat` (internal - no changes needed)

**URL**: `/chat` (internal route)

---

### Shop Page - "Upgrade to Premium" Button
**File**: `client/src/pages/shop.tsx` (Line 48)

**Current URL** (TO UPDATE):
```javascript
funnelUrl: "https://yourname.systeme.io/premium-funnel"
```

**Replace with your actual Premium funnel URL**, for example:
```javascript
funnelUrl: "https://raphalumina.systeme.io/premium-monthly"
```

---

### Shop Page - "Begin Transformation" Button
**File**: `client/src/pages/shop.tsx` (Line 70)

**Current URL** (TO UPDATE):
```javascript
funnelUrl: "https://yourname.systeme.io/transformation-funnel"
```

**Replace with your actual Transformation funnel URL**, for example:
```javascript
funnelUrl: "https://raphalumina.systeme.io/transformation-package"
```

---

### Sign Up Button
**Current Behavior**: Opens Replit Auth login modal (handles both sign up and login)

**No URL needed** - This uses Replit's built-in authentication system

**Locations**:
- Navigation bar: `client/src/components/Navigation.tsx`
- Both "Log in" and "Sign up" buttons trigger the same authentication flow

---

## 3. WEBHOOK SETUP IN SYSTEME.IO

### Option 1: Via Workflows (Recommended)

1. Log into your systeme.io dashboard
2. Go to **Automations** → **Workflows** → **Create New Workflow**
3. **Set Trigger**: Choose "Sale Created" or "Order Created"
4. **Add Action**: Select "Call Webhook"
5. **Enter Webhook URL**:
   ```
   https://raphalumina.replit.app/api/webhooks/systemeio
   ```
6. **Method**: POST
7. **Headers** (Optional - for security):
   - Add header: `x-webhook-secret`
   - Value: [Your secret key from environment variable `SYSTEME_IO_WEBHOOK_SECRET`]
8. **Test**: Create a test order to verify the webhook fires

### Option 2: Direct Webhook Configuration

If systeme.io supports direct webhook configuration:

1. Go to **Settings** → **Webhooks** → **Add New Webhook**
2. **URL**: `https://raphalumina.replit.app/api/webhooks/systemeio`
3. **Events**: Select "sale.created" and "order.created"
4. **Secret** (optional): Your webhook secret
5. **Save** and test

---

## 4. PRODUCT ID MAPPING (IMPORTANT!)

### What You Need to Do

After creating your Premium and Transformation products in systeme.io:

1. **Find Your Product IDs**:
   - In systeme.io, go to your Products
   - Copy the Product ID for Premium ($29)
   - Copy the Product ID for Transformation ($497)

2. **Update the Product Mapping**:
   - Open `server/routes.ts`
   - Find line 959 (the `PRODUCT_TIER_MAP`)
   - Replace the example IDs with your actual systeme.io product IDs:

```typescript
const PRODUCT_TIER_MAP: Record<string, "premium" | "transformation"> = {
  "your_premium_product_id_here": "premium",        // Replace this
  "your_transformation_product_id_here": "transformation",  // Replace this
};
```

**Example**:
```typescript
const PRODUCT_TIER_MAP: Record<string, "premium" | "transformation"> = {
  "prod_abc123xyz": "premium",
  "prod_def456uvw": "transformation",
};
```

### Fallback Logic (Already Configured)

If product IDs aren't set, the system falls back to price-based detection:
- Amount >= $400 → Transformation tier
- Amount >= $25 → Premium tier
- Amount < $25 → Free tier

**⚠️ For production security, always configure product IDs!**

---

## 5. OPTIONAL: WEBHOOK SECRET (Security)

### Why Use a Webhook Secret?
Prevents unauthorized requests from granting premium access to fake users.

### Setup Steps:

1. **In Replit**:
   - Add a secret called `SYSTEME_IO_WEBHOOK_SECRET`
   - Set it to a long random string (e.g., `wh_secret_abc123xyz789`)

2. **In Systeme.io**:
   - When setting up the webhook, add a custom header:
   - Header name: `x-webhook-secret`
   - Header value: Same value as your Replit secret

3. **How It Works**:
   - If `SYSTEME_IO_WEBHOOK_SECRET` is set, the webhook will reject requests without the matching secret
   - If not set, webhook accepts all requests (less secure but easier for testing)

---

## 6. TESTING THE INTEGRATION

### Test Workflow:

1. **Test Newsletter Signup**:
   - Go to https://raphalumina.replit.app
   - Fill out newsletter popup
   - Click "Join Now"
   - Should see success message and redirect to your systeme.io funnel

2. **Test Premium Purchase**:
   - Go to https://raphalumina.replit.app/shop
   - Click "Upgrade to Premium"
   - Should redirect to your systeme.io premium funnel
   - Complete test purchase in systeme.io
   - Check server logs for webhook receipt
   - Verify user gets premium tier in database

3. **Test Transformation Purchase**:
   - Go to /shop
   - Click "Begin Transformation"
   - Should redirect to your systeme.io transformation funnel
   - Complete test purchase
   - Verify user gets transformation tier and Academy access

4. **Verify Academy Access**:
   - After purchase, log in with the same email
   - Go to /courses
   - Should see "Go to Rapha Lumina Academy" button
   - Click it to access full Academy dashboard

---

## 7. WHAT HAPPENS AUTOMATICALLY

When a customer purchases through systeme.io:

1. **Sale Event Fired** → systeme.io calls your webhook
2. **User Created/Updated** → New user account created or existing updated
3. **Tier Assigned** → Premium or Transformation tier based on product/price
4. **Subscription Activated** → Chat limits and features enabled
5. **Sync to Systeme.io** → Tier tags updated in your systeme.io contact list
6. **Academy Access Granted** → Customer can immediately access Academy dashboard

---

## 8. MONITORING & DEBUGGING

### Check Webhook Logs:
All webhook events are logged with `[Systeme.io Webhook]` prefix. Look for:
- Event received
- Tier assignment
- User creation/update
- Errors (if any)

### Common Issues:

**Webhook not firing?**
- Verify URL is correct in systeme.io
- Check if systeme.io shows webhook as "active"
- Test with a manual trigger in systeme.io

**Wrong tier assigned?**
- Check product ID mapping is correct
- Verify amounts match your pricing

**User not getting access?**
- Check email matches between purchase and login
- Verify subscription record was created
- Check user's subscription tier in database

---

## 9. SUMMARY OF ALL URLS

| Button/Feature | Current URL (TO UPDATE) | Purpose |
|----------------|-------------------------|---------|
| Newsletter Join | `https://yourname.systeme.io/your-funnel-name` | Welcome sequence funnel |
| Start Free | `/chat` (internal) | Free chat access |
| Upgrade to Premium | `https://yourname.systeme.io/premium-funnel` | Premium purchase funnel |
| Begin Transformation | `https://yourname.systeme.io/transformation-funnel` | Transformation purchase funnel |
| Sign Up/Login | Replit Auth (no URL) | Built-in authentication |
| Webhook | `https://raphalumina.replit.app/api/webhooks/systemeio` | Receive purchase events |

---

## 10. NEXT STEPS

1. ✅ Create your sales funnels in systeme.io
2. ✅ Get your funnel URLs
3. ✅ Update the URLs in the code files mentioned above
4. ✅ Get your product IDs from systeme.io
5. ✅ Update the PRODUCT_TIER_MAP
6. ✅ Set up webhook in systeme.io dashboard
7. ✅ (Optional) Configure webhook secret for security
8. ✅ Test with a real purchase
9. ✅ Monitor logs to verify everything works
10. ✅ Go live!

---

**Need Help?**
- Check server logs for webhook debugging
- All systeme.io integration code is in `server/routes.ts` (line 938-1037)
- Frontend redirects are in `client/src/pages/shop.tsx` and `client/src/pages/landing.tsx`
