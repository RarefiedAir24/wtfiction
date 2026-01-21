/**
 * Fetch latest scenarios.ts from GitHub during build
 * Parses as records and regenerates clean file to prevent corruption
 */

import { writeFileSync } from 'fs';
import { join } from 'path';
import { parseEpisodes, generateScenariosFile } from './scenarios-manager';

async function fetchScenariosFromGitHub(): Promise<void> {
  const owner = 'RarefiedAir24';
  const repo = 'wtfiction';
  const path = 'data/scenarios.ts';
  
  try {
    // Fetch from GitHub raw content
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
    console.log('📹 Fetching latest scenarios from GitHub...');
    
    const response = await fetch(rawUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.warn(`⚠️  Could not fetch scenarios from GitHub (${response.status}). Using local file.`);
      return;
    }

    const content = await response.text();
    
    // Validate that we got valid TypeScript content
    if (!content.includes('export interface Scenario') || !content.includes('export const scenarios')) {
      console.warn('⚠️  Fetched content does not appear to be valid scenarios.ts. Using local file.');
      return;
    }

    // Parse as records (this cleans corrupted data automatically)
    const episodes = parseEpisodes(content);
    console.log(`   Parsed ${episodes.length} episodes as records`);
    
    // Regenerate clean file
    const cleanContent = generateScenariosFile(episodes);
    
    // Write clean file
    const scenariosPath = join(process.cwd(), 'data', 'scenarios.ts');
    writeFileSync(scenariosPath, cleanContent, 'utf-8');
    
    console.log(`✅ Fetched and cleaned scenarios.ts from GitHub (${episodes.length} scenarios)`);
  } catch (error: any) {
    console.warn(`⚠️  Error fetching scenarios from GitHub: ${error.message}`);
    console.warn('   Using local scenarios.ts file');
  }
}

// Run if called directly
if (require.main === module) {
  fetchScenariosFromGitHub().catch(console.error);
}

export default fetchScenariosFromGitHub;
