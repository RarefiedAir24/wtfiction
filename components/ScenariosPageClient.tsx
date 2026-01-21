'use client';

import { useState } from 'react';
import Link from 'next/link';
import { scenarios } from '@/data/scenarios';
import YouTubeModal from '@/components/YouTubeModal';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import PlayButton from '@/components/PlayButton';
import TrackedExternalLink from '@/components/TrackedExternalLink';
import { getYouTubeThumbnail, getYouTubeVideoId } from '@/lib/youtube';
import { trackScenarioClick, trackVideoModalOpen } from '@/lib/analytics';

export default function ScenariosPageClient() {
  const [modalVideo, setModalVideo] = useState<{ url: string; title: string; logline?: string; id?: string } | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [highlightedScenarioId, setHighlightedScenarioId] = useState<string | null>(null);
  
  // Sort scenarios newest to oldest
  const sortedScenarios = [...scenarios].sort((a, b) => {
    if (a.publishDate && b.publishDate) {
      return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
    }
    return 0;
  });
  
  // Get the latest scenario (first in sorted array)
  const latestScenario = sortedScenarios[0];

  const handlePlayClick = (scenario: typeof scenarios[0]) => {
    setScrollPosition(window.scrollY); // Save scroll position for post-watch UX
    trackScenarioClick(scenario.id, scenario.title);
    const videoId = getYouTubeVideoId(scenario.youtubeUrl);
    if (videoId) {
      trackVideoModalOpen(videoId, 'scenarios', 'scenario_card');
    }
    setModalVideo({ 
      url: scenario.youtubeUrl, 
      title: scenario.title,
      logline: scenario.premise,
      id: scenario.id // Pass ID for post-watch UX
    });
  };

  const handleModalClose = () => {
    setModalVideo(null);

    // Restore scroll position
    window.scrollTo({
      top: scrollPosition,
      behavior: 'instant' as ScrollBehavior
    });

    // Find and highlight next scenario
    if (modalVideo?.id) {
      const currentIndex = sortedScenarios.findIndex(s => s.id === modalVideo.id);
      if (currentIndex >= 0 && currentIndex < sortedScenarios.length - 1) {
        const nextScenario = sortedScenarios[currentIndex + 1];
        setHighlightedScenarioId(nextScenario.id);

        // Scroll to next scenario smoothly
        setTimeout(() => {
          const element = document.getElementById(`scenario-${nextScenario.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);

        // Remove highlight after 5 seconds
        setTimeout(() => setHighlightedScenarioId(null), 5000);
      }
    }
  };

  // Get best thumbnail URL with fallbacks
  const getThumbnailUrl = (scenario: typeof scenarios[0]) => {
    // Priority: custom thumbnail > maxres > high > branded placeholder
    if (scenario.thumbnailUrl) {
      return scenario.thumbnailUrl;
    }
    const videoId = getYouTubeVideoId(scenario.youtubeUrl);
    if (videoId) {
      // Try maxres first, then high as fallback
      return getYouTubeThumbnail(scenario.youtubeUrl, 'maxres');
    }
    return null;
  };

  const isLatestScenario = (scenario: typeof scenarios[0]) => {
    return scenario.id === latestScenario?.id;
  };

  return (
    <>
      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-light mb-2 text-foreground">
              Scenarios
            </h1>
            <p className="text-sm text-muted">
              Listed newest to oldest
            </p>
          </div>
          <div className="space-y-10">
            {sortedScenarios.map((scenario, index) => {
              const isLatest = isLatestScenario(scenario);
              const thumbnailUrl = getThumbnailUrl(scenario);
              
              return (
                <article
                  key={scenario.id}
                  id={`scenario-${scenario.id}`}
                  className={`border-b border-[#272727] pb-10 last:border-b-0 transition-all duration-300 ${
                    highlightedScenarioId === scenario.id 
                      ? 'ring-4 ring-[#3ea6ff] ring-opacity-30 ring-offset-4 ring-offset-[#0f0f0f] -m-4 p-4 rounded-lg' 
                      : ''
                  } ${
                    isLatest ? 'border-l-2 border-l-[#3ea6ff] pl-6 -ml-6' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Thumbnail - Phase 1: Visual Consistency + Phase 2: Editorial Hierarchy */}
                    <div className={`flex-shrink-0 w-full md:w-80 relative group ${
                      isLatest ? 'md:w-96' : ''
                    }`}>
                      <EpisodeThumbnail
                        thumbnailUrl={thumbnailUrl || getYouTubeThumbnail(scenario.youtubeUrl, 'high')}
                        title={scenario.title}
                        runtime={scenario.runtime}
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <PlayButton onClick={() => handlePlayClick(scenario)} size="md" />
                      </div>
                      {isLatest && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#3ea6ff]/90 text-white text-xs font-medium rounded backdrop-blur-sm">
                          Latest Scenario
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <Link href={`/scenarios/${scenario.id}`}>
                          <h2 className={`font-medium mb-4 text-foreground leading-snug hover:text-[#3ea6ff] transition-colors ${
                            isLatest ? 'text-xl md:text-2xl lg:text-3xl' : 'text-xl md:text-2xl'
                          }`}>
                            {scenario.title}
                          </h2>
                        </Link>
                      </div>
                      <p className="text-sm md:text-base text-muted leading-relaxed mb-4">
                        {scenario.premise}
                      </p>
                      {scenario.keyInsight && (
                        <p className="text-xs text-muted/80 mb-4 leading-normal italic">
                          {scenario.keyInsight}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted mb-6">
                        {scenario.runtime && (
                          <span>Runtime: {scenario.runtime}</span>
                        )}
                        {scenario.publishDate && (
                          <span>{scenario.publishDate}</span>
                        )}
                      </div>
                      
                      {/* Phase 3: Action Clarity - Primary vs Secondary */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handlePlayClick(scenario)}
                          className="btn-primary text-sm px-5 py-2.5 inline-flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Watch Episode
                        </button>
                        <TrackedExternalLink
                          href={scenario.youtubeUrl}
                          eventType="youtube"
                          className="text-sm text-muted hover:text-foreground transition-colors"
                        >
                          Watch on YouTube
                        </TrackedExternalLink>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      {modalVideo && (
        <YouTubeModal
          videoUrl={modalVideo.url}
          title={modalVideo.title}
          logline={modalVideo.logline}
          isOpen={!!modalVideo}
          onClose={handleModalClose}
          page="scenarios"
          placement="scenario_card"
        />
      )}
    </>
  );
}
