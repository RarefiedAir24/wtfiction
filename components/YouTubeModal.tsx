'use client';

import { useEffect, useRef, useState } from 'react';
import { getYouTubeVideoId, buildYouTubeEmbedUrl } from '@/lib/youtube';
import { trackVideoModalClose, trackWatchOnYouTubeClick } from '@/lib/analytics';
import TrackedExternalLink from './TrackedExternalLink';

interface YouTubeModalProps {
  videoUrl: string;
  title: string;
  logline?: string;
  isOpen: boolean;
  onClose: () => void;
  page?: string;
  placement?: string;
}

export default function YouTubeModal({ 
  videoUrl, 
  title, 
  logline,
  isOpen, 
  onClose,
  page = 'home',
  placement = 'card'
}: YouTubeModalProps) {
  const videoId = getYouTubeVideoId(videoUrl);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const openTimeRef = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Track open time for analytics
  useEffect(() => {
    if (isOpen && videoId) {
      openTimeRef.current = Date.now();
    }
  }, [isOpen, videoId]);

  // Lock body scroll and trap focus
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Focus close button for accessibility
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
      // Stop playback by unmounting iframe
      if (iframeRef.current) {
        iframeRef.current.src = '';
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleClose = () => {
    const watchIntentTime = openTimeRef.current 
      ? Date.now() - openTimeRef.current 
      : undefined;
    
    if (videoId) {
      trackVideoModalClose(videoId, watchIntentTime);
    }
    
    // Stop playback by clearing iframe src
    if (iframeRef.current) {
      iframeRef.current.src = '';
    }
    
    onClose();
  };

  const handleWatchOnYouTube = () => {
    if (videoId) {
      trackWatchOnYouTubeClick(videoId);
    }
  };

  if (!isOpen || !videoId) return null;

  const embedUrl = buildYouTubeEmbedUrl(videoId, true); // Autoplay after user click

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="youtube-modal fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        className="youtube-modal-content relative w-full max-w-[960px] mx-4 md:mx-6 bg-[#0a0a0a] rounded-[20px] shadow-2xl border border-[#272727] overflow-hidden md:overflow-visible"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with title and close */}
        <div className="flex items-start justify-between p-4 md:p-6 pb-4 border-b border-[#272727]">
          <div className="flex-1 pr-4">
            <h2 id="modal-title" className="text-lg md:text-xl font-medium text-foreground mb-1 line-clamp-1">
              {title}
            </h2>
            {logline && (
              <p className="text-sm text-muted line-clamp-1">
                {logline}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <TrackedExternalLink
              href={videoUrl}
              eventType="youtube"
              onClick={handleWatchOnYouTube}
              className="text-sm text-muted hover:text-foreground transition-colors hidden sm:inline"
            >
              Watch on YouTube
            </TrackedExternalLink>
            <button
              ref={closeButtonRef}
              onClick={handleClose}
              className="w-11 h-11 flex items-center justify-center text-foreground hover:text-muted transition-colors text-2xl font-light"
              aria-label="Close video"
            >
              ×
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            ref={iframeRef}
            width="100%"
            height="100%"
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
            loading="eager"
          />
        </div>
      </div>
    </div>
  );
}

