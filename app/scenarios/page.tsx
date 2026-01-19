import { scenarios } from '@/data/scenarios';

export default function ScenariosPage() {
  // Sort by newest first (reverse chronological)
  const sortedScenarios = [...scenarios].reverse();

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-medium mb-12 text-foreground">
          Scenarios
        </h1>
        <div className="space-y-8">
          {sortedScenarios.map((scenario) => (
            <article
              key={scenario.id}
              className="border-b border-[#272727] pb-8 last:border-b-0"
            >
              <a
                href={scenario.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col md:flex-row gap-4 group"
              >
                {scenario.thumbnailUrl && (
                  <div className="flex-shrink-0 w-full md:w-64 aspect-video bg-[#272727] overflow-hidden rounded-sm">
                    <img
                      src={scenario.thumbnailUrl}
                      alt={scenario.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-medium mb-3 text-foreground leading-snug group-hover:opacity-80 transition-opacity">
                    {scenario.title}
                  </h2>
                  <p className="text-sm md:text-base text-muted leading-normal mb-3">
                    {scenario.premise}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    {scenario.runtime && (
                      <span>Runtime: {scenario.runtime}</span>
                    )}
                    {scenario.publishDate && (
                      <span>{scenario.publishDate}</span>
                    )}
                  </div>
                  {scenario.keyInsight && (
                    <p className="text-xs text-muted/80 mt-3 leading-normal italic">
                      {scenario.keyInsight}
                    </p>
                  )}
                  <div className="mt-4 inline-flex items-center text-sm text-foreground font-medium group-hover:translate-x-1 transition-transform">
                    Watch on YouTube
                    <span className="ml-2">→</span>
                  </div>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
