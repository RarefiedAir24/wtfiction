# Deployment Guide

This guide walks you through deploying WTFiction.com to Vercel with automatic deployments from GitHub.

## Prerequisites

- GitHub repository: https://github.com/RarefiedAir24/wtfiction.git
- Domain: wtfiction.com (managed in Route 53)
- Vercel account (free tier works)

## Step 1: Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account)
2. Click **"Add New Project"**
3. Import the GitHub repository: `RarefiedAir24/wtfiction`
4. Vercel will auto-detect Next.js settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `out` (for static export)
   - **Install Command**: `npm install` (auto-detected)
5. Click **"Deploy"**

Vercel will build and deploy your site automatically. You'll get a preview URL like `wtfiction-xyz.vercel.app`.

## Step 2: Configure Custom Domain (wtfiction.com)

### In Vercel Dashboard:

1. Go to your project settings
2. Navigate to **"Domains"** section
3. Add `wtfiction.com` and `www.wtfiction.com`
4. Vercel will show you DNS records to add

### In Route 53 (AWS):

You need to add/update these DNS records:

**For wtfiction.com (apex domain):**
- **Type**: A
- **Name**: `@` or `wtfiction.com`
- **Value**: Vercel's IP address (Vercel will provide this, typically multiple A records)

**For www.wtfiction.com:**
- **Type**: CNAME
- **Name**: `www`
- **Value**: `cname.vercel-dns.com` (or the CNAME Vercel provides)

**Alternative (Recommended):**
Vercel may provide a single CNAME record that you can use with Route 53's alias feature:
- **Type**: A (Alias)
- **Name**: `@`
- **Alias Target**: The ALIAS target Vercel provides

### DNS Propagation

After updating DNS records:
- Wait 5-60 minutes for DNS propagation
- Vercel will automatically detect when DNS is configured correctly
- SSL certificate will be automatically provisioned (Let's Encrypt)

## Step 3: Verify Deployment

1. Visit `https://wtfiction.com` (should work after DNS propagates)
2. Visit `https://www.wtfiction.com` (should redirect to apex domain if configured)
3. Check that all pages load correctly:
   - Home (`/`)
   - Scenarios (`/scenarios`)
   - About (`/about`)
   - References (`/references`)
   - Subscribe (`/subscribe`)

## Automatic Deployments

Once connected, every push to the `main` branch will:
1. Trigger a new build on Vercel
2. Deploy automatically
3. Update the live site (usually within 1-2 minutes)

**Preview Deployments:**
- Pull requests automatically get preview URLs
- You can test changes before merging

## Troubleshooting

### Build Fails
- Check Vercel build logs in the dashboard
- Ensure `package.json` has all dependencies
- Verify `next.config.ts` is correct

### Domain Not Working
- Verify DNS records in Route 53 match Vercel's requirements
- Check DNS propagation: `dig wtfiction.com` or use [dnschecker.org](https://dnschecker.org)
- Ensure SSL certificate is provisioned (check Vercel dashboard)

### Static Export Issues
- The site uses static export (`output: 'export'` in `next.config.ts`)
- This means no server-side features (API routes, etc.)
- Perfect for this use case - fast, CDN-optimized

## Environment Variables

Currently, no environment variables are needed. If you add email functionality later:
1. Add variables in Vercel dashboard: **Settings → Environment Variables**
2. They'll be available at build time

## Monitoring

Vercel provides:
- Analytics (traffic, performance)
- Real-time logs
- Error tracking
- Performance insights

Access these in your Vercel project dashboard.

## Rollback

If something goes wrong:
1. Go to **Deployments** in Vercel dashboard
2. Find the previous working deployment
3. Click **"..." → Promote to Production"**

---

**That's it!** Your site will automatically deploy on every push to GitHub, just like montebay.io.
