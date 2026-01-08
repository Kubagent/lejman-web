# Contact Page - Setup & Implementation Guide

## Overview

The contact page has been successfully implemented with all core functionality. The page is fully functional in development mode and ready for production once API credentials are configured.

**Route:** `/contact`

## Implementation Status

✅ **Completed:**
- Contact page UI with institutional design
- Contact form with Name, Email, Message fields
- Client-side validation
- Server-side validation and sanitization
- Rate limiting (5 submissions/hour/IP)
- Success/error states
- WCAG 2.1 AA accessibility compliance
- Responsive design (mobile-first)
- API route for form submission
- Resend email integration (placeholder ready)
- Cloudflare Turnstile integration (placeholder ready)

⏳ **Pending Configuration:**
- Cloudflare Turnstile credentials
- Resend API key
- Artist email address
- Gallery email address (optional)

---

## Features Implemented

### 1. Contact Form (FR-CONTACT-001)

**Required Fields:**
- Name (min 2 characters)
- Email (validated format)
- Message (min 10 characters)

**Validation:**
- Client-side validation with real-time error feedback
- Server-side validation for security
- Sanitization to prevent XSS attacks
- Email format validation
- Field length limits

### 2. Rate Limiting (FR-CONTACT-002)

**Configuration:**
- Maximum: 5 submissions per hour per IP address
- Tracks via client IP (Cloudflare-aware)
- User-friendly error messages with reset time
- In-memory storage (upgrade to Redis/KV for production)

**Note:** Cloudflare Turnstile integration is prepared but awaiting credentials.

### 3. Email Delivery (FR-CONTACT-003)

**Via Resend API:**
- Sends to artist email (required)
- CC to gallery email (optional)
- Professional HTML + plain text email
- Reply-to set to sender's email
- Development mode logs to console

---

## Environment Variables Setup

Add the following to your `.env.local` file:

```bash
# Resend API Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email Recipients
ARTIST_EMAIL=dominik@example.com
GALLERY_EMAIL=gallery@example.com  # Optional

# Cloudflare Turnstile (once available)
CLOUDFLARE_TURNSTILE_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_TURNSTILE_SITE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Getting API Keys

#### 1. Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use test mode)
3. Navigate to **API Keys** section
4. Create a new API key
5. Copy the key to `RESEND_API_KEY` in `.env.local`

**Pricing:** Free tier includes 3,000 emails/month

#### 2. Cloudflare Turnstile

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Turnstile** section
3. Create a new site
4. Choose "Managed" mode
5. Copy Site Key → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
6. Copy Secret Key → `CLOUDFLARE_TURNSTILE_SECRET`

**Note:** Turnstile is free and GDPR-compliant (no cookies).

---

## Testing

### Development Mode (Without Credentials)

The contact form works in development mode without API credentials:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to:** `http://localhost:3000/contact`

3. **Test form submission:**
   - Fill in all fields
   - Submit the form
   - Check console for logged message (email not sent)

### Testing Checklist

**Form Validation:**
- [ ] Submit empty form → See validation errors
- [ ] Enter invalid email → See email error
- [ ] Enter short name (< 2 chars) → See name error
- [ ] Enter short message (< 10 chars) → See message error
- [ ] Submit valid form → See success message

**Rate Limiting:**
- [ ] Submit 5 forms quickly
- [ ] 6th submission should show rate limit error
- [ ] Wait 1 hour, submit again → Should work

**Accessibility:**
- [ ] Tab through all fields with keyboard
- [ ] Submit with keyboard (Enter)
- [ ] Screen reader announces errors
- [ ] Focus indicators visible

**Responsive Design:**
- [ ] Test on mobile (< 768px)
- [ ] Test on tablet (768-1024px)
- [ ] Test on desktop (> 1024px)

---

## Adding Cloudflare Turnstile

Once you have the Turnstile credentials, follow these steps:

### 1. Install Turnstile Script

Add to `/app/layout.tsx` (inside `<head>`):

```tsx
<Script
  src="https://challenges.cloudflare.com/turnstile/v0/api.js"
  strategy="lazyOnload"
/>
```

### 2. Update ContactForm Component

Replace the placeholder comment in `/components/ContactForm.tsx` with:

```tsx
<div
  className="cf-turnstile"
  data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
  data-callback="onTurnstileSuccess"
/>
```

Add state for Turnstile token:

```tsx
const [turnstileToken, setTurnstileToken] = useState<string>('');

// Add to window object
useEffect(() => {
  (window as any).onTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };
}, []);
```

Include token in form submission:

```tsx
body: JSON.stringify({
  ...formData,
  turnstileToken,
}),
```

### 3. Verify Token in API Route

Uncomment and implement in `/app/api/contact/route.ts`:

