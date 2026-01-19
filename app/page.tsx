import Link from 'next/link';
import { featuredScenarios } from '@/data/scenarios';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-4 text-foreground">
          What If the World Changed Overnight?
        </h1>
        <p className="text-base md:text-lg text-muted mb-8 max-w-2xl leading-normal">
          WTFiction explores the consequences of science, technology, and power — before they happen.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://www.youtube.com/@WTFictionTV"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-foreground text-background font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Watch on YouTube
          </a>
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center px-6 py-2.5 border border-[#272727] text-foreground font-medium hover:bg-[#272727] transition-colors text-sm"
          >
            Subscribe for Future Scenarios
          </Link>
        </div>
      </section>

      {/* What Is WTFiction */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 border-t border-[#272727]">
        <h2 className="text-xl md:text-2xl font-medium mb-4 text-foreground">
          What Is WTFiction
        </h2>
        <div className="max-w-none">
          <p className="text-sm md:text-base text-muted leading-normal mb-3">
            WTFiction is a speculative storytelling project exploring what happens if the systems we rely on break, evolve, or disappear.
          </p>
          <p className="text-sm md:text-base text-muted leading-normal">
            Each episode examines a single scenario — grounded in real science, economics, and geopolitics — and follows the consequences forward.
          </p>
        </div>
      </section>

      {/* Featured Scenarios */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 border-t border-[#272727]">
        <h2 className="text-xl md:text-2xl font-medium mb-8 text-foreground">
          Featured Scenarios
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {featuredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="border border-[#272727] p-4 hover:bg-[#272727] transition-colors"
            >
              <h3 className="text-base md:text-lg font-medium mb-2 text-foreground leading-snug">
                {scenario.title}
              </h3>
              <p className="text-sm text-muted mb-3 leading-normal">
                {scenario.premise}
              </p>
              <a
                href={scenario.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-foreground hover:opacity-80 transition-opacity font-medium"
              >
                Watch Episode →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Why This Matters */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10 border-t border-[#272727]">
        <h2 className="text-xl md:text-2xl font-medium mb-4 text-foreground">
          Why This Matters
        </h2>
        <div className="max-w-none">
          <p className="text-sm md:text-base text-muted leading-normal mb-3">
            These scenarios aren't predictions.
          </p>
          <p className="text-sm md:text-base text-muted leading-normal">
            They're stress tests for civilization.
          </p>
        </div>
      </section>
    </main>
  );
}
