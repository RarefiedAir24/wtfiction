export interface Citation {
  title?: string; // Main title of the reference
  description?: string; // Contextual description
  citation?: string; // How to cite: "Author, Title (Type, Year). Additional info."
  type?: 'Academic' | 'Government' | 'Research' | 'Reporting' | 'Data' | 'Policy';
  url?: string;
  // Legacy support - will be converted to new format
  text?: string;
}

export interface Reference {
  episodeId: string;
  episodeTitle: string;
  publishDate?: string;
  citations: Citation[];
}

export const references: Reference[] = [
  {
    episodeId: 'EwIQB4sBx4I',
    episodeTitle: 'The Internet\'s Biggest Vulnerability Is Underwater',
    publishDate: '2026-01-08',
    citations: [],
  },
  {
    episodeId: '8ytNzzit528',
    episodeTitle: 'Heat Age vs Ice Age: Which Future Are We In?',
    publishDate: '2025-12-18',
    citations: [],
  },
  {
    episodeId: 'sPklz6qf1h0',
    episodeTitle: 'What If AI Was Elected to Run a Country? #viralvideo',
    publishDate: '2025-12-30',
    citations: [],
  },
  {
    episodeId: 'qBl6FCVTA8E',
    episodeTitle: 'What If Survival Wasn\'t the Reason We Work?',
    publishDate: '2026-01-18',
    citations: [],
  },
  {
    episodeId: 'i8vIIkaU4wI',
    episodeTitle: 'What If Venezuela Attacked U.S. Oil Platforms? #video',
    publishDate: '2025-12-17',
    citations: [],
  },
];
