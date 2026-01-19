#!/usr/bin/env tsx
/**
 * Script to fetch video metadata from YouTube and update scenarios.ts
 * 
 * Usage:
 *   YOUTUBE_API_KEY=your_key npm run fetch-videos
 *   or
 *   npx tsx scripts/fetch-video-data.ts
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fetchYouTubeVideoMetadata } from '../lib/youtube-api';
import { getYouTubeVideoId } from '../lib/youtube';

const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error('❌ YOUTUBE_API_KEY environment variable is required');
  console.error('   Get your API key from: https://console.cloud.google.com/apis/credentials');
  console.error('   Create a .env.local file with: YOUTUBE_API_KEY=your_key');
  process.exit(1);
}

interface Scenario {
  id: string;
  title: string;
  premise: string;
  runtime?: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  publishDate?: string;
  keyInsight?: string;
  featured?: boolean;
  hero?: boolean;
}

async function main() {
  const scenariosPath = join(process.cwd(), 'data', 'scenarios.ts');
  let fileContent = readFileSync(scenariosPath, 'utf-8');
  
  // Extract all YouTube URLs from the file
  const videoUrlRegex = /youtubeUrl:\s*['"](https?:\/\/[^'"]+)['"]/g;
  const videoUrls: Array<{ url: string; videoId: string }> = [];
  let match;
  
  while ((match = videoUrlRegex.exec(fileContent)) !== null) {
    const url = match[1];
    const videoId = getYouTubeVideoId(url);
    // Only add if we have a valid video ID (not null) and it's not a placeholder
    if (videoId && typeof videoId === 'string' && !videoId.startsWith('example')) {
      videoUrls.push({ url, videoId });
    }
  }
  
  if (videoUrls.length === 0) {
    console.log('⚠️  No valid YouTube videos found in scenarios.ts');
    return;
  }
  
  console.log(`📹 Found ${videoUrls.length} video(s) to fetch...\n`);
  
  // Fetch metadata for each video
  const updates: Array<{ videoId: string; url: string; metadata: Awaited<ReturnType<typeof fetchYouTubeVideoMetadata>> }> = [];
  
  for (const item of videoUrls) {
    const url: string = item.url;
    const videoId: string = item.videoId;
    // videoId is guaranteed to be string here because we filtered nulls above
    console.log(`📥 Fetching: ${videoId}...`);
    const metadata = await fetchYouTubeVideoMetadata(videoId, API_KEY);
    
    if (metadata) {
      updates.push({ videoId, url, metadata });
      console.log(`   ✓ ${metadata.title}`);
      console.log(`     Runtime: ${metadata.runtime} | Published: ${metadata.publishDate}\n`);
    } else {
      console.log(`   ❌ Failed to fetch metadata\n`);
    }
    
    // Rate limiting: YouTube API allows 100 units per 100 seconds
    // Each video fetch costs 1 unit, so we can be generous
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  if (updates.length === 0) {
    console.log('⚠️  No videos were updated');
    return;
  }
  
  // Update the file with fetched metadata
  let updatedContent = fileContent;
  
  for (const { videoId, url, metadata } of updates) {
    // Escape special characters for regex
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Update title - find the scenario block and update title
    const titleRegex = new RegExp(
      `(youtubeUrl:\\s*['"]${escapedUrl}['"],\\s*\\n\\s*)publishDate:\\s*['"][^'"]*['"]`,
      's'
    );
    const titleMatch = fileContent.match(
      new RegExp(`(id:\\s*['"][^'"]+['"],\\s*\\n\\s*title:\\s*['"])([^'"]+)(['"])`, 's')
    );
    
    // More targeted approach: find the scenario that contains this URL
    const scenarioBlockRegex = new RegExp(
      `(\\{[^}]*youtubeUrl:\\s*['"]${escapedUrl}['"][^}]*\\})`,
      's'
    );
    const scenarioMatch = fileContent.match(scenarioBlockRegex);
    
    if (scenarioMatch) {
      let scenarioBlock = scenarioMatch[1];
      const originalBlock = scenarioBlock;
      
      // Update title
      scenarioBlock = scenarioBlock.replace(
        /title:\s*['"]([^'"]*)['"]/,
        `title: '${metadata.title.replace(/'/g, "\\'")}'`
      );
      
      // Update premise
      scenarioBlock = scenarioBlock.replace(
        /premise:\s*['"]([^'"]*)['"]/,
        `premise: '${metadata.premise.replace(/'/g, "\\'")}'`
      );
      
      // Update runtime
      if (scenarioBlock.includes('runtime:')) {
        scenarioBlock = scenarioBlock.replace(
          /runtime:\s*['"]([^'"]*)['"]/,
          `runtime: '${metadata.runtime}'`
        );
      } else {
        // Add runtime if it doesn't exist (insert before youtubeUrl)
        scenarioBlock = scenarioBlock.replace(
          /(premise:\s*['"][^'"]*['"],\s*\n\s*)(youtubeUrl:)/,
          `$1runtime: '${metadata.runtime}',\n    $2`
        );
      }
      
      // Update publishDate
      if (scenarioBlock.includes('publishDate:')) {
        scenarioBlock = scenarioBlock.replace(
          /publishDate:\s*['"]([^'"]*)['"]/,
          `publishDate: '${metadata.publishDate}'`
        );
      } else {
        // Add publishDate if it doesn't exist (insert before featured)
        scenarioBlock = scenarioBlock.replace(
          /(youtubeUrl:\s*['"][^'"]*['"],\s*\n\s*)(featured|thumbnailUrl)/,
          `$1publishDate: '${metadata.publishDate}',\n    $2`
        );
      }
      
      // Update or add thumbnailUrl
      if (scenarioBlock.includes('thumbnailUrl:')) {
        scenarioBlock = scenarioBlock.replace(
          /thumbnailUrl:\s*['"]([^'"]*)['"]/,
          `thumbnailUrl: '${metadata.thumbnailUrl}'`
        );
      } else {
        // Add thumbnailUrl if it doesn't exist (insert before publishDate or featured)
        scenarioBlock = scenarioBlock.replace(
          /(youtubeUrl:\s*['"][^'"]*['"],\s*\n\s*)(publishDate|featured)/,
          `$1thumbnailUrl: '${metadata.thumbnailUrl}',\n    $2`
        );
      }
      
      // Replace the original block with updated block
      updatedContent = updatedContent.replace(originalBlock, scenarioBlock);
    }
  }
  
  writeFileSync(scenariosPath, updatedContent, 'utf-8');
  console.log(`\n✅ Updated ${updates.length} video(s) in scenarios.ts`);
  console.log('   Review the changes and commit if everything looks good!');
}

main().catch(console.error);
