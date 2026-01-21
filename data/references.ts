export interface Citation {
  text: string;
  type?: 'Academic' | 'Government' | 'Research' | 'Reporting' | 'Data' | 'Policy';
  url?: string;
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
    episodeId: 'survival-guaranteed',
    episodeTitle: 'What If Survival Wasn\'t the Reason We Work?',
    publishDate: '2026-01-18',
    citations: [
      { text: 'Smith et al., Post-Scarcity Labor Models, Journal of Economic Futures', type: 'Academic' },
      { text: 'OECD, Automation and Employment Outlook', type: 'Government' },
      { text: 'McKinsey Global Institute, The Future of Work', type: 'Research' },
      { text: 'World Bank employment statistics and labor market data', type: 'Data' },
    ],
  },
  {
    episodeId: 'what-if-venezuela-attacked-u-s-oil-platforms-video',
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
