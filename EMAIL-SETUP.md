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

### Step 2: Additional DNS Records

The following records have been added via AWS CLI:

**MX Record:**
- **Name**: `@` (wtfiction.com)
- **Type**: `MX`
- **Value**: `0 wtfiction-com.mail.protection.outlook.com`
- **TTL**: `3600`

**CNAME Record (Autodiscover):**
- **Name**: `autodiscover`
- **Type**: `CNAME`
- **Value**: `autodiscover.outlook.com`
- **TTL**: `3600`

**SPF TXT Record:**
- **Name**: `@` (wtfiction.com)
- **Type**: `TXT`
- **Value**: `v=spf1 include:spf.protection.outlook.com -all`
- **TTL**: `3600`

**Status**: ✅ All records added successfully

### Additional Records (if needed)

Microsoft 365 may require additional DNS records:
- **DKIM records** - for email authentication (TXT records)
- **DMARC record** - for email authentication (TXT record)

These will be provided by Microsoft 365 during setup if needed.

## Email Configuration

**Mailbox**: `subscribe@wtfiction.com`

This mailbox will receive email signup submissions from the website.

**Important:** For SMTP authentication, you need a **regular user account** (not a shared mailbox). App passwords can only be created for user accounts that have a license assigned.

## Email Service Integration

Once DNS is configured and email is set up, we'll need to:

1. **Create API route** (`/api/subscribe`) to handle email submissions
   - Option A: Send email directly to `subscribe@wtfiction.com` using SMTP
   - Option B: Use Microsoft 365 API to send emails
   - Option C: Use a service like SendGrid/AWS SES to forward to the mailbox

2. **Update EmailSignup component** to call the API

3. **Add environment variables** for:
   - SMTP credentials (if using SMTP)
   - API keys (if using email service API)
   - Email recipient: `subscribe@wtfiction.com`

## Environment Variables (Vercel)

**Recommended Solution: Use Resend (Works with Shared Mailboxes)**

Since you're using a shared mailbox, we'll use **Resend** - a modern email API service that works perfectly with shared mailboxes and doesn't require SMTP authentication.

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account
   - Select the **wtfiction** project

2. **Navigate to Environment Variables**
   - Click on your project
   - Go to **Settings** (in the top navigation)
   - Click **Environment Variables** (in the left sidebar)

3. **Add Variables**
   Click **"Add New"** for each variable below:

   **Variable 1 (Required):**
   - **Key**: `RESEND_API_KEY`
   - **Value**: `[Your Resend API Key]` (see below for how to get)
   - **Environment**: Select all three (Production, Preview, Development)
   - Click **"Save"**

   **Variable 2 (Required):**
   - **Key**: `SUBSCRIBE_EMAIL`
   - **Value**: `subscribe@wtfiction.com`
   - **Environment**: Select all three
   - Click **"Save"**

   **Variable 3 (Optional):**
   - **Key**: `FROM_EMAIL`
   - **Value**: `noreply@wtfiction.com` (or any verified domain email)
   - **Environment**: Select all three
   - Click **"Save"**

4. **Redeploy**
   - After adding all variables, go to **Deployments**
   - Find the latest deployment
   - Click **"..."** (three dots) → **"Redeploy"**
   - Or push a new commit to trigger a rebuild

### Getting Resend API Key

