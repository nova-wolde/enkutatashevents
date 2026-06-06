/**
 * Production server for Enkutatash Events
 *
 * With Next.js "output: standalone", the build generates a self-contained
 * server at .next/standalone/server.js.  This wrapper starts that server
 * and ensures the required symlinks / copies (public, data, .env) are
 * present inside the standalone directory.
 *
 * Features:
 * - Graceful shutdown (SIGTERM/SIGINT)
 * - Unhandled rejection / exception handlers
 * - PID file tracking
 * - Automatic asset syncing
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const STANDALONE = path.join(ROOT, '.next', 'standalone');
const PID_FILE = '/tmp/enkutatash-server.pid';
const LOG_FILE = '/tmp/enkutatash-server.log';
const PORT = process.env.PORT || '3000';

// ── Global Error Handlers ─────────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Promise Rejection:', reason);
  // Don't exit — log and continue. The child process handles the actual server.
});

process.on('uncaughtException', (error) => {
  console.error('[FATAL] Uncaught Exception:', error);
  // For uncaught exceptions, attempt graceful shutdown
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

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
    try {
      if (fs.lstatSync(standaloneStatic).isSymbolicLink()) {
        const target = fs.readlinkSync(standaloneStatic);
        if (target !== rootStatic) {
          fs.unlinkSync(standaloneStatic);
          fs.symlinkSync(rootStatic, standaloneStatic);
        }
      }
    } catch {
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

// ── Child process reference ───────────────────────────────────────────────
let childProcess = null;

// ── Graceful shutdown ─────────────────────────────────────────────────────
function gracefulShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);

  if (childProcess && childProcess.pid) {
    try {
      process.kill(childProcess.pid, 'SIGTERM');
      console.log(`[Server] Sent SIGTERM to child (PID ${childProcess.pid})`);

      // Force kill after 10 seconds if child hasn't exited
      const forceKillTimer = setTimeout(() => {
        try {
          process.kill(childProcess.pid, 'SIGKILL');
          console.log('[Server] Force-killed child process');
        } catch {}
      }, 10000);

      childProcess.on('exit', () => {
        clearTimeout(forceKillTimer);
        console.log('[Server] Child process exited');
        cleanupAndExit(0);
      });
    } catch {
      cleanupAndExit(0);
    }
  } else {
    cleanupAndExit(0);
  }
}

function cleanupAndExit(code) {
  try { fs.unlinkSync(PID_FILE); } catch {}
  process.exit(code);
}

// ── Register shutdown signals ─────────────────────────────────────────────
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ── Start the standalone server ──────────────────────────────────────────
function startServer() {
  ensureStandaloneAssets();
  killPrevious();

  const logStream = fs.openSync(LOG_FILE, 'a');

  childProcess = spawn('node', [path.join(STANDALONE, 'server.js')], {
    cwd: STANDALONE,
    env: { ...process.env, PORT, NODE_ENV: 'production', HOSTNAME: '0.0.0.0' },
    detached: true,
    stdio: ['ignore', logStream, logStream],
  });

  fs.writeFileSync(PID_FILE, String(childProcess.pid));

  childProcess.on('error', (err) => {
    console.error('[Server] Failed to start child process:', err);
    cleanupAndExit(1);
  });

  childProcess.on('exit', (code, signal) => {
    console.log(`[Server] Child process exited with code ${code}, signal ${signal}`);
    // Don't auto-restart here — PM2 or watchdog handles that
  });

  childProcess.unref();

  console.log(`Standalone server started (PID ${childProcess.pid}) on port ${PORT}`);
  console.log(`Logs: ${LOG_FILE}`);
}

startServer();
