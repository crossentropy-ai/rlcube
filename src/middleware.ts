import { NextResponse } from 'next/server';

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8000';

export const config = {
  matcher: '/api/solve',
};

export function middleware(req: Request) {
  const url = new URL(req.url);
  if (url.pathname === '/api/solve') {
    return NextResponse.rewrite(`${API_HOST}/solve`);
  }
  return NextResponse.next();
}
