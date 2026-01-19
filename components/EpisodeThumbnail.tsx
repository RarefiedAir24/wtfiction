'use client';

import { useState } from 'react';

interface EpisodeThumbnailProps {
  thumbnailUrl: string;
  title: string;
  runtime?: string;
}

export default function EpisodeThumbnail({ thumbnailUrl, title, runtime }: EpisodeThumbnailProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="episode-thumbnail relative w-full aspect-video mb-5 overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#272727] to-[#1a1a1a]">
      {!imageError ? (
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-5xl text-muted/20">▶</div>
        </div>
      )}
      {runtime && (
        <div className="episode-runtime absolute bottom-3 right-3 px-2.5 py-1 text-xs text-foreground font-medium rounded">
          {runtime}
        </div>
      )}
    </div>
  );
}
