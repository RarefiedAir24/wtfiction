'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getScenarioById, scenarios } from '@/data/scenarios';
import { references } from '@/data/references';

interface PostWatchContinuationProps {
  scenarioId?: string;
  onDismiss?: () => void;
}

export default function PostWatchContinuation({ scenarioId, onDismiss }: PostWatchContinuationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (scenarioId) {
      // Show after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [scenarioId]);

  if (!scenarioId || isDismissed) return null;

  const currentScenario = getScenarioById(scenarioId);
  const scenarioReferences = references.find(r => r.episodeId === scenarioId);
  const hasReferences = scenarioReferences && scenarioReferences.citations.length > 0;

  // Get next scenario (simple: just get next in list)
  const currentIndex = scenarios.findIndex((s) => s.id === scenarioId);
  const nextScenario = currentIndex >= 0 && currentIndex < scenarios.length - 1 
    ? scenarios[currentIndex + 1] 
    : null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-500 ease-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-6">
        <div className="bg-gradient-to-r from-[#1a1a1a] via-[#0f0f0f] to-[#1a1a1a] border border-[#3ea6ff]/30 rounded-xl shadow-2xl p-6 backdrop-blur-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Continue Exploring
              </h3>
              <p className="text-sm text-muted/80">
                What would you like to do next?
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted hover:text-foreground transition-colors text-xl font-light"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Next Scenario */}
            {nextScenario && (
              <Link
                href={`/scenarios/${nextScenario.id}`}
                onClick={handleDismiss}
                className="group p-4 bg-[#0a0a0a] border border-[#272727] rounded-lg hover:border-[#3ea6ff]/50 hover:bg-[#0f0f0f] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#3ea6ff]/10 flex items-center justify-center group-hover:bg-[#3ea6ff]/20 transition-colors">
                    <svg className="w-5 h-5 text-[#3ea6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-foreground">Next Scenario</span>
                </div>
                <p className="text-xs text-muted/70 line-clamp-2">{nextScenario.title}</p>
              </Link>
            )}

            {/* Explore References */}
            {hasReferences && (
              <Link
                href={`/scenarios/${scenarioId}#references`}
                onClick={handleDismiss}
                className="group p-4 bg-[#0a0a0a] border border-[#272727] rounded-lg hover:border-[#3ea6ff]/50 hover:bg-[#0f0f0f] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#3ea6ff]/10 flex items-center justify-center group-hover:bg-[#3ea6ff]/20 transition-colors">
                    <svg className="w-5 h-5 text-[#3ea6ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-foreground">Explore References</span>
                </div>
                <p className="text-xs text-muted/70">View sources and citations</p>
              </Link>
            )}

            {/* Subscribe */}
            <Link
              href="/subscribe"
              onClick={handleDismiss}
              className="group p-4 bg-gradient-to-br from-[#3ea6ff]/10 to-[#2d8fdd]/10 border border-[#3ea6ff]/30 rounded-lg hover:border-[#3ea6ff]/50 hover:from-[#3ea6ff]/20 hover:to-[#2d8fdd]/20 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3ea6ff] to-[#2d8fdd] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-foreground">Subscribe</span>
              </div>
              <p className="text-xs text-muted/70">Get future scenario updates</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
