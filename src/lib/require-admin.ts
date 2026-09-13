import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

/**
 * Every admin-only API route calls this first. It re-verifies the session
 * on the server regardless of what the client sent — middleware.ts already
 * blocks page navigation, but API routes are checked independently here so
 * that a request crafted outside the browser can't skip authorization.
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true as const, session };
}
