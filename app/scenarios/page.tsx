import { scenarios } from '@/data/scenarios';

export default function ScenariosPage() {
  // Sort by newest first (reverse chronological)
  const sortedScenarios = [...scenarios].reverse();

  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <h1 className="text-2xl md:text-3xl font-medium mb-8 text-foreground">
          Scenarios
        </h1>
        <div className="space-y-6">
          {sortedScenarios.map((scenario) => (
            <article
              key={scenario.id}
              className="border-b border-[#272727] pb-6 last:border-b-0"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div className="flex-1">
                  <h2 className="text-base md:text-lg font-medium mb-2 text-foreground leading-snug">
                    {scenario.title}
                  </h2>
                  <p className="text-sm text-muted leading-normal mb-2">
                    {scenario.premise}
                  </p>
                  {scenario.runtime && (
                    <p className="text-xs text-muted mb-2">
                      Runtime: {scenario.runtime}
                    </p>
                  )}
                </div>
                <a
                  href={scenario.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground hover:opacity-80 transition-opacity font-medium whitespace-nowrap"
                >
                  Watch on YouTube →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
