# Deployment Guide for Rapha Lumina

This guide will help you successfully deploy Rapha Lumina to Replit's production environment.

## Prerequisites

Before deploying, ensure you have:
1. A Replit account with deployment capabilities
2. An Anthropic API key (get one from https://console.anthropic.com)

## Step 1: Configure Production Secrets

**CRITICAL**: The ANTHROPIC_API_KEY must be added to your Deployment secrets, not just development environment variables.

### How to Add Deployment Secrets:

1. **Navigate to the Deployments tab** in your Replit project
2. **Click on "Configuration"** or "Settings"
3. **Find the "Secrets" section** (this is separate from the development Secrets in Tools)
4. **Add the following secret:**
   - Key: `ANTHROPIC_API_KEY`
   - Value: Your Anthropic API key (starts with `sk-ant-...`)

### Why This Matters:

Development environment variables are NOT automatically transferred to production deployments. The deployment runs in a separate environment and requires its own secret configuration.

## Step 2: Verify Build Configuration

The project is already configured with the correct build settings:

```json
{
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "start": "NODE_ENV=production node dist/index.js"
}
```

This will:
- Build the React frontend to `dist/public/`
- Bundle the Express backend to `dist/index.js`
- Start the production server on the correct port

## Step 3: Environment Variables

The application automatically handles the following:

### PORT
- **Automatically provided** by Replit's deployment infrastructure
- Defaults to 5000 if not specified
- The server listens on: `process.env.PORT || 5000`

### NODE_ENV
- Automatically set to `production` during deployment
- Used to serve static files instead of running Vite dev server

### ANTHROPIC_API_KEY
- **YOU MUST ADD THIS** to deployment secrets (see Step 1)
- Required for AI chat functionality
- Without this, the chat will return a 503 error

## Step 4: Deploy

1. **Click the "Deploy" button** in Replit
2. **Wait for the build** to complete (should take 30-60 seconds)
3. **Monitor the initialization** - the server should start within a few seconds
4. **Check the logs** for successful startup message:
   ```
   Server successfully started on port 5000
   Environment: production
   ANTHROPIC_API_KEY configured: Yes
   ```

## Step 5: Verify Deployment

After deployment, test the following:

1. **Homepage loads** - You should see the Rapha Lumina interface
2. **Theme toggle works** - Switch between dark and light mode
3. **Chat functionality** - Send a message like "What is wisdom?"
4. **AI responses** - You should receive philosophical wisdom from Rapha Lumina

## Troubleshooting

### Issue: "Deployment failed to initialize"

**Causes:**
- ANTHROPIC_API_KEY not configured in deployment secrets
- Port binding issues (should be fixed with recent changes)
- Build errors

**Solutions:**
1. Verify ANTHROPIC_API_KEY is in **Deployment secrets** (not just dev secrets)
2. Check deployment logs for specific error messages
3. Ensure the build completed successfully

### Issue: "Chat returns 503 error"

**Cause:** ANTHROPIC_API_KEY not configured

**Solution:** 
1. Go to Deployments > Configuration > Secrets
2. Add ANTHROPIC_API_KEY with your Anthropic API key
3. Redeploy the application

### Issue: "Server won't start on port 5000"

**This should be fixed** with the recent changes:
- Removed `reusePort: true` option (incompatible with Cloud Run)
- Changed to standard `server.listen(port, host, callback)` signature
- Added proper error handling for port conflicts

### Issue: "Frontend shows but chat doesn't work"

**Possible causes:**
1. ANTHROPIC_API_KEY missing or invalid
2. API routes not properly built
3. CORS or network issues

**Check:**
1. Open browser developer console for errors
2. Check deployment logs for API errors
3. Verify the secret is spelled correctly: `ANTHROPIC_API_KEY`

## Production Checklist

Before going live, verify:

- [ ] ANTHROPIC_API_KEY added to deployment secrets
- [ ] Build completes without errors
- [ ] Server starts and shows "ANTHROPIC_API_KEY configured: Yes"
- [ ] Homepage loads with logo and welcome message
- [ ] Can send a test message
- [ ] Receive AI wisdom response
- [ ] Dark/light mode toggle works
- [ ] No console errors in browser

## Cost Considerations

### Anthropic API Costs
- Model: Claude Sonnet 4 (claude-sonnet-4-20250514)
- Each message costs based on input/output tokens
- Approximate cost: $0.003 - $0.015 per message exchange
- Monitor usage in your Anthropic dashboard

### Replit Deployment Costs
- Check current Replit pricing for deployments
- Consider usage limits and scaling needs

## Security Notes

1. **Never commit API keys** to the repository
2. **Use Replit Secrets** for all sensitive credentials
3. **Monitor API usage** to prevent abuse
4. **Rate limiting** may be needed for public deployments

## Monitoring

After deployment, monitor:
- **Deployment logs** for errors or warnings
- **Anthropic API usage** in your Anthropic console
- **Response times** for chat interactions
- **Error rates** from users

## Updates and Redeployment

To deploy changes:
1. Make your code changes in the Repl
2. Test in development mode
3. Click "Deploy" again
4. Secrets are preserved between deployments

## Support

If you encounter issues:
1. Check this deployment guide
2. Review the main README.md for application details
3. Check Replit deployment documentation
4. Verify Anthropic API status

## Recent Fixes Applied

The following deployment issues have been resolved:

✅ **Removed reusePort option** - Now compatible with Cloud Run  
✅ **Added startup error handling** - Better error logging and graceful failures  
✅ **Improved PORT handling** - Correctly uses process.env.PORT with fallback  
✅ **Added API key validation** - Returns proper JSON errors when key is missing  
✅ **Enhanced logging** - Shows environment and configuration status on startup

---

**Ready to Deploy?** Follow steps 1-5 above, and your spiritual wisdom chatbot will be live! 🌟
