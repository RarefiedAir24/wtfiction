import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#272727] mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">WTFiction</h3>
            <p className="text-xs text-muted leading-relaxed max-w-xs">
              Speculative Scenarios Before They Happen
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Content</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/scenarios" className="text-muted hover:text-foreground transition-colors">
                  Scenarios
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/references" className="text-muted hover:text-foreground transition-colors">
                  References
                </Link>
              </li>
              <li>
                <Link href="/subscribe" className="text-muted hover:text-foreground transition-colors">
                  Subscribe
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Connect</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.youtube.com/@WTFictionTV"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-foreground transition-colors"
                >
                  YouTube Channel
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-[#272727] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-xs text-muted">
              © {new Date().getFullYear()} WTFiction. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <Link href="/about" className="text-muted hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="text-muted hover:text-foreground transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
