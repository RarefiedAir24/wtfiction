# WTFiction.com

The canonical home for the WTFiction brand — a minimal, premium website that anchors the brand off YouTube and converts curious viewers into subscribers.

## Features

- **5 Core Pages**: Home, Scenarios, About, References, Subscribe
- **Static Site**: Fast, SEO-friendly, no server required
- **Mobile-First**: Responsive design that works on all devices
- **Premium Typography**: Serif headings with clean sans-serif body text
- **Dark Theme**: High contrast, minimal aesthetic

## Tech Stack

- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Static Export** for deployment anywhere

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm start
```

The site will be available at `http://localhost:3000`

## Deployment

The site is configured for static export. After building, the `out` directory contains all static files that can be deployed to:

- **Vercel** (recommended): Just connect your repo
- **Netlify**: Deploy the `out` directory
- **GitHub Pages**: Deploy the `out` directory
- **Any static host**: Upload the `out` directory

## Content Management

### Adding Scenarios

Edit `/data/scenarios.ts` to add or update scenarios:

```typescript
{
  id: 'unique-id',
  title: 'What If...',
  premise: 'One sentence description',
  runtime: '18:42',
  youtubeUrl: 'https://www.youtube.com/watch?v=...',
  featured: true, // Shows on homepage
}
```

### Adding References

Edit `/data/references.ts` to add citations for episodes:

```typescript
{
  episodeId: 'unique-id', // Must match scenario id
  episodeTitle: 'Episode Title',
  citations: [
    'Source 1',
    'Source 2',
  ],
}
```

## Design System

- **Primary Font**: Crimson Pro (serif) for headings
- **Body Font**: Inter (sans-serif) for body text
- **Colors**: Dark background (#0a0a0a) with high contrast text
- **Spacing**: Consistent padding and margins throughout
- **Typography Scale**: Responsive heading sizes (4xl to 7xl)

## Project Structure

```
wtfiction/
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Home page
│   ├── scenarios/      # Scenarios archive
│   ├── about/          # About page
│   ├── references/     # References page
│   └── subscribe/      # Subscribe page
├── components/          # React components
│   ├── Navigation.tsx
│   └── Footer.tsx
├── data/               # Content data
│   ├── scenarios.ts
│   └── references.ts
└── public/             # Static assets
```

## Brand Guidelines

- **Tone**: Calm, intelligent, speculative (not sensational)
- **No**: Hype language, emojis, buzzwords, clickbait energy
- **Think**: Netflix explainer + The Atlantic + Vox (early days)

## Future Enhancements

These are planned but not yet implemented:

- Email signup functionality
- Scenario PDFs
- Sponsor landing pages
- Press kit
- Patreon / Membership hub

## License

Private project for WTFiction brand.
