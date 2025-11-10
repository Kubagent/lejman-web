# PROJECT BRIEF FOR CLAUDE CODE
## Dominik L. Artist Portfolio Website

### **What to Build**
A professional artist portfolio website with:
- **River Module**: Homepage with 5 auto-playing videos in vertical scroll
- **Archive**: Searchable/filterable gallery of 30-50 artworks
- **Exhibitions**: Documented exhibition history with installation photos
- **Biography + Timeline + Texts + Contact**
- **Multi-language support** (EN/DE/PL)
- **CMS**: Sanity for content management

### **Tech Stack**
```bash
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS for styling
- Sanity CMS + Mux (video hosting)
- Cloudflare Pages (hosting)
- Resend (contact form emails)
```

### **Design Requirements**
- **Aesthetic**: Minimal institutional "white cube" gallery
- **Colors**: Monochrome only (black/white/grays)
- **Fonts**: Cormorant Garamond (headings) + Inter (body)
- **Performance**: Core Web Vitals 90+, LCP < 2.5s
- **Accessibility**: WCAG 2.1 AA compliant

### **Key Features Priority**
**P0 (Critical for launch):**
1. River module with scroll-triggered video playback
2. Responsive navigation with overlay menu
3. Archive with year/medium filters + search
4. Individual artwork pages with lightbox
5. Contact form with spam protection (Turnstile)
6. Mobile-responsive (tap-to-play videos on mobile)

**P1 (Important but can delay):**
7. Exhibition pages with galleries
8. Timeline + Texts sections
9. German/Polish translations
10. SEO optimization + structured data

### **Content Status**
- Currently using **placeholders** (real content arrives in ~2 weeks)
- Build with comprehensive placeholders, designed for easy content swap
- Sanity schemas ready for artist to populate

### **Development Approach**
1. **Week 1-2**: Core setup + River + Navigation
2. **Week 3-4**: Archive + Artwork pages + Contact form
3. **Week 5-6**: Exhibitions + Biography + Secondary pages
4. **Week 7**: Optimization + Testing + Accessibility
5. **Week 8**: Launch prep

### **Starting Point**
```bash
# Initialize project
npx create-next-app@latest lejman-web --typescript --tailwind --app
cd lejman-web

# Install dependencies
npm install @sanity/client @sanity/image-url next-sanity
npm install @mux/mux-player-react
npm install resend

# Initialize Sanity
npm create sanity@latest
```

### **First Tasks**
1. Set up Next.js 14 with TypeScript + Tailwind
2. Configure fonts (Cormorant Garamond + Inter, self-hosted)
3. Set up design tokens (colors, spacing, breakpoints)
4. Create basic layout (Header, Footer)
5. Build River module with placeholder videos
6. Implement navigation overlay
7. Set up Sanity project + basic schemas

### **Reference Documents**
- Full PRD: `PRD-streamlined.md` (for detailed specs)
- Design system: Colors, typography, spacing in Section 3-5
- Functional requirements: Section 7
- Sanity schemas: Section 10

### **Important Constraints**
- ⚠️ **No localStorage/sessionStorage** in client components (causes hydration errors)
- ⚠️ **Videos must be muted on autoplay** (browser requirement)
- ⚠️ **Self-host fonts** (faster than Google Fonts)
- ⚠️ **Free tier limits**: Mux ~100K minutes/month, Resend 3K emails/month
- ⚠️ **Accessibility**: Must support keyboard nav + screen readers

### **Success Criteria**
- Lighthouse score: 90+ on all metrics
- No console errors
- Works on Chrome, Firefox, Safari, Edge (last 2 versions)
- Mobile responsive (320px to 2560px)
- Passes WCAG 2.1 AA accessibility

### **Quick Commands Reference**
```bash
# Development
npm run dev              # Start Next.js dev server
cd sanity && sanity dev  # Start Sanity Studio

# Testing
npm run build            # Test production build
npm run lint             # Check code quality

# Deployment
git push origin main     # Auto-deploys to Cloudflare Pages
```

### **Contact/Questions**
- Artist: Dominik L.
- Gallery: Molski Gallery
- Developer: [You]

---

## **RECOMMENDED FIRST PROMPT FOR CLAUDE CODE**

```bash
claude code
```

Then paste:

```
I need to build a professional artist portfolio website. Please read the PRD-streamlined.md file in my project directory.

Start by:
1. Setting up Next.js 14 with TypeScript, Tailwind CSS, and App Router
2. Configuring self-hosted fonts (Cormorant Garamond + Inter)
3. Setting up design tokens (colors, spacing from PRD Section 5)
4. Creating basic layout structure (Header with logo + menu, Footer with gallery credit)
5. Building a placeholder River module (homepage) with 5 video slots using Intersection Observer

Use the PRD as reference for all design decisions. Focus on clean, institutional aesthetic with minimal UI. Let's build section by section starting with core infrastructure.
```

---

**Notes:**
- Keep this brief + the streamlined PRD in your project root
- Claude Code can read both files as context
- Reference specific PRD sections when asking for features
- Work iteratively: build → test → refine → next feature
