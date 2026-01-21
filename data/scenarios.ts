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
