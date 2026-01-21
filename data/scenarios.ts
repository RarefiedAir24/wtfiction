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
    premise: 'America’s offshore oil infrastructure powers millions of homes, fuels global markets, and underpins national energy security's offshore oil infrastructure powers millions of homes, fuels global markets, and underpins national energy security',
    runtime: '07:21',
    youtubeUrl: 'https://youtu.be/i8vIIkaU4wI',
    thumbnailUrl: 'https://i.ytimg.com/vi/i8vIIkaU4wI/maxresdefault.jpg',
    publishDate: '2025-12-17',
    featured: true,
  },
  {
    id: '8ytNzzit528',
    title: 'Heat Age vs Ice Age: Which Future Are We In?',
    premise: 'The last Ice Age nearly wiped out humanity.

But what if the next global age isn’t ice?

What if it’s heat?

In this episode of WTFiction, we explore a grounded, science-based what-if scenario:

What't ice? What if it\'s heat? In this episode of WTFiction, we explore a grounded, science-based what-if scenario.',
    runtime: '04:12',
    youtubeUrl: 'https://youtu.be/8ytNzzit528',
    thumbnailUrl: 'https://i.ytimg.com/vi/8ytNzzit528/maxresdefault.jpg',
    publishDate: '2025-12-18',
    featured: true,
  },
  {
    id: 'sPklz6qf1h0',
    title: 'What If AI Was Elected to Run a Country? #viralvideo',
    premise: 'What if replacing world leaders with AI wasn’t a choice — but the end result of efficiency't a choice — but the end result of efficiency',
    runtime: '07:43',
    youtubeUrl: 'https://youtu.be/sPklz6qf1h0',
    thumbnailUrl: 'https://i.ytimg.com/vi/sPklz6qf1h0/maxresdefault.jpg',
    publishDate: '2025-12-30',
    featured: true,
  },
  {
    id: 'EwIQB4sBx4I',
    title: 'The Internet\'s Biggest Vulnerability Is Underwater's Biggest Vulnerability Is Underwater's Biggest Vulnerability Is Underwater's Biggest Vulnerability Is Underwater',
    premise: '🤔 What if the very systems we rely on are the ones we barely think about',
    runtime: '07:28',
    youtubeUrl: 'https://youtu.be/EwIQB4sBx4I',
    thumbnailUrl: 'https://i.ytimg.com/vi/EwIQB4sBx4I/maxresdefault.jpg',
    publishDate: '2026-01-08',
    featured: true,
  },
  {
    id: 'qBl6FCVTA8E',
    title: 'What If Survival Wasn’t the Reason We Work?'t the Reason We Work?',
    premise: 'For most of human history, survival has been the reason we work',
    runtime: '05:17',
    youtubeUrl: 'https://youtu.be/qBl6FCVTA8E',
    thumbnailUrl: 'https://i.ytimg.com/vi/qBl6FCVTA8E/hqdefault.jpg',
    publishDate: '2026-01-18',
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
