import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validation";

// Simple in-memory rate limit: 5 submissions per IP per 10 minutes.
// For multi-instance production deploys, replace with a shared store
// (e.g. Upstash Redis) — see README "Rate limiting in production".
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(ip, timestamps);
  return timestamps.length > MAX_HITS;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  if (!json) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const parsed = messageSchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return NextResponse.json({ error: "Please fix the highlighted fields.", fieldErrors }, { status: 400 });
  }

  // Honeypot tripped → silently pretend success so bots don't learn.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, subject, message } = parsed.data;
  await prisma.message.create({ data: { name, email, subject, message } });

  return NextResponse.json({ ok: true });
}
