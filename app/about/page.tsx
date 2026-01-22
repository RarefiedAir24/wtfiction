export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-light mb-16 text-foreground">
          About
        </h1>

        <div className="space-y-16">
          {/* Section 1: What WTFiction Is (Primary) */}
          <section>
            <div className="max-w-2xl space-y-4 text-lg md:text-xl text-muted leading-relaxed">
              <p>
                WTFiction is a speculative documentary series that explores how emerging technologies, social shifts, and systemic changes could reshape the world.
              </p>
            </div>
          </section>

          {/* Section 2: What Makes It Different */}
          <section>
            <h2 className="text-xl md:text-2xl font-light mb-8 text-foreground">
              What Makes It Different
            </h2>
            <div className="max-w-2xl space-y-4 text-base md:text-lg text-muted leading-relaxed">
              <p>
                Focused on systems, not predictions.
              </p>
              <p>
                Grounded in real research and historical precedent.
              </p>
              <p>
                Designed to provoke understanding, not fear.
              </p>
            </div>
          </section>

          {/* Section 3: What WTFiction Is Not */}
          <section>
            <h2 className="text-xl md:text-2xl font-light mb-8 text-foreground">
              What WTFiction Is Not
            </h2>
            <div className="max-w-2xl space-y-4 text-base md:text-lg text-muted leading-relaxed">
              <p>
                WTFiction is not a prediction engine, a political platform, or a definitive forecast of the future.
              </p>
            </div>
          </section>

          {/* Section 4: How to Use the Site */}
          <section>
            <h2 className="text-xl md:text-2xl font-light mb-8 text-foreground">
              How to Use the Site
            </h2>
            <div className="max-w-2xl space-y-4 text-base md:text-lg text-muted leading-relaxed">
              <p>
                Each scenario can be watched directly on the site or on YouTube.
              </p>
              <p>
                References and sources are provided for those who want to explore the ideas further.
              </p>
            </div>
          </section>

          {/* Section 5: Editorial Intent & Responsibility */}
          <section>
            <h2 className="text-xl md:text-2xl font-light mb-8 text-foreground">
              Editorial Intent & Responsibility
            </h2>
            <div className="max-w-2xl space-y-4 text-base md:text-lg text-muted leading-relaxed">
              <p>
                Scenarios are constructed using publicly available research, reporting, and data. Sources are cited where possible, and uncertainty is acknowledged where it exists.
              </p>
            </div>
          </section>

          {/* Section 6: Minimal Creator Credit (Restrained) */}
          <section className="pt-8 border-t border-[#272727]">
            <div className="max-w-2xl space-y-4 text-sm text-muted/70 leading-relaxed">
              <p>
                WTFiction is produced independently.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
