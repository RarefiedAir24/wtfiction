/**
 * Scenarios Manager - Treats episodes as structured records
 * Parses, modifies, and regenerates the scenarios.ts file
 * Same as admin portal to ensure consistency
 */

export interface Episode {
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

/**
 * Parse episodes from scenarios.ts file content
 * Returns array of episode records
 */
export function parseEpisodes(fileContent: string): Episode[] {
  const episodes: Episode[] = [];
  
  // Find the scenarios array
  const arrayStartMatch = fileContent.match(/export\s+const\s+scenarios\s*:\s*Scenario\[\]\s*=\s*\[|export\s+const\s+scenarios\s*=\s*\[/);
  if (!arrayStartMatch) {
    throw new Error('Could not find scenarios array');
  }
  
  const arrayStart = arrayStartMatch.index! + arrayStartMatch[0].length;
  
  // Find array end
  let bracketDepth = 1;
  let arrayEnd = -1;
  for (let i = arrayStart; i < fileContent.length; i++) {
    if (fileContent[i] === '[') bracketDepth++;
    if (fileContent[i] === ']') {
      bracketDepth--;
      if (bracketDepth === 0) {
        arrayEnd = i;
        break;
      }
    }
  }
  
  if (arrayEnd === -1) {
    throw new Error('Could not find end of scenarios array');
  }
  
  const arrayContent = fileContent.substring(arrayStart, arrayEnd);
  
  // Extract each episode object using a more robust approach
  // Find all episode IDs first to get boundaries
  const idMatches: Array<{ id: string; position: number }> = [];
  const idRegex = /id\s*:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = idRegex.exec(arrayContent)) !== null) {
    idMatches.push({
      id: match[1],
      position: match.index,
    });
  }
  
  // Parse each episode
  for (let i = 0; i < idMatches.length; i++) {
    const idMatch = idMatches[i];
    const nextMatch = idMatches[i + 1];
    
    // Find episode boundaries
    let episodeStart = -1;
    for (let j = idMatch.position; j >= 0; j--) {
      if (arrayContent[j] === '{') {
        episodeStart = j;
        break;
      }
    }
    
    if (episodeStart === -1) continue;
    
    // Find episode end - use next episode or array end
    let episodeEnd = -1;
    const searchStart = episodeStart + 1;
    const searchEnd = nextMatch ? nextMatch.position : arrayContent.length;
    
    let braceDepth = 1;
    for (let j = searchStart; j < searchEnd; j++) {
      if (arrayContent[j] === '{') braceDepth++;
      if (arrayContent[j] === '}') {
        braceDepth--;
        if (braceDepth === 0) {
          episodeEnd = j + 1;
          break;
        }
      }
    }
    
    if (episodeEnd === -1) continue;
    
    const episodeBlock = arrayContent.substring(episodeStart, episodeEnd);
    
    // Parse episode fields (handle corrupted strings by being flexible)
    const episode: Partial<Episode> = {};
    
    // Extract ID
    const idMatch2 = episodeBlock.match(/id\s*:\s*['"]([^'"]+)['"]/);
    if (idMatch2) episode.id = idMatch2[1];
    
    // Extract title - handle escaped apostrophes properly
    const titlePattern = /title\s*:\s*['"]/;
    const titleMatch = episodeBlock.match(titlePattern);
    if (titleMatch) {
      const startPos = titleMatch.index! + titleMatch[0].length;
      const quoteChar = episodeBlock[startPos - 1];
      let title = '';
      let j = startPos;
      
      // Parse until we find an unescaped closing quote
      while (j < episodeBlock.length) {
        if (episodeBlock[j] === '\\' && j + 1 < episodeBlock.length) {
          if (episodeBlock[j + 1] === quoteChar) {
            title += quoteChar;
            j += 2;
          } else if (episodeBlock[j + 1] === '\\') {
            title += '\\';
            j += 2;
          } else {
            title += episodeBlock[j] + episodeBlock[j + 1];
            j += 2;
          }
        } else if (episodeBlock[j] === quoteChar) {
          break;
        } else {
          title += episodeBlock[j];
          j++;
        }
      }
      
      // Clean up title - remove duplicate text if present
      const words = title.split(/\s+/);
      if (words.length > 4) {
        const firstHalf = words.slice(0, Math.floor(words.length / 2)).join(' ');
        const secondHalf = words.slice(Math.floor(words.length / 2)).join(' ');
        if (firstHalf === secondHalf) {
          title = firstHalf;
        }
      }
      episode.title = title;
    }
    
    // Extract premise - handle corrupted strings
    const premisePattern = /premise\s*:\s*['"]/;
    const premiseMatch = episodeBlock.match(premisePattern);
    if (premiseMatch) {
      const startPos = premiseMatch.index! + premiseMatch[0].length;
      const quoteChar = episodeBlock[startPos - 1];
      let premise = '';
      let j = startPos;
      
      // Parse until we find an unescaped closing quote
      while (j < episodeBlock.length) {
        if (episodeBlock[j] === '\\' && j + 1 < episodeBlock.length) {
          if (episodeBlock[j + 1] === quoteChar) {
            premise += quoteChar;
            j += 2;
          } else if (episodeBlock[j + 1] === '\\') {
            premise += '\\';
            j += 2;
          } else if (episodeBlock[j + 1] === 'n') {
            premise += '\n';
            j += 2;
          } else {
            premise += episodeBlock[j] + episodeBlock[j + 1];
            j += 2;
          }
        } else if (episodeBlock[j] === quoteChar) {
          break;
        } else {
          premise += episodeBlock[j];
          j++;
        }
      }
      
      // Clean up premise - remove duplicate text (more aggressive)
      // Check for common corruption patterns
      const originalPremise = premise;
      
      // Pattern 1: Exact duplicate of entire string
      const words = premise.split(/\s+/);
      if (words.length > 10) {
        const midPoint = Math.floor(words.length / 2);
        const firstHalf = words.slice(0, midPoint).join(' ');
        const secondHalf = words.slice(midPoint).join(' ');
        
        // Check if first half equals second half (exact duplicate)
        if (firstHalf === secondHalf) {
          premise = firstHalf;
        } else {
          // Check for partial duplicates at the end
          // Look for repeated phrases at the end
          for (let i = Math.floor(words.length * 0.3); i < words.length; i++) {
            const endPhrase = words.slice(i).join(' ');
            const startPhrase = words.slice(0, words.length - (words.length - i)).join(' ');
            if (endPhrase.length > 20 && startPhrase.includes(endPhrase)) {
              premise = words.slice(0, i).join(' ');
              break;
            }
          }
        }
      }
      
      // Pattern 2: Remove trailing fragments that look like duplicates
      // If premise ends with a short word/phrase that appears earlier, it might be corruption
      const cleanPremise = premise.trim();
      const lastWords = cleanPremise.split(/\s+/).slice(-5).join(' ');
      if (lastWords.length < 50 && cleanPremise.indexOf(lastWords) !== cleanPremise.lastIndexOf(lastWords)) {
        // Last few words appear earlier, likely corruption
        premise = cleanPremise.substring(0, cleanPremise.lastIndexOf(lastWords)).trim();
      }
      
      // Pattern 3: Remove incomplete sentences at the end (ending with "What", "But", etc.)
      const incompleteEndings = ['What', 'But', 'The', 'And', 'Or', 'If'];
      const lastWord = premise.trim().split(/\s+/).pop() || '';
      if (incompleteEndings.includes(lastWord) && premise.length > 100) {
        // Find the last complete sentence
        const sentences = premise.split(/[.!?]\s+/);
        if (sentences.length > 1) {
          premise = sentences.slice(0, -1).join('. ') + '.';
        } else {
          // No sentence endings, find last complete phrase
          const lastPeriod = premise.lastIndexOf('.');
          if (lastPeriod > premise.length * 0.5) {
            premise = premise.substring(0, lastPeriod + 1);
          } else {
            // Remove the incomplete last word
            const words = premise.trim().split(/\s+/);
            if (words.length > 1) {
              premise = words.slice(0, -1).join(' ');
            }
          }
        }
      }
      
      // Pattern 4: Remove corrupted fragments like "What't ice?" or "What if it\\'s"
      // These are clearly corrupted text that should be removed
      premise = premise.replace(/What['"]t\s+ice\?[^.]*/g, '');
      premise = premise.replace(/What\s+if\s+it\\?'s\s+heat\?[^.]*/g, '');
      
      // Pattern 5: If premise ends with "In this episode..." followed by corrupted text,
      // find the last complete sentence before the corruption
      const episodeMatch = premise.match(/In this episode of WTFiction[^.]*scenario[^.]*/i);
      if (episodeMatch) {
        const beforeEpisode = premise.substring(0, episodeMatch.index);
        const afterEpisode = premise.substring(episodeMatch.index! + episodeMatch[0].length);
        // If there's text after "scenario:", it's likely corrupted
        if (afterEpisode.trim().length > 0 && !afterEpisode.match(/^[.!?]/)) {
          premise = beforeEpisode + 'In this episode of WTFiction, we explore a grounded, science-based what-if scenario.';
        } else {
          premise = beforeEpisode + episodeMatch[0];
        }
      }
      
      // Normalize whitespace and newlines
      premise = premise.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
      
      // Final check: if premise ends with incomplete word, remove it
      const finalWords = premise.split(/\s+/);
      if (finalWords.length > 1 && incompleteEndings.includes(finalWords[finalWords.length - 1])) {
        // Check if it's part of a complete phrase
        const lastPhrase = finalWords.slice(-3).join(' ');
        if (!lastPhrase.match(/[.!?]$/) && premise.length > 100) {
          premise = finalWords.slice(0, -1).join(' ');
        }
      }
      
      // Remove any trailing incomplete fragments
      if (premise.endsWith('What') || premise.endsWith('But') || premise.endsWith('The')) {
        const sentences = premise.split(/[.!?]\s+/);
        if (sentences.length > 1) {
          premise = sentences.slice(0, -1).join('. ') + '.';
        } else {
          premise = premise.replace(/\s+(What|But|The)$/, '');
        }
      }
      
      episode.premise = premise.trim();
    }
    
    // Extract other fields
    const runtimeMatch = episodeBlock.match(/runtime\s*:\s*['"]([^'"]+)['"]/);
    if (runtimeMatch) episode.runtime = runtimeMatch[1];
    
    const youtubeMatch = episodeBlock.match(/youtubeUrl\s*:\s*['"]([^'"]+)['"]/);
    if (youtubeMatch) episode.youtubeUrl = youtubeMatch[1];
    
    const thumbnailMatch = episodeBlock.match(/thumbnailUrl\s*:\s*['"]([^'"]+)['"]/);
    if (thumbnailMatch) episode.thumbnailUrl = thumbnailMatch[1];
    
    const publishDateMatch = episodeBlock.match(/publishDate\s*:\s*['"]([^'"]+)['"]/);
    if (publishDateMatch) episode.publishDate = publishDateMatch[1];
    
    const keyInsightMatch = episodeBlock.match(/keyInsight\s*:\s*['"]([^'"]+)['"]/);
    if (keyInsightMatch) episode.keyInsight = keyInsightMatch[1];
    
    const featuredMatch = episodeBlock.match(/featured\s*:\s*(true|false)/);
    if (featuredMatch) episode.featured = featuredMatch[1] === 'true';
    
    const heroMatch = episodeBlock.match(/hero\s*:\s*(true|false)/);
    if (heroMatch) episode.hero = heroMatch[1] === 'true';
    
    const categoryMatch = episodeBlock.match(/category\s*:\s*['"]([^'"]+)['"]/);
    if (categoryMatch) episode.category = categoryMatch[1];
    
    if (episode.id && episode.title && episode.premise && episode.youtubeUrl) {
      episodes.push(episode as Episode);
    }
  }
  
  return episodes;
}

/**
 * Escape string for TypeScript/JavaScript code generation
 */
function escapeStringForCode(str: string): string {
  if (!str) return '';
  
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "\\'")    // Escape single quotes
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\r/g, '\\r')   // Escape carriage returns
    .replace(/\t/g, '\\t');  // Escape tabs
}

/**
 * Generate scenarios.ts file content from episode records
 */
export function generateScenariosFile(episodes: Episode[]): string {
  const header = `export interface Scenario {
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
`;

  const footer = `];

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

  const episodeBlocks = episodes.map(episode => {
    const lines: string[] = ['  {'];
    lines.push(`    id: '${escapeStringForCode(episode.id)}',`);
    lines.push(`    title: '${escapeStringForCode(episode.title)}',`);
    lines.push(`    premise: '${escapeStringForCode(episode.premise)}',`);
    if (episode.runtime) {
      lines.push(`    runtime: '${escapeStringForCode(episode.runtime)}',`);
    }
    lines.push(`    youtubeUrl: '${escapeStringForCode(episode.youtubeUrl)}',`);
    if (episode.thumbnailUrl) {
      lines.push(`    thumbnailUrl: '${escapeStringForCode(episode.thumbnailUrl)}',`);
    }
    if (episode.publishDate) {
      lines.push(`    publishDate: '${escapeStringForCode(episode.publishDate)}',`);
    }
    if (episode.keyInsight) {
      lines.push(`    keyInsight: '${escapeStringForCode(episode.keyInsight)}',`);
    }
    if (episode.featured !== undefined) {
      lines.push(`    featured: ${episode.featured},`);
    }
    if (episode.hero !== undefined) {
      lines.push(`    hero: ${episode.hero},`);
    }
    if (episode.category) {
      lines.push(`    category: '${escapeStringForCode(episode.category)}',`);
    }
    lines.push('  }');
    return lines.join('\n');
  });

  return header + episodeBlocks.join(',\n\n') + '\n' + footer;
}
