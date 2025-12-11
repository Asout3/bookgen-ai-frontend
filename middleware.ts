import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  const pathname = request.nextUrl.pathname;
  
  // Allow access to public routes
  const publicRoutes = ["/login", "/auth", "/share"];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route)) || 
                       pathname === "/" ||
                       pathname.startsWith("/api/");
  
  if (isPublicRoute) {
    // Redirect to home if logged in and trying to access login
    if (pathname === "/login" && session?.user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
  
  // Protect all other routes
  if (!session?.user) {
    return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};