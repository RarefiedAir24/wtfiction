import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy YouTube thumbnail so the server fetches with no-store,
 * bypassing CDN/browser cache so updated thumbnails show on the main site.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  const { videoId } = await params;
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: 'Invalid video ID' }, { status: 400 });
  }

  const url = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    return NextResponse.json({ error: 'Thumbnail not found' }, { status: 404 });
  }

  const blob = await res.arrayBuffer();
  return new NextResponse(blob, {
    headers: {
      'Content-Type': res.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
}
