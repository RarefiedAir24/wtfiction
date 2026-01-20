export interface Scenario {
  id: string;
  title: string;
  premise: string;
  runtime?: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  publishDate?: string;
  keyInsight?: string;
  featured?: boolean;
  hero?: boolean; // Featured in hero section
}

export const scenarios: Scenario[] = [
  {
    id: 'internet-blackout',
    title: 'What If the Internet Went Dark for a Week?',
    premise: 'A coordinated attack on global internet infrastructure tests the resilience of modern civilization.',
    runtime: '18:42',
    youtubeUrl: 'https://www.youtube.com/watch?v=example1',
    publishDate: '2024-01-15',
    featured: true,
  },
    {
    id: 'money-optional',
    title: 'What If Survival Wasn’t the Reason We Work?',
    premise: 'For most of human history, survival has been the reason we work',
    runtime: '05:17',
    youtubeUrl: 'https://youtu.be/qBl6FCVTA8E',
    thumbnailUrl: 'https://i.ytimg.com/vi/qBl6FCVTA8E/hqdefault.jpg',
    publishDate: '2026-01-18',
    featured: true,
  },
  {
    id: 'ai-leaders',
    title: 'What If AI Replaced World Leaders?',
    premise: 'Artificial intelligence systems take over governance, making decisions based on pure logic and data.',
    runtime: '19:30',
    youtubeUrl: 'https://youtu.be/sPklz6qf1h0',
    publishDate: '2024-03-10',
    featured: true,
  },
  {
    id: 'survival-guaranteed',
    title: 'What If Survival Wasn't the Reason We Work?',
    premise: 'For most of human history, survival has been the reason we work',
    runtime: '05:17', // Update with actual runtime from video
    youtubeUrl: 'https://www.youtube.com/watch?v=qBl6FCVTA8E',
    thumbnailUrl: 'https://i.ytimg.com/vi/qBl6FCVTA8E/hqdefault.jpg',
    publishDate: '2026-01-18', // Update with actual publish date from YouTube
    featured: true,
  },
];

export const featuredScenarios = scenarios.filter(s => s.featured);

// Get hero episode (most recent by publishDate, or last in array if no dates)
export function getHeroEpisode(): Scenario | null {
  const featured = scenarios.filter(s => s.featured);
  if (featured.length === 0) return null;
  
  // Sort by publishDate (most recent first)
  const sorted = [...featured].sort((a, b) => {
    // If both have publishDate, sort by date (newest first)
    if (a.publishDate && b.publishDate) {
      const dateA = new Date(a.publishDate);
      const dateB = new Date(b.publishDate);
      // Check if dates are valid
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        // If dates are invalid, maintain original order
        return 0;
      }
      return dateB.getTime() - dateA.getTime();
    }
    // If only one has publishDate, prioritize it
    if (a.publishDate && !b.publishDate) {
      const dateA = new Date(a.publishDate);
      return isNaN(dateA.getTime()) ? 0 : -1;
    }
    if (!a.publishDate && b.publishDate) {
      const dateB = new Date(b.publishDate);
      return isNaN(dateB.getTime()) ? 0 : 1;
    }
    // If neither has publishDate, assume array order is chronological (oldest to newest)
    // So we want the last item in the original array
    return 0;
  });
  
  // If no valid publishDates, return last item in original array (assumed to be most recent)
  const hasValidDates = sorted.some(s => {
    if (!s.publishDate) return false;
    const date = new Date(s.publishDate);
    return !isNaN(date.getTime());
  });
  
  if (!hasValidDates) {
    // Return last item in original array (assumed to be most recent)
    return featured[featured.length - 1];
  }
  
  // Return most recent (first in sorted array)
  return sorted[0];
}
