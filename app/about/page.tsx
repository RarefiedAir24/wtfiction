import Link from 'next/link';

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
          {/* Mission / Purpose Statement */}
          <section className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#3ea6ff]/20 via-[#3ea6ff]/10 to-transparent"></div>
            <div className="max-w-2xl space-y-6">
              <p className="text-xl md:text-2xl text-foreground leading-relaxed font-light">
                WTFiction exists to deepen our understanding of complex systems by exploring consequential scenarios before they unfold.
              </p>
            </div>
          </section>

          {/* Section 1: What WTFiction Is */}
          <section className="relative pt-8 border-t border-[#272727]">
            <div className="absolute -left-4 top-8 bottom-0 w-px bg-gradient-to-b from-[#3ea6ff]/20 via-[#3ea6ff]/10 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-light mb-10 text-foreground tracking-tight">
              What WTFiction Is
            </h2>
            <div className="max-w-2xl space-y-6">
              <p className="text-base md:text-lg text-muted leading-relaxed">
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
                  <strong className="text-foreground/90">Systems-first</strong> — we focus on structural implications rather than isolated events.
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#3ea6ff]/40 group-hover:bg-[#3ea6ff]/60 transition-colors flex-shrink-0"></div>
                <p className="text-base md:text-lg text-muted leading-relaxed group-hover:text-foreground/90 transition-colors">
                  <strong className="text-foreground/90">Research-grounded</strong> — episodes are built from publicly available data, credible sources, and historical context.
                </p>
              </div>
              <div className="flex items-start gap-4 group">
                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-[#3ea6ff]/40 group-hover:bg-[#3ea6ff]/60 transition-colors flex-shrink-0"></div>
                <p className="text-base md:text-lg text-muted leading-relaxed group-hover:text-foreground/90 transition-colors">
                  <strong className="text-foreground/90">Insight-oriented</strong> — we aim for clarity and understanding, not fear or sensationalism.
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
                  WTFiction is not a predictive model, a political platform, nor a claim about what will happen.
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
            <div className="max-w-2xl space-y-4">
              <p className="text-base md:text-lg text-muted leading-relaxed">
                Watch each scenario here or on YouTube.
              </p>
              <p className="text-base md:text-lg text-muted leading-relaxed">
                After watching, use the provided references to explore the underlying evidence and assumptions.
              </p>
            </div>
          </section>

          {/* Section 5: Editorial Intent & Responsibility - Enhanced */}
          <section className="relative pt-8 border-t border-[#272727]">
            <div className="absolute -left-4 top-8 bottom-0 w-px bg-gradient-to-b from-[#3ea6ff]/20 via-[#3ea6ff]/10 to-transparent"></div>
            <h2 className="text-2xl md:text-3xl font-light mb-10 text-foreground tracking-tight">
              Editorial Intent & Responsibility
            </h2>
            <div className="max-w-2xl space-y-6">
              <div className="relative pl-6 border-l-2 border-[#3ea6ff]/20 bg-[#0a0a0a]/30 p-6 rounded-r-lg">
                <p className="text-base md:text-lg text-muted leading-relaxed">
                  Where possible, we prioritize peer-reviewed work, institutional reports, and primary data; ambiguous areas are acknowledged openly.
                </p>
              </div>
              <div className="pt-2">
                <Link 
                  href="/references" 
                  className="inline-flex items-center gap-2 text-base text-[#3ea6ff] hover:text-[#4eb5ff] transition-colors group"
                >
                  <span>Explore the sources behind our scenarios</span>
                  <svg 
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* Section 6: Credits & Connect - Enhanced */}
          <section className="relative pt-12 border-t-2 border-[#272727]">
            <div className="max-w-2xl space-y-8">
              {/* Credits */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#272727] to-transparent"></div>
                  <div className="text-xs text-muted/50 font-medium tracking-wider uppercase">Credits</div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#272727] to-transparent"></div>
                </div>
                <p className="text-sm text-muted/70 leading-relaxed">
                  WTFiction is produced independently.
                </p>
              </div>

              {/* Connect */}
              <div className="pt-4 border-t border-[#272727]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#272727] to-transparent"></div>
                  <div className="text-xs text-muted/50 font-medium tracking-wider uppercase">Connect</div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#272727] to-transparent"></div>
                </div>
                <div>
                  <a 
                    href="https://www.youtube.com/@WTFictionTV" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors group"
                  >
                    <span>YouTube Channel</span>
                    <svg 
                      className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
