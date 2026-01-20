'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Scenario } from '@/data/scenarios';
import YouTubeModal from '@/components/YouTubeModal';
import TrackedExternalLink from '@/components/TrackedExternalLink';
import { getYouTubeThumbnail, getYouTubeVideoId } from '@/lib/youtube';
import { trackScenarioClick, trackVideoModalOpen } from '@/lib/analytics';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import PlayButton from '@/components/PlayButton';

interface ScenarioDetailClientProps {
  scenario: Scenario;
  references: string[];
}

export default function ScenarioDetailClient({ scenario, references }: ScenarioDetailClientProps) {
  const [modalVideo, setModalVideo] = useState<{ url: string; title: string; logline?: string } | null>(null);

  const handlePlayClick = () => {
    trackScenarioClick(scenario.id, scenario.title);
    const videoId = getYouTubeVideoId(scenario.youtubeUrl);
    if (videoId) {
      trackVideoModalOpen(videoId, 'scenario-detail', 'play_button');
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
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden border-b border-[#272727]">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: scenario.thumbnailUrl
                  ? `url(${scenario.thumbnailUrl})`
                  : `url(${getYouTubeThumbnail(scenario.youtubeUrl)})`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 w-full py-16">
            <div className="mb-4">
              <Link
                href="/scenarios"
                className="text-sm text-muted hover:text-foreground transition-colors inline-flex items-center gap-2 mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Scenarios
              </Link>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] mb-6 text-foreground tracking-tight">
              {scenario.title}
            </h1>
            
            <p className="text-lg md:text-xl text-muted/90 mb-6 max-w-3xl leading-relaxed font-light">
              {scenario.premise}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted/70 mb-8">
              {scenario.runtime && (
                <span>Runtime: {scenario.runtime}</span>
              )}
              {scenario.category && (
                <span className="px-2 py-1 bg-[#3ea6ff]/10 text-[#3ea6ff] rounded text-xs font-medium">
                  {scenario.category}
                </span>
              )}
              {scenario.publishDate && (
                <span>Published: {new Date(scenario.publishDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handlePlayClick}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play Episode
              </button>
              <TrackedExternalLink
                href={scenario.youtubeUrl}
                eventType="youtube"
                className="btn-secondary"
              >
                Watch on YouTube
              </TrackedExternalLink>
            </div>
          </div>
        </section>

        {/* Video Player Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 border-b border-[#272727]">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-[#272727]">
            <EpisodeThumbnail
              thumbnailUrl={scenario.thumbnailUrl || getYouTubeThumbnail(scenario.youtubeUrl)}
              title={scenario.title}
              runtime={scenario.runtime}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
              onClick={handlePlayClick}
            >
              <PlayButton onClick={handlePlayClick} />
            </div>
          </div>
        </section>

        {/* Key Insight (if available) */}
        {scenario.keyInsight && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 border-b border-[#272727]">
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-foreground">
              Key Insight
            </h2>
            <p className="text-lg text-muted leading-relaxed font-light">
              {scenario.keyInsight}
            </p>
          </section>
        )}

        {/* References */}
        {references.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <h2 className="text-2xl md:text-3xl font-light mb-8 text-foreground">
              References
            </h2>
            <ul className="space-y-3">
              {references.map((citation, index) => (
                <li key={index} className="text-muted leading-relaxed pl-4 border-l-2 border-[#272727]">
                  {citation}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/references"
                className="text-sm text-[#3ea6ff] hover:text-[#2d8fdd] transition-colors inline-flex items-center gap-2"
              >
                View All References
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>
        )}
      </main>

      {modalVideo && (
        <YouTubeModal
          videoUrl={modalVideo.url}
          title={modalVideo.title}
          logline={modalVideo.logline}
          isOpen={!!modalVideo}
          onClose={() => setModalVideo(null)}
          page="scenario-detail"
          placement="play_button"
        />
      )}
    </>
  );
}
