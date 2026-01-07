import { NextRequest, NextResponse } from 'next/server';

// Configure for Edge Runtime (required for Cloudflare Pages)
export const runtime = 'edge';

/**
 * Rate limiting storage (in-memory, replace with Redis/KV for production)
 * Format: { ip: { count: number, resetTime: number } }
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limit configuration
 * PRD Requirement: FR-CONTACT-002 - 5 submissions per hour per IP
 */
const RATE_LIMIT = {
  MAX_REQUESTS: 5,
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
};

/**
 * Check rate limit for IP address
 */
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // Clean up expired records
  if (record && record.resetTime < now) {
    rateLimitStore.delete(ip);
  }

  // Get or create record
  const current = rateLimitStore.get(ip);

  if (!current) {
    // First request
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT.WINDOW_MS,
    });
    return { allowed: true };
  }

  if (current.count >= RATE_LIMIT.MAX_REQUESTS) {
    // Rate limit exceeded
    return { allowed: false, resetTime: current.resetTime };
  }

  // Increment count
  current.count += 1;
  rateLimitStore.set(ip, current);

  return { allowed: true };
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  // Check Cloudflare headers first
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  // Check X-Forwarded-For
  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  // Fallback to X-Real-IP
  const xRealIP = request.headers.get('x-real-ip');
  if (xRealIP) return xRealIP;

  // Default fallback
  return 'unknown';
}

/**
 * Sanitize input to prevent XSS and injection attacks
 */
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 5000); // Limit length
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Send email via Resend
 * PRD Requirement: FR-CONTACT-003 - Email to artist + gallery via Resend
 */
async function sendEmail(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const ARTIST_EMAIL = process.env.ARTIST_EMAIL || 'artist@example.com';
  const GALLERY_EMAIL = process.env.GALLERY_EMAIL;

  // Check if Resend is configured
  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured. Email will not be sent.');
    // In development, just log the message
    if (process.env.NODE_ENV === 'development') {
      console.log('===== CONTACT FORM SUBMISSION (DEV MODE) =====');
      console.log('From:', data.name, `<${data.email}>`);
      console.log('Message:', data.message);
      console.log('Would send to:', ARTIST_EMAIL, GALLERY_EMAIL ? `and ${GALLERY_EMAIL}` : '');
      console.log('==============================================');
      return;
    }
    throw new Error('Email service not configured');
  }

  // Prepare recipients
  const recipients = [ARTIST_EMAIL];
  if (GALLERY_EMAIL) {
    recipients.push(GALLERY_EMAIL);
  }

  // Send email via Resend API
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Contact Form <noreply@dominiklejman.com>', // Update domain when configured
      to: recipients,
      reply_to: data.email,
      subject: `New Contact Form Submission from ${data.name}`,
      html: `
        <html>
          <body style="font-family: sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #000;">New Contact Form Submission</h2>

            <p><strong>From:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>

            <h3 style="color: #000; margin-top: 24px;">Message:</h3>
            <p style="white-space: pre-wrap;">${data.message}</p>

            <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />

            <p style="font-size: 14px; color: #999;">
              This message was sent from the contact form on dominiklejman.com
            </p>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission

From: ${data.name}
Email: ${data.email}

Message:
${data.message}

---
This message was sent from the contact form on dominiklejman.com
      `.trim(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * POST /api/contact
 *
 * Contact form submission endpoint
 *
 * Requirements:
 * - FR-CONTACT-001: Fields: Name, Email, Message (all required)
 * - FR-CONTACT-002: Rate limiting (5/hour/IP)
 * - FR-CONTACT-003: Email delivery via Resend
 *
 * TODO: Add Cloudflare Turnstile verification once credentials are available
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);

    // Check rate limit
    const rateLimitCheck = checkRateLimit(clientIP);
    if (!rateLimitCheck.allowed) {
      const resetTime = rateLimitCheck.resetTime || Date.now();
      const minutesUntilReset = Math.ceil((resetTime - Date.now()) / (60 * 1000));

      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please try again in ${minutesUntilReset} minute${minutesUntilReset !== 1 ? 's' : ''}.`,
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate field types and lengths
    if (typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    if (typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(name),
      email: sanitizeInput(email),
      message: sanitizeInput(message),
    };

    // TODO: Verify Cloudflare Turnstile token once configured
    // const turnstileToken = body.turnstileToken;
    // await verifyTurnstile(turnstileToken);

    // Send email
    await sendEmail(sanitizedData);

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    return NextResponse.json(
      {
        error: 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact (Method not allowed)
 */
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
