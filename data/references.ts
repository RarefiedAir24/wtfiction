export interface Reference {
  episodeId: string;
  episodeTitle: string;
  citations: string[];
}

export const references: Reference[] = [
  {
    episodeId: 'undersea-cables',
    episodeTitle: 'What If Undersea Cables Were Cut?',
    citations: [
      'International Telecommunication Union (ITU)',
      'Submarine Cable Map (TeleGeography)',
      'NATO maritime security reports',
      'Academic papers on network resilience',
    ],
  },
  {
    episodeId: 'internet-blackout',
    episodeTitle: 'What If the Internet Went Dark for a Week?',
    citations: [
      'ICANN root server infrastructure documentation',
      'BGP routing protocol analysis',
      'Critical infrastructure protection studies',
      'Cybersecurity threat assessments',
    ],
  },
  {
    episodeId: 'money-optional',
    episodeTitle: 'What If Money Became Optional?',
    citations: [
      'Economic history of alternative currencies',
      'Blockchain and cryptocurrency research',
      'Post-scarcity economic models',
      'Behavioral economics studies',
    ],
  },
  {
    episodeId: 'ai-leaders',
    episodeTitle: 'What If AI Replaced World Leaders?',
    citations: [
      'AI governance frameworks',
      'Decision-making algorithm research',
      'Political science and automation studies',
      'Ethics in artificial intelligence',
    ],
  },
];
