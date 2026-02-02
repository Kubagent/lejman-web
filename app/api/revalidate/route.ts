import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Sanity Webhook Handler for On-Demand Revalidation
 *
 * This endpoint receives webhooks from Sanity when content changes
 * and triggers cache revalidation for the affected pages.
 *
 * Setup in Sanity:
 * 1. Go to https://www.sanity.io/manage/project/YOUR_PROJECT_ID/api/webhooks
 * 2. Create a new webhook with:
 *    - URL: https://your-domain.com/api/revalidate
 *    - Secret: (generate a secure secret and add to SANITY_WEBHOOK_SECRET env var)
 *    - Trigger on: Create, Update, Delete
 *    - Filter: Leave empty to trigger on all document types, or specify types
 */

// Document type to path mapping
const pathsToRevalidate: Record<string, string[]> = {
  artwork: ['/works', '/'],
  project: ['/projects', '/'],
  riverVideo: ['/'],
  biography: ['/about'],
  siteSettings: ['/'],
  interview: ['/about'],
  publication: ['/about'],
  writtenWork: ['/writings'],
  pressKit: ['/about'],
  link: ['/about'],
};

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret
    const secret = request.headers.get('sanity-webhook-secret');
    const expectedSecret = process.env.SANITY_WEBHOOK_SECRET;

    if (!expectedSecret) {
      console.error('[Revalidate] SANITY_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { message: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    if (secret !== expectedSecret) {
      console.error('[Revalidate] Invalid webhook secret');
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const body = await request.json();
    const { _type, slug } = body;

    console.log(`[Revalidate] Received webhook for type: ${_type}, slug: ${slug?.current || 'N/A'}`);

    // Get paths to revalidate based on document type
    const paths = pathsToRevalidate[_type] || ['/'];

    // Revalidate the general paths for this content type
    for (const path of paths) {
      console.log(`[Revalidate] Revalidating path: ${path}`);
      revalidatePath(path);
    }

    // If the document has a slug, also revalidate its specific page
    if (slug?.current) {
      let specificPath = '';

      if (_type === 'artwork') {
        specificPath = `/works/${slug.current}`;
      } else if (_type === 'project') {
        specificPath = `/projects/${slug.current}`;
      } else if (_type === 'writtenWork') {
        specificPath = `/writings/${slug.current}`;
      }

      if (specificPath) {
        console.log(`[Revalidate] Revalidating specific path: ${specificPath}`);
        revalidatePath(specificPath);
      }
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: _type,
      paths: paths,
    });
  } catch (error) {
    console.error('[Revalidate] Error processing webhook:', error);
    return NextResponse.json(
      { message: 'Error processing webhook', error: String(error) },
      { status: 500 }
    );
  }
}

// Also support GET for testing the endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Sanity revalidation webhook endpoint',
    status: 'active',
    usage: 'POST with sanity-webhook-secret header',
  });
}
