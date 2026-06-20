import { NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { verifyAuth } from "@/lib/auth-helpers";

export async function POST(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request);
    if (!authenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");

    const origExt = file.name.split(".").pop() || "jpg";
    const uniqueFilename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${origExt}`;

    if (!env.IMAGES) {
      return NextResponse.json({ success: false, error: "Storage not configured" }, { status: 500 });
    }
    await env.IMAGES.put(uniqueFilename, base64);

    return NextResponse.json({
      success: true,
      url: `/api/uploads/${uniqueFilename}`
    });
  } catch (error: any) {
    console.error("[Upload API] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}
