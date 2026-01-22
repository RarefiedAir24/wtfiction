'use client';

import { useState } from 'react';

interface ReferenceSummaryProps {
  url?: string;
  title?: string;
  authors?: string[];
  type?: string;
  existingDescription?: string;
}

export default function ReferenceSummary({ 
  url, 
  title, 
  authors, 
  type,
  existingDescription 
}: ReferenceSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(!!existingDescription);
  const [hasSummarized, setHasSummarized] = useState(false); // Track if user has clicked summarize in this session

  const handleSummarize = async () => {
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/summarize-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          title,
          authors,
          type,
        }),
      });

      const data = await response.json();

      if (data.summary) {
        setSummary(data.summary);
        setIsExpanded(true);
        setHasSummarized(true); // Mark that user has summarized
        setError(null); // Clear any previous errors
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to generate summary. Please try again.');
      console.error('Error summarizing:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // If no URL, can't summarize
  if (!url) {
    // Still show existing description if available
    if (existingDescription) {
      return (
        <div className="text-muted text-sm leading-relaxed">
          {existingDescription}
        </div>
      );
    }
    return null;
  }

  // Show description (existing or generated) with option to regenerate
  return (
    <div className="space-y-2">
      {(summary || existingDescription) && isExpanded ? (
        <div className="text-muted text-sm leading-relaxed">
          {summary || existingDescription}
        </div>
      ) : (
        <button
          onClick={handleSummarize}
          disabled={isLoading}
          className="inline-flex items-center gap-2 text-xs text-[#3ea6ff] hover:text-[#2d8fdd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <>
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{hasSummarized ? 'Resummarizing...' : 'Summarizing...'}</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{hasSummarized ? 'Resummarize' : 'Summarize'}</span>
            </>
          )}
        </button>
      )}
      {/* Show regenerate option when description exists */}
      {(summary || existingDescription) && isExpanded && (
        <button
          onClick={handleSummarize}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 text-xs text-[#3ea6ff] hover:text-[#2d8fdd] transition-colors disabled:opacity-50 disabled:cursor-not-allowed group mt-1"
        >
          {isLoading ? (
            <>
              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Resummarizing...</span>
            </>
          ) : (
            <>
              <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Resummarize</span>
            </>
          )}
        </button>
      )}
      {error && (
        <div className="text-xs text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}
