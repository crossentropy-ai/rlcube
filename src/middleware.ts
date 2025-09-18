import { NextResponse } from 'next/server';

export const config = {
  matcher: '/api/solve',
};

export function middleware(req: Request) {
  const url = new URL(req.url);
  if (url.pathname === '/api/solve') {
    return NextResponse.rewrite('http://localhost:8000/solve');
  }
  return NextResponse.next();
}