1. **Sign up for Resend** (if you haven't already)
   - Go to [resend.com](https://resend.com)
   - Sign up for a free account (100 emails/day free)

2. **Verify your domain**
   - Go to **Domains** in Resend dashboard
   - Add `wtfiction.com`
   - Add the DNS records Resend provides (DKIM, SPF, etc.)

3. **Get your API Key**
   - Go to **API Keys** in Resend dashboard
   - Click **"Create API Key"**
   - Name it: "WTFiction Production"
   - Copy the key (starts with `re_`)
   - Use this as `RESEND_API_KEY` in Vercel

### Alternative: SMTP (Only if you have a regular user account)

If you later get a regular user account, you can use SMTP instead:

   **SMTP Variables (Optional - only if not using Resend):**
   - `SMTP_HOST` = `smtp.office365.com`
   - `SMTP_USER` = `[regular-user-account@wtfiction.com]`
   - `SMTP_PASSWORD` = `[App Password]`
   - `SUBSCRIBE_EMAIL` = `subscribe@wtfiction.com`

### Method 2: Via Vercel CLI

If you have Vercel CLI authenticated:

```bash
# Login first (if not already)
vercel login

# Link to project (if not already linked)
cd /path/to/wtfiction
vercel link

# Add environment variables
vercel env add SMTP_HOST production
# When prompted, enter: smtp.office365.com

vercel env add SMTP_USER production
# When prompted, enter: subscribe@wtfiction.com

vercel env add SMTP_PASSWORD production
# When prompted, enter: [Your App Password]

vercel env add SUBSCRIBE_EMAIL production
# When prompted, enter: subscribe@wtfiction.com

# Also add to preview and development environments
vercel env add SMTP_HOST preview
vercel env add SMTP_HOST development
# (Repeat for all variables)
```

### Why Resend Instead of SMTP?

**Problem with Shared Mailboxes:**
- Microsoft 365 shared mailboxes cannot authenticate via SMTP
- App passwords only work with regular user accounts (not shared mailboxes)
- SMTP requires a licensed user account

**Solution: Resend**
- ✅ Works with shared mailboxes (sends TO them, doesn't authenticate AS them)
- ✅ No need for app passwords or user accounts
- ✅ Simple API-based approach
- ✅ Free tier: 100 emails/day
- ✅ Better deliverability and tracking
- ✅ Easy domain verification

### SMTP Alternative (If you get a regular user account later)

If you later create a regular user account, you can switch to SMTP:

1. **Create App Password** (for regular user account only):
   - Go to [Microsoft 365 Admin Center](https://admin.microsoft.com)
   - Users → Active users → Select regular user account
   - Mail tab → App passwords → Create app password
   - Copy the password

2. **Add SMTP variables to Vercel:**
   - `SMTP_HOST` = `smtp.office365.com`
   - `SMTP_USER` = `[regular-user-account@wtfiction.com]`
   - `SMTP_PASSWORD` = `[App Password]`
   - `SUBSCRIBE_EMAIL` = `subscribe@wtfiction.com`

3. **Remove `RESEND_API_KEY`** from Vercel (code will automatically use SMTP if Resend key is missing)

## Next Steps

After DNS records are added:
1. ✅ Wait for DNS propagation (5-60 minutes) - **Complete**
2. ✅ Verify domain in Microsoft 365 - **Complete**
3. ✅ Create mailbox: `subscribe@wtfiction.com` in Microsoft 365 - **Complete**
4. ✅ Set up email service integration (SMTP) - **Complete**
5. ✅ Configure API route for email submissions - **Complete**
6. ✅ Update EmailSignup component to use the API - **Complete**
7. ⏳ Add environment variables to Vercel
8. ⏳ Create App Password in Microsoft 365
9. ⏳ Test email subscription flow

## Current Status

- ✅ Domain verification TXT record added (`MS=ms75334031`)
- ✅ MX record added (`0 wtfiction-com.mail.protection.outlook.com`)
- ✅ CNAME record added (`autodiscover` -> `autodiscover.outlook.com`)
- ✅ SPF TXT record added (`v=spf1 include:spf.protection.outlook.com -all`)
- ✅ DNS propagation complete
- ✅ Mailbox created: `subscribe@wtfiction.com`
- ✅ Email API route created (`/api/subscribe`)
- ✅ EmailSignup component updated
- ✅ Subscribe page updated
- ⏳ Environment variables need to be added to Vercel
- ⏳ App Password needs to be created in Microsoft 365
