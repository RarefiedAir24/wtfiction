import Link from 'next/link';
import { featuredScenarios } from '@/data/scenarios';

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
            <a
              href="https://www.youtube.com/@WTFictionTV"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-foreground text-background font-medium hover:opacity-90 transition-all text-sm rounded-sm shadow-lg hover:shadow-xl"
            >
              Watch on YouTube
            </a>
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

      {/* Featured Scenarios */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 border-t border-[#272727]">
        <h2 className="text-2xl md:text-3xl font-medium mb-10 text-foreground">
          Featured Scenarios
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {featuredScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="card-modern border border-[#272727] p-6 rounded-sm"
            >
              <h3 className="text-lg md:text-xl font-medium mb-3 text-foreground leading-snug">
                {scenario.title}
              </h3>
              <p className="text-sm text-muted mb-4 leading-normal line-clamp-3">
                {scenario.premise}
              </p>
              <a
                href={scenario.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-foreground hover:opacity-80 transition-opacity font-medium group"
              >
                Watch Episode
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
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
