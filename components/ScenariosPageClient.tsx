'use client';

import { useState } from 'react';
import Link from 'next/link';
import { scenarios } from '@/data/scenarios';
import YouTubeModal from '@/components/YouTubeModal';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import PlayButton from '@/components/PlayButton';
import TrackedExternalLink from '@/components/TrackedExternalLink';
import PostWatchContinuation from '@/components/PostWatchContinuation';
import { getYouTubeThumbnail, getYouTubeVideoId } from '@/lib/youtube';
import { trackScenarioClick, trackVideoModalOpen } from '@/lib/analytics';

export default function ScenariosPageClient() {
  const [modalVideo, setModalVideo] = useState<{ url: string; title: string; logline?: string; id?: string } | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [highlightedScenarioId, setHighlightedScenarioId] = useState<string | null>(null);
  const [showPostWatch, setShowPostWatch] = useState<string | null>(null);
  
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
    const currentVideoId = modalVideo?.id;
    setModalVideo(null);

    // Show post-watch continuation UI
    if (currentVideoId) {
      setShowPostWatch(currentVideoId);
    }

    // Restore scroll position
    window.scrollTo({
      top: scrollPosition,
      behavior: 'instant' as ScrollBehavior
    });

    // Find and highlight next scenario
    if (currentVideoId) {
      const currentIndex = sortedScenarios.findIndex(s => s.id === currentVideoId);
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
          <div className="space-y-0">
            {sortedScenarios.map((scenario, index) => {
              const isLatest = isLatestScenario(scenario);
              const thumbnailUrl = getThumbnailUrl(scenario);
              const isEven = index % 2 === 0;
              
              return (
                <article
                  key={scenario.id}
                  id={`scenario-${scenario.id}`}
                  className={`border-b border-[#272727] py-10 transition-all duration-300 ${
                    highlightedScenarioId === scenario.id 
                      ? 'ring-4 ring-[#3ea6ff] ring-opacity-30 ring-offset-4 ring-offset-[#0f0f0f] -m-4 p-4 rounded-lg' 
                      : ''
                  } ${
                    isEven ? 'bg-[#0a0a0a]/30' : 'bg-transparent'
                  } ${
                    isLatest ? 'border-l-4 border-l-[#3ea6ff] pl-8 -ml-8 bg-[#0a0a0a]/50' : ''
                  }`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Thumbnail - Enhanced for latest episode */}
                    <div className={`flex-shrink-0 w-full md:w-80 relative group transition-all duration-300 ${
                      isLatest ? 'md:w-96 scale-105 md:scale-100' : ''
                    }`}>
                      <div className={`relative ${isLatest ? 'ring-2 ring-[#3ea6ff]/50 rounded-lg overflow-hidden' : ''}`}>
                        <EpisodeThumbnail
                          thumbnailUrl={thumbnailUrl || getYouTubeThumbnail(scenario.youtubeUrl, 'high')}
                          title={scenario.title}
                          runtime={scenario.runtime}
                        />
                        {/* Gradient overlay for better text contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <PlayButton onClick={() => handlePlayClick(scenario)} size={isLatest ? "lg" : "md"} />
                        </div>
                        {isLatest && (
                          <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-[#3ea6ff] to-[#2d8fdd] text-white text-xs font-bold rounded-md backdrop-blur-sm shadow-lg uppercase tracking-wide">
                            Latest
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <Link href={`/scenarios/${scenario.id}`}>
                          <h2 className={`font-bold mb-4 text-foreground leading-snug hover:text-[#3ea6ff] transition-colors ${
                            isLatest ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-xl md:text-2xl'
                          }`} style={{ fontFamily: isLatest ? 'var(--font-title), system-ui, sans-serif' : 'inherit' }}>
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
                      <div className="flex items-center gap-4 text-xs text-muted/80 mb-6">
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

      {/* Post-Watch Continuation UI */}
      <PostWatchContinuation 
        scenarioId={showPostWatch || undefined}
        onDismiss={() => setShowPostWatch(null)}
      />
    </>
  );
}
