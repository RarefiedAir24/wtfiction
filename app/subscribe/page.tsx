export default function SubscribePage() {
  return (
    <main className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-12">
        <h1 className="text-2xl md:text-3xl font-medium mb-8 text-foreground">
          Subscribe
        </h1>

        <div className="space-y-8">
          {/* Email Signup */}
          <section>
            <h2 className="text-lg md:text-xl font-medium mb-4 text-foreground">
              Email Updates
            </h2>
            <p className="text-sm md:text-base text-muted leading-normal mb-4">
              Get notified when new scenarios are released. No spam. No daily emails. Only new scenarios.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 bg-[#272727] border border-[#272727] text-foreground placeholder:text-muted focus:outline-none focus:border-[#3f3f3f] transition-colors text-sm"
                disabled
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-foreground text-background font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                disabled
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-muted mt-3 italic">
              Email signup coming soon. This is permission-based, not growth-at-all-costs.
            </p>
          </section>

          {/* YouTube Link */}
          <section className="pt-6 border-t border-[#272727]">
            <h2 className="text-lg md:text-xl font-medium mb-4 text-foreground">
              YouTube Channel
            </h2>
            <p className="text-sm md:text-base text-muted leading-normal mb-4">
              Subscribe on YouTube to never miss a new scenario.
            </p>
            <a
              href="https://www.youtube.com/@WTFictionTV"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-foreground text-background font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Subscribe on YouTube →
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
