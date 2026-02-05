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
{ title: 'Psyche', citation: 'Diana Logreira, Psyche (Government).', description: 'Psyche is on its way to begin exploring asteroid Psyche by August 2029. Scientists think the asteroid has a high metal content, and may be the partial core of a planetesimal, a building block of an early planet.  TYPE Orbiter LAUNCHED Oct. 13, 2023 TARGET Asteroid Psyche OBJECTIVE Visit a metal-rich asteroid called Psyche Mission Science Spacecraft What Will Psyche Do?  Psyche is a NASA mission to study a metal-rich asteroid with the same name, located in the main asteroid belt between Mars and Jupiter.  Asteroid Psyche’s gravity will capture the spacecraft in late July 2029, and Psyche will begin its prime mission in August. It will spend about two years orbiting the asteroid to take pictures, map the surface, and collect data to determine Psyche’s composition.   Read More Technicians connected NASA\'s Psyche spacecraft to the payload attach fitting inside the clean room at Astrotech Space Operations facility in Titusville, Florida on Wednesday, Sept. 20, 2023. This hardware allows Psyche to connect to the top of the rocket once secured inside the protective payload fairings. Psyche will lift off on a SpaceX Falcon Heavy rocket at 10:34 a.m. EDT Thursday, Oct. 5, 2023, from Launch Complex 39A at NASA\'s Kennedy Space Center in Florida. The Psyche spacecraft will travel nearly six years and about 2.2 billion miles (3.6 billion kilometers) to an asteroid of the same name, which is orbiting the Sun between Mars and Jupiter. Scientists believe Psyche could be part of the core of a planetesimal, likely made of iron-nickel metal, which can be studied from orbit to give researchers a better idea of what may make up Earth\'s core. Technicians connect NASA\'s Psyche spacecraft to the payload attach fitting inside the clean room at Astrotech Space Operations facility in Titusville, Florida on Wednesday, Sept. 20, 2023. Credits: NASA/Kim Shiflett Latest Psyche News  ARTICLE 11 MIN READ Black Hole Eats Star: NASA Missions Discover Record-Setting Blast  BLOG 2 MIN READ NASA’s Psyche Mission Tracks Interstellar Comet 3I/ATLAS  ARTICLE 3 MIN READ View Interstellar Comet 3I/ATLAS Through NASA’s Multiple Lenses   ARTICLE 2 MIN READ Timelapse of JPL’s Table Mountain Facility Beaming Laser Beacon to Psyche  KEEP EXPLORING Discover More About Psyche  Psyche Science Psyche is the first mission to explore an asteroid with a surface that contains substantial amounts of metal rather than…  Psyche Raw Images Not long after the Psyche spacecraft launches, the mission team expects to get the first images back from the spacecraft.  Meet the Psyche Team Planning, building, launching, and operating a spacecraft takes lots of people. Meet the Psyche mission team.  Asteroid Psyche  NASA Logo National Aeronautics and Space Administration  NASA explores the unknown in air and space, innovates for the benefit of humanity, and inspires the world through discovery.  About NASA\'s Mission Join Us  Home News & Events Multimedia NASA+ Missions Humans in Space Earth The Solar System The Universe Science Aeronautics Technology Learning Resources About NASA NASA en Español Follow NASA  More NASA Social Accounts NASA Newsletters Sitemap   For Media   Privacy Policy   FOIA   No FEAR Act   Office of the IG   Budget & Annual Reports   Agency Financial Reports   Contact NASA   Accessibility Page Last Updated: Jun 03, 2025   Page Editor: AMANDA BARNETT   Responsible NASA Official for Science: Diana Logreira', type: 'Government', url: 'https://www.nasa.gov/psyche', authors: ['Diana Logreira'] },,
      { title: 'The Psyche spacecraft launched Oct. 13, 2023, on a mission to a unique metal-rich asteroid with the same name.', citation: 'Psyche, The Psyche spacecraft launched Oct. 13, 2023, on a mission to a unique metal-rich asteroid with the same name. (Government, 2029).', type: 'Government', url: 'https://www.nasa.gov/psyche', authors: ['Diana Logreira'] },
      { title: 'The Psyche spacecraft launched Oct. 13, 2023, on a mission to a unique metal-rich asteroid with the same name.', citation: 'Psyche, The Psyche spacecraft launched Oct. 13, 2023, on a mission to a unique metal-rich asteroid with the same name. (Government, 2029).', type: 'Government', url: 'https://www.nasa.gov/psyche', authors: ['Diana Logreira'] },
      { title: 'Psyche', citation: 'Explore, News & Events (Government, 2029).', type: 'Government', url: 'https://science.nasa.gov/mission/psyche/', authors: ['Diana Logreira'] },
      { title: 'Psyche', citation: 'Responsible NASA Official for Science: Diana Logreira, Psyche (Government).', description: 'Psyche is on its way to begin exploring asteroid Psyche by August 2029. Scientists think the asteroid has a high metal content, and may be the partial core of a planetesimal, a building block of an early planet.  TYPE Orbiter LAUNCHED Oct. 13, 2023 TARGET Asteroid Psyche OBJECTIVE Visit a metal-rich asteroid called Psyche Mission Science Spacecraft What Will Psyche Do?  Psyche is a NASA mission to study a metal-rich asteroid with the same name, located in the main asteroid belt between Mars and Jupiter.  Asteroid Psyche’s gravity will capture the spacecraft in late July 2029, and Psyche will begin its prime mission in August. It will spend about two years orbiting the asteroid to take pictures, map the surface, and collect data to determine Psyche’s composition.', type: 'Government', url: 'https://science.nasa.gov/mission/psyche/', authors: ['Responsible NASA Official for Science: Diana Logreira'] },
      { title: 'Psyche', citation: 'Responsible NASA Official for Science: Diana Logreira, Psyche (Government).', description: 'What Will Psyche Do?  Psyche is a NASA mission to study a metal-rich asteroid with the same name, located in the main asteroid belt between Mars and Jupiter.  Asteroid Psyche’s gravity will capture the spacecraft in late July 2029, and Psyche will begin its prime mission in August. It will spend about two years orbiting the asteroid to take pictures, map the surface, and collect data to determine Psyche’s composition.   Read More', type: 'Government', url: 'https://science.nasa.gov/mission/psyche/', authors: ['Responsible NASA Official for Science: Diana Logreira'] }





    ],
  },
];
