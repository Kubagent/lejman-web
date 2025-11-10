# DOMINIK L. - ARTIST PORTFOLIO WEBSITE
## Product Requirements Document (PRD) - Streamlined Version

**Version:** 1.0  
**Date:** November 4, 2025  
**Duration:** 8 weeks (Nov 4 - Dec 29, 2025)  
**Approach:** Claude Code (AI-assisted development)

---

## EXECUTIVE SUMMARY

### Project Overview
Professional digital portfolio for visual artist Dominik L., functioning as institutional archive and living portfolio. Showcases painting, digital media, and motion-based work.

### Core Vision
**"A digital white cube where motion meets stillness"**

Contemplative digital space with institutional-grade design, leveraging web's temporal capabilities through moving image.

### Key Features
- **River Module** - 5 auto-playing videos in continuous scroll
- **Archive** - 30-50 artworks with filtering/search
- **Exhibition History** - 20+ documented shows
- **Multi-language** - EN primary, DE/PL to follow
- **Gallery Integration** - Molski Gallery footer credit + contact forwarding

### Technical Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **CMS:** Sanity (Free Tier) + Mux video
- **Hosting:** Cloudflare Pages (Free)
- **Email:** Resend (Free, 3K/month)
- **Analytics:** Cloudflare Web Analytics (GDPR-compliant)
- **Cost:** $0-15/month (domain + potential Mux overage)

---

## 1. GOALS & SUCCESS CRITERIA

### Business Goals (Year 1)
| Goal | Measurement | Target |
|------|-------------|--------|
| Institutional Visibility | Gallery inquiries | 3-5 serious contacts |
| Exhibition Opportunities | Curator contacts | 2-3 discussions |
| Archive Completeness | Works documented | 100% of 30-50 selected |

### Technical Goals
- Core Web Vitals: 90+ all metrics
- LCP < 2.5s
- Video start < 1s
- Uptime: 99.9%

### Launch Criteria (Must Have)
✅ River functional on desktop/mobile  
✅ 30+ artworks uploaded  
✅ 20 exhibitions documented  
✅ Navigation working  
✅ Contact form functional  
✅ Core Web Vitals > 80  
✅ No critical accessibility violations  
✅ GDPR compliant  

---

## 2. SCROLL & MOTION PHILOSOPHY

### Core Principles
1. **Motion as Content** - Every animation serves purpose
2. **User Agency** - Users control pace
3. **Performance as Aesthetic** - 60fps, < 100ms feedback

### River Behavior
**Desktop:**
- Auto-play when 50% visible
- Pause when < 20% visible
- No looping (freeze on last frame)
- Muted by default, unmute option available

**Mobile:**
- Tap-to-play posters only
- Videos download on demand
- Returns to poster after play

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
  .river-video { display: none; }
  .river-poster { display: block; }
}
```

---

## 3. VISUAL IDENTITY

### Design Principles
1. **Digital White Cube** - Neutral space, artworks breathe
2. **Institutional Authority** - Museum-quality presentation
3. **Hierarchy Through Scale** - Size/spacing, not color
4. **Precision & Alignment** - 8px grid system
5. **Progressive Disclosure** - Show only what's needed

### Grid System
- Desktop: 12 columns (max 1440px)
- Tablet: 6 columns (768-1024px)
- Mobile: 4 columns (<768px)
- Base unit: 24px (spacing: 8, 16, 24, 48, 96px)

### Responsive Breakpoints
| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| River | Tap-to-play | Auto 70vh | Auto 80vh |
| Archive | 1 col | 2-3 cols | 3-4 cols |
| Typography | 16px base | 18px | 18px |
| Margins | 24px | 48px | 96px |

---

## 4. TYPOGRAPHY

### Recommended: Cormorant Garamond + Inter
- **Headings:** Cormorant Garamond 600
- **Body:** Inter 400

### Scale
```
Desktop:
H1: 48px / 1.2 / 600
H2: 36px / 1.3 / 600
H3: 24px / 1.4 / 600
Body: 18px / 1.6 / 400

Mobile:
H1: 32px / 1.2 / 600
H2: 24px / 1.3 / 600
Body: 16px / 1.6 / 400
```

### Loading
```html
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<style>
  @font-face {
    font-family: 'Inter';
    font-display: swap;
  }
