import { references } from '@/data/references';

export default function ReferencesPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">
            References
          </h1>
          <p className="text-base text-muted leading-relaxed max-w-3xl">
            Every WTFiction scenario is grounded in real research. Below are the sources, citations, and references used in each episode. All citations are provided in plain text format for transparency and verification.
          </p>
        </div>
        <div className="space-y-10">
          {references.map((reference) => (
            <section key={reference.episodeId} className="border-b border-[#272727] pb-8 last:border-b-0">
              <h2 className="text-xl md:text-2xl font-medium mb-6 text-foreground">
                {reference.episodeTitle}
              </h2>
              <ul className="space-y-2.5 text-sm md:text-base text-muted leading-relaxed">
                {reference.citations.map((citation, index) => (
                  <li key={index} className="flex items-start pl-4 relative">
                    <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-muted rounded-full"></span>
                    <span>{citation}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-[#272727]">
          <p className="text-sm text-muted leading-relaxed max-w-3xl">
            These references are maintained for credibility, monetization safety, algorithmic trust, and press defensibility. Sources are verified and linked where publicly available.
          </p>
        </div>
      </div>
    </main>
  );
}
