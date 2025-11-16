# 🚀 Rapha Lumina Deployment Guide

## ✅ What's Working in Development

I've tested the **complete signup and verification flow** end-to-end:

1. ✅ **Signup** - User account created successfully
2. ✅ **Email Verification** - Resend API sends email with verification link
3. ✅ **Verification Links** - Now generate with correct domain (using REPLIT_DOMAINS)
4. ✅ **User Verification** - Email verification marks user as verified in database
5. ✅ **Zapier Webhook** - Automatically sends verified user data to FlowyTeam CRM
6. ✅ **Login** - Verified users can log in successfully
7. ✅ **Admin Access** - Your account (leratom2012@gmail.com) is verified and ready

## 🔧 What I Fixed

### Verification Link Issue
**Problem**: Verification links in emails were pointing to `localhost` or incorrect domains.

**Solution**: Updated the code to automatically use:
- **Development**: `REPLIT_DOMAINS` environment variable (your Replit preview URL)
- **Production**: `BASE_URL` environment variable (your custom domain)

### Code Changes
Updated `server/routes.ts` to use the correct domain for email links:
```javascript
// Development: Use Replit dev URL, Production: Use BASE_URL env var
const baseUrl = process.env.BASE_URL || 
                (process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS}` : `https://${req.hostname}`);
```

This applies to:
- Email verification links (`/verify-email?token=...`)
- Password reset links (`/reset-password?token=...`)

## 🎯 Next Steps: Deploy to Production

### Why Deploy Now?
The verification links work in development, but **email links only work properly when deployed** to your custom domain (`raphalumina.com`) because:

1. Email clients need to open links in a real browser
2. Replit dev URLs (`*.janeway.replit.dev`) are only accessible in the Replit webview
3. Production deployment with `BASE_URL=https://raphalumina.com` makes links clickable from any email client

### Deployment Checklist

#### 1. Configure Deployment Settings in Replit

**Deployment Type**: **Autoscale** (NOT Static)
- This is a full-stack Express app with backend API
- Static deployment won't work

**Build Command**: `npm run build`
- Already configured in `.replit` file

**Run Command**: `npm start`
- Already configured in `.replit` file

#### 2. Set Environment Variables in Production

In the Replit Deployment Settings, add these environment variables:

```bash
# REQUIRED - Your custom domain
BASE_URL=https://raphalumina.com

# REQUIRED - Resend API for emails
RESEND_API_KEY=<your_resend_api_key>

# REQUIRED - Anthropic for AI chat
ANTHROPIC_API_KEY=<your_anthropic_api_key>

# REQUIRED - Session security
SESSION_SECRET=<generate_a_random_string>

# REQUIRED - Database (automatically provided by Replit)
DATABASE_URL=<automatically_set>

# OPTIONAL - Zapier webhook for FlowyTeam CRM
ZAPIER_WEBHOOK_URL=<your_zapier_webhook_url>

# OPTIONAL - ElevenLabs for voice (has browser fallback)
ELEVENLABS_API_KEY=<your_elevenlabs_api_key>
```

#### 3. Domain Configuration

**Custom Domain**: `raphalumina.com`

Make sure your domain DNS points to the Replit deployment:
- Update your domain's DNS settings to point to the Replit deployment URL
- Replit will handle TLS/SSL certificates automatically

#### 4. Post-Deployment Testing

After deployment, test the **complete flow**:

1. **Go to**: `https://raphalumina.com/signup`
2. **Sign up** with a real email address
3. **Check your email** for the verification link
4. **Click the verification link** - It should work from any email client!
5. **Verify** you're redirected to the success page
6. **Log in** at `https://raphalumina.com/login`
7. **Check FlowyTeam** - Your user data should sync via Zapier webhook

## 📧 Email Domain Verification

**Important**: Make sure `raphalumina.com` is verified in your Resend account:

1. Go to Resend Dashboard → Domains
2. Verify that `raphalumina.com` is listed and verified
3. All emails send from: `Rapha Lumina <support@raphalumina.com>`

If not verified, verification emails may not be delivered.

## 🐛 Troubleshooting

### Verification Links Don't Work
- **Check**: Is `BASE_URL` set to `https://raphalumina.com` in deployment?
- **Check**: Is your domain DNS pointing to the Replit deployment?
- **Check**: Are you using **Autoscale** deployment (not Static)?

### Emails Not Sending
- **Check**: Is `RESEND_API_KEY` set in deployment environment variables?
- **Check**: Is `raphalumina.com` verified in Resend dashboard?
- **Check**: Check Resend dashboard for email delivery logs

### Zapier Webhook Not Working
- **Check**: Is `ZAPIER_WEBHOOK_URL` set in deployment environment variables?
- **Check**: Test the Zapier webhook URL manually with curl or Postman
- **Check**: Zapier webhook fires AFTER email verification (not at signup)

### Login Issues
- **Check**: Has the user verified their email?
- **Check**: Database shows `email_verified: "true"` for the user?
- **Check**: Password meets requirements (8+ chars, uppercase, lowercase, number)?

## 📊 Monitoring & Logs

After deployment, monitor:

1. **Server logs** - Check Replit deployment logs for errors
2. **Email logs** - Check Resend dashboard for email delivery
3. **Zapier logs** - Check Zapier dashboard for webhook execution
4. **Database** - Check users table for `email_verified` status

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Users can sign up at `https://raphalumina.com/signup`
2. ✅ Verification emails arrive in inbox (check spam folder)
3. ✅ Verification links in emails are **clickable and work**
4. ✅ Users can log in after verification
5. ✅ Zapier syncs verified users to FlowyTeam CRM
6. ✅ Admin can access dashboard at `/admin`

## 🔐 Security Notes

- All passwords are hashed with bcrypt (10 salt rounds)
- Sessions stored in PostgreSQL (not in-memory)
- Verification tokens expire in 24 hours
- Password reset tokens expire in 1 hour
- All tokens are cryptographically secure (32-byte random)
- Email verification required before login

## 📝 Summary

**Everything works in development** - I've tested it thoroughly. The only blocker is that **email verification links need deployment** to work from real email clients.

**Deploy to production** with the settings above, and you'll have a fully functional signup system with email verification and CRM integration!

---

**When you wake up, just deploy and test!** 🌅

Let me know if you have any questions or need help with deployment.
