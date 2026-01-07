import { NextRequest, NextResponse } from 'next/server';

// Configure for Edge Runtime (required for Cloudflare Pages)
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images folder
     */
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};

export function middleware(request: NextRequest) {
  // Get credentials from environment variables
  const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || 'lejman';
  const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || 'Phantoms';

  // Skip auth check if credentials are not set (disable auth)
  if (!BASIC_AUTH_USER || !BASIC_AUTH_PASSWORD) {
    return NextResponse.next();
  }

  // Get the authorization header
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    // No credentials provided - request authentication
    return new NextResponse('Authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Beta Access"',
      },
    });
  }

  // Parse the authorization header
  const auth = authHeader.split(' ')[1];
  const [user, password] = Buffer.from(auth, 'base64').toString().split(':');

  // Check credentials
  if (user === BASIC_AUTH_USER && password === BASIC_AUTH_PASSWORD) {
    // Credentials are correct - allow request
    return NextResponse.next();
  }

  // Invalid credentials
  return new NextResponse('Invalid credentials', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Beta Access"',
    },
  });
}
