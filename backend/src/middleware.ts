import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminEdge } from "@/lib/edge-auth";

// Explicit CORS helper within middleware to ensure headers are always present
function setCorsHeaders(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return res;
}

export function middleware(req: NextRequest) {
  console.log(`[MIDDLEWARE] ${req.method} ${req.nextUrl.pathname}`);

  // 1. Handle Preflight Request (OPTIONS)
  if (req.method === "OPTIONS") {
    console.log(`[MIDDLEWARE] Handling OPTIONS for ${req.nextUrl.pathname}`);
    return setCorsHeaders(new NextResponse(null, { status: 200 }));
  }

  // 2. Admin Authorization Check
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    // Only check auth if NOT a login/register request (though admin usually doesn't have register)
    // admin/login is public
    if (!req.nextUrl.pathname.includes("/login")) {
      const user = verifyAdminEdge(req);

      if (!user || user.role !== "admin") {
        return setCorsHeaders(
          NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
          )
        );
      }
    }
  }

  // 3. Continue request & add CORS to response
  const res = NextResponse.next();
  return setCorsHeaders(res);
}

export const config = {
  matcher: ["/api/:path*"],
};
