import { scenarios } from '@/data/scenarios';

export default function ScenariosPage() {
  // Sort by newest first (reverse chronological)
  const sortedScenarios = [...scenarios].reverse();

  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-12 text-foreground">
          Scenarios
        </h1>
        <div className="space-y-8">
          {sortedScenarios.map((scenario) => (
            <article
              key={scenario.id}
              className="border-b border-zinc-800 pb-8 last:border-b-0"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-3 text-foreground">
                    {scenario.title}
                  </h2>
                  <p className="text-muted leading-relaxed mb-4">
                    {scenario.premise}
                  </p>
                  {scenario.runtime && (
                    <p className="text-sm text-muted mb-4">
                      Runtime: {scenario.runtime}
                    </p>
                  )}
                </div>
                <a
                  href={scenario.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:opacity-80 transition-opacity font-medium whitespace-nowrap"
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
