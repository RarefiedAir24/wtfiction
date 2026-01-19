# Analytics Setup Guide

WTFiction.com includes analytics event tracking infrastructure. All tracking is currently set to log events in development mode.

## Current Implementation

The site tracks the following events:
- **YouTube clicks**: When users click "Watch on YouTube" buttons
- **Email signups**: When users submit the email signup form
- **Scenario clicks**: When users click on scenario cards/links
- **Navigation clicks**: When users navigate between pages
- **CTA clicks**: When users click call-to-action buttons

## Setting Up Analytics

### Option 1: Vercel Analytics (Recommended)

Vercel Analytics is built-in and works automatically when deployed to Vercel.

1. Go to your Vercel project dashboard
2. Navigate to **Analytics** tab
3. Enable Vercel Analytics (free tier available)

Then update `/lib/analytics.ts`:

```typescript
// Add to trackEvent function
if (window.va) {
  window.va('track', event.type, event);
}
```

### Option 2: Google Analytics 4

1. Create a GA4 property
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add to `app/layout.tsx`:

```typescript
// Add before </head>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script
  dangerouslySetInnerHTML={{
    __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX');
    `,
  }}
/>
```

Then update `/lib/analytics.ts`:

```typescript
// Add to trackEvent function
if (window.gtag) {
  window.gtag('event', event.type, event);
}
```

### Option 3: Plausible Analytics

1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain
3. Add to `app/layout.tsx`:

```typescript
// Add before </head>
<script defer data-domain="wtfiction.com" src="https://plausible.io/js/script.js"></script>
```

Then update `/lib/analytics.ts`:

```typescript
// Add to trackEvent function
if (window.plausible) {
  window.plausible(event.type, { props: event });
}
```

## Event Types

All events are typed in `/lib/analytics.ts`. Current events:

- `youtube_click`: User clicked YouTube link
- `email_signup`: User submitted email form
- `scenario_click`: User clicked scenario card/link
- `nav_click`: User navigated to a page
- `cta_click`: User clicked a CTA button

## Testing

In development mode, all events are logged to the console. Check browser console to verify tracking is working.

## Privacy

All tracking respects user privacy. No personal data is collected beyond what's necessary for analytics. Email addresses are only tracked if you connect the form to an email service.
