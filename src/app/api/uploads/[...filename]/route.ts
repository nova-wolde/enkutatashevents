import { NextResponse } from "next/server";
import { env } from "cloudflare:workers";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  const { filename } = await params;
  const key = filename.join("/");

  if (!env.IMAGES) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 500 });
  }
  const base64 = await env.IMAGES.get(key);
  if (!base64) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ext = key.split(".").pop()?.toLowerCase() || "";
  const mimeType = MIME[ext] || "application/octet-stream";

  const buffer = Buffer.from(base64, "base64");
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
