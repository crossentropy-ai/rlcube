import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000';

export const config = {
  matcher: '/api/solve',
};

export function middleware(req: Request) {
  const url = new URL(req.url);
  if (url.pathname === '/api/solve') {
    return NextResponse.rewrite(`${API_BASE_URL}/solve`);
  }
  return NextResponse.next();
}
