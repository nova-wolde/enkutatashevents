let meowdisFetch: ((req: Request) => Promise<Response>) | null = null

export function setMeowdisFetch(fn: (req: Request) => Promise<Response>): void {
  meowdisFetch = fn
}

async function doFetch(cmd: string[]): Promise<unknown> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    throw new Error("Redis not configured")
  }

  const body = JSON.stringify(cmd)

  if (meowdisFetch) {
    const req = new Request("https://meowdis/", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body,
    })
    const res = await meowdisFetch(req)
    const data = await res.json<{ result: unknown; error?: string }>()
    if (data.error) throw new Error(data.error)
    return data.result
  }

  // Fallback: direct fetch (for local dev or when binding isn't available)
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Redis error (${res.status}): ${text}`)
  }
  const data = await res.json<{ result: unknown; error?: string }>()
  if (data.error) throw new Error(data.error)
  return data.result
}

export const meowdis = {
  ping: () => doFetch(["PING"]),
  get: async <T>(key: string): Promise<T | null> => {
    const raw = await doFetch(["GET", key])
    if (raw === null || raw === undefined) return null
    if (typeof raw !== "string") return raw as T
    try {
      return JSON.parse(raw) as T
    } catch {
      return raw as T
    }
  },
  set: (key: string, value: unknown, opts?: { ex?: number }) => {
    const args = ["SET", key, typeof value === "string" ? value : JSON.stringify(value)]
    if (opts?.ex) args.push("EX", String(opts.ex))
    return doFetch(args)
  },
  del: (key: string) => doFetch(["DEL", key]),
  incr: (key: string) => doFetch(["INCR", key]) as Promise<number>,
  expire: (key: string, seconds: number) => doFetch(["EXPIRE", key, String(seconds)]),
  ttl: (key: string) => doFetch(["TTL", key]) as Promise<number>,
  exists: (...keys: string[]) => doFetch(["EXISTS", ...keys]) as Promise<number>,
}
