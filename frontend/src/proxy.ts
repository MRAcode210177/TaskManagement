import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { TOKEN_COOKIE } from '@/lib/constants';

/**
 * A FAST check only: is there a login cookie?
 * The real checks are in the layouts (requireRole) and in Laravel.
 * We do NOT redirect away from /login here. A stale cookie would cause a loop.
 */
export function proxy(request: NextRequest) {
  if (!request.cookies.has(TOKEN_COOKIE)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/member/:path*'],
};
