import { NextResponse } from "next/server"
import { checkKVHealth, checkDataKeys } from "@/lib/kv-data"

export async function GET() {
  const startTime = Date.now()

  try {
    // ── Check KV connection ─────────────────────────────────────────────────
    const kvHealth = await checkKVHealth()
    const dataKeys = kvHealth.configured ? await checkDataKeys() : {}

    const healthy = kvHealth.ok

    const response = {
      status: healthy ? "healthy" : (kvHealth.configured ? "degraded" : "no_kv"),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        unit: "MB",
      },
      checks: {
        kvConfigured: kvHealth.configured,
        kvConnected: kvHealth.ok,
        kvLatencyMs: kvHealth.latencyMs,
        dataKeys,
      },
      hint: !kvHealth.configured
        ? "KV store is not configured. Please create a Vercel KV store and link it to this project. The site will use seed data as fallback."
        : undefined,
      responseTime: `${Date.now() - startTime}ms`,
    }

    return NextResponse.json(response, {
      status: healthy ? 200 : 200, // Always 200 so the health endpoint itself doesn't fail
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        responseTime: `${Date.now() - startTime}ms`,
      },
      { status: 503 }
    )
  }
}
