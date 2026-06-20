import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import os from "os";
import { verifyAuth } from "@/lib/auth-helpers";

const UPLOAD_DIR = path.join(os.tmpdir(), "enkutatash-uploads");

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
    const buffer = Buffer.from(bytes);

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const origExt = path.extname(file.name) || ".jpg";
    const uniqueFilename = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${origExt}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);

    await writeFile(filePath, buffer);

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
