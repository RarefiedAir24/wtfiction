export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <h1 className="text-2xl md:text-3xl font-medium mb-8 text-foreground">
          About
        </h1>

        <div className="space-y-8">
          {/* What WTFiction Is */}
          <section>
            <h2 className="text-lg md:text-xl font-medium mb-4 text-foreground">
              What WTFiction Is
            </h2>
            <ul className="space-y-2 text-sm md:text-base text-muted leading-normal">
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
            <h2 className="text-lg md:text-xl font-medium mb-4 text-foreground">
              What It Is Not
            </h2>
            <ul className="space-y-2 text-sm md:text-base text-muted leading-normal">
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
            <h2 className="text-lg md:text-xl font-medium mb-4 text-foreground">
              Methodology
            </h2>
            <ul className="space-y-2 text-sm md:text-base text-muted leading-normal">
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
          <section className="pt-6 border-t border-[#272727]">
            <p className="text-sm md:text-base text-muted leading-normal italic">
              The goal isn't to scare — it's to understand.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
