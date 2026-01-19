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
    featured: true,
    hero: true, // Featured in hero section
  },
  {
    id: 'money-optional',
    title: 'What If Money Became Optional?',
    premise: 'A new economic system emerges where traditional currency loses its meaning.',
    runtime: '22:15',
    youtubeUrl: 'https://www.youtube.com/watch?v=example2',
    featured: true,
  },
  {
    id: 'ai-leaders',
    title: 'What If AI Replaced World Leaders?',
    premise: 'Artificial intelligence systems take over governance, making decisions based on pure logic and data.',
    runtime: '19:30',
    youtubeUrl: 'https://www.youtube.com/watch?v=example3',
    featured: true,
  },
  {
    id: 'undersea-cables',
    title: 'What If Undersea Cables Were Cut?',
    premise: 'The physical infrastructure connecting continents is severed, isolating nations from global communication.',
    runtime: '16:55',
    youtubeUrl: 'https://www.youtube.com/watch?v=example4',
    featured: true,
  },
];

export const featuredScenarios = scenarios.filter(s => s.featured);

// Get hero episode (explicitly marked hero, or most recent featured)
export function getHeroEpisode(): Scenario | null {
  const heroEpisode = scenarios.find(s => s.hero && s.featured);
  if (heroEpisode) return heroEpisode;
  
  // Fallback to most recent featured (first in array, assuming newest first)
  const featured = scenarios.filter(s => s.featured);
  return featured.length > 0 ? featured[0] : null;
}
