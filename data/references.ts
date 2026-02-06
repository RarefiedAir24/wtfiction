export interface Citation {
  title?: string; // Main title of the reference
  description?: string; // Contextual description
  citation?: string; // How to cite: "Author, Title (Type, Year). Additional info."
  type?: 'Academic' | 'Government' | 'Research' | 'Reporting' | 'Data' | 'Policy';
  url?: string;
  authors?: string[]; // Author names (manually entered or auto-scraped)
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
    episodeId: '5S8FsczZ06o',
    episodeTitle: 'Black Holes Don\'t Destroy What You Think They Do',
    publishDate: '2026-01-25',
    citations: [
      {
        title: 'Nobel Prize in Physics 2020',
        citation: 'term., Nobel Prize in Physics 2020.',
        description: 'The Nobel Prize in Physics 2020 was divided, one half awarded to Roger Penrose "for the discovery that black hole formation is a robust prediction of the general theory of relativity", the other half jointly to Reinhard Genzel and Andrea Ghez "for the discovery of a supermassive compact object at the centre of our galaxy"',
        url: 'https://www.nobelprize.org/prizes/physics/2020/penrose/lecture'
      },
      {
        title: 'Types - NASA Science',
        citation: 'Rank Math PRO - https://rankmath.com/ -->, Types - NASA Science (Government, 2020).',
        description: 'Astronomers generally divide black holes into three categories according to their mass: stellar-mass, supermassive, and intermediate-mass. The mass ranges',
        type: 'Government',
        url: 'https://science.nasa.gov/universe/black-holes/types'
      }
    ],
  },
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
      {
        title: 'News - Alaska Permanent Fund Corporation',
        citation: 'Alaska Permanent Fund Corporation, News - Alaska Permanent Fund Corporation (Reporting, 2022).',
        description: 'FUND NEWS Alaska Celebrates the Fund\'s First 50 Years, Prepares for the Next 50 Years January 14, 2026 Established by Alaskans for Alaskans Fifty years ago, in 1976, Alaskan voters amended the state constitution to set aside a portion of the state\'s revenues from oil and minerals to establish the Alaska Permanent Fund to benefit future generations of Alaskans. "The ...',
        type: 'Reporting',
        url: 'https://apfc.org/news/'
      }
    ],
  },
  {
    episodeId: 'i8vIIkaU4wI',
    episodeTitle: 'What If Venezuela Attacked U.S. Oil Platforms? #video',
    publishDate: '2025-12-17',
    citations: [],
  },
  {
    episodeId: 'viqYokNifr0',
    episodeTitle: 'The Day Gold Becomes Worthless',
    publishDate: '2026-02-01',
    citations: [
      { title: 'The Psyche spacecraft launched Oct. 13, 2023, on a mission to a unique metal-rich asteroid with the same name.', citation: 'Psyche, The Psyche spacecraft launched Oct. 13, 2023, on a mission to a unique metal-rich asteroid with the same name. (Government, 2029).', type: 'Government', url: 'https://www.nasa.gov/psyche', authors: ['Diana Logreira'] },
      { title: 'Psyche', citation: 'Responsible NASA Official for Science: Diana Logreira, Psyche (Government).', description: 'What Will Psyche Do?  Psyche is a NASA mission to study a metal-rich asteroid with the same name, located in the main asteroid belt between Mars and Jupiter.  Asteroid Psyche’s gravity will capture the spacecraft in late July 2029, and Psyche will begin its prime mission in August. It will spend about two years orbiting the asteroid to take pictures, map the surface, and collect data to determine Psyche’s composition.   Read More', type: 'Government', url: 'https://science.nasa.gov/mission/psyche/', authors: ['Responsible NASA Official for Science: Diana Logreira'] }
    ],
  },
];
