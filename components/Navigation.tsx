'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
}

function NavLink({ href, children, className = '', isActive = false }: NavLinkProps) {
  return (
    <Link 
      href={href} 
      className={`relative group ${className}`}
    >
      <span className={`relative z-10 transition-all duration-300 ease-out ${
        isActive 
          ? 'text-foreground font-semibold' 
          : 'text-muted hover:text-foreground font-medium'
      }`}>
        {children}
      </span>
      {/* Animated underline for active state */}
      {isActive && (
        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#3ea6ff] to-[#2d8fdd] rounded-full"></span>
      )}
      {/* Hover underline animation - only show when not active */}
      {!isActive && (
        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#3ea6ff] to-[#2d8fdd] rounded-full transition-all duration-300 ease-out group-hover:w-full"></span>
      )}
      {/* Subtle background glow on hover - only show on hover, not active */}
      {!isActive && (
        <span className="absolute -inset-x-2 -inset-y-1 rounded-md bg-[#3ea6ff]/5 scale-0 group-hover:scale-100 transition-transform duration-300 ease-out -z-10"></span>
      )}
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  
  // Determine active state for each link
  const isHomeActive = pathname === '/';
  const isScenariosActive = pathname?.startsWith('/scenarios');
  const isAboutActive = pathname === '/about';
  const isReferencesActive = pathname === '/references';
  const isSubscribeActive = pathname === '/subscribe';

  return (
    <nav className="border-b border-refined bg-[#0f0f0f]/98 backdrop-blur-xl sticky top-0 z-50 supports-[backdrop-filter]:bg-[#0f0f0f]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link 
            href="/" 
            className="hover:opacity-90 transition-all duration-300 ease-out flex items-center group"
          >
            <span className="transform group-hover:scale-105 transition-transform duration-300 ease-out">
              <Logo />
            </span>
          </Link>
          <div className="flex items-center gap-6 sm:gap-8 md:gap-10 text-sm">
            <NavLink 
              href="/" 
              isActive={isHomeActive}
              className="hidden sm:inline"
            >
              Home
            </NavLink>
            <NavLink 
              href="/scenarios" 
              isActive={isScenariosActive}
            >
              Scenarios
            </NavLink>
            <NavLink 
              href="/about" 
              isActive={isAboutActive}
            >
              About
            </NavLink>
            <NavLink 
              href="/references" 
              isActive={isReferencesActive}
              className="hidden md:inline"
            >
              References
            </NavLink>
            <Link 
              href="/subscribe" 
              className="relative group px-4 py-2 rounded-lg bg-gradient-to-r from-[#3ea6ff] to-[#2d8fdd] text-white font-semibold hover:shadow-lg hover:shadow-[#3ea6ff]/30 transition-all duration-300 ease-out transform hover:scale-105 hover:-translate-y-0.5 overflow-hidden"
            >
              <span className="relative z-10">Subscribe</span>
              {/* Shine effect on hover - contained within button */}
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"></span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
