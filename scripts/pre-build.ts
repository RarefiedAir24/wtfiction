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
import fetchReferencesFromGitHub from './fetch-references';
import fetchScenariosFromGitHub from './fetch-scenarios';
import { parseEpisodes, generateScenariosFile, Episode } from './scenarios-manager';

// Load .env.local if it exists (for local development)
config({ path: join(process.cwd(), '.env.local') });

const API_KEY = process.env.YOUTUBE_API_KEY;

async function preBuild() {
  // Always fetch latest data from GitHub first (scenarios and references)
  // This ensures the main site always has the latest content from admin portal
  await Promise.all([
    fetchScenariosFromGitHub(),
    fetchReferencesFromGitHub(),
  ]);
  
  if (!API_KEY) {
    console.log('⚠️  YOUTUBE_API_KEY not found - skipping video metadata fetch');
    console.log('   Videos will use existing metadata or placeholders');
    return;
  }

  console.log('📹 Auto-fetching video metadata...\n');

  const scenariosPath = join(process.cwd(), 'data', 'scenarios.ts');
  const fileContent = readFileSync(scenariosPath, 'utf-8');

  // Parse as records (ensures clean data structure)
  const episodes = parseEpisodes(fileContent);

  // Find episodes that need metadata updates
  const episodesToUpdate: Array<{ episode: Episode; videoId: string }> = [];
  for (const episode of episodes) {
    const videoId = getYouTubeVideoId(episode.youtubeUrl);
    if (videoId && !videoId.startsWith('example')) {
      episodesToUpdate.push({ episode, videoId });
    }
  }

  if (episodesToUpdate.length === 0) {
    console.log('✅ No videos to fetch\n');
    return;
  }

  // Fetch metadata for each video and update episode records
  for (const { episode, videoId } of episodesToUpdate) {
    try {
      const metadata = await fetchYouTubeVideoMetadata(videoId, API_KEY);
      
      if (metadata) {
        // Update episode record (not string manipulation!)
        episode.title = metadata.title;
        episode.premise = metadata.premise;
        episode.runtime = metadata.runtime;
        episode.publishDate = metadata.publishDate;
        episode.thumbnailUrl = metadata.thumbnailUrl;
        
        console.log(`   ✓ ${metadata.title}`);
      }
    } catch (error) {
      console.error(`   ❌ Error fetching ${videoId}:`, error);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Regenerate clean file from updated records
  const cleanContent = generateScenariosFile(episodes);
  writeFileSync(scenariosPath, cleanContent, 'utf-8');
  console.log(`\n✅ Updated ${episodesToUpdate.length} video(s)\n`);
}

preBuild().catch(console.error);
