#!/usr/bin/env tsx
/**
 * Pre-build script: Auto-fetch video metadata before building
 * This runs automatically before `next build`
 * 
 * Set YOUTUBE_API_KEY in Vercel environment variables for this to work
 */

import { config } from 'dotenv';
import { join } from 'path';
import { fetchYouTubeVideoMetadata } from '../lib/youtube-api';
import { getYouTubeVideoId } from '../lib/youtube';
import { readFileSync, writeFileSync } from 'fs';

// Load .env.local if it exists (for local development)
config({ path: join(process.cwd(), '.env.local') });

const API_KEY = process.env.YOUTUBE_API_KEY;

async function preBuild() {
  if (!API_KEY) {
    console.log('⚠️  YOUTUBE_API_KEY not found - skipping video metadata fetch');
    console.log('   Videos will use existing metadata or placeholders');
    return;
  }

  console.log('📹 Auto-fetching video metadata...\n');

  const scenariosPath = join(process.cwd(), 'data', 'scenarios.ts');
  let fileContent = readFileSync(scenariosPath, 'utf-8');

  // Extract all YouTube URLs
  const videoUrlRegex = /youtubeUrl:\s*['"](https?:\/\/[^'"]+)['"]/g;
  const videoUrls: Array<{ url: string; videoId: string }> = [];
  let match;

  while ((match = videoUrlRegex.exec(fileContent)) !== null) {
    const url = match[1];
    const videoId = getYouTubeVideoId(url);
    if (videoId && !videoId.startsWith('example')) {
      videoUrls.push({ url, videoId });
    }
  }

  if (videoUrls.length === 0) {
    console.log('✅ No videos to fetch\n');
    return;
  }

  // Fetch metadata for each video
  for (const { url, videoId } of videoUrls) {
    try {
      const metadata = await fetchYouTubeVideoMetadata(videoId, API_KEY);
      
      if (metadata) {
        // Update the file with fetched metadata
        const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const scenarioBlockRegex = new RegExp(
          `(\\{[^}]*youtubeUrl:\\s*['"]${escapedUrl}['"][^}]*\\})`,
          's'
        );
        const scenarioMatch = fileContent.match(scenarioBlockRegex);
        
        if (scenarioMatch) {
          let scenarioBlock = scenarioMatch[1];
          const originalBlock = scenarioBlock;

          // Update fields
          scenarioBlock = scenarioBlock.replace(
            /title:\s*['"]([^'"]*)['"]/,
            `title: '${metadata.title.replace(/'/g, "\\'")}'`
          );
          
          scenarioBlock = scenarioBlock.replace(
            /premise:\s*['"]([^'"]*)['"]/,
            `premise: '${metadata.premise.replace(/'/g, "\\'")}'`
          );

          if (scenarioBlock.includes('runtime:')) {
            scenarioBlock = scenarioBlock.replace(
              /runtime:\s*['"]([^'"]*)['"]/,
              `runtime: '${metadata.runtime}'`
            );
          } else {
            scenarioBlock = scenarioBlock.replace(
              /(premise:\s*['"][^'"]*['"],\s*\n\s*)(youtubeUrl:)/,
              `$1runtime: '${metadata.runtime}',\n    $2`
            );
          }

          if (scenarioBlock.includes('publishDate:')) {
            scenarioBlock = scenarioBlock.replace(
              /publishDate:\s*['"]([^'"]*)['"]/,
              `publishDate: '${metadata.publishDate}'`
            );
          } else {
            scenarioBlock = scenarioBlock.replace(
              /(youtubeUrl:\s*['"][^'"]*['"],\s*\n\s*)(featured|thumbnailUrl)/,
              `$1publishDate: '${metadata.publishDate}',\n    $2`
            );
          }

          if (scenarioBlock.includes('thumbnailUrl:')) {
            scenarioBlock = scenarioBlock.replace(
              /thumbnailUrl:\s*['"]([^'"]*)['"]/,
              `thumbnailUrl: '${metadata.thumbnailUrl}'`
            );
          } else {
            scenarioBlock = scenarioBlock.replace(
              /(youtubeUrl:\s*['"][^'"]*['"],\s*\n\s*)(publishDate|featured)/,
              `$1thumbnailUrl: '${metadata.thumbnailUrl}',\n    $2`
            );
          }

          fileContent = fileContent.replace(originalBlock, scenarioBlock);
          console.log(`   ✓ ${metadata.title}`);
        }
      }
    } catch (error) {
      console.error(`   ❌ Error fetching ${videoId}:`, error);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  writeFileSync(scenariosPath, fileContent, 'utf-8');
  console.log(`\n✅ Updated ${videoUrls.length} video(s)\n`);
}

preBuild().catch(console.error);
