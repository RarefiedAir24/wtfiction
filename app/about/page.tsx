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
            About WTFiction
          </h1>
          <div className="h-px w-24 bg-gradient-to-r from-[#3ea6ff]/50 to-transparent mt-6"></div>
        </div>

        <div className="space-y-20">
          {/* Section 1: What WTFiction Is (Primary) - Enhanced */}
          <section className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#3ea6ff]/20 via-[#3ea6ff]/10 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-light mb-10 text-foreground tracking-tight">
              What WTFiction Is
            </h2>
            <div className="max-w-2xl space-y-6">
              <p className="text-xl md:text-2xl text-foreground leading-relaxed font-light">
                WTFiction is a speculative documentary series that explores how emerging technologies, social shifts, and systemic changes could reshape the world.
              </p>
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
                  Systems-first, not predictions. We explore how structures behave when critical constraints shift.
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#3ea6ff]/40 group-hover:bg-[#3ea6ff]/60 transition-colors flex-shrink-0"></div>
                <p className="text-base md:text-lg text-muted leading-relaxed group-hover:text-foreground/90 transition-colors">
                  Grounded in research. Episodes are built from publicly available data, historical precedent, and expert sources.
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#3ea6ff]/40 group-hover:bg-[#3ea6ff]/60 transition-colors flex-shrink-0"></div>
                <p className="text-base md:text-lg text-muted leading-relaxed group-hover:text-foreground/90 transition-colors">
                  Purposeful, not fearful. We aim to illuminate implications — not stir alarm or speculation.
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
                  WTFiction is not a forecasting tool, a political platform, or a claim about what will happen.
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
              <p className="text-base md:text-lg text-muted leading-relaxed">
                You can watch each scenario directly on this site or on YouTube. After watching, explore the references to understand the evidence and assumptions behind the idea.
              </p>
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
                  We seek out peer-reviewed studies, institutionally produced datasets, and primary reporting when available. When uncertainty exists, we acknowledge it.
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
