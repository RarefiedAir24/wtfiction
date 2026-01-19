export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-12 text-foreground">
          About
        </h1>

        <div className="space-y-12">
          {/* What WTFiction Is */}
          <section>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-foreground">
              What WTFiction Is
            </h2>
            <ul className="space-y-4 text-muted leading-relaxed">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Speculative analysis</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Consequence-driven storytelling</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Reality-anchored hypotheticals</span>
              </li>
            </ul>
          </section>

          {/* What It Is Not */}
          <section>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-foreground">
              What It Is Not
            </h2>
            <ul className="space-y-4 text-muted leading-relaxed">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Not news</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Not predictions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Not political advocacy</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Not science fiction entertainment</span>
              </li>
            </ul>
          </section>

          {/* Methodology */}
          <section>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-foreground">
              Methodology
            </h2>
            <ul className="space-y-4 text-muted leading-relaxed">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Real sources</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Cross-disciplinary research</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Scenario-based reasoning (domino effects)</span>
              </li>
            </ul>
          </section>

          {/* Closing */}
          <section className="pt-8 border-t border-zinc-800">
            <p className="text-lg text-muted leading-relaxed italic">
              The goal isn't to scare — it's to understand.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
