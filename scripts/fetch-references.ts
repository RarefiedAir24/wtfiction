/**
 * Fetch latest references.ts from GitHub during build
 * This ensures the main site always has the latest references without manual deployment
 */

import { writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

async function fetchReferencesFromGitHub(): Promise<void> {
  const owner = 'RarefiedAir24';
  const repo = 'wtfiction';
  const path = 'data/references.ts';
  
  try {
    // Fetch from GitHub raw content
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
    console.log('📚 Fetching latest references from GitHub...');
    
    const response = await fetch(rawUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      console.warn(`⚠️  Could not fetch references from GitHub (${response.status}). Using local file.`);
      return;
    }

    const content = await response.text();
    
    // Validate that we got valid TypeScript content
    if (!content.includes('export interface Citation') || !content.includes('export const references')) {
      console.warn('⚠️  Fetched content does not appear to be valid references.ts. Using local file.');
      return;
    }

    // Write to local file
    const referencesPath = join(process.cwd(), 'data', 'references.ts');
    writeFileSync(referencesPath, content, 'utf-8');
    
    // Count references to verify
    const referenceCount = (content.match(/episodeId:/g) || []).length;
    console.log(`✅ Fetched references.ts from GitHub (${referenceCount} episodes)`);
  } catch (error: any) {
    console.warn(`⚠️  Error fetching references from GitHub: ${error.message}`);
    console.warn('   Using local references.ts file');
  }
}

// Run if called directly
if (require.main === module) {
  fetchReferencesFromGitHub().catch(console.error);
}

export default fetchReferencesFromGitHub;
