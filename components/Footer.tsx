import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-sm text-muted">
              © {new Date().getFullYear()} WTFiction. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm">
            <a
              href="https://www.youtube.com/@wtfiction"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-foreground transition-colors"
            >
              YouTube
            </a>
            <Link
              href="/about"
              className="text-muted hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/references"
              className="text-muted hover:text-foreground transition-colors"
            >
              References
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
