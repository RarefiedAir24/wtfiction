import Link from 'next/link';
import { featuredScenarios } from '@/data/scenarios';
import EmailSignup from '@/components/EmailSignup';
import TrackedExternalLink from '@/components/TrackedExternalLink';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import { getYouTubeThumbnail } from '@/lib/youtube';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Prestige Documentary Style */}
      <section className="hero-background">
        <div className="hero-content max-w-5xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            <span className="text-xs md:text-sm text-[#3ea6ff] font-semibold tracking-[0.15em] uppercase mb-6 block opacity-90">
              Speculative Scenarios
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extralight leading-[0.95] mb-8 text-foreground tracking-tight">
            <span className="hero-title block">
              What If the World
            </span>
            <span className="hero-title block mt-1 md:mt-2">
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
            <TrackedExternalLink
              key={scenario.id}
              href={scenario.youtubeUrl}
              eventType="scenario"
              scenarioId={scenario.id}
              scenarioTitle={scenario.title}
              className="episode-card card-modern group block"
            >
              <EpisodeThumbnail
                thumbnailUrl={scenario.thumbnailUrl || getYouTubeThumbnail(scenario.youtubeUrl)}
                title={scenario.title}
                runtime={scenario.runtime}
              />
              <div className="px-1">
                <h3 className="text-lg font-medium mb-3 text-foreground leading-tight tracking-tight">
                  {scenario.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-4 line-clamp-2">
                  {scenario.premise}
                </p>
                {scenario.publishDate && (
                  <p className="text-xs text-muted/60 font-medium">{scenario.publishDate}</p>
                )}
              </div>
            </TrackedExternalLink>
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
  );
}
