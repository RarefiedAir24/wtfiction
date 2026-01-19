import Link from 'next/link';
import { featuredScenarios } from '@/data/scenarios';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight mb-6 text-foreground">
          What If the World Changed Overnight?
        </h1>
        <p className="text-xl md:text-2xl text-muted mb-12 max-w-2xl leading-relaxed">
          WTFiction explores the consequences of science, technology, and power — before they happen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="https://www.youtube.com/@wtfiction"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
          >
            Watch on YouTube
          </a>
          <Link
            href="/subscribe"
            className="inline-flex items-center justify-center px-8 py-4 border border-zinc-700 text-foreground font-medium hover:border-zinc-600 transition-colors"
          >
            Subscribe for Future Scenarios
          </Link>
        </div>
      </section>

      {/* What Is WTFiction */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6 text-foreground">
          What Is WTFiction
        </h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted leading-relaxed mb-4">
            WTFiction is a speculative storytelling project exploring what happens if the systems we rely on break, evolve, or disappear.
          </p>
          <p className="text-lg text-muted leading-relaxed">
            Each episode examines a single scenario — grounded in real science, economics, and geopolitics — and follows the consequences forward.
          </p>
        </div>
      </section>

      {/* Featured Scenarios */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-12 text-foreground">
          Featured Scenarios
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="border border-zinc-800 p-6 hover:border-zinc-700 transition-colors"
            >
              <h3 className="text-xl font-serif font-semibold mb-3 text-foreground">
                {scenario.title}
              </h3>
              <p className="text-muted mb-4 leading-relaxed">
                {scenario.premise}
              </p>
              <a
                href={scenario.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:opacity-80 transition-opacity font-medium"
              >
                Watch Episode →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Why This Matters */}
      <section className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-800">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-6 text-foreground">
          Why This Matters
        </h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-lg text-muted leading-relaxed mb-4">
            These scenarios aren't predictions.
          </p>
          <p className="text-lg text-muted leading-relaxed">
            They're stress tests for civilization.
          </p>
        </div>
      </section>
    </main>
  );
}
