import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Every route under /admin (except /admin/login) requires a valid,
// server-verified NextAuth session. This runs on the server for every
// request — the admin UI is never protected by client-side checks alone.
export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/admin/((?!login).*)"],
};