```typescript
async function verifyTurnstile(token: string): Promise<boolean> {
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
        response: token,
      }),
    }
  );

  const data = await response.json();
  return data.success;
}

// In POST handler, after parsing body:
const { turnstileToken } = body;

if (!turnstileToken) {
  return NextResponse.json(
    { error: 'Security verification failed' },
    { status: 400 }
  );
}

const isValidTurnstile = await verifyTurnstile(turnstileToken);
if (!isValidTurnstile) {
  return NextResponse.json(
    { error: 'Security verification failed' },
    { status: 400 }
  );
}
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Add environment variables to production (Cloudflare Pages)
- [ ] Verify domain configured for Resend
- [ ] Update `from` email in API route to use actual domain
- [ ] Test Turnstile in production environment
- [ ] Configure rate limiting with Redis/Cloudflare KV (optional)
- [ ] Set up error monitoring (Sentry, etc.)

### Environment Variables in Cloudflare Pages

1. Go to your Cloudflare Pages project
2. Navigate to **Settings** → **Environment Variables**
3. Add all variables from `.env.local`
4. Deploy

### Domain Configuration for Resend

In Resend dashboard:
1. Add your domain (e.g., `dlejman.com`)
2. Add DNS records (SPF, DKIM, DMARC)
3. Verify domain
4. Update API route to use verified domain:
   ```typescript
   from: 'Contact Form <noreply@dlejman.com>'
   ```

---

## Design Specifications

### Typography
- Headings: Cormorant Garamond, 600 weight
- Body: Inter, 400 weight
- Labels: Uppercase, tracking-wide, 14px

### Colors
- Background: White (#FFFFFF)
- Text: Black (#000000), Dark Gray (#333333), Mid Gray (#999999)
- Borders: Light Gray (#E5E5E5)
- Focus: Blue (#3B82F6)
- Error: Red (#DC2626)
- Success: Green (#059669)

### Spacing
- Mobile: 24px margins
- Tablet: 48px margins
- Desktop: 96px margins
- Max width: 768px (3xl)
- Input padding: 12px (py-3)
- Form gap: 32px (space-y-8)

### Accessibility
- WCAG 2.1 AA compliant
- Semantic HTML (`<form>`, `<label>`, `<input>`)
- ARIA labels on all form fields
- Error messages with `role="alert"`
- Focus indicators (2px blue ring)
- Required field indicators
- Keyboard accessible

---

## File Structure

```
/app/
  /contact/
    page.tsx                    # Contact page component
  /api/
    /contact/
      route.ts                  # Form submission API endpoint

/components/
  ContactForm.tsx               # Contact form component

.env.local                      # Environment variables (not in git)
```

---

## Troubleshooting

### Form not submitting

1. Check browser console for errors
2. Verify API route is working: `curl -X POST http://localhost:3000/api/contact`
3. Check Network tab in DevTools

### Emails not sending

1. Verify `RESEND_API_KEY` is set correctly
2. Check Resend dashboard for delivery logs
3. Verify domain is configured (production only)
4. Check API route console logs

### Rate limiting not working

1. Rate limiting is IP-based
2. In development, localhost may always show same IP
3. Test from different devices/networks
4. Check browser console for rate limit messages

### Turnstile not appearing

1. Verify script is loaded: Check Network tab
2. Check `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set
3. Verify Turnstile is enabled for your domain
4. Check browser console for Turnstile errors

---

## Security Considerations

### Implemented

- ✅ Input sanitization (removes HTML tags)
- ✅ Email format validation
- ✅ Rate limiting (5/hour/IP)
- ✅ HTTPS required (production)
- ✅ CORS headers (Next.js default)
- ✅ Content-Type validation
- ✅ Field length limits

### TODO (Production)

- [ ] Add Cloudflare Turnstile verification
- [ ] Implement Redis/KV for distributed rate limiting
- [ ] Add CSP headers
- [ ] Set up error monitoring
- [ ] Add honeypot field (optional)
- [ ] Configure WAF rules (Cloudflare)

---

## Future Enhancements

**Considered but not implemented (keep simple for now):**

1. **Attachment uploads** - Not needed per PRD
2. **Phone number field** - Email preferred
3. **Subject line field** - Adds complexity
4. **Auto-reply to sender** - Can be added later
5. **CRM integration** - Overkill for artist portfolio
6. **Localization** - Will be added with i18n (Week 6)

---

## Support

**Issues or Questions:**

1. Check this documentation first
2. Review PRD requirements (Section 7: FR-CONTACT-*)
3. Test in development mode first
4. Check browser console and server logs

---

**Implementation Date:** November 25, 2025
**Status:** ✅ Complete - Ready for API credentials
**Next Steps:** Configure Resend API key and Cloudflare Turnstile
