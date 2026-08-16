import { type NextRequest, NextResponse } from 'next/server';
import { accessTokenKey } from '@/lib/constants';

export const config = {
  matcher: ['/((?!spotify/callback|spotify/authenticate|_next).*)'],
};

export function proxy(request: NextRequest) {
  const accessToken = request.cookies.get(accessTokenKey)?.value;

  if (accessToken && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!accessToken && !request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Otherwise, allow through
  return NextResponse.next();
}
