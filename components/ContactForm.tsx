'use client';

import { useState, FormEvent } from 'react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  submit?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * ContactForm Component
 *
 * Features:
 * - Name, Email, Message fields (all required)
 * - Client-side validation
 * - Cloudflare Turnstile integration (placeholder)
 * - Success/error states
 * - Rate limiting (5 submissions/hour/IP on backend)
 * - Institutional design aesthetic
 * - Full keyboard accessibility
 * - WCAG 2.1 AA compliant
 *
 * Requirements:
 * - FR-CONTACT-001: Fields: Name, Email, Message (all required)
 * - FR-CONTACT-002: Cloudflare Turnstile + rate limiting
 * - FR-CONTACT-003: Email delivery via Resend
 */
export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  /**
   * Validate email format
   */
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Reset previous errors
    setErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
      });

      // Reset error after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrors({});
      }, 5000);
    }
  };

  /**
   * Handle input changes
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block font-body text-sm uppercase tracking-wide text-mid-gray mb-2"
        >
          Name <span className="text-error" aria-label="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={`w-full px-4 py-3 font-body text-base text-black border-0 ${
            errors.name ? 'bg-red-50' : 'bg-[#FAFAFA]'
          } focus:outline-none focus:bg-[#F0F0F0] transition-colors`}
          placeholder="Your full name"
          disabled={status === 'submitting'}
        />
        {errors.name && (
          <p id="name-error" className="mt-2 text-sm text-error" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block font-body text-sm uppercase tracking-wide text-mid-gray mb-2"
        >
          Email <span className="text-error" aria-label="required">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`w-full px-4 py-3 font-body text-base text-black border-0 ${
            errors.email ? 'bg-red-50' : 'bg-[#FAFAFA]'
          } focus:outline-none focus:bg-[#F0F0F0] transition-colors`}
          placeholder="your.email@example.com"
          disabled={status === 'submitting'}
        />
        {errors.email && (
          <p id="email-error" className="mt-2 text-sm text-error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="message"
          className="block font-body text-sm uppercase tracking-wide text-mid-gray mb-2"
        >
          Message <span className="text-error" aria-label="required">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          aria-required="true"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          rows={8}
          className={`w-full px-4 py-3 font-body text-base text-black border-0 ${
            errors.message ? 'bg-red-50' : 'bg-[#FAFAFA]'
          } focus:outline-none focus:bg-[#F0F0F0] transition-colors resize-y`}
          placeholder="Your message..."
          disabled={status === 'submitting'}
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-sm text-error" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Cloudflare Turnstile Placeholder */}
      {/* TODO: Add Cloudflare Turnstile widget once credentials are available */}
      {/* <div className="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div> */}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={status === 'submitting' || status === 'success'}
          className="inline-flex items-center justify-center px-8 py-4 font-body text-base font-medium text-white bg-black hover:bg-[#333333] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={status === 'submitting' ? 'Sending message' : 'Send message'}
        >
          {status === 'submitting' && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
        </button>
      </div>

      {/* Success Message */}
      {status === 'success' && (
        <div
          className="p-4 bg-green-50"
          role="alert"
          aria-live="polite"
        >
          <p className="font-body text-sm text-green-800">
            Thank you for your message. I will get back to you within 2-3 business days.
          </p>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div
          className="p-4 bg-red-50"
          role="alert"
          aria-live="assertive"
        >
          <p className="font-body text-sm text-red-800">
            {errors.submit}
          </p>
        </div>
      )}

      {/* Form Info */}
      <p className="text-sm text-mid-gray font-body">
        All fields are required. Your information will be used solely to respond to your inquiry and will not be shared with third parties.
      </p>
    </form>
  );
}
