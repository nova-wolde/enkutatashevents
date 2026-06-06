/**
 * Production server for Enkutatash Events
 *
 * With Next.js "output: standalone", the build generates a self-contained
 * server at .next/standalone/server.js.  This wrapper starts that server
 * and ensures the required symlinks / copies (public, data, .env) are
 * present inside the standalone directory.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const STANDALONE = path.join(ROOT, '.next', 'standalone');
const PID_FILE = '/tmp/enkutatash-server.pid';
const LOG_FILE = '/tmp/enkutatash-server.log';
const PORT = process.env.PORT || '3000';

// ── Ensure required assets exist inside the standalone directory ──────────
function ensureStandaloneAssets() {
  // Copy data directory if missing or stale
  const standaloneData = path.join(STANDALONE, 'data');
  const rootData = path.join(ROOT, 'data');
  if (fs.existsSync(rootData)) {
    if (!fs.existsSync(standaloneData)) {
      fs.mkdirSync(standaloneData, { recursive: true });
    }
    const files = fs.readdirSync(rootData);
    for (const file of files) {
      const src = path.join(rootData, file);
      const dst = path.join(standaloneData, file);
      fs.copyFileSync(src, dst);
    }
  }

  // Copy .env if missing
  const envSrc = path.join(ROOT, '.env');
  const envDst = path.join(STANDALONE, '.env');
  if (fs.existsSync(envSrc) && !fs.existsSync(envDst)) {
    fs.copyFileSync(envSrc, envDst);
  }

  // Ensure public directory is present (build script copies it, but double-check)
  const standalonePublic = path.join(STANDALONE, 'public');
  const rootPublic = path.join(ROOT, 'public');
  if (!fs.existsSync(standalonePublic) && fs.existsSync(rootPublic)) {
    fs.cpSync(rootPublic, standalonePublic, { recursive: true });
  }

  // Ensure .next/static symlink exists (standalone build omits static assets)
  const standaloneStatic = path.join(STANDALONE, '.next', 'static');
  const rootStatic = path.join(ROOT, '.next', 'static');
  if (fs.existsSync(rootStatic)) {
    // Remove existing symlink/dir if broken or wrong type
    try {
      if (fs.lstatSync(standaloneStatic).isSymbolicLink()) {
        // Already a symlink — verify it points to the right place
        const target = fs.readlinkSync(standaloneStatic);
        if (target !== rootStatic) {
          fs.unlinkSync(standaloneStatic);
          fs.symlinkSync(rootStatic, standaloneStatic);
        }
      } else {
        // It's a real directory — leave it (could be from a custom build step)
      }
    } catch {
      // Doesn't exist — create symlink
      fs.symlinkSync(rootStatic, standaloneStatic);
    }
  }
}

// ── Kill any previous instance ────────────────────────────────────────────
function killPrevious() {
  try {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'), 10);
    if (pid && Number.isFinite(pid)) {
      try {
        process.kill(pid, 0); // throws if not running
        console.log(`Killing previous server (PID ${pid})`);
        process.kill(pid, 'SIGTERM');
        // Give it a moment to die
        const deadline = Date.now() + 3000;
        while (Date.now() < deadline) {
          try { process.kill(pid, 0); } catch { break; }
        }
      } catch {
        // Already dead – just clean up
      }
    }
  } catch {
    // PID file doesn't exist
  }
  try { fs.unlinkSync(PID_FILE); } catch {}
}

// ── Start the standalone server ──────────────────────────────────────────
function startServer() {
  ensureStandaloneAssets();
  killPrevious();

  const logStream = fs.openSync(LOG_FILE, 'a');

  const child = spawn('node', [path.join(STANDALONE, 'server.js')], {
    cwd: STANDALONE,
    env: { ...process.env, PORT, NODE_ENV: 'production' },
    detached: true,
    stdio: ['ignore', logStream, logStream],
  });

  fs.writeFileSync(PID_FILE, String(child.pid));
  child.unref();

  console.log(`Standalone server started (PID ${child.pid}) on port ${PORT}`);
  console.log(`Logs: ${LOG_FILE}`);
}

startServer();
