import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Custom fetch with a short timeout so the proxy never hangs
// when Supabase is temporarily unreachable (e.g. cold start, flaky network).
const FETCH_TIMEOUT_MS = 2000;

function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  return fetch(input, { ...init, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Only run the Supabase auth check on protected/auth routes to avoid
  // slowing down every public page request.
  const { pathname } = request.nextUrl;
  const isProtected = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/login";

  if (!isProtected && !isLoginPage) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { fetch: fetchWithTimeout },
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protect /admin — redirect to login if not authenticated
    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from /login
    if (isLoginPage && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  } catch (err) {
    // Network timeout or Supabase unreachable — fail open on public routes,
    // fail closed (→ login) on protected routes.
    // AbortError is expected when the timeout fires — don't pollute logs.
    const isAbort = (err as Error).name === "AbortError";
    if (!isAbort) {
      console.warn("[proxy] Supabase auth check failed:", (err as Error).message);
    }
    if (isProtected) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  // Only run proxy on admin and login routes — NOT on every request
  matcher: ["/admin/:path*", "/login"],
};
