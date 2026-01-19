import Link from 'next/link';
import Logo from './Logo';

export default function Navigation() {
  return (
    <nav className="border-b border-[#272727] bg-[#0f0f0f]/95 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8 text-sm">
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
            <Link href="/subscribe" className="text-foreground hover:opacity-80 transition-opacity font-medium">
              Subscribe
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
