export default function SubscribePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-12 text-foreground">
          Subscribe
        </h1>

        <div className="space-y-12">
          {/* Email Signup */}
          <section>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-foreground">
              Email Updates
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              Get notified when new scenarios are released. No spam. No daily emails. Only new scenarios.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-800 text-foreground placeholder:text-muted focus:outline-none focus:border-zinc-700 transition-colors"
                disabled
              />
              <button
                type="submit"
                className="px-8 py-3 bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Subscribe
              </button>
            </form>
            <p className="text-sm text-muted mt-4 italic">
              Email signup coming soon. This is permission-based, not growth-at-all-costs.
            </p>
          </section>

          {/* YouTube Link */}
          <section className="pt-8 border-t border-zinc-800">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 text-foreground">
              YouTube Channel
            </h2>
            <p className="text-muted leading-relaxed mb-6">
              Subscribe on YouTube to never miss a new scenario.
            </p>
            <a
              href="https://www.youtube.com/@wtfiction"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
            >
              Subscribe on YouTube →
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
