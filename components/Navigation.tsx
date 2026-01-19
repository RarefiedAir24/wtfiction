import Link from 'next/link';
import Logo from './Logo';

export default function Navigation() {
  return (
    <nav className="border-b border-refined bg-[#0f0f0f]/98 backdrop-blur-xl sticky top-0 z-50 supports-[backdrop-filter]:bg-[#0f0f0f]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="hover:opacity-80 transition-opacity flex items-center">
            <Logo />
          </Link>
          <div className="flex items-center gap-6 sm:gap-8 md:gap-10 text-sm">
            <Link href="/" className="text-muted hover:text-foreground transition-colors hidden sm:inline font-medium">
              Home
            </Link>
            <Link href="/scenarios" className="text-muted hover:text-foreground transition-colors font-medium">
              Scenarios
            </Link>
            <Link href="/about" className="text-muted hover:text-foreground transition-colors font-medium">
              About
            </Link>
            <Link href="/references" className="text-muted hover:text-foreground transition-colors hidden md:inline font-medium">
              References
            </Link>
            <Link href="/subscribe" className="text-foreground hover:opacity-80 transition-opacity font-semibold">
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
