import { references } from '@/data/references';

export default function ReferencesPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-12 text-foreground">
          References
        </h1>
        <div className="space-y-12">
          {references.map((reference) => (
            <section key={reference.episodeId} className="border-b border-zinc-800 pb-8 last:border-b-0">
              <h2 className="text-xl md:text-2xl font-serif font-semibold mb-6 text-foreground">
                Episode: {reference.episodeTitle}
              </h2>
              <ul className="space-y-2 text-muted leading-relaxed">
                {reference.citations.map((citation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-3">•</span>
                    <span>{citation}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