</style>
```

---

## 5. COLOR PALETTE

### Monochrome System
```css
:root {
  --white: #FFFFFF;
  --near-white: #FAFAFA;
  --light-gray: #E5E5E5;
  --mid-gray: #999999;
  --dark-gray: #333333;
  --black: #000000;
  
  --error: #DC2626;
  --success: #059669;
  --focus: #3B82F6;
}
```

### Contrast Ratios (WCAG AA)
- Black on White: 21:1 (AAA)
- Dark Gray on White: 12.6:1 (AAA)
- Mid Gray on White: 2.8:1 (AA, 18px+)

---

## 6. SITE ARCHITECTURE

### Site Map
```
HOME (River)
├── WORKS (Archive + Individual Pages)
├── EXHIBITIONS (List + Individual Pages)
├── BIOGRAPHY
├── TIMELINE
├── TEXTS (List + Individual Pages)
└── CONTACT
```

### Navigation
**Top Bar (Always Visible):**
- Left: "Dominik L." (→ home)
- Right: Menu (☰) + Language [EN]

**Menu Overlay:**
- Full-screen white overlay (98% opacity)
- Centered links to all sections
- Language switcher
- Gallery credit link

---

## 7. FUNCTIONAL REQUIREMENTS (CONSOLIDATED)

### River Module
- **FR-RIVER-001:** Auto-play videos on scroll (50% trigger, 20% pause)
- **FR-RIVER-002:** Progressive loading (Video 1 preloads, others lazy load)
- **FR-RIVER-003:** Mobile tap-to-play with posters
- **FR-RIVER-004:** Keyboard nav (↑↓ scroll, Space pause, Esc menu)

### Archive
- **FR-ARCHIVE-001:** Responsive grid (4/3/1 cols)
- **FR-ARCHIVE-002:** Grid/List toggle
- **FR-ARCHIVE-003:** Year filter (dropdown, URL param)
- **FR-ARCHIVE-004:** Medium filter (combines with year)
- **FR-ARCHIVE-005:** Real-time title search (300ms debounce, 2 char min)

### Artwork Pages
- **FR-ARTWORK-001:** High-res images (max 960px, edge-to-edge mobile)
- **FR-ARTWORK-002:** Lightbox mode (full-screen, keyboard nav)
- **FR-ARTWORK-003:** Complete metadata (title, year, medium, dimensions, description)

### Contact Form
- **FR-CONTACT-001:** Fields: Name, Email, Message (all required)
- **FR-CONTACT-002:** Cloudflare Turnstile + rate limiting (5/hour/IP)
- **FR-CONTACT-003:** Email to artist + gallery via Resend

---

## 8. NON-FUNCTIONAL REQUIREMENTS (CONSOLIDATED)

### Performance
- FCP < 1.8s, LCP < 2.5s, TTI < 3.5s
- Core Web Vitals "Good" (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- Video start < 1s (95th percentile)

### Scalability
- Support 500 artworks, 100 exhibitions, 2000 images
- Handle 1000+ concurrent users, 50K+ daily views

### Reliability
- 99.9% uptime (max 8.76hr/year downtime)
- Graceful error handling (cached content fallback)
- 30-day Sanity backups (RTO < 4hr)

### Security
- HTTPS only (HSTS, TLS 1.3)
- CSP headers configured
- Form: Turnstile + rate limiting + sanitization
- GDPR compliant (no cookies, anonymized analytics)

### Compatibility
- **Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Devices:** iPhone 12+, Galaxy S21+, iPad 2020+, laptops/desktops
- **Screen Readers:** NVDA, JAWS, VoiceOver, TalkBack (latest)

---

## 9. ACCESSIBILITY (WCAG 2.1 AA)

### Implementation Checklist
- ✅ Alt text: `[Title], [Year], [Medium], [Artist]`
- ✅ Keyboard accessible (Tab, Enter, Space, Esc, ↑↓)
- ✅ Focus indicators: `outline: 2px solid #3B82F6`
- ✅ ARIA labels on interactive elements
- ✅ Language declared: `<html lang="en">`
- ✅ Skip links ("Skip to main content")
- ✅ Reduced motion support (static posters)

### Key Patterns
```html
<button aria-label="Open navigation menu" aria-expanded="false">
  ☰
</button>

<video aria-label="Untitled Series III, 2024, video by Dominik L.">
  <track kind="captions" src="captions-en.vtt" />
</video>
```

---

## 10. CONTENT MANAGEMENT (SANITY)

### Setup
```bash
npm install -g @sanity/cli
sanity init
# Project: lejman-web
# Datasets: production, development
```

### Key Schemas

**Artwork:**
```javascript
{
  title: { en, de, pl },
  slug: string,
  year: number,
  medium: { en, de, pl },
  dimensions: { width, height, depth },
  images: array[image],
  description: { en, de, pl },
  exhibitions: array[reference]
}
```

**River Video:**
```javascript
{
  title: { en, de, pl },
  video: mux.video,
  order: number (1-5),
  description: { en, de, pl }
}
```

**Site Settings (Singleton):**
```javascript
{
  artistName: string,
  contactEmail: email,
  galleryEmail: email,
  galleryName: { en, de, pl },
  galleryUrl: url
}
```

### Content Entry Workflow
1. **Week 1:** Site settings + biography
2. **Week 2-3:** River videos (5 videos)
3. **Week 3-6:** Artworks (progressive, 30-50)
4. **Week 4-6:** Exhibitions (20+)

### Image Guidelines
- **Artworks:** JPEG/PNG, 2000px min, sRGB, <10MB
- **Videos:** MP4/MOV, 1080p min, 45-90s, <5GB

