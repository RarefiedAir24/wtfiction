'use client';

import { useState } from 'react';
import Link from 'next/link';
import { featuredScenarios, getHeroEpisode } from '@/data/scenarios';
import EmailSignup from '@/components/EmailSignup';
import TrackedExternalLink from '@/components/TrackedExternalLink';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import YouTubeModal from '@/components/YouTubeModal';
import PlayButton from '@/components/PlayButton';
import PostWatchContinuation from '@/components/PostWatchContinuation';
import { getYouTubeThumbnail, getYouTubeVideoId, buildYouTubeEmbedUrl } from '@/lib/youtube';
import { trackScenarioClick, trackVideoModalOpen } from '@/lib/analytics';

export default function HomePageClient() {
  const [modalVideo, setModalVideo] = useState<{ url: string; title: string; logline?: string; id?: string } | null>(null);
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false);
  const [heroThumbnailError, setHeroThumbnailError] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [highlightedScenarioId, setHighlightedScenarioId] = useState<string | null>(null);
  const [heroVideoLoading, setHeroVideoLoading] = useState(false);
  const [showPostWatch, setShowPostWatch] = useState<string | null>(null);
  const heroEpisode = getHeroEpisode();

  const handlePlayClick = (scenario: typeof featuredScenarios[0]) => {
    // Save scroll position before opening modal
    setScrollPosition(window.scrollY);
    
    trackScenarioClick(scenario.id, scenario.title);
    const videoId = getYouTubeVideoId(scenario.youtubeUrl);
    if (videoId) {
      trackVideoModalOpen(videoId, 'home', 'episode_card');
    }
    setModalVideo({ 
      url: scenario.youtubeUrl, 
      title: scenario.title,
      logline: scenario.premise,
      id: scenario.id
    });
  };

  const handleHeroPlay = () => {
    if (!heroEpisode) return;
    
    // Save scroll position before opening modal
    setScrollPosition(window.scrollY);
    
    trackScenarioClick(heroEpisode.id, heroEpisode.title);
    const videoId = getYouTubeVideoId(heroEpisode.youtubeUrl);
    if (videoId) {
      trackVideoModalOpen(videoId, 'home', 'hero');
    }
    setModalVideo({ 
      url: heroEpisode.youtubeUrl, 
      title: heroEpisode.title,
      logline: heroEpisode.premise,
      id: heroEpisode.id
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
    setTimeout(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'instant' as ScrollBehavior
      });
    }, 100);
    
    // Find and highlight next scenario
    if (currentVideoId) {
      const currentIndex = featuredScenarios.findIndex(s => s.id === currentVideoId);
      if (currentIndex >= 0 && currentIndex < featuredScenarios.slice(0, 6).length - 1) {
        const nextScenario = featuredScenarios[currentIndex + 1];
        setHighlightedScenarioId(nextScenario.id);
        
        // Scroll to next scenario smoothly after a brief delay
        setTimeout(() => {
          const element = document.getElementById(`scenario-${nextScenario.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 200);
        
        // Remove highlight after 5 seconds
        setTimeout(() => setHighlightedScenarioId(null), 5000);
      }
    }
  };

  return (
    <>
      <main className="min-h-screen">
        {/* Hero Section - Episode-Driven with Embedded Player */}
        <section className="hero-episode relative min-h-[90vh] flex items-center overflow-hidden">
          {heroEpisode ? (
            <>
              {/* Hero Episode Background */}
              <div className="absolute inset-0 z-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: heroEpisode.thumbnailUrl 
                      ? `url(${heroEpisode.thumbnailUrl})` 
                      : `url(${getYouTubeThumbnail(heroEpisode.youtubeUrl)})`
                  }}
                />
                {/* Enhanced gradient overlay system for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/90 to-black/80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {/* Vignette effect for better focus */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/40" />
              </div>
              
              <div className="hero-content max-w-7xl mx-auto px-4 sm:px-6 relative z-10 w-full py-16">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                  {/* Left: Title & Info */}
                  <div>
                    <div className="mb-4">
                      <span className="text-xs md:text-sm text-[#3ea6ff] font-semibold tracking-[0.15em] uppercase mb-4 block opacity-90">
                        Latest Episode
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-tight" style={{ fontFamily: 'var(--font-title), system-ui, sans-serif' }}>
                      <span className="block">
                        {heroEpisode.title}
                      </span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/95 mb-6 max-w-2xl leading-relaxed font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                      {heroEpisode.premise}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted/70 mb-8">
                      {heroEpisode.runtime && (
                        <span>Runtime: {heroEpisode.runtime}</span>
                      )}
                      {heroEpisode.category && (
                        <span className="px-2 py-1 bg-[#3ea6ff]/10 text-[#3ea6ff] rounded text-xs font-medium">
                          {heroEpisode.category}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleHeroPlay}
                        className="btn-primary inline-flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Play Episode
                      </button>
                      <TrackedExternalLink
                        href={heroEpisode.youtubeUrl}
                        eventType="youtube"
                        className="btn-secondary"
                      >
                        Watch on YouTube
                      </TrackedExternalLink>
                    </div>
                  </div>

                  {/* Right: YouTube Thumbnail/Player */}
                  {(() => {
                    const videoId = getYouTubeVideoId(heroEpisode.youtubeUrl);
                    
                    if (!videoId) {
                      return (
                        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-[#272727] flex items-center justify-center">
                          <p className="text-muted text-sm">Video unavailable</p>
                        </div>
                      );
                    }
                    
                    // Try multiple thumbnail quality levels if one fails
                    const getThumbnailUrl = (quality: 'maxres' | 'high' = 'maxres') => {
                      if (heroEpisode.thumbnailUrl) return heroEpisode.thumbnailUrl;
                      return getYouTubeThumbnail(heroEpisode.youtubeUrl, quality);
                    };
                    
                    // Start with maxres, fallback to high if it fails
                    const thumbnailUrl = getThumbnailUrl('maxres');
                    
                    return (
                      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-[#272727] group cursor-pointer transform transition-all duration-500 hover:shadow-[0_20px_60px_rgba(62,166,255,0.3)] hover:scale-[1.01]">
                        {!heroVideoLoaded ? (
                          // Thumbnail with enhanced play button overlay
                          <>
                            {thumbnailUrl && !heroThumbnailError ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={thumbnailUrl}
                                  alt={heroEpisode.title}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  loading="eager"
                                  onError={(e) => {
                                    // Try fallback to high quality thumbnail
                                    const currentSrc = (e.target as HTMLImageElement).src;
                                    if (currentSrc.includes('maxresdefault')) {
                                      // Try high quality fallback
                                      const fallbackUrl = getThumbnailUrl('high');
                                      (e.target as HTMLImageElement).src = fallbackUrl;
                                    } else {
                                      // Both failed, show error state
                                      setHeroThumbnailError(true);
                                    }
                                  }}
                                />
                                {/* Gradient overlay for better contrast */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {/* Subtle vignette effect */}
                                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/20" />
                              </div>
                            ) : (
                              // Fallback: gradient background when thumbnail fails
                              <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full bg-[#3ea6ff]/20 flex items-center justify-center">
                                    <svg 
                                      className="w-8 h-8 md:w-10 md:h-10 text-[#3ea6ff]" 
                                      fill="currentColor" 
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </div>
                                  <p className="text-xs text-muted/60 px-4">{heroEpisode.title}</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Enhanced play button overlay */}
                            <div 
                              className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all duration-500"
                              onClick={() => {
                                setHeroVideoLoading(true);
                                setHeroVideoLoaded(true);
                              }}
                            >
                              {/* Animated play button with glow */}
                              <div className="relative">
                                {/* Outer glow ring */}
                                <div className="absolute inset-0 rounded-full bg-[#3ea6ff]/30 blur-xl scale-150 group-hover:scale-175 group-hover:bg-[#3ea6ff]/50 transition-all duration-500 animate-pulse" />
                                
                                {/* Play button */}
                                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#3ea6ff] to-[#2d8fdd] hover:from-[#4eb5ff] hover:to-[#3ea6ff] flex items-center justify-center transition-all duration-300 shadow-2xl transform group-hover:scale-110 group-active:scale-95">
                                  <svg 
                                    className="w-8 h-8 md:w-10 md:h-10 text-white ml-1 drop-shadow-lg" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </div>
                              
                              {/* Runtime badge */}
                              {heroEpisode.runtime && (
                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-xs text-white font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                  {heroEpisode.runtime}
                                </div>
                              )}
                              
                              {/* "Watch Now" text hint */}
                              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-2">
                                <span>Watch Now</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </div>
                            </div>
                          </>
                        ) : (
                          // YouTube iframe with loading state and smooth fade-in
                          <div className="relative w-full h-full">
                            {heroVideoLoading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-10">
                                <div className="text-center">
                                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#3ea6ff]/20 flex items-center justify-center animate-pulse">
                                    <svg 
                                      className="w-8 h-8 text-[#3ea6ff] animate-spin" 
                                      fill="none" 
                                      viewBox="0 0 24 24"
                                    >
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                  </div>
                                  <p className="text-sm text-muted">Loading video...</p>
                                </div>
                              </div>
                            )}
                            <iframe
                              width="100%"
                              height="100%"
                              src={buildYouTubeEmbedUrl(videoId, true)}
                              title={heroEpisode.title}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              className="w-full h-full animate-fadeIn"
                              onLoad={() => setHeroVideoLoading(false)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </>
          ) : (
            /* Fallback: Static Brand Message */
            <div className="hero-content max-w-5xl mx-auto px-4 sm:px-6 relative z-10 w-full">
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
                WTFiction explores the consequences of science, technology, and power — before they happen.
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
          )}
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

        {/* Email Signup Section - Enhanced */}
        <section className="sticky bottom-0 z-30 border-t-2 border-[#3ea6ff]/30 bg-gradient-to-b from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a] backdrop-blur-xl">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#3ea6ff]/20 to-[#2d8fdd]/20 mb-4">
                  <svg className="w-8 h-8 text-[#3ea6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground" style={{ fontFamily: 'var(--font-title), system-ui, sans-serif' }}>
                  Get Scenario Updates
                </h2>
                <p className="text-base md:text-lg text-muted/90 leading-relaxed font-light max-w-xl mx-auto">
                  Get notified when new scenarios are published. <span className="text-muted/70">No spam, no daily emails — only new episodes.</span>
                </p>
              </div>
              <div className="flex justify-center">
                <EmailSignup />
              </div>
            </div>
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
            {featuredScenarios.slice(0, 6).map((scenario) => (
              <div
                id={`scenario-${scenario.id}`}
                key={scenario.id}
                className={`episode-card card-modern group block transition-all duration-500 ${
                  highlightedScenarioId === scenario.id 
                    ? 'ring-2 ring-[#3ea6ff] ring-offset-2 ring-offset-[#0f0f0f] scale-[1.02]' 
                    : ''
                }`}
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
                  <h3 className="text-lg font-bold mb-3 text-foreground leading-tight tracking-tight" style={{ fontFamily: 'var(--font-title), system-ui, sans-serif' }}>
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
          onClose={handleModalClose}
          page="home"
          placement="episode_card"
        />
      )}
    </>
  );
}
