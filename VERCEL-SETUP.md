# Adding YouTube API Key to Vercel

## Steps to Add Environment Variable

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account
   - Select the **wtfiction** project

2. **Navigate to Settings**
   - Click on your project
   - Go to **Settings** (in the top navigation)
   - Click **Environment Variables** (in the left sidebar)

3. **Add the API Key**
   - Click **"Add New"** or **"Add Environment Variable"**
   - **Key**: `YOUTUBE_API_KEY`
   - **Value**: `AIzaSyAyRnhzOtrsAX0CZfE_yb8RlOiy63NSEqg`
   - **Environment**: Select all three:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
   - Click **"Save"**

4. **Redeploy**
   - After adding the variable, go to **Deployments**
   - Find the latest deployment
   - Click **"..."** (three dots) → **"Redeploy"**
   - Or push a new commit to trigger a rebuild

## Verify It's Working

After the next deployment, check the build logs:
- You should see: `📹 Auto-fetching video metadata...`
- Followed by: `✓ [Video Title]`
- And: `✅ Updated X video(s)`

If you see `⚠️ YOUTUBE_API_KEY not found`, the variable wasn't set correctly.

## Security Note

- The API key is stored securely in Vercel
- It's only available during build time
- Never commit the API key to git (it's already in `.gitignore`)
