# AWS SES Email Setup

This guide shows how to set up AWS SES (Simple Email Service) for email subscriptions, which avoids Microsoft 365 SMTP AUTH restrictions.

## Why AWS SES?

- ✅ **No SMTP AUTH restrictions** - Works with any email address (including shared mailboxes)
- ✅ **Reliable** - AWS infrastructure, high deliverability
- ✅ **Cost-effective** - Free tier: 62,000 emails/month (if sent from EC2), or $0.10 per 1,000 emails
- ✅ **Simple setup** - Just API keys, no complex authentication
- ✅ **Works with shared mailboxes** - No need for user accounts or app passwords

## Step 1: Set Up AWS SES

### 1.1 Create AWS Account (if needed)

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Sign up for an AWS account (free tier available)

### 1.2 Verify Your Domain in SES

1. **Go to AWS SES Console**
   - Visit [console.aws.amazon.com/ses](https://console.aws.amazon.com/ses)
   - Sign in to your AWS account

2. **Verify Domain**
   - Go to **Verified identities** → **Create identity**
   - Select **Domain**
   - Enter: `wtfiction.com`
   - Click **Create identity**

3. **Add DNS Records**
   - AWS will provide DNS records to add:
     - **DKIM records** (3 CNAME records)
     - **SPF record** (TXT record - may already exist)
     - **DMARC record** (TXT record - optional)
   - Add these to Route 53 (same way we added MX records)
   - Wait for verification (usually 5-10 minutes)

4. **Request Production Access** (if in sandbox)
   - AWS SES starts in "sandbox" mode (can only send to verified emails)
   - Go to **Account dashboard** → **Request production access**
   - Fill out the form (explain you're sending subscription notifications)
   - Usually approved within 24 hours

### 1.3 Create IAM User for API Access

1. **Go to IAM Console**
   - Visit [console.aws.amazon.com/iam](https://console.aws.amazon.com/iam)
   - Go to **Users** → **Create user**

2. **Create User**
   - Username: `wtfiction-ses-sender`
   - Select **"Provide user access to the AWS Management Console"** (optional, for testing)
   - OR select **"Access key - Programmatic access"** (for API only)

3. **Attach Policy**
   - Click **"Attach policies directly"**
   - Search for and select: **"AmazonSESFullAccess"** (or create a custom policy with just `ses:SendEmail` permission)
   - Click **Next** → **Create user**

4. **Save Credentials**
   - **Access Key ID**: Copy this (starts with `AKIA...`)
   - **Secret Access Key**: Copy this (you won't see it again!)
   - Save both securely

## Step 2: Add to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Select the **wtfiction** project
   - Go to **Settings** → **Environment Variables**

2. **Add AWS SES Variables**
   - `AWS_ACCESS_KEY_ID` = `[your-access-key-id]`
   - `AWS_SECRET_ACCESS_KEY` = `[your-secret-access-key]`
   - `AWS_REGION` = `us-east-1` (or your preferred region)
   - `SUBSCRIBE_EMAIL` = `subscribe@wtfiction.com`
   - `FROM_EMAIL` = `noreply@wtfiction.com` (must be verified in SES)

3. **Select Environments**
   - Select all three: Production, Preview, Development
   - Click **Save** for each

4. **Redeploy**
   - Go to **Deployments** → Redeploy the latest deployment

## Step 3: Test

After redeploying, test the email subscription:

```bash
API_URL=https://wtfiction.com/api/subscribe npm run test-email
```

Or test directly on the website by submitting the email form.

## Cost

- **Free Tier**: 62,000 emails/month (if sent from EC2 in same region)
- **Pay-as-you-go**: $0.10 per 1,000 emails (after free tier)
- **For subscription emails**: Very low cost (likely free for your use case)

## Security Best Practices

1. **Use IAM User** (not root account)
2. **Minimal Permissions**: Create custom IAM policy with only `ses:SendEmail` permission
3. **Rotate Keys**: Regularly rotate access keys
4. **Environment Variables**: Never commit keys to git (already in `.gitignore`)

## Troubleshooting

### "Email address not verified"
- Make sure `FROM_EMAIL` is verified in SES
- Or verify the entire domain (recommended)

### "Account is in sandbox mode"
- Request production access in SES dashboard
- Or verify recipient email addresses for testing

### "Access Denied"
- Check IAM user has `ses:SendEmail` permission
- Verify AWS credentials are correct in Vercel

## Next Steps

Once AWS SES is set up:
1. ✅ Domain verified in SES
2. ✅ IAM user created with API keys
3. ✅ Environment variables added to Vercel
4. ✅ Test email subscription
5. ✅ Request production access (if needed)

The code will automatically use AWS SES if `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set.
