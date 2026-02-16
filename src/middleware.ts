import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Restricted countries (ISO 3166-1 alpha-2 codes)
const RESTRICTED_COUNTRIES: string[] = [
  // Add restricted country codes as needed
  // Example: 'XX'
];

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

// In-memory rate limit store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 60000);

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const path = request.nextUrl.pathname;

  // Get client IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  // Rate limiting
  const rateLimitKey = `${ip}:${path}`;
  const now = Date.now();
  const rateLimit = rateLimitStore.get(rateLimitKey);

  if (rateLimit && rateLimit.resetTime > now) {
    if (rateLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
      return new NextResponse('Too Many Requests', { status: 429 });
    }
    rateLimit.count++;
  } else {
    rateLimitStore.set(rateLimitKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
  }

  // Geoblocking (check country from headers - would need GeoIP in production)
  const country = request.headers.get('x-vercel-ip-country') || '';
  if (RESTRICTED_COUNTRIES.includes(country)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Content Security Policy
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https: blob:;
    font-src 'self' data:;
    connect-src 'self' https://api.stripe.com https://checkout.stripe.com;
    frame-src https://js.stripe.com https://hooks.stripe.com;
    media-src 'self' https: blob:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  response.headers.set('Content-Security-Policy', csp);

  // Check for age verification cookie
  const ageVerified = request.cookies.get('bg_age_verified')?.value === 'true';

  // Paths that don't require age verification
  const publicPaths = [
    '/api/age-verification',
    '/api/health',
  ];

  const isPublicPath = publicPaths.some(p => path.startsWith(p));

  // If accessing API, allow through (age check handled by components)
  if (path.startsWith('/api/')) {
    return response;
  }

  // Add age verification header for client components
  response.headers.set('X-Age-Verified', ageVerified ? 'true' : 'false');

  // Log access (for audit)
  const userAgent = request.headers.get('user-agent') || '';
  console.log(`[ACCESS] ${new Date().toISOString()} - ${ip} - ${path} - ${userAgent.slice(0, 50)}`);

  return response;
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
