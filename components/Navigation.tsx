import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-lg sm:text-xl font-serif font-semibold text-foreground hover:opacity-80 transition-opacity">
            WTFiction
          </Link>
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm">
            <Link href="/" className="text-muted hover:text-foreground transition-colors hidden sm:inline">
              Home
            </Link>
            <Link href="/scenarios" className="text-muted hover:text-foreground transition-colors">
              Scenarios
            </Link>
            <Link href="/about" className="text-muted hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/references" className="text-muted hover:text-foreground transition-colors hidden md:inline">
              References
            </Link>
            <Link href="/subscribe" className="text-foreground hover:opacity-80 transition-opacity">
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
