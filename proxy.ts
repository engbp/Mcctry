import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

const AUTH_ROUTES = ["/login", "/signup", "/auth/confirm", "/auth/reset-password", "/auth/update-password"];
const PROTECTED_PREFIXES = ["/dashboard", "/admin"];

function isProtected(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    if (isProtected(pathname)) {
      const login = new URL("/login", request.url);
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
    return response;
  }

  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // getClaims validates the signed JWT locally (using the cached JWKS for
  // asymmetric signing keys) and refreshes an expiring session when needed.
  // Unlike getUser(), it avoids a network round-trip to Supabase Auth on the
  // normal request path.
  const { data: claimsData } = await supabase.auth.getClaims();
  const user = claimsData?.claims;

  if (isProtected(pathname) && !user) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (user && AUTH_ROUTES.includes(pathname)) {
    const next = request.nextUrl.searchParams.get("next");
    if (pathname === "/login" || pathname === "/signup") {
      return NextResponse.redirect(new URL(next && next.startsWith("/") ? next : "/dashboard", request.url));
    }
  }

  return response;
}

// The proxy is only needed for routes that actually use Supabase auth. Keeping
// it off the public catalogue avoids an Auth request on every public page.
export const config = {
  matcher: [
    "/login",
    "/signup",
    "/auth/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/admin",
    "/admin/:path*",
  ],
};
