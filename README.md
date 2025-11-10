# Lejman Web - Artist Portfolio

Professional digital portfolio for visual artist Dominik L., featuring a unique "River" module with scroll-triggered video playback, comprehensive artwork archive, and institutional-grade design.

## 🚀 Project Status

**Week 1 Setup - COMPLETED** ✅

### Completed Tasks:
- ✅ Next.js 14 with TypeScript, Tailwind CSS, App Router
- ✅ Design tokens (colors, spacing, breakpoints from PRD)
- ✅ Responsive layout components (Header, Footer, Navigation)
- ✅ Sanity CMS setup with 5 schemas
- ✅ Environment variables configuration
- ✅ Full-screen navigation overlay with keyboard support (Esc to close)
- ✅ Language switcher placeholder (EN/DE/PL)

### Next Steps (Week 2-3):
- Build River module with Intersection Observer
- Implement scroll-triggered video autoplay
- Add mobile tap-to-play functionality
- Complete responsive design

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16.0.1 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.x
- **CMS:** Sanity 4.3.0
- **Fonts:** Google Fonts (Cormorant Garamond + Inter) - temporary
- **Deployment:** Cloudflare Pages (coming soon)

---

## 📂 Project Structure

```
lejman-web/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage (River module)
│   ├── globals.css          # Global styles + design tokens
│   └── studio/              # Sanity Studio at /studio
│       └── [[...tool]]/page.tsx
├── components/
│   ├── Header.tsx           # Top navigation bar
│   ├── Footer.tsx           # Footer with gallery credit
│   ├── Navigation.tsx       # Full-screen menu overlay
│   └── Layout.tsx           # Main layout wrapper
├── lib/
│   └── sanity/
│       ├── client.ts        # Sanity client configuration
│       └── queries.ts       # GROQ queries
├── sanity/
│   └── schemas/
│       ├── artwork.ts       # Artwork schema
│       ├── exhibition.ts    # Exhibition schema
│       ├── riverVideo.ts    # River video schema
│       ├── siteSettings.ts  # Site settings (singleton)
│       ├── text.ts          # Texts/essays schema
│       └── index.ts         # Schema export
├── .claude/
│   └── agents/              # 45 custom Claude Code agents
├── PRD-streamlined-Lejman.md
├── CLAUDE-CODE-BRIEF.md
└── README.md
```

---

## 🎨 Design System

### Colors
```css
--white: #FFFFFF
--near-white: #FAFAFA
--light-gray: #E5E5E5
--mid-gray: #999999
--dark-gray: #333333
--black: #000000
--error: #DC2626
--success: #059669
--focus: #3B82F6
```

### Typography
- **Headings:** Cormorant Garamond (600 weight)
- **Body:** Inter (400 weight)
- **Base size:** 18px (desktop), 16px (mobile)

### Spacing
- Base unit: 8px
- Scale: 8, 16, 24, 48, 96px

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: >= 1024px

---

## 🚦 Getting Started

### Prerequisites
- Node.js 22.11.0 (or compatible)
- npm 10.9.0

### Installation

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Set up Sanity project**:
   ```bash
   npx sanity init
   ```
   - Choose "Create new project"
   - Project name: `lejman-web`
   - Dataset: `production`
   - Copy the project ID

3. **Configure environment variables**:
   - Open `.env.local`
   - Add your Sanity project ID:
     ```
     NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
     ```

4. **Start development servers**:
   ```bash
   # Next.js (already running at http://localhost:3000)
   npm run dev

   # Sanity Studio (in new terminal)
   npx sanity dev
   ```

5. **Access the application**:
   - Frontend: http://localhost:3000
   - Sanity Studio: http://localhost:3000/studio

---

## 📋 Sanity Schemas

### 1. Artwork
- Multi-language title, medium, description (EN/DE/PL)
- Year, dimensions, images
- References to exhibitions

### 2. Exhibition
- Multi-language title, venue, description
- Start/end dates, location
- Type: Solo, Group, or Institutional
- Installation photos
- References to artworks shown

### 3. River Video
- Multi-language title, description
- Display order (1-5)
- Video file + poster image
- Year

### 4. Site Settings (Singleton)
- Artist name
- Contact/gallery emails
- Gallery name/URL (multi-language)
- Biography (multi-language)
- Meta descriptions for SEO

### 5. Text
- Multi-language title, content, excerpt
- Author, published date
- Category: Essay, Review, Interview, Statement

---

## 🎯 Current Features

### ✅ Implemented
- Responsive header with logo + menu button
- Full-screen navigation overlay
  - Links to all sections
  - Language switcher (EN/DE/PL)
  - Gallery credit
  - Keyboard support (Esc to close)
  - Smooth animations
- Footer with gallery credit link
- Sanity CMS Studio at `/studio`
- Complete schema structure for all content types

### 🚧 In Progress
- River module with scroll-triggered videos
- Archive page with filters/search
- Individual content pages

### 📅 Upcoming (Weeks 2-8)
See the full todo list (67 tasks) tracked via TodoWrite

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Navigation menu opens/closes with button
- [ ] Navigation closes with Esc key
- [ ] All navigation links work
- [ ] Responsive on mobile/tablet/desktop
- [ ] Focus indicators visible on keyboard navigation
- [ ] Footer gallery link opens in new tab

---

## 📝 Development Notes

### Important Constraints
- ⚠️ No localStorage/sessionStorage in client components (hydration errors)
- ⚠️ Videos must be muted on autoplay (browser requirement)
- ⚠️ Self-host fonts for better performance (TODO)
- ⚠️ Sanity free tier: ~100K API calls/month
- ⚠️ Next.js 16 is new - some packages use --legacy-peer-deps

### Custom Agents Available
45 specialized agents in `.claude/agents/`:
- **frontend-developer** - React components, responsive layouts
- **code-reviewer** - Code quality review
- **security-auditor** - Vulnerability scanning
- **performance-engineer** - Optimization
- And 41 more...

---

## 🔗 Key Resources

- [PRD (Full Specification)](./PRD-streamlined-Lejman.md)
- [Claude Code Brief](./CLAUDE-CODE-BRIEF.md)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📧 Contact

- **Artist:** Dominik L.
- **Gallery:** Molski Gallery
- **Developer:** [Your Name]

---

## 📜 License

ISC

---

**Last Updated:** November 10, 2025
**Version:** Week 1 Complete
