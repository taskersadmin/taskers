import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes protection
    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    // Tasker routes protection
    if (path.startsWith("/tasker") && !path.startsWith("/tasker/login")) {
      if (token?.role !== "TASKER") {
        return NextResponse.redirect(new URL("/tasker/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Allow public customer routes
        if (!req.nextUrl.pathname.startsWith("/admin") && 
            !req.nextUrl.pathname.startsWith("/tasker")) {
          return true
        }
        if (req.nextUrl.pathname === "/tasker/login" || 
            req.nextUrl.pathname === "/admin/login") {
          return true
        }
        return token !== null
      },
    },
  }
)

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
