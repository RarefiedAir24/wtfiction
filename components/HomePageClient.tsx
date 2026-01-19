'use client';

import { useState } from 'react';
import Link from 'next/link';
import { featuredScenarios } from '@/data/scenarios';
import EmailSignup from '@/components/EmailSignup';
import TrackedExternalLink from '@/components/TrackedExternalLink';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import YouTubeModal from '@/components/YouTubeModal';
import PlayButton from '@/components/PlayButton';
import { getYouTubeThumbnail, getYouTubeVideoId } from '@/lib/youtube';
import { trackScenarioClick, trackVideoModalOpen } from '@/lib/analytics';

export default function HomePageClient() {
  const [modalVideo, setModalVideo] = useState<{ url: string; title: string; logline?: string } | null>(null);

  const handlePlayClick = (scenario: typeof featuredScenarios[0]) => {
    trackScenarioClick(scenario.id, scenario.title);
    const videoId = getYouTubeVideoId(scenario.youtubeUrl);
    if (videoId) {
      trackVideoModalOpen(videoId, 'home', 'episode_card');
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
        {/* Hero Section - Prestige Documentary Style */}
        <section className="hero-background">
          <div className="hero-content max-w-5xl mx-auto px-4 sm:px-6">
            <div className="mb-6">
              <span className="text-xs md:text-sm text-[#3ea6ff] font-semibold tracking-[0.15em] uppercase mb-6 block opacity-90">
                Speculative Scenarios
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.1] mb-8 text-foreground tracking-tight">
              <span className="hero-title block">
                What If the World
              </span>
              <span className="hero-title block mt-2 md:mt-3">
                Changed Overnight?
              </span>
            </h1>
            <p className="hero-subtitle text-xl md:text-2xl lg:text-3xl text-muted/90 mb-16 max-w-3xl leading-relaxed font-light mt-10">
              Explore the consequences of science, technology, and power — before they happen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-12">
              <TrackedExternalLink
                href="https://www.youtube.com/@WTFictionTV"
                eventType="cta"
                ctaName="Watch on YouTube"
                location="hero"
                className="btn-primary"
              >
                Watch on YouTube
              </TrackedExternalLink>
              <Link
                href="/subscribe"
                className="btn-secondary"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </section>

        {/* What Is WTFiction */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 border-t border-[#272727]">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-foreground">
            What Is WTFiction
          </h2>
          <div className="max-w-3xl space-y-6">
            <p className="text-lg md:text-xl text-muted leading-relaxed font-light">
              WTFiction is a speculative storytelling project exploring what happens if the systems we rely on break, evolve, or disappear.
            </p>
            <p className="text-lg md:text-xl text-muted leading-relaxed font-light">
              Each episode examines a single scenario — grounded in real science, economics, and geopolitics — and follows the consequences forward.
            </p>
          </div>
        </section>

        {/* Email Signup Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 border-t border-[#272727]">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-light mb-4 text-foreground">
              Get Scenario Updates
            </h2>
            <p className="text-base md:text-lg text-muted mb-8 leading-relaxed font-light">
              Get notified when new scenarios are released. No spam, no daily emails — only new episodes.
            </p>
            <EmailSignup />
          </div>
        </section>

        {/* Featured Scenarios - Documentary Series Style */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-[#272727]">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-light mb-4 text-foreground">
              Episodes
            </h2>
            <Link
              href="/scenarios"
              className="text-sm text-muted hover:text-foreground transition-colors inline-block mt-2"
            >
              View All Episodes →
            </Link>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredScenarios.map((scenario) => (
              <div
                key={scenario.id}
                className="episode-card card-modern group block"
              >
                <div className="relative">
                  <EpisodeThumbnail
                    thumbnailUrl={scenario.thumbnailUrl || getYouTubeThumbnail(scenario.youtubeUrl)}
                    title={scenario.title}
                    runtime={scenario.runtime}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                    <PlayButton onClick={() => handlePlayClick(scenario)} />
                  </div>
                </div>
                <div className="px-1 mt-5">
                  <h3 className="text-lg font-medium mb-3 text-foreground leading-tight tracking-tight">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
                    {scenario.premise}
                  </p>
                  {scenario.publishDate && (
                    <p className="text-xs text-muted/60 font-medium">{scenario.publishDate}</p>
                  )}
                  <div className="mt-4 flex items-center gap-3">
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
            ))}
          </div>
        </section>

        {/* Why This Matters */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20 border-t border-[#272727]">
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-foreground">
            Why This Matters
          </h2>
          <div className="max-w-3xl space-y-4">
            <p className="text-lg md:text-xl text-muted leading-relaxed font-light">
              These scenarios aren't predictions.
            </p>
            <p className="text-lg md:text-xl text-foreground leading-relaxed font-normal">
              They're stress tests for civilization.
            </p>
          </div>
        </section>
      </main>

      {modalVideo && (
        <YouTubeModal
          videoUrl={modalVideo.url}
          title={modalVideo.title}
          logline={modalVideo.logline}
          isOpen={!!modalVideo}
          onClose={() => setModalVideo(null)}
          page="home"
          placement="episode_card"
        />
      )}
    </>
  );
}
