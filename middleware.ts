import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Sadece /panel rotasını ve alt rotalarını koru
  if (pathname.startsWith('/panel')) {
    const adminSession = request.cookies.get('admin_session')

    // Eğer admin_session çerezi yoksa, ana sayfaya yönlendir
    if (!adminSession || adminSession.value !== 'active') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

// Sadece ilgili rotalarda çalışması için matcher ekliyoruz
export const config = {
  matcher: ['/panel/:path*'],
}
