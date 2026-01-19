// Analytics event tracking
// This can be connected to Google Analytics, Vercel Analytics, or any tracking service

export type AnalyticsEvent = 
  | { type: 'youtube_click'; url: string }
  | { type: 'email_signup'; email: string }
  | { type: 'scenario_click'; scenarioId: string; title: string }
  | { type: 'nav_click'; page: string }
  | { type: 'cta_click'; cta: string; location: string };

export function trackEvent(event: AnalyticsEvent) {
  // In production, replace with your analytics service
  // Examples: Google Analytics, Vercel Analytics, Plausible, etc.
  
  if (typeof window === 'undefined') return;
  
  // Log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }
  
  // Example: Google Analytics 4
  // if (window.gtag) {
  //   window.gtag('event', event.type, {
  //     ...event
  //   });
  // }
  
  // Example: Vercel Analytics
  // if (window.va) {
  //   window.va('track', event.type, event);
  // }
  
  // Example: Plausible
  // if (window.plausible) {
  //   window.plausible(event.type, { props: event });
  // }
}

// Convenience functions
export function trackYouTubeClick(url: string) {
  trackEvent({ type: 'youtube_click', url });
}

export function trackEmailSignup(email: string) {
  trackEvent({ type: 'email_signup', email });
}

export function trackScenarioClick(scenarioId: string, title: string) {
  trackEvent({ type: 'scenario_click', scenarioId, title });
}

export function trackNavClick(page: string) {
  trackEvent({ type: 'nav_click', page });
}

export function trackCTAClick(cta: string, location: string) {
  trackEvent({ type: 'cta_click', cta, location });
}
