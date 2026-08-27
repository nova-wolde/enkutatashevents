/**
 * Local Redis-REST shim — implements the subset of the Upstash REST API that
 * Enkutatash Events uses, backed by an in-memory Map with optional JSON file
 * persistence.
 *
 * Contract (same as @upstash-frontend REST):
 *   POST /            body: ["GET", key] or ["SET", key, value, "EX", "123"] ...
 *   Headers:          Authorization: Bearer <token>
 *   Response:         {"result": <value>}
 *
 * Commands implemented: PING GET MGET SET DEL INCR EXPIRE TTL EXISTS KEYS
 *                       SCAN TYPE INCRBY SETEX GETDEL
 *
 * Usage:
 *   node scripts/local-redis-rest-shim.mjs [port]
 * Env:
 *   SHIM_TOKEN   (default local-dev-shim-token)
 *   SHIM_DATA    (default ./db/shim-data.json)
 */

import http from "node:http"
import fs from "node:fs"
import path from "node:path"

const PORT = Number(process.argv[2] || process.env.SHIM_PORT || 8379)
const TOKEN = process.env.SHIM_TOKEN || "local-dev-shim-token"
const DATA_FILE = process.env.SHIM_DATA || path.resolve("db/shim-data.json")

/** store: Map<string, string> ; expires: Map<string, epochMs> */
const store = new Map()
const expires = new Map()

// ── persistence ──────────────────────────────────────────────────────────────
function loadPersisted() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"))
      for (const [k, v] of Object.entries(raw.store || {})) store.set(k, v)
      for (const [k, t] of Object.entries(raw.expires || {})) {
        if (t > Date.now()) expires.set(k, t)
        else store.delete(k)
      }
      console.log(`[shim] loaded ${store.size} keys from ${DATA_FILE}`)
    }
  } catch (e) {
    console.warn("[shim] failed to load persisted data:", e.message)
  }
}

let saveTimer = null
function scheduleSave() {
  if (saveTimer) return
  saveTimer = setTimeout(() => {
    saveTimer = null
    try {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
      const out = {
        store: Object.fromEntries(store),
        expires: Object.fromEntries(expires),
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(out))
    } catch (e) {
      console.warn("[shim] save failed:", e.message)
    }
  }, 250)
}

// ── command handling ─────────────────────────────────────────────────────────
function sweep(key) {
  const t = expires.get(key)
  if (t !== undefined && t <= Date.now()) {
    expires.delete(key)
    store.delete(key)
  }
}

function execute(cmd) {
  const op = String(cmd[0] || "").toUpperCase()
  switch (op) {
    case "PING":
      return "PONG"
    case "GET": {
      sweep(cmd[1])
      return store.has(cmd[1]) ? store.get(cmd[1]) : null
    }
    case "MGET":
      return cmd.slice(1).map((k) => {
        sweep(k)
        return store.has(k) ? store.get(k) : null
      })
    case "SET": {
      const [key, value] = [cmd[1], cmd[2]]
      let i = 3
      while (i < cmd.length) {
        const flag = String(cmd[i]).toUpperCase()
        if (flag === "EX") {
          expires.set(key, Date.now() + Number(cmd[i + 1]) * 1000)
          i += 2
        } else if (flag === "PX") {
          expires.set(key, Date.now() + Number(cmd[i + 1]))
          i += 2
        } else break
      }
      store.set(key, value)
      return "OK"
    }
    case "SETEX":
      store.set(cmd[1], cmd[3])
      expires.set(cmd[1], Date.now() + Number(cmd[2]) * 1000)
      return "OK"
    case "GETDEL": {
      sweep(cmd[1])
      const v = store.get(cmd[1]) ?? null
      store.delete(cmd[1])
      return v
    }
    case "DEL": {
      let n = 0
      for (const k of cmd.slice(1)) {
        if (store.delete(k)) n++
        expires.delete(k)
      }
      return n
    }
    case "INCR":
    case "INCRBY": {
      const key = cmd[1]
      sweep(key)
      const by = op === "INCR" ? 1 : Number(cmd[2])
      const cur = parseInt(store.get(key) ?? "0", 10) || 0
      const next = cur + by
      store.set(key, String(next))
      return next
    }
    case "EXPIRE": {
      sweep(cmd[1])
      if (!store.has(cmd[1])) return 0
      expires.set(cmd[1], Date.now() + Number(cmd[2]) * 1000)
      return 1
    }
    case "TTL": {
      sweep(cmd[1])
      if (!store.has(cmd[1])) return -2
      const t = expires.get(cmd[1])
      return t === undefined ? -1 : Math.max(0, Math.round((t - Date.now()) / 1000))
    }
    case "EXISTS": {
      let n = 0
      for (const k of cmd.slice(1)) {
        sweep(k)
        if (store.has(k)) n++
      }
      return n
    }
    case "KEYS": {
      const pattern = cmd[1] === "*" ? null : globToRegex(cmd[1])
      const now = [...store.keys()]
      return now.filter((k) => {
        sweep(k)
        if (!store.has(k)) return false
        return pattern ? pattern.test(k) : true
      })
    }
    case "SCAN": {
      // SCAN cursor MATCH pattern COUNT n → return all in one page
      const matchIdx = cmd.findIndex((a) => String(a).toUpperCase() === "MATCH")
      const pattern =
        matchIdx > -1 && cmd[matchIdx + 1] !== "*" ? globToRegex(cmd[matchIdx + 1]) : null
      const keys = [...store.keys()].filter((k) => {
        sweep(k)
        return store.has(k) && (pattern ? pattern.test(k) : true)
      })
      return ["0", keys]
    }
    case "TYPE":
      return store.has(cmd[1]) ? "string" : "none"
    default:
      throw new Error(`ERR unknown command '${op}'`)
  }
}

function globToRegex(glob) {
  const esc = glob.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*").replace(/\?/g, ".")
  return new RegExp(`^${esc}$`)
}

// ── server ───────────────────────────────────────────────────────────────────
loadPersisted()

const server = http.createServer((req, res) => {
  const auth = req.headers.authorization || ""
  const isLocalOrBearer =
    auth === `Bearer ${TOKEN}` ||
    auth.startsWith("Basic ") // allow Upstash-style basic auth too

  if (req.method !== "POST" || !isLocalOrBearer) {
    res.writeHead(req.method !== "POST" ? 405 : 401, { "Content-Type": "application/json" })
    res.end(JSON.stringify({ error: req.method !== "POST" ? "WRONGMETHOD" : "UNAUTHORIZED" }))
    return
  }

  let body = ""
  req.on("data", (c) => (body += c))
  req.on("end", () => {
    let result, error
    try {
      const parsed = JSON.parse(body)
      const cmds = Array.isArray(parsed?.[0]?.[0]) ? parsed : [parsed] // pipeline support
      const results = []
      for (const c of cmds) {
        const r = execute(c)
        results.push(r)
        if (String(c[0]).toUpperCase().startsWith("SET") || String(c[0]).toUpperCase() === "INCR") scheduleSave()
      }
      result = cmds.length === 1 ? results[0] : results
    } catch (e) {
      error = e.message
    }

    if (error) {
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ error }))
    } else {
      scheduleSave()
      res.writeHead(200, { "Content-Type": "application/json" })
      res.end(JSON.stringify({ result }))
    }
  })
})

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[shim] Redis-REST shim listening on http://0.0.0.0:${PORT} (all interfaces)`)
  console.log(`[shim] token: ${TOKEN}`)
})
