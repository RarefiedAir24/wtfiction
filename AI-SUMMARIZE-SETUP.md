# AI Summarize Feature - Main Site

The AI Summarize feature allows visitors to generate quick summaries of references when descriptions are not available.

## How It Works

When viewing references on the main site (`/references`), if a reference doesn't have a description, visitors will see a **"Get AI summary"** button. Clicking it generates a concise summary using OpenAI's API.

## Setup

### 1. Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to **API Keys** in your account settings
4. Click **"Create new secret key"**
5. Copy the key (you won't be able to see it again)

### 2. Add to Vercel Environment Variables

1. Go to your Vercel project dashboard for `wtfiction` (main site)
2. Navigate to **Settings** → **Environment Variables**
3. Add a new variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
   - **Environment**: Select all (Production, Preview, Development)
4. Click **Save**

### 3. Redeploy

After adding the environment variable, redeploy your site:
- Go to **Deployments**
- Click **"..."** on the latest deployment → **"Redeploy"**
- Or push a new commit to trigger a rebuild

## User Experience

### For Visitors

1. Navigate to `/references` page
2. Find a reference without a description
3. Click **"Get AI summary"** button
4. Summary appears inline (2-4 sentences)
5. Summary is generated on-demand (not cached)

### Features

- **On-demand**: Only generates when user clicks
- **Context-aware**: Uses reference title, type, and URL
- **Fast**: Uses `gpt-4o-mini` for quick responses
- **Non-intrusive**: Only shows when description is missing

## Cost

- Uses `gpt-4o-mini` model (cost-effective)
- ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- Typical summary: ~100-200 tokens (~$0.0001-0.0002 per summary)
- Very affordable for user-generated summaries

## Troubleshooting

**"AI summarization is not available"**
- Make sure `OPENAI_API_KEY` is set in Vercel environment variables
- Redeploy after adding the variable

**"Failed to generate summary"**
- Check your OpenAI API key is valid
- Ensure you have credits in your OpenAI account
- Check the browser console for detailed error messages

## Security

- API key is stored securely in Vercel (never exposed to client)
- API calls are made server-side only
- Never commit API keys to git (already in `.gitignore`)
