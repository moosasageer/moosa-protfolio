import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

/**
 * Local-disk file storage.
 *
 * This is the simplest thing that works for a single-server deploy or local
 * development, and needs zero external accounts to try the project. It is
 * NOT durable on ephemeral/serverless hosts (e.g. Vercel's filesystem resets
 * on every deploy) — for production, swap this for Supabase Storage or S3.
 * See README.md → "Cloud file storage" for the drop-in replacement; only
 * this file needs to change, since every consumer just stores/reads a URL.
 */

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED_TYPES[file.type]) {
    return NextResponse.json({ error: "Only JPG, PNG and WEBP images are supported." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File is too large (max 8MB)." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const id = crypto.randomBytes(8).toString("hex");
  const filename = `${id}.webp`;
  const filePath = path.join(uploadsDir, filename);

  // Re-encode to webp and cap dimensions — keeps the media library light
  // and normalizes whatever format was uploaded.
  const optimized = await sharp(buffer)
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  await writeFile(filePath, optimized);

  const url = `/api/uploads/${filename}`;
  const media = await prisma.media.create({
    data: {
      url,
      filename: file.name,
      mimeType: "image/webp",
      size: optimized.byteLength,
    },
  });

  return NextResponse.json(media, { status: 201 });
}
