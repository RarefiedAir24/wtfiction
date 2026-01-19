import Link from 'next/link';
import { featuredScenarios } from '@/data/scenarios';
import EmailSignup from '@/components/EmailSignup';
import TrackedExternalLink from '@/components/TrackedExternalLink';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Space/Globe Background */}
      <section className="hero-background relative">
        <div className="hero-content max-w-5xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight mb-6 text-foreground">
            What If the World Changed Overnight?
          </h1>
          <p className="text-lg md:text-xl text-muted mb-10 max-w-2xl leading-relaxed">
            WTFiction explores the consequences of science, technology, and power — before they happen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <TrackedExternalLink
              href="https://www.youtube.com/@WTFictionTV"
              eventType="cta"
              ctaName="Watch on YouTube"
              location="hero"
              className="inline-flex items-center justify-center px-8 py-3 bg-foreground text-background font-medium hover:opacity-90 transition-all text-sm rounded-sm shadow-lg hover:shadow-xl"
            >
              Watch on YouTube
            </TrackedExternalLink>
            <Link
              href="/subscribe"
              className="inline-flex items-center justify-center px-8 py-3 border border-[#272727] text-foreground font-medium hover:bg-[#272727] transition-all text-sm rounded-sm"
            >
              Subscribe for Future Scenarios
            </Link>
          </div>
        </div>
      </section>

      {/* What Is WTFiction */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-[#272727]">
        <h2 className="text-2xl md:text-3xl font-medium mb-6 text-foreground">
          What Is WTFiction
        </h2>
        <div className="max-w-3xl space-y-4">
          <p className="text-base md:text-lg text-muted leading-relaxed">
            WTFiction is a speculative storytelling project exploring what happens if the systems we rely on break, evolve, or disappear.
          </p>
          <p className="text-base md:text-lg text-muted leading-relaxed">
            Each episode examines a single scenario — grounded in real science, economics, and geopolitics — and follows the consequences forward.
          </p>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-[#272727]">
        <div className="max-w-2xl">
          <h2 className="text-xl md:text-2xl font-medium mb-3 text-foreground">
            Get Scenario Updates
          </h2>
          <p className="text-sm md:text-base text-muted mb-6 leading-normal">
            Get notified when new scenarios are released. No spam, no daily emails — only new episodes.
          </p>
          <EmailSignup />
        </div>
      </section>

      {/* Featured Scenarios */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-[#272727]">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl md:text-3xl font-medium text-foreground">
            Featured Scenarios
          </h2>
          <Link
            href="/scenarios"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {featuredScenarios.map((scenario) => (
            <TrackedExternalLink
              key={scenario.id}
              href={scenario.youtubeUrl}
              eventType="scenario"
              scenarioId={scenario.id}
              scenarioTitle={scenario.title}
              className="card-modern border border-[#272727] rounded-sm overflow-hidden group block"
            >
              {scenario.thumbnailUrl ? (
                <div className="relative w-full aspect-video bg-[#272727] overflow-hidden">
                  <img
                    src={scenario.thumbnailUrl}
                    alt={scenario.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {scenario.runtime && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-xs text-foreground rounded">
                      {scenario.runtime}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-gradient-to-br from-[#272727] to-[#1a1a1a] flex items-center justify-center">
                  <div className="text-4xl text-muted/30">▶</div>
                  {scenario.runtime && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-xs text-foreground rounded">
                      {scenario.runtime}
                    </div>
                  )}
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg md:text-xl font-medium mb-2 text-foreground leading-snug group-hover:opacity-80 transition-opacity">
                  {scenario.title}
                </h3>
                <p className="text-sm text-muted mb-3 leading-normal line-clamp-2">
                  {scenario.premise}
                </p>
                {scenario.keyInsight && (
                  <p className="text-xs text-muted/80 mb-3 leading-normal italic">
                    {scenario.keyInsight}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  {scenario.publishDate && (
                    <span className="text-xs text-muted">{scenario.publishDate}</span>
                  )}
                  <span className="text-sm text-foreground font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Watch Episode
                    <span className="ml-2">→</span>
                  </span>
                </div>
              </div>
            </TrackedExternalLink>
          ))}
        </div>
      </section>

      {/* Why This Matters */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-[#272727]">
        <h2 className="text-2xl md:text-3xl font-medium mb-6 text-foreground">
          Why This Matters
        </h2>
        <div className="max-w-3xl space-y-3">
          <p className="text-base md:text-lg text-muted leading-relaxed">
            These scenarios aren't predictions.
          </p>
          <p className="text-base md:text-lg text-foreground leading-relaxed font-medium">
            They're stress tests for civilization.
          </p>
        </div>
      </section>
    </main>
  );
}
