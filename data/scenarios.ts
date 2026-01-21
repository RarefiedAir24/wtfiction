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
  hero?: boolean;
  category?: string;
}

export const scenarios: Scenario[] = [
    {
    id: 'i8vIIkaU4wI',
    title: 'What If Venezuela Attacked U.S. Oil Platforms? #video',
    premise: 'America’s offshore oil infrastructure powers millions of homes, fuels global markets, and underpins national energy security',
    runtime: '07:21',
    youtubeUrl: 'https://youtu.be/i8vIIkaU4wI',
    thumbnailUrl: 'https://i.ytimg.com/vi/i8vIIkaU4wI/maxresdefault.jpg',
    publishDate: '2025-12-17',
    featured: true,
  },
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
