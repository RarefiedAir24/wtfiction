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
    citations: [
      { title: 'News - Alaska Permanent Fund Corporation', citation: 'Alaskans for Alaskans Fifty years ago, in 1976, Alaskan voters amended the state constitution to set aside a portion of the state’s revenues from oil, minerals to establish the Alaska Permanent Fund to benefit future generations of Alaskans. “The ..." />, News - Alaska Permanent Fund Corporation (Reporting, 2022).', description: 'FUND NEWS Alaska Celebrates the Fund’s First 50 Years, Prepares for the Next 50 Years January 14, 2026 Established by Alaskans for Alaskans Fifty years ago, in 1976, Alaskan voters amended the state constitution to set aside a portion of the state’s revenues from oil and minerals to establish the Alaska Permanent Fund to benefit future generations of Alaskans. “The ...', type: 'Reporting', url: 'https://apfc.org/news/' }
],
  },
  {
    episodeId: 'i8vIIkaU4wI',
    episodeTitle: 'What If Venezuela Attacked U.S. Oil Platforms? #video',
    publishDate: '2025-12-17',
    citations: [],
  },
];
