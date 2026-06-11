#!/usr/bin/env node
/**
 * Daemon wrapper – starts the production server as a detached process.
 * Simply delegates to server.js which handles the standalone server.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const PID_FILE = '/tmp/enkutatash-server.pid';
const LOG_FILE = '/tmp/enkutatash-server.log';

// Kill previous if running
try {
  const pid = parseInt(fs.readFileSync(PID_FILE, 'utf8'), 10);
  try { process.kill(pid, 0); console.log(`Server already running (PID ${pid})`); process.exit(0); } catch {}
} catch {}

// Start via server.js
const logStream = fs.openSync(LOG_FILE, 'a');
const child = spawn('node', [path.join(__dirname, 'server.js')], {
  cwd: __dirname,
  env: { ...process.env, PORT: '3000' },
  detached: true,
  stdio: ['ignore', logStream, logStream],
});

fs.writeFileSync(PID_FILE, String(child.pid));
child.unref();

console.log(`Server daemonized (PID ${child.pid})`);
