import { references } from '@/data/references';

export default function ReferencesPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <h1 className="text-2xl md:text-3xl font-medium mb-8 text-foreground">
          References
        </h1>
        <div className="space-y-8">
          {references.map((reference) => (
            <section key={reference.episodeId} className="border-b border-[#272727] pb-6 last:border-b-0">
              <h2 className="text-base md:text-lg font-medium mb-4 text-foreground">
                Episode: {reference.episodeTitle}
              </h2>
              <ul className="space-y-1.5 text-sm text-muted leading-normal">
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
