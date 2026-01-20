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
  const [modalVideo, setModalVideo] = useState<{ url: string; title: string; logline?: string } | null>(null);
  const sortedScenarios = [...scenarios].reverse();

  const handlePlayClick = (scenario: typeof scenarios[0]) => {
    trackScenarioClick(scenario.id, scenario.title);
    const videoId = getYouTubeVideoId(scenario.youtubeUrl);
    if (videoId) {
      trackVideoModalOpen(videoId, 'scenarios', 'scenario_card');
    }
    setModalVideo({ 
      url: scenario.youtubeUrl, 
      title: scenario.title,
      logline: scenario.premise
    });
  };

  return (
    <>
      <main className="min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          <h1 className="text-3xl md:text-4xl font-light mb-12 text-foreground">
            Scenarios
          </h1>
          <div className="space-y-10">
            {sortedScenarios.map((scenario) => (
              <article
                key={scenario.id}
                className="border-b border-[#272727] pb-10 last:border-b-0"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 w-full md:w-80 relative group">
                    <EpisodeThumbnail
                      thumbnailUrl={scenario.thumbnailUrl || getYouTubeThumbnail(scenario.youtubeUrl)}
                      title={scenario.title}
                      runtime={scenario.runtime}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <PlayButton onClick={() => handlePlayClick(scenario)} size="md" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <Link href={`/scenarios/${scenario.id}`}>
                      <h2 className="text-xl md:text-2xl font-medium mb-4 text-foreground leading-snug hover:text-[#3ea6ff] transition-colors">
                        {scenario.title}
                      </h2>
                    </Link>
                    <p className="text-sm md:text-base text-muted leading-relaxed mb-4">
                      {scenario.premise}
                    </p>
                    {scenario.keyInsight && (
                      <p className="text-xs text-muted/80 mb-4 leading-normal italic">
                        {scenario.keyInsight}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted mb-4">
                      {scenario.runtime && (
                        <span>Runtime: {scenario.runtime}</span>
                      )}
                      {scenario.publishDate && (
                        <span>{scenario.publishDate}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePlayClick(scenario)}
                        className="text-sm text-foreground hover:opacity-80 transition-opacity font-medium"
                      >
                        Watch Episode
                      </button>
                      <span className="text-muted/50">•</span>
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
            ))}
          </div>
        </div>
      </main>

      {modalVideo && (
        <YouTubeModal
          videoUrl={modalVideo.url}
          title={modalVideo.title}
          logline={modalVideo.logline}
          isOpen={!!modalVideo}
          onClose={() => setModalVideo(null)}
          page="scenarios"
          placement="scenario_card"
        />
      )}
    </>
  );
}
