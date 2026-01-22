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

**Two Options Available:**

1. **SMTP with Admin Account** (What you're using)
   - Use your admin account to create an app password
   - Works with shared mailboxes (sends TO them)
   - No third-party service needed

2. **Resend API** (Alternative)
   - Modern email API service
   - Also works with shared mailboxes
   - Free tier: 100 emails/day

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account
   - Select the **wtfiction** project

2. **Navigate to Environment Variables**
   - Click on your project
   - Go to **Settings** (in the top navigation)
   - Click **Environment Variables** (in the left sidebar)

3. **Add Variables (SMTP Method - Using Admin Account)**
   Click **"Add New"** for each variable below:

   **Variable 1:**
   - **Key**: `SMTP_HOST`
   - **Value**: `smtp.office365.com`
   - **Environment**: Select all three (Production, Preview, Development)
   - Click **"Save"**

   **Variable 2:**
   - **Key**: `SMTP_USER`
   - **Value**: `[Your admin account email]` (e.g., `frank.s@montebay.io` or similar)
   - **Environment**: Select all three
   - Click **"Save"**

   **Variable 3:**
   - **Key**: `SMTP_PASSWORD`
   - **Value**: `[App Password from your admin account]` (see below for how to create)
   - **Environment**: Select all three
   - Click **"Save"**

   **Variable 4:**
   - **Key**: `SUBSCRIBE_EMAIL`
   - **Value**: `subscribe@wtfiction.com`
   - **Environment**: Select all three
   - Click **"Save"**

4. **Redeploy**
   - After adding all variables, go to **Deployments**
   - Find the latest deployment
   - Click **"..."** (three dots) → **"Redeploy"**
   - Or push a new commit to trigger a rebuild

**Note:** The code will automatically use SMTP if `RESEND_API_KEY` is not set. Emails will be sent FROM your admin account TO the shared mailbox (`subscribe@wtfiction.com`).

### Creating App Password for Admin Account

**Your Account:** `frank.s@montebay.io` (SMTP authorization enabled ✅)

**Steps to create an app password:**

1. **Go to Security Settings**
   - Visit [My Sign-Ins](https://mysignins.microsoft.com)
   - Sign in with `frank.s@montebay.io`
   - Go to **Security info** page

2. **Find App Passwords**
   - **Try direct link first:** [App Passwords](https://account.microsoft.com/security/app-passwords)
   - Make sure you're signed in with `frank.s@montebay.io`
   - If the link doesn't work or shows an error, try Option 3 below

3. **Alternative: Via Admin Center**
   - Go to [admin.microsoft.com](https://admin.microsoft.com)
   - **Users** → **Active users**
   - Find and click on `frank.s@montebay.io`
   - Go to the **Mail** tab
   - Scroll down to look for **"App passwords"** or **"Manage app passwords"** section
   - If not visible, your organization may have app passwords disabled

4. **If App Passwords Not Available:**
   - Some Microsoft 365 organizations disable app passwords for security
   - If the direct link doesn't work, app passwords may be disabled organization-wide
   - **Options to enable app passwords:**
     - Check Microsoft 365 Admin Center → Security → Authentication methods
     - Look for "App passwords" or "Legacy authentication" settings
     - You may need admin permissions to enable this
   - **Alternative:** If app passwords can't be enabled, we can try using your regular password (only works if MFA is temporarily disabled, not recommended)

4. **Create App Password**
   - Click **"Create app password"** or **"Generate app password"**
   - Name it: "WTFiction Email Service" or "Vercel SMTP"
   - Copy the generated password (16 characters, spaces don't matter)
   - **Important:** You won't see this password again, so save it securely!

5. **Add to Vercel**
   - `SMTP_USER` = `frank.s@montebay.io`
   - `SMTP_PASSWORD` = `[the-app-password-you-just-created]`
   - `SMTP_HOST` = `smtp.office365.com`
   - `SUBSCRIBE_EMAIL` = `subscribe@wtfiction.com`

### Enabling App Passwords in Microsoft 365 Admin Center

If app passwords aren't available, they may be disabled organization-wide. Here's where to enable them:

**Option 1: Azure AD (Entra ID) Portal - Legacy Authentication**

App passwords are controlled by legacy authentication settings, not the main authentication methods page:

1. **Go to Azure AD Portal**
   - Visit [portal.azure.com](https://portal.azure.com)
   - Sign in with your admin account (`frank.s@montebay.io`)

2. **Navigate to Legacy Authentication Settings**
   - Click on **Azure Active Directory** (or **Microsoft Entra ID**)
   - Go to **Security** → **Conditional Access** (or search for "Legacy authentication")
   - OR go to **Properties** → Look for **"Manage security defaults"** or **"Legacy authentication"**

3. **Check Security Defaults**
   - If Security Defaults are enabled, app passwords are typically disabled
   - You may need to disable Security Defaults to enable app passwords
   - **Warning:** Disabling Security Defaults requires setting up Conditional Access policies

4. **Alternative: Check User Settings**
   - Go to **Users** → Find `frank.s@montebay.io`
   - Check if there are per-user app password settings

**Option 2: Microsoft 365 Admin Center - Security**

1. **Go to Microsoft 365 Admin Center**
   - Visit [admin.microsoft.com](https://admin.microsoft.com)
   - Sign in with your admin account

2. **Navigate to Security**
   - Click on **Security** in the left sidebar
   - Look for **"Authentication methods"** or **"Multi-factor authentication"**
   - OR go to **Azure Active Directory** → **Security** → **Authentication methods**

3. **Enable App Passwords**
   - Find **"App passwords"** or **"Legacy authentication"** settings
   - Enable for your organization
   - Save changes

**Option 3: Check Security Defaults**

App passwords are often disabled when Security Defaults are enabled:

1. In Azure AD Portal, go to **Azure Active Directory** → **Properties**
2. Scroll down to **"Manage security defaults"**
3. If Security Defaults are **ON**, app passwords are disabled
4. To enable app passwords:
   - Turn OFF Security Defaults (requires Global Admin)
   - Set up Conditional Access policies instead
   - **Note:** This is a significant security change - only do this if you understand the implications

**Option 4: Check if App Passwords Work Despite Settings**

Sometimes app passwords work even if not explicitly enabled. Try:
1. Go to [My Sign-Ins](https://mysignins.microsoft.com) → Security info
2. Look for "App passwords" in the left sidebar (might be hidden)
3. Or try: [App Passwords Direct](https://account.microsoft.com/security/app-passwords)
4. If it works, you can create one even if the setting isn't visible

**After Enabling:**

1. **Wait 5-10 minutes** for changes to propagate
2. **Try creating app password again:**
   - Go to [My Sign-Ins](https://mysignins.microsoft.com) → Security info
   - Or try: [App Passwords](https://account.microsoft.com/security/app-passwords)
   - You should now see the option to create app passwords

**Note:** If you don't see these options or don't have permissions, you may need Global Administrator permissions or need to contact your Microsoft 365 administrator.

### Enabling SMTP AUTH for the Tenant (Required!)

**IMPORTANT:** If you see the error: `SmtpClientAuthentication is disabled for the Tenant`, you need to enable SMTP AUTH at the organization level.

**Error Message:**
```
535 5.7.139 Authentication unsuccessful, SmtpClientAuthentication is disabled for the Tenant
```

**Solution: Enable SMTP AUTH in Exchange Online**

1. **Go to Microsoft 365 Admin Center**
   - Visit [admin.microsoft.com](https://admin.microsoft.com)
   - Sign in with Global Administrator account

2. **Navigate to Exchange Admin Center**
   - Go to **Admin centers** → **Exchange** (or visit [admin.exchange.microsoft.com](https://admin.exchange.microsoft.com))
   - Sign in with Global Administrator account

3. **Enable SMTP AUTH**
   
   **Note:** SMTP AUTH is often NOT visible in the "Manage email apps" UI. You'll need to use PowerShell.
   
   **If you see it in the UI:**
   - Go to **Recipients** → **Mailboxes**
   - Select the user account (`frank.s@montebay.io`)
   - Click **"Manage email apps"** or **"Mailbox features"**
   - Look for **"Authenticated SMTP"** or **"SMTP AUTH"** (may not be visible)
   - Enable it if you see it
   
   **If NOT visible (most common):**
   - Use PowerShell method below (recommended)

4. **PowerShell Method (Recommended - SMTP AUTH often not in UI)**
   
   SMTP AUTH is usually not visible in the Exchange Admin Center UI, so PowerShell is the most reliable method:
   
   ```powershell
   # Step 1: Install Exchange Online PowerShell module (if not already installed)
   Install-Module -Name ExchangeOnlineManagement -Scope CurrentUser
   
   # Step 2: Connect to Exchange Online
   Connect-ExchangeOnline
   # You'll be prompted to sign in - use your Global Admin account
   
   # Step 3: Enable SMTP AUTH for your specific user account
   Set-CASMailbox -Identity "frank.s@montebay.io" -SmtpClientAuthenticationDisabled $false
   
   # Step 4: Verify it's enabled
   Get-CASMailbox -Identity "frank.s@montebay.io" | Select-Object SmtpClientAuthenticationDisabled
   # Should show: SmtpClientAuthenticationDisabled : False
   ```
   
   **Alternative: Enable for entire organization (if you have permission)**
   ```powershell
   Set-TransportConfig -SmtpClientAuthenticationDisabled $false
   ```
   
   **Note:** Enabling for the entire organization is less secure but easier. Enabling for a specific user is more secure.

5. **Wait 5-15 minutes** for changes to propagate

6. **Test again** using the test script:
   ```bash
   API_URL=https://wtfiction.com/api/subscribe npm run test-email
   ```

**Reference:** [Microsoft Documentation](https://aka.ms/smtp_auth_disabled)

### If App Passwords Are Completely Disabled

If app passwords are disabled and cannot be enabled (e.g., Security Defaults are ON and cannot be changed), you have these options:

**Option A: Disable Security Defaults (Requires Global Admin)**
1. Go to Azure AD → Properties → Manage security defaults
2. Turn OFF Security Defaults
3. Set up Conditional Access policies to maintain security
4. Wait 5-10 minutes, then try creating app password again

**Option B: Use Regular Password (Only if MFA is bypassed for SMTP)**
- Some organizations allow SMTP with regular password if MFA is bypassed for legacy apps
- Try using your regular password as `SMTP_PASSWORD`
- **Warning:** This only works if your organization allows it - most don't for security reasons
- If it doesn't work, you'll get authentication errors

**Option C: Use Microsoft Graph API with OAuth2 (Advanced)**
- More secure and modern approach
- Requires Azure app registration
- More complex setup but works with modern authentication
- Would require code changes to use Microsoft Graph API instead of SMTP

**Option D: Contact Your IT Administrator**
- If you don't have Global Admin permissions
- Ask them to enable app passwords or provide an alternative solution
- They may be able to create a service account specifically for SMTP

### Alternative: Using Resend API (If App Passwords Can't Be Enabled)

Since app passwords aren't available in your organization, we'll use **Resend** - a modern email API that works perfectly with shared mailboxes.

**Advantages:**
- ✅ No app passwords needed
- ✅ Works with shared mailboxes
- ✅ Free tier: 100 emails/day
- ✅ Better deliverability
- ✅ Easy setup

**Setup Steps:**

1. **Sign up for Resend**
   - Go to [resend.com](https://resend.com)
   - Click "Get Started" or "Sign Up"
   - Create a free account (100 emails/day free)

2. **Verify your domain**
   - Once logged in, go to **Domains** in the left sidebar
   - Click **"Add Domain"**
   - Enter: `wtfiction.com`
   - Resend will provide DNS records to add:
     - **DKIM records** (TXT records)
     - **SPF record** (TXT record - may already exist)
     - **DMARC record** (TXT record - optional)
   - Add these records to Route 53 (same way we added the MX records)
   - Wait for verification (usually 5-10 minutes)

3. **Get your API Key**
   - Go to **API Keys** in the left sidebar
   - Click **"Create API Key"**
   - Name it: "WTFiction Production"
   - Copy the key (starts with `re_`)
   - **Important:** Save it securely - you won't see it again!

4. **Add to Vercel**
   - Go to Vercel → Settings → Environment Variables
   - Add these variables:
     - `RESEND_API_KEY` = `[your-resend-key]` (the one starting with `re_`)
     - `SUBSCRIBE_EMAIL` = `subscribe@wtfiction.com`
     - `FROM_EMAIL` = `noreply@wtfiction.com` (or `subscribe@wtfiction.com`)
   - Select all environments (Production, Preview, Development)

5. **Redeploy**
   - Go to Deployments → Redeploy the latest deployment

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

### How It Works

**SMTP with Admin Account:**
- ✅ Your admin account authenticates via SMTP (using app password)
- ✅ Emails are sent FROM your admin account
- ✅ Emails are sent TO the shared mailbox (`subscribe@wtfiction.com`)
- ✅ No third-party service needed
- ✅ Works with existing Microsoft 365 setup

**Important:** 
- The `SMTP_USER` is your admin account email (the one that authenticates)
- The `SUBSCRIBE_EMAIL` is the shared mailbox (where emails are delivered)
- The code automatically formats the "From" field to show "WTFiction" as the sender name

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
