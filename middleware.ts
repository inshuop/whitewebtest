import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  // Only run middleware on /admin pages
  matcher: ["/admin/:path*"],
};

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // Skip middleware for API routes and Next.js static files
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/_next") || url.pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  // Get the session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Allow access to login page without token
  if (url.pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Redirect to login if accessing admin pages without a valid token
  if (!token && url.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Allow request to proceed if token exists or not an admin page
  return NextResponse.next();
}
