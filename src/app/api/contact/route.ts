import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-helpers";
import { getContactSubmissions, saveContactSubmissions, type ContactSubmission } from "@/lib/kv-data";

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

    // Save to KV
    const submissions = await getContactSubmissions();
    submissions.unshift(submission); // newest first
    await saveContactSubmissions(submissions);

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
    const submissions = await getContactSubmissions();
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

    const submissions = await getContactSubmissions();
    const index = submissions.findIndex((s) => s.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, errors: ["Submission not found"] },
        { status: 404 }
      );
    }

    submissions[index].read = read;
    await saveContactSubmissions(submissions);

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

    const submissions = await getContactSubmissions();
    const filtered = submissions.filter((s) => s.id !== id);
    await saveContactSubmissions(filtered);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, errors: ["Failed to delete"] },
      { status: 500 }
    );
  }
}
