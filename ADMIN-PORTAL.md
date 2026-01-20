# Admin Portal Proposal

## Current State
- Static site with manual video management
- Script-based video metadata fetching
- Requires editing `scenarios.ts` manually

## Option 1: Auto-Fetch on Build (Implemented)
✅ **Pros:**
- Simple, no additional infrastructure
- Works with current static setup
- Automatic metadata updates on every deploy

❌ **Cons:**
- Still need to manually add video URLs to `scenarios.ts`
- Requires API key in Vercel
- Slower builds (adds ~5-10 seconds)

## Option 2: Admin Portal (Recommended for Scale)

### Architecture Options

#### A. Separate Admin App (Next.js with API Routes)
- **Location**: `admin.wtfiction.com` (separate Vercel project)
- **Features**:
  - Add/edit/delete videos
  - Auto-fetch metadata from YouTube
  - Preview changes
  - Generate `scenarios.ts` file
  - Push to GitHub automatically (via GitHub API)
- **Tech**: Next.js with API routes, GitHub API, YouTube API
- **Cost**: Free (Vercel + GitHub)

#### B. Headless CMS (Sanity/Contentful)
- **Location**: CMS dashboard + API
- **Features**:
  - Visual content editor
  - Auto-sync with YouTube
  - Built-in preview
  - Version control
- **Tech**: Sanity.io or Contentful
- **Cost**: Free tier available

#### C. Simple Admin Page (GitHub-based)
- **Location**: `/admin` route (protected)
- **Features**:
  - Simple form to add videos
  - Fetches metadata
  - Generates file content
  - Downloads updated `scenarios.ts`
  - You commit manually
- **Tech**: Static page with client-side API calls
- **Cost**: Free

### Recommended: Option A (Separate Admin App)

**Why:**
- Clean separation of concerns
- Can use API routes (not limited by static export)
- Easy to add authentication
- Can auto-commit to GitHub
- Scalable

**Implementation:**
1. Create new Next.js app: `wtfiction-admin`
2. Add GitHub API integration
3. Build simple CRUD interface
4. Deploy to `admin.wtfiction.com`

**Workflow:**
1. Add video URL in admin portal
2. Auto-fetch metadata
3. Preview changes
4. Click "Publish" → commits to GitHub → auto-deploys main site

Would you like me to build the admin portal? It would take about 1-2 hours to set up a basic version.
