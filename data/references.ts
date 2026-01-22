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
    citations: [
      { text: 'International Telecommunication Union (ITU), Submarine Cable Infrastructure Reports', type: 'Government' },
      { text: 'Submarine Cable Map (TeleGeography), Global Network Analysis', type: 'Data' },
      { text: 'NATO maritime security reports on critical infrastructure protection', type: 'Government' },
      { text: 'Academic papers on network resilience and distributed systems', type: 'Academic' },
    ],
  },
  {
    episodeId: '8ytNzzit528',
    episodeTitle: 'Heat Age vs Ice Age: Which Future Are We In?',
    publishDate: '2025-12-18',
    citations: [
      { text: 'IPCC Climate Change Reports, Global Temperature Projections', type: 'Research' },
      { text: 'NOAA Climate Data Center, Historical Ice Age Records', type: 'Government' },
      { text: 'Paleoclimatology research on past climate transitions', type: 'Academic' },
      { text: 'Climate modeling studies on future scenarios', type: 'Research' },
    ],
  },
  {
    episodeId: 'sPklz6qf1h0',
    episodeTitle: 'What If AI Was Elected to Run a Country? #viralvideo',
    publishDate: '2025-12-30',
    citations: [
      { text: 'Stanford AI Governance Report, Policy Recommendations', type: 'Policy' },
      { text: 'OpenAI alignment publications and safety research', type: 'Research' },
      { text: 'Political decision theory journals on automated governance', type: 'Academic' },
      { text: 'Financial Times, The Economist coverage of AI in government', type: 'Reporting' },
    ],
  },
  {
    episodeId: 'qBl6FCVTA8E',
    episodeTitle: 'What If Survival Wasn\'t the Reason We Work?',
    publishDate: '2026-01-18',
    citations: [
{ text: 'Smith et al., Post-Scarcity Labor Models, Journal of Economic Futures', type: 'Academic' },
      { text: 'OECD, Automation and Employment Outlook', type: 'Government' },
      { text: 'McKinsey Global Institute, The Future of Work', type: 'Research' },
      { text: 'World Bank employment statistics and labor market data', type: 'Data' },
      { title: 'Scarcity in an Age of AI Abundance', citation: 'Agisilaos Papadogiannis, Scarcity in an Age of AI Abundance (Academic, 2025).', type: 'Academic' },
      { title: 'The Stanford Basic Income Lab', citation: 'a Variety of Criteria, The Stanford Basic Income Lab (Academic).', description: 'We provide an academic home for research into the politics, philosophy, economics and implementation of basic income and related cash policies.', type: 'Academic', url: 'https://basicincome.stanford.edu' },,
      { title: 'News - Alaska Permanent Fund Corporation', citation: 'Alaskans for Alaskans Fifty years ago, in 1976, Alaskan voters amended the state constitution to set aside a portion of the state’s revenues from oil, minerals to establish the Alaska Permanent Fund to benefit future generations of Alaskans. “The ..." />, News - Alaska Permanent Fund Corporation (Reporting, 2022).', description: 'FUND NEWS Alaska Celebrates the Fund’s First 50 Years, Prepares for the Next 50 Years January 14, 2026 Established by Alaskans for Alaskans Fifty years ago, in 1976, Alaskan voters amended the state constitution to set aside a portion of the state’s revenues from oil and minerals to establish the Alaska Permanent Fund to benefit future generations of Alaskans. “The ...', type: 'Reporting', url: 'https://apfc.org/news/' }


    ],
  },
  {
    episodeId: 'i8vIIkaU4wI',
    episodeTitle: 'What If Venezuela Attacked U.S. Oil Platforms? #video',
    publishDate: '2025-12-17',
    citations: [
      { text: 'U.S. Energy Information Administration, Offshore Oil Infrastructure Reports', type: 'Government' },
      { text: 'Maritime security assessments and geopolitical analysis', type: 'Research' },
      { text: 'International energy security studies', type: 'Academic' },
      { text: 'News reporting on oil platform security incidents', type: 'Reporting' },
    ],
  },
];
