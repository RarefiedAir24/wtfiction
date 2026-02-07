'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Scenario } from '@/data/scenarios';
import { Citation } from '@/data/references';
import YouTubeModal from '@/components/YouTubeModal';
import TrackedExternalLink from '@/components/TrackedExternalLink';
import { getYouTubeThumbnail, getYouTubeVideoId, withThumbnailCacheBust, getThumbnailProxyUrl } from '@/lib/youtube';
import { trackScenarioClick, trackVideoModalOpen } from '@/lib/analytics';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import PlayButton from '@/components/PlayButton';
import ReferenceSummary from '@/components/ReferenceSummary';
import { formatCitation } from '@/lib/citation-formatter';

interface ScenarioDetailClientProps {
  scenario: Scenario;
  references: Citation[];
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
                backgroundImage: (() => {
                  const videoId = getYouTubeVideoId(scenario.youtubeUrl);
                  const proxy = getThumbnailProxyUrl(videoId);
                  if (proxy) return `url(${proxy})`;
                  const url = scenario.thumbnailUrl || getYouTubeThumbnail(scenario.youtubeUrl);
                  return url ? `url(${withThumbnailCacheBust(url)})` : 'none';
                })()
              }}
            />
            {/* Enhanced gradient overlay system for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/90 to-black/80" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {/* Vignette effect for better focus */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
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
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-tight" style={{ fontFamily: 'var(--font-title), system-ui, sans-serif' }}>
              {scenario.title}
            </h1>
            
            <p className="text-lg md:text-xl text-white/95 mb-6 max-w-3xl leading-relaxed font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
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
            <ul className="space-y-4 text-sm md:text-base text-muted leading-relaxed">
              {references.map((citation, index) => {
                const title = citation.title || citation.text || 'Untitled Reference';
                const formattedCitation = formatCitation(citation);
                
                return (
                  <li key={index} className="flex items-start gap-4">
                    {/* Source Type Label - Left Side - Always reserve space for alignment */}
                    <span className="text-xs text-muted/60 font-medium uppercase tracking-wide flex-shrink-0 pt-0.5 min-w-[80px]">
                      {citation.type ? `[${citation.type}]` : ''}
                    </span>
                    {/* Citation Content - Right Side */}
                    <div className="flex-1 space-y-1.5">
                      {/* Title - Clickable if URL exists */}
                      {citation.url ? (
                        <a
                          href={citation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground font-medium hover:text-[#3ea6ff] transition-all duration-300 ease-out inline-flex items-center group cursor-pointer"
                        >
                          <span className="relative inline-block">
                            <span className="relative z-10">{title}</span>
                            {/* Animated underline */}
                            <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gradient-to-r from-[#3ea6ff] to-[#2d8fdd] transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
                            {/* Subtle glow effect on hover */}
                            <span className="absolute -bottom-1 left-0 w-0 h-[4px] bg-[#3ea6ff]/20 blur-sm transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
                            {/* Subtle background highlight - constrained to text area */}
                            <span className="absolute -inset-x-1 -inset-y-0.5 rounded-md bg-[#3ea6ff]/5 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out -z-10"></span>
                          </span>
                          {/* External link icon with smooth animation */}
                          <svg 
                            className="inline-block w-3.5 h-3.5 ml-2 mb-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <div className="text-foreground font-medium">
                          {title}
                        </div>
                      )}
                      {/* Description - with AI summarize option */}
                      <ReferenceSummary
                        url={citation.url}
                        title={title}
                        authors={citation.authors}
                        type={citation.type}
                        existingDescription={citation.description}
                      />
                      {/* Citation Format - Always show in standard format with italicized title */}
                      {formattedCitation && (
                        <div className="text-xs text-muted/70 mt-2 pt-2 border-t border-[#272727]">
                          {formattedCitation}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
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
