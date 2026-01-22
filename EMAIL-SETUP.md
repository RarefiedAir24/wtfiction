# Email Setup - Microsoft 365 / Exchange

This document outlines the email setup for wtfiction.com using Microsoft 365/Exchange.

## DNS Configuration (Route 53)

### Step 1: Add TXT Record for Domain Verification

1. Go to AWS Route 53 Console
2. Select the hosted zone for `wtfiction.com`
3. Click **"Create Record"**
4. Configure:
   - **Record name**: `@` (or leave blank for root domain)
   - **Record type**: `TXT`
   - **Value**: `MS=ms75334031`
   - **TTL**: `3600` (or default)
5. Click **"Create Records"**

### Step 2: Additional DNS Records (if needed)

Microsoft 365 may require additional DNS records:
- **MX records** - for email routing
- **CNAME records** - for autodiscover
- **SPF record** - for email authentication (TXT record)
- **DKIM records** - for email authentication (TXT records)
- **DMARC record** - for email authentication (TXT record)

These will be provided by Microsoft 365 during setup.

## Email Service Integration

Once DNS is configured and email is set up, we'll need to:

1. **Choose email service provider:**
   - Microsoft 365 API
   - SendGrid
   - AWS SES
   - Resend
   - Or another service

2. **Create API route** (`/api/subscribe`) to handle email submissions

3. **Update EmailSignup component** to call the API

4. **Add environment variables** for API keys/secrets

## Next Steps

After DNS records are added:
1. Wait for DNS propagation (5-60 minutes)
2. Verify domain in Microsoft 365
3. Set up email service integration
4. Configure API route for email submissions

## Current Status

- ✅ DNS TXT record documented
- ⏳ Waiting for DNS configuration
- ⏳ Email service integration pending
