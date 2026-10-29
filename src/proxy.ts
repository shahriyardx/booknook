import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";

// Optimistic check: no session cookie -> go to login, then come back.
export function proxy(req: NextRequest) {
  if (getSessionCookie(req)) return NextResponse.next();
  const url = new URL("/login", req.url);
  url.searchParams.set("redirect", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/add-book", "/my-books", "/my-borrows", "/profile", "/books/:id"],
};
