import { NextResponse } from "next/server"
import { checkRedisHealth, checkDataKeys } from "@/lib/kv-data"

export async function GET() {
  const startTime = Date.now()

  try {
    const redisHealth = await checkRedisHealth()
    const dataKeys = redisHealth.configured ? await checkDataKeys() : {}

    const healthy = redisHealth.ok

    return NextResponse.json({
      status: healthy ? "healthy" : (redisHealth.configured ? "degraded" : "no_redis"),
      timestamp: new Date().toISOString(),
      uptime: Math.round((performance.now() / 1000) * 100) / 100,
      runtime: "cloudflare-workers",
      checks: {
        redisConfigured: redisHealth.configured,
        redisConnected: redisHealth.ok,
        redisLatencyMs: redisHealth.latencyMs,
        redisError: redisHealth.error,
        dataKeys,
      },
      responseTime: `${Date.now() - startTime}ms`,
    })
  } catch (error) {
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
      responseTime: `${Date.now() - startTime}ms`,
    }, { status: 503 })
  }
}
