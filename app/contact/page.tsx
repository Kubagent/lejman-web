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
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="py-12 md:py-16 lg:py-20">
        {/* Title - Left aligned with margin */}
        <div className="px-6 md:px-12 lg:px-24">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-black mb-6 ml-8">
            Contact
          </h1>

          {/* Subtitle / Description - Left aligned with margin */}
          <p className="font-body text-lg md:text-xl text-dark-gray leading-relaxed mb-12 md:mb-16 max-w-2xl ml-8">
            For inquiries about artworks, exhibitions, or press materials, please use the form below.
            I aim to respond within 2-3 business days.
          </p>
        </div>

        {/* Centered Form - Narrow width with large margins on both sides */}
        <div className="max-w-lg mx-auto px-6">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
