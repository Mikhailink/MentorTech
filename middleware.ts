import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;
  if (path.startsWith("/dashboard")) {
    if (!token) return NextResponse.redirect(new URL("/auth/login", req.url));
    if (token.role === "mentee" && token.isMinor && !token.isGuardianApproved) {
      return NextResponse.redirect(new URL("/app/waiting-approval", req.url));
    }
    const rolePath: Record<string, string> = {
      mentee: "/dashboard/mentee",
      mentor: "/dashboard/mentor",
      guardian: "/dashboard/guardian"
    };
    const expected = rolePath[String(token.role)];
    if (expected && path === "/dashboard") return NextResponse.redirect(new URL(expected, req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*"] };