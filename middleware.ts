
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtMiddleware } from '@/app/_helpers/server/jwt-middleware';
import { cookies } from 'next/headers';
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  try {
    // global middleware
    await jwtMiddleware(request);
  
    // route handler
    return NextResponse.json({ message: 'success' });
  } catch (err: any) {
    // global error handler
    if (typeof (err) === 'string') {
      // custom application error
      const is404 = err.toLowerCase().endsWith('not found');
      const status = is404 ? 404 : 400;
      return NextResponse.json({ message: err }, { status });
    }

    if (err.name === 'JsonWebTokenError') {
      // jwt error - delete cookie to auto logout
      (await cookies()).delete('authorization');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // default to 500 server error
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|).*)',
  ],
}