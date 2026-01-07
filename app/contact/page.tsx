import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

/**
 * Generate metadata for the contact page
 */
export const metadata: Metadata = {
  title: 'Contact - Dominik Lejman',
  description: 'Get in touch with artist Dominik Lejman for inquiries, exhibition proposals, and artwork information.',
  openGraph: {
    title: 'Contact - Dominik Lejman',
    description: 'Get in touch with artist Dominik Lejman',
    type: 'website',
  },
};

/**
 * Contact Page
 *
 * Features:
 * - Clean, institutional design following "white cube" aesthetic
 * - Contact form with validation
 * - Cloudflare Turnstile for spam protection
 * - Email delivery via Resend
 * - Responsive layout (mobile-first)
 * - WCAG 2.1 AA compliant
 *
 * Requirements (PRD):
 * - FR-CONTACT-001: Fields: Name, Email, Message (all required)
 * - FR-CONTACT-002: Cloudflare Turnstile + rate limiting (5/hour/IP)
 * - FR-CONTACT-003: Email to artist + gallery via Resend
 */
export default function ContactPage() {
  return (
    <div className="bg-white" style={{
      paddingLeft: '50px',
      paddingRight: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '1'
    }}>
      {/* Page Header and Form - Compact layout */}
      <div className="w-full" style={{ maxWidth: '1200px' }}>
        {/* Title - Center aligned */}
        <div className="text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-black mb-2">
            Contact
          </h1>

          {/* Subtitle / Description - Center aligned */}
          <p className="font-body leading-snug max-w-2xl mx-auto" style={{ color: 'rgba(0, 0, 0, 0.8)', fontSize: '0.9rem' }}>
            We welcome inquiries regarding artworks, projects, collaborations, and press materials. Please complete all fields below to ensure a prompt response.<br />
            All information provided will be treated confidentially and used exclusively to address your inquiry.
          </p>
        </div>

        {/* Spacer */}
        <div className="w-full bg-white" style={{ height: '20px' }} />

        {/* Centered Form - 3x wider than before */}
        <div className="w-full max-w-[840px] md:max-w-[960px] mx-auto">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
