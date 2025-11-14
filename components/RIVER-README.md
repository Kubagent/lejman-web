# River Video Component

## Overview
The River component displays 5 video slots in a vertical river layout on the homepage. Each video is sourced from Sanity CMS and maintains a 16:9 aspect ratio.

## Component Structure

### Files Created
1. `/components/River.tsx` - Main container component
2. `/components/RiverVideoSlot.tsx` - Individual video slot component
3. `/lib/types.ts` - TypeScript interfaces for all River types
4. `/lib/sanity/riverVideos.ts` - Data fetching utilities
5. `/lib/sanity/image.ts` - Sanity image URL builder
6. `/lib/sanity/file.ts` - Sanity file URL builder

### TypeScript Interfaces

```typescript
interface RiverVideo {
  _id: string;
  title: LocalizedText;
  order: number;
  videoFile: SanityFileAsset;
  posterImage: SanityImageAsset;
  description?: LocalizedText;
  year?: number;
}

interface RiverProps {
  videos: RiverVideo[];
  locale?: 'en' | 'de' | 'pl';
}

interface RiverVideoSlotProps {
  video: RiverVideo;
  locale?: 'en' | 'de' | 'pl';
  isInView?: boolean;
}
```

## Features Implemented

### 1. Layout
- Full-width vertical stack
- 5 video slots (sorted by order property)
- 16:9 aspect ratio maintained on all breakpoints
- Mobile-first responsive design

### 2. Video Element Setup
- HTML5 `<video>` tag with:
  - `muted` - Videos play silently by default
  - `loop` - Continuous playback
  - `playsInline` - Mobile Safari compatibility
  - `preload="metadata"` - Efficient loading
  - `poster` - Display image before video loads

### 3. Styling
- Uses Tailwind CSS 4 design tokens
- Typography: Cormorant Garamond (headings), Inter (body)
- Colors: Black overlays with gradient backgrounds
- Spacing: Consistent padding using design system values
- Responsive text sizes: Mobile (text-2xl) to Desktop (text-4xl)

### 4. Sanity Integration
- Fetches data using GROQ queries
- Generates optimized image URLs via `@sanity/image-url`
- Handles file asset URLs for video files
- Supports multilingual content (EN, DE, PL)

### 5. Accessibility
- Semantic HTML: `<article>`, `<section>` tags
- ARIA labels on video elements
- Alt text generated from video metadata
- Descriptive region labels

## Usage

### In Page Component
```tsx
import River from '@/components/River';
import { getRiverVideos } from '@/lib/sanity/riverVideos';

export default async function Home() {
  const videos = await getRiverVideos();

  return <River videos={videos} locale="en" />;
}
```

### Standalone Video Slot
```tsx
import RiverVideoSlot from '@/components/RiverVideoSlot';

<RiverVideoSlot
  video={videoData}
  locale="en"
  isInView={false}
/>
```

## Sanity CMS Schema
The component expects the following Sanity schema fields:

```typescript
{
  _id: string,
  title: {
    en: string,
    de: string,
    pl: string
  },
  order: number, // 1-5
  videoFile: {
    _type: 'file',
    asset: {
      _ref: string,
      _type: 'reference'
    }
  },
  posterImage: {
    _type: 'image',
    asset: {
      _ref: string,
      _type: 'reference'
    }
  },
  description?: {
    en: string,
    de: string,
    pl: string
  },
  year?: number
}
```

## What's Ready for Next Agents

### Performance Engineer
- Add Intersection Observer logic for lazy loading
- Implement autoplay triggers when videos enter viewport
- Add loading states and skeleton screens
- Optimize video preloading strategy
- Implement progressive enhancement

### Accessibility Specialist
- Add keyboard navigation controls (Space, Arrow keys)
- Implement focus management for video controls
- Add screen reader announcements for video state changes
- Create keyboard-accessible play/pause controls
- Test with assistive technologies

### Future Enhancements
- Smooth scroll navigation between videos
- Video progress indicators
- Custom video controls overlay
- Video quality selection
- Error handling and retry logic
- Analytics tracking for video engagement

## Design Tokens Used

### Colors
- `white`: #FFFFFF
- `black`: #000000
- `mid-gray`: #999999
- `dark-gray`: #333333

### Typography
- Heading: Cormorant Garamond
- Body: Inter

### Spacing
- Mobile padding: 24px (p-6)
- Desktop padding: 32px (p-8)

### Breakpoints
- Mobile: max 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## Known Limitations

### Current Implementation
1. Videos do NOT autoplay automatically (requires Intersection Observer)
2. No play/pause controls (planned for accessibility phase)
3. No loading states (planned for performance phase)
4. No error boundaries (planned for performance phase)

### Browser Compatibility
- HTML5 video support required
- Modern browsers only (ES6+)
- Safari requires `playsInline` attribute for mobile autoplay

## Testing Checklist
- [ ] TypeScript compilation passes
- [ ] Component renders with valid Sanity data
- [ ] Handles empty video array gracefully
- [ ] Videos display in correct order (1-5)
- [ ] Poster images load correctly
- [ ] Video metadata displays (title, year)
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Localization switches between EN/DE/PL

## Dependencies
- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- @sanity/client 7.x
- @sanity/image-url 1.x
- next-sanity 10.x

## Questions for Product Owner
1. Should videos autoplay when in view, or require user interaction?
2. Should there be a "watch all" mode that scrolls through automatically?
3. Do we need video duration indicators?
4. Should videos be muted by default (current) or have audio controls?
5. Do we need social sharing for individual videos?
