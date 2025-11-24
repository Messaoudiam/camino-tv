import { NextResponse, type NextRequest } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

/**
 * Next.js Middleware
 * Protects admin routes only
 *
 * Note: Only runs on /admin/* routes (see matcher config)
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // Fetch session using Better Auth
    const { data: session } = await betterFetch<{
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }>("/api/auth/get-session", {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    // No session - redirect to login
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

/**
 * Only run middleware on admin routes
 */
export const config = {
  matcher: ["/admin/:path*"],
};
