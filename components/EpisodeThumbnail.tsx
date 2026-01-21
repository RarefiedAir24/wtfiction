'use client';

import { useState } from 'react';

interface EpisodeThumbnailProps {
  thumbnailUrl: string;
  title: string;
  runtime?: string;
}

export default function EpisodeThumbnail({ thumbnailUrl, title, runtime }: EpisodeThumbnailProps) {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  // Phase 1: Visual Consistency - Better fallback handling
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    } else {
      setFallbackError(true);
    }
  };

  return (
    <div className="episode-thumbnail relative w-full aspect-video mb-5 overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#272727] to-[#1a1a1a] rounded-lg border border-[#272727]">
      {!imageError ? (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={handleImageError}
          loading="lazy"
        />
      ) : !fallbackError && thumbnailUrl.includes('youtube.com') ? (
        // Try high quality fallback
        <img
          src={thumbnailUrl.replace('maxresdefault', 'hqdefault')}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setFallbackError(true)}
          loading="lazy"
        />
      ) : (
        // Phase 1: Branded placeholder instead of generic gray
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#3ea6ff]/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-[#3ea6ff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="text-xs text-muted/60 line-clamp-2">{title}</p>
          </div>
        </div>
      )}
      {runtime && (
        <div className="episode-runtime absolute bottom-3 right-3 px-2.5 py-1 text-xs text-white font-medium rounded bg-black/70 backdrop-blur-sm">
          {runtime}
        </div>
      )}
    </div>
  );
}
