import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Dashboard protection - check for authToken
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const authToken = request.cookies.get("authToken")?.value
    console.log("[v0] Middleware check - Dashboard access, token present:", !!authToken)

    // If no token in cookies, redirect to login
    if (!authToken) {
      console.log("[v0] No auth token found, redirecting to login")
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
