'use client';

import { trackYouTubeClick, trackCTAClick, trackScenarioClick } from '@/lib/analytics';

interface TrackedExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  eventType?: 'youtube' | 'cta' | 'scenario';
  ctaName?: string;
  location?: string;
  scenarioId?: string;
  scenarioTitle?: string;
}

export default function TrackedExternalLink({ 
  href, 
  children, 
  className, 
  eventType = 'youtube',
  ctaName,
  location,
  scenarioId,
  scenarioTitle
}: TrackedExternalLinkProps) {
  const handleClick = () => {
    if (eventType === 'youtube') {
      trackYouTubeClick(href);
    } else if (eventType === 'cta' && ctaName && location) {
      trackCTAClick(ctaName, location);
    } else if (eventType === 'scenario' && scenarioId && scenarioTitle) {
      trackScenarioClick(scenarioId, scenarioTitle);
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
