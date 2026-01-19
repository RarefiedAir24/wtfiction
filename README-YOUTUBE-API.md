# YouTube API Integration

This project automatically fetches video metadata (title, description, runtime, publish date, thumbnail) from YouTube using the YouTube Data API v3.

## Setup

### 1. Get a YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the **YouTube Data API v3**:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

### 2. Set Environment Variable

Create a `.env.local` file in the project root:

```bash
YOUTUBE_API_KEY=your_api_key_here
```

**Important:** Never commit your API key to git. The `.env.local` file is already in `.gitignore`.

### 3. Install Dependencies

```bash
npm install
```

## Usage

### Fetch Video Data Automatically

Run the script to automatically update all videos in `data/scenarios.ts`:

```bash
npm run fetch-videos
```

This script will:
- Read all YouTube URLs from `scenarios.ts`
- Fetch metadata for each video (title, description, runtime, publish date, thumbnail)
- Update the file with the latest information
- Skip placeholder videos (those with "example" in the URL)

### What Gets Updated

For each video, the script updates:
- **Title**: From YouTube video title
- **Premise**: Extracted from video description (first sentence or first 200 chars)
- **Runtime**: Converted from YouTube's ISO 8601 format to MM:SS or HH:MM:SS
- **Publish Date**: Formatted as YYYY-MM-DD
- **Thumbnail URL**: Highest quality available thumbnail

### Manual Override

You can still manually edit `scenarios.ts` if needed. The script only updates fields that come from YouTube - you can add custom `premise` text, `keyInsight`, or other fields manually.

## Workflow

**When you publish a new episode:**

1. Add the video to `data/scenarios.ts` with just the YouTube URL:
   ```typescript
   {
     id: 'new-episode',
     title: 'Placeholder', // Will be updated
     premise: 'Placeholder', // Will be updated
     youtubeUrl: 'https://www.youtube.com/watch?v=NEW_VIDEO_ID',
     featured: true,
   }
   ```

2. Run the fetch script:
   ```bash
   npm run fetch-videos
   ```

3. Review the changes in `scenarios.ts` and commit:
   ```bash
   git add data/scenarios.ts
   git commit -m "Add new episode: [Episode Title]"
   git push
   ```

4. The site will automatically rebuild and deploy!

## Rate Limits

YouTube Data API v3 has these limits:
- **100 units per 100 seconds** per user
- Each video fetch costs **1 unit**
- The script includes a 100ms delay between requests to stay within limits

For most use cases (updating a few videos), this is more than sufficient.

## Troubleshooting

### "YOUTUBE_API_KEY environment variable is required"
- Make sure you've created `.env.local` with your API key
- Restart your terminal/IDE after creating the file

### "Video not found"
- Check that the video ID is correct
- Make sure the video is public (private/unlisted videos won't work)

### "YouTube API error: 403"
- Your API key might be restricted
- Check that "YouTube Data API v3" is enabled in Google Cloud Console
- Make sure your API key has the correct permissions

### Script doesn't update my video
- Check that the video URL in `scenarios.ts` is correct
- Make sure the video ID is valid (not "example1", etc.)
- Review the script output for any error messages

## Security Notes

- **Never commit your API key** to git
- The `.env.local` file is in `.gitignore` and won't be committed
- For production builds, add the API key as an environment variable in Vercel (if you want to fetch videos during build)

## Future Enhancements

Potential improvements:
- Fetch videos automatically on build (requires API key in Vercel)
- Support for playlists
- Batch updates for multiple videos
- Cache video data to reduce API calls
