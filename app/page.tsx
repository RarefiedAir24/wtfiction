import Link from 'next/link';
import { featuredScenarios } from '@/data/scenarios';
import EmailSignup from '@/components/EmailSignup';
import TrackedExternalLink from '@/components/TrackedExternalLink';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section - Prestige Documentary Style */}
      <section className="hero-background">
        <div className="hero-content max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-8 text-foreground">
            What If the World Changed Overnight?
          </h1>
          <p className="text-xl md:text-2xl text-muted mb-12 max-w-2xl leading-relaxed font-light">
            WTFiction explores the consequences of science, technology, and power — before they happen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <TrackedExternalLink
              href="https://www.youtube.com/@WTFictionTV"
              eventType="cta"
              ctaName="Watch on YouTube"
              location="hero"
              className="inline-flex items-center justify-center px-10 py-4 bg-foreground text-background font-medium hover:opacity-90 transition-opacity text-base"
            >
              Watch on YouTube
            </TrackedExternalLink>
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center px-10 py-4 border border-[#3f3f3f] text-foreground font-medium hover:border-foreground transition-colors text-base"
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
              {scenario.thumbnailUrl ? (
                <div className="relative w-full aspect-video bg-[#272727] overflow-hidden mb-4">
                  <img
                    src={scenario.thumbnailUrl}
                    alt={scenario.title}
                    className="w-full h-full object-cover"
                  />
                  {scenario.runtime && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/90 text-xs text-foreground font-medium">
                      {scenario.runtime}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-[#1a1a1a] mb-4 flex items-center justify-center">
                  <div className="text-3xl text-muted/20">▶</div>
                  {scenario.runtime && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/90 text-xs text-foreground font-medium">
                      {scenario.runtime}
                    </div>
                  )}
                </div>
              )}
              <div>
                <h3 className="text-lg font-medium mb-2 text-foreground leading-tight">
                  {scenario.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2">
                  {scenario.premise}
                </p>
                {scenario.publishDate && (
                  <p className="text-xs text-muted/70">{scenario.publishDate}</p>
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