---

## 11. ANALYTICS & SEO

### Analytics (Cloudflare)
```html
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "TOKEN"}'></script>
```
- No cookies, IP anonymized, GDPR compliant
- Auto tracks: views, visitors, referrers, devices

### SEO Implementation

**Meta Tags:**
```javascript
<title>{title} | Dominik L.</title>
<meta name="description" content={description} />
<meta property="og:title" content={title} />
<meta property="og:image" content={image} />
<link rel="canonical" href={url} />
<link rel="alternate" hrefLang="en" href={`/en${url}`} />
```

**Structured Data:**
```json
{
  "@type": "VisualArtwork",
  "name": "Untitled Series III",
  "creator": { "@type": "Person", "name": "Dominik L." },
  "dateCreated": "2024",
  "artMedium": "Oil on canvas"
}
```

**Sitemap + Robots:**
```
# robots.txt
User-agent: *
Allow: /
Disallow: /studio
Sitemap: https://dominikl.com/sitemap.xml
```

---

## 12. TESTING STRATEGY

### Manual Testing Focus
- **Cross-browser:** Chrome, Firefox, Safari, Edge, iOS Safari, Android
- **Accessibility:** Keyboard nav, screen readers (NVDA, VoiceOver), contrast
- **Performance:** Lighthouse CI (90+ target)
- **Security:** Form injection attempts, rate limiting, npm audit

### Automated (Minimal)
```bash
# Critical utils only
npx axe http://localhost:3000
npx lighthouse http://localhost:3000 --view
```

### Core Web Vitals
- LCP < 2.5s ✅
- FID < 100ms ✅
- CLS < 0.1 ✅

---

## 13. DEVELOPMENT ROADMAP (8 WEEKS)

| Week | Focus |
|------|-------|
| 1 | Setup (Next.js, Sanity, fonts, colors, components) |
| 2-3 | River module + navigation + responsive |
| 4-5 | Archive, exhibitions, biography, timeline, texts, contact |
| 6 | Content population + SEO + i18n |
| 7 | Optimization + testing + accessibility |
| 8 | Launch prep + go-live |

---

## 14. LAUNCH CHECKLIST

### Pre-Launch (1 Week Before)
**Technical:**
- [ ] Code merged, no console errors
- [ ] Lighthouse 90+, accessibility passed
- [ ] SSL active, DNS configured
- [ ] Analytics verified, backups ready

**Content:**
- [ ] River videos uploaded
- [ ] 20+ artworks, 10+ exhibitions
- [ ] Biography complete
- [ ] Contact info correct

**SEO:**
- [ ] Meta titles/descriptions unique
- [ ] Structured data implemented
- [ ] Sitemap submitted

### Launch Day
```bash
git push origin main  # Auto-deploys to Cloudflare
```
- [ ] Monitor deployment (30 min)
- [ ] Test all pages + forms + mobile
- [ ] Verify analytics tracking

### Post-Launch
- **24hrs:** Monitor every 2-3 hours
- **Week 1:** Daily checks (uptime, errors, analytics)
- **Monthly:** Analytics report, dependency updates, SEO progress

---

## 15. TECHNICAL REFERENCE

### Environment Variables
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
CLOUDFLARE_TURNSTILE_SECRET=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=https://dominikl.com
```

### Project Structure
```
lejman-web/
├── app/[locale]/          # Pages (river, works, exhibitions, etc.)
├── components/            # Reusable UI (RiverVideo, Header, etc.)
├── lib/                   # Utils (sanity, design-tokens)
├── sanity/schemas/        # CMS schemas (artwork, exhibition, etc.)
├── public/fonts/          # Self-hosted fonts
└── .env.local            # Environment vars
```

### Key Commands
```bash
npm run dev              # Next.js + Sanity dev
npm run build            # Production build
npm test                 # Run tests
npm run lint             # Check code
```

### Video Specs (River)
- Duration: 45-90s
- Format: MP4 (H.264)
- Resolution: 1080p (1920×1080)
- Frame Rate: 24/30fps
- Bitrate: 8-12 Mbps
- File Size: 60-135 MB

### Gallery Integration (Molski)
```javascript
// Footer credit + contact forwarding
{settings.galleryName[locale] && (
  <a href={settings.galleryUrl}>
    Supported by {settings.galleryName[locale]}
  </a>
)}

// Contact form recipients
const recipients = [
  settings.contactEmail,
  settings.galleryEmail  // Easily removable
];
```

---

## DOCUMENT CONTROL

**Version:** 1.0 - November 4, 2025  
**Status:** Ready for development  
**Next Review:** Weekly during development  

**Change Process:**
1. Submit change request with rationale
2. Assess timeline/scope impact
3. Approve/reject with documentation
4. Update PRD if approved

---

**END OF STREAMLINED PRD**

*This document is optimized for token efficiency while preserving all essential requirements. Reference sections as needed during Claude Code development.*
