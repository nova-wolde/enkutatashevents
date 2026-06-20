import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import os from "os";

const UPLOAD_DIR = path.join(os.tmpdir(), "enkutatash-uploads");

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  const { filename } = await params;
  const filePath = path.join(UPLOAD_DIR, ...filename);

  if (!filePath.startsWith(UPLOAD_DIR)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const mime: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };

  const buffer = await readFile(filePath);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
