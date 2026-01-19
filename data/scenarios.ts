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
    title: 'What If Money Became Optional?',
    premise: 'A new economic system emerges where traditional currency loses its meaning.',
    runtime: '22:15',
    youtubeUrl: 'https://www.youtube.com/watch?v=example2',
    publishDate: '2024-02-20',
    featured: true,
  },
  {
    id: 'ai-leaders',
    title: 'What If AI Replaced World Leaders?',
    premise: 'Artificial intelligence systems take over governance, making decisions based on pure logic and data.',
    runtime: '19:30',
    youtubeUrl: 'https://www.youtube.com/watch?v=example3',
    publishDate: '2024-03-10',
    featured: true,
  },
  {
    id: 'undersea-cables',
    title: 'What If Undersea Cables Were Cut?',
    premise: 'The physical infrastructure connecting continents is severed, isolating nations from global communication.',
    runtime: '16:55',
    youtubeUrl: 'https://www.youtube.com/watch?v=example4',
    publishDate: '2024-04-05', // Most recent
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
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    }
    // If only one has publishDate, prioritize it
    if (a.publishDate && !b.publishDate) return -1;
    if (!a.publishDate && b.publishDate) return 1;
    // If neither has publishDate, assume array order is chronological (oldest to newest)
    // So we want the last item in the original array
    // This is handled by returning 0 and then taking the last item
    return 0;
  });
  
  // If no publishDates, return last item in original array (assumed to be most recent)
  const hasAnyDates = sorted.some(s => s.publishDate);
  if (!hasAnyDates) {
    return featured[featured.length - 1];
  }
  
  // Return most recent (first in sorted array)
  return sorted[0];
}
