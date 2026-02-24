import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  if (host.includes('railway.app')) {
    const url = request.nextUrl.clone();
    url.host = 'fiche-haccp.fr';
    url.port = '';
    url.protocol = 'https';
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}
