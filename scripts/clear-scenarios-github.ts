#!/usr/bin/env tsx
/**
 * Clear all episodes from scenarios.ts on GitHub
 */

import { Octokit } from '@octokit/rest';
import { readFileSync } from 'fs';
import { join } from 'path';

const token = process.env.GITHUB_TOKEN;
const owner = 'RarefiedAir24';
const repo = 'wtfiction';

if (!token) {
  console.error('❌ GITHUB_TOKEN environment variable not set');
  process.exit(1);
}

const emptyContent = `export interface Scenario {
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
  category?: string;
}

export const scenarios: Scenario[] = [

];

export const featuredScenarios = scenarios.filter(s => s.featured);

export function getHeroEpisode(): Scenario | null {
  const featured = scenarios.filter(s => s.featured);
  if (featured.length === 0) return null;
  const pinnedEpisode = featured.find(s => s.hero === true);
  if (pinnedEpisode) {
    return pinnedEpisode;
  }
  const sorted = [...featured].sort((a, b) => {
    if (a.publishDate && b.publishDate) {
      const dateA = new Date(a.publishDate);
      const dateB = new Date(b.publishDate);
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0;
      }
      return dateB.getTime() - dateA.getTime();
    }
    if (a.publishDate && !b.publishDate) {
      const dateA = new Date(a.publishDate);
      return isNaN(dateA.getTime()) ? 0 : -1;
    }
    if (!a.publishDate && b.publishDate) {
      const dateB = new Date(b.publishDate);
      return isNaN(dateB.getTime()) ? 0 : 1;
    }
    return 0;
  });
  const hasValidDates = sorted.some(s => {
    if (!s.publishDate) return false;
    const date = new Date(s.publishDate);
    return !isNaN(date.getTime());
  });
  if (!hasValidDates) {
    return featured[featured.length - 1];
  }
  return sorted[0];
}

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find(s => s.id === id);
}
`;

async function clearEpisodes() {
  try {
    console.log('🗑️  Clearing all episodes from GitHub...\n');
    
    const octokit = new Octokit({ auth: token });
    
    // Get current file SHA
    const { data: currentFile } = await octokit.repos.getContent({
      owner,
      repo,
      path: 'data/scenarios.ts',
    });

    if (!('sha' in currentFile)) {
      throw new Error('Could not get file SHA');
    }

    console.log('✅ Got current file SHA');
    
    // Update file on GitHub
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: 'data/scenarios.ts',
      message: 'Clear all episodes - ready for clean re-add',
      content: Buffer.from(emptyContent).toString('base64'),
      sha: currentFile.sha,
    });

    console.log('✅ Successfully cleared all episodes from GitHub');
    console.log('\n📝 Next steps:');
    console.log('   1. Go to admin portal');
    console.log('   2. Re-add episodes one by one');
    console.log('   3. They will be added with proper escaping');
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

clearEpisodes();
