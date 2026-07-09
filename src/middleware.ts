import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  let supabaseResponse = NextResponse.next({ request })

  // Security headers
  const headers = supabaseResponse.headers
  headers.set("X-Frame-Options", "DENY")
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'none'; form-action 'self'"
  )

  // Maintenance mode
  if (process.env.MAINTENANCE_MODE === "true" && pathname !== "/maintenance") {
    return NextResponse.redirect(new URL("/maintenance", request.url))
  }

  // Rate limiting on auth routes (skip error redirects)
  const authPaths = ["/login", "/register"]
  if (authPaths.some((p) => pathname === p) && !request.nextUrl.searchParams.has("error")) {
    const ip = request.headers.get("x-forwarded-for") ?? "unknown"
    if (!checkRateLimit(ip)) {
      return NextResponse.redirect(new URL("/login?error=too_many_attempts", request.url))
    }
  }

  // Referral code tracking
  const ref = request.nextUrl.searchParams.get("ref")
  if (ref && /^[A-Z0-9]{6,12}$/.test(ref)) {
    supabaseResponse.cookies.set("referral_code", ref, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  }

  // Auth check
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const protectedPaths = ["/checkout", "/cart", "/notifications", "/affiliate"]
  const rolePaths = ["/vendor", "/admin", "/moderator"]

  // Auth check: must be logged in
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(url)
  }

  // Ban check + role check for all authenticated users
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_banned")
      .eq("id", user.id)
      .single()

    // Ban check — redirect banned users away from everything except /banned
    if (profile?.is_banned && pathname !== "/banned") {
      return NextResponse.redirect(new URL("/banned", request.url))
    }

    const role = profile?.role

    // Role-based access
    if (rolePaths.some((p) => pathname.startsWith(p))) {
      if (pathname.startsWith("/vendor") && role !== "vendor" && role !== "admin") {
        return NextResponse.redirect(new URL("/profile", request.url))
      }
      if (pathname.startsWith("/moderator") && role !== "moderator" && role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
      if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  }

  if (authPaths.some((p) => pathname.startsWith(p)) && user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
