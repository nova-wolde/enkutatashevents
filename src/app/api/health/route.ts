import { NextResponse } from "next/server"
import { checkRedisHealth, checkDataKeys } from "@/lib/kv-data"

export async function GET() {
  const startTime = Date.now()

  try {
    // ── Check Redis connection ──────────────────────────────────────────────
    const redisHealth = await checkRedisHealth()
    const dataKeys = redisHealth.configured ? await checkDataKeys() : {}

    const healthy = redisHealth.ok

    const response = {
      status: healthy ? "healthy" : (redisHealth.configured ? "degraded" : "no_redis"),
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        unit: "MB",
      },
      checks: {
        redisConfigured: redisHealth.configured,
        redisConnected: redisHealth.ok,
        redisLatencyMs: redisHealth.latencyMs,
        dataKeys,
      },
      hint: !redisHealth.configured
        ? "Upstash Redis is not configured. Please create a free Upstash Redis database and add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN to your environment variables. The site will use seed data as fallback."
        : undefined,
      responseTime: `${Date.now() - startTime}ms`,
    }

    return NextResponse.json(response, {
      status: 200,
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
