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

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account
   - Select the **wtfiction** project

2. **Navigate to Environment Variables**
   - Click on your project
   - Go to **Settings** (in the top navigation)
   - Click **Environment Variables** (in the left sidebar)

3. **Add Each Variable**
   Click **"Add New"** for each variable below:

   **Variable 1:**
   - **Key**: `SMTP_HOST`
   - **Value**: `smtp.office365.com`
   - **Environment**: Select all three (Production, Preview, Development)
   - Click **"Save"**

   **Variable 2:**
   - **Key**: `SMTP_USER`
   - **Value**: `subscribe@wtfiction.com`
   - **Environment**: Select all three
   - Click **"Save"**

   **Variable 3:**
   - **Key**: `SMTP_PASSWORD`
   - **Value**: `[Your Microsoft 365 App Password]` (see below for how to create)
   - **Environment**: Select all three
   - Click **"Save"**

   **Variable 4 (Optional):**
   - **Key**: `SUBSCRIBE_EMAIL`
   - **Value**: `subscribe@wtfiction.com`
   - **Environment**: Select all three
   - Click **"Save"**

4. **Redeploy**
   - After adding all variables, go to **Deployments**
   - Find the latest deployment
   - Click **"..."** (three dots) → **"Redeploy"**
   - Or push a new commit to trigger a rebuild

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

### Creating Microsoft 365 App Password

**Important:** `SMTP_PASSWORD` must be an **App Password** (not your regular password):

1. Go to [Microsoft 365 Security](https://account.microsoft.com/security)
2. Sign in with your Microsoft 365 account
3. Enable **Multi-Factor Authentication** (if not already enabled)
4. Go to **Security info** → **App passwords**
5. Click **"Create a new app password"**
6. Name it: "WTFiction Email Service" or "Vercel SMTP"
7. Copy the generated password (16 characters, spaces don't matter)
8. Use this password as the `SMTP_PASSWORD` value

**Note:** You won't be able to see this password again, so save it securely.

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
