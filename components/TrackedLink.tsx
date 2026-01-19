'use client';

import Link from 'next/link';
import { trackNavClick } from '@/lib/analytics';

interface TrackedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function TrackedLink({ href, children, className, onClick }: TrackedLinkProps) {
  const handleClick = () => {
    trackNavClick(href);
    onClick?.();
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
