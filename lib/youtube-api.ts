/**
 * YouTube Data API v3 integration
 * Fetches video metadata from YouTube
 */

import { getYouTubeVideoId } from './youtube';

interface YouTubeVideoResponse {
  items: Array<{
    id: string;
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        maxres?: { url: string };
        high?: { url: string };
        default: { url: string };
      };
    };
    contentDetails: {
      duration: string; // ISO 8601 format (e.g., "PT15M33S")
    };
  }>;
}

/**
 * Convert ISO 8601 duration to MM:SS format
 */
function parseDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '00:00';
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Format publish date to YYYY-MM-DD
 */
function formatPublishDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

/**
 * Extract first sentence or first 200 chars from description as premise
 */
function extractPremise(description: string): string {
  // Try to get first sentence
  const firstSentence = description.split(/[.!?]\s/)[0];
  if (firstSentence.length > 50 && firstSentence.length < 300) {
    return firstSentence;
  }
  // Otherwise take first 200 chars
  return description.substring(0, 200).trim();
}

export interface VideoMetadata {
  title: string;
  description: string;
  premise: string;
  runtime: string;
  publishDate: string;
  thumbnailUrl: string;
}

/**
 * Fetch video metadata from YouTube Data API
 */
export async function fetchYouTubeVideoMetadata(
  videoId: string,
  apiKey: string
): Promise<VideoMetadata | null> {
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet,contentDetails`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status} ${response.statusText}`);
    }
    
    const data: YouTubeVideoResponse = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error(`Video not found: ${videoId}`);
    }
    
    const video = data.items[0];
    const snippet = video.snippet;
    const contentDetails = video.contentDetails;
    
    // Get best available thumbnail
    const thumbnailUrl = 
      snippet.thumbnails.maxres?.url ||
      snippet.thumbnails.high?.url ||
      snippet.thumbnails.default.url;
    
    return {
      title: snippet.title,
      description: snippet.description,
      premise: extractPremise(snippet.description),
      runtime: parseDuration(contentDetails.duration),
      publishDate: formatPublishDate(snippet.publishedAt),
      thumbnailUrl,
    };
  } catch (error) {
    console.error(`Error fetching video metadata for ${videoId}:`, error);
    return null;
  }
}

/**
 * Fetch metadata for multiple videos
 */
export async function fetchMultipleVideoMetadata(
  videoIds: string[],
  apiKey: string
): Promise<Map<string, VideoMetadata>> {
  const results = new Map<string, VideoMetadata>();
  
  // YouTube API allows up to 50 videos per request
  const batchSize = 50;
  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batch = videoIds.slice(i, i + batchSize);
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${batch.join(',')}&key=${apiKey}&part=snippet,contentDetails`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.error(`YouTube API error: ${response.status}`);
        continue;
      }
      
      const data: YouTubeVideoResponse = await response.json();
      
      if (data.items) {
        for (const video of data.items) {
          const snippet = video.snippet;
          const contentDetails = video.contentDetails;
          
          const thumbnailUrl = 
            snippet.thumbnails.maxres?.url ||
            snippet.thumbnails.high?.url ||
            snippet.thumbnails.default.url;
          
          results.set(video.id, {
            title: snippet.title,
            description: snippet.description,
            premise: extractPremise(snippet.description),
            runtime: parseDuration(contentDetails.duration),
            publishDate: formatPublishDate(snippet.publishedAt),
            thumbnailUrl,
          });
        }
      }
    } catch (error) {
      console.error(`Error fetching batch:`, error);
    }
  }
  
  return results;
}
