# Remove SMTP Variables from Vercel

Since we're now using AWS SES, you can remove the SMTP variables from Vercel.

## Variables to Remove

Go to **Vercel Dashboard** → **Settings** → **Environment Variables** and delete:

- `SMTP_HOST`
- `SMTP_USER`
- `SMTP_PASSWORD`

**Optional:** You can also remove `RESEND_API_KEY` if you're only using AWS SES.

## Keep These Variables

Make sure these AWS SES variables are set:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (should be `us-east-2`)
- `SUBSCRIBE_EMAIL`
- `FROM_EMAIL`

## Steps

1. Go to [vercel.com](https://vercel.com)
2. Select the **wtfiction** project
3. Go to **Settings** → **Environment Variables**
4. For each SMTP variable (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD`):
   - Click the **"..."** (three dots) next to the variable
   - Click **"Delete"**
   - Confirm deletion
5. **Redeploy** your project after removing variables

## Or Use CLI (if authenticated)

If you have Vercel CLI authenticated, you can run:

```bash
./scripts/remove-smtp-vars.sh
```

Or manually:

```bash
vercel env rm SMTP_HOST production --yes
vercel env rm SMTP_HOST preview --yes
vercel env rm SMTP_HOST development --yes

vercel env rm SMTP_USER production --yes
vercel env rm SMTP_USER preview --yes
vercel env rm SMTP_USER development --yes

vercel env rm SMTP_PASSWORD production --yes
vercel env rm SMTP_PASSWORD preview --yes
vercel env rm SMTP_PASSWORD development --yes
```
