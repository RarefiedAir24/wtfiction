/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  // If it's already just a video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }

  return null;
}

/**
 * Generate YouTube thumbnail URL from video ID or URL
 */
export function getYouTubeThumbnail(videoIdOrUrl: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  let videoId = videoIdOrUrl;

  // If it's a full URL, extract the video ID
  if (videoIdOrUrl.includes('youtube.com') || videoIdOrUrl.includes('youtu.be')) {
    const extracted = getYouTubeVideoId(videoIdOrUrl);
    if (extracted) {
      videoId = extracted;
    }
  }

  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
    maxres: 'maxresdefault',
  };

  return `https://i.ytimg.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}

/** Add cache-bust param so updated YouTube thumbnails aren't served from browser cache */
export function withThumbnailCacheBust(url: string): string {
  if (!url || !/youtube\.com|ytimg\.com/.test(url)) return url;
  const withoutT = url.replace(/[?&]t=[^&]*/g, '').replace(/\?&/, '?').replace(/\?$/, '');
  const sep = withoutT.includes('?') ? '&' : '?';
  return `${withoutT}${sep}t=${Date.now()}`;
}

/** Use proxy URL so main site gets fresh thumbnail (bypasses CDN cache). Pass videoId when available. */
export function getThumbnailProxyUrl(videoId: string | null): string | null {
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) return null;
  return `/api/thumbnail/${videoId}`;
}

/**
 * Build YouTube embed URL with recommended parameters
 */
export function buildYouTubeEmbedUrl(videoId: string, autoplay: boolean = false): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
    origin: typeof window !== 'undefined' ? window.location.origin : 'https://wtfiction.com',
  });

  if (autoplay) {
    params.set('autoplay', '1');
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
