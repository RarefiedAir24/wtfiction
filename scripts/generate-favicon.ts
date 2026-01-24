/**
 * Generate gradient favicon PNG from brand colors
 */

import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generateFavicon() {
  const size = 32;
  
  // Create gradient using SVG
  const svg = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3ea6ff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" rx="6" fill="url(#gradient)"/>
    </svg>
  `;

  // Generate PNG from SVG
  const pngBuffer = await sharp(Buffer.from(svg))
    .png()
    .resize(size, size)
    .toBuffer();

  // Save to public directory
  const outputPath = join(process.cwd(), 'public', 'favicon.png');
  writeFileSync(outputPath, pngBuffer);
  
  console.log(`✅ Generated favicon.png at ${outputPath}`);
  
  // Also generate ICO format (multi-size)
  const icoSizes = [16, 32];
  const icoBuffers = await Promise.all(
    icoSizes.map(size => 
      sharp(Buffer.from(svg))
        .png()
        .resize(size, size)
        .toBuffer()
    )
  );
  
  // For ICO, we'll just use the 32x32 PNG as favicon.ico
  // (Most modern browsers accept PNG as .ico)
  const icoPath = join(process.cwd(), 'app', 'favicon.ico');
  writeFileSync(icoPath, icoBuffers[1]); // Use 32x32
  
  console.log(`✅ Generated favicon.ico at ${icoPath}`);
}

generateFavicon().catch(console.error);
