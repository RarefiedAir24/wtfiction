export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-medium mb-12 text-foreground">
          About
        </h1>

        <div className="space-y-12">
          {/* Brand Narrative */}
          <section>
            <h2 className="text-xl md:text-2xl font-medium mb-6 text-foreground">
              What WTFiction Is
            </h2>
            <div className="space-y-4 text-base md:text-lg text-muted leading-relaxed max-w-3xl">
              <p>
                WTFiction is a speculative storytelling project that explores what happens when the systems we rely on break, evolve, or disappear. Each episode examines a single scenario — grounded in real science, economics, and geopolitics — and follows the consequences forward.
              </p>
              <p>
                This is not entertainment. It's analysis. We use scenario-based reasoning to trace domino effects, revealing how interconnected systems respond under stress.
              </p>
            </div>
          </section>

          {/* What It Is Not */}
          <section>
            <h2 className="text-xl md:text-2xl font-medium mb-6 text-foreground">
              What It Is Not
            </h2>
            <div className="space-y-3 text-base text-muted leading-relaxed max-w-3xl">
              <p>
                <strong className="text-foreground">Not news.</strong> These scenarios are hypotheticals, not current events.
              </p>
              <p>
                <strong className="text-foreground">Not predictions.</strong> We're not forecasting the future. We're stress-testing assumptions.
              </p>
              <p>
                <strong className="text-foreground">Not political advocacy.</strong> No agenda. No solutions. Only consequences.
              </p>
              <p>
                <strong className="text-foreground">Not science fiction.</strong> Every scenario is anchored in real research, real data, real constraints.
              </p>
            </div>
          </section>

          {/* Methodology */}
          <section>
            <h2 className="text-xl md:text-2xl font-medium mb-6 text-foreground">
              Methodology
            </h2>
            <div className="space-y-4 text-base text-muted leading-relaxed max-w-3xl">
              <p>
                Each scenario begins with research: academic papers, government reports, industry analysis, historical precedents. We cross-reference sources across disciplines — economics, engineering, sociology, geopolitics.
              </p>
              <p>
                Then we map consequences. Not just first-order effects, but second and third-order impacts. How does one change cascade? What breaks? What adapts? What emerges?
              </p>
              <p>
                The goal isn't to scare — it's to understand. By examining extreme scenarios, we reveal the hidden dependencies and assumptions that underpin modern civilization.
              </p>
            </div>
          </section>

          {/* Tone & Approach */}
          <section>
            <h2 className="text-xl md:text-2xl font-medium mb-6 text-foreground">
              Tone & Approach
            </h2>
            <div className="space-y-3 text-base text-muted leading-relaxed max-w-3xl">
              <p>
                WTFiction is serious, not sensational. We avoid hype language, clickbait framing, and alarmist rhetoric. The scenarios speak for themselves.
              </p>
              <p>
                We present facts, trace logic, and let viewers draw their own conclusions. No "smash that like button" energy. No emojis. No buzzwords.
              </p>
              <p>
                Think: Netflix explainer meets The Atlantic meets early Vox. Calm. Intelligent. Speculative, not sensational.
              </p>
            </div>
          </section>

          {/* Trust Signals */}
          <section className="pt-8 border-t border-[#272727]">
            <div className="space-y-3 text-sm text-muted leading-relaxed max-w-3xl">
              <p>
                Every episode includes a references page with citations. Sources are real, verifiable, and linked where possible.
              </p>
              <p>
                This site exists to anchor the brand off YouTube — to provide context, credibility, and a permanent home for the project. It's brand infrastructure, not a growth hack.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
