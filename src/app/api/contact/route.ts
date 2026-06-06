import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { verifyAuth } from "@/lib/auth-helpers";

// ─── Contact Submission Type ──────────────────────────────────────────────────
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string;
  message: string;
  createdAt: string;
  read: boolean;
}

// ─── Data File Path ───────────────────────────────────────────────────────────
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "contact-submissions.json");

async function getSubmissions(): Promise<ContactSubmission[]> {
  if (!existsSync(DATA_FILE)) return [];
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveSubmissions(submissions: ContactSubmission[]): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  await writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), "utf-8");
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validateBody(body: Record<string, unknown>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const name = body.name as string;
  const email = body.email as string;
  const message = body.message as string;

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Valid email is required");
  }
  if (!message || message.trim().length < 5) {
    errors.push("Message must be at least 5 characters");
  }

  return { valid: errors.length === 0, errors };
}

// ─── POST: Submit Contact Form ────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate
    const { valid, errors } = validateBody(body);
    if (!valid) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Create submission
    const submission: ContactSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: (body.name as string).trim(),
      email: (body.email as string).trim(),
      phone: ((body.phone as string) || "").trim(),
      eventType: ((body.eventType as string) || "").trim(),
      message: (body.message as string).trim(),
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Save to file
    const submissions = await getSubmissions();
    submissions.unshift(submission); // newest first
    await saveSubmissions(submissions);

    // Log for server-side visibility
    console.log(`[Contact Form] New submission from ${submission.name} (${submission.email})`);

    return NextResponse.json({
      success: true,
      message: "Thank you for reaching out! We'll get back to you within 24 hours.",
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("[Contact Form] Error processing submission:", error);
    return NextResponse.json(
      { success: false, errors: ["Something went wrong. Please try again later."] },
      { status: 500 }
    );
  }
}

// ─── GET: Fetch Submissions (auth required, for dashboard) ────────────────────
export async function GET(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request);
    if (!authenticated) {
      return NextResponse.json({ submissions: [] }, { status: 401 });
    }
    const submissions = await getSubmissions();
    return NextResponse.json({ submissions });
  } catch {
    return NextResponse.json({ submissions: [] });
  }
}

// ─── PATCH: Mark as Read (auth required) ──────────────────────────────────────
export async function PATCH(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request);
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 });
    }

    const body = await request.json();
    const { id, read } = body as { id: string; read: boolean };

    const submissions = await getSubmissions();
    const index = submissions.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, errors: ["Submission not found"] },
        { status: 404 }
      );
    }

    submissions[index].read = read;
    await saveSubmissions(submissions);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, errors: ["Failed to update"] },
      { status: 500 }
    );
  }
}

// ─── DELETE: Remove Submission (auth required) ────────────────────────────────
export async function DELETE(request: Request) {
  try {
    const { authenticated } = await verifyAuth(request);
    if (!authenticated) {
      return NextResponse.json({ success: false, errors: ["Unauthorized"] }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body as { id: string };

    const submissions = await getSubmissions();
    const filtered = submissions.filter((s) => s.id !== id);
    await saveSubmissions(filtered);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, errors: ["Failed to delete"] },
      { status: 500 }
    );
  }
}
