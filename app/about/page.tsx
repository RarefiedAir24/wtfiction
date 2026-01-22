export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        {/* Header with subtle accent */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#3ea6ff]/30 to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-[#3ea6ff]/40"></div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#3ea6ff]/30 to-transparent"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-foreground tracking-tight" style={{ fontFamily: 'var(--font-title), system-ui, sans-serif' }}>
            About
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-[#3ea6ff]/50 to-transparent mt-6"></div>
        </div>

        <div className="space-y-20">
          {/* Section 1: What WTFiction Is (Primary) - Enhanced */}
          <section className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#3ea6ff]/20 via-[#3ea6ff]/10 to-transparent"></div>
            <div className="max-w-2xl space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#3ea6ff]/60 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-xl md:text-2xl text-foreground leading-relaxed font-light">
                    WTFiction is a speculative documentary series that explores how emerging technologies, social shifts, and systemic changes could reshape the world.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: What Makes It Different - Enhanced */}
          <section className="relative pt-8 border-t border-[#272727]">
            <div className="absolute -left-4 top-8 bottom-0 w-px bg-gradient-to-b from-[#3ea6ff]/20 via-[#3ea6ff]/10 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-light mb-10 text-foreground tracking-tight">
              What Makes It Different
            </h2>
            <div className="max-w-2xl space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#3ea6ff]/40 group-hover:bg-[#3ea6ff]/60 transition-colors flex-shrink-0"></div>
                <p className="text-base md:text-lg text-muted leading-relaxed group-hover:text-foreground/90 transition-colors">
                  Focused on systems, not predictions.
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#3ea6ff]/40 group-hover:bg-[#3ea6ff]/60 transition-colors flex-shrink-0"></div>
                <p className="text-base md:text-lg text-muted leading-relaxed group-hover:text-foreground/90 transition-colors">
                  Grounded in real research and historical precedent.
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#3ea6ff]/40 group-hover:bg-[#3ea6ff]/60 transition-colors flex-shrink-0"></div>
                <p className="text-base md:text-lg text-muted leading-relaxed group-hover:text-foreground/90 transition-colors">
                  Designed to provoke understanding, not fear.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: What WTFiction Is Not - Enhanced */}
          <section className="relative pt-8 border-t border-[#272727]">
            <div className="absolute -left-4 top-8 bottom-0 w-px bg-gradient-to-b from-[#3ea6ff]/20 via-[#3ea6ff]/10 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-light mb-10 text-foreground tracking-tight">
              What WTFiction Is Not
            </h2>
            <div className="max-w-2xl">
              <div className="relative pl-6 border-l-2 border-[#3ea6ff]/20">
                <p className="text-base md:text-lg text-muted leading-relaxed">
                  WTFiction is not a prediction engine, a political platform, or a definitive forecast of the future.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: How to Use the Site - Enhanced */}
          <section className="relative pt-8 border-t border-[#272727]">
            <div className="absolute -left-4 top-8 bottom-0 w-px bg-gradient-to-b from-[#3ea6ff]/20 via-[#3ea6ff]/10 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-light mb-10 text-foreground tracking-tight">
              How to Use the Site
            </h2>
            <div className="max-w-2xl space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1.5 flex-shrink-0">
                  <svg className="w-5 h-5 text-[#3ea6ff]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-base md:text-lg text-muted leading-relaxed">
                  Each scenario can be watched directly on the site or on YouTube.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1.5 flex-shrink-0">
                  <svg className="w-5 h-5 text-[#3ea6ff]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-base md:text-lg text-muted leading-relaxed">
                  References and sources are provided for those who want to explore the ideas further.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5: Editorial Intent & Responsibility - Enhanced */}
          <section className="relative pt-8 border-t border-[#272727]">
            <div className="absolute -left-4 top-8 bottom-0 w-px bg-gradient-to-b from-[#3ea6ff]/20 via-[#3ea6ff]/10 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-light mb-10 text-foreground tracking-tight">
              Editorial Intent & Responsibility
            </h2>
            <div className="max-w-2xl">
              <div className="relative pl-6 border-l-2 border-[#3ea6ff]/20 bg-[#0a0a0a]/30 p-6 rounded-r-lg">
                <p className="text-base md:text-lg text-muted leading-relaxed">
                  Scenarios are constructed using publicly available research, reporting, and data. Sources are cited where possible, and uncertainty is acknowledged where it exists.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6: Minimal Creator Credit (Restrained) - Enhanced */}
          <section className="relative pt-12 border-t border-[#272727]">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#272727] to-transparent"></div>
                <div className="text-xs text-muted/50 font-medium tracking-wider uppercase">Credits</div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#272727] to-transparent"></div>
              </div>
              <p className="text-sm text-muted/70 leading-relaxed">
                WTFiction is produced independently.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
