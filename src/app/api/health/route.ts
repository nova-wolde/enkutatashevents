import { NextResponse } from "next/server"
import { existsSync } from "fs"
import path from "path"

export async function GET() {
  const startTime = Date.now()

  try {
    // ── Check data directory accessibility ──────────────────────────────────
    const dataDir = path.join(process.cwd(), "data")
    const dataDirExists = existsSync(dataDir)

    // ── Check critical files ────────────────────────────────────────────────
    const criticalFiles = [
      "sessions.json",
      "site-content.json",
      "events.json",
    ]

    const fileStatuses: Record<string, boolean> = {}
    for (const file of criticalFiles) {
      fileStatuses[file] = existsSync(path.join(dataDir, file))
    }

    const allCriticalFilesExist = Object.values(fileStatuses).every(Boolean)
    const healthy = dataDirExists && allCriticalFilesExist

    const response = {
      status: healthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
        unit: "MB",
      },
      checks: {
        dataDir: dataDirExists,
        files: fileStatuses,
      },
      responseTime: `${Date.now() - startTime}ms`,
    }

    return NextResponse.json(response, {
      status: healthy ? 200 : 503,
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
